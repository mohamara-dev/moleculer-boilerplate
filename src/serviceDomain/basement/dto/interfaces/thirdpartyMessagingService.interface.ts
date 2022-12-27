
export interface SendAuthSms {
  mobile: string
  code: number
}

export interface SendUserVerifiedSms {
  mobile: string
}

export interface SendUserRejectedSms {
  mobile: string
}

export interface SendBuySuccessfulSms {
  mobile: string
  tokenType: string
  tokenAmount: number
  priceFinalToman?: number
}

export interface SendSellSuccessfulSms {
  mobile: string
  tokenAmount: number
  tokenType: string
  priceFinalToman: number
}

export interface smsOnRedisStatus {
  requestTime: number,
  provider: string,
  mobile: string,
  status: string,
  messageId: string,
  code: number
}
