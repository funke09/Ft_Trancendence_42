import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { User, Prisma } from '@prisma/client';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private JwtService: JwtService) {}

	async signUser(profile: any): Promise<any> {
		let user = await this.findUserByEmail(profile.emails[0].value);

		if (!user) {
			user = await this.createUser({
				email: profile.emails[0].value,
				username: profile.username,
				avatar: profile._json.image.link,
				password: 'tmpPass',
			});
		}
		return user;
	}

	async login(user: any, res: Response) {
		try {
			const payload = { username: user.username, uid: user.id };
			const token = this.JwtService.sign(payload);
			res.cookie('jwt', token, { httpOnly: false, path: '/'});
			res.redirect("http://localhost:3000");
		} catch (error) {
			throw new BadRequestException('ERROR:', error.message);
		}
	}

	async logout(res: Response) {
		res.clearCookie('jwt');
		res.redirect('http://localhost:3000/login')
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		const hash = await argon.hash(data.password);
		return this.prisma.user.create({
			data: {
				email: data.email,
				username: data.username,
				avatar: data.avatar,
				password: hash,	
			},
		});
	}

	async findUserByEmail(email: string): Promise<any> {
		return this.prisma.user.findUnique({
			where: {email: email},
			select: {
				email: true,
				username: true,
				avatar: true,
				userStatus: true,
				id: true,
			}
		})
	}

	async getUserById(id: number) {
        return await this.prisma.user.findUnique({
            where: { id: id },
            select: {
                email: true,
                username: true,
                avatar: true,
                userStatus: true,
                id: true,
            },
        });
    }
}
