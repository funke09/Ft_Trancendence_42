import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
export class User implements IUser {
    login: string;
    @ApiProperty()
    id: number;

    @ApiProperty({required: false})
    name?: string;

    @ApiProperty()
    loging: string;

    @ApiProperty({nullable: true})
    avatar: string;
}

export interface IUser {
    login: string;
    name?: string;
    id: number;
    avatar: string;
}