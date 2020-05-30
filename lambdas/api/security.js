const { put } = require('./storage');
const crypto = require('crypto')

const encoding = 'utf8'
const format = 'uncompressed'

exports.enchangeKeys = async({ connectionId }, { data, meta }) => {
  const ecdh = generateKeyPair();
  const remotePublicKey = meta.publicKey;
  const roomId = meta.roomId;
  const sharedSecretKey = deriveSecretKey(ecdh, remotePublicKey);
  const publicKey = ecdh.getPublicKey(encoding);
  // store sharedSecretKey. It will be used to en/decrypt
  // send publicKey so that remote can generate the sharedSecretKey
  await put({ roomId, connectionId, sharedKey })
}

// https://security.stackexchange.com/a/78624
// p-384 == secp384r1
const generateKeyPair = () => {
  const ecdh = crypto.createECDH('secp384r1');
  ecdh.generateKeys(encoding, format);
  return ecdh;
}

const encryptEvent
const decryptEvent
const deriveSecretKey = (ecdh, remotePublicKey) => {
  return ecdh.computeSecret(remotePublicKey, encoding, encoding);
}
