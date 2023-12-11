import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetails } from 'src/utils/types';
import * as argon from 'argon2';
import { User, Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

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
				id: true,
			}
		})
	}

	async getUserDataById(id: number) {
		const user = await this.prisma.user.findUnique({ 
			where: { id: id },
		
		});
		if (user)
			return user;
		throw new NotFoundException(`User ${user.username} not found`)
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
