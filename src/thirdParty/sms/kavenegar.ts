import axios, {AxiosRequestConfig} from 'axios'
import { ServiceBroker } from 'moleculer'
import qs from 'querystring'
import { YFTError } from '@Base/yft'
// import AlertController from '@Controllers/alert.controller'
import LoggerController from '@ServiceDomain/basement/controllers/logger.controller'
import { SMSAbstract } from './sms.abstract'

export default class KaveNegar extends SMSAbstract {
  baseUrl = `${process.env.KAVENEGAR_URL}${process.env.KAVENEGAR_API_KEY}`
  private mobile
  constructor(mobile?: string) {
    super()
    this.mobile = mobile
  }

  async sendAuthSms(broker: ServiceBroker, mobile: string, code: number): Promise<string> {
    const template = process.env.KAVENEGAR_SMS_AUTH_TEMPLATE
    const messageId = await this.sendSms(broker, template, mobile, code)
    return messageId
  }

  async sendUserVerifiedSms(broker: ServiceBroker, mobile: string): Promise<string> {
    const template = process.env.KAVENEGAR_SMS_USER_VERIFIED_TEMPLATE
    const messageId = await this.sendSms(broker, template, mobile, mobile)
    return messageId
  }

  async sendUserRejectedSms(broker: ServiceBroker, mobile: string): Promise<string> {
    const template = process.env.KAVENEGAR_SMS_USER_REJECTED_TEMPLATE
    const messageId = await this.sendSms(broker, template, mobile, mobile)
    return messageId
  }

  async sendBuySuccessfulSms(broker: ServiceBroker, mobile: string, tokenType: string, tokenAmount: number): Promise<string> {
    const template = process.env.KAVENEGAR_SMS_BUY_SUCCESSFUL_TEMPLATE
    const messageId = await this.sendSms(broker, template, mobile, tokenType, tokenAmount)
    return messageId
  }

  async sendSellSuccessfulSms(broker: ServiceBroker, mobile: string, tokenAmount: number, tokenType: string, priceFinalToman: number): Promise<string> {
    const template = process.env.KAVENEGAR_SMS_SELL_SUCCESSFUL_TEMPLATE
    const messageId = await this.sendSms(broker, template, mobile, tokenAmount, tokenType, priceFinalToman)
    return messageId
  }

  private async sendSms(broker: ServiceBroker, template: string, mobile: string, ...params: (string | number)[]) {
    let body = {
      receptor: mobile,
      template: template
    }
    if (params[0]) {
      body = Object.assign({token: params[0]}, body)
    }
    if (params[1]) {
      body = Object.assign({token2: params[1]}, body)
    }
    if (params[2]) {
      body = Object.assign({token3: params[2]}, body)
    }
    const url = this.baseUrl + '/verify/lookup.json'
    const requestConfig: AxiosRequestConfig = {
      url: url,
      method: 'POST',
      data: qs.stringify(body),
      headers: {
        'Content-Length': qs.stringify(body).length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
    try {
      const data = await axios(requestConfig)
      const messageId = `${data.data.entries[0].messageid}`
      return messageId
    } catch (error) {
      const title = `Kavenegar :: ${error.message}`
      // new AlertController().publishAlert('kyc', 'alert', title, error?.response?.data?.return?.message, error.stack, body)
      // broker.call('v1.logger.logThirdpartyApiCallFailed', {
      //   serviceName: '',
      //   thirdpartyName: 'kavenegar',
      //   apiName: 'sendSms',
      //   url: url,
      //   error: error.message,
      //   stack: error.stack, 
      //   additionalInfo: {
      //     body: body 
      //   }}
      // )
      LoggerController.shared()
      throw YFTError.InternalServerError
    }
  }

  async getMessageStatus(messageid: string): Promise<string> {
    try {
      const url = this.baseUrl + `/sms/status.json?messageid=${messageid}`
      const response = await fetch(url)
      console.log('response', response)
      const result = (await response.json())
      console.log('result', result)
      let statusResult:string
      for (let i = 0; result.entries.length; i++) {
        if (result.entries[i].status == 14) {
          statusResult = 'userBlocked'
          console.log(result.entries[i].receptor, 'لیست سیاه مخابرات')
        }
        if (result.entries[i].status != 10) {
          statusResult = 'deliverd'
        } else {
          // this.decider()
        }
      }
      return statusResult
    } catch (error) {
      console.log(error)
    }
  }

  async getStatus(): Promise<boolean> {
    try {
      const url = this.baseUrl + '/utils/getdate.json'
      const response = await fetch(url)
      const result = (await response.json())
      if (result.return) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
  }
}
