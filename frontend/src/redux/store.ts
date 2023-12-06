import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./profile";
import { gameSlice } from "./game";
import { socketSlice } from "./api";

const rootReducer = {
	profile: profileSlice.reducer,
	game: gameSlice.reducer,
	socket: socketSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const { setProfile, updateAvatar, set2FA } = profileSlice.actions;
export const { setGameState, setOpp } = gameSlice.actions;
export const { setSocket } = socketSlice.actions;

export default store;