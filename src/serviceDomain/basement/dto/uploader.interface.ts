import { ObjectId } from 'mongodb'

export interface uploadClassicBase64 {
  value: {
    base64: string
    blob: string
    file: {
      lastModified: number
      lastModifiedDate: any
      name: string
      size: number
      type: string
      webkitRelativePath: string
    }
    name: string
    size: string
    type: string
  }
}
