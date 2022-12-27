import { Context, Service, ServiceBroker } from 'moleculer'
import { YFTError } from '@Base/yft'
import { fastestValidator } from '../helpers/validator'
import SMS from '@ThirdParty/sms/kavenegar'
import LoggerController from '@ServiceDomain/basement/controllers/logger.controller'
import { SendAuthSms, SendBuySuccessfulSms, SendSellSuccessfulSms, SendUserRejectedSms } from '@ServiceDomain/thirdParty/dto/interfaces/thirdpartyMessagingService.interface'
import { sendAuthSmsValidation, sendBuySuccessfulSmsValidation, sendSellSuccessfulSmsValidation, sendUserRejectedSmsValidation } from '@ServiceDomain/thirdParty/dto/validations/thirdpartyMessaging.validate'

export default class ThirdpartyMessagingService extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'thirdparty-messaging',
      version: 1,
      settings: {},
      dependencies: ['v1.logger'],
      actions: {
        sendAuthSms: {
          async handler(ctx: Context<SendAuthSms>): Promise<boolean> {
            const validationResult = fastestValidator(sendAuthSmsValidation, ctx.params)
            if (validationResult == true) {
              const mobile = ctx.params.mobile
              const code = ctx.params.code
              console.log(code)
              return true
              await new SMS().sendAuthSms(broker, mobile, code)
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'sendAuthSms', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest()
            }
          },
        },

        sendUserRejectedSms: {
          async handler(ctx: Context<SendUserRejectedSms>): Promise<boolean> {
            const validationResult = fastestValidator(sendUserRejectedSmsValidation, ctx.params)
            if (validationResult == true) {
              const mobile = ctx.params.mobile
              await new SMS().sendUserRejectedSms(this.broker, mobile)
              return true
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'sendUserRejectedSms', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest()
            }
          },
        },

        sendBuySuccessfulSms: {
          async handler(ctx: Context<SendBuySuccessfulSms>) {
            const validationResult = fastestValidator(sendBuySuccessfulSmsValidation, ctx.params)
            if (validationResult == true) {
              const mobile = ctx.params.mobile
              const tokenType = ctx.params.tokenType
              const tokenAmount = ctx.params.tokenAmount
              await new SMS().sendBuySuccessfulSms(broker, mobile, tokenType, tokenAmount)
              return true
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'sendBuySuccessfulSms', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest()
            }
          },
        },

        sendSellSuccessfulSms: {
          async handler(ctx: Context<SendSellSuccessfulSms>) {
            const validationResult = fastestValidator(sendSellSuccessfulSmsValidation, ctx.params)
            if (validationResult == true) {
              const mobile = ctx.params.mobile
              const tokenAmount = ctx.params.tokenAmount
              const tokenType = ctx.params.tokenType
              const priceFinalToman = ctx.params.priceFinalToman
              await new SMS().sendSellSuccessfulSms(broker, mobile, tokenAmount, tokenType, priceFinalToman)
              return true
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'sendSellSuccessfulSms', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest()
            }
          },
        },
      },

      created() {
        // broker.call('v1.logger.serviceStatusChanged', {serviceName: this.name, status: 'created'})
      },

      async started() {
        broker.call('v1.logger.serviceStatusChanged', {
          serviceName: this.name,
          status: 'started',
        })
      },

      async stopped() {
        broker.call('v1.logger.serviceStatusChanged', {
          serviceName: this.name,
          status: 'stopped',
        })
      },
    })
  }
}
