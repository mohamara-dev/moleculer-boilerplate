import { defaultClasses, getModelForClass } from '@typegoose/typegoose'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseModel extends defaultClasses.Base {} 
class BaseModel extends defaultClasses.TimeStamps {
  static async initialization(): Promise<void> {
    console.log('BaseModel initialization')
  }

  static async migrations(): Promise<void> {
    console.log('BaseModel migrations')
  }
}

export default BaseModel
