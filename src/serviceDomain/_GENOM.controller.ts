// import _XxxxxDBModel, { _Xxxxx } from '@Models/_xxxxx.DBmodel'
// import { ObjectId } from 'mongodb'
// import { _xxxxxForClient } from '@Types/interfaces/controllers/_xxxxx.interface'
// import TokenServiceRequests from '@Types/interfaces/services/tokenService.interface'
// import { Context } from 'moleculer'
// import BlockchainServiceRequests from '@Types/interfaces/services/blockchainService.interface'
// import { blockchainForClient } from '@Types/interfaces/controllers/blockchain.interface'
// import { tokenForClient } from '@Types/interfaces/controllers/token.interface'

// export default class _XxxxxController {

//   private async prepareForClient(ctx: Context, _xxxxx: _Xxxxx): Promise<_xxxxxForClient>{
//     try {
  
//       const getTokenCallingParameters: TokenServiceRequests.getOne = { id: _xxxxx.tokenId }
//       const token: tokenForClient = await ctx.call('v1.token.getOne', getTokenCallingParameters)
    
//       const getBlockchainCallingParameters: BlockchainServiceRequests.getOne = { id: _xxxxx.blockchainId }
//       const blockChain: blockchainForClient = await ctx.call('v1.blockchain.getOne', getBlockchainCallingParameters)
    
//       const _xxxxxForClient = {
//         id: _xxxxx._id.toHexString(),

//         amount: _xxxxx.amount,
//         customerWalletAddress: _xxxxx.customerWalletAddress,
//         token: token,
//         blockChain: blockChain,
//         posId: _xxxxx.posId,
//         payerMobile: _xxxxx.payerMobile,
//         txHash: _xxxxx.txHash
//       }
//       return _xxxxxForClient
  
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   public async getOneById(ctx: Context, _xxxxxId: string, isRequestedByAdmin = false): Promise<_xxxxxForClient | _Xxxxx> {
//     const _xxxxx = await _XxxxxDBModel.findById(_xxxxxId)
//     let prepared_Xxxxx 
//     if (isRequestedByAdmin) {
//       prepared_Xxxxx = _xxxxx
//     } else {
//       prepared_Xxxxx = this.prepareForClient(ctx, _xxxxx)
//     }
//     return prepared_Xxxxx
//   }

//   public async getAll(ctx: Context, isRequestedByAdmin = false): Promise<_Xxxxx[]> {
//     const _xxxxxs = await _XxxxxDBModel.find()
//     _xxxxxs.map((_xxxxx) => {
//       if (isRequestedByAdmin) {
//         return _xxxxx
//       } else {
//         return this.prepareForClient(ctx, _xxxxx)
//       }
//     })
//     return _xxxxxs
//   }

//   public async createOrUpdate(id: string, shortName: string, pricingMarketSymbolsToUsdt: string, longNameEn: string, longNameFa: string, imageUrl: string, sortingPosition: number): Promise<_Xxxxx> {
//     const longNameEnTrimmed = longNameEn.replace(new RegExp('[-]', 'g'), '').replace(new RegExp('[ ]', 'g'), '').toLowerCase()
//     const new_Xxxxx = {
//       shortName: shortName,
//       pricingMarketSymbolsToUsdt: pricingMarketSymbolsToUsdt,
//       longNameEn: longNameEn,
//       longNameFa: longNameFa,
//       imageUrl: imageUrl,
//       longNameEnTrimmed: longNameEnTrimmed,
//       sortingPosition:sortingPosition
//     }
//     if (!id) {
//       id =  new ObjectId().toHexString()
//     }
    
//     const _xxxxx = await _XxxxxDBModel.findByIdAndUpdate(id, new_Xxxxx, { upsert: true, new: true })
//     return _xxxxx
//   }

//   public async deleteOne(id:string): Promise<string> {
//     await _XxxxxDBModel.deleteOne({ _id: id })
//     return 'done'
//   }

//   public async count(): Promise<number> {
//     const _xxxxxsCount = await _XxxxxDBModel.count()
//     return _xxxxxsCount
//   }


// }
