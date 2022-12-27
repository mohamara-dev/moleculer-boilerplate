import TransactionDBModel, { Transaction } from '@ServiceDomain/pos/models/transaction.DBmodel'
import { transactionForClient } from '@ServiceDomain/pos/dto/interfaces/transaction.interface'
import { Context, ServiceBroker } from "moleculer"
import GeneralServiceRequests from '@Types/interfaces/general.interface'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { blockchainForClient } from "@ServiceDomain/blockchain/dto/interfaces/blockchain.interface"
import { tokenForClient } from "@ServiceDomain/blockchain/dto/interfaces/token.interface"
import { Blockchain } from "@ServiceDomain/blockchain/models/blockchain.DBmodel"
import YFTController from "@ServiceDomain/yft.controller"
import { updateOneTransaction } from '@ServiceDomain/pos/dto/interfaces/transaction.interface'
import { createOrUpdateTransactionValidator } from '@ServiceDomain/pos/dto/validations/transaction.validate'
import { analyzeBlockchain } from "@ServiceDomain/pos/dto/interfaces/pos.interface"

export default class TransactionController extends YFTController {
  constructor() {
    super(TransactionDBModel)
  }
  private static instance: TransactionController

  public static shared(): TransactionController {
    if (!TransactionController.instance) {
      const instance = new TransactionController()
      TransactionController.instance = instance
    }
    return TransactionController.instance
  }

  private async prepareForClient(ctx: Context, transaction: Transaction): Promise<transactionForClient> {
    try {
      const getTokenCallingParameters: GeneralServiceRequests.getOne = {
        id: transaction.tokenId,
      }
      const token: tokenForClient = await ctx.call("v1.token.getOne", getTokenCallingParameters)

      const getBlockchainCallingParameters: GeneralServiceRequests.getOne = {
        id: transaction.blockchainId,
      }
      const blockChain: blockchainForClient = await ctx.call("v1.blockchain.getOne", getBlockchainCallingParameters)

      const transactionForClient = {
        id: transaction._id.toHexString(),

        amount: transaction.amount,
        customerWalletAddress: transaction.customerWalletAddress,
        token: token,
        blockChain: blockChain,
        posId: transaction.posId,
        payerMobile: transaction.payerMobile,
        txHash: transaction.txHash,
      }
      return transactionForClient
    } catch (error) {
      console.log(error)
    }
  }

  public async getOneByDeviceId(ctx: Context, deviceId: string, tokenId: string, amount: string): Promise<Transaction> {
    const transaction = await TransactionDBModel.findOne({
      posId: deviceId,
      tokenId: tokenId,
      amount: amount,
    })
    return transaction
  }

  public async createOrUpdate(ctx: Context<updateOneTransaction, GeneralMetaRequests.RequestMetaData>): Promise<Transaction> {
    const txHash = ctx.params.txHash
    const merchantWalletAddress = ctx.params.merchantWalletAddress
    const customerWalletAddress = ctx.params.customerWalletAddress
    const amount = ctx.params.amount
    const timeStamp = ctx.params.timeStamp
    const isBlockchainConfirmed = ctx.params.isBlockchainConfirmed

    const condition = {
      merchantWalletAddress: merchantWalletAddress,
      customerWalletAddress: customerWalletAddress,
      txHash: { $exists: false },
    }
    const newTransaction = {
      txHash: txHash,
      tokenAmount: amount,
      timeStamp: timeStamp,
      isBlockchainConfirmed: isBlockchainConfirmed,
    }
    const transaction = await super.createOrUpdateByCondition(condition, newTransaction, createOrUpdateTransactionValidator)
    return transaction
  }

  public async getAllUnConfirmed(): Promise<Transaction[]> {
    const endTime = new Date(Date.now() - 10 * 86_400_000).toISOString()
    const condition = {
      isBlockchainConfirmed: false,
      isDeleted: false,
      createdAt: { $gte: new Date(endTime) },
    }
    await TransactionDBModel.updateMany(
      { isBlockchainConfirmed: false, createdAt: { $lte: new Date(endTime) } },
      { isDeleted: true }
    )
    const transactions = await TransactionDBModel.find(condition)
    return transactions
  }

  public async checkTransactions(broker: ServiceBroker): Promise<any> {
    try {
      const unconfirmedTransactions = await this.getAllUnConfirmed()
      for (const transaction of unconfirmedTransactions) {
        const getBlockchainCallingParameters: GeneralServiceRequests.getOne = { id: transaction.blockchainId }
        const blockChain: Blockchain = await broker.call("v1.blockchain.getOne", getBlockchainCallingParameters)
        const getTokenCallingParameters: analyzeBlockchain = { network: blockChain, transaction: transaction }
        await broker.call("v1.pos.analyzeBlockchain", getTokenCallingParameters)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
