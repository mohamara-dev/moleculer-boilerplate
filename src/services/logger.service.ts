import { Context, Service, ServiceBroker } from 'moleculer'
import LoggerController from '@ServiceDomain/basement/controllers/logger.controller'
import genericServiceMixin from "./mixin/generic.service"
import { LogThirdpartyApiCallFailed, LogThirdpartyApiCallSucceeded, ServiceStatusChanged } from '@ServiceDomain/basement/dto/interfaces/loggerService.interface'


export default class loggerService extends Service {
  /**
   * myController and myControllerShared is used in generic service to call generic methods
   * these are not used directly in this service
   */
  //  private myController = new LoggerController()
  private myControllerShared = LoggerController.shared()
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'logger',
      version: 1,
      settings: {},
      dependencies: [],
      mixins: [genericServiceMixin],
      actions: {

        serviceStatusChanged: {
          async handler(ctx: Context<ServiceStatusChanged>): Promise<void> {
            const serviceName = ctx.params.serviceName
            const status: any = ctx.params.status
            LoggerController.shared().recordServiceStatusChangedLog(serviceName, status)
          }
        },

        logThirdpartyApiCallSucceeded: {
          async handler(ctx: Context<LogThirdpartyApiCallSucceeded>): Promise<void> {
            const serviceName = ctx.params.serviceName
            const thirdpartyName = ctx.params.thirdpartyName
            const apiName = ctx.params.apiName
            const url = ctx.params.url
            const additionalInfo = ctx.params.additionalInfo
            LoggerController.shared().recordThirdPartyApiCallSucceededLog(serviceName, thirdpartyName, apiName, url, additionalInfo)
          }
        },

        logThirdpartyApiCallFailed: {
          async handler(ctx: Context<LogThirdpartyApiCallFailed>): Promise<void> {
            const serviceName = ctx.params.serviceName
            const thirdpartyName = ctx.params.thirdpartyName
            const apiName = ctx.params.apiName
            const url = ctx.params.url
            const error = ctx.params.error
            const stack = ctx.params.stack
            const additionalInfo = ctx.params.additionalInfo
            await LoggerController.shared().recordThirdpartyApiCallFailedLog(serviceName, thirdpartyName, apiName, url, error, stack, additionalInfo)
          }
        }

      },
    })
  }
}
