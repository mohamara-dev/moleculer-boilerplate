import Big from 'big.js'
import ExchangeAbstract from './exchange.abstract'
import axios, { AxiosRequestConfig } from 'axios'
import { tokenPrice } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'


export default class poolenoExchange extends ExchangeAbstract {
  baseUrl: string
  apikey: string
  constructor() {
    super()
    this.baseUrl = process.env.POOLENO_API_BASE_URL
  }

  public async getPrices(symbol: string): Promise<tokenPrice> {
    try {
      const apiEndpoint = '/token/pricing/'
      const requestParams = symbol
      const result = await this.sendRequest(apiEndpoint + requestParams)

      return result
    } catch (error) {
      console.log(error)
    }
  }

  private async sendRequest(requestParams: string): Promise<any> {
    try {
      const URLParams = `${requestParams}`
      const requestConfig: AxiosRequestConfig = {
        url: this.baseUrl + URLParams,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
      const data = await axios(requestConfig)
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

}
