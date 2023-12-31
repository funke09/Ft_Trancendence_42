export class CreateChannelDto {
	name: string;
	type: string;
	password?: string | "";
}

export class SearchDto {
	query: string;
}