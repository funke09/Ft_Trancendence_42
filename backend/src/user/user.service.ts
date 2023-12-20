import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
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

	async getUserById(userId: number, findId: number): Promise<any> {
		const currUser = await this.prisma.user.findUnique({ where: {id: userId} });
		if (!currUser) throw new HttpException('User not Found', 404);

		const findUser = await this.prisma.user.findUnique({ where: {id: findId} });
		if (!findUser) throw new HttpException('User not Found', 404);

		if (currUser.id === findUser.id)
			return this.getUserDataById(userId);

		return this.getUserDataById(findId);
	}

	async getStatsById(id: number) {
		const validUser = await this.prisma.user.findUnique({ where: {id: id} });
		if (!validUser)	throw new HttpException('User not Found', 404);

		let user = await this.prisma.user.findUnique({
			where: { id: id },
			select: {
				userStats: {
					select: {
						achievements: true,
						wins: true,
						losses: true,
						rank: true,
                        createdAt: true,
                        updatedAt: true,
					},
				},
				Games: {
					where: {
						p2Id: { not: id },
					},
					orderBy: {
						createdAt: 'desc'
					},
				},
			},
		});

		let games = user.Games.map(async (game) => {
			game['p2Username'] = await this.getUsernameById(game.p2Id);
			game['p1Username'] = await this.getUsernameById(game.userId);
			return game;
		});
		user.Games = await Promise.all(games);

		if (!user) throw new NotFoundException(`ID: ${id} not found`);

		return {stats: user.userStats, games: user.Games};
	}

	async getUsernameById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id : id },
			select: { username: true },
		});
		return user.username;
	}

	async setUsername(id: number, username: string) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		if (!user) throw new NotFoundException(`${id} not found`);

		const checkUser = await this.prisma.user.findFirst({where: {username: username}});
		if (checkUser) throw new BadRequestException("Username already taken")
		
		await this.prisma.user.update({
			where: {id: id},
			data: {username: username},
		});
	}

	async setEmail(id: number, email: string) {
		const user = await this.prisma.user.findUnique({where: {id: id},});
		if (!user) throw new NotFoundException(`${id} not found`);

		const checkEmail = await this.prisma.user.findFirst({where: {email: email}});
		if (checkEmail) throw new BadRequestException("Email already used");

		await this.prisma.user.update({
			where: {id: id},
			data: {email: email},
		});
	}

	async setPassword(id: number, password: string) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		if (!user) throw new NotFoundException(`${id} not found`);

		const pwMatches = await argon.verify(user.password, password);
		if (pwMatches) throw new BadRequestException("This Password is already in use");

		const hash = await argon.hash(password);
		await this.prisma.user.update({
			where: {id: id},
			data: {password: hash},
		});
	}
}
