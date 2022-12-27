export interface getFolder {
  folderPath: string
  folderPureName: string
}
export interface editFolder {
  primaryName: string
  changedName: string
  folderPureName: string
}
export interface getProperties {
  folderPath: string
  ext: string
}
export interface paste {
  initPath: string
  folderPath: string
  operation: string
  folderPureName: string
}
export interface upload {
  folderPath: string
}
