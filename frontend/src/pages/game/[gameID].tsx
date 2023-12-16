import Loading from "@/components/Layout/Loading";
import { Nav } from "@/components/Layout/NavBar";
import { useRouter } from "next/router";

export default function Game() {
	const router = useRouter();
	const { gameID } = router.query;

	if (!gameID) return <Loading/>;

	return(
		<>
			<Nav/>
			{/* <GameLayout gameID={gameID} /> */}
		</>
	);
}