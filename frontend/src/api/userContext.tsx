import { User } from "@/utils/types";
import { login, logout } from "@/utils/user";
import { useRouter } from "next/router";
import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { io } from "socket.io-client";

function reducer(user: User, action: any) {
	switch(action.type) {
		case('login'): {
			return ({ ...user, userStatus: "ONLINE"})
		}
		case('logout'): {
			return ({ ...user, userStatus: "OFFLINE"})
		}
		case('updateUser'): {
			if (user && action.user) {
				return ({ ...user, ...action.user})
			}
		}
		case('updateAvatar'): {
			if (user && action.url)
				return ({ ...user, url: action.url})
		}
		default: return (user);
	}
}

export const CurrentUserContext: React.Context<any> = createContext(0);

export function CurrentUserProvider({ children, ...props}: any) {
	const [user, userDispatch]: any = useReducer(reducer, props.user);
	const [socket, setSocket]: any = useState();
	const router = useRouter();

	const loginHandle = useCallback(async () => {
		userDispatch({ type: 'login'})
		login(user, props.token);
	}, [user])

	const logoutHandle = useCallback(async () => {
		logout(user, props.token);
		userDispatch({ type: 'logout'})
	}, [user])

	useEffect(() => {
		const sock = io(`http://localhost:5000/user`, {
			transports: ['websocket'],
			upgrade: false,
			extraHeaders: {
				'Authorization': `Bearer ${props.token}`
			}
		});

		setSocket(sock);
		loginHandle();

		return () => {
			sock.disconnect();
			logoutHandle();
		}
	}, [])

	const updateCurrentAvatar = useCallback((url: string) => {
		userDispatch({ type: 'updateAvatar', url})
	}, [user])

	const updateCurrentUser = useCallback((user: User) => {
		userDispatch({ type: 'updateUser', user })
	}, [user])

	return (
		<CurrentUserContext.Provider
			value={{
				token: props.token,
				userSocket: socket,
				user,
				userDispatch,
				updateCurrentUser,
				updateCurrentAvatar
			}}>
				{children}
			</CurrentUserContext.Provider>
	)
}