import { Avatar, IconButton, ListItem, ListItemPrefix, ListItemSuffix, Tooltip, Typography } from '@material-tailwind/react'
import React from 'react'
import { useRouter } from 'next/router'

const ChannelMembers = ({manager, members} : {manager: boolean, members: any}) => {
	const router = useRouter();
	
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
						{manager &&
							<ListItemSuffix>
								<IconButton className='rounded-full text-[16px]' variant='text' color='pink'>
									<i className="fa-solid fa-ellipsis fa-lg"/>
								</IconButton>
							</ListItemSuffix>
						}
					</ListItem>
				)
			})}
		</>
  	)
}

export default ChannelMembers