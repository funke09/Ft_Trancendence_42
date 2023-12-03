// TODO: On build phase remember to activate password hashing back (argon2)

import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
  } from '@nestjs/common';
  import { authDTO, signinDTO, signupDTO } from './dto';
  import * as argon from 'argon2';
  import { PrismaService } from '../prisma/prisma.service';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthService {
	constructor(
	  private prisma: PrismaService,
	  private jwtService: JwtService,
	  private config: ConfigService,
	) {}
  
	async signup(dto: authDTO) {
	//   const hash = await argon.hash(dto.password);
	  try {
		await this.prisma.user.create({
		  data: {
			id: dto.id,
			email: dto.email,
			login: dto.login,
			name: dto.name,
			avatar: dto.avatar,
			hash: dto.password, // hash: hash;
			isAuthenticated: false,
		  },
		});
	  } catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
		  if (error.code === 'P2002') {
			throw new ForbiddenException(
			  'An account with email or login already exists',
			);
		  }
		}
	  }
	}
  
	async signin(dto: signinDTO): Promise<{ accessToken: string }> {
	  const user = await await this.prisma.user.findFirst({
		where: {
		  login: dto.login,
		},
	  });
	  if (!user) throw new ForbiddenException('login or password incorrect');
	  if (!user.isAuthenticated)
		throw new ForbiddenException('Unauthenticated User');
	//   const pwMatch = await argon.verify(user.hash, dto.password);
	//   if (!pwMatch)
	// 	throw new ForbiddenException('login or password incorrect');
	  return this.signToken(user.id, user.login);
	}
  
	async finish_signup(dto: signupDTO, UserToken: string) {
	  if (!UserToken) throw new UnauthorizedException('Invalid Request');
	  try {
		await this.jwtService.verifyAsync(UserToken, {
		  secret: this.config.get('JWT_SECRET'),
		});
	  } catch {
		throw new UnauthorizedException();
	  }
	  let user = await this.findUser(dto.email);
	  if (!user)
		throw new ForbiddenException('you need to signup with intra first');
	  if (user.isAuthenticated)
		throw new ForbiddenException('User Already Authenticated ');
	//   const hash = await argon.hash(dto.password);
	  await this.prisma.user.updateMany({
		where: {
		  email: dto.email,
		},
		data: {
		  login: dto.login,
		  hash: dto.password, // hash: hash;
		  isAuthenticated: true,
		},
	  });
	  return this.signToken(user.id, user.login);
	}
  
	async saveAvatar(userToken: string, file: Express.Multer.File) {
	  try {
		const payload = await this.jwtService.verifyAsync(userToken, {
		  secret: this.config.get('JWT_SECRET'),
		});
		await this.prisma.user.updateMany({
		  where: {
			email: payload.email,
		  },
		  data: {
			avatar: file.path,
		  },
		});
	  } catch {
		throw new UnauthorizedException();
	  }
	}
  
	async signToken(
	  userID: number,
	  login: string,
	): Promise<{ accessToken: string }> {
	  const payload = { sub: userID, login };
	  return {
		accessToken: await this.jwtService.signAsync(payload),
	  };
	}
  
	async findUser(email: string) {
	  const user = await this.prisma.user.findFirst({
		where: {
		  email: email,
		},
	  });
	  return user;
	}
  }
  