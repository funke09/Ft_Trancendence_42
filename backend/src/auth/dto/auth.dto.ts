import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TradeDto {
	@ApiProperty({ description: 'oAuth code'})
	@IsString()
	@IsNotEmpty()
	oAuth_code: string;

	@ApiProperty({ description: 'OTP code is optional'})
	@IsString()
	@IsOptional()
	otp_code: string;
}

export class JwtPayloadDto {
	id?: number;
	username?: string;
	iat?: number;
}
