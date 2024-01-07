import api from '@/api';
import store from '@/redux/store';
import { MenuList, Button, Dialog, DialogBody, Typography, Input } from '@material-tailwind/react'
import { channel } from 'diagnostics_channel'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { UserMuteDto } from './types';

const MemberManage = ({member, channel} : {member: any, channel: any}) => {
	
	function kick(member: any) {
		// api.post(`/user/kickFromChannel`)
	}

	function ban() {

	}

	const mute = () => {
		let body: UserMuteDto = {
			userID: member.id,
			channelID: channel.id,
		};
		api.post('/user/muteUser', body)
	}

	function makeAdmin() {

	}
  return (
	<MenuList className="bg-[#382A39] z-[99999] border-none hidden samwil:flex focus:outline-none rounded-[15px]">
		<div className="focus:outline-none flex flex-col gap-y-2 justify-center m-auto">
			{!channel.adminsIds.includes(member.id) && <Button onClick={() => makeAdmin} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="pink">MAKE ADMIN</Button>}
			<Button onClick={() => mute} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">MUTE</Button>
			<Button onClick={() => kick(member)} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">KICK</Button>
			<Button onClick={() => ban} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="red">BAN</Button>
		</div>
	</MenuList>
  )
}

export default MemberManage