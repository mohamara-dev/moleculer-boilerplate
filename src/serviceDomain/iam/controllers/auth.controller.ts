import { Context } from "moleculer"
import JWT from "jsonwebtoken"
import UserController from "@ServiceDomain/iam/controllers/user.controller"
import Generator from "@Helpers/generators"
import Redis, { RedisKeyType } from "@Models/db/connectors/redis.db"
import { ServiceBroker } from "moleculer"
import { YFTError } from "@Base/yft"
import { User } from "@ServiceDomain/iam/models/user.DBmodel"
import GeneralMetaRequests from "@Types/interfaces/generalMeta.interface"
import SessionController from "@ServiceDomain/iam/controllers/session.controller"
import { Session } from "@ServiceDomain/basement/models/session.DBmodel"
import { SendAuthSms } from "@ServiceDomain/thirdParty/dto/interfaces/thirdpartyMessagingService.interface"
import { CheckReferral, CheckRegistrationOneTimeToken, InitialUserCheckResult, JWTPayload, LoginResponse, SendResetPasswordToken, ValidateResetPasswordToken } from "@ServiceDomain/iam/dto/interfaces/authentication.interface"
import { AdminsPrivilegesType } from "@ServiceDomain/iam/dto/enums/user.enum"
import { fastestValidator } from "@Helpers/validator"

export default class AuthenticationController {
  private static instance: AuthenticationController

  public static shared(): AuthenticationController {
    if (!AuthenticationController.instance) {
      const instance = new AuthenticationController()
      AuthenticationController.instance = instance
    }
    return AuthenticationController.instance
  }

  async checkIfUserExistsAndGenerateTemporaryToken(ctx: Context, mobile: string): Promise<InitialUserCheckResult> {
    const user = await UserController.shared().getOne({ mobile: mobile })
    const tempToken = Generator.generateRandomString(32)
    let response: InitialUserCheckResult
    if (user && user.userType !== "fullDummy") {
      if (user.isBanned) {
        throw YFTError.UserAccessDeniedByAdmin
      }
      const key = Redis.shared().generateKey(
        RedisKeyType.AuthenticationTemporaryTokenForLogin,
        tempToken
      )
      await Redis.shared().set(key, mobile, "ex", 300)
      response = {
        registered: true,
        next_step: "password",
        temporary_token: tempToken,
      }
    } else {
      const keyTemporaryToken = Redis.shared().generateKey(
        RedisKeyType.AuthenticationTemporayTokenForRegistration,
        tempToken
      )
      await Redis.shared().set(keyTemporaryToken, mobile, "ex", 300)
      const oneTimeToken = Generator.generateRandomNumber(1000, 9999)

      const callingParameters: SendAuthSms =
        { mobile: mobile, code: oneTimeToken }
      await ctx.call("v1.thirdparty-messaging.sendAuthSms", callingParameters)
      const keyOneTimeToken = Redis.shared().generateKey(
        RedisKeyType.AuthenticationOneTimeToken,
        mobile
      )
      await Redis.shared().set(keyOneTimeToken, oneTimeToken, "ex", 300)
      response = {
        registered: false,
        next_step: "one-time-token",
        temporary_token: tempToken,
        token_length: 4,
      }
    }
    return response
  }

  async checkIfUserExistsAndGenerateTemporaryTokenRefferal(ctx: Context<CheckReferral, GeneralMetaRequests.RequestMetaData>): Promise<InitialUserCheckResult> {
    try {
      console.log(ctx.meta.validationSchema)
      const validationResult = fastestValidator(ctx.params, ctx.meta.validationSchema)
      if (validationResult == true) {
        const userName = ctx.params.userName
        const user = await UserController.shared().getOne({ userName: userName })
        const tempToken = Generator.generateRandomString(32)
        let response: InitialUserCheckResult
        if (user && user.userType !== "fullDummy") {
          if (user.isBanned) {
            throw YFTError.UserAccessDeniedByAdmin
          }
          const key = Redis.shared().generateKey(
            RedisKeyType.AuthenticationTemporaryTokenForLogin,
            tempToken
          )
          await Redis.shared().set(key, userName, "ex", 300)
          response = {
            registered: true,
            next_step: "password",
            temporary_token: tempToken,
          }
        } else {
          const keyTemporaryToken = Redis.shared().generateKey(
            RedisKeyType.AuthenticationTemporayTokenForRegistration,
            tempToken
          )
          await Redis.shared().set(keyTemporaryToken, userName, "ex", 300)
          const oneTimeToken = Generator.generateRandomNumber(1000, 9999)

          const keyOneTimeToken = Redis.shared().generateKey(
            RedisKeyType.AuthenticationOneTimeToken,
            userName
          )
          await Redis.shared().set(keyOneTimeToken, oneTimeToken, "ex", 300)
          response = {
            registered: false,
            next_step: "one-time-token",
            temporary_token: tempToken,
            token_length: 4,
          }
        }
        return response
      } else {
        console.log(validationResult)
        throw YFTError.InvalidRequest()
      }

    } catch (error) {
      console.log(error)
    }
  }

