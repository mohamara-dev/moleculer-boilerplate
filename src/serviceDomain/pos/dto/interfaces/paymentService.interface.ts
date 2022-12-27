/* eslint-disable @typescript-eslint/no-namespace */
import { PaymentInitialStatus, PaymentStatus } from '../../../../types/enums/payment.enum'
import * as paymentEnums from '../../../../types/enums/payment.enum'

export interface getAll {
  count: string
}

export interface RedirectTpPaymentGateway {
  id: string
}

export interface HandlePaymentGatewayResponse {
  status: string
  amount: string
  refnum: string
  state: string
  token: string
}



export interface PaymentResponse {
  gatewayIdentifier: paymentEnums.FiatPaymentGateways
  orderIdentifier: string
  referenceNumber: string
  pspSwitchingUrl: string
}

export interface VerifyPaymentResponse {
  status: PaymentInitialStatus,
  rawData: string
}

export interface PaymentInquiryResponse {
  hashedId: string
  amount: number
  referenceNumber: string
  phoneNumber: string
  // callbackUrl: string
  // description?: string
  // additionalData?: string
  status: PaymentStatus
  initPayerIp: string
  redirectPayerIp: string
  createdAt: Date
  modifiedAt?: Date
  expirationDate?: Date
  payerCard: string,
  rawData: string
}

export interface PaymentProvider {
  generatePaymentRequest(amountRial: number, referenceNumber: string, userPhoneNumber: string, forcedCardNumber: string): Promise<PaymentResponse>
  verifyPayment(orderIdentifier: string): Promise<VerifyPaymentResponse>
  getPaymentInfo(orderIdentifier: string): Promise<PaymentInquiryResponse>
}

