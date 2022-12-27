import { Context } from "moleculer"
import GeneralRequests from "@Types/interfaces/general.interface"
import GeneralMetaRequests from "@Types/interfaces/generalMeta.interface"
import { YFTError } from "@Base/yft"

const genericServiceMixin = {
  actions: {
    serviceHealthCheckGeneric: {
      rest: "GET /health-check",
      async handler(): Promise<string> {
        return this.healthCheck()
      },
    },

    controllerHealthCheckGeneric: {
      rest: "GET /health-check-controller",
      async handler(): Promise<string> {
        return this.myController.healthCheck()
      },
    },

    getOne: {
      rest: "GET /:id",
      async handler(ctx: Context<GeneralRequests.getOne, GeneralMetaRequests.RequestMetaData>) {
        if (this.serviceGenericFeature.includes('R')) {
          const id = ctx.params.id
          const data = await this.myControllerShared.getOneById(ctx, id)
          return data
        } else {
          this.logger.info(this.name, 'read Action Not Supported')
          throw YFTError.ServiceNotSupportThisAction(this.name, this.broker.nodeID)
        }
      }
    },

    getAll: {
      rest: "GET /",
      async handler(ctx: Context<GeneralRequests.getAll, GeneralMetaRequests.RequestMetaData>) {
        if (this.serviceGenericFeature.includes('R')) {
          const data = await this.myControllerShared.getAll(null, ctx.params.page, null, ctx.params.count)
          return data
        } else {
          this.logger.info(this.name, 'read Action Not Supported')
          throw YFTError.ServiceNotSupportThisAction(this.name, this.broker.nodeID)
        }
      }
    },

    count: {
      rest: "GET /count",
      async handler(ctx: Context<never, GeneralMetaRequests.RequestMetaData>) {
        if (this.serviceGenericFeature.includes('R')) {
          const data = await this.myControllerShared.count()
          return data
        } else {
          this.logger.info(this.name, 'count Action Not Supported')
          throw YFTError.ServiceNotSupportThisAction(this.name, this.broker.nodeID)
        }
      }
    },

    createOrUpdate: {
      async handler(ctx: Context<any, GeneralMetaRequests.RequestMetaData>) {
        if (this.serviceGenericFeature.includes('C') || this.serviceGenericFeature.includes('U')) {
          const data = await this.myController.createOrUpdate(ctx.params.params, ctx.params.meta.validationSchema)
          return data
        } else {
          this.logger.info(this.name, 'create and edit Action Not Supported')
          throw YFTError.ServiceNotSupportThisAction(this.name, this.broker.nodeID)
        }
      }
    },

    createOrUpdateConditional: {
      async handler(ctx: Context<any, GeneralMetaRequests.RequestMetaData>) {
        if (this.serviceGenericFeature.includes('C') || this.serviceGenericFeature.includes('U')) {
          const data = await this.myController.createOrUpdateByCondition(ctx)
          return data
        } else {
          this.logger.info(this.name, 'create and edit Action Not Supported')
          throw YFTError.ServiceNotSupportThisAction(this.name, this.broker.nodeID)
        }
      }
    },

    deleteOne: {
      async handler(ctx: Context<GeneralRequests.deleteOne, GeneralMetaRequests.RequestMetaData>) {
        if (this.serviceGenericFeature.includes('D')) {
          const id = ctx.params.id
          const data = await this.myControllerShared.delete(ctx, id)
          return data
        } else {
          this.logger.info(this.name, 'delete Action Not Supported')
          throw YFTError.ServiceNotSupportThisAction(this.name, this.broker.nodeID)
        }
      }
    }
  },
  methods: {
    healthCheck(): string {
      return "Works"
    }
  },
  created() {
    // broker.call('v1.logger.serviceStatusChanged', {serviceName: this.name, status: 'created'})
    this.logger.info(this.name, 'created')
  },

  async started() {
    // broker.call('v1.logger.serviceStatusChanged', { serviceName: this.name, status: 'started' })
  },

  async stopped() {
    // broker.call('v1.logger.serviceStatusChanged', { serviceName: this.name, status: 'stopped' })
  }
}
export default genericServiceMixin;

