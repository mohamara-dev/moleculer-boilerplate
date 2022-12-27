import { tokenForClient } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'
import { blockchainForClient } from '@ServiceDomain/blockchain/dto/interfaces/blockchain.interface'

export interface transactionForClient {
  id: string
  posId: string
  amount: string
  payerMobile: string
  customerWalletAddress: string
  blockChain: blockchainForClient
  txHash: string
  token: tokenForClient
}

export interface getAllTransactions {
  count: string;
  isRequestedByAdmin?: boolean;
}
export interface getOne {
  id: string;
  isRequestedByAdmin?: boolean;
}
export interface getOneByDeviceId {
  posId: string;
  tokenId: string;
  amount: string;
}
export interface deleteOneTransaction {
  id: string;
}
export interface updateOneTransaction {
  txHash: string;
  merchantWalletAddress: string;
  customerWalletAddress: string;
  amount: string;
  timeStamp: string;
  isBlockchainConfirmed: boolean;
}
