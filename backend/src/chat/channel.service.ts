import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { setPrivateMsgDto } from './dto/chat.dto';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user;
  }

  async getChannelNameById(id: number): Promise<string> {
    const channel = await this.prisma.channel.findUnique({ where: { id: id } });
    return channel.name;
  }

  async isUserFlagged(channelId: number, userId: number): Promise<boolean> {
	const channel = await this.prisma.channel.findUnique({
	  where: { id: channelId },
	  include: {
		banned: true,
		kicked: true,
		// Include muted relation is not enough to get mute expiry, but needed to check if user is muted
		muted: true,
	  },
	});
  
	if (!channel) return true;
  
	// Check if user is banned
	if (channel.banned.some((user) => user.id === userId)) return true;
  
	// Check if user is kicked
	if (channel.kicked.some((user) => user.id === userId)) return true;
  
	// Check if user is muted. If so, check the mute expiry
	if (channel.muted.some((user) => user.id === userId)) {
	  const muteRecord = await this.prisma.channelUserMute.findFirst({
		where: {
		  channelId: channelId,
		  userId: userId
		}
	  });
  
	  if (muteRecord && new Date() < new Date(muteRecord.muteExpiry)) {
		return true;
	  }
	  else {
		await this.prisma.channelUserMute.delete({
		  where: {
			channelId_userId: {
			  channelId: channelId,
			  userId: userId
			}
		  }
		});

		await this.prisma.channel.update({
		  where: { id: channelId },
		  data: {
			muted: {
			  disconnect: {
				id: userId
			  }
			}
		  }
		});
		return false;
	  }
	}
  
	return false;
  }
  

  async setPrivateMsg(payload: setPrivateMsgDto): Promise<void> {
    await this.prisma.msg.create({
      data: {
        text: payload.text,
        user: {
          connect: {
            id: payload.fromId,
          },
        },
        channel: {
          connect: {
            id: payload.channelId,
          },
        },
      },
    });
  }

  async recentChannels(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    const recentChannels = await this.prisma.channel.findMany({
      where: { ownerId: { not: user.id } },
      select: {
        name: true,
        createdAt: true,
        ownerId: true,
        type: true,
      },
    });
    return recentChannels;
  }
}
