import { prop, getModelForClass } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class ChatRoom extends BaseModel {
  @prop({ required: true, type: String, index: true })
  ownerId: string //the chatroom creator

  @prop({ type: String, index: true })
  dealId: string

  @prop({ type: Boolean, default: false })
  isDeleted: boolean

  @prop({ type: Boolean, default: false })
  isArchived: boolean

  @prop({ type: () => [String] })
  chattersId?: string[]

  // public static async migrations(): Promise<void> {
  //   console.log('UserInventory DATABASE MODEL MIGRATION INITIATED')
  //   console.log('UserInventory DATABASE MODEL MIGRATION NOTHING TO DO')
  // }
}

const ChatRoomDBModel = getModelForClass(ChatRoom)
export default ChatRoomDBModel
