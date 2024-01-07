import chat from '@/pages/chat';
import chatSocket from '@/sockets/chatSocket';
import { Badge, Typography, Card, List, IconButton, Button, Dialog, DialogBody, Input } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import Loading from '../Layout/Loading';
import ChannelMembers from './ChannelMembers';
import api from '@/api'; 
import { toast } from 'react-toastify';
import { LeaveChannelDto, addChannelMemberDto} from './types';
import store, { setCurrentChatGroup } from '@/redux/store';

const ChangeChannelPasswordDialog = ({ show, onClose, channelId }: { show: boolean; onClose: () => void; channelId: string }) => {
	const [password, setPassword] = useState('');
   
	const handleChangePassword = async () => {
	  try {
		const res = await api.post('/channel/changePassword', { channelId, password });
		if (res.status === 200) {
		  toast.success('Password changed successfully', { theme: 'dark' });
		  onClose(); // Close the dialog
		}
	  } catch (error: any) {
		toast.error(error?.response?.data?.messages?.toString(), { theme: 'dark' });
	  }
	};
   
	if (!show) return null;
   
	return (   
	  <Dialog open={show} handler={onClose}>
		<DialogBody>
		  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" crossOrigin={undefined} />
		  <Button onClick={handleChangePassword}>Change Password</Button>
		</DialogBody>
	  </Dialog>
	);
   };
   

const ChannelInfo = ({chat, channelAvatar, manager} : {chat: any, channelAvatar: string, manager: boolean}) => {
	const [loading, setLoading] = useState(false);
	const [members, setMembers] = useState<any>([]);
	const [admins, setAdmins] = useState<any>([]);
	const [owner, setOwner] = useState<any>(null);
	const [refresh, setRefresh] = useState<boolean>(false);

	// Function to open the change password dialog
	const [showChangePassword, setShowChangePassword] = useState(false);
	const openChangePasswordDialog = () => {
		setShowChangePassword(!showChangePassword);
	};
	
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


	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState("");
	const onChange = ({ target }: any) => setUsername(target.value);

	function addMember() {
		let body: addChannelMemberDto = {
			username: username,
			channelID: chat.id,
		};

		api.post('/user/addChannelMember', body)
			.then((res) => {
				toast.success(`${username} has been added to ${chat.name}`, {theme: 'dark'});
	
				// Update members state to include the new member
				setMembers([...members, res.data.userToAdd]);
	
				// Reset the username input and close the dialog
				setUsername("");
				setOpen(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.messages?.toString(), {theme: 'dark'});
			});
	}

	return (
		<div className='flex flex-col items-center w-full my-5 gap-y-2'>
			<div className="flex justify-end  w-full mr-3.5 ">
				<IconButton color="pink" className="rounded-full" onClick={openChangePasswordDialog}>
					<i className="fa-solid fa-cog fa-lg "/>
				</IconButton>
			</div>
			<ChangeChannelPasswordDialog show={showChangePassword} onClose={openChangePasswordDialog} channelId={chat.id} />
			<Badge className='bg-white/10' placement='bottom-end' content={
				<div> {/* Wrap the content inside a single parent element */}
					<Typography variant='h3' color='white'>{chat?.name}</Typography>
					<i className={`fa-solid ${
						chat.type === 'protected' ? 'fa-lock' :
						chat.type === 'private' ? 'fa-eye-slash' :
						chat.type === 'public' ? 'fa-globe' : ''
					}`} />
				</div>
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
					<div className="absolute top-2 right-8 z-[20] transition-all duration-300 hover:rotate-180">
						<IconButton color="pink" size= "sm" className="rounded-full" onClick={() => setOpen(!open)}>
							<i className="fa-solid fa-plus"/>
						</IconButton>
						{open &&
							<Dialog size="xs" open={open} handler={() => setOpen(!open)} className='bg-primary1 h-[300px] rounded-[15px] border-none focus:outline-none'>
								<ToastContainer/>
								<div className='flex w-1/2 flex-col p-4 items-center m-auto my-[2.5rem] gap-y-10'>
									<Typography variant='h4' color='white'>Add to channel: </Typography>
										<Input
											type="text"
											label="Username"
											value={username}
											onChange={onChange}
											color="white"
											containerProps={{
											className: "min-w-0",
										}} crossOrigin={undefined}/>
									<Button disabled={!username} onClick={addMember} variant='gradient' color='pink' className='opacity-80 hover:opacity-100 transition-all hover:scale-105'>ADD</Button>
								</div>
							</Dialog>
						}
					</div>
				}
				<div className="absolute bottom-12 left-8 z-[20] transition-all duration-300 hover:rotate-180">
				<ChangeChannelPasswordDialog show={showChangePassword} onClose={() => openChangePasswordDialog()} channelId={chat.id} />
				</div>
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
	);
}
export default ChannelInfo;