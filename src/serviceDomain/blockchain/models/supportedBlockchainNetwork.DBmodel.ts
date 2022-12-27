import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class SupportedBlockchainNetwork extends BaseModel {

  @prop({ type: String, required: true })
  public blockchainName: string

  @prop({ type: String, required: true })
  public blockchainId: string

  @prop({ type: String, required: true })
  public tokenId: string

  @prop({ type: String, required: true })
  public walletAddress: string

  @prop({ type: String, required: false })
  public memoId: string

  @prop({ type: Boolean, required: true, default: false })
  public isNative: boolean

  @prop({ type: Number, required: true, default: 0 })
  public decimals: number

  @prop({ type: Number, required: true, default: 0 })
  public decimalsToShow: number

  @prop({ type: String, require: false })
  public contract?: string

  @prop({ required: true, type: String })
  public chainId: string

  public static async initialization(): Promise<void> {
    console.log('SUPPORTEDBLOCKCHAINNETWORKS DATABASE MODEL INITIALIZATION')
    console.log('SUPPORTEDBLOCKCHAINNETWORKS DATABASE MODEL INITIALIZATION :: NOTHING TO DO')
  }

  public static async migrations(): Promise<void> {
    console.log('SUPPORTEDBLOCKCHAINNETWORKS DATABASE MODEL MIGRATION')
    console.log('SUPPORTEDBLOCKCHAINNETWORKS DATABASE MODEL MIGRATION :: NOTHING TO DO')
  }
}

const SupportedBlockchainNetworksDBModel = getModelForClass(SupportedBlockchainNetwork)
export default SupportedBlockchainNetworksDBModel
