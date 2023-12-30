import { IsAlphanumeric, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class SetEmailDto {
	@IsEmail()
	email: string;
};

export class setUsernameDto {
	@IsString()
	@IsAlphanumeric()
	username: string;
};

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
	@IsAlphanumeric()
	name: string;
  
	createdAt?: Date | string;
	updatedAt?: Date | string;
  
	type: string;
  
	password?: string | "";
  
	owner: string;
  
	members?: string[];
	admins?: string[];
	invited?: string[];
	banned?: string[];
	kicked?: string[];
	msgs?: string[];
};
  