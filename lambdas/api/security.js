const { put } = require('./storage');
const crypto = require('crypto')
const log = require('../helpers/log')
const { buildEvent, emitEvent, EventTypes } = require('./event')

const encoding = 'base64'
const format = 'compressed'

exports.enchangeKeys = async(requestContext, { data, meta }) => {
  const ecdh = generateKeyPair();
  const remotePublicKey = meta.publicKey;
  const { connectionId } = requestContext;
  const { roomId } = meta;
  const sharedKey = deriveSecretKey(ecdh, remotePublicKey);
  await put({ roomId, connectionId, sharedKey })

  const publicKey = ecdh.getPublicKey(encoding);
  const exchangeKeysEvent = buildEvent(EventTypes.SECURITY_KEYS_EXCHANGE, { publicKey, roomId });
  await emitEvent(requestContext, exchangeKeysEvent, [connectionId]);
}

// https://security.stackexchange.com/a/78624
// p-384 == secp384r1
const generateKeyPair = () => {
  const ecdh = crypto.createECDH('secp384r1');
  ecdh.generateKeys(encoding, format);
  return ecdh;
}

// const encryptEvent
// const decryptEvent
const deriveSecretKey = (ecdh, remotePublicKey) => {
  try {
    return ecdh.computeSecret(remotePublicKey, encoding, encoding);
  } catch (error) {
    log(`Error while deriving shared key: ` + error.message);
    throw error;
  }
}

exports.generateKeyPair = generateKeyPair;
exports.deriveSecretKey = deriveSecretKey;
