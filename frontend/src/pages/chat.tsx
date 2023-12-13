import next from "next";
import React from "react";
import Navbar from "@/components/Layout/NavBar";
import store from "@/redux/store";
import { UserType } from "@/redux/profile";
import ProfileCard from "@/components/ProfileCard";

const Chat: React.FC = () => {
    const user: UserType = store.getState().profile.user;
	return (
		<div>
			<Navbar/>
            <div>
                {/* <ProfileCard {...user} /> */}
            </div>
		</div>
	)
}

export default Chat;