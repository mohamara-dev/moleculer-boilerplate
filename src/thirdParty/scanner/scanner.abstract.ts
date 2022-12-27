import { Transaction } from '@ServiceDomain/pos/models/transaction.DBmodel'

export default abstract class ScannerAbstract {
  public abstract analyzeStatusResult(transaction: Transaction): Promise<any>
  public abstract getTransactionsFromBlockchain(walletAddress: string): Promise<any>
}
