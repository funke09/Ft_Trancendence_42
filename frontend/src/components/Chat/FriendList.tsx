import { Badge, ListItem, ListItemPrefix, Tooltip, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import api from '@/api';
import { toast } from 'react-toastify';
import { AddFriend } from '../User/types';

const FriendList = ({id} : {id : number}) => {
	const [lastMsg, setLastMsg] = useState<string>("Let's Chat....");
	const [friend, setFriend] = useState<any>("");
	const [status, setStatus] = useState<string>("Offline");

	useEffect(() => {
		api.get('user/id/' + id)
			.then((res: any) => {
				if (res.status === 200) {
					setFriend(res.data);
					setStatus(res.data.userStatus);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message ?? "An Error Occured!", {theme: "dark"});
			})
	}, [])

	console.log(friend);

	return (
		<ListItem className="text-white">
			<ListItemPrefix>
				<Badge invisible={lastMsg !== "Let's Chat...."} content={'new'} color='green'>
					<Tooltip content={friend.userStatus} className={'bg-opacity-50'}>
						<Image 
							src={friend.avatar}
							height={60}
							width={60}
							alt="avatar"
							className={status.toLowerCase()}/>
					</Tooltip>
				</Badge>
			</ListItemPrefix>
			<div>
				<Typography variant="h6">
					{friend.username}
				</Typography>
				<Typography variant="small" className="font-normal opacity-70">
					{/* Message capped at 20... */}
					{lastMsg}
				</Typography>
			</div>
		</ListItem>
	)
}

export default FriendList