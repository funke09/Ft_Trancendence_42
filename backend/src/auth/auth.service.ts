import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { User, Prisma } from '@prisma/client';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt'
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private JwtService: JwtService) {}

	async signUser(profile: any): Promise<any> {
		let user = await this.findUserByEmail(profile.emails[0].value);

		if (!user) {
			let username = profile.username;
			let existingUser = await this.prisma.user.findFirst({ where: { username: username } });
	 
			while (existingUser) {
				username += "_";
				existingUser = await this.prisma.user.findFirst({ where: { username: username } });
			}

			user = await this.createUser({
				email: profile.emails[0].value,
				username: username,
				avatar: profile._json.image.link,
				userStatus: 'Offline',
				password: 'tmpPass',
			});
		}
		return user;
	}

	async login(user: any, res: Response, flag: boolean = false) {
		try {
			const payload = { username: user.username, uid: user.id };
			const token = this.JwtService.sign(payload);
			res.cookie('jwt', token, { httpOnly: false, path: '/'});
			if (!flag) res.redirect("http://localhost:3000/profile");
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

	async signin(username: string, password: string): Promise<any> {
		const user = await this.prisma.user.findUnique({
		  where: { username: username },
		});
	  
		if (!user) {
		  throw new ForbiddenException('Username incorrect');
		}
	  
		const pwMatches = await argon.verify(user.password, password);
	  
		if (!pwMatches) {
		  throw new ForbiddenException('Password incorrect');
		}

		let twoFA: boolean = false;
		if (user.isTwoFA) twoFA = true;
	  
		const token = this.JwtService.sign({
		  username: user.username,
		  uid: user.id,
		});

		await this.prisma.user.update({
			where: {id: user.id},
			data: {userStatus: 'Online'},
		});
	  
		return {token, twoFA};
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

	async enableTwoFA(id: number) {
		try {
		  const user = await this.prisma.user.findUnique({ where: { id: id } });
		  if (!user) {
			throw new NotFoundException("User not found");
		  }
	  
		  const otpTwoFA = speakeasy.generateSecret({
			name: 'ft_transcendence',
		  });
	  
		  if (otpTwoFA.base32) {
			await this.prisma.user.update({
			  where: { id: id },
			  data: { otpTwoFA: otpTwoFA.ascii },
			});
		  } else {
			throw new Error("Failed to generate OTP secret");
		  }
	  
		  const qrCode = qrcode.toDataURL(otpTwoFA.otpauth_url);
		  return qrCode;
		} catch (error) {
		  console.error(error);
		  throw new InternalServerErrorException("Failed to enable Two-Factor Authentication");
		}
	  }
	  
	 
	async verifyTwoFA(pin: number, id: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: id },
				select: { otpTwoFA: true },
			});
	
			if (!user) throw new NotFoundException("User not found");
	
			const verified = speakeasy.totp.verify({
				secret: user.otpTwoFA,
				encoding: 'ascii',
				token: pin.toString(),
			});
	
			if (!verified) throw new BadRequestException("Invalid PIN");
	
			await this.prisma.user.update({ where: { id: id }, data: { isTwoFA: true } });
		} catch (error) {
			throw error;
		}
	}

	async disableTwoFA(id: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: id},
				select: {
					otpTwoFA: true,
					isTwoFA: true,
				},
			});
			if (!user) throw new NotFoundException("Two-Factor Auth is not enabled");

			await this.prisma.user.update({
				where: {id:id},
				data: {
					otpTwoFA: null,
					isTwoFA: false,
				},
			});
		} catch (error) {
			console.error(error);
		}
	}

	async login2FA(pin: number, username: string, token: string, res:any) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { username: username },
				select: { otpTwoFA: true },
			});
			if (!user) throw new NotFoundException("User not found");
	
			const verified = speakeasy.totp.verify({
				secret: user.otpTwoFA,
				encoding: 'ascii',
				token: pin.toString(),
			});
			if (!verified) throw new BadRequestException("Invalid PIN");

			res.cookie('jwt', token, { httpOnly: false, path: '/'});
		} catch (error) {
			throw error;
		}
	}
}
