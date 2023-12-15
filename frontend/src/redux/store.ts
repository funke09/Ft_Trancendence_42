import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./profile";
import { socketSlice } from "./socket";

const rootReducer = {
	profile: profileSlice.reducer,
	io: socketSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const { setProfile, updateAvatar } = profileSlice.actions;
export const { setSocket } = socketSlice.actions;

export default store;