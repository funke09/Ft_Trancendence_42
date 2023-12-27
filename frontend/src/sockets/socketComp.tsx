import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import gameSocket from "./gameSocket";
import store, { addFriend, addNewMsgToGroup, addNewMsgToPrivate, setGame, setGroupChat, setNotif, setPrivateChat, setSocket } from "@/redux/store";
import { AchievDto, NotifType, RankDto, SocketRes } from "./types";
import chatSocket from "./chatSocket";
import { toast } from "react-toastify";

const SocketComp = () => {
	const [connectedGame, setConnectedGame] = useState(false);
    const [connectedChat, setConnectedChat] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (!gameSocket.connected)
				gameSocket.connect();
			else
				setConnectedGame(!connectedGame);
			if (!chatSocket.connected)
				chatSocket.connect();
			else
				setConnectedChat(!connectedChat)
		}, 1000);
	}, [connectedGame, connectedChat]);

	useEffect(() => {
		store.dispatch(setSocket(gameSocket));
		store.dispatch(setSocket(chatSocket));

		gameSocket.on("gameState", (game: any) => {
			store.dispatch(setGame(game));
		});

		gameSocket.on("error", (err: string) => {
			console.error("error", err)
		});

		gameSocket.on("achievement", (data: AchievDto) => {
			toast.success(`Congratulations you unlocked ${data.name}`);
        });

		gameSocket.on("rank", (data: RankDto) => {
			toast.success(`Congratulations you reached ${data.name}`);
		})
		
		gameSocket.on("endGame", () => {
			setTimeout(() => {
				router.push('/profile');
			}, 2000);
		});
		
		gameSocket.on("connect", () => {
		console.log("/game: Connected to server");
		})

		gameSocket.on("disconnect", () => {
			console.log("/game: Disconnected from server");
		})

		chatSocket.on("connect", () => {
			console.log('Connected to Chat Socket');
		})

		chatSocket.on("disconnect", () => {
			console.log('Disconnected from Chat Socket')
		})

		chatSocket.on("msg", (data: any) => {
			if (store.getState().chat.PrivateChats.length == 0)
				chatSocket.emit("reconnect", {});
			store.dispatch(addNewMsgToPrivate(data));
		});

		chatSocket.on("PublicMsg", (data: SocketRes | any) => {
			if (data?.status) return ;
			const newMsg = {
				text: data.text,
				createdAt: new Date(),
				senderId: data.senderId,
				user: {
					avatar: data.avatar,
					username: data.senderUsername,
				},
				senderUsername: data.senderUsername,
				channelId: data.channelId,
			};
			store.dispatch(addNewMsgToGroup(newMsg));
		});

		chatSocket.on('notifs', (data: NotifType[]) => {
			store.dispatch(setNotif(data));
		});

		chatSocket.on('notifs', (data: NotifType) => {
			store.dispatch(addFriend(data));
			if (data.type == 'AcceptRequest')
				chatSocket.emit("reconnect");
		});

		chatSocket.on('privateChat', (data) => {
			store.dispatch(setPrivateChat(data));
		});

		chatSocket.on('publicChat', (data) => {
			store.dispatch(setGroupChat(data));
		});

		return () => {
			gameSocket.disconnect();
			chatSocket.disconnect();
		};
	}, [gameSocket, chatSocket]);

	return <></>;
};

export default SocketComp;