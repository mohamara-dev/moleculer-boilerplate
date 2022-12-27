export const SupportedBlockchainNames = ['ethereum', 'bsc', 'tron', 'litecoin', 'dogecoin', 'dash', 'bitcoin', 'zcash', 'ronin', 'solana', 'cardano', 'algorand', 'polkadot', 'bitcoincash', 'polygon', 'filecoin', 'tezos', 'avalanche', 'avalanchecchain', 'vechain', 'theta', 'elrond', 'iota', 'near', 'neo', 'fantom', 'klaytn', 'harmony', 'internetcomputer', 'arbitrum', 'bep2'] as const
export type BlockchainNames = typeof SupportedBlockchainNames[number]

export const PossibleTimeFrame = ['1min', '5min', '10min', '30min', '1hour', '1day'] as const
export type TimeFrame = typeof PossibleTimeFrame[number]

export const PossibleSupportedProtocols = ['erc20', 'bep20'] as const
export type SupportedProtocols = typeof PossibleSupportedProtocols[number]

export const PossibleSupportedNetworks = ['mainnet', 'ropsten', 'testnet', 'shasta'] as const
export type SupportedNetworks = typeof PossibleSupportedNetworks[number]

export const PossibleSupportedWalletAddressEntryTypes = ['direct', 'web3']
export type SupportedWalletAddressEntryTypes = typeof PossibleSupportedWalletAddressEntryTypes[number]

export const PossibleProformaErrorTypes = ['less-than-min' ,'more-than-max']
export type ProformaErrorTypes = typeof PossibleProformaErrorTypes[number]
