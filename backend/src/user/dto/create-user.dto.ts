import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
	@ApiProperty({description: 'Name of the user', example: 'test'})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({description: 'Password of the user', example: 'test'})
	@IsNotEmpty()
	@IsString()
	password: string;
}
