import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChannelDto } from "./user.dto";
import * as argon from 'argon2';

@Injectable()
export class ChannelService {
	constructor(private prisma: PrismaService) {}

	async createChannel(id: number, channel: CreateChannelDto) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		if (!user) throw new NotFoundException("User not found");

		if (channel.password && channel.password.length < 8) {
			throw new BadRequestException('Channel Password must be at least 8 characters long');
		}
		const hash = channel.type === 'protected' ? await argon.hash(channel.password) : null;

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
				password: hash,
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
}