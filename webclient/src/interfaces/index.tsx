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
  | 'ROOM_LEFT';

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
