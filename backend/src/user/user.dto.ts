import { IsAlphanumeric, IsEmail, IsString, MinLength } from "class-validator";

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