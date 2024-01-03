import { createSlice } from "@reduxjs/toolkit";

export interface UserType {
	id: number;
	email: string;
	name: string;
	username: string;
	password: string;
	avatar: string;
	isTwoFA: boolean;
	otpTwoFA: string;
	userStatus: string;
	createdAt: string;
	updatedAt: string;
	stats: {
		userId: number;
		matchesPlayed: number;
		wins: number;
		losses: number;
		rank: string;
		createdAt: string;
		updatedAt: string;
	};
	Games: any[];
	Friends: any[];
	channels: any[];
}

const initialStateProfile: { user: UserType } = {
	user: {
		id: 0,
		email: "",
		name: "",
		username: "",
		password: "",
		avatar: "",
		isTwoFA: false,
		otpTwoFA: "",
		userStatus: "",
		createdAt: "",
		updatedAt: "",
		stats: {
			userId: 0,
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			rank: "",
			createdAt: "",
			updatedAt: "",
		},
		Games: [],
		Friends: [],
		channels: [],
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
	},
});

export { profileSlice };