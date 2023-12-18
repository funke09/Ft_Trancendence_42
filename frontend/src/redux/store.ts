import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./profile";
import { socketSlice } from "./socket";
import { gameSlice } from "./game";

const rootReducer = {
	profile: profileSlice.reducer,
	io: socketSlice.reducer,
	game: gameSlice.reducer,
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
export const { setGame, setOpp } = gameSlice.actions;

export default store;