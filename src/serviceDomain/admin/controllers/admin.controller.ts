import { Context } from "moleculer"
import UserDBModel, { User } from "@ServiceDomain/iam/models/user.DBmodel"
import YFTController from "@ServiceDomain/yft.controller"

export default class AdminController {
  // users
  public async getOneUserById(userId: string): Promise<User> {
    const user = await UserDBModel.findById(userId)
    return user
  }

  public async countUsers(): Promise<number> {
    const usersCount = await UserDBModel.count()
    return usersCount
  }
  public async getAllUsers(): Promise<User[]> {
    const users = await UserDBModel.find()
    return users
  }
}
