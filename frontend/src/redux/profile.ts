import { createSlice } from "@reduxjs/toolkit";

export interface UserType {
	id: number;
	email: string;
	name: string;
	username: string;
	password: string;
	avatar: string;
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
}

const initialStateProfile: { user: UserType } = {
	user: {
		id: 0,
		email: "",
		name: "",
		username: "",
		password: "",
		avatar: "",
		userStatus: "",
		createdAt: "",
		updatedAt: "",
		stats: {
			userId: 0,
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			rank: "Unranked",
			createdAt: "",
			updatedAt: "",
		},
		Games: [],
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