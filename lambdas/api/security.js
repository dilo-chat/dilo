const crypto = require('crypto')

exports.enchangeKeys = (requestContext, { data, meta }) => {
  const ecdh = generateKeyPair();
  const remotePublicKey = meta.publicKey;
  const sharedSecretKey = deriveSecretKey(ecdh, remotePublicKey);
  const publicKey = ecdh.getPublicKey('utf8');
  // store sharedSecretKey. It will be used to en/decrypt
  // send publicKey so that remote can generate the sharedSecretKey
  
}
// https://security.stackexchange.com/a/78624
// p-384 == secp384r1
const generateKeyPair = () => {
  const ecdh = crypto.createECDH('secp384r1');
  ecdh.generateKeys();
  return ecdh;
}

const encryptEvent
const decryptEvent
const deriveSecretKey = (ecdh, remotePublicKey) => {
  return ecdh.computeSecret(remotePublicKey)
}
