import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SetEmailDto {
  @IsEmail()
  email: string;
}

export class setUsernameDto {
  @IsString()
  @MaxLength(12)
  username: string;
}

export class setPasswordDto {
  @MinLength(8)
  password: string;
}

export class userIdDto {
  userId: number;
}

export class pinDto {
  pin: number;
}

export class BlockFriendDto {
  @IsNotEmpty()
  @IsNumber()
  friendID: number;
}

export class UnblockFriendDto {
  @IsNotEmpty()
  @IsNumber()
  friendID: number;
}

export class CreateChannelDto {
  @IsString()
  name: string;

  createdAt?: Date | string;
  updatedAt?: Date | string;

  type: string;

  password?: string | '';

  owner: string;

  members?: string[];
  admins?: string[];
  invited?: string[];
  banned?: string[];
  kicked?: string[];
  msgs?: string[];
}

export class JoinChannelDto {
  channelID: number;
  password: string | null;
}

export class LeaveChannelDto {
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@IsInt()
	channelID: number;
}

export class UserMuteDto {
	userID: number;
	channelID: number;
}

export class MakeAdminDto {
	userID: number;
	channelID: number;
}

export class addChannelMemberDto {
	username : string;
	channelID: number;
}

export class BanUserDto {
	userID: number;
	channelID: number;
}

export class UnBanUserDto {
	userID: number;
	channelID: number;
}

export class KickUserDto {
	userID: number;
	channelID: number;
}

export class UpdatePasswordDto {
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	@IsInt()
	channelId: number;
	newPassword: string | null;
  }