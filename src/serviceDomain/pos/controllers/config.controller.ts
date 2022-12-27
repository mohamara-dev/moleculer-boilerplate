import ConfigProfileDBModel, { ConfigProfile } from '@ServiceDomain/pos/models/configProfile.DBmodel'
import { configForClient } from '@ServiceDomain/pos/dto/interfaces/configProfiles.interface'
import { Context, ServiceBroker } from 'moleculer'
import YFTController from '@ServiceDomain/yft.controller'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { createOrUpdateConfigProfile, addWallet } from '@ServiceDomain/pos/dto/interfaces/configProfiles.interface'
import { blockchainForClient } from '@ServiceDomain/blockchain/dto/interfaces/blockchain.interface'
import { tokenForClient } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'
import { addWalletTOConfigProfileValidation, createOrUpdateConfigProfileValidation } from '@ServiceDomain/pos/dto/validations/configProfile.validate'

export default class ConfigController extends YFTController {

  constructor() {
    super(ConfigProfileDBModel)
  }

  private static instance: ConfigController
  public static shared(): ConfigController {
    if (!ConfigController.instance) {
      const instance = new ConfigController()
      ConfigController.instance = instance
    }
    return ConfigController.instance
  }


  prepareSchema(client: string): any {
    if (client === "admin") {
      return {}
    } else {
      return { _id: 1, chainName: 1, name: 1, imageUrl: 1, chainId: 1 }
    }
  }

  prepare(item: any, requestClient?: string, broker?: ServiceBroker): any {
    const prepared = this.postPrepare(super.prepare(this.prepareSchema(requestClient)), broker)
    return prepared
  }

  private async postPrepare(configProfile: ConfigProfile, broker?: ServiceBroker): Promise<configForClient> {

    const supportedConfig = []
    for (const supports of configProfile.supportedTokenAndBlockchains) {
      const getTokenCallingParameters = { id: supports.tokenId, isRequestedByAdmin: false }
      const token: tokenForClient = await broker.call('v1.token.getOne', getTokenCallingParameters)
      const getBlockchainCallingParameters = { id: supports.blockchainId, isRequestedByAdmin: false }
      const blockchain: blockchainForClient = await broker.call('v1.blockchain.getOne', getBlockchainCallingParameters)

      supportedConfig.push({
        id: supports._id.toHexString(),
        blockchain: blockchain,
        token: token,
        walletAddress: supports.walletAddress
      })
    }
    const configForClient = {
      userId: configProfile.userId,
      posId: configProfile.posId,
      supportedTokenAndBlockchains: supportedConfig
    }
    return configForClient
  }

  public async getOneConfigById(configProfileId: string, userId: string): Promise<configForClient> {
    const condition = { _id: configProfileId, userId: userId }
    return super.getOne(condition)
  }

  public async getOneConfigByPosId(posId: string, userId: string): Promise<configForClient> {
    const condition = { posId: posId, userId: userId }
    return super.getOne(condition)
  }

  public async createOrUpdateConfig(ctx: Context<createOrUpdateConfigProfile, GeneralMetaRequests.RequestMetaData>): Promise<configForClient> {
    const condition = {
      userId: ctx.params.userId,
      posId: ctx.params.posId
    }
    const newProfile = {
      userId: ctx.params.userId,
      posId: ctx.params.posId,
      sendReceiveNotif: ctx.params.sendReceiveNotif,
      // supportedTokenAndBlockchains: ctx.params.supportedTokenAndBlockchains,
      // isDeleted: ctx.params.isDeleted,
    }
    return super.createOrUpdateByCondition(condition, newProfile, createOrUpdateConfigProfileValidation)
  }

  public async addWalletAddressToSupportedBlockchain(ctx: Context<addWallet, GeneralMetaRequests.RequestMetaData>): Promise<configForClient> {
    const condition = {
      userId: ctx.meta.user._id.toHexString(),
      posId: ctx.params.posId
    }

    const newWalletAddress = {
      blockchainId: ctx.params.blockchainId,
      tokenId: ctx.params.tokenId,
      walletAddress: ctx.params.walletAddress
    }

    const updateQuery = {
      $addToSet: { supportedTokenAndBlockchains: newWalletAddress }
    }
    return super.createOrUpdateByCondition(condition, updateQuery, addWalletTOConfigProfileValidation)
  }
}
