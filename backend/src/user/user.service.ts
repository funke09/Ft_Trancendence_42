import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUserDataById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				UserStats: true,
				Matches: true,
			},
		});
		if (user)
			return user
		else
			throw new NotFoundException(`User ${user.username} not found`);
	}
}
