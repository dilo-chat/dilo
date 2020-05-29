type WebSocketLikeEventListener<K extends "close" | "error" | "message" | "open"> = (ev: WebSocketEventMap[K]) => any;

interface WebSocketLike {
  readyState: number;
  url: string;
  addEventListener<K extends "close" | "error" | "message" | "open">(type: K, listener: WebSocketLikeEventListener<K>): void;
  removeEventListener<K extends "close" | "error" | "message" | "open">(type: K, listener: WebSocketLikeEventListener<K>): void;
}

type Listeners = {
  open: WebSocketLikeEventListener<'open'>[];
  close: WebSocketLikeEventListener<'close'>[];
  error: WebSocketLikeEventListener<'error'>[];
  message: ((event: Event) => void)[];
}

import { generateKey, encryptEvent, decryptEvent, deriveSecretKey } from './security'
import { buildEvent, encodePayload, decodePayload } from './eventEmitter'
import { Event, EncryptedEvent, SecurityKeysExchangeEvent } from '../interfaces';


export class SecureConnection implements WebSocketLike {
  readonly url: string;

  private connection: WebSocket;
  private keyPair: CryptoKeyPair | null = null;
  private secretKey: CryptoKey | null = null;

  private listeners: Listeners = {
    open: [],
    close: [],
    error: [],
    message: [],
  }

  get readyState() {
    return this.connection.readyState;
  }

  constructor(url: string) {
    this.url = url;
    this.connection = new WebSocket(this.url);

    this.listen();
  }

  private listen() {
    this.connection.addEventListener('open', this.onopen);
    this.connection.addEventListener('close', this.onclose);
    this.connection.addEventListener('error', this.onerror);
    this.connection.addEventListener('message', this.onmessage);
  }

  private onopen(event: WebSocketEventMap['open']) {
    this.startKeysExchange();
  }

  private async startKeysExchange() {
    this.keyPair = await generateKey();

    const keysExchangeEvent = buildEvent('SECURITY_KEYS_EXCHANGE', {
      publicKey: this.keyPair.publicKey
    });
    this.connection.send(encodePayload(keysExchangeEvent));
  }

  private async finishKeysExchange({ data }: SecurityKeysExchangeEvent) {
    if (!this.keyPair) {
      throw new Error('Received a public key but no keys exchange has started');
    }

    this.secretKey = await deriveSecretKey(this.keyPair.privateKey, data.publicKey);
  }

  private onclose(event: WebSocketEventMap['close']) {

  }

  private onerror(event: WebSocketEventMap['error']) {

  }

  private async onmessage(event: WebSocketEventMap['message']) {
    const serverEvent: Event = decodePayload(event.data);
    const receivedEventType = serverEvent.meta.e;
    if (receivedEventType == 'SECURITY_KEYS_EXCHANGE') {
      return this.finishKeysExchange(serverEvent as SecurityKeysExchangeEvent)
    }

    if (receivedEventType == 'SECURITY_MESSAGE_EXCHANGE') {
      if (!this.secretKey) {
        throw new Error('Received encrypted message but keys exchange is not finished');
      }

      const decryptedEvent = await decryptEvent(this.secretKey, serverEvent as EncryptedEvent);
      this.notifyEvent(decryptedEvent);
    }

    throw new Error(`Received unsupported event "${receivedEventType}"`);
  }

  notifyEvent(event: Event) {
    this.listeners.message.forEach(listener => listener(event))
  }

  addEventListener<K extends "close" | "error" | "message" | "open">(type: K, listener: WebSocketLikeEventListener<K>): void {
    Array.prototype.push.apply(this.listeners[type], [listener]);
  }

  removeEventListener<K extends "close" | "error" | "message" | "open">(type: K, listener: WebSocketLikeEventListener<K>): void {
    const listeners = this.listeners[type];
    const listenerIndex = Array.prototype.findIndex.apply(listeners, [listener]);
    if (listenerIndex > -1) {
        Array.prototype.splice.apply(listeners, [listenerIndex, 1]);
    }
  }

  close(code?: number | undefined, reason?: string | undefined): void {
    this.connection.close(code, reason);
  }

  async send(event: Event): Promise<void> {
    if (!this.secretKey) {
      throw new Error('Tried to send event but keys exchange is not finished')
    }
    const encryptedEvent = await encryptEvent(this.secretKey, event);
    this.connection.send(encodePayload(encryptedEvent));
  }
}
