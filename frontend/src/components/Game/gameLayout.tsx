import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import gameSocket from '@/sockets/gameSocket';
import store from '@/redux/store';
import { GameInfo } from './gameInfo';
import { oppType, Game } from './types';

const screen: { width: number; height: number } = { width: 700, height: 300 };

let game: Game = {
  ball: { x: 0, y: 0 },
  player1: { x: 0, y: 0 },
  player2: { x: 0, y: 0 },
  score: { player1: 0, player2: 0 },
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
  const [gameMode, setGameMode] = useState<{ bg: string }>({ bg: '#443346' });

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

  useEffect(() => {
    const handleGameState = (data: any) => {
      game = data;
      setScore(game.score);
    };

    const handleGameMsg = (data: any) => {
      gameMsg = data;
    };

    gameSocket.on('gameState', handleGameState);
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
    };

    return () => {
      gameMsg = '';
      gameSocket.emit('leftGame', { room: gameID });
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

    Render.run(render);
    Runner.run(runner, engine);

    engineRef.current = engine;
    runnerRef.current = runner;
    worldRef.current = world;
  }

  function createBall() {
    const { world }: any = { world: worldRef.current };
    const ball = Bodies.circle(350, 150, 15, {
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
    Player(10, screen.height / 2, 15, 100, playerRef);
    Player(screen.width - 10, screen.height / 2, 15, 100, oppRef);
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
      let text = gameMsg;
      ctxRef.current.font = 'bold 50px arial';
      ctxRef.current.fillStyle = '#DADADA';
      ctxRef.current.fillText(text, screen.width / 2 - text.length * 18, screen.height / 2 + 30);
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
    gameSocket.emit('move', input);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      input.move.up = false;
    } else if (e.key === 'ArrowDown') {
      input.move.down = false;
    }
    gameSocket.emit('move', input);
  };

  function registerEventListeners() {
    Events.on(engineRef.current, 'preUpdate', updateGame);

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
      <GameInfo score={score} player1={game.player1} player2={game.player2} oppInfo={oppInfo} result={'0 - 0'}>
        <canvas style={{ borderRadius: '15px', width: '100%', background: gameMode.bg }} ref={cvsRef}></canvas>
      </GameInfo>
    </div>
  );
}
