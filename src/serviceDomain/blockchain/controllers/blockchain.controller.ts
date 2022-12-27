import BlockchainDBModel, { Blockchain } from '@ServiceDomain/blockchain/models/blockchain.DBmodel'
import SupportedBlockchainNetworkDBModel, { SupportedBlockchainNetwork } from '@ServiceDomain/blockchain/models/supportedBlockchainNetwork.DBmodel'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { createOrUpdateBlockchain } from '@ServiceDomain/blockchain/dto/validations/blockchain.validate'
import { Context } from 'moleculer'
import YFTController from "@ServiceDomain/yft.controller"
import { createOrUpdateOneBlockchainInterface, blockchainForClient } from '@ServiceDomain/blockchain/dto/interfaces/blockchain.interface'

export default class BlockchainController extends YFTController {
  constructor() {
    super(BlockchainDBModel, {})
  }

  private static instance: BlockchainController
  public static shared(): BlockchainController {
    if (!BlockchainController.instance) {
      const instance = new BlockchainController()
      BlockchainController.instance = instance
    }
    return BlockchainController.instance
  }

  prepareSchema(client: string): any {
    if (client === "admin") {
      return {}
    } else {
      return { _id: 1, chainName: 1, name: 1, imageUrl: 1, chainId: 1 }
    }
  }

  prepare(item: any, requestClient?: string): any {
    const prepared = this.postPrepare(super.prepare(this.prepareSchema(requestClient)))
    return prepared
  }

  private postPrepare(blockchain: Blockchain): blockchainForClient {
    const preparedImageUrl =
      process.env.SERVER_PUBLIC_URL + blockchain.imageUrl
    const blockchainForClient = {
      displayName: blockchain.chainName,
      name: blockchain.name,
      imageUrl: preparedImageUrl,
      id: blockchain._id.toHexString(),
      chainId: blockchain.chainId,
    }
    return blockchainForClient
  }

  public async getOneByName(blockchainName: string, isRequestedByAdmin = false): Promise<blockchainForClient | Blockchain> {
    const blockchain = await BlockchainDBModel.findOne({
      name: blockchainName,
    })
    let preparedBlockchain
    if (isRequestedByAdmin) {
      preparedBlockchain = blockchain
    } else {
      preparedBlockchain = this.postPrepare(blockchain)
    }
    return preparedBlockchain
  }

  public async createOrUpdate(ctx: Context<createOrUpdateOneBlockchainInterface, GeneralMetaRequests.RequestMetaData>): Promise<Blockchain> {
    ctx.params.imageUrl = ctx.params.imageUrl.replace(
      process.env.SERVER_PUBLIC_URL,
      ""
    )

    return super.createOrUpdate(ctx.params, createOrUpdateBlockchain)
  }



  public async getSupportedBlockchainNetwork(tokenId: string, blockchainId: string): Promise<SupportedBlockchainNetwork> {
    const supportedBlockchainNetwork = await SupportedBlockchainNetworkDBModel.findOne({
      blockchainId,
      tokenId
    })
    return supportedBlockchainNetwork
  }

}
