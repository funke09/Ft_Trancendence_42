import api from '@/api';
import store from '@/redux/store';
import chatSocket from '@/sockets/chatSocket';
import { Button, Dialog, Input, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const AddButton = ({ open, setOpen } : {open: boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}) => {
	const [username, setUsername] = useState("");

	const openHandler = () => setOpen(!open);
	const onChange = ({ target }: any) => setUsername(target.value);


	const addUser = (id: number) => {
		const payload: any = {id: id};
		chatSocket.emit("addFriend", payload);
		chatSocket.on("addFriend", (data: any) => {
			if (data)
				toast(data.message, {theme: 'dark'});
		});
	};

	function clickAddUser () {
		api.get('/user/' + username)
			.then((res: any) => {
				if (!res.data || res.data.id == store.getState().profile.user.id) {
					toast.error('User not Available', {theme:'dark'});
					setOpen(false);
				}
				else {
					addUser(res.data.id);
					setOpen(false);
				}
			})
	}

	useEffect(() => {
		return () => {
		  setOpen(false);
		};
	  }, [setOpen]);

  return (
	<Dialog size='xs' open={open} handler={openHandler} className='bg-primary1 h-[300px] rounded-[15px] border-none'>
		<ToastContainer/>
		<div className='flex w-1/2 flex-col p-4 items-center m-auto my-[2.5rem] gap-y-10'>
			<Typography variant='h4' color='white'>Add a Friend</Typography>
				<Input
					type="text"
					label="Username"
					value={username}
					onChange={onChange}
					color="white"
					containerProps={{
					className: "min-w-0",
				}} crossOrigin={undefined}/>
			<Button disabled={!username} onClick={clickAddUser} variant='gradient' color='green' className='opacity-80 hover:opacity-100 transition-all hover:scale-105'>ADD</Button>
		</div>
	</Dialog>
  )
}

export default AddButton