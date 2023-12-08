import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import gameApi from "./gameApi";
import store, { setGameState, setSocket } from "@/redux/store";

const SocketComp = () => {
	const [onlineGame, setOnlineGame] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (!gameApi.connected)
				gameApi.connect();
			else
				setOnlineGame(true);
		}, 1000);
	}, [onlineGame]);

	useEffect(() => {
		store.dispatch(setSocket(gameApi));

		gameApi.on("GAME-STATE", (gameState: any) => {
			store.dispatch(setGameState(gameState));
		});

		gameApi.on("END-GAME", () => {
			setTimeout(() => {
				router.push("/");
			}, 2000);
		});

		return () => {
			gameApi.disconnect();
		};
	}, []);

	return <></>;
};

export default SocketComp;