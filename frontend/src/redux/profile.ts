import { createSlice } from "@reduxjs/toolkit";

export interface UserType {
	id: number;
	email: string;
	name: string;
	username: string;
	password: string;
	avatar: string;
	oAuth_code: string;
	oAuth_exp: string;
	userStatus: any[];
	createdAt: string;
	UserStats: any[];
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
		oAuth_code: "",
		oAuth_exp: "",
		userStatus: [],
		createdAt: "",
		UserStats: [],
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