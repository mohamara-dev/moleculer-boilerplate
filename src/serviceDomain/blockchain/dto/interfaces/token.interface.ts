
export interface tokenForClient {
  shortName: string
  longNameEn: string
  imageUrl: string
  id: string
  contract?: string
}

export interface tokenPrice {
  buyPrice: number,
  sellPrice: number
}


export interface getOne {
  id: string
  networkId?: string
  isRequestedByAdmin?: boolean
}
export interface deleteOne {
  id: string
}

export interface getTokenPriceBySymbol {
  symbol: string
}

export interface createOrUpdateOneToken {
  id?: string
  shortName: string
  pricingMarketSymbolsToUsdt: string
  longNameEn: string
  longNameFa: string
  imageUrl: string
  sortingPosition: number
  supportedBlockchainNetworks: object
}

export interface getOneToken {
  id: string
  networkId?: string
  isRequestedByAdmin?: boolean
}
export interface deleteOneToken {
  id: string
}

export interface getTokenPriceBySymbol {
  symbol: string
}

export interface createOrUpdateOneToken {
  id?: string
  shortName: string
  pricingMarketSymbolsToUsdt: string
  longNameEn: string
  longNameFa: string
  imageUrl: string
  sortingPosition: number
  supportedBlockchainNetworks: object
}
