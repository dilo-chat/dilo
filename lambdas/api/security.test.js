const crypto = require('crypto')
const { generateKeyPair, deriveSecretKey } = require('./security');

describe('security', () => {

  it('should deriveKey', () => {
    const alicesKeyPair = crypto.createECDH('secp384r1');
    const alicesPrivateKey = '5dd96844367c1e2200af243016e6505921acbaf3cfb1f414f254ab9121d0453e33d53f08d978910a16c4cb74141a9fb9';
    alicesKeyPair.setPrivateKey(alicesPrivateKey, 'hex');

    const alicesPublicKey = alicesKeyPair.getPublicKey('hex');
    console.log('alices Public Key HEX', alicesPublicKey);

    const bobsPublicKeyHex = '04f6a2ea21c9a7456b62b000106199ed372866791db2e51b6cc057a2a5b0b2f35cfb640daf25249d9a1088b41e62d97f06015ec637708a831c989da7693c316485ce14dd895a059f6b5fe336e9ba3403b909fb956bdbe71b4b8349af83a8162b9e';
    const sharedSecret = alicesKeyPair.computeSecret(bobsPublicKeyHex, 'hex', 'hex');
    console.log('bobs Public Key HEX', bobsPublicKeyHex);
    console.log('shared secret HEX', sharedSecret, 'length', sharedSecret.length);

    const cipher = 'b3c98c755a194efea491de4344e1f8aeb88e3e1e';
    const iv = 'fbadde3d624e227f0680066191c6e62e1644f5ce115da9426ea596560a098b1adba962efda23e8df36f3d7282391887494424e63abbf624f8c774a96bf80a668747f3724b592e4a6c89dbe6290f84de806e397389bee7db64169ecfc1d1d51ed';
    const decipher = crypto.createDecipheriv('aes-256-gcm', sharedSecret, iv);
    let decrypted = decipher.update(cipher, "hex", 'utf8')
      + decipher.final('utf8');
    console.log(decipher);
  })

  it.skip('deriveSecretKey', () => {
    const bobsKeyPair = crypto.createECDH('secp384r1');
    const bobsPrivateKey = '+Crdp2O+GWxwv2vFk9xGhhuqb6k0Hh/mvJQ5wLVfDYIYG+LFOunDMTt0Nkei/Lr5';
    bobsKeyPair.setPrivateKey(bobsPrivateKey, 'base64');
    // const bobsPublicKey = bobsKeyPair.generateKeys('base64', 'compressed');
    const bobsPublicKey = bobsKeyPair.getPublicKey('base64');
    console.log('bobsPublicKey', bobsPublicKey);

    const alicesPublicKey = "BBCR/XOQiOODt7K9rGV8YgitVSyYbQP5TT3SKJTaOjm+qMFG3hoTQHUwZLa2FH1muQTa5c2Lc+Vq6TDWVOOUjsKZUl8PahtprTOVY/kcA46FWrspVz530VAmpMjKwgBYeg==";
    const secretKey = deriveSecretKey(bobsKeyPair, alicesPublicKey);
    console.log('secretKey', secretKey);
    // // const expected = bobsKeyPair.computeSecret(alicesPublicKey, 'base64', 'base64');
    //
    // expect(secretKey).toBe(expected);

    const algorithm = 'aes-256-gcm';
    const iv = Buffer.alloc(97, 0);
    console.log('iv', iv.toString('base64'))
    const secretKeyInBytes = Buffer.from(secretKey, 'base64');
    const cipher = crypto.createCipheriv(algorithm, secretKeyInBytes, iv);
    let encrypted = '';
    cipher.on('readable', () => {
      let chunk;
      while(null !== (chunk = cipher.read())) {
        encrypted += chunk.toString('base64');
      }
    })
    cipher.on('end', () => console.log('encrypted', encrypted));
    cipher.write('dilo')
    cipher.end();
  })
})


// https://gist.github.com/jonleighton/958841#gistcomment-2375558
