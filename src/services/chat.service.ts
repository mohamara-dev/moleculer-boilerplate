import ChatController from '@ServiceDomain/chat/controllers/chat.controller'
import { Context, Service, ServiceBroker } from 'moleculer'
import genericServiceMixin from "./mixin/generic.service"
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'
import { createChatroomValidationSchema, getDealChatroomValidationSchema, sendMessageInChatroomValidationSchema } from '@ServiceDomain/chat/dto/chat.validation'
import { getDealChatroom, sendMessageInChatroom } from '@ServiceDomain/chat/dto/chat.interface'
export default class categoryService extends Service {
  /**
 * myController and myControllerShared is used in generic service to call generic methods
 * these are not used directly in this service
 */
  private myController = new ChatController()
  private myControllerShared = ChatController.shared()
  /**
   * allow generic service actions due to options:
   * C : create
   * R : read
   * U : update
   * D : delete
   */
  private serviceGenericFeature = ''
  public constructor(broker: ServiceBroker) {
    super(broker)
    this.parseServiceSchema({
      name: 'chat',
      version: 1,
      dependencies: [],
      mixins: [genericServiceMixin],
      actions: {
        createOrResume: {
          rest: "POST /room/create",
          async handler(ctx: Context<any, GeneralMetaRequests.RequestMetaData>) {
            ctx.meta.validationSchema = createChatroomValidationSchema
            const chatroom = this.myControllerShared.createChatroom(ctx, ctx.params, ctx.meta.validationSchema)
            return chatroom
          },
        },
        enterChatroom: {
          rest: "POST /room/enter",
          async handler(ctx: Context<any, GeneralMetaRequests.RequestMetaData>) {
            ctx.meta.validationSchema = createChatroomValidationSchema
            const chatroom = this.myControllerShared.enterChatRoom(ctx, ctx.params, ctx.meta.validationSchema)
            return chatroom
          },
        },
        createOrEditChat: {
          rest: "POST /message",
          async handler(ctx: Context<sendMessageInChatroom, GeneralMetaRequests.RequestMetaData>) {
            ctx.meta.validationSchema = sendMessageInChatroomValidationSchema
            const chatroom = this.myControllerShared.createOrEditChat(ctx, ctx.params, ctx.meta.validationSchema)
            return chatroom
          },
        },
        getAll: {
          rest: "GET /all",
          async handler(ctx: Context<never, GeneralMetaRequests.RequestMetaData>) {
            const chatrooms = this.myControllerShared.getUserAllChatRooms(ctx, ctx.params)
            return chatrooms
          },
        },
        getDealRoom: {
          async handler(ctx: Context<getDealChatroom, GeneralMetaRequests.RequestMetaData>) {
            ctx.meta.validationSchema = getDealChatroomValidationSchema
            const chatroom = this.myControllerShared.getDealOneChatRooms(ctx)
            return chatroom
          },
        },
      },
    })
  }
}
