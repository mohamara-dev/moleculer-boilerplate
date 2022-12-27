import { getModelForClass, prop } from '@typegoose/typegoose'
import BaseModel from '@Models/base.DBmodel'

export class Transaction extends BaseModel {
  @prop({ type: String, required: true })
    userId: string
  
  @prop({ type: String, required: true })
    posId: string
  
  @prop({ type: String, required: true })
    amount: string

  @prop({ type: String, required: true })
    tokenAmount: string

  @prop({ type: String, required: false })
    payerMobile: string

  @prop({ type: String, required: false })
    customerWalletAddress: string

  @prop({ type: String, required: false })
    merchantWalletAddress: string

  @prop({ type: String, required: true })
    blockchainId: string

  @prop({ type: Number, required: false })
    blockchainConfirmationsCount: number

  @prop({ type: Boolean, required: false })
    isBlockchainConfirmed: boolean

  @prop({ type: String, required: false })
    txHash: string

  @prop({ type: String, required: true })
    tokenId: string

  @prop({ type: String, required: false })
    timestamp?: string
  
  @prop({ required: true, default: false, type: Boolean })
    isDeleted?: boolean
}

const TransactionDBModel = getModelForClass(Transaction)
export default TransactionDBModel
