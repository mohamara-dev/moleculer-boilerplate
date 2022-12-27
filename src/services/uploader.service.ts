import UploaderController from '@ServiceDomain/basement/controllers/uploader.controller'
import { Context, Service, ServiceBroker } from 'moleculer'
import genericServiceMixin from "./mixin/generic.service"
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { uploadClassicBase64 } from '@ServiceDomain/basement/dto/uploader.interface'
export default class uploaderService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  myController = new UploaderController()
  /**
   * allow generic service actions due to options:
   * C : create
   * R : read
   * U : update
   * D : delete
   */
  private serviceGenericFeature = ''
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'uploader',
      version: 1,
      dependencies: [],
      mixins: [genericServiceMixin],
      actions: {
        upload: {
          rest: 'POST /classicBase64',
          // auth: true,
          async handler(ctx: Context<uploadClassicBase64, GeneralMetaRequests.RequestMetaData>): Promise<any> {
            const result = this.myController.uploadClassicBase64(ctx)
            return result
          }
        },
        streamUpload: {
          rest: 'POST /streamBase64',
          async handler(ctx: Context<never, GeneralMetaRequests.RequestMetaData>): Promise<any> {
            const result = this.myController.upload(ctx)
            return result
          }
        },
        base64Fetcher: {
          rest: 'GET /one',
          async handler(ctx: Context<any, GeneralMetaRequests.RequestMetaData>): Promise<any> {
            const result = this.myController.base64Fetcher(ctx.params.name)
            return result
          }
        },
      },
    })
  }
}
