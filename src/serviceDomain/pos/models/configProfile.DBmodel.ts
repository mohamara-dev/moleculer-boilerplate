import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class supportedTokenAndBlockchain extends BaseModel {
  @prop({ type: String, required: true })
  public blockchainId: string

  @prop({ type: String, required: true })
  public tokenId: string

  @prop({ required: true, type: String, unique: true })
  public walletAddress: string

}

export class ConfigProfile extends BaseModel {
  @prop({ type: String, required: true })
  public userId: string
  
  @prop({ type: String, required: true })
  public posId: string

  @prop({ required: true, default: false, type: Boolean })
  public sendReceiveNotif?: boolean
  
  @prop({ type: () => [supportedTokenAndBlockchain] })
  public supportedTokenAndBlockchains: supportedTokenAndBlockchain[]
  
  @prop({ required: true, default: false, type: Boolean })
  public isDeleted?: boolean
}

const ConfigProfileDBModel = getModelForClass(ConfigProfile)
export default ConfigProfileDBModel
