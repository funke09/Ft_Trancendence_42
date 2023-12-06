import api from ".";
import { io } from "socket.io-client";

const gameApi = io(api.getUri() + "game", {
	withCredentials: true,
	autoConnect: false,
});

export default gameApi;