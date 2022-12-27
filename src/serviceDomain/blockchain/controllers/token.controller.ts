import TokenDBModel, { Token } from '@ServiceDomain/blockchain/models/token.DBmodel'
import { SupportedBlockchainNetwork } from '@ServiceDomain/blockchain/models/supportedBlockchainNetwork.DBmodel'
import { createOrUpdateOneToken, tokenForClient, tokenPrice, getTokenPriceBySymbol } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'
import { Blockchain } from '@ServiceDomain/blockchain/models/blockchain.DBmodel'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { Context, ServiceBroker } from 'moleculer'
import ExchangeController from '@ThirdParty/exchanges/exchange'
import YFTController from "@ServiceDomain/yft.controller"
import { YFTError } from '@Base/yft'
import { fastestValidator } from '@Helpers/validator'
import { createOrUpdateTokenValidation, getTokenPriceBySymbolValidation } from '@ServiceDomain/blockchain/dto/validations/token.validate'
export default class TokenController extends YFTController {
  broker: ServiceBroker
  constructor(broker?: ServiceBroker) {
    super(TokenDBModel)
    this.broker = broker
  }
  private static instance: TokenController

  public static shared(): TokenController {
    if (!TokenController.instance) {
      const instance = new TokenController()
      TokenController.instance = instance
    }
    return TokenController.instance
  }

  private async prepareForClient(token: Token, blockchainId?: string): Promise<tokenForClient> {
    let contract
    if (blockchainId) {
      const getSupportedBlockchainNetworkCallingParams = { tokenId: token._id.toString(), blockchainId }
      const support: SupportedBlockchainNetwork = await this.broker.call('v1.blockchain.getSupportedBlockchainNetwork', getSupportedBlockchainNetworkCallingParams)
      contract = support.contract
    }
    const preparedImageUrl = process.env.SERVER_PUBLIC_URL + token.imageUrl
    const tokenForClient = {
      shortName: token.shortName,
      longNameEn: token.longNameEn,
      imageUrl: preparedImageUrl,
      ...(contract && { contract: contract }),
      id: token._id.toHexString(),
    }
    return tokenForClient
  }

  public async getOneToken(tokenId: string, blockchainId?: string): Promise<tokenForClient | Token> {
    const token = await super.getOneById(null, tokenId)
    const preparedToken = this.prepareForClient(token, blockchainId)
    return preparedToken
  }

  public async createOrUpdateToken(ctx: Context<createOrUpdateOneToken, GeneralMetaRequests.RequestMetaData>): Promise<Token> {

    const imageUrl = ctx.params.imageUrl
    const supportedBlockchainNetworks: any = ctx.params.supportedBlockchainNetworks ? ctx.params.supportedBlockchainNetworks : null

    const blockchainNetworks: any = []
    if (supportedBlockchainNetworks && supportedBlockchainNetworks.length > 0) {
      for (const supportedBlockchainNetwork of supportedBlockchainNetworks) {
        const getBlockchainCallingParameters = {
          id: supportedBlockchainNetwork.blockchainId,
          isRequestedByAdmin: true,
        }
        const blockchain: Blockchain = await ctx.call("v1.blockchain.getOne", getBlockchainCallingParameters)

        const network = {
          isNative: supportedBlockchainNetwork.isNative,
          blockchainName: blockchain.networkNameInBinanceApis,
          blockchainId: blockchain._id.toHexString(),
          decimals: supportedBlockchainNetwork.decimals,
          decimalsToShow: supportedBlockchainNetwork.decimalsToShow,
          contract: supportedBlockchainNetwork.contract,
          chainId: blockchain.chainId,
        }

        blockchainNetworks.push(network)
      }
    }

    const longNameEnTrimmed = ctx.params.longNameEn
      .replace(new RegExp("[-]", "g"), "")
      .replace(new RegExp("[ ]", "g"), "")
      .toLowerCase()
    const preparedImageUrl = imageUrl.replace(
      process.env.SERVER_PUBLIC_URL,
      ""
    )

    const newToken = {
      id: ctx.params.id,
      shortName: ctx.params.shortName,
      pricingMarketSymbolsToUsdt: ctx.params.pricingMarketSymbolsToUsdt,
      longNameEn: ctx.params.longNameEn,
      longNameFa: ctx.params.longNameFa,
      imageUrl: preparedImageUrl,
      longNameEnTrimmed: longNameEnTrimmed,
      sortingPosition: ctx.params.sortingPosition,
      blockchainNetworks: blockchainNetworks,
    }

    const token = await super.createOrUpdate(newToken, createOrUpdateTokenValidation)
    return token


  }

  public async getTokenPriceByTokenSymbol(ctx: Context<getTokenPriceBySymbol, GeneralMetaRequests.RequestMetaData>): Promise<tokenPrice> {
    try {
      const validationResult = fastestValidator(getTokenPriceBySymbolValidation, ctx.params)
      if (validationResult == true) {
        const price = await ExchangeController.shared("pooleno").getPrices(
          ctx.params.symbol
        )
        return price
      } else {
        throw YFTError.InvalidRequest
      }
    } catch (error) {
      console.log(error)
    }
  }
}
