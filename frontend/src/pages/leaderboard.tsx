import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import { Card, Typography } from "@material-tailwind/react";
import Loading from "@/components/Layout/Loading";
import api from "@/api";
import store, { setProfile } from "@/redux/store";

const TABLE_HEAD = ["Rank", "Player", "Wins"];
 
const TABLE_ROWS = [
  {
	rank: "1",
	player: "Player 1",
	wins: "15",
  },
  {
	rank: "2",
	player: "Player 2",
	wins: "10",
  },
  {
	rank: "3",
	player: "Player 3",
	wins: "8",
  },
  {
	rank: "4",
	player: "Player 4",
	wins: "6",
  },
  {
	rank: "5",
	player: "Player 5",
	wins: "2",
  },
];

const Leaderboard: React.FC = () => {
	const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                    setLoading(false);
                } else {
                    window.location.href = "/";
                }
            })
            .catch((err: any) => {
                window.location.href = "/login";
            });
    }, []);

	if (loading) {
		return(<Loading/>);
	}
	return (
		<>
		<Nav/>
		<Card className="h-full max-w-[1200px] m-auto overflow-scroll rounded-md">
		  <table className="w-full min-w-max table-auto text-left">
			<thead>
			  <tr>
				{TABLE_HEAD.map((head) => (
				  <th
					key={head}
					className="bg-[#472C45] p-4"
				  >
					<Typography
					  variant="small"
					  color="white"
					  className="font-normal leading-none opacity-70"
					>
					  {head}
					</Typography>
				  </th>
				))}
			  </tr>
			</thead>
			<tbody>
			  {TABLE_ROWS.map(({ rank, player, wins }, index) => {
				const isLast = index === TABLE_ROWS.length - 1;
				const classes = isLast ? "bg-[#652F5B] p-4" : "bg-[#652F5B] p-4 border-b border-white-50";
	 
				return (
				  <tr key={rank}>
					<td className={classes}>
					  <Typography
						variant="small"
						color="white"
						className="font-normal"
					  >
						{rank}
					  </Typography>
					</td>
					<td className={classes}>
					  <Typography
						variant="small"
						color="white"
						className="font-normal"
					  >
						{player}
					  </Typography>
					</td>
					<td className={classes}>
					  <Typography
						variant="small"
						color="white"
						className="font-normal"
					  >
						{wins}
					  </Typography>
					</td>
				  </tr>
				);
			  })}
			</tbody>
		  </table>
		</Card>
	</>
	);
}

export default Leaderboard;