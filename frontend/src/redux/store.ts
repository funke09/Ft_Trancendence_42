import { configureStore } from "@reduxjs/toolkit";
import { profileSlice } from "./profile";
import { socketSlice } from "./socket";
import { gameSlice } from "./game";
import { ChatSlice } from "./chat";
import { NotifSlice } from "./notif";

const rootReducer = {
	profile: profileSlice.reducer,
	io: socketSlice.reducer,
	game: gameSlice.reducer,
	chat: ChatSlice.reducer,
	notif: NotifSlice.reducer,
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
export const { setPrivateChat, addNewMsgToPrivate, setGroupChat, setCurrentChat, setNewMsg, setCurrentChatGroup, addNewMsgToGroup } = ChatSlice.actions;
export const { setNotif, addFriend, removeFriend } = NotifSlice.actions;

export default store;