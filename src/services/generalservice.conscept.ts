// import { Context, Service, ServiceBroker } from 'moleculer'
// import { AdminsPrivileges, YFTError } from '@Base/yft'
// import { fastestValidator } from '../helpers/validator'
// import BlockchainController from '@Controllers/blockchain.controller'
// import GeneralRequests from '@Types/interfaces/general.interface'
// import BlockchainServiceRequests from '@Types/interfaces/services/blockchainService.interface'
// import { BlockchainServiceRequestsSchemas } from '@Types/validatorSchemas/blockchainServiceSchemas'
// import LoggerController from '@Controllers/logger.controller'

// export default class Admin extends Service {
//   public constructor(broker: ServiceBroker) {
//     super(broker)
//     this.parseServiceSchema({
//       name: 'blockchain',
//       version: 1,
//       settings: {},
//       dependencies: ['v1.logger'],
//       actions: {
//         check: {
//           rest: '/health-check',
//           async handler(): Promise<string> {
//             return this.healthCheck()
//           }
//         },
      
//         getOne: {
//           rest: 'GET /',
//           auth: true,
//           async handler(ctx: Context<BlockchainServiceRequests.getOne, GeneralRequests.RequestMetaData>) {
//             const validationResult = fastestValidator(new BlockchainServiceRequestsSchemas().getOne, ctx.params)
//             if (validationResult == true) {
//               const tokenId = ctx.params.id
//               const isRequestedByAdmin = ctx.params.isRequestedByAdmin ? ctx.params.isRequestedByAdmin : false
//               const data = await new BlockchainController().getOneById(tokenId, isRequestedByAdmin)
//               return data
//             } else {
//               LoggerController.shared().recordGeneralExceptionLog(this.name, '', 'checkMobile', 'field-validation-failed', '', validationResult)
//               throw YFTError.InvalidRequest
//             }
//           }
//         },

//         getAll: {
//           rest: 'GET /getAll',
//           async handler(ctx: Context<BlockchainServiceRequests.getAll, GeneralRequests.RequestMetaData>) {
//             const isRequestedByAdmin = ctx.params.isRequestedByAdmin ? ctx.params.isRequestedByAdmin : false
//             const data = await new BlockchainController().getAll(isRequestedByAdmin)
//             return data
//           }
//         },
        
//         count: {
//           async handler(ctx: Context<BlockchainServiceRequests.getAll, GeneralRequests.RequestMetaData>) {
//             const data = await new BlockchainController().count()
//             return data
//           }
//         },

//         createOrUpdate: {
//           async handler(ctx: Context<BlockchainServiceRequests.createOrUpdateOne, GeneralRequests.RequestMetaData>) {
//             const name = ctx.params.name
//             const displayName = ctx.params.displayName
//             const persianDisplayName = ctx.params.persianDisplayName
//             const networkNameInBinanceApis = ctx.params.networkNameInBinanceApis
//             const imageUrl = ctx.params.imageUrl
//             const hasMemoId = ctx.params.hasMemoId
//             const chainId = ctx.params.chainId
//             const addressRegex = ctx.params.addressRegex
//             const rpcUrls = ctx.params.rpcUrls
//             const blockExplorerUrls = ctx.params.blockExplorerUrls
//             const chainName = ctx.params.chainName
//             const id = ctx.params.id ? ctx.params.id : null
              
//             const data = await new BlockchainController().createOrUpdate(id, name, displayName, persianDisplayName, networkNameInBinanceApis, hasMemoId, chainId, addressRegex, rpcUrls, blockExplorerUrls, chainName, imageUrl)
//             return data
//           }
//         },

//         deleteOne: {
//           async handler(ctx: Context<BlockchainServiceRequests.deleteOne, GeneralRequests.RequestMetaData>) {
//             const id = ctx.params.id  
//             const data = await new BlockchainController().deleteOne(id)
//             return data
//           }
//         }
//       },
//       created() {
//         // broker.call('v1.logger.serviceStatusChanged', {serviceName: this.name, status: 'created'})
//       },

//       async started() {
//         broker.call('v1.logger.serviceStatusChanged', { serviceName: this.name, status: 'started' })
//       },

//       async stopped() {
//         broker.call('v1.logger.serviceStatusChanged', { serviceName: this.name, status: 'stopped' })
//       }
//     })
//   }

//   private healthCheck(): string {
//     return 'Works'
//   }
// }
