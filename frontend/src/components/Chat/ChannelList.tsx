import { Badge, Chip, ListItem, ListItemPrefix, Tooltip, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Loading from "../Layout/Loading";
import store, { setCurrentChat, setCurrentChatGroup } from "@/redux/store";

const ChannelList = ({ channel } : {channel: any}) => {
	const avatar: string = channel.name.charAt(0);

	return (
		<ListItem className="text-white" onClick={() => {
			store.dispatch(setCurrentChatGroup(channel));
			store.dispatch(setCurrentChat(null));
		}}>
			<Tooltip content={channel.type} className="bg-opacity-50">
				<ListItemPrefix>
					<img 
					src={`https://via.placeholder.com/100/413040/e3e3e3?text=${avatar.toUpperCase()}`}
					alt="Avatar" 
					width={60}
					height={60}
					className="rounded-full"
					/>
				</ListItemPrefix>
			</Tooltip>
			<Typography variant="h6">
				{channel.name}
			</Typography>
		</ListItem>
	);
};

export default ChannelList;
