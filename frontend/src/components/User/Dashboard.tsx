import api from "@/api";
import Loading from "@/components/Layout/Loading";
import { Nav } from "@/components/Layout/NavBar";
import store, { setProfile } from "@/redux/store";
import { Avatar, Card, IconButton, List, ListItem, ListItemPrefix, Tooltip, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AxiosError, AxiosResponse } from "axios";

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

function getAvatarBorder(rank: string): string | undefined {
	if (rank === "Bronze")
		return "flex justify-center border border-[#CD7F32] shadow-xl shadow-[#CD7F32]/40 ring-4 ring-[#CD7F32]"
	/// ...
}

function Dashboard({ id }: {id: string}) {
	const user = store.getState().profile.user;
	const [currUser, setCurrUser] = useState<any>(null);
	const [stats, setStats] = useState<any>(null);
	const [error, setError] = useState(false);

    useEffect(() => {
        api.get("/user/id/" + id)
            .then((res: any) => {
                if (res.status == 200) {
                    setCurrUser(res.data);
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

	if (!currUser) return <></>


	return (
	  <div>
		  <main className="min-h-[720px] max-w-[1200px] rounded-[15px] flex m-auto bg-[#472C45] opacity-80">
		  	<section className="w-1/4 bg-[#643461] p-3 flex-col justify-center rounded-[15px]">
				<IconButton size="sm" className="m-2 rounded-full shadow-md bg-[#351633] hover:scale-110 border-none">
					<i className="fa-solid fa-gear fa-xl" style={{ color: "#E1E1E1" }} />
				</IconButton>
			  	<div className="flex-col flex items-center justify-start gap-3 pb-4">
					<Avatar src={user.avatar} variant="rounded" size="xxl" className={getAvatarBorder(stats?.stats.rank)}/>
					<Typography variant="h3" className="flex justify-center text-white font-bold">{user.username}</Typography>
					<Typography className="flex justify-center text-[18px] text-gray-400">{user.email}</Typography>
				</div>
				<hr className="mx-5 rounded-full opacity-75 border-[1px] mb-3"/>
				<Typography className="flex justify-center text-[24px] text-white font-normal">Achievements</Typography>
				<Card className="container rounded-[15px] bg-[#472C45] min-h-[300px] mt-2">
					<List>
						<Tooltip content="Achievenet Description" placement="right" animate={{mount: { scale: 1, x: 0 }, unmount: { scale: 0, x: -25 },}}>
							<ListItem>
								<ListItemPrefix>
									<Image src={'/'} width={30} height={30} alt="icon of achievment"/>
								</ListItemPrefix>
								<Typography variant="h6" className="text-white ">Name of Achievement</Typography>
							</ListItem>
						</Tooltip>
						<Tooltip content="Achievemet Description" placement="right" animate={{mount: { scale: 1, x: 0 }, unmount: { scale: 0, x: -25 },}}>
							<ListItem disabled={true}>
								<ListItemPrefix>
									<Image src={'/'} width={30} height={30} alt="icon of achievment"/>
								</ListItemPrefix>
								<Typography variant="h6" className="text-white ">Name of Achievement</Typography>
							</ListItem>
						</Tooltip>
					</List>
				</Card>
		  	</section>
		  </main>
			
	  </div>
	);
  }
	export default Dashboard;