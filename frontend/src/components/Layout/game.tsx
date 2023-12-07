import React, { useEffect, useRef, useState } from "react";
import { GameState as gameStateType, oppType } from "../Game/types.d";
import Matter from "matter-js";
import gameApi from "@/api/gameApi";
import store from "@/redux/store";

interface props {
	gameID: string | string[] | undefined;
}

let gameState: gameStateType = {
	ball: {x: 0, y:0},
	player1: {x: 0, y: 0},
	player2: {x: 0, y: 0},
	score: {player1: 0, player2: 0,}
}

let msgGame: string = "";

type moveType = {
	lobby: string;
	move: {up: boolean, down: boolean};
};

const screen: { width: number; height: number } = { width: 800, height: 400 };

export function GameLogic({ gameID }: props) {
	const mapRef = useRef<Matter.World>();
	const matterRef = useRef<Matter.Engine>();
	const runnerRef = useRef<Matter.Runner>();
	const [score, setScore] = useState<{ player1: number; player2: number}>({ player1: 0, player2: 0 });
	const [oppInfo, setOppInfo] = useState<oppType>({ lobbyName: "", player: 0, opponentId: 0, opponentName: "" });
	const [gameColor, setGameColor] = useState<{
		background: string;
		ball: string;
		player: string;
	}>({
		background: "#443346",
		ball: "#DADADA",
		player: "#DADADA",
	});

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);

	const playerRef = useRef<{
		body: Matter.Body;
		width: number;
		height: number;
	}>();

	const oppRef = useRef<{
		body: Matter.Body;
		width: number;
		height: number;
	}>();

	const ballRef = useRef<{
		body: Matter.Body;
	}>();

	const { Bodies, Engine, Events, Render, Runner, World } = Matter;

	useEffect(() => {
		gameApi.on("GAME-STATE", (data: any) => {
			gameState = data;
			setScore(gameState.score);
		});

		gameApi.on("GAME-MESSAGE", (data: any) => {
			msgGame = data;
		});

		setOppInfo(store.getState().game.opp);

		gameState = {
			ball: { x: screen.width / 2, y: screen.height / 2},
			player1: {x: 10, y: screen.height / 2},
			player2: {x: screen.width - 10, y: screen.height / 2},
			score: { player1: 0, player2: 0 },
		};
		return () => {
			msgGame = "";
			gameApi.emit("LEFT-GAME", { lobby: gameID });
		};
	}, []);

	function createMap() {
		const matter = Engine.create({
			gravity: {
				x: 0,
				y: 0,
				scale: 0,
			},
		});
		const map = matter.world;
		const runner = Runner.create();
		const render = Render.create({
			canvas: canvasRef.current ?? undefined,
			engine: matter,
			options: {
				width: screen.width,
				height: screen.height,
				wireframes: false,
				background: gameColor.background,
			},
		});

		Render.run(render);
		Runner.run(runner, matter);

		matterRef.current = matter;
		runnerRef.current = runner;
		mapRef.current = map;
	}

	function createBall() {
		const { map }: any = { map: mapRef.current };

		const ball = Bodies.circle(400, 200, 20, {
			render: {
				fillStyle: gameColor.ball,
			},
			id: 5,
			mass: 0,
		});
		ballRef.current = {
			body: ball,
		};
		World.add(map, [ball]);
	}

	function Player(x: number, y: number, width: number, height: number, ref: any) {
		const { map }: any = { map: mapRef.current };

		const player = Bodies.rectangle(x, y, width, height, {
			render: {
				fillStyle: gameColor.player,
			},
			id: 10,
			mass:0,
			isStatic: true,
		});

		ref.current = {
			body: player,
		};
		World.add(map, [player]);
	}

	function updateGame() {
		if (ballRef.current)
		{
			Matter.Body.setPosition(ballRef.current.body, {
				x: gameState.ball.x,
				y: gameState.ball.y,
			});
		}
		if (playerRef.current)
		{
			Matter.Body.setPosition(playerRef.current.body, {
				x: gameState.player1.x,
				y: gameState.player1.y,
			});
		}
		if (oppRef.current)
		{
			Matter.Body.setPosition(oppRef.current.body, {
				x: gameState.player2.x,
				y: gameState.player2.y,
			});
		}
		if (contextRef.current && gameState.score)
		{
			let txt = msgGame;
			contextRef.current.font = "50px Sarpanch";
			contextRef.current.fillStyle = "#FFFFFF";
			contextRef.current.fillText(txt, screen.width / 2 - txt.length * 18, screen.height / 2 + 30);
		}
	}

	useEffect(() => {
		if (canvasRef.current)
		{
			createMap();
			createBall();
			Player(0, screen.height / 2, 20, 120, playerRef);
			Player(screen.width - 10, screen.height / 2, 20, 120, oppRef);

			Events.on(matterRef.current, "preUpdate", updateGame);

			let key: moveType = {
				lobby: gameID as string,
				move: {
					up: false,
					down: false,
				},
			};
			if (gameApi.connected == false)
				gameApi.connect();

			document.addEventListener("keydown", (e) => {
				if (e.key == "ArrowUp")
					key.move.up = true;
				else if (e.key == "ArrowDown")
					key.move.down = true;

				gameApi.emit("MOVE", key);
			});

			document.addEventListener("keyup", (e) => {
				if (e.key == "ArrowUp")
					key.move.up = false;
				else if (e.key == "ArrowDown")
					key.move.down = false;

				gameApi.emit("MOVE", key);
			});
		}

		contextRef.current = canvasRef.current?.getContext("2d");
	}, [canvasRef]);

	const modes = [
		{
			id: 1,
			background: "#443346",
			ball: "#DADADA",
			player: "#EFEFEF",
		},
		{
			id: 2,
			background: "#0E0E0E",
			ball: "#FFFFFF",
			player: "#FFFFFF",
		},
		{
			id: 3,
			background: "#367175",
			ball: "#DADADA",
			player: "#EFEFEF",
		}
	]

	return (
		<>
		 <div className="flex justify-center">
			{modes.map((currentMode: { background: string; ball: string; player: string; id: number }) => {
				return (
					<button
						onClick={() => {
							setGameColor({
								background: currentMode.background,
								ball: currentMode.ball,
								player: currentMode.player,
							});

							if (ballRef.current)
							{
								ballRef.current.body.render.fillStyle = currentMode.ball;
								if (playerRef.current)
									playerRef.current.body.render.fillStyle = currentMode.player
								if (oppRef.current)
								{
									if (oppRef.current?.body?.render)
										oppRef.current.body.render.fillStyle = currentMode.player;
								}
							}
						}}
						key={currentMode.id}
					>
						<div className="grid">
							<div className="w-[30px] h-[30px] rounded-full cursor-pointer text-white">1</div>
							<div className="w-[30px] h-[30px] rounded-full cursor-pointer text-white">2</div>
							<div className="w-[30px] h-[30px] rounded-full cursor-pointer text-white">3</div>
						</div>
					</button>
				)
			})}
		 </div>
		</>
	)
}