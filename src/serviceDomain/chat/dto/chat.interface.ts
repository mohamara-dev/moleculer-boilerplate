import { ObjectId } from 'mongodb'

export interface preparedChat {
  id: string
  sender: boolean
  message: string
  timeStamp: number
}
export interface getDealChatroom {
  ownerId: string
  dealId: string
}
export interface enterChatRoom {
  chatroomId: string
  ownerId: string
  dealId: string
}
export interface sendMessageInChatroom {
  id?: string
  replyTo?: string
  message: string
  chatRoomId: string
}
export interface preparedChatRoom {
  theCase: {
    id: string
    title: string
    image: string
  }
  message: {
    chatterName: string
    time: number
    id: string
    message: string
  }
}
