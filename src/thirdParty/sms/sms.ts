import { ServiceBroker } from 'moleculer'
import Redis, { RedisKeyType } from '@Models/db/connectors/redis.db'
import { SMSAbstract } from './sms.abstract'
import KaveNegar from './kavenegar'
import farazsms from './farazsms'
import Dummy from './dummy'
import { smsOnRedisStatusInterface } from '@ServiceDomain/thirdParty/dto/interfaces/thirdpartyMessagingService.interface'
import { PossibleSMSProviders, smsOnRedisStatus } from '@ServiceDomain/thirdParty/dto/enums/thirdparty.enum'
export class SMS extends SMSAbstract {
  private static instance: SMS
  static provider: SMSAbstract

  public baseUrl: string
  public mobile: string
  public messageId: string
  private providerName: string
  private broker: ServiceBroker

  constructor() {
    super()
    this.decideWhichSmsProviderShouldBeUsed()
  }

  public static shared(): SMS {
    if (!SMS.instance) {
      const instance = new SMS()
      SMS.instance = instance
    }
    return SMS.instance
  }

  public async fetchAllDataFromRedis() {
    try {
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, '*')
      const keys = await redis.keys(smsStatusRecordKey)
      keys.map(async (item: string) => {
        const mobile: string = item.slice(item.indexOf('status:') + 7)
        const smsStatusForNumberRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
        const smsOnRedisStatus: smsOnRedisStatusInterface = JSON.parse(await redis.get(smsStatusForNumberRecordKey))
        // if (smsOnRedisStatus.status == 'blocked' || smsOnRedisStatus.status != 'deliverd' && smsOnRedisStatus.requestTime < Date.now() - 30000) {
        this.dispatcher('sms', smsOnRedisStatus, mobile, 'resend')
        // }
      })
    } catch (error) {
      console.log(error)
    }
  }

  private async dispatcher(target: string, options: smsOnRedisStatusInterface, mobile: string, action: string) {
    try {
      let smsOnRedisStatus
      switch (target) {
        case 'sms':
          if (options && options.messageId) {
            await this.fetchDataFromProvider(options.messageId, options.provider)
            await this.decideWhichSmsProviderShouldBeUsed(options)
            if (action == 'resend') {
              this.sendAuthSms(this.broker, mobile, options.code)
            }
          }
          break
        case 'user':
          if (options && options.mobile) {
            smsOnRedisStatus = await this.fetchDataFromRedis(options.mobile)
            await this.decideWhichSmsProviderShouldBeUsed(smsOnRedisStatus)
          }
          break
        case 'provider':
          await this.fetchProviderStatus(options.provider)
          break
      }
    } catch (error) {
      console.log(error)
    }
  }

  private async fetchDataFromProvider(messageId: string, provider: string) {
    try {
      return await SMS.provider.getMessageStatus(messageId)
    } catch (error) {
      console.log(error)
    }
  }

  private async fetchDataFromRedis(mobile: string): Promise<smsOnRedisStatusInterface> {
    try {
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
      const smsdataonredis = await redis.get(smsStatusRecordKey)
      return JSON.parse(smsdataonredis)
    } catch (error) {
      console.log(error)
    }
  }

  private async fetchProviderStatus(provider: string) {
    try {
      return ''
    } catch (error) {
      console.log(error)
    }
  }

  async getMessageStatus(provider: string) {
    try {
      return ''
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

  private async decideWhichSmsProviderShouldBeUsed(smsOnRedisStatus?: smsOnRedisStatusInterface) {
    try {
      let provider: string
      if (process.env.MODE == 'dev') {
        this.providerName = 'dummy'
      } else
        if (smsOnRedisStatus) {
          provider = smsOnRedisStatus.provider
          do {
            const temp = PossibleSMSProviders.filter((value) => {
              return value != provider
            })
            const randomIndex = Math.floor(Math.random() * temp.length)
            this.providerName = temp[randomIndex]
          } while (this.providerName == provider)
        } else {
          this.providerName = 'dummy'
        }

      switch (this.providerName) {
        case 'dummy':
          SMS.provider = new Dummy()
          break
        case 'kavenegar':
          SMS.provider = new KaveNegar()
          break
        case 'farazsms':
          SMS.provider = new farazsms()
          break
      }

    } catch (error) {
      console.log(error)
    }
  }

  public async sendAuthSms(broker: ServiceBroker, mobile: string, code: number): Promise<string> {
    try {
      this.broker = broker
      const result = await SMS.provider.sendAuthSms(broker, mobile, code)
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
      const smsStatusRecordvalue = {
        requestTime: Date.now(),
        provider: this.providerName,
        status: await this.fetchDataFromProvider(result, this.providerName),
        messageId: result,
        code: code
      }
      await redis.set(smsStatusRecordKey, JSON.stringify(smsStatusRecordvalue), 'ex', 120)
      return result
    } catch (error) {
      console.log(error)
    }
  }

  public async sendUserVerifiedSms(broker: ServiceBroker, mobile: string): Promise<string> {
    try {
      this.broker = broker
      const result = await SMS.provider.sendUserVerifiedSms(broker, mobile)
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
      const smsStatusRecordvalue = {
        requestTime: Date.now(),
        provider: this.providerName,
        status: await this.fetchDataFromProvider(result, this.providerName),
        messageId: result
      }
      await redis.set(smsStatusRecordKey, JSON.stringify(smsStatusRecordvalue), 'ex', 60)
      return result
    } catch (error) {
      console.log(error)
    }
  }

  public async sendUserRejectedSms(broker: ServiceBroker, mobile: string): Promise<string> {
    try {
      this.broker = broker
      const result = await SMS.provider.sendUserRejectedSms(broker, mobile)
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
      const smsStatusRecordvalue = {
        requestTime: Date.now(),
        provider: this.providerName,
        status: await this.fetchDataFromProvider(result, this.providerName),
        messageId: result
      }
      await redis.set(smsStatusRecordKey, JSON.stringify(smsStatusRecordvalue), 'ex', 60)
      return result
    } catch (error) {
      console.log(error)
    }
  }

  public async sendBuySuccessfulSms(broker: ServiceBroker, mobile: string, tokenType: string, tokenAmount: number): Promise<string> {
    try {
      this.broker = broker
      const result = await SMS.provider.sendBuySuccessfulSms(broker, mobile, tokenType, tokenAmount)
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
      const smsStatusRecordvalue = {
        requestTime: Date.now(),
        provider: this.providerName,
        status: await this.fetchDataFromProvider(result, this.providerName),
        messageId: result
      }
      await redis.set(smsStatusRecordKey, JSON.stringify(smsStatusRecordvalue), 'ex', 60)
      return result
    } catch (error) {
      console.log(error)
    }
  }

  public async sendSellSuccessfulSms(broker: ServiceBroker, mobile: string, tokenAmount: number, tokenType: string, priceFinalToman: number): Promise<string> {
    try {
      this.broker = broker
      const result = await SMS.provider.sendSellSuccessfulSms(broker, mobile, tokenAmount, tokenType, priceFinalToman)
      const redis = Redis.shared()
      const smsStatusRecordKey = redis.generateKey(RedisKeyType.SMSStatusRecord, mobile)
      const smsStatusRecordvalue = {
        requestTime: Date.now(),
        provider: this.providerName,
        status: await this.fetchDataFromProvider(result, this.providerName),
        messageId: result
      }
      await redis.set(smsStatusRecordKey, JSON.stringify(smsStatusRecordvalue), 'ex', 60)
      return result
    } catch (error) {
      console.log(error)
    }
  }

}
