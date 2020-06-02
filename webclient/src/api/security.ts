import { Event, EncryptedEventMeta, EncryptedEvent } from '../interfaces'
import env from '../helpers/env';

const encode = (plaintext: string) => new TextEncoder().encode(plaintext);
const decode = (encoded: ArrayBuffer) => new TextDecoder().decode(encoded);

export const encryptEvent = async (secretKey: CryptoKey, event: Event): Promise<EncryptedEvent> => {
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
    console.log('encrypted ciphertext', encryptedEventData)
    console.log('encrypted ciphertext decoded', decode(encryptedEventData))
    const encryptedEvent: EncryptedEvent = {
      meta: encryptedEventMeta,
      data: encryptedEventData
    }

    return encryptedEvent;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const decryptEvent = async (secretKey: CryptoKey, { meta, data }: EncryptedEvent): Promise<Event> => {
  console.log(meta, data)
  const decryptedEvent = await window.crypto.subtle.decrypt({
    name: meta.name,
    iv: meta.iv
  }, secretKey, data);
  console.log(decryptedEvent);
  const eventJsonString = decode(decryptedEvent);
  console.log(eventJsonString);
  return JSON.parse(eventJsonString);
}

export const deriveSecretKey = (localPrivateKey: CryptoKey, remotePublicKey: CryptoKey) => {
  const deriveParams: EcdhKeyDeriveParams = {
    name: 'ECDH',
    public: remotePublicKey
  }
  const encryptionParams: AesDerivedKeyParams = {
    name: 'AES-GCM',
    length: 256
  }
  return window.crypto.subtle.deriveKey(
    deriveParams,
    localPrivateKey,
    encryptionParams,
    true,
    ['encrypt', 'decrypt']
  );
}

export const generateKeyPair = () => {
  const algorithm: EcKeyGenParams = {
    name: env.SECURITY_DERIVE_ALG_NAME,
    namedCurve: env.SECURITY_DERIVE_ALG_NAMED_CURVE
  }
  return window.crypto.subtle.generateKey(algorithm, false, ['deriveKey', 'deriveBits']);
}

const hex2Arr = (str: string) => {
    if (!str) {
        return new Uint8Array()
    }
    const arr = []
    for (let i = 0, len = str.length; i < len; i+=2) {
        arr.push(parseInt(str.substr(i, 2), 16))
    }
    return new Uint8Array(arr)
}

const buf2Hex = (buf: ArrayBuffer) => {
    return Array.from(new Uint8Array(buf))
        .map(x => ('00' + x.toString(16)).slice(-2))
        .join('')
}

export const exportPublicKey = async (publicKey: CryptoKey) => {
  const rawPublicKey = await window.crypto.subtle.exportKey('raw', publicKey);
  return buf2Hex(rawPublicKey);
}

export const importPublicKey = (hexPublicKey: string): PromiseLike<CryptoKey> => {
    const alicesPublicKey = hex2Arr(hexPublicKey);
    return window.crypto.subtle.importKey(
      'raw',
      alicesPublicKey,
      {
        name: 'ECDH',
        namedCurve: 'P-384'
      },
      true,
      []
    )
}

export const encrypt = async (secretKey: CryptoKey, plaintext: string) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(96));
  const encodedEvent = encode(plaintext);
  const algorithm: AesGcmParams = {
    name: 'AES-GCM',
    iv
  }
  const ciphertext = await window.crypto.subtle.encrypt(
    algorithm,
    secretKey,
    encodedEvent
  );

  const ivHex = buf2Hex(iv);
  console.log('ivHex', ivHex);
  const ciphertextHex = buf2Hex(ciphertext);
  console.log('cipher HEX', ciphertextHex);
}

export const example = async () => {
  const alicesPublicKeyHex = '04e4d3ef47543c1a60f1bba4c358aaeac09f49e7605ef5e7fb43d6485d8ad6da890f968ebe35ecf4f8e1ce715a05638ad712878dbd61436395a81e3a2aba324c163ae86bd52bd41c9d18a687991d699c0551e89cd977678b4826002189510e68cc';
  const alicesImportedKey = await importPublicKey(alicesPublicKeyHex);
  const bobsKeyPair = await generateKeyPair();
  const bobsPublicKey = await exportPublicKey(bobsKeyPair.publicKey);
  console.log('bobs Public Key HEX', bobsPublicKey);
  const params: EcdhKeyDeriveParams = {
      name: 'ECDH',
      public: alicesImportedKey
    }
  const derivedBits = await window.crypto.subtle.deriveBits(params,
    bobsKeyPair.privateKey,
    384
  );
  const derivedBitsHex = buf2Hex(derivedBits);
  console.log('derivedBits', derivedBitsHex);

  const secretKey = await deriveSecretKey(bobsKeyPair.privateKey, alicesImportedKey);
  const encrypted = await encrypt(secretKey, 'dilo');

}
