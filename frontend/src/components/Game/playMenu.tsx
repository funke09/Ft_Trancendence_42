import React, { useState } from "react";
import {
  Dialog,
  Typography,
  Card,
  List,
  ListItem,
  DialogBody,
  DialogHeader,
  Button,
  Input,
  Alert,
} from "@material-tailwind/react";
import Image from "next/image";
import QueueModal from "./findGame";
import api from "@/api";
 
export function PlayModal() {

	const [selected, setSelected] = useState(1);
	const setSelectedItem = (value: number) => setSelected(value);

	const [username, setUsername] = useState("");
	const onChange = ({ target }: any) => setUsername(target.value);

	const [isFindGame, setIsFindGame] = useState(false);
	const [isInvite, setIsInvite] = useState(false);

	  const handleCancelMatchmaking = () => {
		setIsFindGame(false);
		setIsInvite(false);
	  };
	const handleOpen = () => setIsFindGame(!isFindGame);
	const handleInvOpen = () => setIsInvite(!isInvite);

	function clickFindGame() {
		setIsFindGame(!isFindGame);
	}

	function clickInvite() {
		useEffect(() => {
			api.getUri('/user/findUser')
		})
		setIsInvite(!isInvite);
	}
 
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
			<div className="m-auto my-2 relative flex flex-col w-full max-w-[24rem]">
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