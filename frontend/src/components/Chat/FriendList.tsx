import { Badge, ListItem, ListItemPrefix, Tooltip, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import store, { setCurrentChat, setCurrentChatGroup } from '@/redux/store';

const FriendList = ({friendObj} : {friendObj: any}) => {
	const friend = friendObj.otherUser;
	
	function getLastMsg() {
        if (friendObj.chat.length == 0) return "Let's Chat....";
        const lastMsg = friendObj.chat[friendObj.chat.length - 1];
        return lastMsg.text;
    }

	return (
		<ListItem className="text-white" onClick={() => {
			store.dispatch(setCurrentChat(friendObj));
			store.dispatch(setCurrentChatGroup(null));
		}}>
			<ListItemPrefix>
				<Badge invisible={getLastMsg() !== "Let's Chat...."} content={'new'} color='green'>
					<Tooltip content={friend.userStatus} className={'bg-opacity-50'}>
						<Image
							src={friend.avatar}
							height={60}
							width={60}
							alt="avatar"
							className={friend.userStatus.toLowerCase()}/>
					</Tooltip>
				</Badge>
			</ListItemPrefix>
			<div>
				<Typography variant="h6">
					{friend.username}
				</Typography>
				<Typography variant="small" className="font-normal opacity-70">
					{getLastMsg().slice(0, 20)}
				</Typography>
			</div>
		</ListItem>
	)
}

export default FriendList