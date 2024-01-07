import api from '@/api';
import store from '@/redux/store';
import { MenuList, Button, Dialog, DialogBody, Typography, Input } from '@material-tailwind/react'
import { channel } from 'diagnostics_channel'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { MakeAdminDto, UserMuteDto } from './types';

const MemberManage = ({member, channel} : {member: any, channel: any}) => {
	const [isMuted, setIsMuted] = useState<boolean>(false);

	useEffect(() => {
		setIsMuted(member.isMuted);
	}, [member]);

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			setIsMuted(member.isMuted);
		});

		return unsubscribe;
	}, [channel]);

	function kick(member: any) {
		// api.post(`/user/kickFromChannel`)
	}

	function ban() {

	}

	const handleMute = () => {
		let body: UserMuteDto = {
			userID: member.id,
			channelID: channel.id,
		};
		api.post('/user/muteUser', body)
			.then((res: any) => {
				toast.success(`${member.username} was Muted for 5 mins`, {theme: 'dark'});
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			});
	};

	const makeAdmin = () => {
		let body: MakeAdminDto = {
			userID: member.id,
			channelID: channel.id,
		};
		api.post('/user/makeAdmin', body)
		.then((res: any) => {
			toast.success(`${member.username} was made admin`, {theme: 'dark'});
		})
		.catch((err: any) => {
			toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
		})
	}
	
  return (
	<MenuList className="bg-[#382A39] z-[99999] border-none hidden samwil:flex focus:outline-none rounded-[15px]">
		<ToastContainer className="z-[999999]"/>
		<div className="focus:outline-none flex flex-col gap-y-2 justify-center m-auto">
			{!channel.adminsIds.includes(member.id) && <Button onClick={makeAdmin} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="pink">MAKE ADMIN</Button>}
			<Button onClick={handleMute} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">MUTE</Button>
			<Button onClick={() => kick(member)} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">KICK</Button>
			<Button onClick={() => ban} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="red">BAN</Button>
		</div>
	</MenuList>
  )
}

export default MemberManage