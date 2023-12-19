import api from "@/api";
import Loading from "@/components/Layout/Loading";
import { Nav } from "@/components/Layout/NavBar";
import store, { setProfile } from "@/redux/store";
import { Avatar, Card, IconButton, List, ListItem, ListItemPrefix, Tooltip, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AxiosError, AxiosResponse } from "axios";
import Achiev from "./Achievements";

interface Game {
	id: number;
	outcome: "WIN" | "LOSE";
	p1Score: number;
	p2Score: number;
	p2Id: number;
	gameType: string;
	userId: number;
}

interface Stats {
	wins: number;
	losses: number;
	rank: string;
}

interface GameData {
	stats: Stats;
	games: Game[];
}

function getAvatarBorder(rank: string | undefined): string | undefined {
	if (rank === "Bronze")
		return "flex justify-center border border-[#CD7F32] shadow-xl shadow-[#CD7F32]/40 ring-4 ring-[#CD7F32]"
	else if (rank === "Silver")
		return "flex justify-center border border-[#C0C0C0] shadow-xl shadow-[#C0C0C0]/40 ring-4 ring-[#C0C0C0]"
	else if (rank === "Gold")
		return "flex justify-center border border-[#CD7F32] shadow-xl shadow-[#CD7F32]/40 ring-4 ring-[#CD7F32]"
	else if (rank === "Platinum")
		return "flex justify-center border border-[#40E0D0] shadow-xl shadow-[#40E0D0]/40 ring-4 ring-[#40E0D0]"
	else if (rank === "Diamond")
		return "flex justify-center border border-[#b9f2ff] shadow-xl shadow-[#b9f2ff]/40 ring-4 ring-[#b9f2ff]"
	else
		return "flex justify-center border border-[#D9D9D9] shadow-xl shadow-[#D9D9D9]/40 ring-4 ring-[#D9D9D9]"

}

function Dashboard({ id }: {id: string}) {
	const user = store.getState().profile.user;
	const [profile, setProfile] = useState<any>(null);
	const [stats, setStats] = useState<any>(null);
	const [error, setError] = useState(false);

    useEffect(() => {
        api.get("/user/id/" + id)
            .then((res: any) => {
                if (res.status == 200) {
                    setProfile(res.data);
                }
            })
            .catch((err: any) => {
                setError(true);
            });
        api.get("/user/getStats/" + id)
            .then((res: AxiosResponse<GameData>) => {
                setStats(res.data);
            })
            .catch((err: AxiosError<{ message: string }>) => {});
    }, []);

	if (!profile) return <></>

	return (
	  <div>
		  <main className="min-h-[720px] max-w-[1200px] rounded-[15px] flex m-auto bg-[#472C45] opacity-80">
		  	<section className="w-full smool:w-1/4 bg-[#643461] p-3 flex-col justify-center rounded-[15px]">
				{profile && profile.username == user.username ?
				<IconButton size="sm" className="m-2 rounded-full shadow-md bg-[#351633] hover:scale-110 border-none">
					<i className="fa-solid fa-gear fa-xl" style={{ color: "#E1E1E1" }} />
				</IconButton>
				:
				<IconButton size="sm" className="m-2 rounded-full shadow-md bg-[#351633] hover:scale-110 border-none">
					<i className="fa-sharp fa-solid fa-user-plus pl-0.5" style={{ color: "#E1E1E1" }} />
				</IconButton>
				}
			  	<div className="flex-col flex items-center justify-start gap-3 pb-4">
				  <Tooltip className="bg-[#472C45] bg-opacity-70" content={stats?.stats?.rank} placement="top" offset={10} animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
						<Avatar src={profile.avatar} variant="rounded" size="xxl" className={getAvatarBorder(stats?.stats?.rank)}/>
				  </Tooltip>
					<Typography variant="h3" className="flex justify-center text-white font-bold">{profile.username}</Typography>
					<Typography className="flex justify-center text-[18px] text-gray-400">{profile.email}</Typography>
				</div>
				<hr className="mx-5 rounded-full opacity-75 border-[1px] mb-3"/>
				<Typography className="flex justify-center text-[24px] text-white font-normal">Achievements</Typography>
				<Achiev stats={stats}/>
		  	</section>
			<section>
				{/*MATCH HISTORY*/}
			</section>
		  </main>
	  </div>
	);
}

export default Dashboard;