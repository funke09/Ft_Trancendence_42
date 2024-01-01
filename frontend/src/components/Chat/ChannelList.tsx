import { Badge, Chip, ListItem, ListItemPrefix, Tooltip, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Loading from "../Layout/Loading";

const ChannelList = ({ channel } : {channel: any}) => {
	if (channel) {
		const avatar: string = channel.name.charAt(0);
		return (
		   <ListItem className="text-white">
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
	}
	else return <Loading/>;
};

export default ChannelList;
