import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
				userStatus: 'Offline',
				password: 'tmpPass',
			});
		}
		return user;
	}

	async login(user: any, res: Response) {
		try {
			const payload = { username: user.username, uid: user.id };
			const token = this.JwtService.sign(payload);
			await this.prisma.user.update({
				where: {id: user.id},
				data: {userStatus: 'Online'},
			});
			res.cookie('jwt', token, { httpOnly: false, path: '/'});
			res.redirect("http://localhost:3000");
		} catch (error) {
			throw new BadRequestException('ERROR:', error.message);
		}
	}

	async signup(username: string, email: string, password: string) {
		  const existingUser = await this.prisma.user.findFirst({
			where: {
			  OR: [
				{ username: username },
				{ email: email },
			  ],
			},
		  });
	
		  if (existingUser) {
			throw new BadRequestException('Username or email is already taken.');
		  }
	
		  const hashedPassword = await argon.hash(password);
	
		  const user = await this.prisma.user.create({
			data: {
			  username: username,
			  email: email,
			  password: hashedPassword,
			  userStatus: 'Online',
			  avatar: "http://localhost:3000/images/defaultAvatar.png"
			},
		});
	
		  const token = this.JwtService.sign({
			username: user.username,
			uid: user.id,
		  });

		  return token;
	  }

	async signin(username: string, password: string): Promise<string> {
		const user = await this.prisma.user.findUnique({
		  where: { username: username },
		});
	  
		if (!user) {
		  throw new ForbiddenException('Credentials incorrect');
		}
	  
		const pwMatches = await argon.verify(user.password, password);
	  
		if (!pwMatches) {
		  throw new ForbiddenException('Credentials incorrect');
		}
	  
		const token = this.JwtService.sign({
		  username: user.username,
		  uid: user.id,
		});

		await this.prisma.user.update({
			where: {id: user.id},
			data: {userStatus: 'Online'},
		});
	  
		return token;
	  }

	async logout(id: number) {
		await this.prisma.user.update({
		  where: { id: id },
		  data: { userStatus: "Offline" },
		});
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		const hash = await argon.hash(data.password);
		return this.prisma.user.create({
			data: {
				email: data.email,
				username: data.username,
				userStatus: data.userStatus,
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
