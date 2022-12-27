import { Context } from 'moleculer'
import { ConfigProfile } from '@ServiceDomain/pos/models/configProfile.DBmodel'
import PosDeviceDBModel, { PosDevice } from '@ServiceDomain/pos/models/posDevice.DBmodel'
import { Token } from '@ServiceDomain/blockchain/models/token.DBmodel'
import { Blockchain } from '@ServiceDomain/blockchain/models/blockchain.DBmodel'
import TransactionDBModel, { Transaction } from '@ServiceDomain/pos/models/transaction.DBmodel'
import { configForClient, getOneConfig } from '@ServiceDomain/pos/dto/interfaces/configProfiles.interface'
import ScannerController from '@ThirdParty/scanner/scanner'
import GeneralServiceRequests from '@Types/interfaces/general.interface'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { generateRequest, getTransactionToCheck, setConfig } from '@ServiceDomain/pos/dto/interfaces/pos.interface'
import Big from 'big.js'
import { blockchainForClient } from '@ServiceDomain/blockchain/dto/interfaces/blockchain.interface'
import { PosDeviceForClient } from '@ServiceDomain/pos/dto/interfaces/pos.interface'
import { tokenPrice } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'
import { User } from '@ServiceDomain/iam/models/user.DBmodel'
import YFTController from "@ServiceDomain/yft.controller"
import { fastestValidator } from '@Helpers/validator'
import { YFTError } from '@Base/yft'
import { generateRequestOnDevice, createOrUpdateConfig } from '@ServiceDomain/pos/dto/validations/pos.validate'
import { getTokenPriceBySymbol } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'
import { getOneByDeviceId } from '@ServiceDomain/pos/dto/interfaces/transaction.interface'
import { SupportedBlockchainNetwork } from '@ServiceDomain/blockchain/models/supportedBlockchainNetwork.DBmodel'

export default class PosController extends YFTController {
  private static instance: PosController
  constructor() {
    super(PosDeviceDBModel)
  }
  public static shared(): PosController {
    if (!PosController.instance) {
      const instance = new PosController()
      PosController.instance = instance
    }
    return PosController.instance
  }

  private async PosDeviceForClient(ctx: Context, posDevice: PosDevice): Promise<PosDeviceForClient> {
    try {
      const getUserCallingParameters: GeneralServiceRequests.getOne = {
        id: posDevice.userId,
      }
      const user: User = await ctx.call("v1.user.getOne", getUserCallingParameters)

      const getConfigProfileCallingParameters: GeneralServiceRequests.getOne = { id: posDevice.configProfileId }
      const configProfile: ConfigProfile = await ctx.call("v1.configProfile.getOne", getConfigProfileCallingParameters)

      const posDeviceForClient = {
        posId: posDevice.posId,
        user: user,
        configProfile: configProfile,
      }

      return posDeviceForClient
    } catch (error) {
      console.log(error)
    }
  }

  public async checkTransactions(ctx: Context, network: Blockchain, transaction: Transaction): Promise<any> {
    try {
      return await ScannerController.shared(network).analyzeStatusResult(
        transaction,
        ctx
      )
    } catch (error) {
      console.log(error)
    }
  }

  public async checkNetwork(ctx: Context<getTransactionToCheck, GeneralMetaRequests.RequestMetaData>): Promise<any> {
    try {
      const user = ctx.meta.user
      const tokenId = ctx.params.tokenId
      // const blockchainId = ctx.params.blockchainId
      const amount = ctx.params.amount
      const posId = ctx.params.posId

      const getTransactionCallingParameters: getOneByDeviceId = { posId: posId, tokenId: tokenId, amount: amount }
      const transaction: Transaction = await ctx.call("v1.transaction.getOneByClientId", getTransactionCallingParameters)
      // const getTokenCallingParameters: TokenServiceRequests.getOne = { id: tokenId}
      // const token: Token = await ctx.call('v1.token.getOne', getTokenCallingParameters)
      const getBlockchainCallingParameters: GeneralServiceRequests.getOne = { id: transaction.blockchainId }
      const blockChain: Blockchain = await ctx.call("v1.blockchain.getOne", getBlockchainCallingParameters)
      if (transaction.isBlockchainConfirmed === true) {
        return {
          status: true,
          txhashUrl: blockChain.explorerEndPoint + "/tx/" + transaction.txHash,
        }
      }
      return { status: false }
    } catch (error) {
      console.log(error)
    }
  }

