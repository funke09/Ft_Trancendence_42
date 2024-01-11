import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import gameSocket from "./gameSocket";
import store, { addFriend, addNewMsgToGroup, addNewMsgToPrivate, setCurrentChat, setCurrentChatGroup, setGame, setGroupChat, setNotif, setPrivateChat, setSocket } from "@/redux/store";
import { AchievDto, NotifType, RankDto, SocketRes } from "./types";
import chatSocket from "./chatSocket";
import { ToastContainer, toast } from "react-toastify";

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
			toast.error(err, {theme: 'dark'});
		});

		gameSocket.on("achievement", (data: AchievDto) => {
			toast.success(`Congratulations you unlocked ${data.name}`, {theme:'dark'});
        });

		gameSocket.on("rank", (data: RankDto) => {
			toast.success(`Congratulations you reached ${data.name}`, {theme:'dark'});
		})
		
		gameSocket.on("endGame", () => {
			setTimeout(() => {
				router.push('/profile');
			}, 2000);
		});
		
		gameSocket.on("connect", () => {
		})

		gameSocket.on("disconnect", () => {
		})

		chatSocket.on("connect", () => {
		})

		chatSocket.on("disconnect", () => {
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
				fromId: data.fromId,
				user: {
					avatar: data.avatar,
					username: data.fromUsername,
				},
				fromUsername: data.fromUsername,
				channelId: data.channelId,
			};
			store.dispatch(addNewMsgToGroup(newMsg));
		});

		chatSocket.on('notifs', (data: NotifType[]) => {
			store.dispatch(setNotif(data));
		});

		chatSocket.on('notification', (data: NotifType) => {
			store.dispatch(addFriend(data));
			if (data.type == 'AcceptRequest') {
				chatSocket.emit("reconnect");
				toast.success(data.msg)
			}
		});

		chatSocket.on('privateChat', (data) => {
			store.dispatch(setPrivateChat(data));
		});

		chatSocket.on('publicChat', (data) => {
			store.dispatch(setGroupChat(data));
		});

		chatSocket.on('channelRemoved', (data: any) => {
			const current: any = store.getState().chat.currentChatGroup;
			
			if (current && current.id === data) {
				store.dispatch(setCurrentChatGroup(null));				
				store.dispatch(setGroupChat(store.getState().chat.GroupChats.filter((c: any) => c.id !== data)))
			}
		})

		return () => {
			gameSocket.disconnect();
			chatSocket.disconnect();
		};
	}, [gameSocket, chatSocket]);

	return (
		<>
			<ToastContainer/>
		</>
	);
};

export default SocketComp;