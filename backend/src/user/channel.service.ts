import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChannelDto } from "./user.dto";
import * as argon from 'argon2';

@Injectable()
export class ChannelService {
	constructor(private prisma: PrismaService) {}

	async createChannel(id: number, channel: CreateChannelDto) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		if (!user) throw new NotFoundException("User not found");

		if (channel.type === 'protected')
		{
			if (!channel.password) throw new BadRequestException("No Password provided");
			if (channel.password && channel.password.length < 8)
				throw new BadRequestException('Channel Password must be at least 8 characters long');
			channel.password = await argon.hash(channel.password);

		}

		if (['private', 'protected', 'public'].includes(channel.type) == false) {
			throw new BadRequestException("Invalid channel type");
		}

		const isExist = await this.prisma.channel.findFirst({
			where: {name: channel.name},
		});
		if (isExist) throw new BadRequestException("Channel name already exists");

		const newChannel = await this.prisma.channel.create({
			data: {
				member: {connect: {id:user.id}},
				admins: {connect: {id: user.id}},
				name: channel.name,
				type: channel.type,
				password: channel.password,
				ownerId: user.id,
				adminsIds: { set: [user.id] }
			},
			select:{
				id: true,
				member: true,
				admins: true,
				name: true,
				ownerId: true,
			},
		});

		return newChannel;
	}

	async checkIsBlocked(id: number, channelID: number) : Promise<boolean> {
		const checkBlock = await this.prisma.user.findFirst({
			where: {
				id: id,
				bannedFrom: {
					some: {
						id: channelID,
					},
				},
			},
		});

		if (checkBlock)
			return true;
		else
			return false;
	}

	async joinChannel(id: number, channelID: number, password: string | null): Promise<any> {
		const channel = await this.prisma.channel.findUnique({ where: {id: channelID} });
		if (!channel) throw new NotFoundException("Channel not found");

		if (channel.type === 'private') throw new BadRequestException("Channel is private");

		const user = await this.prisma.user.findUnique({where:{id:id}});
		if (!user) throw new NotFoundException("User not found");

		const isMemeber = await this.prisma.user.findFirst({
			where: {
				id: id,
				channels: {some: {id: channelID}},
			},
		});
		if (isMemeber) throw new BadRequestException("You already a member in channel");
	
		const isBlocked = await this.checkIsBlocked(user.id, channelID);
		if (isBlocked) throw new BadRequestException("You are blocked from Channel");

		if (channel.type === 'protected' && password) {
			const passCheck = await argon.verify(channel.password, password);
			if (!passCheck) throw new BadRequestException("Channel password is Wrong");
		} else if (channel.type === 'protected' && !password)
			throw new BadRequestException("Channel has a Password");

		if (user.id === channel.ownerId) {
			await this.prisma.channel.update({
				where: {id: channelID},
				data: {
					member: {
						connect: {id: id},
					},
					admins: {
						connect: {id: id},
					},
					adminsIds: {
						set: channel.adminsIds.concat(user.id),
					},
				},
			});
			return HttpStatus.ACCEPTED;
		}

		await this.prisma.channel.update({
			where: {id: channelID},
			data: {
				member: {
					connect: {id: id},
				},
				kicked: {
					disconnect: {id: id},
				},
			},
		});
		return HttpStatus.ACCEPTED;
	}
}