const crypto = require('crypto')
const { generateKeyPair, deriveSecretKey } = require('./security');

describe('security', () => {
  it('deriveSecretKey', () => {
    const bobsKeyPair = crypto.createECDH('secp384r1');
    const bobsPublicKey = bobsKeyPair.generateKeys('base64', 'compressed');
    console.log(bobsPublicKey);

    const alicesKeyPair = generateKeyPair();
    const alicesPublicKey = alicesKeyPair.getPublicKey('base64');

    const actual = deriveSecretKey(alicesKeyPair, bobsPublicKey);
    const expected = bobsKeyPair.computeSecret(alicesPublicKey, 'base64', 'base64');

    expect(actual).toBe(expected);
  })
})
