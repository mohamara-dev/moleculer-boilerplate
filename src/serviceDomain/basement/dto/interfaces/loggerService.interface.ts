
export interface ServiceStatusChanged {
  serviceName: string
  status: string
}

export interface LogTokenPriceUpdate {
  serviceName: string
  tokensPrice: Record<string, string>
}



export interface LogThirdpartyApiCallSucceeded {
  serviceName: string
  thirdpartyName: string
  apiName: string
  url: string
  additionalInfo: Record<string, string | number | symbol>
}

export interface LogThirdpartyApiCallFailed {
  serviceName: string
  thirdpartyName: string
  apiName: string
  url: string
  error: string
  stack?: string,
  additionalInfo?: Record<string, string | number | symbol>
}

export interface LogWalletRelatedActions {
  serviceName: string
  currencyId?: string
  actionName?: string
  error?: string
  additionalInfo?: Record<string, string | number | any>
}

