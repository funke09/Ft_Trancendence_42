import { GameState, oppType } from "@/components/Game/types.d";
import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
	gameState: {
		ball: {
			x: 0,
			y: 0,
		},
		player1: {
			x: 0,
			y: 0,
		},
		player2: {
			x: 0,
			y: 0,
		},
	},
	opp: {
		lobbyName: "",
		player: 0,
		opponentId: 0,
		opponentName: "",
	},
};

const gameSlice = createSlice({
	name: "game",
	initialState: initialStateProfile as { gameState: GameState, opp: oppType },
	reducers: {
		setGameState: (state, action) => {
			state.gameState = action.payload;
		},
		setOpp: (state, action) => {
			state.opp = action.payload;
		},
	},
});

export { gameSlice };