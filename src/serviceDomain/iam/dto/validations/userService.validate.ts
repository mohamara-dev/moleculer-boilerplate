export const createOrUpdateUserValidationSchema = {
  id: { type: 'string', optional: true },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  mobile: { type: 'string' },

  $$strict: true // no additional properties allowed
}
