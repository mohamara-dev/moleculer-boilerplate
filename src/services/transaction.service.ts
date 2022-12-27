import { Context, Service, ServiceBroker } from 'moleculer'
import { AdminsPrivileges, YFTError } from '@Base/yft'
import { fastestValidator } from '@Helpers/validator'
import transactionController from '@ServiceDomain/pos/controllers/transaction.controller'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import GeneralRequests from '@Types/interfaces/general.interface'
import genericServiceMixin from "./mixin/generic.service"

export default class transactionService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  private myController = new transactionController()
  private myControllerShared = transactionController.shared()
  /**
 * allow generic service actions due to options:
 * C : create
 * R : read
 * U : update
 * D : delete
 */
  private serviceGenericFeature = 'CRUD'
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'transaction',
      version: 1,
      settings: {},
      mixins: [genericServiceMixin],
      dependencies: [],
      actions: {
      },
      methods: {
      }
    })
  }
}
