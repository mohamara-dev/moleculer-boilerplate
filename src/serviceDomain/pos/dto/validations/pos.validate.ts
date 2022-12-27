
export const generateRequestOnDevice = {
  id: { type: 'string', optional: true },
  amount: { type: 'number', convert: true },
  blockchainId: { type: 'string' },
  configId: { type: 'string' },
  payerMobile: { type: 'string', optional: true },
  customerWalletAddress: { type: 'string', optional: true },
  posId: { type: 'string' },
  tokenId: { type: 'string' },
  $$strict: true // no additional properties allowed
}

export const createOrUpdateConfig = {
  configProfileId: { type: 'string' },
  posId: { type: 'string' },
  userId: { type: 'string', optional: true },
  $$strict: true // no additional properties allowed
}
