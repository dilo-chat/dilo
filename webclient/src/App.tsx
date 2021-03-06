import './App.css'

import * as React from 'react'

import Chat from './components/Chat'

import { RoomProvider } from './context/roomContext'
import { getOrInitRoomData, getRoomIdsWithoutHome } from './store'
import { Link } from 'react-router-dom'
import { RoomSetupContext } from './context/roomSetupContext'
import { WebManifest } from './components/WebManifest'

const App: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { authorId, authorName } = getOrInitRoomData(roomId)

  return (
    <RoomProvider authorId={authorId} authorName={authorName} roomId={roomId} peopleInRoom={0}>
      <WebManifest start_url={'/r/' + roomId} />
      <div className="room">
        <div className="top-bar">
          {getRoomIdsWithoutHome().length > 1 && (
            <Link to="/o">
              <svg viewBox="0 0 24 24" fill="black" width="48px" height="48px"><path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
              </svg>
            </Link>
        )}
          <h1>
            <RoomSetupContext.Consumer>
              {value => value.roomName || "dilo"}
            </RoomSetupContext.Consumer>
          </h1>
        </div>
        <Chat />
      </div>
    </RoomProvider>
  );
}

export default App;
