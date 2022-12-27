import { blockchainForClient } from '@ServiceDomain/blockchain/dto/interfaces/blockchain.interface'
import { tokenForClient } from '@ServiceDomain/blockchain/dto/interfaces/token.interface'


export interface supportedTokenAndBlockchain {
  blockchain: blockchainForClient
  token: tokenForClient
  walletAddress: string
  id: string
}

export interface configForClient {
  userId: string
  posId: string
  supportedTokenAndBlockchains: supportedTokenAndBlockchain[]
}

export interface getOneConfig {
  id?: string
  posId?: string
  userId?: string
}

export interface createOrUpdateConfigProfile {
  userId: string
  posId: string
  sendReceiveNotif: boolean
}

export interface addWallet {
  userId: string
  posId: string
  tokenId: string
  blockchainId: string
  walletAddress: string
}

