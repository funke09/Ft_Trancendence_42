import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from 'src/utils/types';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async signUser(details: UserDetails) {
		console.log('AuthService');
		console.log(details);
		const user = await this.prisma.user.findUnique({
			where: {
				email: details.email,
			},
		})
		console.log(user);
		if (user) return user;

		console.log('User not found, Creating...');

		const hash = await argon.hash(details.password);
		return await this.prisma.user.create({
			data: {
				email: details.email,
				username: details.username,
				password: hash,
				avatar: details.avatar,
			},
		});
	}

	async findUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email: email } })
		return user;
	}

	async findUser(id: number) {
		const user = await this.prisma.user.findUnique({ where: { id: id }});
		return user;
	}
}
