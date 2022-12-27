// import Big from 'big.js'

// import EvmScanner from '@ThirdParty/scanner/evmBasedScanner'
// import { statusResult } from '@Types/interfaces/controllers/scanner.interface'


// export default class ethScanner extends EvmScanner{
//   constructor() {
//     super(process.env.ETHERSCAN_API_BASE_URL,process.env.ETHERSCAN_API_KEY)
//   }

//   public async analyzeStatusResult(merchantWalletAddress: string, customerWalletAddress: string): Promise<statusResult> {
//     try {
//       console.log('analyzing eth')
//       let targetTransaction:any
//       const allRecentTransactions = await this.getTransactions(merchantWalletAddress)
//       for (const transaction of allRecentTransactions.normalTxResults) {
//         if (transaction.from.toLowerCase() == customerWalletAddress.toLowerCase()) {
//           targetTransaction = transaction
//           break
//         }
//       }
//       if (!targetTransaction) {
//         for (const transaction of allRecentTransactions.tokenTxResults) {
//           if (transaction.from.toLowerCase() == customerWalletAddress.toLowerCase()) {
//             targetTransaction = transaction
//             break
//           }
//         }
//       }
//       Big.NE = -8
//       Big.DP = 20
//       const symbol = targetTransaction.tokenSymbol ?? 'ETH'
//       const tokenDecimal = Number(targetTransaction.tokenDecimal) ?? 18
//       const trueAmount = Big(targetTransaction.value).div(Big(10).pow(tokenDecimal))
//       const txHash = targetTransaction.hash 
//       const timeStamp = targetTransaction.timeStamp 
    
//       const result = {
//         merchantWalletAddress: merchantWalletAddress,
//         customerWalletAddress:customerWalletAddress,
//         amount: trueAmount.toString(),
//         symbol: symbol,
//         txHash: txHash,
//         timeStamp: timeStamp,
//         tokenDecimal: tokenDecimal.toString()
//       }

//       return result

//     } catch (error) {
//       console.log(error)
//     }
//   }

// }
