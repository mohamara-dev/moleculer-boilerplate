
export const createOrUpdateTransactionValidator = {
  id: { type: 'string', optional: true },
  shortName: { type: 'string' },
  pricingMarketSymbolsToUsdt: { type: 'string' },
  longNameEn: { type: 'string' },
  longNameFa: { type: 'string' },
  imageUrl: { type: 'string' },
  sortingPosition: { type: 'number', convert: true },
  $$strict: true // no additional properties allowed
}
