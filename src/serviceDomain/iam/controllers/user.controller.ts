import { ObjectId } from "mongodb"
import UserDBModel, { User } from "@ServiceDomain/iam/models/user.DBmodel"
import * as paymentEnums from "@Types/enums/payment.enum"
import FuzzySet from "fuzzyset.js"
import Generator from "@Helpers/generators"
import { YFTError } from "@Base/yft"
import Redis, { RedisKeyType } from "@Models/db/connectors/redis.db"
import { Context } from "moleculer"
import Validators, { fastestValidator } from "@Helpers/validator"
import { preparedUserForClient } from "@ServiceDomain/iam/dto/interfaces/user.interface"
import * as userEnums from "@ServiceDomain/iam/dto/enums/user.enum"
import { SendAuthSms } from '@ServiceDomain/thirdParty/dto/interfaces/thirdpartyMessagingService.interface'
import LoggerController from "@ServiceDomain/basement/controllers/logger.controller"
import YFTController from "@ServiceDomain/yft.controller"
import * as UserRequests from "@ServiceDomain/iam/dto/interfaces/user.interface"
import GeneralMetaRequests from "@Types/interfaces/generalMeta.interface"
import { createOrUpdateUserValidationSchema } from "@ServiceDomain/iam/dto/validations/userService.validate"
import { UserType, UserVerificationStatus } from "@ServiceDomain/iam/dto/enums/user.enum";
import Crypto from "crypto"

export default class UserController extends YFTController {
  constructor() {
    super(UserDBModel)
  }

