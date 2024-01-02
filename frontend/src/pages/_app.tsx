import api from '@/api';
import React, { useEffect } from 'react';
import store, { setProfile } from '@/redux/store';
import Invite from '@/components/Game/gameInvite';
import SocketComp from '@/sockets/socketComp';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { AxiosError } from 'axios';
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './../style/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                }
            })
            .catch((err: AxiosError<{ message: string }>) => {});
    }, []);

	return (
		<Provider store={store}>
			<ToastContainer limit={1}/>
			<ThemeProvider>
			<SocketComp />
			<Invite/>
			<main>
				<Component {...pageProps} />
			</main>
			</ThemeProvider>
		</Provider>
  );
}

