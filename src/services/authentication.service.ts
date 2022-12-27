import { Context, Service, ServiceBroker } from 'moleculer'
import { YFTError } from '@Base/yft'
import AuthController from '@ServiceDomain/iam/controllers/auth.controller'
import { User } from 'serviceDomain/iam/models/user.DBmodel'
import { fastestValidator } from '@Helpers/validator'
import SessionController, { PreparedSessionObject } from '@ServiceDomain/iam/controllers/session.controller'
import { } from '@ServiceDomain/iam/dto/validations/authentication.validate'
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import LoggerController from '@ServiceDomain/basement/controllers/logger.controller'
import genericServiceMixin from "./mixin/generic.service"
import { checkReferralCodeValidation } from '@ServiceDomain/iam/dto/validations/authentication.validate'
import { BrewCoffee, CheckMobile, CheckReferral, ForgotPassword, ForgotPasswordResendToken, LoginWithPassword, RefreshToken, RegisterResendToken, RegisterSetPassword, RegisterVerifyToken, ResetPasswordWithTokenStepSetPassword, ResetPasswordWithTokenStepVerification } from '@ServiceDomain/iam/dto/interfaces/authentication.interface'
import { checkMobileValidation, forgotPasswordResendTokenValidation, forgotPasswordValidation, loginWithPasswordValidation, refreshTokenValidation, registerResendTokenValidation, registerSetPasswordValidation, registerVerifyTokenValidation, resetPasswordWithTokenStepSetPasswordValidation, resetPasswordWithTokenStepVerificationValidation } from '@ServiceDomain/iam/dto/validations/authentication.validate'

