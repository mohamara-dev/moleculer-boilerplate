import IORedis from 'ioredis'

export enum RedisKeyType {
  AuthenticationTemporaryTokenForLogin,
  AuthenticationTemporayTokenForRegistration,
  AuthenticationTemporayTokenForRegistrationSetPassword,
  AuthenticationOneTimeToken,
  AuthenticationTemporayTokenForResetPassword,
  AuthenticationOneTimeTokenTokenToResetPassword,
  AuthenticationTemporaryTokenToSetPasswordAfterOTTVerifiedForResetPassword,
  ThirdPartyProviderJibitKYCTemporaryToken,
  ThirdPartyProviderJibitKYCStorage,
  ThirdPartyProviderJibitPPGTemporaryToken,
  ThirdPartyProviderJibitPPGStorage,
  ThirdPartyProviderJibitTransferTemporaryToken,
  ThirdPartyProviderJibitTransferStorage,
  PaymentGatewayBeforePaymentTemporaryIdentifier,
  PaymentGatewayBeforePaymentTransactionId,
  InterApplicationReceiver,
  UserInfoChangeMobileNumberToken,
  UserInfoChangeMobileNumberNewNumber,
  UserInfoChangePasswordVerifiedCurrentPassword,
  ApplicationSettings,
  AdminTransactionLock,
  TokenPricing,
  FastUpdateTokenPricing,
  TokenPriceLog,
  TransactionProformaBuy,
  TransactionProformaSell,
  TransactionProformaWallet,
  TransactionProformaDepositFiat,
  TransactionProformaDepositToken,
  TransactionProformaWithdrawFiat,
  TransactionProformaWithdrawToken,
  SystemConfigCurrentPaymentGateway,
  TokenBinanceWithdrawFee,
  TokenBinanceMinimumWithdraw,
  TokensMarketData,
  TokensMarketCapPercentages,
  TotalMarketCapInUsd,
  MarketCapChangePercentagesIn24Hours,
  TokenSparklineChartUrl,
  TokenPriceChangePercentagesIn24Hours,
  SMSStatusRecord
}

class Redis extends IORedis {
  private static instance: Redis

  private constructor() {
    const port = Number(process.env.REDIS_PORT) || 6379
    const host = process.env.REDIS_HOST || 'localhost'
    const password = process.env.REDIS_PASSWORD || ''
    super({
      port: port,
      host: host,
      password: password
    })

    this.on('connect', () => {
      console.log('Redis Connected')
    })
  
    this.on('error', () => {
      console.error('Redis Connected Failed')
    })
  }

