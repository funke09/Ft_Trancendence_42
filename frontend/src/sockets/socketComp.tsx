import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import gameSocket from "./gameSocket";
import store, { setGame, setSocket } from "@/redux/store";
import { AchievDto, RankDto } from "./types";

const SocketComp = () => {
	const [connectedGame, setConnectedGame] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (!gameSocket.connected)
				gameSocket.connect();
			else
				setConnectedGame(!connectedGame);
		}, 1000);
	}, [connectedGame]);

	useEffect(() => {
		store.dispatch(setSocket(gameSocket));

		gameSocket.on("gameState", (game: any) => {
			store.dispatch(setGame(game));
		});

		gameSocket.on("error", (err: string) => {
			console.error("error", err)
		});

		gameSocket.on("achievement", (data: AchievDto) => {
			console.log(data);
        });

		gameSocket.on("rank", (data: RankDto) => {
			console.log(data);
		})
		
		gameSocket.on("endGame", () => {
			setTimeout(() => {
				router.push('/profile');
			}, 2000);
		});
		
		gameSocket.on("connect", () => {
		console.log("/game: Connected to server");
		})

		gameSocket.on("disconnect", () => {
			console.log("/game: Disconnected from server");
		})

		return () => {
			gameSocket.disconnect();
		};
	}, [gameSocket]);

	return <></>;
};

export default SocketComp;