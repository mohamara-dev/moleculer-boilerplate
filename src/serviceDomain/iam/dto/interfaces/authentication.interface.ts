/* eslint-disable @typescript-eslint/no-namespace */

export interface BrewCoffee {
  phone: string
  token: string
}

export interface CheckReferral {
  referralCode?: string
  userName?: string
}

export interface CheckMobile {
  mobile: string
}

export interface RegisterResendToken {
  temporaryToken: string
}

export interface RegisterVerifyToken {
  temporaryToken: string
  code: string
}

export interface RegisterSetPassword {
  temporaryToken: string
  password: string
}

export interface adminLoginWithPassword {
  userName: string
  password: string
}

export interface LoginWithPassword {
  temporaryToken: string
  password: string
}

export interface ForgotPassword {
  temporaryToken: string
}

export interface ForgotPasswordResendToken {
  temporaryToken: string
}

export interface ResetPasswordWithTokenStepVerification {
  temporaryToken: string
  code: string
}

export interface ResetPasswordWithTokenStepSetPassword {
  temporaryToken: string
  password: string
}

export interface RefreshToken {
  refreshToken: string
}

export interface InitialUserCheckResult {
  registered: boolean
  temporary_token: string
  next_step: 'one-time-token' | 'password'
  token_length?: number
}

export interface CheckRegistrationOneTimeToken {
  temporary_token: string
  next_step: 'set-password'
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: 3600
}

export interface JWTPayload {
  userId: string
  type: 'access' | 'refresh'
  privileges: string[],
  sessionId?: string
}

export interface SendResetPasswordToken {
  temporary_token: string
  next_step: 'validate-reset-password-token'
  token_length: number
}

export interface ValidateResetPasswordToken {
  temporary_token: string
  next_step: 'reset-password'
}
