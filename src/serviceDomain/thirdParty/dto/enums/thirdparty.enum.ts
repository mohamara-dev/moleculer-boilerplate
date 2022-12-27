export const PossibleACL = ['private' , 'public-read'] as const
export type ACL = typeof PossibleACL[number]

export const PossibleAlertType = ['alert', 'warning'] as const
export type AlertType = typeof PossibleAlertType[number]

export const PossibleAlertCategory = ['kyc' , 'payment','scheduled-jobs' , 'misc'] as const
export type AlertCategory = typeof PossibleAlertCategory[number]

export const PossibleSMSProviders = ['kavenegar','farazsms'] as const
export type SMSProviders = typeof PossibleSMSProviders[number]

export type smsOnRedisStatus ={
    requestTime: number,
    provider: string,
    mobile: string,
    status: string,
    messageId: string,
    code: number
}

