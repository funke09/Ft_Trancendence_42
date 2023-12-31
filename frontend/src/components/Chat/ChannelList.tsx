import { ListItem } from "@material-tailwind/react";

const ChannelList = ({ id } : {id: number}) => {
    // Fetch channel data here...

    return (
        <ListItem className="text-white">
            {/* Display channel data here... */}
			<h1>Channel List</h1>
        </ListItem>
    );
};

export default ChannelList;
