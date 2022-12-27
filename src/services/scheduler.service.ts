import LoggerController from '@ServiceDomain/basement/controllers/logger.controller'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { Context, Service, ServiceBroker } from 'moleculer'
import SchedulerController from '@ServiceDomain/basement/controllers/scheduler.controller'
// import QueueService  from "moleculer-bull" 
import genericServiceMixin from "./mixin/generic.service"

export default class scheduledService extends Service {

  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'scheduler',
      version: 1, 
      // mixins: [QueueService()],
      mixins: [genericServiceMixin],
      dependencies: [
      ], 
      
      actions: {

        startAllJobs: {
          async handler(ctx: Context<unknown, GeneralMetaRequests.RequestMetaData>) {
            await new SchedulerController(broker, this.name).scheduleAndStartJobs()
          }
        }
      }, 
    })
  }
}
