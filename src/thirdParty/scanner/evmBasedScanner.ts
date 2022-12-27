import ScannerAbstract from './scanner.abstract'
import axios, { AxiosRequestConfig } from 'axios'
import Web3 from 'web3'
import Big from 'big.js'
import { statusResult } from '@ServiceDomain/pos/dto/interfaces/scanner.interface'
import { Blockchain } from '@ServiceDomain/blockchain/models/blockchain.DBmodel'
import { Context } from 'moleculer'
import { Transaction } from '@ServiceDomain/pos/models/transaction.DBmodel'

export default class EvmScanner extends ScannerAbstract {
  blockchain: Blockchain

  constructor(blockchain: Blockchain) {
    super()
    this.blockchain = blockchain
  }

  private async sendRequest(requestParams: string): Promise<any> {
    try {
      const URLParams = `?${requestParams}&apikey=${this.blockchain.explorerApiKey}`
      const requestConfig: AxiosRequestConfig = {
        url: this.blockchain.explorerEndPoint + URLParams,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
      const data = await axios(requestConfig)
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

  // public async decodeTransactionData(provider: string, txHash: string, networkCoin: string): Promise<unknown> {
  //   try {
  //     if (txHash.length != 42) {
  //       const web3 = new Web3(new Web3.providers.HttpProvider(provider)) // your web3 provider

  //       let symbol: string
  //       let amount: number
  //       let targetAdress: string
  //       let fromAdress: string
  //       let result
  //       const abi =
  //         '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'

  //       return web3.eth
  //         .getTransaction(txHash)
  //         .then(async (tx) => {
  //           console.log('decode tx', tx)
  //           if (tx) {
  //             const tx_data = tx.input
  //             if (tx_data.length > 3) {
  //               const IntermadiateContract = new web3.eth.Contract(JSON.parse(abi), tx.to)
  //               symbol = await IntermadiateContract.methods.symbol().call()
  //               const decimals = await IntermadiateContract.methods.decimals().call()
  //               const input_data = '0x' + tx_data.slice(10) // get only data without function selector
  //               const params = await web3.eth.abi.decodeParameters(['address', 'uint'], input_data)
  //               amount = params[1] / 10 ** decimals
  //               targetAdress = params[0]
  //             } else {
  //               amount = parseFloat(await web3.utils.fromWei(tx.value))
  //               fromAdress = tx.from
  //               targetAdress = tx.to
  //               symbol = networkCoin
  //             }
  //             fromAdress = tx.from
  //           } else {
  //             throw BTXError.TransactionNotFound
  //           }
  //         })
  //         .then(() => {
  //           result = { from: fromAdress, to: targetAdress, amount: amount, symbol: symbol }
  //           return result
  //         })
  //     } else {
  //       throw BTXError.TransactionTxHashIsNotCorrect
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     throw error
  //   }
  // }

  public async web3Decoder(provider: string, input: string, to: string): Promise<any> {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(provider))
      const version = web3.version
      const abi =
        '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'

      const IntermadiateContract = new web3.eth.Contract(JSON.parse(abi), to)
      const input_data = '0x' + input.slice(10) // get only data without function selector
      const params = await web3.eth.abi.decodeParameters(['address', 'uint'], input_data)


      // const IntermadiateContract = new web3.eth.abi.decodeLog(input,'',abi)
      console.log(IntermadiateContract)

      const symbol = await IntermadiateContract.methods.symbol().call()
      console.log(symbol)
      // const decimals = await IntermadiateContract.methods.decimals().call()
      // const input_data = '0x' + tx_data.slice(10) // get only data without function selector
      // const params = await web3.eth.abi.decodeParameters(['address', 'uint'], input_data)
      // amount = params[1] / 10 ** decimals
      // targetAdress = params[0]

    } catch (error) {
      console.log(error)
    }
  }

  public async getTransactionsFromBlockchain(walletAddress: string): Promise<any> {
    try {

      const tokenTansactionsRequestParams = `module=account&action=tokentx&startblock=0&endblock=999999999&page=1&offset=10&sort=desc&address=${walletAddress}`
      const normalTansactionsRequestParams = `module=account&action=txlist&startblock=0&endblock=999999999&page=1&offset=10&sort=desc&address=${walletAddress}`
      const tokenTxResults = await this.sendRequest(tokenTansactionsRequestParams)
      const normalTxResults = await this.sendRequest(normalTansactionsRequestParams)
      const allResults = {
        tokenTxResults: tokenTxResults.result,
        normalTxResults: normalTxResults.result
      }
      return allResults
    } catch (error) {
      console.log(error)
    }
  }

  public async analyzeStatusResult(transaction: Transaction): Promise<statusResult> {
    try {
      console.log('analyzing ', this.blockchain.displayName)
      Big.NE = -100
      Big.DP = 100
      let trueAmount
      let tokenDecimal
      let targetTransaction: any
      const allRecentTransactions = await this.getTransactionsFromBlockchain(transaction.merchantWalletAddress)
      for (const oneTransaction of allRecentTransactions.normalTxResults) {
        if (oneTransaction.from.toLowerCase() == transaction.customerWalletAddress.toLowerCase()) {
          tokenDecimal = Number(oneTransaction.tokenDecimal ?? 18)
          trueAmount = Big(oneTransaction.value).div(Big(10).pow(tokenDecimal)).toString()
          const tokenDecimalForCalc = tokenDecimal - 1
          if (
            Big(transaction.tokenAmount)
              .prec(tokenDecimalForCalc)
              .toString()
              .slice(0, trueAmount.length - 1) === trueAmount.slice(0, -1)
          ) {
            targetTransaction = oneTransaction;
            break;
          }
        }
      }
      if (!targetTransaction) {
        for (const oneTransaction of allRecentTransactions.tokenTxResults) {
          if (oneTransaction.from.toLowerCase() == transaction.customerWalletAddress.toLowerCase()) {
            tokenDecimal = Number(oneTransaction.tokenDecimal ?? 18)
            trueAmount = Big(oneTransaction.value).div(Big(10).pow(tokenDecimal - 1)).toString()
            const tokenDecimalForCalc = tokenDecimal - 1
            if (Big(transaction.tokenAmount).prec(tokenDecimalForCalc).toString().slice(0, trueAmount.length - 1) === trueAmount.slice(0, -1)) {
              targetTransaction = oneTransaction
              break
            }
          }
        }
      }
      const symbol = targetTransaction.tokenSymbol ?? this.blockchain.nativeCoinSymbol
      const txHash = targetTransaction.hash
      const timeStamp = targetTransaction.timeStamp

      const result = {
        merchantWalletAddress: transaction.merchantWalletAddress,
        customerWalletAddress: transaction.customerWalletAddress,
        amount: trueAmount.toString(),
        symbol: symbol,
        txHash: txHash,
        timeStamp: timeStamp,
        tokenDecimal: tokenDecimal.toString()
      }

      return result
    } catch (error) {
      console.log(error)
    }
  }

}
