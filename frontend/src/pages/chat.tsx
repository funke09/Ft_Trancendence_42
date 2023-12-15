import React, { useEffect, useState } from "react";
import { Nav } from "@/components/Layout/NavBar";
import api from "@/api";
import Loading from "@/components/Layout/Loading";
import store, { setProfile } from "@/redux/store";

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputText, setInputText] = useState<string>("");

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

    const handleSendMessage = () => {
        if (inputText.trim() !== "") {
            // Add the new message to the messages list
            setMessages([...messages, inputText]);
            setInputText("");
        }
    };

    return (
        <div>
			<Nav/>
            <div className="chat-container">
                <div className="message-container">
                    {messages.map((message, index) => (
                        <div key={index} className="message">
                            {message}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
            <style jsx>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    padding: 20px;
                }
                .message-container {
                    flex: 1;
                    overflow-y: auto;
                }
                .message {
                    background-color: #f2f2f2;
                    margin-bottom: 10px;
                    padding: 8px;
                    border-radius: 8px;
                }
                .input-container {
                    display: flex;
                    margin-top: 20px;
                }
                input {
                    flex: 1;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    margin-right: 10px;
                }
                button {
                    padding: 8px 16px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Chat;
