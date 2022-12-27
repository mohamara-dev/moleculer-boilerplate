
export const createOrUpdateBlockchain = {
  id: { type: 'string', optional: true },
  name: { type: 'string' },
  displayName: { type: 'string' },
  persianDisplayName: { type: 'string' },
  networkNameInBinanceApis: { type: 'string' },
  imageUrl: { type: 'string', optional: true },
  hasMemoId: { type: 'boolean', optional: true },
  chainId: { type: 'string' },
  addressRegex: { type: 'string', optional: true },
  rpcUrls: { type: 'string', optional: true },
  blockExplorerUrls: { type: 'string', optional: true },
  chainName: { type: 'string', optional: true },
  networkType: { type: 'string', optional: true },
  nativeCoinSymbol: { type: 'string', optional: true },
  explorerEndPoint: { type: 'string', optional: true },
  explorerApiKey: { type: 'string', optional: true },

  $$strict: true // no additional properties allowed
}



