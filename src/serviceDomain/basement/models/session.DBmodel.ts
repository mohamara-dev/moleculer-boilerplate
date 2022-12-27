import { getModelForClass, prop } from "@typegoose/typegoose";
import BaseModel from "@Models/base.DBmodel";

export class Session extends BaseModel {
  @prop({ type: String, required: true })
  userId: string;

  @prop({ type: String, required: true })
  clientIp: string;

  @prop({ type: String, required: false })
  userAgent: string;

  @prop({ type: String, required: false })
  browser: string;

  @prop({ type: String, required: false })
  cpu: string;

  @prop({ type: String, required: false })
  os: string;

  @prop({ type: String, required: false })
  engine: string;

  @prop({ type: String, required: false })
  device: string;

  @prop({ type: Date, required: true })
  latestAccess: Date;

  @prop({ type: Date, required: true })
  firstAccess: Date;

  @prop({ required: true, default: false, type: Boolean })
  isDeleted?: boolean;
}

const SessionDBModel = getModelForClass(Session);
export default SessionDBModel;
