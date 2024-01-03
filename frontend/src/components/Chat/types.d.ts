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
  
	senderUsername: string;
	senderId: number;
  
	receiverId: number | null;
	receiverUsername: string | null;

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