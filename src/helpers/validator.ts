import Validator from 'fastest-validator'
import { Context } from 'moleculer'  

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WAValidator = require('multicoin-address-validator')

const validateNationalId = (nationalId: string): boolean => {
  const nationalIdArray = nationalId.split('').map((element) => {
    return Number(element)
  })
  if (nationalId.length !== 10) {
    return false
  }
  let sum = 0
  for (let i = 0; i < 9; i++) {
    const element = nationalIdArray[i]
    if (isNaN(element)) {
      false
    }
    const controlNumber = 10 - i
    sum += element * controlNumber
  }
  const calculatedControlNumber = sum % 11 < 2 ? sum % 11 : 11 - (sum % 11)
  if (calculatedControlNumber !== nationalIdArray[9]) {
    return false
  }
  return true
}

const validateWalletAddress = async (ctx: Context, walletAddress: string, blockchainName: string, binanceApiName: string): Promise<boolean> => {
  let addressRegex: RegExp
  const findBlockchainFromBinanceDbCallingParameters = {
    networkNameInBinanceApi: binanceApiName.toUpperCase(),
  }

  switch (blockchainName) {
    case 'bsc':
    case 'arbitrum':
      blockchainName = 'ethereum'
      break
    case 'ronin':
      blockchainName = 'ethereum'
      walletAddress = walletAddress.replace('ronin:', '0x')
      break
    case 'bep2':
      addressRegex = /^(bnb)[0-9A-Za-z]{39}$/
      return addressRegex.test(walletAddress)
    case 'solana':
      addressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
      return addressRegex.test(walletAddress)
    case 'polygon':
      addressRegex = /^(0x)[0-9A-Fa-f]{40}$/
      return addressRegex.test(walletAddress)
    case 'filecoin':
      addressRegex = /^[a-z0-9]{41}$|[a-z0-9]{86}$/
      return addressRegex.test(walletAddress)
    case 'avalanche':
      addressRegex = /^(X-avax)[0-9A-za-z]{39}$/
      return addressRegex.test(walletAddress)
    case 'avalanchecchain':
      addressRegex = /^(0x)[0-9A-Fa-f]{40}$/
      return addressRegex.test(walletAddress)
    case 'theta':
      addressRegex = /^(0x)[0-9A-Fa-f]{40}$/
      return addressRegex.test(walletAddress)
    case 'elrond':
      addressRegex = /^(erd)[a-z-A-Z0-9]{59}$/
      return addressRegex.test(walletAddress)
    case 'iota':
      addressRegex = /^(iota)[0-9a-z]{60}$/
      return addressRegex.test(walletAddress)
    case 'near':
      addressRegex = /^[a-z0-9_-]{1}[a-z0-9_.-]{0,62}[a-z0-9_-]{1}$/
      return addressRegex.test(walletAddress)
    case 'fantom':
      addressRegex = /^(0x)[0-9A-Fa-f]{40}$/
      return addressRegex.test(walletAddress)
    case 'klaytn':
      addressRegex = /^(0x)[0-9A-Fa-f]{40}$/
      return addressRegex.test(walletAddress)
    case 'harmony':
      addressRegex = /^(one1)[a-z0-9]{38}$/
      return addressRegex.test(walletAddress)
    case 'internetcomputer':
      addressRegex = /^[0-9a-zA-Z]{64}$/
      return addressRegex.test(walletAddress)
    case 'mina':
      addressRegex = /^(B62)[A-Za-z0-9]{52}$/
      return addressRegex.test(walletAddress)
    case 'waves':
      addressRegex = /^(3P)[0-9A-Za-z]{33}$/
      return addressRegex.test(walletAddress)
    case 'bitcoingold':
      addressRegex = /^[AG][a-km-zA-HJ-NP-Z1-9]{25,34}$/
      return addressRegex.test(walletAddress)
    default:
      break
  }

  return WAValidator.validate(walletAddress, blockchainName.toUpperCase())
}

export default {
  validateNationalId,
  validateWalletAddress,
}

export function fastestValidator(schema: any, dataForValidation: any, alias?: any): any {
  try {
    const v = new Validator({
      defaults: {
        object: {
          strict: 'remove',
        },
      },
    })
    if (alias) {
      v.alias(alias.name, alias.definition)
    }
    const check = v.compile(schema)
    return check(dataForValidation)
  } catch (error) {
    console.log(error)
  }
}
 