import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import * as fs from 'fs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GameStatus } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	create(createUserDto: CreateUserDto) {
		return this.prisma.user.create({ data: createUserDto });
	}

	async findAll() {
		return await this.prisma.user.findMany();
	}

	async findOne(id: number) {
		return await this.prisma.user.findUnique({ where: { id } });
	}

	async findByUsername(username: string) {
		return await this.prisma.user.findUnique({ where: {username} });
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		if (updateUserDto.password)
			updateUserDto.password = await argon.hash(updateUserDto.password);
		try {
			const updatedUser = await this.prisma.user.update({
				where: { id },
				data: updateUserDto,
			});
			return updatedUser;
		} catch (error) {
			if (error.code === 'P2002') {
				throw new ForbiddenException("Username already taken");
			}
			throw new ForbiddenException(error);
		}
	}

	async remove(id: number) {
		let user = await this.prisma.user.findUnique({
			where: { id: id },
		});
		if (user)
			return this.prisma.user.delete({ where: { id }, });
		else
			throw new ForbiddenException("User dosen't exist");
	}

	async deletePendingGame(userId: number) {
		await this.prisma.game.deleteMany({
			where: { player1Id: userId,
			status: GameStatus.INVITE},
		});
	}

	async deleteImg(filePath: string) : Promise<void>{
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error('Error Deleting file:', err);
				return;
			}
		});
	}
}
