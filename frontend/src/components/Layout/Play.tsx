import gameApi from "@/api/gameApi";
import store, { setOpp } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function Play() {
	const router = useRouter();

	const join = () => {
		gameApi.emit("JOIN", { msg: "JOIN"});
	};

	useEffect(() => {
		const handleMatch = (data: any) => {
		  store.dispatch(setOpp(data));
		  router.push(`/game/${data.lobbyName}`);
		};
	  
		gameApi.on("match", handleMatch);
	  
		return () => {
		  gameApi.off("match", handleMatch);
		};
	  }, []);

	return (
		<button onClick={join} className="pink-button ">PLAY NOW!</button>
	);
}