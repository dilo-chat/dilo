export interface Message {
  messageId: string;
  roomId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export type EventType = 'MESSAGE_ENCRYPTED'
  | 'MESSAGE_SENT'
  | 'CONNECTIONS_COUNT_CHANGED'
  | 'CONNECTION_CONNECTED'
  | 'CONNECTION_DISCONNECTED'
  | 'ROOM_JOINED'
  | 'ROOM_LEFT'
  | 'SECURITY_KEYS_EXCHANGE'
  | 'SECURITY_MESSAGE_EXCHANGE';

export interface EventMeta {
  e: EventType;
  ts: number;
}

export interface Event {
  meta: EventMeta;
  data: any;
}

export interface MessageEvent extends Event {
  data: Message;
}

export interface PeopleInRoomChangedEvent extends Event {
  data: {
    roomId: string;
    connectionsCount: number;
  }
}

export interface SecurityKeysExchangeEvent extends Event {
  data: {
    publicKey: CryptoKey
  }
}


export interface EncryptedEventMeta extends EventMeta, AesGcmParams {
}

export interface EncryptedEvent extends Event {
  meta: EncryptedEventMeta;
  data: ArrayBuffer;
}

export interface EventListener {
  eventType: EventType;
  callback: (event: Event) => void;
}

export interface ConnectionState {
  isConnected: boolean;
  isDisconnected: boolean;
  isConnecting: boolean;
}

export interface RoomState {
  roomId?: string;
  authorId: string;
  peopleInRoom: number;
  messages: Message[]
}
