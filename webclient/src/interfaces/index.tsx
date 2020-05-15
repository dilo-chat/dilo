export interface Message {
  messageId: string;
  roomId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export type EventType = 'CONNECTIONS_COUNT_CHANGED'
  | 'CONNECTION_CONNECTED'
  | 'CONNECTION_DISCONNECTED'
  | 'MESSAGE_SENT'
  | 'ROOM_JOINED'
  | 'ROOM_LEFT';

export interface Event {
  meta: {
    e: EventType;
    ts: number;
  };
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
  roomId: string;
  authorId: string;
  peopleInRoom: number;
  messages: Message[]
}
