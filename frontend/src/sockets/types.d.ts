export class AchievDto {
	name: string;
	desc: string;
	icon: string;
};

export class RankDto {
	name: string;
};

export class NotifType {
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
};

export class SocketRes {
	message: string | null;
	status: number;
}