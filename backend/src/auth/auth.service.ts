import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { authDTO, signinDTO, signupDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: authDTO) {
    const hash = await argon.hash(dto.password);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash: hash,
          isAuth: false,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'An Account with the same credentials already exist',
          );
        }
      }
    }
  }

  async signin(dto: signinDTO): Promise<{ accessToken: string }> {
    const user = await await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    });
    if (!user) throw new ForbiddenException('Username or Password incorrect');
    if (!user.isAuth)
      throw new ForbiddenException('Unauthenticated User');
    const pwMatch = await argon.verify(user.hash, dto.password);
    if (!pwMatch)
      throw new ForbiddenException('Username or Password incorrect');
    return this.signToken(user.id, user.username);
  }

  async finish_signup(dto: signupDTO): Promise<{ accessToken: string }> {
	console.log('Received signup DTO:', dto);

	let user = await this.findUser(dto.email);
	console.log('User before update:', user);

  
	if (!user) {
	  throw new ForbiddenException('You need to sign up with intra first');
	}
  
	if (user.isAuth) {
	  throw new ForbiddenException('User already authenticated');
	}
  
	const hash = await argon.hash(dto.password);
  
	await this.prisma.user.updateMany({
	  where: {
		email: dto.email,
	  },
	  data: {
		username: dto.username,
		hash: hash,
		isAuth: true,
	  },
	});
  
	user = await this.findUser(dto.email);
	console.log('User after update:', user);
	
	return this.signToken(user.id, user.username);
  }

  async signToken(
    userID: number,
    username: string,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userID, username };
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