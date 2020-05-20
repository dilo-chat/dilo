import * as React from 'react'

import './App.css'

import { Home } from './pages/Home'
import Chat from './components/Chat'
import { RoomProvider } from './context/roomContext'

interface Props {
  authorId: string;
  roomId?: string;
}

const App: React.FC<Props> = ({ authorId, roomId }) => {
  return (
    <RoomProvider authorId={authorId} roomId={roomId} messages={[]} peopleInRoom={0}>
    {roomId && (
      <div className="room">
        <Chat />
      </div>
    )}
    {!roomId && <Home />}
    </RoomProvider>
  );
}

export default App;
