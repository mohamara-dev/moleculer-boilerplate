export const createOrUpdateConfigProfileValidation = {
  id: { type: 'string', optional: true },
  userId: { type: 'string' },
  posId: { type: 'string' },
  sendReceiveNotif: { type: 'boolean', optional: true },
  supportedTokenAndBlockchains: { type: 'object', optional: true },
  isDeleted: { type: 'boolean', optional: true },

  $$strict: true // no additional properties allowed
}
export const addWalletTOConfigProfileValidation = {
  supportedTokenAndBlockchains: { type: 'object', optional: true },
  $$strict: true // no additional properties allowed
}

