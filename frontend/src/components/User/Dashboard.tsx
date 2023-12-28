import api from "@/api";
import store from "@/redux/store";
import { Avatar, Button, Dialog,IconButton, Menu, MenuHandler, MenuItem, MenuList, Tooltip, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import Achiev from "./Achievements";
import MatchHistory from "./MatchHistory";
import Loading from "../Layout/Loading";
import EditProfile from "./EditProfile";
import { toast } from "react-toastify";
import chatSocket from "@/sockets/chatSocket";
import { AddFriend, BlockFriend, UnblockFriend } from "./types";

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

interface Stats {
	wins: number;
	losses: number;
	rank: string;
}

interface GameData {
	stats: Stats;
	games: Game[];
}


function getAvatarBorder(rank: string | undefined, friendStatus: string): string | undefined {
	if (friendStatus == 'Blocked')
		return "flex justify-center border border-red-500 shadow-xl shadow-red-500/40 ring-4 ring-red-500"
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
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(true);
	const [friendStatus, setFriendStatus] = useState<'Accepted' | 'Not_Friend' | 'Pending' | 'Blocked'>("Not_Friend");
	const [message, setMessage] = useState<string | null>("");
	
	useEffect(() => {
		api.get("/user/id/" + id)
			.then((res: any) => {
				if (res.status == 200) {
					setLoading(false);
					setProfile(res.data);
					res?.data?.Friends.find((friend: any) => {
						if (friend.friendId == user.id) {
							setFriendStatus(friend.status);
						}
					});
				}
			})
			.catch((err: any) => {
				setLoading(false);
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			});

		setTimeout(() => {
			api.get("/user/getStats/" + id)
				.then((res: AxiosResponse<GameData>) => {
					if (res.status == 200 && friendStatus != 'Blocked')
						setStats(res.data);
				})
				.catch((err: AxiosError<{ message: string }>) => {});
		}, 200)
	}, [id]);

	const sendMessage = (message: any) => {
		if (!message || message.message === "") return;
		chatSocket.emit("msg", {
			receiver: profile.username,
			msg: message.message,
		});
		setMessage(null);
		chatSocket.emit("reconnect");
	};

	const addUser = () => {
		const payload: AddFriend = {
			id: profile.id,
		};

		chatSocket.emit("addFriend", payload);
		chatSocket.on("addFriend", (data: any) => {
			if (data && data.status == 400) {
				toast.error(data.message, {theme: 'dark'});
				return;
			}
			if (data.status == 201) {
				setFriendStatus('Pending');
				toast.success(data.message, {theme: 'dark'});
			}
		});
	};

	const unblock = () => {
		let body: UnblockFriend = {friendID: profile.id}
		api.post('/user/unblockFriend', body)
			.then((res: any) => {
				toast.success(`${profile.username} has been Unblocked`, {theme: 'dark'})
				chatSocket.emit('recconect');
				setFriendStatus("Accepted");
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
				chatSocket.emit('reconnect');
			})
	}

	const renderProfileActions = () => {

		const block = () => {
			let body: BlockFriend = {friendID: profile.id}
			api.post('/user/blockFriend', body)
				.then((res: any) => {
					setFriendStatus("Blocked");
					chatSocket.emit("reconnect");
					toast.success(`${profile.username} has been Blocked`, {theme: 'dark'})
				})
				.catch((err: any) => {
					toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
				})
		}

		const FriendParam = () => (
			<MenuList className="bg-[#382A39] min-w-[100px] border-none hidden samwil:flex focus:outline-none rounded-[15px]">
				<div className="focus:outline-none flex flex-col justify-center m-auto">
					<Button onClick={block} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="red">Block</Button>
				</div>
			</MenuList>
		)
		
		if (profile && profile.username === user.username) {
		  return (
			<IconButton onClick={clickEdit} size="sm" className="m-2 rounded-full shadow-md bg-[#351633] hover:scale-110 border-none">
			  <i className="fa-solid fa-gear fa-xl" style={{ color: "#E1E1E1" }} />
			</IconButton>
		  );
		} else {
		  switch (friendStatus) {
			case 'Accepted':
				return (
					<Menu
					animate={{
						mount: {scale:1, y: 0 },
						unmount: {scale:0, y: -10 },
					}}
					>
						<MenuHandler>
							<IconButton size="sm" className="m-2 rounded-full shadow-md bg-[#351633] text-md hover:scale-110 border-none">
							<i className="fa-solid fa-ellipsis" style={{ color: "#E1E1E1" }}></i>
							</IconButton>
						</MenuHandler>
						{FriendParam()}
					</Menu>
				);
			case 'Not_Friend':
			  return (
				<IconButton onClick={addUser} size="sm" className="m-2 rounded-full shadow-md bg-[#351633] hover:scale-110 border-none">
				  <i className="fa-sharp fa-solid fa-user-plus pl-0.5" style={{ color: "#E1E1E1" }} />
				</IconButton>
			  );
			case 'Pending':
			  return (
				<IconButton size="sm" className="m-2 rounded-full shadow-md bg-[#351633] hover:scale-110 border-none">
				  <i className="fa-solid fa-hourglass-half" style={{ color: "#E1E1E1" }} />
				</IconButton>
			  );
			case 'Blocked':
			  return (
					<div className="pt-[75%]"/>
				)
			default:
			  return null;
		  }
		}
	  };

	const clickEdit = () => setEdit(!edit);

	if (loading) return (<Loading/>);
	
	if (!profile)
		return <Typography variant="h1" className="m-auto flex justify-center p-10 text-white">No Content</Typography>

	return (
	  <div>
		  <main className="min-h-[720px] max-w-[1200px] rounded-[15px] flex m-auto bg-[#472C45] opacity-80 mb-1">
		  	<section className="w-full samwil:w-1/4 bg-[#643461] p-3 flex-col justify-center rounded-[15px]">
				{renderProfileActions()}
			  	<div className="flex-col flex items-center justify-start gap-3 pb-4">
				  <Tooltip className="bg-[#472C45] bg-opacity-70" content={friendStatus != 'Blocked' && stats?.stats?.rank ? stats?.stats?.rank : 'Blocked'} placement="top" offset={10} animate={{mount: { scale: 1, y: 0 }, unmount: { scale: 0, y: 25 },}}>
						<Avatar src={profile.avatar} variant="rounded" size="xxl" className={getAvatarBorder(stats?.stats?.rank || 'Unranked', friendStatus)}/>
				  </Tooltip>
					<Typography variant="h3" className="flex justify-center text-white font-bold">{profile.username}</Typography>
					<Typography className="flex justify-center text-[18px] text-gray-400">{friendStatus != 'Blocked' && profile.email}</Typography>
				</div>
				{friendStatus != 'Blocked' ?
					<>
						<hr className="mx-5 rounded-full opacity-75 border-[1px] mb-3"/>
						<Typography className="flex justify-center text-[24px] text-white font-normal">Achievements</Typography>
						<Achiev stats={stats}/>
					</>
					:
					<Button onClick={unblock} variant="gradient" color="red" className="flex mx-auto justify-center">Unblock</Button>
				}
		  	</section>
			<section className="container hidden samwil:flex flex-col w-3/4 p-3 max-h-[720px] overflow-auto">
				{friendStatus != 'Blocked' &&
					<>
						<Typography variant="h3" className="text-gray-200 p-4">Match History
						<hr className="rounded-full border-2 border-gray-200 w-[25%]"/>
						</Typography>
						{stats?.games && <MatchHistory games={stats?.games} p1={profile}/>}
					</>
				}
			</section>
		  </main>
		  {edit && <EditProfile user={user}/>}
	  </div>
	);
}

export default Dashboard;