export const checkReferralCodeValidation = {
  userName: { type: 'string', optional: true },
  referralCode: { type: 'string', optional: true },
  $$strict: true,
}
export const brewCoffeeValidation = {
  phone: { type: 'string' },
  token: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const checkMobileValidation = {
  mobile: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const registerResendTokenValidation = {
  temporaryToken: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const registerVerifyTokenValidation = {
  temporaryToken: { type: 'string' },
  code: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const registerSetPasswordValidation = {
  temporaryToken: { type: 'string' },
  password: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const loginWithPasswordValidation = {
  temporaryToken: { type: 'string' },
  password: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const forgotPasswordValidation = {
  temporaryToken: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const forgotPasswordResendTokenValidation = {
  temporaryToken: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const resetPasswordWithTokenStepVerificationValidation = {
  temporaryToken: { type: 'string' },
  code: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const resetPasswordWithTokenStepSetPasswordValidation = {
  temporaryToken: { type: 'string' },
  password: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const refreshTokenValidation = {
  refreshToken: { type: 'string' },
  $$strict: true // no additional properties allowed
}

