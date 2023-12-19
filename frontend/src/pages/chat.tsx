import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";
import { ChatRoom } from "@/components/Chat/ChatRoom";

const Chat: React.FC = () => {

    return (
        <div>
			<Nav/>
            <ChatRoom/>
        </div>
    );
};

export default Chat;
