import { MenuList, Button, Dialog, DialogBody, Typography } from '@material-tailwind/react'
import { channel } from 'diagnostics_channel'
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';

const MemberManage = ({member, channel} : {member: any, channel: any}) => {
	const [open, setOpen] = useState(false);
	const openHandler = () => setOpen(!open);

	
	function kick(member: any) {
		// api.post(`/user/kickFromChannel`)
	}

	function ban() {

	}

	function mute() {

	}

	const clickMute = () => {
		
	}

	function makeAdmin() {

	}
  return (
	<MenuList className="bg-[#382A39] z-[99999] border-none hidden samwil:flex focus:outline-none rounded-[15px]">
		<div className="focus:outline-none flex flex-col gap-y-2 justify-center m-auto">
			{!channel.adminsIds.includes(member.id) && <Button onClick={() => makeAdmin} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="pink">MAKE ADMIN</Button>}
			<Button onClick={clickMute} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">MUTE</Button>
			<Button onClick={() => kick(member)} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="white">KICK</Button>
			<Button onClick={() => ban} className="opacity-75 hover:opacity-100 text-md p-2" variant="text" color="red">BAN</Button>
			<Dialog size="xs" className="bg-primary1 rounded-[30px] z-[999999]" open={open} handler={openHandler}>
				<Typography className="absolute top-8 opacity-75" color="white" variant="h5">
					Enter Mute Period:
				</Typography>
			</Dialog>
		</div>
	</MenuList>
  )
}

export default MemberManage