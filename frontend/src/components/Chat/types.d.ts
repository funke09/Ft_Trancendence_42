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

export class AnyMsgDto {
	avatar: string;
	text: string;
  
	updatedAt: Date;
	createdAt: Date;
  
	channelName: string | null;
	channelId: number | null;
  
	privateChannelId: string | null;
  
	fromUsername: string;
	fromId: number;
  
	toId: number | null;
	toUsername: string | null;

    user?:{
        username: string;
        avatar: string;
    }
};

export class PrivateMsgReq {
    toId: number;
    text: string;
};

export class JoinChannelDto {
	channelID: number;
	password: string | null;
};

export class LeaveChannelDto {
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

export class IsFlaggedDto {
	userID: number;
	channelID: number;
}
