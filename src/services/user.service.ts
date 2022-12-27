import { Context, Service, ServiceBroker } from 'moleculer'
import { AdminsPrivileges, YFTError } from '@Base/yft'
import { fastestValidator } from '@Helpers/validator'
import UserController from '@ServiceDomain/iam/controllers/user.controller'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import GeneralRequests from '@Types/interfaces/general.interface'
import genericServiceMixin from "./mixin/generic.service"

export default class userService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  private myController = new UserController()
  private myControllerShared = UserController.shared()
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
      name: 'user',
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
