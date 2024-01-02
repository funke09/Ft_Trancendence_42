import api from "@/api";
import { Chip, List, ListItem, Tooltip, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from 'date-fns';
import Link from "next/link";
import Loading from "../Layout/Loading";
import { toast } from "react-toastify";

interface Game {
	id: number;
	outcome: "WIN" | "LOSE";
	p1Score: number;
	p2Score: number;
	p2Id: number;
	gameType: string;
	userId: number;
	createdAt: number;
}

interface MatchHistoryProps {
	games: Game[] | null;
	p1: any;
  }
  
function MatchHistory({ games, p1 }: MatchHistoryProps) {
	if (!games) return <></>;
  
	return (
	  <div className="container flex flex-col items-center justify-center p-3">
		{games.map((game) => {
		  const chipColor = game.outcome === "WIN" ? "green" : "red";
		  const [opp, setOpp] = useState<any>();
		  const [loading, setLoading] = useState(true);
  
		  useEffect(() => {
			api.get("user/toto/" + game.p2Id)
			  .then((res: any) => {
				if (res.status == 200) {
					setOpp(res.data);
					setLoading(false);
				}
			  })
			  .catch((error) => {});
		}, [game.p2Id]);
  
		let score = game.p1Score.toString() + " : " + game.p2Score.toString();
		  
		if (loading) return <Loading key={game.id} />;

		if (!opp) return <div key={game.id}></div>;
		
		return (
			<Tooltip
				content=
				{<div className="flex flex-col items-center">
				<Typography variant="h6">
					{game.gameType.toUpperCase()}
				</Typography>
				<Typography>
					{format(new Date(game.createdAt), 'yyyy-MM-dd HH:mm')}
				</Typography>
				</div>}
				className="bg-[#2e1b2d]" key={game.id}>
			  <List key={game.id} className="w-[85%] bg-[#643461] rounded-[30px] shadow-lg relative mx-auto my-4 transition-all hover:bg-[#965792] hover:bg-opacity-80">
				<div className="flex flex-row mx-2 p-1 gap-6 justify-between items-center">
				  <div className="flex flex-row items-center gap-4">
					<Image
					  src={p1.avatar}
					  alt="p1"
					  width={50}
					  height={50}
					  className="rounded-full h-[50px] w-[50px] bg-white flex justify-center items-center shadow-md"
					/>
					<Typography className="font-semibold Manrope text-[24px] text-white flex-shrink-0">{p1.username}</Typography>
				  </div>
				  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				  	<Chip variant="gradient" value={score} color={chipColor} size="lg" className="rounded-[50px] flex shadow-md justify-center text-[18px]" />
				  </div>
				  <div className="flex flex-row items-center gap-4">
					<Typography className="font-semibold Manrope text-[24px] text-white flex-shrink-0">{opp?.username}</Typography>
					<Link href={"/profile/" + game.p2Id}>
						<Image
						src={opp?.avatar}
						alt="p2"
						width={50}
						height={50}
						className="rounded-full h-[50px] w-[50px] bg-white flex justify-center items-center shadow-md"
						/>
					</Link>
				  </div>
				</div>
			  </List>
			</Tooltip>
		  );
		})}
	  </div>
	);
}

export default MatchHistory;