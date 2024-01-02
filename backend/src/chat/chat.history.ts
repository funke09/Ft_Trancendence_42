import { Injectable } from "@nestjs/common";
import { channel } from "diagnostics_channel";
import { PrismaService } from "src/prisma/prisma.service";
import { AnyMsgDto } from "./dto/chat.dto";

@Injectable()
export class ChatHistory {
	constructor(private readonly prisma: PrismaService) {}

	async getUserPublicChatHistory(id: number) : Promise<any>{
		const channels = await this.prisma.channel.findMany({
			where: {
				member: {
					some: {
						id: id,
					},
				},
			},
			select: {
				id: true,
				name: true,
				type: true,
				ownerId: true,
				createdAt: true,
				adminsIds: true,
				msgs: {
					select: {
						text: true,
						createdAt: true,
						fromId: true,
						channelId: true,
						user: {
							select: {
								username: true,
								avatar: true,
							},
						},
					},
					orderBy: { createdAt: 'asc'}
				},
			},
		});
		return channels;		
	}

	async getUserPrivateChatHistory(userId: number, page: number) : Promise<any> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
			  privateChannels: true,
			  username: true,
			  id: true,
			  avatar: true,
			  userStatus: true,
			  Blocked: true,
			},
		  });
	  
		  let userConvo = [];
		  if (!user) return userConvo;
	  
		  const isBlocked = (otherUserId: number) => {
			return user.Blocked.includes(otherUserId);
		  };
		
		  await Promise.all(
			user.privateChannels.map(async (id) => {
			  let chat = await this.prisma.dM.findMany({
				where: { channelId: id },
				orderBy: { createdAt: 'asc' },
				skip: page * 50,
				select: {
				  text: true,
				  createdAt: true,
				  fromId: true,
				  toId: true,
				},
			  });
			  let ids = null;
			  try {
				ids = id.split('@')[1].split('+');
			  } catch {
				return;
			  }
	  
			  if (ids.length != 2) {
				return;
			  }

			  
			  const otherUserId: number = parseInt(ids[0]) == user.id ? parseInt(ids[1]) : parseInt(ids[0]);
			  
			  const otherUser = await this.prisma.user.findUnique({
				where: { id: otherUserId },
				select: {
				  username: true,
				  id: true,
				  avatar: true,
				  userStatus: true,
				  privateChannels: true,
				},
			  });
			  otherUser['isBlocked'] = isBlocked(otherUserId);
			  const conv = { chat, otherUser, privateChannelId: id };
			  userConvo.push(conv);
			}),
		  );
	  
		  return userConvo.map((conv) => {
			return {
			  chat: conv.chat.map((message) => {
				return {
				  text: message.text,
				  createdAt: message.createdAt,
				  fromId: message.fromId,
				  toId: message.toId,
				};
			  }),
			  otherUser: {
				username: conv.otherUser.username,
				id: conv.otherUser.id,
				avatar: conv.otherUser.avatar,
				name: conv.otherUser.name,
				userStatus: conv.otherUser.userStatus,
				privateChannels: conv.otherUser.privateChannels,
				Blocked: conv.otherUser.Blocked,
			  },
			  privateChannelId: conv.privateChannelId,
			};
		  });
	}
}