export default class AuthenticationService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  private myController = new AuthController()
  //  private myControllerShared = AuthController.shared()
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'auth',
      version: 1,
      settings: {},
      mixins: [genericServiceMixin],
      dependencies: [
      ],
      actions: {

        brewCoffee: {
          rest: '/brew-coffee',
          async handler(ctx: Context<BrewCoffee, GeneralMetaRequests.RequestMetaData>): Promise<string> {
            ctx.meta.$statusCode = 418
            return '¯\\_(ツ)_/¯ You should check the http status code ¯\\_(ツ)_/¯'
          }
        },

        checkReferralCode: {
          rest: 'POST /check-referral',
          async handler(ctx: Context<CheckReferral, GeneralMetaRequests.RequestMetaData>) {
            ctx.meta.validationSchema = checkReferralCodeValidation
            const response =
              await this.myController.checkIfUserExistsAndGenerateTemporaryTokenRefferal(ctx)
            console.log(response)
            return response
          }
        },

        checkMobile: {
          rest: 'POST /check-mobile',
          async handler(ctx: Context<CheckMobile, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(checkMobileValidation, ctx.params)
            if (validationResult == true) {
              const response =
                await this.myController.checkIfUserExistsAndGenerateTemporaryToken(ctx, ctx.params.mobile)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'checkMobile', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        registerResendToken: {
          rest: 'POST /register/resend-ott',
          async handler(ctx: Context<RegisterResendToken, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(registerResendTokenValidation, ctx.params)
            if (validationResult == true) {
              const temporaryToken = ctx.params.temporaryToken
              const response = await this.myController.resendOneTimeToken(ctx, temporaryToken)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'registerResendToken', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        registerVerifyToken: {
          rest: 'POST /register/verify-ott',
          async handler(ctx: Context<RegisterVerifyToken, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(registerVerifyTokenValidation, ctx.params)
            if (validationResult == true) {
              const temporaryToken = ctx.params.temporaryToken
              const oneTimeToken = ctx.params.code
              const response: any = await this.myController.checkOneTimeToken(ctx, temporaryToken, oneTimeToken)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'registerVerifyToken', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        registerSetPassword: {
          rest: 'POST /register/set-password',
          async handler(ctx: Context<RegisterSetPassword, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(registerSetPasswordValidation, ctx.params)
            if (validationResult == true) {
              const temporaryToken = ctx.params.temporaryToken
              const password = ctx.params.password
              const clientMetaData: GeneralMetaRequests.ClientMetaData = {
                userAgent: ctx.meta.userAgent,
                clientIp: ctx.meta.clientIp
              }
              const response = await this.myController.setPasswordAndCreateUser(ctx, temporaryToken, password, clientMetaData)
              ctx.meta.$statusCode = 201
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'registerSetPassword', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        loginWithPassword: {
          rest: 'POST /login/password',
          async handler(ctx: Context<LoginWithPassword, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(loginWithPasswordValidation, ctx.params)
            if (validationResult == true) {
              const password = ctx.params.password
              const temporaryToken = ctx.params.temporaryToken
              const clientMetaData: GeneralMetaRequests.ClientMetaData = {
                userAgent: ctx.meta.userAgent,
                clientIp: ctx.meta.clientIp
              }
              const response = await this.myController.login(broker, temporaryToken, password, clientMetaData)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'loginWithPassword', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        adminLoginWithPassword: {
          rest: 'POST /admin/login/password',
          async handler(ctx: Context<LoginWithPassword, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(loginWithPasswordValidation, ctx.params)
            if (validationResult === true) {
              const password = ctx.params.password
              const temporaryToken = ctx.params.temporaryToken
              const clientMetaData: GeneralMetaRequests.ClientMetaData = {
                userAgent: ctx.meta.userAgent,
                clientIp: ctx.meta.clientIp
              }
              const response = await this.myController.adminLogin(broker, temporaryToken, password, clientMetaData)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'adminLoginWithPassword', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        forgotPassword: {
          rest: 'POST /forgot/send-token',
          async handler(ctx: Context<ForgotPassword, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(forgotPasswordValidation, ctx.params)
            if (validationResult == true) {
              const temporaryToken = ctx.params.temporaryToken
              const response = await this.myController.sendResetPasswordToken(ctx, temporaryToken)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'forgotPassword', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        forgotPasswordResendToken: {
          rest: 'POST /forgot/resend-token',
          async handler(ctx: Context<ForgotPasswordResendToken, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(forgotPasswordResendTokenValidation, ctx.params)
            if (validationResult == true) {
              const temporaryToken = ctx.params.temporaryToken
              const response = await this.myController.resendResetPasswordToken(ctx, temporaryToken)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'forgotPasswordResendToken', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        resetPasswordWithTokenStepVerification: {
          rest: 'POST /forgot/verify-token',
          async handler(ctx: Context<ResetPasswordWithTokenStepVerification, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(resetPasswordWithTokenStepVerificationValidation, ctx.params)
            if (validationResult == true) {
              const temporaryToken = ctx.params.temporaryToken
              const oneTimeSmsToken = ctx.params.code
              const response: any = await this.myController.verifyResetPasswordToken(ctx, temporaryToken, oneTimeSmsToken)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'resetPasswordWithTokenStepVerification', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        resetPasswordWithTokenStepSetPassword: {
          rest: 'POST /forgot/set-password',
          async handler(ctx: Context<ResetPasswordWithTokenStepSetPassword, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(resetPasswordWithTokenStepSetPasswordValidation, ctx.params)
            if (validationResult == true) {
              const password = ctx.params.password
              const temporaryToken = ctx.params.temporaryToken
              const clientMetaData: GeneralMetaRequests.ClientMetaData = {
                userAgent: ctx.meta.userAgent,
                clientIp: ctx.meta.clientIp
              }
              const response = await this.myController.resetPasswordAndLoginUser(ctx, temporaryToken, password, clientMetaData)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'resetPasswordWithTokenStepSetPassword', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        validateToken: {
          rest: 'GET /token/validate',
          auth: true,
          async handler() {
            return { status: 'valid' }
          }
        },

        refreshToken: {
          rest: 'POST /token/refresh',
          async handler(ctx: Context<RefreshToken, GeneralMetaRequests.RequestMetaData>) {
            const validationResult = fastestValidator(refreshTokenValidation, ctx.params)
            if (validationResult == true) {
              const refreshToken = ctx.params.refreshToken
              const response = await this.myController.renewAccessTokenAndRefreshToken(refreshToken)
              return response
            } else {
              LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'refreshToken', 'field-validation-failed', '', validationResult)
              throw YFTError.InvalidRequest
            }
          }
        },

        getSessions: {
          rest: 'GET /session',
          auth: true,
          async handler(ctx: Context<never, { user: User }>): Promise<PreparedSessionObject[]> {
            const user = ctx.meta.user
            const sessions = await new SessionController().getAllSessionsByUser(user)
            return sessions
          }
        },

        removeSession: {
          rest: 'DELETE /session/:sessionId',
          auth: true,
          async handler(ctx: Context<{ sessionId: string }, { user: User }>): Promise<PreparedSessionObject[]> {
            const user = ctx.meta.user
            const sessionId = ctx.params.sessionId
            const activeSessions = await new SessionController().terminateSession(sessionId, user)
            return activeSessions
          }
        }
      },
    })
  }
}
