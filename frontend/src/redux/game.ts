import { Game, oppType } from "@/components/Game/types";
import { createSlice } from "@reduxjs/toolkit";

const initialStateProfile = {
    game: {
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
        roomName: "",
        player: 0,
        opponentName: "",
        opponentId: 0,
    },
};

const gameSlice = createSlice({
	name: "game",
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