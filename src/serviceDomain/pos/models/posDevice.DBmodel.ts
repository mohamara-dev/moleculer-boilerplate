import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class PosDevice extends BaseModel {
  @prop({ type: String, required: true })
    userId: string

  @prop({ type: String, required: true })
    posId: string

  @prop({ type: String, required: false })
    configProfileId: string
  
  @prop({ required: true, default: false, type: Boolean })
    isDeleted?: boolean
}

const PosDeviceDBModel = getModelForClass(PosDevice)
export default PosDeviceDBModel
