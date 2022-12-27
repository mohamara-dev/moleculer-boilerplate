import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class Token extends BaseModel {
  @prop({ type: String, required: true, unique: true })
  public shortName: string

  @prop({ required: true, type: () => String })
  public pricingMarketSymbolsToUsdt: string

  @prop({ type: String, required: true })
  public longNameEn: string

  @prop({ type: String, required: true })
  public longNameEnTrimmed: string

  @prop({ type: String, required: true })
  public longNameFa: string

  @prop({ type: String, required: false })
  public imageUrl: string

  @prop({ type: Boolean, require: true, default: false })
  public isDeleted?: boolean

  @prop({ type: Number })
  public sortingPosition?: number

  @prop({ type: String })
  public coinGeckoApiId?: string

  @prop({ type: () => [String] })
  public blockchainNetworks: string[]

  public static async initialization(): Promise<void> {
    console.log('TOKEN DATABASE MODEL INITIALIZATION')
    console.log('TOKEN DATABASE MODEL INITIALIZATION :: NOTHING TO DO')
  }

  public static async migrations(): Promise<void> {
    console.log('TOKEN DATABASE MODEL MIGRATION')
    console.log('TOKEN DATABASE MODEL MIGRATION :: NOTHING TO DO')
  }
}

const TokenDBModel = getModelForClass(Token)
export default TokenDBModel
