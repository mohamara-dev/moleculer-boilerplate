import { prop, getModelForClass } from "@typegoose/typegoose";
import BaseModel from "@Models/base.DBmodel";

export class Chat extends BaseModel {
  @prop({ required: true, type: String, index: true })
  senderId: string;

  @prop({ type: String })
  message: string;

  @prop({ type: String })
  replyTo: string;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @prop({ type: String })
  chatRoomId: string;

  @prop({ type: () => [String] })
  replies?: string[];

  // public static async migrations(): Promise<void> {
  //   console.log('UserInventory DATABASE MODEL MIGRATION INITIATED')
  //   console.log('UserInventory DATABASE MODEL MIGRATION NOTHING TO DO')
  // }
}

const ChatDBModel = getModelForClass(Chat);
export default ChatDBModel;