  async resendOneTimeToken(
    ctx: Context,
    temporaryToken: string
  ): Promise<InitialUserCheckResult> {
    const oldTemporaryTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForRegistration,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(oldTemporaryTokenKey)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }

    await Redis.shared().del(oldTemporaryTokenKey)

    const oneTimeToken = Generator.generateRandomNumber(1000, 9999)
    const callingParameters: SendAuthSms = {
      mobile: mobileNumber,
      code: oneTimeToken,
    }
    await ctx.call("v1.thirdparty-messaging.sendAuthSms", callingParameters)
    const keyOneTimeToken = Redis.shared().generateKey(
      RedisKeyType.AuthenticationOneTimeToken,
      mobileNumber
    )
    await Redis.shared().set(keyOneTimeToken, oneTimeToken, "ex", 300)

    const newTemporaryToken = Generator.generateRandomString(32)
    const newTemporaryTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForRegistration,
      newTemporaryToken
    )
    await Redis.shared().set(newTemporaryTokenKey, mobileNumber, "ex", 300)

    const response: InitialUserCheckResult = {
      registered: false,
      next_step: "one-time-token",
      temporary_token: newTemporaryToken,
      token_length: 4,
    }
    return response
  }

  async checkOneTimeToken(
    ctx: Context,
    temporaryToken: string,
    oneTimeTokenProvidedByUser: string
  ): Promise<CheckRegistrationOneTimeToken> {
    const keyTemporaryToken = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForRegistration,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(keyTemporaryToken)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }
    const keyOneTimeToken = Redis.shared().generateKey(
      RedisKeyType.AuthenticationOneTimeToken,
      mobileNumber
    )
    const oneTimeTokenInCache = await Redis.shared().get(keyOneTimeToken)

    if (oneTimeTokenInCache === oneTimeTokenProvidedByUser) {
      await Redis.shared().del(keyTemporaryToken)
      await Redis.shared().del(keyOneTimeToken)
      const newTemporaryToken = Generator.generateRandomString(32)
      const key = Redis.shared().generateKey(
        RedisKeyType.AuthenticationTemporayTokenForRegistrationSetPassword,
        newTemporaryToken
      )
      await Redis.shared().set(key, mobileNumber, "ex", 300)
      return {
        temporary_token: newTemporaryToken,
        next_step: "set-password",
      }
    }
    throw YFTError.AuthenticationInvalidOneTimeToken
  }

  async setPasswordAndCreateUser(
    ctx: Context,
    temporaryToken: string,
    password: string,
    clientMetaData: GeneralMetaRequests.ClientMetaData
  ): Promise<LoginResponse> {
    const key = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForRegistrationSetPassword,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(key)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }
    if (!this.isPasswordStrongEnough(password)) {
      throw YFTError.AuthenticationWeakPassword
    }
    const createdUser = await new UserController().createUser(
      mobileNumber,
      password
    )
    const userAgent = clientMetaData.userAgent
    const clientIp = clientMetaData.clientIp
    const newSession = await new SessionController().createSession(
      createdUser,
      userAgent,
      clientIp
    )
    await Redis.shared().del(key)
    const tokens: LoginResponse = {
      access_token: this.generateToken(createdUser, "access", newSession),
      refresh_token: this.generateToken(createdUser, "refresh", newSession),
      expires_in: 3600,
      token_type: "bearer",
    }
    return tokens
  }

  async login(
    broker: ServiceBroker,
    temporaryToken: string,
    password: string,
    clientMetaData: GeneralMetaRequests.ClientMetaData,
    shouldCheckForAdmin = false
  ): Promise<LoginResponse> {
    const userController = UserController.shared()
    if (!temporaryToken || !password) {
      throw YFTError.InvalidRequest
    }
    const key = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporaryTokenForLogin,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(key)
    const user = await userController.getOne({ mobileNumber: mobileNumber })
    if (!user) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }
    if (shouldCheckForAdmin) {
      // Find intersection between possible and user privileges
      const validAdminPrivliegesForUser = user.privileges.filter(
        (userPrivilege: any) => {
          return userPrivilege == typeof AdminsPrivilegesType
        }
      )
      if (validAdminPrivliegesForUser.length === 0) {
        throw YFTError.AccessDenied
      }
    }
    const passwordMatched = userController.validatePassword(user, password)
    const userAgent = clientMetaData.userAgent
    const clientIp = clientMetaData.clientIp
    const newSession = await new SessionController().createSession(
      user,
      userAgent,
      clientIp
    )
    if (passwordMatched) {
      const tokens: LoginResponse = {
        access_token: this.generateToken(user, "access", newSession),
        refresh_token: this.generateToken(user, "refresh", newSession),
        expires_in: 3600,
        token_type: "bearer",
      }
      return tokens
    }
    throw YFTError.AuthenticationInvalidPassword
  }

  async adminLogin(
    broker: ServiceBroker,
    temporaryToken: string,
    password: string,
    clientMetaData: GeneralMetaRequests.ClientMetaData
  ): Promise<
    LoginResponse & { isAdmin: boolean }
  > {
    const loginTokens = await this.login(
      broker,
      temporaryToken,
      password,
      clientMetaData,
      true
    )
    return {
      ...loginTokens,
      isAdmin: true,
    }
  }

  async sendResetPasswordToken(
    ctx: Context,
    temporaryToken: string
  ): Promise<SendResetPasswordToken> {
    const currentTempTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporaryTokenForLogin,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(currentTempTokenKey)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }

    const smsCode = Generator.generateRandomNumber(1000, 9999)
    const resetPassTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationOneTimeTokenTokenToResetPassword,
      mobileNumber
    )
    await Redis.shared().set(resetPassTokenKey, smsCode, "ex", 300)

    const callingParameters: SendAuthSms = {
      mobile: mobileNumber,
      code: smsCode,
    }
    await ctx.call("v1.thirdparty-messaging.sendAuthSms", callingParameters)

    const newTemporaryToken = Generator.generateRandomString(32)
    const newTempTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForResetPassword,
      newTemporaryToken
    )
    await Redis.shared().set(newTempTokenKey, mobileNumber, "ex", 300)

    await Redis.shared().del(currentTempTokenKey)

    const response: SendResetPasswordToken = {
      next_step: "validate-reset-password-token",
      temporary_token: newTemporaryToken,
      token_length: 4,
    }
    return response
  }

  async resendResetPasswordToken(
    ctx: Context,
    temporaryToken: string
  ): Promise<SendResetPasswordToken> {
    const currentTempTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForResetPassword,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(currentTempTokenKey)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }

    const smsCode = Generator.generateRandomNumber(1000, 9999)
    const resetPassTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationOneTimeTokenTokenToResetPassword,
      mobileNumber
    )
    await Redis.shared().set(resetPassTokenKey, smsCode, "ex", 300)

    const callingParameters: SendAuthSms = {
      mobile: mobileNumber,
      code: smsCode,
    }
    await ctx.call("v1.thirdparty-messaging.sendAuthSms", callingParameters)

    const newTemporaryToken = Generator.generateRandomString(32)
    const newTempTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForResetPassword,
      newTemporaryToken
    )
    await Redis.shared().set(newTempTokenKey, mobileNumber, "ex", 300)

    await Redis.shared().del(currentTempTokenKey)

    const response: SendResetPasswordToken = {
      next_step: "validate-reset-password-token",
      temporary_token: newTemporaryToken,
      token_length: 4,
    }
    return response
  }

  async verifyResetPasswordToken(
    ctx: Context,
    temporaryToken: string,
    oneTimeSmsToken: string
  ): Promise<ValidateResetPasswordToken> {
    const currentTempTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporayTokenForResetPassword,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(currentTempTokenKey)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }
    const resetPassTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationOneTimeTokenTokenToResetPassword,
      mobileNumber
    )
    const tokenInCache = await Redis.shared().get(resetPassTokenKey)

    if (oneTimeSmsToken === tokenInCache) {
      const newTemporaryToken = Generator.generateRandomString(32)
      const newTempTokenKey = Redis.shared().generateKey(
        RedisKeyType.AuthenticationTemporaryTokenToSetPasswordAfterOTTVerifiedForResetPassword,
        newTemporaryToken
      )
      await Redis.shared().set(newTempTokenKey, mobileNumber, "ex", 300)
      await Redis.shared().del(currentTempTokenKey)
      await Redis.shared().del(resetPassTokenKey)
      const response: ValidateResetPasswordToken =
      {
        next_step: "reset-password",
        temporary_token: newTemporaryToken,
      }
      return response
    }

    throw YFTError.AuthenticationInvalidOneTimeToken
  }

  async resetPasswordAndLoginUser(
    ctx: Context,
    temporaryToken: string,
    password: string,
    clientMetaData: GeneralMetaRequests.ClientMetaData
  ): Promise<LoginResponse> {
    const currentTempTokenKey = Redis.shared().generateKey(
      RedisKeyType.AuthenticationTemporaryTokenToSetPasswordAfterOTTVerifiedForResetPassword,
      temporaryToken
    )
    const mobileNumber = await Redis.shared().get(currentTempTokenKey)
    if (!mobileNumber) {
      throw YFTError.TemporaryTokenInvalidOrExpired
    }
    if (!this.isPasswordStrongEnough(password)) {
      throw YFTError.AuthenticationWeakPassword
    }
    const userController = new UserController()
    const user = await userController.resetPassword(mobileNumber, password)
    const userAgent = clientMetaData.userAgent
    const clientIp = clientMetaData.clientIp
    const newSession = await new SessionController().createSession(
      user,
      userAgent,
      clientIp
    )
    await Redis.shared().del(currentTempTokenKey)
    const tokens: LoginResponse = {
      access_token: this.generateToken(user, "access", newSession),
      refresh_token: this.generateToken(user, "refresh", newSession),
      expires_in: 3600,
      token_type: "bearer",
    }
    return tokens
  }

  public async renewAccessTokenAndRefreshToken(
    refreshToken: string
  ): Promise<LoginResponse> {
    const tokenValidationResult = await this.decryptToken(refreshToken)
    const userId = tokenValidationResult.userId
    const user = await new UserController().getOneById(null, userId)
    const sessionId = tokenValidationResult.sessionId
    let session: any = null
    if (sessionId) {
      session = await new SessionController().updateLatestAccessSession(
        user,
        sessionId
      )
    } else {
      throw YFTError.AccessDenied
    }
    const tokens: LoginResponse = {
      access_token: this.generateToken(user, "access", session),
      refresh_token: this.generateToken(user, "refresh", session),
      expires_in: 3600,
      token_type: "bearer",
    }
    return tokens
  }

  private generateToken(
    user: User,
    type: "access" | "refresh",
    session?: Session
  ): string {
    const jwtExpirySeconds = type === "access" ? 3600 : 360000000
    const privileges: string[] = user.privileges
      ? user.privileges.map((privilege) => {
        switch (privilege) {
          case "kyc":
            return "user-management"
          case "payUser":
            return "financial"
          case "financialSupervisor":
            return "financial-manager"
          case "superAdmin":
            return "god"
        }
      })
      : []
    const data: JWTPayload = {
      userId: user._id.toString(),
      type: type,
      privileges: privileges,
      sessionId: session?._id.toString(),
    }
    const token = JWT.sign(data, process.env.JWT_KEY, {
      algorithm: "HS512",
      expiresIn: jwtExpirySeconds,
    })
    return token
  }

  public async decryptToken(
    token: string
  ): Promise<JWTPayload> {
    try {
      const decoded = JWT.verify(token, process.env.JWT_KEY, {
        algorithms: ["HS512"],
      })
      const result: JWTPayload = {
        userId: (<JWTPayload>decoded).userId,
        type: (<JWTPayload>decoded).type,
        privileges: (<JWTPayload>decoded)
          .privileges,
        sessionId: (<JWTPayload>decoded)
          .sessionId,
      }
      return result
    } catch (error) {
      if (error instanceof JWT.TokenExpiredError) {
        throw YFTError.TokenExpired
      }
      throw YFTError.AccessDenied
    }
  }

  private isPasswordStrongEnough(password: string): boolean {
    // must contain one lower case
    // must contain one upper case
    // must contain one number or symbol
    // must at least be 8 char long
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[!@#$%^&*]))(?=.{8,})"
    )
    return strongRegex.test(password)
  }
}