  private static instance: UserController
  public static shared(): UserController {
    if (!UserController.instance) {
      const instance = new UserController()
      UserController.instance = instance
    }
    return UserController.instance
  }
  private generateHashedPassword(password: string, salt: string): string {
    return Crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512").toString(
      "hex"
    )
  }

  public async createUser(userName: string, password: string): Promise<User> {
    const salt = Crypto.randomBytes(128).toString("hex")
    const createdUser = await UserDBModel.create({
      userName: userName,
      salt: salt,
      hashedPassword: this.generateHashedPassword(password, salt),
    })
    return createdUser
  }

  public async createUserMobile(mobile: string, password: string): Promise<User> {
    const salt = Crypto.randomBytes(128).toString("hex")
    const createdUser = await UserDBModel.create({
      mobile: mobile,
      salt: salt,
      hashedPassword: this.generateHashedPassword(password, salt),
    })
    return createdUser
  }

  public async updateFirstName(user: User, firstName?: string): Promise<User> {
    const update = {
      firstName: firstName,
      fullName: `${firstName} ${user.lastName}`,
    }
    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )
    return updatedUser
  }

  public async updateLastName(user: User, lastName?: string): Promise<User> {
    const update = {
      lastName: lastName,
      fullName: `${user.firstName} ${lastName}`,
    }
    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )
    return updatedUser
  }

  public async updateNationalId(user: User, nationalId?: string): Promise<User> {
    if (!Validators.validateNationalId(nationalId)) {
      throw YFTError.UserInfoInvalidOrEmptyNationalId
    }
    const update = { nationalId: nationalId }
    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )
    return updatedUser
  }

  public async updateAddress(user: User, address: string): Promise<User> {
    const update = { address: address }
    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )
    return updatedUser
  }

  public async updatePostalCode(user: User, postalCode: string): Promise<User> {
    const update = { postalCode: postalCode }
    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )
    return updatedUser
  }


  public async finalizeUserInfoEditAndLockData(user: User, firstName?: string, lastName?: string, nationalId?: string, bankCardNumber?: string, address?: string, birthday?: string): Promise<User> {
    let nextVerificationState: UserVerificationStatus
    switch (user.verificationStatus) {
      case UserVerificationStatus.pending_info:
      case UserVerificationStatus.rejected:
        nextVerificationState = UserVerificationStatus.pending_verification
        break
      default:
        throw YFTError.UserInfoUserCannotVerifyUserInfoChange
    }

    const update: Record<string, string | boolean | number> = {
      editingEnabled: false,
      verificationStatus: nextVerificationState,
    }
    let fullName = ""
    if (!firstName && !user.firstName) {
      throw YFTError.UserInfoInvalidOrEmptyFirstName
    } else if (firstName && user.firstName !== firstName) {
      update["firstName"] = firstName
      fullName = firstName
    } else {
      fullName = user.firstName
    }

    if (!lastName && !user.lastName) {
      throw YFTError.UserInfoInvalidOrEmptyLastName
    } else if (lastName && user.lastName !== lastName) {
      update["lastName"] = lastName
      fullName += ` ${lastName}`
    } else {
      fullName += ` ${user.lastName}`
    }

    update["fullName"] = fullName

    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )

    return updatedUser
  }

  public async userAcceptedTermsAndConditions(user: User): Promise<User> {

    const nextVerificationState: UserVerificationStatus = UserVerificationStatus.pending_verification
    const update = {
      acceptedTermsAt: new Date(),
      verificationStatus: nextVerificationState,
    }
    const updatedUser = await UserDBModel.findOneAndUpdate(
      { _id: user._id },
      update,
      { new: true }
    )
    return updatedUser
  }

  public async deleteCurrentUser(user: User): Promise<boolean> {
    if (process.env.MODE !== "dev") {
      throw YFTError.OnlyInDevMode
    }

    const condition = {
      userId: user._id.toString(),
    }
    await UserDBModel.findOneAndRemove({ _id: user._id })
    return true
  }

  public async createOrUpdate(ctx: Context<UserRequests.createOrUpdateOne, GeneralMetaRequests.RequestMetaData>): Promise<User> {
    const salt = Crypto.randomBytes(128).toString("hex")
    const password = this.generateHashedPassword(ctx.params.mobile, salt)

    const newUser = {
      id: ctx.params.id,
      firstName: ctx.params.firstName,
      lastName: ctx.params.lastName,
      mobile: ctx.params.mobile,
      salt: salt,
      password: password,
    }

    const user = await super.createOrUpdate(newUser, createOrUpdateUserValidationSchema)

    return user
  }

  public validatePassword(user: User, password: string): boolean {
    if (
      user.hashedPassword === this.generateHashedPassword(password, user.salt)
    ) {
      return true
    }
    return false
  }

  public async changePasswordStepVerifyPassword(user: User, oldPassword: string): Promise<void> {
    if (!this.validatePassword(user, oldPassword)) {
      throw YFTError.UserInfoChangePasswordInvalidOldPassword
    }

    const changePasswordKey = Redis.shared().generateKey(
      RedisKeyType.UserInfoChangePasswordVerifiedCurrentPassword,
      user._id.toString()
    )
    await Redis.shared().set(changePasswordKey, "1", "ex", 300)
  }

  public async changePasswordStepSetNewPassword(user: User, newPassword: string): Promise<User> {
    const changePasswordKey = Redis.shared().generateKey(
      RedisKeyType.UserInfoChangePasswordVerifiedCurrentPassword,
      user._id.toString()
    )
    const changePasswordVerifiedCurrentPass = await Redis.shared().get(
      changePasswordKey
    )
    if (!changePasswordVerifiedCurrentPass) {
      throw YFTError.UserInfoChangePasswordOldPassNotVerifiedYet
    }
    await Redis.shared().del(changePasswordKey)

    const salt = Crypto.randomBytes(128).toString("hex")
    const update = {
      salt: salt,
      hashedPassword: this.generateHashedPassword(newPassword, salt),
    }
    const updatedUser = await UserDBModel.findByIdAndUpdate(user._id, update, {
      new: true,
    })
    return updatedUser
  }

  // be warned that this might cause a bug when another user is
  // in the middle of registering with this new phone number
  public async changeMobileNumberSendToken(ctx: Context, user: User, newMobileNumber: string): Promise<Record<string, number>> {
    if (user.mobile === newMobileNumber) {
      throw YFTError.UserInfoChangeMobileNumberCannotChangeToSelf
    }

    // ( DO NOT REMOVE THIS WARNING )
    // ::: WARNING :::
    // To prevent users to check if a particular phone number is registered
    // we first check if this accounts owns this number, otherwise this api
    // can and WILL be used as a tool to extract users data like registered
    // mobile numbers on this platform

    const condition = {
      mobile: newMobileNumber,
    }
    const userWithThisMobileNumber = await UserDBModel.findOne(condition)
    if (userWithThisMobileNumber) {
      throw YFTError.UserInfoChangeMobileNumberMobileAlreadyExists
    }

    const smsCode = Generator.generateRandomNumber(1000, 9999)

    const callingParameters: SendAuthSms = {
      mobile: newMobileNumber,
      code: smsCode,
    }
    await ctx.call("v1.thirdparty-messaging.sendAuthSms", callingParameters)

    const keyForToken = Redis.shared().generateKey(
      RedisKeyType.UserInfoChangeMobileNumberToken,
      user.mobile
    )
    await Redis.shared().set(keyForToken, smsCode, "ex", 300)

    const keyForNewNumber = Redis.shared().generateKey(
      RedisKeyType.UserInfoChangeMobileNumberNewNumber,
      user.mobile
    )
    await Redis.shared().set(keyForNewNumber, newMobileNumber, "ex", 300)

    return {
      token_length: 4,
    }
  }

  public async changeMobileNumberStepVerifyToken(user: User, token: string): Promise<User> {
    const keyForToken = Redis.shared().generateKey(
      RedisKeyType.UserInfoChangeMobileNumberToken,
      user.mobile
    )
    const tokenInCache = await Redis.shared().get(keyForToken)
    if (tokenInCache !== token) {
      throw YFTError.UserInfoChangeMobileNumberInvalidCode
    }

    const keyForNewNumber = Redis.shared().generateKey(
      RedisKeyType.UserInfoChangeMobileNumberNewNumber,
      user.mobile
    )
    const newMobileNumber = await Redis.shared().get(keyForNewNumber)
    const condition = {
      mobile: newMobileNumber,
    }
    const userWithThisMobileNumber = await UserDBModel.findOne(condition)
    if (userWithThisMobileNumber) {
      throw YFTError.UserInfoChangeMobileNumberMobileAlreadyExists
    }
    const update = {
      mobile: newMobileNumber,
      $push: {
        oldMobileNumbers: user.mobile,
      },
    }
    const updatedUser = await UserDBModel.findByIdAndUpdate(user._id, update, {
      new: true,
    })

    await Redis.shared().del(keyForToken)
    await Redis.shared().del(keyForNewNumber)

    return updatedUser
  }

  public async resetPassword(mobile: string, password: string): Promise<User> {
    const salt = Crypto.randomBytes(128).toString("hex")
    const update = {
      salt: salt,
      hashedPassword: this.generateHashedPassword(password, salt),
    }
    const updatedUser = UserDBModel.findOneAndUpdate(
      { mobile: mobile },
      update,
      {
        new: true,
      }
    )
    return updatedUser
  }
}
