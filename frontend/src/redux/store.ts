import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./profile";

const rootReducer = {
	profile: profileSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const { setProfile, updateAvatar, set2FA } = profileSlice.actions;

export default store;