  private async generatePaymentLink(ctx: Context, walletAddress: string, amount: number, tokenId: string, blockchainId: string): Promise<string> {
    try {
      let reqAmount = Big(amount)

      const getBlockchainCallingParameters = { id: blockchainId, isRequestedByAdmin: false, }
      const blockchain: blockchainForClient = await ctx.call("v1.blockchain.getOne", getBlockchainCallingParameters)

      const getTokenCallingParameters = { id: tokenId, networkId: blockchain.id, isRequestedByAdmin: true, }
      // const reqToken: Token = await ctx.call("v1.token.getOne", getTokenCallingParameters)
      const supportedBlockchainNetworks: SupportedBlockchainNetwork = await ctx.call("v1.blockchain.getSupportedBlockchainNetwork", getTokenCallingParameters)

      reqAmount = Big(reqAmount).mul(Big(10).pow(supportedBlockchainNetworks.decimals))
      Big.NE = -18
      Big.PE = 0
      Big.DP = 18
      let reqAmountString = new Big(reqAmount.toString()).toString()

      if (reqAmountString.includes("+")) {
        reqAmountString = reqAmountString.replace("+", "")
      }

      let requestUrl
      if (supportedBlockchainNetworks.isNative) {
        requestUrl = `ethereum:${walletAddress}@${blockchain.chainId}?value=${reqAmountString}`
      } else {
        requestUrl = `ethereum:${supportedBlockchainNetworks.contract}@${blockchain.chainId}/transfer?address=${walletAddress}&uint256=${reqAmountString}`
      }
      return requestUrl
      //ethereum:0x936e3d42364717A498Ab84940f5309EcaC2fE97C@1?value=1e16
      //ethereum:0x936e3d42364717A498Ab84940f5309EcaC2fE97C@56?value=1e18
      //smartchain:0x42d4dA0A10Ee9fdD6abcC923687311a0018F6228?amount=12
      // ethereum:0x42d4dA0A10Ee9fdD6abcC923687311a0018F6228?amount=12
      // @1/transfer?address=0x7581b9b2Ba9EAc0975A6a56950AEd10c29B99869&uint256=1e18
    } catch (error) {
      console.log(error)
    }
  }

