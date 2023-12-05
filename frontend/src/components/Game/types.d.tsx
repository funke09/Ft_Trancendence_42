export type GameState = {
	ball: {
		x: number;
		y: number;
	};
	player1: {
		x: number;
		y: number;
	};
	player2: {
		x: number;
		y: number;
	};
	score: {
		player1: number,
		player2: number,
	};
};

export type oppType = {
	lobbyName: string;
	player: number;
	opponentName: string;
	opponentId: number;
};