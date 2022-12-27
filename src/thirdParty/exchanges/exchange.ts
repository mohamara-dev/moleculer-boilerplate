import { Context } from 'moleculer'
import ExchangeAbstract from './exchange.abstract'
import poolenoExchange from '@ThirdParty/exchanges/poolenoExchange'

export default class ExchangeController extends ExchangeAbstract {

  private static instance: ExchangeController
  static provider: ExchangeAbstract

  public baseUrl: string


  constructor(name: string) {
    super()
    this.decideWhichExchangeProviderShouldBeUsed(name)
  }

  public static shared(name: string): ExchangeController {
    if (!ExchangeController.instance) {
      const instance = new ExchangeController(name)
      ExchangeController.instance = instance
    }
    return ExchangeController.instance
  }

  public async getPrices(symbol: string, ctx?: Context): Promise<any> {
    const data = await ExchangeController.provider.getPrices(symbol)
    if (data) {
      return data
    }
  }

  private decideWhichExchangeProviderShouldBeUsed(name: string) {
    if (name == 'pooleno') {
      ExchangeController.provider = new poolenoExchange()
    }
    return ExchangeController
  }
}
