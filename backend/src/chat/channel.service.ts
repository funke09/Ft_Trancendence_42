import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { setPrivateMsgDto } from "./dto/chat.dto";

@Injectable()
export class ChannelService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserById(id: number) : Promise<any> {
		const user = await this.prisma.user.findUnique({ where: {id: id}});
		return user;
	}

	async getChannelNameById(id: number) : Promise<string> {
		const channel = await this.prisma.channel.findUnique({where: {id: id}});
		return channel.name;
	}

	async isUserFlagged(channelId: number, userId: number) : Promise<boolean> {
		const channel = await this.prisma.channel.findUnique({
			where: {id: channelId},
			include: {
				banned: true,
				kicked: true,
			},
		});

		if (!channel) return true;

		if (channel.banned.some((user) => user.id === userId))
			return true;
		if (channel.kicked.some((user) => user.id === userId))
			return true;

		return false;
	}

	async setPrivateMsg(payload: setPrivateMsgDto) : Promise<void> {
		const newMsg = await this.prisma.msg.create({
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

	async recentChannels(id: number) : Promise<any> {
		const user = await this.prisma.user.findUnique({
			where: { id : id},
		});
		const recentChannels = await this.prisma.channel.findMany({
			where: {ownerId: {not: user.id}},
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