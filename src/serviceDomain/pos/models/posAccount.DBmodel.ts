import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class PosAccount extends BaseModel {
  @prop({ type: String, required: true })
  userId: string

  @prop({ required: true, default: false, type: Boolean })
  isDeleted?: boolean
}

const PosAccountDBModel = getModelForClass(PosAccount)
export default PosAccountDBModel
