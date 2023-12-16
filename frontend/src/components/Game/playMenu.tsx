import React, { useState } from "react";
import {
  Dialog,
  Typography,
  List,
  ListItem,
  Button,
  Input,
  Alert,
} from "@material-tailwind/react";
import Image from "next/image";
import QueueModal from "./findGame";
import api from "@/api";
import store from "@/redux/store";
 
export function PlayModal() {
	const [selected, setSelected] = useState(1);
	const setSelectedItem = (value: number) => setSelected(value);

	const [username, setUsername] = useState("");
	const onChange = ({ target }: any) => setUsername(target.value);

	const [isFindGame, setIsFindGame] = useState(false);
	const [isInvite, setIsInvite] = useState(false);
	const [isAlert, setIsAlert] = useState(true);

	  const handleCancelMatchmaking = () => {
		setIsFindGame(false);
		setIsInvite(false);
	  };
	const handleOpen = () => setIsFindGame(!isFindGame);
	const handleInvOpen = () => setIsInvite(!isInvite);

	const currentUser = store.getState().profile.user;

	function clickFindGame() {
		setIsFindGame(!isFindGame);
	}


	function clickInvite() {
		return (
			api.get(`user/${username}`)
				.then((res: any) => {
					if (!res.data || res.data.id == currentUser.id) {
						setIsInvite(false);
						setIsAlert(false);
					} else {
						setIsInvite(true);
					}
				})
		);
	};

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
			{!isAlert &&
				<Alert onClose={() => setIsAlert(!isAlert)} variant="gradient" className="!max-w-sm flex-row m-auto bg-gradient-to-tr from-red-800 to-red-600">
					<div className="m-auto flex gap-2 justify-center opacity-85">
						<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#EDEDED"
						className="h-6 w-6"
						>
						<path
							fillRule="evenodd"
							d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
							clipRule="evenodd"
							/>
						</svg>
						<Typography variant="h6">Sorry, this username does not exist</Typography>
					</div>
				</Alert>
			}
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
					color={username ? "gray" : "gray"}
					disabled={!username}
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
				<Dialog size="sm" className="bg-[#382A39] p-5 rounded-[30px]" open={isFindGame} handler={handleOpen}>
						{<QueueModal type={"normal"} onCancel={handleCancelMatchmaking}/>}
				</Dialog>
			}
			{ isInvite && 
				<Dialog size="sm" className="bg-[#382A39] p-5 rounded-[30px]" open={isInvite} handler={handleInvOpen}>
					{<QueueModal type={"invite"} onCancel={handleCancelMatchmaking}/>}
				</Dialog>
			}
	</div>
  );
}