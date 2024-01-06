import chat from '@/pages/chat';
import chatSocket from '@/sockets/chatSocket';
import { Badge, Typography, Card, List, IconButton, Button } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import Loading from '../Layout/Loading';
import ChannelMembers from './ChannelMembers';
import api from '@/api';
import { toast } from 'react-toastify';
import { LeaveChannelDto } from './types';
import store, { setCurrentChatGroup } from '@/redux/store';

const ChannelInfo = ({chat, channelAvatar, manager} : {chat: any, channelAvatar: string, manager: boolean}) => {
	const [loading, setLoading] = useState(false);
	const [members, setMembers] = useState<any>([]);
	const [admins, setAdmins] = useState<any>([]);
	const [owner, setOwner] = useState<any>(null);
	const [refresh, setRefresh] = useState<boolean>(false);

	useEffect(() => {
		getMembers();
		chatSocket.emit('reconnect');

		return () => {}
	}, [refresh])

	function getMembers() {
		api.get(`/user/channelMembers/${chat.id}`)
			.then((res: any) => {
				setMembers([...res.data]);
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	function leaveChannel() {
		let body: LeaveChannelDto = {
			channelID: chat.id,
		};
		api.post('/user/leaveChannel', body)
			.then((res: any) => {
				toast.success(`You left ${chat.name}`, {theme: 'dark'});
				chatSocket.emit('reconnect');
				store.dispatch(setCurrentChatGroup(null));
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	function removeChannel() {
		api.post(`/user/removeChannel/${chat.id}`)
			.then(() => {
				toast.success(`${chat.name} was Deleted`, {theme: 'dark'});
				chatSocket.emit('reconnect');
				store.dispatch(setCurrentChatGroup(null));
			})
			.catch((err: any) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			})
	}

	return (
		<div className='flex flex-col items-center w-full my-5 gap-y-2'>
			<Badge className='bg-white/10' placement='bottom-end' content={
				<i className={`fa-solid ${
					chat.type === 'protected' ? 'fa-lock' :
					chat.type === 'private' ? 'fa-eye-slash' :
					chat.type === 'public' ? 'fa-globe' : ''
				}`} />
			}>
				<img src={channelAvatar} width={100} height={100} alt='channel' className='rounded-full'/>
			</Badge>
			<Typography variant='h3' color='white'>{chat?.name}</Typography>
			<Card className="rounded-[15px] bg-[#472C45] w-[58%] h-[300px] mt-2">
				{loading ? <Loading/> :
					<List className='notif overflow-y-auto max-h-[300px]'>
						<Typography variant='h5' className='text-white/50 text-center' >Members</Typography>
						<hr className='m-auto w-32 rounded-full opacity-30'/>	
						<ChannelMembers manager={manager} members={members} channel={chat}/>
					</List>
				}
				{manager &&
					<div className="absolute bottom-12 right-8 z-[20] transition-all duration-300 hover:rotate-180">
						<IconButton color="pink" className="rounded-full">
							<i className="fa-solid fa-plus fa-lg"/>
						</IconButton>	
					</div>
				}
			</Card>
			<div className='flex flex-row w-[75%] justify-around items-center mt-2'>
				<Button onClick={leaveChannel} color='red' variant='text' className='flex flex-row text-[16px] transition-all bg-red-500/10 hover:bg-red-500/20 justify-between items-center gap-x-2'>
					<i className="fa-solid fa-arrow-right-from-bracket"/>
					<h1>Leave</h1>
				</Button>
				{store.getState().profile.user.id === chat.ownerId &&
				<Button onClick={removeChannel} color='red' variant='text' className='flex flex-row text-[16px] transition-all bg-red-500/10 hover:bg-red-500/20 justify-between items-center gap-x-2'>
					<i className="fa-solid fa-trash"/>
					<h1>Remove</h1>
				</Button>
				}
			</div>
		</div>
	)
}

export default ChannelInfo