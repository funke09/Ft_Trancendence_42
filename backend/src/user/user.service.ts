import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUserDataById(id: number) {
		const user = await this.prisma.user.findUnique({ 
			where: { id: id },
			select: {
				id: true,
				username: true,
				userStats: true,
				userStatus: true,
				email: true,
				avatar: true,
				isTwoFA: true,
				Friends: true,
				channels: true,
			}
		});
		if (user)
			return user;
		throw new NotFoundException(`User not found`)
	}

	async findUserByUsername(username: string): Promise<any> {
		const user = await this.prisma.user.findUnique({
			where: { username: username },
			select : {
				id: true,
				username: true,
				userStats: true,
				userStatus: true,
				email: true,
				avatar: true,
				isTwoFA: true,
				Friends: true,
			}
		});
		return user;
	}

	async getBasicData(userId: number) : Promise<any>{
		const data = await this.prisma.user.findUnique({
			where: {id: userId},
			select: {
				username: true,
				avatar: true,
			}
		})
		return data;
	}

	async getAvataById(id: number) {
		const user = await this.prisma.user.findUnique({
			where : {id: id},
			select: {avatar: true, username: true},
		});
		if (!user) throw new NotFoundException(`User ${user.username} not found`);
		return user.avatar;
	}

	async getUserById(userId: number, findId: number): Promise<any> {
		const currUser = await this.prisma.user.findUnique({ where: {id: userId} });
		if (!currUser) throw new HttpException('User not Found', 404);

		const findUser = await this.prisma.user.findUnique({ where: {id: findId} });
		if (!findUser) throw new HttpException('User not Found', 404);

		if (currUser.id === findUser.id)
			return this.getUserDataById(userId);

		if (findUser && findUser.Blocked.includes(currUser.id))
			throw new HttpException('You are Blocked', 400);

		if (currUser.id === findUser.id)
			return this.getUserDataById(userId);

		return this.getUserDataById(findId);
	}

	async getStatsById(id: number) {
		const validUser = await this.prisma.user.findUnique({ where: {id: id} });
		if (!validUser)	throw new HttpException('User not Found', 404);

		let user = await this.prisma.user.findUnique({
			where: { id: id },
			select: {
				userStats: {
					select: {
						achievements: true,
						wins: true,
						losses: true,
						rank: true,
                        createdAt: true,
                        updatedAt: true,
					},
				},
				Games: {
					where: {
						p2Id: { not: id },
					},
					orderBy: {
						createdAt: 'desc'
					},
				},
			},
		});

		let games = user.Games.map(async (game) => {
			game['p2Username'] = await this.getUsernameById(game.p2Id);
			game['p1Username'] = await this.getUsernameById(game.userId);
			return game;
		});
		user.Games = await Promise.all(games);

		if (!user) throw new NotFoundException(`ID: ${id} not found`);

		return {stats: user.userStats, games: user.Games};
	}

	async getUsernameById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id : id },
			select: { username: true },
		});
		return user.username;
	}

	async setUsername(id: number, username: string) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		if (!user) throw new NotFoundException(`${id} not found`);
	
		const checkUser = await this.prisma.user.findFirst({where: {username: username}});
		if (checkUser) throw new BadRequestException("Username already taken");
		
		const updatedUser = await this.prisma.user.update({
			where: {id: id},
			data: {username: username},
		});
	
		return updatedUser;
	}	

	async setPassword(id: number, password: string) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		if (!user) throw new NotFoundException(`${id} not found`);

		const pwMatches = await argon.verify(user.password, password);
		if (pwMatches) throw new BadRequestException("This Password is already in use");

		const hash = await argon.hash(password);
		await this.prisma.user.update({
			where: {id: id},
			data: {password: hash},
		});
	}

	async saveAvatar(userId: number, filename: string): Promise<void> {
		const user = await this.prisma.user.findUnique({
		  where: { id: userId },
		});
	
		if (!user) {
		  throw new NotFoundException(`User with ID ${userId} not found`);
		}
	
		await this.prisma.user.update({
		  where: { id: userId },
		  data: { avatar: filename },
		});
	}

	async rejectFriend(id: number, friendUsername: string) {
		const user = await this.prisma.user.findUnique({where: {id: id}});
		const friend = await this.prisma.user.findUnique({where: {username: friendUsername}});
		if (!user || !friend) throw new NotFoundException(`User not found`);

		const friendRequest = await this.prisma.friends.deleteMany({
			where: {
				fromId: friend.id,
				toId: user.id,
				status: 'Pending'
			},
		});

		if (friendRequest.count == 0) throw new NotFoundException("Friend Request not found");

		await this.prisma.notifs.deleteMany({
			where: {
				from: friendUsername,
				to: user.username,
				type: 'friendRequest',
			}
		});

		return new HttpException('Friend Request Rejected', 200);
	}

	async removePrivateChannel(userId1: number, userId2: number) {
		// Construct the private channel ID
		const channelId = `__private__@${Math.min(userId1, userId2)}+${Math.max(userId1, userId2)}`;
	
		// Fetch the users
		const user1 = await this.prisma.user.findUnique({ where: { id: userId1 } });
		const user2 = await this.prisma.user.findUnique({ where: { id: userId2 } });
	
		if (!user1 || !user2) {
			throw new NotFoundException(`User not found`);
		}
	
		// Remove the channel from the privateChannels arrays
		const updatedPrivateChannels1 = user1.privateChannels.filter(c => c !== channelId);
		const updatedPrivateChannels2 = user2.privateChannels.filter(c => c !== channelId);
	
		// Save the users back to the database
		await this.prisma.user.update({
			where: { id: userId1 },
			data: { privateChannels: updatedPrivateChannels1 },
		});
	
		await this.prisma.user.update({
			where: { id: userId2 },
			data: { privateChannels: updatedPrivateChannels2 },
		});
	}

	async blockFriend(id: number, friendID: number) {
		const user = await this.prisma.user.findUnique({ where: { id: id } });
		const friend = await this.prisma.user.findUnique({ where: { id: friendID } });
	  
		if (!user || !friend) throw new NotFoundException("User not found");
	  
		const isExist = await this.prisma.friends.findFirst({
		  where: { friendID: friend.id, userId: user.id, status: 'Accepted' },
		});
	  
		if (!isExist) throw new NotFoundException("User is not your friend or already blocked");
	  
		// Check if the user is already blocked
		const isBlocked = user.Blocked.includes(friend.id);
	  
		if (!isBlocked) {
		  // Add friend to the Blocked array
		  await this.prisma.user.update({
			where: { id: user.id },
			data: { Blocked: { push: friend.id } },
		  });

		  await this.prisma.friends.updateMany({
			where: {userId: friend.id},
			data: {status: 'Blocked'},
		  })

		  this.removePrivateChannel(id, friendID);
		}
		return new HttpException('Friend Blocked', HttpStatus.OK);
	}
	  
	async unblockFriend(id: number, friendID: number) {
		const user = await this.prisma.user.findUnique({ where: { id: id } });
		const friend = await this.prisma.user.findUnique({ where: { id: friendID } });
	  
		if (!user || !friend) throw new NotFoundException("User not found");
	  
		// Remove friend from the Blocked array
		await this.prisma.user.update({
		  where: { id: user.id },
		  data: { Blocked: { set: user.Blocked.filter((blockedId) => blockedId !== friend.id) } },
		});

		await this.prisma.friends.updateMany({
			where: {userId: friend.id},
			data: {status: 'Accepted'},
		  })
	  
		return new HttpException('Friend Unblocked', HttpStatus.OK);
	}

	async unfriend(id: number, friendID: number) {
		const user = await this.prisma.user.findUnique({ where: { id: id } });
		const friend = await this.prisma.user.findUnique({ where: { id: friendID } });
	  
		if (!user || !friend) {
		  throw new NotFoundException("User not found");
		}
	  
		// Delete the friendship records
		await this.prisma.friends.deleteMany({
		  where: {
			OR: [
			  { userId: user.id, friendId: friend.id },
			  { userId: friend.id, friendId: user.id },
			],
		  },
		});

		this.removePrivateChannel(id, friendID);
	  
		return new HttpException(`${friend.username} Unfriended`, HttpStatus.OK);
	}			  
}
