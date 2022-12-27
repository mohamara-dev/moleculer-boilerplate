
export interface blockchainForClient {
  displayName: string;
  name: string;
  imageUrl: string
  chainId: string
  id: string
}

export interface createOrUpdateOneBlockchainInterface {
  id?: string
  name: string
  displayName: string
  persianDisplayName: string
  networkNameInBinanceApis: string
  imageUrl?: string
  hasMemoId: boolean
  chainId: string
  addressRegex: string
  rpcUrls: string
  blockExplorerUrls: string
  chainName: string
  networkType: string
  nativeCoinSymbol: string
  explorerApiKey: string
  explorerEndPoint: string
}
