import { Blockchain } from '@ServiceDomain/blockchain/models/blockchain.DBmodel'
import { Transaction } from '@ServiceDomain/pos/models/transaction.DBmodel'
import { ConfigProfile } from '@ServiceDomain/pos/models/configProfile.DBmodel'
import { User } from 'serviceDomain/iam/models/user.DBmodel'

export interface posConfig {
  name: string
}

export interface preparedRequestForClient {
  qrCode: string;
  amount: number;
  token: {
    shortName: string;
    imageUrl: string;
  };
  blockchain: {
    name: string;
    imageUrl: string;
  };
}

export interface PosDeviceForClient {
  posId: string,
  user: User,
  configProfile: ConfigProfile
}

export interface analyzeBlockchain {

  transaction: Transaction
  network: Blockchain
}

export interface getAll {
  count: string
  isRequestedByAdmin: boolean
}

export interface getOne {
  id: string
  isRequestedByAdmin?: boolean
}

export interface deleteOne {
  id: string
}


export interface getConfig {
  posId: string
  userId?: string
}

export interface checkNetwork {
  amount: number
  posId: string
  tokenId: string
  blockchainId: string
  customerWalletAddress?: string
}

export interface getTransactionToCheck {
  amount: string
  posId: string
  tokenId: string
}

export interface generateRequest {
  amount: number
  posId: string
  tokenId: string
  blockchainId: string
  configId: string
  userId?: string
  payerMobile?: string
  customerWalletAddress?: string
}

export interface register {
  posId: string
  userId?: string
}

export interface setConfig {
  posId: string
  configProfileId: string
  userId?: string
}
