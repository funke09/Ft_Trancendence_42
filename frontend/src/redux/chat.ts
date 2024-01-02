import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
	PrivateChats: [],
	GroupChats: [],
	currentChat: null,
	currentChatGroup: null,
	newMsg: null,
};

const ChatSlice = createSlice({
	name: "chat",
	initialState: initialStateProfile, reducers: {
		setPrivateChat: (state, action) => {
			state.PrivateChats = action.payload;
		},

		addNewMsgToPrivate: (state, action) => {
			const privateChat: any = state.PrivateChats.find((chat: any) => chat.privateChannelId === action.payload.privateChannelId);
			if (privateChat)
				privateChat.chat.push(action.payload);
		},

		setGroupChat: (state, action) => {
			state.GroupChats = action.payload;
		},

		addNewMsgToGroup: (state, action) => {
			const groupChat: any = state.GroupChats.find((chat: any) => {
				return chat.id === action.payload.channelId;
			});
			if (groupChat)
				groupChat.msgs.push(action.payload);
		},

		setCurrentChat: (state, action) => {
			state.currentChat = action.payload;
		},

		setCurrentChatGroup: (state, action) => {
			state.currentChatGroup = action.payload;
		},

		setNewMsg: (state, action) => {
			state.newMsg = action.payload;
		},
	}
});

export { ChatSlice };