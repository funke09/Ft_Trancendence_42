import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUserDataById(id: number) {
		const user = await this.prisma.user.findUnique({ 
			where: { id: id },	
		});
		if (user)
			return user;
		throw new NotFoundException(`User ${user.username} not found`)
	}

	async findUserByUsername(username: string): Promise<any> {
		const user = await this.prisma.user.findUnique({
			where: { username: username },
		});
		return user;
	}

	async getAvataById(id: number) {
		const user = await this.prisma.user.findUnique({
			where : {id: id},
			select: {avatar: true, username: true},
		});
		if (!user) throw new NotFoundException(`User ${user.username} not found`);
		return user.avatar;
	}
}
