import { Context, ServiceBroker } from "moleculer";
import { ObjectId } from "mongodb";

import { YFTError } from "@Base/yft";
import YFTController from "@ServiceDomain/yft.controller";

import ChatDBModel, { Chat } from "@ServiceDomain/chat/models/chat.DBmodel";
import UserDBModel, { User } from "@ServiceDomain/iam/models/user.DBmodel";
import ChatRoomDBModel, { ChatRoom } from "@ServiceDomain/chat/models/chatRoom.DBmodel"
import { getDealChatroom, preparedChat, preparedChatRoom, sendMessageInChatroom } from "@ServiceDomain/chat/dto/chat.interface";
import { fastestValidator } from "@Helpers/validator";
import { createTextChangeRange } from "typescript";
import GeneralMetaRequests from '@Types/interfaces/generalMeta.interface'

export default class ChatController extends YFTController {
  constructor() {
    super(ChatDBModel);
  }
  private static instance: ChatController
  private broker: ServiceBroker

  public static shared(): ChatController {
    if (!ChatController.instance) {
      const instance = new ChatController()
      ChatController.instance = instance
    }
    return ChatController.instance
  }

  private prepareChat(chat: Chat, userId: string): preparedChat {
    const prepared = {
      id: chat._id.toHexString(),
      message: chat.message,
      sender: chat.senderId == userId,
      timeStamp: new Date(chat.createdAt).getTime(),
    };
    return prepared;
  }

  private async prepareCaseChatRoom(chatRoom: ChatRoom): Promise<any> {
    const latestChat: any = await ChatDBModel.find({
      chatRoomId: chatRoom._id.toString(),
    })
      .sort({ createdAt: -1 })
      .limit(1);
    const user: User = await UserDBModel.findById(latestChat[0].senderId != 'me' && latestChat[0].senderId != 'you' ? latestChat[0].senderId : null);

    const prepared = {
      theCase: {
        id: chatRoom.dealId,
      },
      message: {
        chatterName: user ? user.fullName : latestChat[0].senderId,
        time: new Date(latestChat[0].createdAt).getTime(),
        id: chatRoom._id.toString(),
        message: latestChat[0].message,
      },
    };

    return prepared;
  }

  public async getUserAllChatRooms(ctx: Context<never, GeneralMetaRequests.RequestMetaData>): Promise<preparedChatRoom[]> {

    const chatRooms: any = await ChatRoomDBModel.find({
      ownerId: 'me'/* ctx.meta.user._id.toString() */,
      isDeleted: false,
    });

    const result = [];
    for (const chatRoom of chatRooms) {
      result.push(await this.prepareCaseChatRoom(chatRoom));
    }
    return result;
  }
  public async getDealAllChatRooms(dealId: string): Promise<preparedChatRoom[]> {

    const chatRooms: any = await ChatRoomDBModel.find({
      dealId: dealId,
      isDeleted: false,
    });

    const result = [];
    for (const chatRoom of chatRooms) {
      result.push(await this.prepareCaseChatRoom(chatRoom));
    }
    return result;
  }
  public async getDealOneChatRooms(ctx: Context<getDealChatroom, GeneralMetaRequests.RequestMetaData>): Promise<string> {
    try {
      const validationResult = fastestValidator(ctx.meta.validationSchema, ctx.params)
      if (validationResult == true) {
        const chatRoom: ChatRoom = await ChatRoomDBModel.findOne({
          dealId: ctx.params.dealId,
          ownerId: ctx.params.ownerId,
          isDeleted: false,
        });

        return chatRoom ? chatRoom._id.toString() : '';
      } else {
        console.log(validationResult)
        throw YFTError.InvalidRequest()
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  public async getChatRoomAllChats(chatRoomId: string, userId: string): Promise<preparedChat[]> {
    const chats: any = await ChatDBModel.find({
      chatRoomId,
    });
    const result = [];
    for (const chat of chats) {
      result.push(this.prepareChat(chat, userId));
    }
    return result;
  }

  public async createOrEditChat(ctx: Context<sendMessageInChatroom, GeneralMetaRequests.RequestMetaData>): Promise<preparedChat> {
    try {
      const validationResult = fastestValidator(ctx.meta.validationSchema, ctx.params)
      if (validationResult == true) {
        const userId = 'me'//ctx.meta.user._id.toString()
        const chatObject = {
          senderId: userId,
          message: ctx.params.message,
          chatRoomId: ctx.params.chatRoomId,
        };
        let chatId;
        if (ctx.params.id) {
          chatId = ctx.params.id;
          // if (!calledByAdmin) {
          const chat = await ChatDBModel.findById(chatId);
          if (chat.senderId != userId) {
            throw YFTError.YouCannotEditOthersComment();
          }
          // }
        } else {
          chatId = new ObjectId().toHexString();
        }
        delete ctx.params.id;

        const chat = await ChatDBModel.findByIdAndUpdate(chatId, chatObject, {
          new: true,
          upsert: true,
        });

        if (ctx.params.replyTo) {
          await ChatDBModel.findByIdAndUpdate(
            ctx.params.replyTo,
            { $addToSet: { replies: chat._id.toHexString() } },
            { new: true, upsert: true }
          );
        }
        return this.prepareChat(chat, userId);
      } else {
        console.log(validationResult)
        throw YFTError.InvalidRequest()
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  public async createChatroom(ctx: Context<any, GeneralMetaRequests.RequestMetaData>, requestParams: any, validationParams: any): Promise<string> {
    try {
      const validationResult = fastestValidator(validationParams, requestParams)
      if (validationResult == true) {
        const chatRoomObject = {
          ownerId: 'me',//ctx.meta.user._id,
          isDeleted: requestParams.isDeleted ?? false,
          isArchived: requestParams.isArchived ?? false,
        };
        let chatRoomId;
        if (requestParams.chatRoomId) {
          chatRoomId = requestParams.chatRoomId;
          const chatRoom = await ChatRoomDBModel.findById(chatRoomId);
          if (chatRoom.ownerId != 'me'/*ctx.meta.user._id.toString()*/) {
            throw YFTError.YouCannotEditOthersChatRoom();
          }
        } else {
          chatRoomId = new ObjectId().toString();
        }
        delete requestParams.chatRoomId;

        await ChatRoomDBModel.findByIdAndUpdate(
          chatRoomId,
          chatRoomObject,
          { new: true, upsert: true }
        );

        return chatRoomId;
      } else {
        console.log(validationResult)
        throw YFTError.InvalidRequest()
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  public async enterChatRoom(ctx: Context<any, GeneralMetaRequests.RequestMetaData>, requestParams: any, validationParams: any): Promise<preparedChat[]> {
    const chatRoomId = await this.createChatroom(
      ctx,
      requestParams,
      validationParams
    );
    const chats = await this.getChatRoomAllChats(
      chatRoomId,
      'me'/*ctx.meta.user._id.toString()*/
    );
    return chats;
  }

  // public async approveOrDeleteChat(id: string, isDeleted: boolean, isApproved: boolean, letList: boolean): Promise<Comment> {
  //   const comment = await ChatDBModel.findByIdAndUpdate(id, { isDeleted, isApproved, letList }, { new: true })
  //   return comment
  // }
}
