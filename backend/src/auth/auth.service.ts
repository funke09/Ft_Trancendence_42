import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserGateway } from 'src/user/user.gateway';
import { Profile } from 'passport-42';
import * as generator from 'generate-password';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import axios from 'axios';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private userGateway: UserGateway
	) {}

	async oAuthLogin(profile: Profile) {
		let index = 0;
		let username = profile.username;

		const user = await this.prisma.user.findUnique({
			where: { id: parseInt(profile.id) },
		})
		const { password, expirationDate } = await this.generateOtpPass();
		if (!user)
		{
			let userCheck = await this.prisma.user.findUnique({
				where: { username: username },
			})
			while(userCheck)
			{
				index++;
				username = `${profile.username}${index}`;

				userCheck = await this.prisma.user.findUnique({
					where: { username: username },
				})
			}
			const hash = await this.generateHash();
			this.getIntraAvatar(profile._json.image.link, profile.id + '.png');
			try {
				const newUser = await this.prisma.user.create({
					data: {
						id: parseInt(profile.id),
						username: username,
						password: hash,
						oAuth_code: password,
						oAuth_exp: expirationDate ? new Date(expirationDate) : null,
						avatar: './uploads/' + profile.id + '.png',
						stats: {
							create: {}
						},
					},
				});
				return `http://localhost:5000/login?oauth_code=${newUser.oAuth_code}`;
			}
			catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === 'P2002')
						throw new ForbiddenException('Credentials Taken');
				}
				throw error;
			}
		}
	}

	async generateHash() {
		const password = generator.generate({
			length: 12,
			numbers: true,
			symbols: true,
			uppercase: true,
			excludeSimilarCharacters: true
		});
		const hash = await argon.hash(password)
		return hash;
	}

	async generateOtpPass() {
		const password = crypto.randomBytes(10).toString('hex');
		const expirationDate = Date.now() + 2 * 60 * 1000;
		return { password, expirationDate };
	}

	async oAuthTrade(oAuth_code: string, code?: string) {
		const user = await this.prisma.user.findUnique({
			where: { oAuth_code: oAuth_code },
		});
		if (!user)
			throw new ForbiddenException('Credentials Incorrect');
		const alreadyConnected = this.userGateway.getSocketId(user.id);
		if (alreadyConnected)
			throw new ForbiddenException('Already Connected');
		if (user.oAuth_exp && Date.now() > user.oAuth_exp.getTime())
			throw new ForbiddenException('Authentication code has expired');
		const updatedUser = await this.prisma.user.update({
			where: { id: user.id },
			data: {
				oAuth_code: null,
				oAuth_exp: null,
			},
		});
		if (!updatedUser)
			throw new InternalServerErrorException('Failed to Update user');
		return await this.signToken(user.id, user.username);
	}

	async signToken(userId: number, username: string): Promise<{access_token: string}> {
		const payload = {
			id: userId,
			username,
		}
		const secret = this.config.get('JWT_SECRET');
		const exp = this.config.get('EXP_IN');

		const token = await this.jwt.signAsync(
			payload,
			{
				expiresIn: exp,
				secret: secret,
			},
		);
		return {
			access_token: token,
		};
	}

	async getIntraAvatar(url: string, filename: string): Promise<void> {
		const response = await axios.get(url, { responseType: 'stream' });
		const path = join('./uploads', filename);
		const writer = createWriteStream(path);

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject)
		})
	}
}
