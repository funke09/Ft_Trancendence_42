import {
	Injectable,
	HttpException,
	BadRequestException
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { User, Prisma } from '@prisma/client';
  import { Response } from 'express';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class AuthService {
	constructor(
	  private prisma: PrismaService,
	  private jwtService: JwtService,
	) {}

	async createUser(data: Prisma.UserCreateInput): Promise<User>
	{
		return this.prisma.user.create({
			data: {
				email: data.email,
				name: data.name,
				username: data.username,
				UserStats: {
					create: {
						wins: 0,
						losses: 0,
						rank: 'Iron',
					},
				},
				avatar: data.avatar,
			},
		});
	}

	async searchByUsername(username: string): Promise<any>
	{
		return this.prisma.user.findUnique({
			where: { username: username },
			select: {
				email: true,
				name: true,
				username: true,
				avatar: true,
				userStatus: true,
				confirmed: true,
				is2FA : true,
				id: true,
			},
		});
	}

	async getUserById(id: number)
	{
		return await this.prisma.user.findUnique({
			where: { id:id },
			select: {
				email: true,
				name: true,
				username: true,
				avatar: true,
				userStatus: true,
				confirmed: true,
				is2FA : true,
				id: true,
			},
		});
	}

	async searchById(userId: number, lookId: number): Promise<any>
	{
		const currUser = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!currUser)
			throw new HttpException('User not found', 404);

		const lookUser = await this.prisma.user.findUnique({
			where: { id: lookId },
		});
		if (!lookUser)
			throw new HttpException('User not found', 404);

		if (currUser.id === lookUser.id)
		{
			return this.prisma.user.findUnique({
				where: { id: userId },
				select: {
					email: true,
					name: true,
					username: true,
					avatar: true,
					userStatus: true,
					confirmed: true,
					is2FA : true,
					id: true,
					friends: true,
				},
			});
		}
		return this.prisma.user.findUnique({
			where: { id: lookId },
			select: {
				email: true,
				name: true,
				username: true,
				avatar: true,
				userStatus: true,
				id: true,
				friends: {
					where: {
						friendId: userId,
						userId: lookId,
					},
					select: {
						friendId: true,
						friendshipStatus: true,
					},
				},
			},
		});
	}

	async searchByEmail(email: string): Promise<any>
	{
		return this.prisma.user.findUnique({
			where: { email: email },
			select: {
				email: true,
				name: true,
				username: true,
				avatar: true,
				userStatus: true,
				confirmed: true,
				is2FA : true,
				id: true,
			},
		});
	}

	async searchOrCreate(profile: any): Promise<any>
	{
		let user = await this.searchByEmail(profile.emails[0].value);

		if (!user)
		{
			user = await this.createUser({
				email: profile.emails[0].value,
				name: profile.displayName,
				username: profile.username,
				oAuthId: '',
				avatar: profile._jason.image.link,
			});
		}
		return user;
	}

	async login(user: any, res: Response)
	{
		try
		{
			const is2F = user.is2FA;
			const payload = { username: user.username, uid: user.id, is2F: is2F};
			const token = this.jwtService.sign(payload);
			res.cookie('jwt', token, { httpOnly: true, path: '/'});
			// res.redirect(!is2F ? "http://localhost:3000/auth/42" : "http://localhost:3000/auth/2fa-auth");
		} catch (error) {
			throw new BadRequestException('Error: ', error.message);
		}
	}

	async logout(res: Response)
	{
		res.clearCookie('jwt');
		res.redirect("http://localhost:3000/logout");
	}

	async updateProfile(user: any, res: Response): Promise<any>
	{
		const payload = { username: user.username, uid: user.id };
		const token = this.jwtService.sign(payload);
		res.cookie('jwt', token, { httpOnly: false, path: '/'});
		res.status(200).send({ message: 'Username Updated' });
	}
}
