import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";
import { ChatRoom } from "@/components/Chat/ChatRoom";

const Chat: React.FC = () => {
	const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                    setLoading(false);
                } else {
                    window.location.href = "/";
                }
            })
            .catch((err: any) => {
                window.location.href = "/login";
            });
    }, []);

	if (loading) {
		return(<Loading/>);
	} 

    return (
        <div>
			<Nav/>
            <ChatRoom/>
        </div>
    );
};

export default Chat;
