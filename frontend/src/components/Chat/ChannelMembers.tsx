import { Avatar, Button, Dialog, DialogBody, IconButton, ListItem, ListItemPrefix, ListItemSuffix, Menu, MenuHandler, MenuList, Tooltip, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/api';
import store from '@/redux/store';
import MemberManage from './MemberManage';

const ChannelMembers = ({manager, members, channel} : {manager: boolean, members: any, channel: any}) => {
	const router = useRouter();
	const user = store.getState().profile.user;
	
	return (
		<>
			{members.map((member: any) => {	
				return (
					<ListItem key={member.id} className='hover:bg-opacity-100 focus:bg-transparent focus:outline-none hover:bg-transparent active:bg-transparent'>
						<div onClick={() => router.push(`/profile/${member.id}`)} className='flex flex-row items-center'>
							<ListItemPrefix>
								<Avatar src={member.avatar} className={member.userStatus.toLowerCase()}/>
							</ListItemPrefix>
							<Typography color='white' variant='h6'>{member.username}</Typography>
						</div>
						{(manager && member.id != user.id && channel.ownerId != member.id) &&
							<ListItemSuffix>
								<Menu>
									<MenuHandler>
										<IconButton className='rounded-full text-[16px]' variant='text' color='pink'>
											<i className="fa-solid fa-ellipsis fa-lg"/>
										</IconButton>
									</MenuHandler>
									<MemberManage member={member} channel={channel}/>
								</Menu>
							</ListItemSuffix>
						}
					</ListItem>
				)
			})}
		</>
  	)
}

export default ChannelMembers