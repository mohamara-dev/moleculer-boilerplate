import { Context } from "moleculer"
import { fastestValidator } from "@Helpers/validator"
import { YFTError } from "@Base/yft"
import { ObjectId } from "mongodb"

export default class YFTController {
  DBModel
  projectionCondition

  constructor(DBModel: any, projectionCondition?: any) {
    this.DBModel = DBModel
    this.projectionCondition = projectionCondition ?? { isDeleted: 0 }
  }

  public async getAll(condition?: any, page?: number, skip?: number, limit?: number, projectionCondition?: any): Promise<any[]> {
    if (projectionCondition) {
      this.projectionCondition = projectionCondition
    }
    let cond = condition ?? { isDeleted: false }
    const projection = this.projectionCondition

    let lt = limit ?? 10
    let sk = skip ? skip : page ? lt * page : 0
    const items = await this.DBModel.find(cond, projection).skip(sk).limit(lt)
    return items
  }

  public async getOneById(ctx: Context, id: string, projectionCondition?: any): Promise<any> {
    if (projectionCondition) {
      this.projectionCondition = projectionCondition
    }
    const item = await this.DBModel.findById(id, this.projectionCondition)
    if (item.isDeleted) {
      throw YFTError.NotFound()
    }
    return item
  }

  public async getOne(condition?: any, projectionCondition?: any): Promise<any> {
    if (projectionCondition) {
      this.projectionCondition = projectionCondition
    }
    const item = await this.DBModel.findOne(
      condition,
      this.projectionCondition
    )
    if (item.isDeleted) {
      throw YFTError.NotFound()
    }
    return item
  }

  public async count(condition?: any, skip?: number): Promise<number> {
    let cond = condition ?? { isDeleted: false }
    let sk = skip ?? 0
    const Count = await this.DBModel.count(cond).skip(sk)
    return Count
  }

  public async createOrUpdate(requestParams: any, validationParams: any): Promise<any> {
    try {
      const validationResult = fastestValidator(validationParams, requestParams)
      if (validationResult == true) {
        let itemId
        if (requestParams.id) {
          itemId = requestParams.id
          const item = await this.DBModel.findById(itemId)
          if (item.isDeleted) {
            throw YFTError.NotFound()
          }
        } else {
          itemId = new ObjectId().toHexString()
        }
        delete requestParams.id
        const createdItem = await this.DBModel.findByIdAndUpdate(
          itemId,
          requestParams,
          { new: true, upsert: true }
        )
        return createdItem
      } else {
        console.log(validationResult)
        throw YFTError.InvalidRequest()
      }

    } catch (error) {
      console.log(error)
    }
  }

  public async createOrUpdateByCondition(condition: any, newItem: any, validationParams: any): Promise<any> {
    const validationResult = fastestValidator(validationParams, newItem)
    if (validationResult == true) {
      const createdItem = await this.DBModel.findByIdAndUpdate(
        condition,
        newItem,
        { new: true, upsert: true }
      )
      return createdItem
    } else {
      console.log(validationResult)
      throw YFTError.InvalidRequest()
    }
  }

  public async delete(id: string): Promise<string> {
    await this.DBModel.findByIdAndUpdate(id, { isDelete: true })
    return id
  }

  public async updateMany(condition: any, changeFields: any, validationParams: any): Promise<any> {
    const validationResult = fastestValidator(validationParams, changeFields)
    if (validationResult == true) {
      const result = await this.DBModel.updateMany(condition, changeFields)
      return result
    } else {
      console.log(validationResult)
      throw YFTError.InvalidRequest()
    }
  }

  public async collector(condition?: any): Promise<any> {
    const item = await this.DBModel.findOne(condition, this.projectionCondition)
    return item
  }

  protected prepare(callback: (item: any) => any): any {
    return callback
  }

  public healthCheck(): string {
    return "controller works"
  }
}
