import api from '@/api';
import store from '@/redux/store';
import { MenuList, Button, Dialog, DialogBody, Typography, Input } from '@material-tailwind/react'
import { channel } from 'diagnostics_channel'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { MakeAdminDto, UserMuteDto, KickUserDto } from './types';

const MemberManage = ({member, channel} : {member: any, channel: any}) => {
	const [isBanned, setIsBanned] = useState(false);

	useEffect(() => {
		api.get(`/user/isBanned/${member.id}/${channel.id}`)
			.then((res: any) => {
				setIsBanned(res.data);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			})
	}, [isBanned])

	const kick = async () => {
		let body: KickUserDto = {
			userID: member.id,
			channelID: channel.id,
		};
		api.post('/user/kickUser', body)
			.then((res: any) => {
				toast.success(`${member.username} was kicked`, {theme: 'dark'});
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			});
	}

	const ban = () => {
		api.post('/user/banUser', {
			userID: member.id,
			channelID: channel.id,
		})
			.then((res: any) => {
				toast.success(`${member.username} was banned`, {theme: 'dark'});
				setIsBanned(true);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			})
	}

	const unban = () => {
		api.post('/user/unbanUser', {
			userID: member.id,
			channelID: channel.id,
		})
			.then((res: any) => {
				toast.success(`${member.username} was unbanned`, {theme: 'dark'});
				setIsBanned(false);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data.message ?? "An Error Occurred!", { theme: "dark" });
			})
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
			{(!channel.adminsIds.includes(member.id) && !isBanned) && <Button onClick={makeAdmin} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="pink">MAKE ADMIN</Button>}
			{!isBanned && <Button onClick={handleMute} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">MUTE</Button>}
			{!isBanned && <Button onClick={kick} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">KICK</Button>}
			{!isBanned && <Button onClick={ban} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="red">BAN</Button>}
			{isBanned && <Button onClick={unban} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="red">UNBAN</Button>}
		</div>
	</MenuList>
  )
}

export default MemberManage