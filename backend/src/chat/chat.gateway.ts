import { HttpStatus } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import {
  AcceptFriendDto,
  AddFriendDto,
  AnyMsgDto,
  ChannelSearchDto,
  MsgPrivateReqDto,
  PublicMsgDto,
  SetChannelMsgDto,
  SocketResDto,
} from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ChannelService } from './channel.service';
import { ChatHistory } from './chat.history';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
  namespace: 'chat',
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly channelService: ChannelService,
    private readonly chatHistory: ChatHistory,
  ) {}

  private onlineClients: Map<string, Socket> = new Map<string, Socket>();

  @WebSocketServer() server: Server;

  @SubscribeMessage('msg')
  async privateMsg(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MsgPrivateReqDto,
  ) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('msg', res);
      return;
    }
    if (!payload || !user.uid || !payload.text || !payload.toId) {
      const res: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'No payload provided',
      };
      client.emit('msg', res);
      return;
    }
    const userObj: User = await this.channelService.getUserById(user.uid);
    if (!userObj) {
      const response: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('msg', response);
      return;
    }
    if (user.uid === payload.toId) {
      const response: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'You sending a message to yourself... lonely much?',
      };
      client.emit('msg', response);
      return;
    }

    const channelID = await this.chatService.setChannelId(
      userObj.username,
      payload.toId,
    );

    if (!channelID) {
      const response: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Payload is not valid',
      };
      client.emit('msg', response);
      return;
    }

    const verifyChannel = await this.chatService.isChannelExist(
      userObj.username,
      channelID,
    );
    if (!verifyChannel) {
      await this.chatService.createChannel(
        userObj.username,
        payload.toId,
        channelID,
      );
    }

    const blocked = await this.chatService.isUserBlocked(
      userObj.username,
      payload.toId,
    );
    if (blocked) {
      const response: SocketResDto = {
        status: HttpStatus.FORBIDDEN,
        message: 'You are blocked by this user',
      };
      client.emit('msg', response);

      return;
    }

    const inChannel = client.rooms.has(channelID);
    if (!inChannel) {
      client.join(channelID);
      client.to(channelID).emit('privateJoined', userObj.username);
    }

    await this.chatService.savePrivateMsg({
      msg: payload.text,
      from: userObj.username,
      channelId: channelID,
      toID: payload.toId,
    });

    const userr: User = await this.channelService.getUserById(user.uid);
    const receiver: User = await this.channelService.getUserById(payload.toId);
    const response: AnyMsgDto = {
      text: payload.text,
      avatar: userr.avatar,
      fromUsername: userr.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      channelName: null,
      channelId: null,
      fromId: user.uid,
      toId: receiver.id,
      toUsername: receiver.username,
      privateChannelId: channelID,
    };
    client.to(channelID).emit('msg', response);
  }

  @SubscribeMessage('PublicMsg')
  async PublicMsg(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PublicMsgDto,
  ) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('PublicMsg', res);
      return;
    }
    if (!payload || !user.uid || !payload.text || !payload.id) {
      const res: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'No payload provided',
      };
      client.emit('PublicMsg', res);
      return;
    }

    const userObj: User = await this.channelService.getUserById(user.uid);
    if (!userObj) {
      const response: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('PublicMsg', response);
      return;
    }

    const channelName = await this.channelService.getChannelNameById(
      payload.id,
    );
    if (!channelName) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'Channel not found',
      };
      client.emit('PublicMsg', res);
      return;
    }

    const isUserFlagged = await this.channelService.isUserFlagged(
      payload.id,
      user.uid,
    );
    if (isUserFlagged) {
      const res: SocketResDto = {
        status: HttpStatus.FORBIDDEN,
        message: 'Not Authorized to send a message here',
      };
      client.emit('PublicMsg', res);
      return;
    }

    const isInChannel = client.rooms.has(channelName);
    if (!isInChannel) client.join(channelName);

    const setPayload: SetChannelMsgDto = {
      text: payload.text,
      fromId: userObj.id,
      channelId: payload.id,
      fromAvatar: userObj.avatar,
    };

    await this.channelService.setPrivateMsg(setPayload);

    const res: AnyMsgDto = {
      text: payload.text,
      avatar: userObj.avatar,
      fromUsername: userObj.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      channelName: channelName,
      channelId: payload.id,
      fromId: user.uid,
      toId: null,
      toUsername: null,
      privateChannelId: null,
    };
    client.to(channelName).emit('PublicMsg', res);
  }

  @SubscribeMessage('searchAllChannels')
  async searchAllChannels(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChannelSearchDto,
  ) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('search', res);
      client.disconnect();
      return;
    }

    if (!payload || !payload.channelQuery) {
      const res: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'No payload provided',
      };
      client.emit('search', res);
      return;
    }

    const res = await this.chatService.searchAllChannels(
      user.uid,
      payload.channelQuery,
    );
    if (!res) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'No results',
      };
      client.emit('search', res);
      return;
    }
    client.emit('search', res);
  }

  @SubscribeMessage('reconnect')
  async reconnect(@ConnectedSocket() client: Socket) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('reconnect', res);
      client.disconnect();
      return;
    }
    await this.chatService.setUserOnline(user.uid);
    await this.chatService.joinChannelsBack(user.uid, client);
    this.chatService.setUserSocketId(client.id, user.uid);

    const publicChat = await this.chatHistory.getUserPublicChatHistory(
      user.uid,
    );
    const privateChat = await this.chatHistory.getUserPrivateChatHistory(
      user.uid,
      0,
    );
    const userNotif = await this.chatService.loadUserNotif(user.uid);

    client.emit('publicChat', publicChat);
    client.emit('privateChat', privateChat);
    client.emit('notifs', userNotif);
  }

  @SubscribeMessage('getRecentChannels')
  async getRecentChannels(@ConnectedSocket() client: Socket) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('getRecentChannels', res);
      client.disconnect();
      return;
    }

    const res = await this.channelService.recentChannels(user.uid);
    client.emit('recentChannels', res);
  }

  @SubscribeMessage('addFriend')
  async addFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AddFriendDto,
  ) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not Authorized',
      };
      client.emit('addFriend', res);
      client.disconnect();
      return;
    }

    if (!payload || !payload.id) {
      const res: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'No payload provided',
      };
      client.emit('addFriend', res);
      return;
    }

    const friendObj: User = await this.channelService.getUserById(payload.id);
    if (!friendObj) {
      const response: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('addFriend', response);
      return;
    }
    await this.chatService.addFriend(user.uid, friendObj.username, this.server);
  }

  @SubscribeMessage('acceptFriend')
  async acceptFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: AcceptFriendDto,
  ) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not Authorized',
      };
      client.emit('acceptFriend', res);
      client.disconnect();
      return;
    }

    if (!payload || !payload.id) {
      const res: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'No payload provided',
      };
      client.emit('acceptFriend', res);
      return;
    }

    const friendObj: User = await this.channelService.getUserById(payload.id);
    if (!friendObj) {
      const response: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };
      client.emit('acceptFriend', response);
      return;
    }

    const res = await this.chatService.acceptFriend(
      user.uid,
      friendObj.username,
      this.onlineClients,
    );
    if (res == false) {
      const res: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User/Friend not found',
      };
      client.emit('acceptFriend', res);
      return;
    }
    client.emit('acceptFriend', res);
  }

  ////////
  async handleConnection(@ConnectedSocket() client: Socket) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      client.emit('error', 'Unauthorized connection');
      client.disconnect();
      return;
    }
    this.onlineClients.set(user.username, client);

    await this.chatService.setUserOnline(user.uid);
    await this.chatService.setUserSocketId(client.id, user.uid);
    await this.chatService.joinChannelsBack(user.uid, client);

    const publicChat = await this.chatHistory.getUserPublicChatHistory(
      user.uid,
    );
    const privateChat = await this.chatHistory.getUserPrivateChatHistory(
      user.uid,
      0,
    );
    const userNotif = await this.chatService.loadUserNotif(user.uid);

    client.emit('publicChat', publicChat);
    client.emit('privateChat', privateChat);
    client.emit('notifs', userNotif);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = await this.chatService.jwtDecoe(client);
    if (!user) {
      client.emit('error', 'Unauthorized connection');
      client.disconnect();
      return;
    }
    this.chatService.setUserSocketId(null, user.uid);
    this.onlineClients.delete(user.username);
    await this.chatService.setUserOffline(user.uid);
  }

  emitToUser(socketID: string, event: string, payload: any) {
    if (socketID == null) return null;
    this.server.to(socketID).emit(event, payload);
  }
}
