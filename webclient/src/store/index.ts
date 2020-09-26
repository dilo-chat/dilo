import { DB } from '../firebase.config'
import uuid, { UUID } from '../helpers/uuid'

const key = 'dilo'

export type Data = {
  rooms: { [roomId: string]: RoomData};
}

export type RoomData = {
  authorId: string;
  authorName?: string;
}

const initialValue = {
  rooms: {}
}

export const getData = (): Data => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : setData(initialValue)
  } catch (e) {
    console.error(e.message)
    return setData(initialValue)
  }
}

const setData = (data: Data): Data => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return data
  } catch (e) {
    console.error(e.message)
    return data
  }
}

export const addRoom = async (userId: string, roomId: string, roomData: RoomData): Promise<void> => {
  const userRef =  DB.user.doc(userId)

  await userRef.collection('publicRooms').doc(roomId).set(roomData)
}

export const getAllRooms = async (userId: string): Promise<Data> => {
  return DB.user.doc(userId).collection('publicRooms').get().then(
    x => x.docs.reduce((acc, current) => ({
      ...acc,
      [current.id]: current.data as any
    }), {})
  ).then(
    data => ({
      rooms: data
    })
  )
}

export const getRoomData = async (userId: string, roomId: string): Promise<RoomData | undefined> => {
  const userRef =  DB.user.doc(userId)
  return (await userRef.collection('publicRooms').doc(roomId).get())?.data as any
}

export const getOrInitRoomData = async (userId: string, roomId: string): Promise<RoomData> => {
  const room = await getRoomData(userId, roomId)

  if (room) {
    return room
  } else {
    await addRoom(userId, roomId, { authorId: uuid(), authorName: undefined })
    return { authorId: uuid(), authorName: undefined }
  }
}
