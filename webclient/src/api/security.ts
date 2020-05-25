import { Event, EventMeta } from '../interfaces'

interface EncryptedEventMeta extends EventMeta, AesGcmParams {
}

interface EncryptedEvent extends Event {
  meta: EncryptedEventMeta;
  data: string;
}

const encode = (plaintext: string) => new TextEncoder().encode(plaintext);
const decode = (encoded: ArrayBuffer) => new TextDecoder().decode(encoded);

export const encryptEvent = async (secretKey: CryptoKey, event: Event): Promise<EncryptedEvent> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(96));
  const encodedEvent = encode(JSON.stringify(event));
  const encryptedEventMeta: EncryptedEventMeta = {
    e: "MESSAGE_ENCRYPTED",
    ts: new Date().getTime(),
    name: "AES-GCM",
    iv
  }
  const encryptedEventData = await window.crypto.subtle.encrypt(encryptedEventMeta, secretKey, encodedEvent);
  const encryptedEvent: EncryptedEvent = {
    meta: encryptedEventMeta,
    data: decode(encryptedEventData)
  }

  return encryptedEvent;
}

export const decryptEvent = async (secretKey: CryptoKey, { meta, data }: EncryptedEvent): Promise<Event> => {
  const decryptedEvent = await window.crypto.subtle.decrypt(meta, secretKey, encode(data));
  const eventJsonString = decode(decryptedEvent);
  return JSON.parse(eventJsonString);
}
