export class MsgPrivateReqDto {
  toId: number;
  text: string;
}

export class SocketResDto {
  status: number;
  message: string | null;
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
}

export class DmDto {
  msg: string;
  from: string;
  toID: number;
  channelId: string;
}

export class PublicMsgDto {
  text: string;
  id: number;
}

export class SetChannelMsgDto {
  text: string;
  fromId: number;
  channelId: number;
  fromAvatar: string;
}

export class UserSearchDto {
  userQuery: string;
}

export class ChannelSearchDto {
  channelQuery: string;
}

export class NotifsDto {
  id: number;
  type: string;
  from: string;
  to: string;
  status: string;
  msg: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  avatar: string;
  friendId: number;
}

export class AddFriendDto {
  id: number;
}

export class AcceptFriendDto {
  id: number;
}

export class setPrivateMsgDto {
  text: string;
  fromId: number;
  channelId: number;
  fromAvatar: string;
}

export class RemoveChannelDto {
	channelID: number;
}
