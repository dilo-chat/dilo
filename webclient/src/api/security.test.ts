import { PeopleInRoomChangedEvent } from '../interfaces'
import { buildEvent } from './eventEmitter'
import {
  generateKey,
  deriveSecretKey,
  encryptEvent,
  decryptEvent
} from './security'

describe('security', () => {
  it('should encrypt and decrypt a message with two different keys', async () => {
    // based on https://github.com/mdn/dom-examples/blob/master/web-crypto/derive-key/ecdh.js
    const alicesKeyPair = await generateKey();
    const bobsKeyPair = await generateKey();

    const alicesSecretKey = await deriveSecretKey(alicesKeyPair.privateKey, bobsKeyPair.publicKey);
    const bobsSecretKey = await deriveSecretKey(alicesKeyPair.privateKey, bobsKeyPair.publicKey);

    const testEvent: PeopleInRoomChangedEvent = buildEvent('CONNECTIONS_COUNT_CHANGED', {
      roomId: 'home',
      connectionsCount: 10
    });
    console.log(testEvent);

    const encryptedEvent = await encryptEvent(alicesSecretKey, testEvent);
    console.log(encryptedEvent);

    const decryptedEvent = await decryptEvent(bobsSecretKey, encryptedEvent);
    console.log(decryptedEvent);

    expect(decryptedEvent.meta).toEqual(testEvent.meta);
    expect(decryptedEvent.data).toEqual(testEvent.data);
  })
})
