export const PossiblePaymentInitialStatus = ['pending', 'successful', 'failed', 'unknown', 'all'] as const
export type PaymentInitialStatus = typeof PossiblePaymentInitialStatus[number]

export const PossiblePaymentStatus = ['pending', 'planned', 'ongoing', 'processing', 'successful', 'failed', 'unknown', 'expired', 'in progress'] as const
export type PaymentStatus =  typeof PossiblePaymentStatus[number]

export const PossibleFiatCurrencies = ['rial'] as const
export type FiatCurrencies = typeof PossibleFiatCurrencies[number]

export const PossibleTransactionTypes = ['buy', 'sell', 'depositFiat', 'withdrawFiat', 'depositToken', 'withdrawToken'] as const
export type TransactionTypes = typeof PossibleTransactionTypes[number]

export const PossibleFiatPaymentGateways = ['jibit-1', 'jibit-2', 'vandar'] as const
export type FiatPaymentGateways = typeof PossibleFiatPaymentGateways[number]

export const PossibleTransactionRejectionReasons = ['user', 'low-gas-fee'] as const
export type TransactionRejectionReasons = typeof PossibleTransactionRejectionReasons[number]

export const PossibleTransactionStatus = ['pending', 'planned', 'ongoing', 'processing', 'successful', 'failed', 'unknown', 'canceledByUser', 'canceledByOperator'] as const
export type TransactionStatus = typeof PossibleTransactionStatus[number]

export const PossibleEthereumTransactionStatus = ['pending', 'ongoing', 'confirmed', 'failed', 'canceledByUser', 'canceledByOperator', 'rejectedByNetwork'] as const
export type EthereumTransactionStatus = typeof PossibleEthereumTransactionStatus[number]

export const PossibleUserUnderstandableFiatStatus = [ 'pending' , 'ongoing' , 'successful' , 'failed' , 'unknown' , 'canceledByUser' , 'canceledByOperator'] as const
export type UserUnderstandableFiatStatus =  typeof PossibleUserUnderstandableFiatStatus[number]

export const PossibleUserUnderstandableTokenStatus = [ 'pending' ,'ongoing' , 'successful' , 'failed' ,'canceledByUser' , 'canceledByOperator','rejectedByNetwork'] as const
export type UserUnderstandableTokenStatus =  typeof PossibleUserUnderstandableTokenStatus[number]

export const PossibleUserUnderstandableOverallStatus = ['rejected' , 'waiting_for_user_payment' , 'processing_user_payment' , 'failed_user_payment' , 'unknown_user_payment_status' , 'waiting_for_operator_payment' , 'processing_operator_payment' , 'failed_operator_payment' , 'unknown_operator_payment_status' , 'successful'] as const
export type UserUnderstandableOverallStatus =  typeof PossibleUserUnderstandableOverallStatus[number]

export const PossibleCardOwnershipVerificationStatus = ['pending_auto_verification', 'pending_operator_verification', 'auto_verified', 'operator_verified', 'rejected', 'verified'] as const
export type CardOwnershipVerificationStatus = typeof PossibleCardOwnershipVerificationStatus[number]

export const PossibleDirection = ['add', 'subtract'] as const
export type Direction = typeof PossibleDirection[number]
