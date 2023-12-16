import { GameLayout } from "@/components/Game/gameLayout";
import Loading from "@/components/Layout/Loading";
import { useRouter } from "next/router";

export default function Game() {
	const router = useRouter();
	const { gameID } = router.query;

	if (!gameID) return <Loading/>;

	return <GameLayout gameID={gameID} />
}