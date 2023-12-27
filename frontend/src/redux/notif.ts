import { NotifType } from "@/sockets/types";
import { createSlice } from "@reduxjs/toolkit";

const initialNotif: { friendRequest: NotifType[] } = { friendRequest: [] };

const NotifSlice = createSlice({
  name: 'notif',
  initialState: initialNotif,
  reducers: {
    setNotif: (state, action) => {
      state.friendRequest = action.payload;
    },
    addFriend: (state, action) => {
      state.friendRequest.push(action.payload);
    },
    removeFriend: (state, action) => {
      state.friendRequest = state.friendRequest.filter((req) => req.id !== action.payload);
    },
  },
});

export { NotifSlice };