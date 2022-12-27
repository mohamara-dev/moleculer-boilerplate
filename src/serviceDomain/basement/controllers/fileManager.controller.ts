import { YFTError } from '@Base/yft'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Duplex } from 'stream'

class UploadableFile {
  public name: string
  public stream: fs.ReadStream | Duplex
}
export class IncomingFile extends UploadableFile {
  public fieldName: string
  public contentDisposition: string
  public contentType: string
  public originalFilename: string
  public tempPath: string

  constructor(obj: Record<string, any>) {
    super()
    this.fieldName = obj['fieldName']
    this.contentDisposition = obj['headers']['content-disposition']
    this.contentType = obj['headers']['content-type']
    this.originalFilename = obj['originalFilename']
    const path = obj['path']
    this.tempPath = path
    this.name = path.substring(path.lastIndexOf('/') + 1) // the name of the selected file
    this.stream = fs.createReadStream(path)
  }
}


export default class FileManagerController {

  public async getRoot(): Promise<any> {
    try {
      const re = /(?:\.([^.]+))?$/
      const folder = path.join(__dirname, '../../../../public/upload/')
      const folderContent = fs.readdirSync(folder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      const fileContent = fs.readdirSync(folder, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => {
          return { name: dirent.name, pureName: dirent.name.replace(re.exec(dirent.name)[0], ''), ext: re.exec(dirent.name)[1] }
        })
      const rootResult = { folders: folderContent, files: fileContent, path: folder, url: process.env.SERVER_PUBLIC_URL }
      return rootResult

    } catch (error) {
      console.error(error)
    }
  }
  public async getFolder(folderPath: string, folderPureName: string): Promise<any> {
    try {
      const re = /(?:\.([^.]+))?$/
      const folderContent =
        fs.readdirSync(folderPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
      const fileContent = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => {
          return { name: dirent.name, pureName: dirent.name.replace(re.exec(dirent.name)[0], ''), ext: re.exec(dirent.name)[1] }
        })
      const folderResult = { folders: folderContent, files: fileContent, path: folderPath, url: folderPureName }
      return folderResult

    } catch (error) {
      console.error(error)
    }
  }
  public async CreateFolder(folderPath: string, folderPureName: string): Promise<any> {
    try {
      const re = /(?:\.([^.]+))?$/
      folderPath = folderPath.replace(/\s/g, '-')
      if (!fs.existsSync(folderPath)) {
        await fs.mkdirSync(folderPath)
      }
      const folderContent =
        fs.readdirSync(folderPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
      const fileContent = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => {
          return { name: dirent.name, pureName: dirent.name.replace(re.exec(dirent.name)[0], ''), ext: re.exec(dirent.name)[1] }
        })

      const folderResult = { folders: folderContent, files: fileContent, path: folderPath, url: folderPureName }
      return folderResult

    } catch (error) {
      console.error(error)
    }
  }

  public async edit(folderPureName: string, primaryName: string, changedName: string): Promise<any> {
    try {
      const re = /(?:\.([^.]+))?$/

      await fs.renameSync(primaryName, changedName)

      const folderPath = path.join(changedName, '../')

      const folderContent =
        fs.readdirSync(folderPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
      const fileContent = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => {
          return { name: dirent.name, pureName: dirent.name.replace(re.exec(dirent.name)[0], ''), ext: re.exec(dirent.name)[1] }
        })
      const folderResult = { folders: folderContent, files: fileContent, path: folderPath, url: folderPureName }
      return folderResult

    } catch (error) {
      console.error(error)
    }
  }

  private copyFileSync(source: string, target: string) {
    let targetFile = target
    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
      if (fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source))
      }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source))
  }

  private copyFolderRecursiveSync(source: string, target: string) {
    let files = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    //check if folder needs to be created or integrated
    const targetFolder = path.join(target)
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder)
    }
    //copy
    if (fs.lstatSync(source).isDirectory()) {
      files = fs.readdirSync(source)
      files.forEach(function (file) {
        const curSource = path.join(source, file)
        if (fs.lstatSync(curSource).isDirectory()) {
          _this.copyFolderRecursiveSync(curSource, targetFolder)
        } else {
          _this.copyFileSync(curSource, targetFolder)
        }
      })
    }
  }

  public async paste(folderPureName: string, folderPath: string, initPath: string, operation: string): Promise<any> {
    try {
      const re = /(?:\.([^.]+))?$/
      if (operation == 'cut') {
        fs.renameSync(initPath, folderPath)
      } else {
        this.copyFolderRecursiveSync(folderPath, initPath)
      }
      folderPath = path.join(folderPath, '../')

      const folderContent =
        fs.readdirSync(folderPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
      const fileContent = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => {
          return { name: dirent.name, pureName: dirent.name.replace(re.exec(dirent.name)[0], ''), ext: re.exec(dirent.name)[1] }
        })
      const folderResult = { folders: folderContent, files: fileContent, path: folderPath, url: folderPureName }
      return folderResult

    } catch (error) {
      console.error(error)
    }
  }

  public async upload(folderPath: string, files: any): Promise<any> {
    try {
      const filesPath = folderPath
      let tempFilePath
      if (!files) {
        throw YFTError.InternalServerError
      }
      const file = files
      for (let i = 0; i < Object.keys(file).length; i++) {
        const dd = file[Object.keys(file)[i]]
        const fileX = dd[Object.keys(dd)[0]]

        tempFilePath = filesPath + '/' + fileX.fieldName.replace(/\s/g, '-')
        const readStream = fs.createReadStream(fileX.path)
        const writeStream = fs.createWriteStream(tempFilePath)
        readStream.pipe(writeStream)
      }

      const folderResult = 'done'
      return folderResult

    } catch (error) {
      console.error(error)
    }
  }

  public async removeFile(folderPath: string, folderPureName: string): Promise<any> {
    try {
      const re = /(?:\.([^.]+))?$/
      await fs.remove(folderPath)

      folderPath = path.join(folderPath, '../')

      const folderContent =
        fs.readdirSync(folderPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
      const fileContent = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => {
          return { name: dirent.name, pureName: dirent.name.replace(re.exec(dirent.name)[0], ''), ext: re.exec(dirent.name)[1] }
        })
      const folderResult = { folders: folderContent, files: fileContent, path: folderPath, url: folderPureName }
      return folderResult

    } catch (error) {
      console.error(error)
    }
  }

  public async getProperties(folderPath: string, ext: string): Promise<any> {
    try {
      const data = fs.statSync(folderPath)
      let dimensions

      switch (ext) {
        case 'BMP':
        case 'CUR':
        case 'DDS':
        case 'GIF':
        case 'ICNS':
        case 'ICO':
        case 'JPEG':
        case 'KTX':
        case 'PNG':
        case 'PNM':
        case 'PSD':
        case 'SVG':
        case 'JPG':
        case 'TIFF':
        case 'WebP':
        case 'bmp':
        case 'cur':
        case 'dds':
        case 'gif':
        case 'icns':
        case 'ico':
        case 'jpeg':
        case 'ktx':
        case 'png':
        case 'pnm':
        case 'psd':
        case 'svg':
        case 'tiff':
        case 'webp':
        case 'jpg':
          // dimensions = await sizeOf(folderPath)
          break
      }


      const propertiesResult = { data, dimensions }
      return propertiesResult

    } catch (error) {
      console.error(error)
    }
  }

}
