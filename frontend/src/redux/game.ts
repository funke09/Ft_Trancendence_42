import { Game, oppType } from "@/components/Game/types";
import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    game: {
		ball: { x: 0, y: 0 },
		player1: { x: 0, y: 0 },
		player2: { x: 0, y: 0 },
		score: {player1: 0, player2: 0},
		gameType: 0,
    },
    opp: {
        roomName: "",
        player: 0,
        oppName: "",
        oppId: 0,
    },
};

const gameSlice = createSlice({
	name: "gameState",
    initialState: initialStateProfile as unknown as { game: Game; opp: oppType },
	reducers: {
		setGame: (state, action) => {
			state.game = action.payload;
		},
		setOpp: (state, action) => {
			state.opp = action.payload;
		},
	},
});

export { gameSlice };