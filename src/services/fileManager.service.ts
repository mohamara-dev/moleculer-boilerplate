import { Context, Service, ServiceBroker } from 'moleculer'
import { YFTError } from '@Base/yft'
import { fastestValidator } from '../helpers/validator'
import FileManagerController, { IncomingFile } from '@ServiceDomain/basement/controllers/fileManager.controller'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import multiparty from 'multiparty'
import genericServiceMixin from "./mixin/generic.service"
import { editFolder, getFolder, getProperties, paste, upload } from '@ServiceDomain/basement/dto/interfaces/fileManagerService.interface'

export default class fileManagerService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  private myController = new FileManagerController()
  //  private myControllerShared = FileManagerController.shared()
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'fileManager',
      version: 1,
      settings: {},
      dependencies: [],
      mixins: [genericServiceMixin],
      actions: {
        folderRoot: {
          rest: 'POST /folder/root',
          async handler(ctx: Context<never, GeneralMetaRequests.RequestMetaData>) {
            const data = await new FileManagerController().getRoot()
            return data
          }
        },
        folderList: {
          rest: 'POST /folder/list',
          async handler(ctx: Context<getFolder, GeneralMetaRequests.RequestMetaData>) {
            const folderPath = ctx.params.folderPath
            const folderPureName = ctx.params.folderPureName
            const data = await new FileManagerController().getFolder(folderPath, folderPureName)
            return data
          }
        },
        folderCreate: {
          rest: 'POST /folder/create',
          async handler(ctx: Context<getFolder, GeneralMetaRequests.RequestMetaData>) {
            const folderPath = ctx.params.folderPath
            const folderPureName = ctx.params.folderPureName
            const data = await new FileManagerController().CreateFolder(folderPath, folderPureName)
            return data
          }
        },
        getProperties: {
          rest: 'POST /folder/properties',
          async handler(ctx: Context<getProperties, GeneralMetaRequests.RequestMetaData>) {
            const folderPath = ctx.params.folderPath
            const ext = ctx.params.ext
            const data = await new FileManagerController().getProperties(folderPath, ext)
            return data
          }
        },
        remove: {
          rest: 'POST /folder/remove',
          async handler(ctx: Context<getFolder, GeneralMetaRequests.RequestMetaData>) {
            const folderPath = ctx.params.folderPath
            const folderPureName = ctx.params.folderPureName
            const data = await new FileManagerController().removeFile(folderPath, folderPureName)
            return data
          }
        },
        edit: {
          rest: 'POST /folder/edit',
          async handler(ctx: Context<editFolder, GeneralMetaRequests.RequestMetaData>) {
            const changedName = ctx.params.changedName
            const primaryName = ctx.params.primaryName
            const folderPureName = ctx.params.folderPureName
            const data = await new FileManagerController().edit(folderPureName, primaryName, changedName)
            return data
          }
        },
        paste: {
          rest: 'POST /folder/paste',
          async handler(ctx: Context<paste, GeneralMetaRequests.RequestMetaData>) {
            const initPath = ctx.params.initPath
            const operation = ctx.params.operation
            const folderPath = ctx.params.folderPath
            const folderPureName = ctx.params.folderPureName
            const data = await new FileManagerController().paste(folderPureName, folderPath, initPath, operation)
            return data
          }
        },
        upload: {
          rest: 'POST /uploader',
          async handler(ctx: Context<upload, GeneralMetaRequests.RequestMetaData>) {
            const incomingData = await this.parseFiles(ctx)
            const folderPath = incomingData.fields.folderPath
            const data = await new FileManagerController().upload(folderPath, incomingData.files)
            return data
          }
        }
      },
    })
  }
  private async parseFiles(ctx: Context<unknown, GeneralMetaRequests.RequestMetaData>): Promise<{ files: Array<IncomingFile>, fields: any }> {
    return new Promise((resolve, reject) => {
      new multiparty.Form().parse(ctx.meta.request, (err, fields, files) => {
        if (err) {
          return reject(err)
        }
        resolve({ files: files, fields: fields })
      })
    })
  }

}
