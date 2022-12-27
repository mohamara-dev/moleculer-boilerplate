import { Context } from 'moleculer'
import * as fs from 'fs-extra'
import * as path from 'path'
import { YFTError } from '@Base/yft'
import { uploadClassicBase64 } from '../dto/uploader.interface'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'

export default class UploaderController {

  public uploadClassicBase64(ctx: Context<uploadClassicBase64, GeneralMetaRequests.RequestMetaData>) {
    try {
      // const user = ctx.meta.user
      const baseFolder = path.join(__dirname, '../../../../public/upload/')
      const newFolder = baseFolder + 'me' + '/'
      const filePath = newFolder + Date.now()
      fs.mkdir(newFolder, { recursive: true })
      fs.writeFile(filePath, ctx.params.value.base64, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.", filePath);
      });
      return filePath.replace('/app/public/upload/', '')
    } catch (error) {
      console.log(error)
    }
  }
  public base64Fetcher(comabinedName: string) {
    try {
      const baseFolder = path.join(__dirname, '../../../../public/upload/', comabinedName)
      return fs.readFile(baseFolder)
    } catch (error) {
      console.log(error)
    }
  }
}
