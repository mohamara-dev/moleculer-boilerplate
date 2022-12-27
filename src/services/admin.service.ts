import { Context, Service, ServiceBroker } from "moleculer";
import { AdminsPrivileges, YFTError } from "@Base/yft";
import { fastestValidator } from "@Helpers/validator";
import adminController from "@ServiceDomain/admin/controllers/admin.controller"
import GeneralMetaRequests from "@Types/interfaces/generalMeta.interface";
import GeneralRequests from "@Types/interfaces/general.interface";
import genericServiceMixin from "./mixin/generic.service"

export default class adminService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  private myController = new adminController()
  //  private myControllerShared = adminController.shared()
  public constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: "admin",
      version: 1,
      settings: {},
      dependencies: [],
      mixins: [genericServiceMixin],
      actions: {

        // users
        getOneUserById: {
          rest: "GET /user",
          privilegesNeeded: [AdminsPrivileges.SuperAdmin],
          async handler(ctx: Context<GeneralRequests.deleteOne, GeneralMetaRequests.RequestMetaData>) {
            const userId = ctx.params.id;
            const data = await new adminController().getOneUserById(userId);
            return data;
          },
        },

        getAllUsers: {
          rest: "GET /users",
          privilegesNeeded: [AdminsPrivileges.SuperAdmin],
          async handler(ctx: Context<GeneralRequests.getAll, GeneralMetaRequests.RequestMetaData>) {
            const data = await new adminController().getAllUsers();
            return data;
          },
        },
      },

    });
  }


}