  public static shared(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis()
    }
    return Redis.instance
  }

  public generateKey(type:RedisKeyType, ...parts:string[]): string {
    const prefix = 'YFT:TKNN:'
    switch (type) {
    case RedisKeyType.AuthenticationTemporaryTokenForLogin:
      return `${prefix}Auth:TempToken:Login:${parts[0]}`
    case RedisKeyType.AuthenticationTemporayTokenForRegistration:
      return `${prefix}Auth:TempToken:Register:${parts[0]}`
    case RedisKeyType.AuthenticationTemporayTokenForRegistrationSetPassword:
      return `${prefix}Auth:TempToken:Register:SetPassword:${parts[0]}`
    case RedisKeyType.AuthenticationOneTimeToken:
      return `${prefix}Auth:OneTimeToken:${parts[0]}`
    case RedisKeyType.AuthenticationTemporayTokenForResetPassword:
      return `${prefix}Auth:TempToken:ResetPassword:${parts[0]}`
    case RedisKeyType.AuthenticationOneTimeTokenTokenToResetPassword:
      return `${prefix}Auth:TempToken:ResetPassword:OTT:${parts[0]}`
    case RedisKeyType.AuthenticationTemporaryTokenToSetPasswordAfterOTTVerifiedForResetPassword:
      return `${prefix}Auth:TempToken:ResetPassword:SetPassword:${parts[0]}`

    case RedisKeyType.ThirdPartyProviderJibitKYCTemporaryToken:
      return `${prefix}ThirdParty:Jibit:KYC:Token`
    case RedisKeyType.ThirdPartyProviderJibitKYCStorage:
      return `${prefix}ThirdParty:Jibit:KYC:Storage`
    case RedisKeyType.ThirdPartyProviderJibitPPGTemporaryToken:
      return `${prefix}ThirdParty:Jibit:PPG:Token`
    case RedisKeyType.ThirdPartyProviderJibitPPGStorage:
      return `${prefix}ThirdParty:Jibit:PPG:Storage`
    case RedisKeyType.ThirdPartyProviderJibitTransferTemporaryToken:
      return `${prefix}ThirdParty:Jibit:Transfer:Token`
    case RedisKeyType.ThirdPartyProviderJibitTransferStorage:
      return `${prefix}ThirdParty:Jibit:Transfer:Storage`

    case RedisKeyType.PaymentGatewayBeforePaymentTemporaryIdentifier:
      return `${prefix}PaymentGateway:Before:TemporaryId:${parts[0]}`
    case RedisKeyType.PaymentGatewayBeforePaymentTransactionId:
      return `${prefix}PaymentGateway:Before:Transaction:${parts[0]}`

    case RedisKeyType.InterApplicationReceiver:
      return `${prefix}InterApplication:Receiver`

    case RedisKeyType.UserInfoChangeMobileNumberToken:
      return `${prefix}UserInfo:ChangeMobile:OTT:${parts[0]}`
    case RedisKeyType.UserInfoChangeMobileNumberNewNumber:
      return `${prefix}UserInfo:ChangeMobile:NewNumber:${parts[0]}`
    case RedisKeyType.UserInfoChangePasswordVerifiedCurrentPassword:
      return `${prefix}UserInfo:ChangePassword:VerifiedOldPassword:${parts[0]}`

    case RedisKeyType.ApplicationSettings:
      return `${prefix}Application:Settings:${parts[0]}`

    case RedisKeyType.AdminTransactionLock:
      return `${prefix}Admin:Lock:Transaction:${parts[0]}`

    case RedisKeyType.TokenPricing:
      return `${prefix}Tokens:${parts[0]}:Pricing:Normal:${parts[1]}`
    case RedisKeyType.TokenPriceLog:
      return `${prefix}Tokens:${parts[0]}:Pricing:Log:${parts[1]}`
    case RedisKeyType.FastUpdateTokenPricing:
      return `${prefix}Tokens:${parts[0]}:Pricing:Fast:${parts[1]}`
    case RedisKeyType.TokenBinanceWithdrawFee:
      return `${prefix}Tokens:${parts[0]}:Pricing:BinanceWithdrawFee`
    case RedisKeyType.TokenBinanceMinimumWithdraw:
      return `${prefix}Tokens:${parts[0]}:Pricing:BinanceMinimumWithdraw`
    case RedisKeyType.TokensMarketData:
      return `${prefix}Tokens:${parts[0]}:MarketData`
    case RedisKeyType.TokensMarketCapPercentages:
      return `${prefix}Tokens:-ALL-:MarketCapPercentages`
    case RedisKeyType.MarketCapChangePercentagesIn24Hours:
      return `${prefix}:MarketCapChangePercentagesIn24Hours`
    case RedisKeyType.TokenPriceChangePercentagesIn24Hours:
      return `${prefix}Tokens:${parts[0]}:PriceChangePercentagesIn24Hours`
    case RedisKeyType.TotalMarketCapInUsd:
      return `${prefix}:TotalMarketCapInUsd`
    case RedisKeyType.TokenSparklineChartUrl:
      return `${prefix}Tokens:${parts[0]}:SparklineChartUrl`

    case RedisKeyType.TransactionProformaBuy:
      return `${prefix}Transaction:Proforma:Buy:${parts[0]}`
    case RedisKeyType.TransactionProformaSell:
      return `${prefix}Transaction:Proforma:Sell:${parts[0]}`
    case RedisKeyType.TransactionProformaDepositFiat:
      return `${prefix}Transaction:Proforma:Deposit:Fiat:${parts[0]}`
    case RedisKeyType.TransactionProformaDepositToken:
      return `${prefix}Transaction:Proforma:Deposit:Token:${parts[0]}`
    case RedisKeyType.TransactionProformaWithdrawFiat:
      return `${prefix}Transaction:Proforma:Withdraw:Fiat:${parts[0]}`
    case RedisKeyType.TransactionProformaWithdrawToken:
      return `${prefix}Transaction:Proforma:Withdraw:Token:${parts[0]}`
    case RedisKeyType.TransactionProformaWallet:
      return `${prefix}Transaction:Proforma:Wallet:${parts[0]}`
    case RedisKeyType.SystemConfigCurrentPaymentGateway:
      return `${prefix}SystemConfig:CurrentPaymentGateway`
    case RedisKeyType.SMSStatusRecord:
      return `${prefix}SMS:status:${parts[0]}`  // SMS:status:userMobile

    default:
      return ''
    }
  }
}

export default Redis
