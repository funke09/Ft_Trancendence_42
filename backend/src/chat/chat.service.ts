import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { DmDto, NotifsDto, SocketResDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async jwtDecoe(client: Socket, context?: ExecutionContext): Promise<any> {
    let token = null;
    try {
      token = client.handshake.headers.cookie.split('=')[1];
      const decoded = jwt.verify(token, this.config.get('JWT_SECRET')) as {
        uid: number;
        username: string;
        iat: number;
        exp: number;
      };
      if (context) context.switchToWs().getData().userId = decoded.uid;

      const checkUser = await this.findUserByUsername(decoded.username);
      if (!checkUser) return null;
      return decoded;
    } catch {}

    try {
      const token = client.handshake.headers.jwt as string;
      if (!token) return null;

      const decoded = jwt.verify(token, this.config.get('JWT_SECRET')) as {
        uid: number;
        username: string;
        iat: number;
        exp: number;
      };
      if (context) context.switchToWs().getData().userId = decoded.uid;
      const checkUser = await this.findUserByUsername(decoded.username);
      if (!checkUser) return null;
      return decoded;
    } catch {
      return null;
    }
  }

  async setChannelId(from: string, to: number): Promise<string> {
    const fromID = await this.prisma.user.findUnique({
      where: { username: from },
      select: { id: true },
    });
    const toID = await this.prisma.user.findUnique({
      where: { id: to },
      select: { id: true },
    });

    if (!fromID || !toID) return null;

    let genID = null;
    if (fromID.id < toID.id) genID = fromID.id + '+' + toID.id;
    else genID = toID.id + '+' + fromID.id;

    const id = `__private__@${genID}`;
    return id;
  }

  async isChannelExist(username: string, channelID: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) return false;

    let flag: boolean = false;

    user.privateChannels.forEach((channel) => {
      if (channel === channelID) flag = true;
    });

    return flag;
  }

  async createChannel(
    username: string,
    to: number,
    channelId: string,
  ): Promise<string> {
    await this.prisma.user.update({
      where: { username: username },
      data: {
        privateChannels: {
          push: channelId,
        },
      },
    });

    await this.prisma.user.update({
      where: { id: to },
      data: {
        privateChannels: {
          push: channelId,
        },
      },
    });

    return channelId;
  }

  async isUserBlocked(from: string, toId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: from },
      include: { Friends: true },
    });

    let flag: boolean = false;

    user.Friends.forEach((friend) => {
      if (friend.friendID === toId) {
        if (friend.status === 'Blocked') flag = true;
      }
    });
    return flag;
  }

  async savePrivateMsg(payload: DmDto): Promise<any> {
    const msg = await this.prisma.dM.create({
      data: {
        text: payload.msg,
        channelId: payload.channelId,
        from: {
          connect: {
            username: payload.from,
          },
        },
        to: {
          connect: {
            id: payload.toID,
          },
        },
      },
    });
    return msg;
  }

  async userSearchQuery(userId: number, query: string): Promise<any[]> {
    const User = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { Friends: true },
    });

    let users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        username: true,
        userStatus: true,
        id: true,
        avatar: true,
        Friends: true,
      },
    });

    users = users.filter((user) => {
      if (
        User.Friends.some(
          (friend) =>
            friend.friendID === user.id && friend.status === 'Accepted',
        )
      ) {
        return true;
      }
      return false;
    });

    if (users.length === 0) return [];

    return [...users];
  }

  async channelSearchQuery(userId: number, query: string): Promise<any[]> {
    const User = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { channels: true },
    });

    let channels = await this.prisma.channel.findMany({
      where: {
        AND: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        name: true,
        id: true,
        type: true,
        ownerId: true,
      },
    });

    channels = channels.filter((channel) => {
      if (User.channels.some((chan) => chan.id === channel.id)) {
        return true;
      }
      return false;
    });

    if (channels.length === 0) return [];

    return [...channels];
  }

  async searchAllChannels(userId: number, query: string): Promise<any[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { channels: true },
    });

    const userChannelIds = user.channels.map((channel) => channel.id);

    const channels = await this.prisma.channel.findMany({
      where: {
        AND: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            type: {
              not: 'private',
            },
          },
          {
            id: {
              notIn: userChannelIds,
            },
          },
        ],
      },
      select: {
        name: true,
        id: true,
        type: true,
        ownerId: true,
      },
    });

    if (channels.length === 0) return [];

    return [...channels];
  }

  async setUserOnline(id: number): Promise<any> {
    const checkUser = await this.prisma.user.findUnique({
      where: { id: id },
      select: { userStatus: true },
    });
    if (checkUser && checkUser.userStatus === 'Online') return;
    try {
      await this.prisma.user.update({
        where: { id: id },
        data: { userStatus: 'Online' },
      });
    } catch (error) {}
  }

  async setUserOffline(id: number): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: id },
        data: { userStatus: 'Offline' },
      });
    } catch (error) {}
  }

  async joinChannelsBack(id: number, client: Socket) {
    const privChannels = await this.prisma.user.findUnique({
      where: { id: id },
      select: { privateChannels: true },
    });

    const pubChannels = await this.prisma.user.findUnique({
      where: { id: id },
      select: { channels: true },
    });

    if (privChannels) {
      for (const name of privChannels.privateChannels) {
        const isInChannel = client.rooms.has(name);
        if (!isInChannel) client.join(name);
      }
    }

    if (pubChannels) {
      for (const name of pubChannels.channels) {
        const isInChannel = client.rooms.has(name.name);
        if (!isInChannel) client.join(name.name);
      }
    }
  }

  async setUserSocketId(socketId: string, id: number) {
    await this.prisma.user.update({
      where: { id: id },
      data: { socketId: socketId },
    });
  }

  async loadUserNotif(id: number): Promise<NotifsDto[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        notifs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) return null;

    const notifs: NotifsDto[] = user.notifs;
    return notifs;
  }

  async addFriend(id: number, friendRequest: string, server: Server) {
    const userObj = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (userObj.username === friendRequest) {
      const response: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: "You can't send a friend request to yourself",
      };
      this.emitToUser(server, userObj.username, 'addFriend', response);
      return null;
    }

    const friend = await this.prisma.user.findUnique({
      where: { username: friendRequest },
    });

    if (!userObj || !friend) {
      const response: SocketResDto = {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      };

      this.emitToUser(server, userObj.username, 'addFriend', response);
      return null;
    }

    const existingFriendship = await this.prisma.friends.findFirst({
      where: { friendID: friend.id, fromId: userObj.id },
    });
    if (existingFriendship) {
      const response: SocketResDto = {
        status: HttpStatus.BAD_REQUEST,
        message: 'You already sent a friend request to this user',
      };
      this.emitToUser(server, userObj.username, 'addFriend', response);
      return null;
    }

    await this.prisma.friends.create({
      data: {
        user: { connect: { id: userObj.id } },
        friendID: friend.id,
        fromId: userObj.id,
        toId: friend.id,
        friend: { connect: { id: friend.id } },
      },
    });

    await this.prisma.friends.create({
      data: {
        user: { connect: { id: friend.id } },
        friendID: userObj.id,
        fromId: userObj.id,
        toId: friend.id,
        friend: { connect: { id: userObj.id } },
      },
    });

    const notification_SIDE = await this.prisma.notifs.create({
      data: {
        type: 'friendRequest',
        from: userObj.username,
        to: friend.username,
        status: 'Pending',
        msg: userObj.username + ' sent you a friend request',
        user: { connect: { id: friend.id } },
        avatar: userObj.avatar,
        friendId: userObj.id,
      },
    });
    this.emitToUser(server, friendRequest, 'notification', notification_SIDE);
    const response: SocketResDto = {
      status: HttpStatus.CREATED,
      message: 'Friend request sent',
    };
    this.emitToUser(server, userObj.username, 'addFriend', response);
  }

  async acceptFriend(
    id: number,
    friendRequest: string,
    onlineClients: Map<string, Socket>,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: { Friends: true },
    });

    const userClient = onlineClients.get(user.username);
    const friendClient = onlineClients.get(friendRequest);

    const friendUser = await this.prisma.user.findUnique({
      where: {
        username: friendRequest,
      },
      include: {
        Friends: true,
      },
    });

    if (!user || !friendUser) return false;

    const userFriend = await this.prisma.friends.updateMany({
      where: {
        toId: user.id,
        fromId: friendUser.id,
        status: 'Pending',
      },
      data: {
        status: 'Accepted',
      },
    });

    if (userFriend.count === 0) {
      if (userClient) {
        const response: SocketResDto = {
          status: HttpStatus.NOT_FOUND,
          message: 'No friend request found',
        };
        userClient.emit('acceptFriend', response);
      }
      return undefined;
    }

    const channel = await this.setChannelId(user.username, friendUser.id);
    const check_channel = await this.isChannelExist(user.username, channel);
    if (!check_channel) {
      await this.createChannel(user.username, friendUser.id, channel);
    }

    if (userClient) {
      if (!userClient.rooms.has(channel)) {
        userClient.join(channel);
      }
    }

    if (friendClient) {
      if (!friendClient.rooms.has(channel)) {
        friendClient.join(channel);
      }
      const notification = await this.prisma.notifs.create({
        data: {
          type: 'AcceptRequest',
          from: user.username,
          to: friendUser.username,
          status: 'Accepted',
          msg: user.username + ' accepted your friend request',
          user: { connect: { id: friendUser.id } },
          avatar: user.avatar,
          friendId: user.id,
        },
      });
      friendClient.emit('notification', notification);
    }

    await this.prisma.notifs.deleteMany({
      where: {
        type: 'friendRequest',
        from: friendRequest,
        to: user.username,
        status: 'Pending',
      },
    });

    const response: SocketResDto = {
      status: HttpStatus.OK,
      message: 'Friend request accepted',
    };
    return response;
  }

  ///////////// UTILS ///////////

  async findUserByUsername(username: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async emitToUser(
    server: Server,
    username: string,
    event: string,
    data: SocketResDto | NotifsDto,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) [];
    if (user.socketId) server.to(user.socketId).emit(event, data);
  }
}
