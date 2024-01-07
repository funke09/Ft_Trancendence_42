import React, { useEffect, useState } from "react";
import {
  Dialog,
  Typography,
  List,
  ListItem,
  Button,
  Input,
} from "@material-tailwind/react";
import Image from "next/image";
import QueueModal from "./findGame";
import api from "@/api";
import store, { setOpp } from "@/redux/store";
import { useRouter } from "next/router";
import gameSocket from "@/sockets/gameSocket";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
 
export function PlayModal() {
	const [selected, setSelected] = useState(1);
	const setSelectedItem = (value: number) => setSelected(value);

	const [username, setUsername] = useState("");
	const onChange = ({ target }: any) => setUsername(target.value);

	const [isFindGame, setIsFindGame] = useState(false);
	const [isInvite, setIsInvite] = useState(false);

	const handleCancel = () => {
		setIsFindGame(false);
		setIsInvite(false);
		gameSocket.emit("cancelGame", { msg: "cancel" });
		gameSocket.emit("cancelInvGame", { username: username});
	
	};
	
	const handleOpen = () => setIsFindGame(!isFindGame);
	const handleInvOpen = () => setIsInvite(!isInvite);

	const currentUser = useSelector((state: any) => state.profile.user);

	const clickFindGame = () => {
		gameSocket.emit("createGame", { gameType: selected });
		setIsFindGame(!isFindGame);
	}

	function clickInvite() {
		api.get(`user/${username}`)
		.then((res: any) => {
			if (!res.data || res.data.id == currentUser.id || res.data.userStatus != "Online") {
				setIsInvite(false);	
			}
		})
		.catch((err: any) => {
			toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
		})
		setIsInvite(true);
		gameSocket.emit('invGame', {
			username: username,
			gameType: selected,
		});
	};

	const router = useRouter();
		
	useEffect(() => {
		gameSocket.on("match", (data) => {
		  store.dispatch(setOpp(data));
		  router.push(`/game/${data.roomName}`);
		});
	
		gameSocket.on("cancelGame", () => {
		  setIsFindGame(false);
		  setIsInvite(false);
		});
	
		gameSocket.on("invite-canceled", () => {
		  setIsInvite(false);
		});
	
		return () => {
		  gameSocket.off("match");
		  gameSocket.off("cancelGame");
		  gameSocket.off("invite-canceled");
		};
	}, []);
	
	return (
		<div className="flex-col justify-center m-auto p-6">
			<Typography color="white" className="m-auto text-2xl p-2 font-bold flex justify-center">Chose a Mode</Typography>
			<hr className="m-auto max-w-[220px] border-1 opacity-70 rounded-full"/>
			<List className="m-auto pt-8 gap-8 flex-row justify-between">
				<ListItem className="flex-col rounded-xl hover:text-[#382A39] text-[#B3B3B3] active:text-[#382A39] gap-y-2" selected={selected === 1} onClick={() => setSelectedItem(1)}>
					<Image
						src="/images/classicPrev.svg"
						alt="classic"
						width={200}
						height={100}
						className="shadow-sm"
					/>
					<Typography variant="h5" className="font-bold opacity-80">CLASSIC</Typography>
				</ListItem>
				<ListItem className="flex-col rounded-xl hover:text-[#382A39] text-[#B3B3B3] active:text-[#382A39] gap-y-2" selected={selected === 2} onClick={() => setSelectedItem(2)}>
					<Image
						src="/images/mediumPrev.svg"
						alt="medium"
						width={200}
						height={100}
						className="shadow-sm"
					/>
					<Typography variant="h5" className="font-bold opacity-80">MEDIUM</Typography>
				</ListItem>
				<ListItem className="flex-col rounded-xl hover:text-[#382A39] text-[#B3B3B3] active:text-[#382A39] gap-y-2" selected={selected === 3} onClick={() => setSelectedItem(3)}>
					<Image
						src="/images/hardcorePrev.svg"
						alt="hardcore"
						width={200}
						height={100}
						className="shadow-sm"
					/>
					<Typography variant="h5" className="font-bold opacity-80">HARDCORE</Typography>
				</ListItem>
			</List>
			<Typography color="white" className="text-2xl m-auto mt-7 p-2 font-bold flex justify-center">Play</Typography>
			<hr className="m-auto max-w-[150px] border-1 opacity-70 rounded-full"/>
			<Typography color="white" className="text-[16px] m-auto opacity-70 pt-6 font-bold flex justify-center">Invite Friend</Typography>
			<div className="m-auto my-3 relative flex flex-col w-full max-w-[24rem]">
				<Input
					type="text"
					label="Friend Username"
					value={username}
					onChange={onChange}
					className="pr-20 "
					color="white"
					containerProps={{
					className: "min-w-0",
					}} crossOrigin={undefined}/>
				<Button
					size="sm"
					color={username ? "green" : "gray"}
					disabled={!username || username === currentUser.username}
					className="!absolute right-1 top-1 rounded"
					onClick={clickInvite}
				>
				Invite
				</Button>
			</div>
			<Typography color="white" className="text-[16px] m-auto opacity-70 pt-6 font-bold flex justify-center">Matchmaking</Typography>
			<Button 
				size="lg"
				color="pink"
				onClick={clickFindGame}
				className="flex justify-center m-auto my-2 hover:scale-110 hover:shadow-md hover:opacity-100 duration-200">
				FIND GAME
			</Button>
			{ isFindGame && 
				<Dialog size="xs" className="bg-[#382A39] p-5 rounded-[30px]" open={isFindGame} handler={handleOpen}>
						{<QueueModal type={"normal"} onCancel={handleCancel}/>}
				</Dialog>
			}
			{ isInvite && 
				<Dialog size="xs" className="bg-[#382A39] p-5 rounded-[30px]" open={isInvite} handler={handleInvOpen}>
					<QueueModal type={"invite"} onCancel={handleCancel}/>
				</Dialog>
			}
		<ToastContainer/>
	</div>
  );
}