import { IsNotEmpty, IsString } from "class-validator";

export class SigninDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}