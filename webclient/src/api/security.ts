import { Event, EventMeta } from '../interfaces'
import env from '../helpers/env';

interface EncryptedEventMeta extends EventMeta, AesGcmParams {
}

interface EncryptedEvent extends Event {
  meta: EncryptedEventMeta;
  data: string;
}

const encode = (plaintext: string) => new TextEncoder().encode(plaintext);
const decode = (encoded: ArrayBuffer) => new TextDecoder().decode(encoded);

export const encryptEvent = async (secretKey: CryptoKey, event: Event): Promise<EncryptedEvent> => {
  console.log(secretKey.algorithm.name, env.SECURITY_ENCRYPTION_ALG_NAME);
  const iv = window.crypto.getRandomValues(new Uint8Array(96));
  const encodedEvent = encode(JSON.stringify(event));
  const encryptedEventMeta: EncryptedEventMeta = {
    e: "MESSAGE_ENCRYPTED",
    ts: new Date().getTime(),
    name: env.SECURITY_ENCRYPTION_ALG_NAME,
    iv
  }
  try {
    const encryptedEventData = await window.crypto.subtle.encrypt(encryptedEventMeta, secretKey, encodedEvent);
    const encryptedEvent: EncryptedEvent = {
      meta: encryptedEventMeta,
      data: decode(encryptedEventData)
    }

    return encryptedEvent;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const decryptEvent = async (secretKey: CryptoKey, { meta, data }: EncryptedEvent): Promise<Event> => {
  const decryptedEvent = await window.crypto.subtle.decrypt(meta, secretKey, encode(data));
  const eventJsonString = decode(decryptedEvent);
  return JSON.parse(eventJsonString);
}

export const deriveSecretKey = (localPrivateKey: CryptoKey, remotePublicKey: CryptoKey) => {
  const deriveParams: EcdhKeyDeriveParams = {
    name: env.SECURITY_DERIVE_ALG_NAME,
    public: remotePublicKey
  }
  const encryptionParams: AesDerivedKeyParams = {
    name: env.SECURITY_ENCRYPTION_ALG_NAME,
    length: parseInt(env.SECURITY_ENCRYPTION_KEY_LENGTH)
  }
  return window.crypto.subtle.deriveKey(
    deriveParams,
    localPrivateKey,
    encryptionParams,
    false,
    ['encrypt', 'decrypt']
  );
}

export const generateKey = () => {
  const algorithm: EcKeyGenParams = {
    name: env.SECURITY_DERIVE_ALG_NAME,
    namedCurve: env.SECURITY_DERIVE_ALG_NAMED_CURVE
  }
  return window.crypto.subtle.generateKey(algorithm, false, ['deriveKey']);
}
