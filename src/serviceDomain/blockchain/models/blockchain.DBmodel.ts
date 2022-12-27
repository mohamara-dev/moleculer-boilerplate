import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class Blockchain extends BaseModel {
  @prop({required: true, type: String})
  public name: string

  @prop({required: true, type: String})
  public networkType: string

  @prop({required: true, type: String})
  public displayName: string

  @prop({type: String})
  public persianDisplayName: string

  @prop({required: true, type: String})
  public networkNameInBinanceApis: string

  @prop({type: String, require: false})
  public imageUrl?: string

  @prop({required: false, type: Boolean, default: false})
  public hasMemoId: boolean

  @prop({required: false, type: String})
  public chainId: string

  @prop({required: false, type: String})
  public addressRegex: string

  @prop({type: () => String})
  public rpcUrls: string

  @prop({type: () => String})
  public blockExplorerUrls: string

  @prop({type: String, required: false})
  public chainName: string

  @prop({type: String, required: false})
  public nativeCoinSymbol: string

  @prop({type: String, required: false})
  public explorerApiKey: string

  @prop({type: String, required: false})
  public explorerEndPoint: string

}

const BlockchainDBModel = getModelForClass(Blockchain)
export default BlockchainDBModel
