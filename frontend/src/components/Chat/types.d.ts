export class CreateChannelDto {
	name: string;
	type: string;
	password?: string | "";
}

export class UserSearchDto {
	userQuery: string;
}

export class ChannelSearchDto {
	channelQuery: string;
}