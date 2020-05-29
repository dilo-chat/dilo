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
  message: WebSocketLikeEventListener<'message'>[];
}

class SecureConnection implements WebSocketLike {
  readonly url: string;

  private connection: WebSocket;

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

  }

  private onclose(event: WebSocketEventMap['close']) {

  }

  private onerror(event: WebSocketEventMap['error']) {

  }

  private onmessage(event: WebSocketEventMap['message']) {

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

  async send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): Promise<void> {
    this.connection.send(data);
  }
}
