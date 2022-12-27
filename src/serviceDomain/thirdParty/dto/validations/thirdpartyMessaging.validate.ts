export const sendAuthSmsValidation = {
  mobile: { type: 'string', min: 11, max: 11 },
  code: { type: 'number', convert: true },
  $$strict: true, // no additional properties allowed
} // validated

export const sendUserVerifiedSmsValidation = {
  mobile: { type: 'string' },
  $$strict: true, // no additional properties allowed
}

export const sendUserRejectedSmsValidation = {
  mobile: { type: 'string' },
  $$strict: true, // no additional properties allowed
}

export const sendBuySuccessfulSmsValidation = {
  mobile: { type: 'string' },
  tokenType: { type: 'string' },
  tokenAmount: { type: 'string' },
  $$strict: true, // no additional properties allowed
}

export const sendSellSuccessfulSmsValidation = {
  mobile: { type: 'string' },
  tokenType: { type: 'string' },
  tokenAmount: { type: 'string' },
  priceFinalToman: { type: 'string' },
  $$strict: true, // no additional properties allowed
}
