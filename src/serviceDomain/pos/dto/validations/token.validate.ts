
export const getTokenPriceBySymbol = {
  symbol: { type: 'string' }
}

export const createOrUpdateToken = {
  id: { type: 'string', optional: true },
  shortName: { type: 'string' },
  pricingMarketSymbolsToUsdt: { type: 'string' },
  longNameEn: { type: 'string' },
  longNameFa: { type: 'string' },
  imageUrl: { type: 'string' },
  supportedBlockchainNetworks: { type: 'array', optional: true },
  sortingPosition: { type: 'number', convert: true },
  $$strict: true // no additional properties allowed
}

