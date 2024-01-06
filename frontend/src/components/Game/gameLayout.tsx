import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket from '@/sockets/gameSocket';
import store from '@/redux/store';
import { GameInfo } from './gameInfo';
import { oppType, Game } from './types';

const screen: { width: number; height: number } = { width: 1200, height: 600 };

let game: Game = {
  ball: { x: 0, y: 0 },
  player1: { x: 0, y: 0 },
  player2: { x: 0, y: 0 },
  score: { player1: 0, player2: 0 },
  gameType: 1,
};

let gameMsg: string = '';

type moveType = {
  room: string;
  move: { up: boolean; down: boolean };
};

export function GameLayout({ gameID }: { gameID: string | string[] | undefined }) {
  const worldRef = useRef<Matter.World>();
  const engineRef = useRef<Matter.Engine>();
  const runnerRef = useRef<Matter.Runner>();
  const [oppInfo, setOppInfo] = useState<oppType>({ roomName: '', player: 0, oppId: 0, oppName: '' });
  const [score, setScore] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });
  const [gameMode, setGameMode] = useState<{ bg: string }>({ bg: "#443346" });

  const cvsRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null | undefined>(null);

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

  const { World, Engine, Events, Bodies, Runner, Render } = Matter;

  function getGameModeColor(gameType: number) {
	  switch (gameType) {
		case 1:
		  return { bg: '#443346' };
		case 2:
		  return { bg: '#367175' };
		case 3:
		  return { bg: '#121212' };
		default:
		  return { bg: '#443346' };
	  }
  }

  useEffect(() => {
    const handleGameState = (data: any) => {
		game = data;
		setScore(game.score);
		setGameMode(getGameModeColor(game.gameType));
    };


    const handleGameMsg = (data: any) => {
      gameMsg = data;
    };

    if (gameSocket.connected) {
		gameSocket.on('gameState', handleGameState);
	} else {
		console.error('Socket not connected');
	}
    gameSocket.on('gameMsg', handleGameMsg);

    setOppInfo(store.getState().game.opp);

    game = {
      ball: {
        x: screen.width / 2,
        y: screen.height / 2,
      },
      player1: {
        x: 10,
        y: screen.height / 2,
      },
      player2: {
        x: screen.width - 10,
        y: screen.height / 2,
      },
      score: { player1: 0, player2: 0 },
	  gameType: game.gameType,
    };

    return () => {
      gameMsg = '';
      gameSocket.emit('leaveGame', { room: gameID });
      gameSocket.off('gameState', handleGameState);
      gameSocket.off('gameMsg', handleGameMsg);
    };
  }, [gameID]);

  useEffect(() => {
    if (cvsRef.current) {
		cvsRef.current.width = screen.width;
		cvsRef.current.height = screen.height;
		createWorld();
		createBall();
		createPlayerEntities();
		registerEventListeners();
    }
    ctxRef.current = cvsRef.current?.getContext('2d');

    return () => {
      removeEventListeners();
    };
  }, [cvsRef]);

  function createWorld() {
    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0,
      },
    });

    const world = engine.world;
    const runner = Runner.create();
    const render = Render.create({
      canvas: cvsRef.current ?? undefined,
      engine: engine,
      options: {
        width: screen.width,
        height: screen.height,
        wireframes: false,
        background: gameMode.bg,
      },
    });

	const netWidth = 5;
	const netHeight = screen.height;
	const dashWidth = 10; // Adjust the width of each dash
	const gapWidth = 10; // Adjust the width of the gap between dashes
	const numDashes = Math.floor(netHeight / (dashWidth + gapWidth));
  
	const netDashes = Array.from({ length: numDashes }, (_, index) => {
	  const y = index * (dashWidth + gapWidth) + dashWidth / 2;
	  return Bodies.rectangle(screen.width / 2, y + 5, netWidth, dashWidth, {
		isSensor: true,
		render: {
		  fillStyle: '#DADADA',
		},
	  });
	});
  
	World.add(world, netDashes);

    Render.run(render);
    Runner.run(runner, engine);

    engineRef.current = engine;
    runnerRef.current = runner;
    worldRef.current = world;
  }

  function createBall() {
    const { world }: any = { world: worldRef.current };
    const ball = Bodies.circle(600, 300, 15, {
      render: {
        fillStyle: '#DADADA',
      },
      id: 5,
      mass: 0,
    });

    ballRef.current = {
      body: ball,
    };

    World.add(world, [ball]);
  }

  function createPlayerEntities() {
	Player(10, screen.height / 2, 15, 110, playerRef);
	Player(screen.width - 10, screen.height / 2, 15, 110, oppRef);
  }
  
  function Player(x: number, y: number, width: number, height: number, ref: any) {
	const { world }: any = { world: worldRef.current };
	const player = Bodies.rectangle(x, y, width, height, {
	  render: {
		fillStyle: '#DADADA',
	  },
	  id: 10,
	  mass: 0,
	  isStatic: true,
	});
  
	ref.current = {
	  body: player,
	  width,
      height,
	};
  
	World.add(world, [player]);
  }

  function updateGame() {
    updateEntitiesPosition();
    renderGameMessages();
  }

  function updateEntitiesPosition() {
    if (ballRef.current) {
      Matter.Body.setPosition(ballRef.current.body, {
        x: game.ball.x,
        y: game.ball.y,
      });
    }

    if (playerRef.current) {
      Matter.Body.setPosition(playerRef.current.body, {
        x: game.player1.x,
        y: game.player1.y,
      });
    }

    if (oppRef.current) {
      Matter.Body.setPosition(oppRef.current.body, {
        x: game.player2.x,
        y: game.player2.y,
      });
    }
  }

  function renderGameMessages() {
	if (ctxRef.current && game.score) {
		if (gameMsg && gameMsg.trim() !== '') {
			const textWidth = ctxRef.current.measureText(gameMsg).width;
			const textHeight = 40;
		  
			ctxRef.current.fillStyle = getGameModeColor(game.gameType).bg;
			ctxRef.current.fillRect(
			  screen.width / 2 - textWidth / 2 - 10,
			  screen.height / 2 - textHeight / 2 - 10,
			  textWidth + 20,
			  textHeight + 20,
			);
		}
		let text = gameMsg;
		ctxRef.current.font = 'bold 50px Sarpanch, Arial, sans-serif';
		ctxRef.current.fillStyle = '#DADADA';
		ctxRef.current.fillText(text, screen.width / 2 - text.length * 15, screen.height / 2 + 20);
	
		// Render player scores
		const player1ScoreText = `${game.score.player1}`;
		const player2ScoreText = `${game.score.player2}`;

		ctxRef.current.font = 'bold 50px Sarpanch, Arial, sans-serif';
		ctxRef.current.fillText(player1ScoreText, screen.width / 4, 50);
		ctxRef.current.fillText(player2ScoreText, screen.width - screen.width / 4, 50);
	}
  }

  let input: moveType = {
    room: gameID as string,
    move: {
      up: false,
      down: false,
    },
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      input.move.up = true;
    } else if (e.key === 'ArrowDown') {
      input.move.down = true;
    }
    gameSocket.emit('moveGame', input);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      input.move.up = false;
    } else if (e.key === 'ArrowDown') {
      input.move.down = false;
    }
    gameSocket.emit('moveGame', input);
  };

  function registerEventListeners() {
    Events.on(engineRef.current, 'beforeUpdate', updateGame);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      removeEventListeners();
    };
  }

  function removeEventListeners() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  }

  return (
    <div>
      <GameInfo oppInfo={oppInfo}>
        <canvas style={{ borderRadius: '15px', width: '100%', background: gameMode.bg }} ref={cvsRef}></canvas>
      </GameInfo>
    </div>
  );
}
