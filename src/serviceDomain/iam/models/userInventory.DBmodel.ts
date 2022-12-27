import { prop, getModelForClass } from "@typegoose/typegoose";
import BaseModel from "@Models/base.DBmodel";

export class UserInventory extends BaseModel {
  @prop({ required: true, type: String, index: true })
  userId: string;

  @prop({ type: Boolean, index: true })
  isFavored: boolean;

  @prop({ required: true, type: String, index: true })
  itemId: string;

  // public static async migrations(): Promise<void> {
  //   console.log('UserInventory DATABASE MODEL MIGRATION INITIATED')
  //   console.log('UserInventory DATABASE MODEL MIGRATION NOTHING TO DO')
  // }
}

const UserInventoryDBModel = getModelForClass(UserInventory);
export default UserInventoryDBModel;
