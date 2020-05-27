import { Event, EventType } from '../interfaces';
import { generateKey, encryptEvent, deriveSecretKey } from './security'

export const buildEvent = (e: EventType, data: any): Event => {
  const ts = new Date().getTime();
  const event: Event = { meta: { e, ts }, data };
  return event;
}

const stringifyEvent = (event: Event): string => {
  const payload = JSON.stringify({
    message: "sendmessage",
    data: JSON.stringify(event),
  });

  return payload;
}

export const encodeEvent = async (event: Event): Promise<string> => {
  const alicesKeyPair = await generateKey();
  const bobsKeyPair = await generateKey();
  const alicesSecretKey = await deriveSecretKey(alicesKeyPair.privateKey, bobsKeyPair.publicKey);
  // const bobsSecretKey = await deriveSecretKey(bobsKeyPair.privateKey, alicesKeyPair.publicKey);
  const encryptedEvent = await encryptEvent(alicesSecretKey, event);
  return stringifyEvent(encryptedEvent);
}

export const decodePayload = (payload: string): Event => JSON.parse(payload);
