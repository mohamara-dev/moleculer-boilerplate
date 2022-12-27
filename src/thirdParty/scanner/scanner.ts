import { Context } from 'moleculer'
import ScannerAbstract from './scanner.abstract'
import evmScanner from '@ThirdParty/scanner/evmBasedScanner'
import { updateOneTransaction } from '@ServiceDomain/pos/dto/interfaces/transaction.interface'
import { Blockchain } from '@ServiceDomain/blockchain/models/blockchain.DBmodel'
import { Transaction } from '@ServiceDomain/pos/models/transaction.DBmodel'

export default class ScannerController extends ScannerAbstract {

  private static instance: ScannerController
  static provider: ScannerAbstract
  public explorerEndPoint: string

  constructor(network: Blockchain) {
    super()
    this.decideWhichScannerProviderShouldBeUsed(network)
  }

  public static shared(network: Blockchain): ScannerController {
    if (!ScannerController.instance) {
      const instance = new ScannerController(network)
      ScannerController.instance = instance
    }
    return ScannerController.instance
  }

  public async analyzeStatusResult(transaction: Transaction, ctx?: Context): Promise<any> {
    try {
      const data = await ScannerController.provider.analyzeStatusResult(transaction)
      if (data) {
        const updateTransactionCallingParameters: updateOneTransaction = {
          txHash: data.txHash,
          merchantWalletAddress: data.merchantWalletAddress,
          customerWalletAddress: data.customerWalletAddress,
          amount: data.amount,
          timeStamp: data.timeStamp,
          isBlockchainConfirmed: true
        }
        await ctx.call('v1.transaction.update', updateTransactionCallingParameters)
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
    }

  }

  public async getTransactionsFromBlockchain(merchantWalletAddress: string): Promise<any> {
    await ScannerController.provider.getTransactionsFromBlockchain(merchantWalletAddress)
  }

  private decideWhichScannerProviderShouldBeUsed(network: Blockchain) {
    if (network.networkType == 'evm') {
      ScannerController.provider = new evmScanner(network)
    }
    return ScannerController
  }
}
