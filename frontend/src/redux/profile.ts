import { createSlice } from "@reduxjs/toolkit";

interface UserType {
	id: number;
	email: string;
	name: string;
	username: string;
	avatar: string;
	oAuthId: null | string;
	is2FA: boolean;
	twoFaSecret: null | string;
	userStatus: string;
	blockedIds: number[];
	createdAt: string;
	updatedAt: string;
	confirmed: boolean;
	socketId: null | string;
	isBanned: boolean;
	UserStats: {
		id: number;
		wins: number;
		losses: number;
		rank: string;
		createdAt: string;
		updatedAt: string;
		userId: number;
	};
	Matches: any[];
	friends: any[];
}

const initialStateProfile: { user: UserType } = {
	user: {
		id: 0,
		email: "",
		name: "",
		username: "",
		avatar: "",
		oAuthId: null,
		is2FA: false,
		twoFaSecret: "",
		userStatus: "offline",
		blockedIds: [],
		createdAt: "",
		updatedAt: "",
		confirmed: false,
		socketId: null,
		isBanned: false,
		UserStats: {
			id: 0,
			wins: 0,
			losses: 0,
			rank: "iron",
			createdAt: "",
			updatedAt: "",
			userId: 0,
		},
		Matches: [],
		friends: [],
	},
}

const profileSlice = createSlice({
	name: "profile",
	initialState: initialStateProfile,
	reducers: {
		setProfile: (state, action) => {
			state.user = action.payload;
		},
		updateAvatar: (state, action) => {
			state.user.avatar = action.payload.avatar;
		},
		set2FA: (state, action) => {
			state.user.is2FA = action.payload;
		},
	},
});

export { profileSlice };