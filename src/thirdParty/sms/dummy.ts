import { ServiceBroker } from 'moleculer'
import { SMSAbstract } from './sms.abstract'
export default class Dummy extends SMSAbstract {
  baseUrl: string
 
  async sendAuthSms(broker: ServiceBroker, mobile: string, code: number): Promise<string> {
    console.log('mobile %s and code is %s', mobile, code)
    const messageId = Math.floor(Math.random() * (90000000 - 80000000 + 1) + 80000000).toString()
    return messageId
  }

  async sendUserVerifiedSms(broker: ServiceBroker, mobile: string): Promise<string> {
    console.log('mobile %s', mobile)
    const messageId = Math.floor(Math.random() * (90000000 - 80000000 + 1) + 80000000).toString()
    return messageId
  }

  async sendUserRejectedSms(broker: ServiceBroker, mobile: string): Promise<string> {
    console.log('mobile %s ', mobile)
    const messageId = Math.floor(Math.random() * (90000000 - 80000000 + 1) + 80000000).toString()
    return messageId
  }

  async sendBuySuccessfulSms(broker: ServiceBroker, mobile: string, tokenType: string, tokenAmount: number): Promise<string> {
    console.log('mobile %s and token type is %s and token amount is %s', mobile, tokenType, tokenAmount)
    const messageId = Math.floor(Math.random() * (90000000 - 80000000 + 1) + 80000000).toString()
    return messageId
  }

  async sendSellSuccessfulSms(broker: ServiceBroker, mobile: string, tokenAmount: number, tokenType: string, priceFinalToman: number): Promise<string> {
    console.log('mobile %s and token amount is %s and token type is %s and price final toman is %s', mobile, tokenAmount, tokenType, priceFinalToman)
    const messageId = Math.floor(Math.random() * (90000000 - 80000000 + 1) + 80000000).toString()
    return messageId
  }

  async getMessageStatus(messageid: string): Promise<string> {
    try {
      return 'blocked'
    } catch (error) {
      console.log(error)
    }
  }
  async getStatus(): Promise<boolean> {
    try {
      return true
    } catch (error) {
      console.log(error)
    }
  }
}
