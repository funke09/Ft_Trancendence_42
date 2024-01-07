import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './user.dto';
import * as argon from 'argon2';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async createChannel(id: number, channel: CreateChannelDto) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');

    if (channel.type === 'protected') {
      if (!channel.password)
        throw new BadRequestException('No Password provided');
      if (channel.password && channel.password.length < 8)
        throw new BadRequestException(
          'Channel Password must be at least 8 characters long',
        );
      channel.password = await argon.hash(channel.password);
    }

    if (['private', 'protected', 'public'].includes(channel.type) == false) {
      throw new BadRequestException('Invalid channel type');
    }

    const isExist = await this.prisma.channel.findFirst({
      where: { name: channel.name },
    });
    if (isExist) throw new BadRequestException('Channel name already exists');

    const newChannel = await this.prisma.channel.create({
      data: {
        member: { connect: { id: user.id } },
        admins: { connect: { id: user.id } },
        name: channel.name,
        type: channel.type,
        password: channel.password,
        ownerId: user.id,
        adminsIds: { set: [user.id] },
      },
      select: {
        id: true,
        member: true,
        admins: true,
        name: true,
        ownerId: true,
      },
    });

    return newChannel;
  }

  async checkIsBlocked(id: number, channelID: number): Promise<boolean> {
    const checkBlock = await this.prisma.user.findFirst({
      where: {
        id: id,
        bannedFrom: {
          some: {
            id: channelID,
          },
        },
      },
    });

    if (checkBlock) return true;
    else return false;
  }

  async joinChannel(
    id: number,
    channelID: number,
    password: string | null,
  ): Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type === 'private')
      throw new BadRequestException('Channel is private');

    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');

    const isMember = await this.prisma.user.findFirst({
      where: {
        id: id,
        channels: { some: { id: channelID } },
      },
    });
    if (isMember)
      throw new BadRequestException('You already a member in channel');

    const isBlocked = await this.checkIsBlocked(user.id, channelID);
    if (isBlocked)
      throw new BadRequestException('You are blocked from Channel');

    if (channel.type === 'protected' && password) {
      const passCheck = await argon.verify(channel.password, password);
      if (!passCheck)
        throw new BadRequestException('Channel password is Wrong');
    } else if (channel.type === 'protected' && !password)
      throw new BadRequestException('Channel has a Password');

    if (user.id === channel.ownerId) {
      await this.prisma.channel.update({
        where: { id: channelID },
        data: {
          member: {
            connect: { id: id },
          },
          admins: {
            connect: { id: id },
          },
          adminsIds: {
            set: channel.adminsIds.concat(user.id),
          },
        },
      });
      return HttpStatus.ACCEPTED;
    }

    await this.prisma.channel.update({
      where: { id: channelID },
      data: {
        member: {
          connect: { id: id },
        },
        kicked: {
          disconnect: { id: id },
        },
      },
    });
    return HttpStatus.ACCEPTED;
  }

  async channelMembers(id: number, channelID: number) : Promise<any> {
	const channel = await this.prisma.channel.findUnique({
		where: {id: channelID},
		select: {
			member: {
				select: {
					id: true,
					username: true,
					avatar: true,
					userStatus: true,
				},
			},
		},
	});
	if (!channel) throw new NotFoundException("Channel Not found");

	const members = channel.member;

	const userChannels= (
		await this.prisma.user.findUnique({
			where: {id: id},
			select: {channels: true},
		})
	).channels;

	const isMember = userChannels.filter((chann) => chann.id === channelID);
	if (isMember.length === 0) throw new BadRequestException('User not a Member of channel');

	return members;
  }
  
  async leaveChannel(id: number, channelID: number) : Promise<any> {
	const isMember = await this.prisma.user.findFirst({
		where: {
			id: id,
			channels: {some: {id: channelID}},
		},
	});

	if (!isMember) throw new BadRequestException("User not a Member of channel")
  
	const isOwner = await this.prisma.channel.findFirst({
		where: {id: channelID},
	});

	await this.prisma.channel.update({
		where: {id: channelID},
		data: {
			member: {
				disconnect: {id: id}
			},
			admins: {
				disconnect: {id: id}
			},
			adminsIds: {
				set: isOwner.adminsIds.filter((adminID) => adminID !== id),
			},
		},
	});
	throw new HttpException('You left the channel', HttpStatus.OK);
  }

  async removeChannel(id: number, channelID: number): Promise<any> {
	return this.prisma.$transaction(async prisma => {
	  const channel = await prisma.channel.findUnique({ where: { id: channelID } });
	  if (!channel) throw new NotFoundException("Channel not found");
  
	  if (channel.ownerId != id) throw new BadRequestException("User not Owner of channel");
  
	  // Bulk delete messages
	  await prisma.msg.deleteMany({ where: { channelId: channelID } });
  
	  // Bulk delete ChannelUserMute records associated with the channel
	  await prisma.channelUserMute.deleteMany({ where: { channelId: channelID } });
  
	  // Disconnect all members and admins in one operation
	  await prisma.channel.update({
		where: { id: channelID },
		data: {
		  member: { set: [] },
		  admins: { set: [] }
		}
	  });
  
	  // Delete the channel
	  await prisma.channel.delete({ where: { id: channelID } });
  
	  return HttpStatus.ACCEPTED;
	}).catch(error => {
	  throw new InternalServerErrorException("Error removing channel", error.message);
	});
  }
  
  async makeAdmin(id: number, targetID: number, channelID: number) : Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });
    if (!channel) throw new NotFoundException('Channel not found');
  
    const user = await this.prisma.user.findUnique({
      where: { id: targetID },
    });
    if (!user) throw new NotFoundException('User not found');
  
    if (!channel.adminsIds.includes(id))
      throw new BadRequestException('You are not the admin of this channel');
  
    if (channel.adminsIds.includes(targetID))
      throw new BadRequestException('User is already an admin');
  
    channel.adminsIds.push(targetID);
  
    await this.prisma.channel.update({
      where: { id: channelID },
      data: {
        adminsIds: channel.adminsIds,
        admins: {
          connect: { id: targetID },
        },
      },
    });
  
    return HttpStatus.ACCEPTED;

  }

  async addChannelMember(id: number, username: string, channelID: number): Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
    });
    if (!channel) throw new NotFoundException('Channel not found');
  
    const userToAdd = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!userToAdd) throw new NotFoundException('User not found');
  
    if (userToAdd.id === id)
      throw new BadRequestException('You cannot add yourself');
  
    const isOwner = channel.ownerId === id;
    if (!isOwner)
      throw new BadRequestException('You are not the owner of this channel');
  
    const isAlreadyMember = await this.prisma.channel.findFirst({
      where: {
        id: channelID,
        member: {
          some: {
            id: userToAdd.id,
          },
        },
      },
    });
  
    if (isAlreadyMember)
      throw new BadRequestException('User is already a member of this channel');
  
    await this.prisma.channel.update({
      where: { id: channelID },
      data: {
        member: {
          connect: { id: userToAdd.id },
        },
      },
    });
  
    return { userToAdd : userToAdd, status: HttpStatus.ACCEPTED };
  }

  async muteUser(adminId: number, targetUserId: number, channelId: number): Promise<any> {
	const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
	if (!channel) {
	  throw new Error("Channel not found");
	}
  
	if (!channel.adminsIds.includes(adminId)) {
	  throw new Error("You do not have the authority to mute users in this channel");
	}
  
	const targetUser = await this.prisma.user.findUnique({ where: { id: targetUserId }, include: {channels: true} });
	if (!targetUser || !targetUser.channels.some(c => c.id === channelId)) {
	  throw new Error("Target user not found in the channel");
	}
  
	const muteExpiry = new Date(new Date().getTime() + 5 * 60000); // 5 minutes in milliseconds

	// connect this user to muted relation in channel
	await this.prisma.channel.update({
	  where: { id: channelId },
	  data: {
		muted: {
		  connect: { id: targetUserId },
		},
	  },
	});

	const tab = await this.prisma.channelUserMute.create({
	  data: {
		channelId: channelId,
		userId: targetUserId,
		muteExpiry: muteExpiry
	  }
	});
	return HttpStatus.ACCEPTED;
  }

  async isFlagged(userId: number, channelId: number): Promise<boolean> {
	const channel = await this.prisma.channel.findUnique({
	  where: { id: channelId },
	  include: {
		banned: true,
		kicked: true,
		muted: true,
	  },
	});
  
	if (!channel) return true;
  
	// Check if user is banned
	if (channel.banned.some((user) => user.id === userId)) return true;
  
	// Check if user is kicked
	if (channel.kicked.some((user) => user.id === userId)) return true;
  
	// Check if user is muted. If so, check the mute expiry
	if (channel.muted.some((user) => user.id === userId)) {
	  const muteRecord = await this.prisma.channelUserMute.findFirst({
		where: {
		  channelId: channelId,
		  userId: userId
		}
	  });
  
	  if (muteRecord && new Date() < new Date(muteRecord.muteExpiry)) {
		return true;
	  }
	  else {
		await this.prisma.channelUserMute.delete({
		  where: {
			channelId_userId: {
			  channelId: channelId,
			  userId: userId
			}
		  }
		});

		await this.prisma.channel.update({
		  where: { id: channelId },
		  data: {
			muted: {
			  disconnect: {
				id: userId
			  }
			}
		  }
		});
		return false;
	  }
	}

	return false;
  }

  async banUser(id: number, targetID: number, channelID: number): Promise<any> {
	const channel = await this.prisma.channel.findUnique({
	  where: { id: channelID },
	  include: {
		banned: true,
		member: true,
	  },
	});
	if (!channel) throw new NotFoundException('Channel not found');
  
	const targetUser = await this.prisma.user.findUnique({
	  where: { id: targetID },
	});
	if (!targetUser) throw new NotFoundException('Target user not found');
  
	if (!channel.adminsIds.includes(id))
	  throw new BadRequestException('You are not the admin of this channel');
  
	if (!channel.member.some((member) => member.id === targetID))
	  throw new BadRequestException('Target user is not a member of this channel');

	if (channel.banned.some((banned) => banned.id === targetID))
	  throw new BadRequestException('Target user is already banned from this channel');
  
	await this.prisma.channel.update({
	  where: { id: channelID },
	  data: {
		banned: {
		  connect: { id: targetID },
		},
	  },
	});
  
	return HttpStatus.ACCEPTED;
  }

  async unbanUser(id: number, targetID: number, channelID: number): Promise<any> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelID },
      include: {
      banned: true,
      },
    });
    if (!channel) throw new NotFoundException('Channel not found');
    
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetID },
    });
    if (!targetUser) throw new NotFoundException('Target user not found');
    
    if (!channel.adminsIds.includes(id))
      throw new BadRequestException('You are not the admin of this channel');
    
    if (!channel.banned.some((banned) => banned.id === targetID))
      throw new BadRequestException('Target user is not banned from this channel');
    
    await this.prisma.channel.update({
      where: { id: channelID },
      data: {
      banned: {
        disconnect: { id: targetID },
      },
      },
    });
    
    return HttpStatus.ACCEPTED;
    }

    async kickUser(id: number, targetID: number, channelID: number): Promise<any> {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelID },
      });
      if (!channel) throw new NotFoundException('Channel not found');
  
      const targetUser = await this.prisma.user.findUnique({
        where: { id: targetID },
      });
      if (!targetUser) throw new NotFoundException('Target user not found');
  
      if (!channel.adminsIds.includes(id))
        throw new BadRequestException('You are not the admin of this channel');
  
      await this.prisma.channel.update({
        where: { id: channelID },
        data: {
          member: {
            disconnect: { id: targetID },
          },
        },
      });
  
      return HttpStatus.ACCEPTED;
    }
  
	async updatePassword(id: number, channelId: number, newPassword: string): Promise<any> {
		const channel = await this.prisma.channel.findUnique({
		  where: { id: channelId },
		});
	
		const user = await this.prisma.user.findUnique({
		  where: {id: id},
		})
		if (!user) throw new NotFoundException("User not found");
	
		if (channel.ownerId !== id) throw new BadRequestException("User is not Owner of channel");
		let hash: string = '';
		if (newPassword) {
			if (channel.password !== '') {
				const pwMatches = await argon.verify(channel.password, newPassword);
				if (pwMatches)
				  throw new BadRequestException('This Password is already in use')
			}
			hash = await argon.hash(newPassword);
		}
	   
		// Update the channel type and password
		if (!newPassword) {
		  await this.prisma.channel.update({
			where: { id: channelId },
			data: { type: 'public', password: '' },
		  });
		} else if (newPassword.length > 7){
		  await this.prisma.channel.update({
			where: { id: channelId },
			data: { type: 'protected', password: hash },
		  });
		}
		return HttpStatus.ACCEPTED;
	}

	async isBanned(memberId: number, channelId: number): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: { id: memberId },
		});
		if (!user) throw new NotFoundException('User not found');

		const channel = await this.prisma.channel.findUnique({
		  where: { id: channelId },
		  include: {
			banned: true,
		  },
		});

		if (!channel) throw new NotFoundException('Channel not found');

		if (channel.banned.some((banned) => banned.id === memberId)) return true;
		return false;
	}
}