  public async generateRequest(ctx: Context<generateRequest, GeneralMetaRequests.RequestMetaData>): Promise<string> {
    try {
      const validationResult = fastestValidator(generateRequestOnDevice, ctx.params)
      if (validationResult == true) {
        const getTokenCallingParameters: GeneralServiceRequests.getOne = {
          id: ctx.params.tokenId,
        }
        const token: Token = await ctx.call(
          "v1.token.getOne",
          getTokenCallingParameters
        )

        const getBlockchainCallingParameters: GeneralServiceRequests.getOne = {
          id: ctx.params.blockchainId,
        }
        const blockChain: Blockchain = await ctx.call(
          "v1.blockchain.getOne",
          getBlockchainCallingParameters
        )

        const getConfigCallingParameters: getOneConfig = {
          posId: ctx.params.posId,
          userId: ctx.params.userId,
        }
        const configProfile: configForClient = await ctx.call(
          "v1.config.getOne",
          getConfigCallingParameters
        )

        let walletAddress
        for (const support of configProfile.supportedTokenAndBlockchains) {
          if (
            support.token.id == token.id &&
            support.blockchain.id == blockChain.id &&
            support.id == ctx.params.configId
          ) {
            walletAddress = support.walletAddress
          }
        }

        const tokenAmount = await this.calculateTokenAmount(ctx, ctx.params.tokenId, ctx.params.amount)

        const newTransaction = {
          userId: ctx.params.userId,
          posId: ctx.params.posId,
          amount: ctx.params.amount.toString(),
          tokenAmount: tokenAmount,
          payerMobile: ctx.params.payerMobile,
          customerWalletAddress: ctx.params.customerWalletAddress,
          merchantWalletAddress: walletAddress,
          blockchainId: ctx.params.blockchainId,
          isBlockchainConfirmed: false,
          blockchainConfirmationsCount: 0,
          tokenId: ctx.params.tokenId,
        }

        await TransactionDBModel.create(newTransaction)
        const paymentUrl = await this.generatePaymentLink(
          ctx,
          walletAddress,
          Number(tokenAmount),
          token.id,
          blockChain.id
        )

        return paymentUrl
      }
    } catch (error) {
      console.log(error)
    }
  }
  public async calculateTokenAmount(ctx: Context, tokenId: string, amount: number): Promise<string> {
    try {
      const validationResult = fastestValidator(generateRequestOnDevice, ctx.params)
      if (validationResult == true) {
        const getTokenCallingParameters: GeneralServiceRequests.getOne = {
          id: tokenId,
        }
        const token: Token = await ctx.call(
          "v1.token.getOne",
          getTokenCallingParameters
        )

        const getTokenPriceCallingParameters: getTokenPriceBySymbol =
          { symbol: token.shortName }
        const tokenPrice: tokenPrice = await ctx.call(
          "v1.token.getPrice",
          getTokenPriceCallingParameters
        )
        const tokenAmount = Big(amount)
          .div(tokenPrice.buyPrice)
          .prec(18)
          .toString()
        return tokenAmount
      } else {
        throw YFTError.InvalidRequest
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async updateTransaction(ctx: Context, userId: string, posId: string, transactionId: string, txHash: string, payerMobile?: string, customerWalletAddress?: string, isBlockchainConfirmed?: boolean, blockchainConfirmationsCount?: number
  ) {
    const update = {
      ...(txHash && { txHash: txHash }),
      ...(payerMobile && { payerMobile: payerMobile }),
      ...(customerWalletAddress && {
        customerWalletAddress: customerWalletAddress,
      }),
      ...(isBlockchainConfirmed && {
        isBlockchainConfirmed: isBlockchainConfirmed,
      }),
      ...(blockchainConfirmationsCount && {
        blockchainConfirmationsCount: blockchainConfirmationsCount,
      }),
    }
    await TransactionDBModel.findByIdAndUpdate(transactionId, update)
  }

  public async register(userId: string, posDeviceCode: string): Promise<PosDevice> {
    const newPosDevice = {
      userId: userId,
      posDeviceCode: posDeviceCode,
    }

    const posDevice = await PosDeviceDBModel.create(newPosDevice)
    return posDevice
  }

  // public async getAll(
  //   ctx: Context,
  //   isRequestedByAdmin = false
  // ): Promise<PosDeviceForClient[] | PosDevice[]> {
  //   const posDevices = await PosDeviceDBModel.find();
  //   const finalArray: any[] = [];
  //   posDevices.map((posDevice) => {
  //     if (isRequestedByAdmin) {
  //       finalArray.push(posDevice);
  //     } else {
  //       finalArray.push(this.PosDeviceForClient(ctx, posDevice));
  //     }
  //   });

  //   return finalArray;
  // }

  // public async getOneById(
  //   ctx: Context,
  //   blockchainId: string,
  //   isRequestedByAdmin = false
  // ): Promise<PosDeviceForClient | PosDevice> {
  //   const pos = await PosDeviceDBModel.findById(blockchainId);
  //   let preparedPos;
  //   if (isRequestedByAdmin) {
  //     preparedPos = pos;
  //   } else {
  //     preparedPos = this.PosDeviceForClient(ctx, pos);
  //   }
  //   return preparedPos;
  // }

  // public async deleteOne(id: string): Promise<string> {
  //   await PosDeviceDBModel.deleteOne({ _id: id });
  //   return "done";
  // }

  // public async count(): Promise<number> {
  //   const blockchainsCount = await PosDeviceDBModel.count();
  //   return blockchainsCount;
  // }

  public async createOrUpdateConfig(ctx: Context<setConfig, GeneralMetaRequests.RequestMetaData>): Promise<PosDevice> {
    const configProfileId = ctx.params.configProfileId
    const posId = ctx.params.posId
    const userId = ctx.meta.user._id.toHexString()

    const condition = {
      userId: userId,
      posDeviceCode: posId
    }

    const update = {
      userId: userId,
      posDeviceCode: posId,
      configProfileId: configProfileId,
    }

    const posConfigs = await super.createOrUpdateByCondition(condition, update, createOrUpdateConfig)
    return posConfigs
  }

  public async getOne(userId: string, posId: string): Promise<ConfigProfile> {
    const condition = {
      userId: userId,
      posId: posId,
    }

    const posConfigs = await super.getOne(condition)
    return posConfigs
  }

  public async getConfigs(userId: string): Promise<ConfigProfile> {
    const condition = {
      userId: userId,
    }

    const posConfigs = await super.getOne(condition)
    return posConfigs
  }

  public getLastVersion(): string {
    try {
      const baseUrl = process.env.SERVER_PUBLIC_URL
      const url = baseUrl + "/release/pos.apk"
      return url
    } catch (error) {
      console.log(error)
    }
  }
}
