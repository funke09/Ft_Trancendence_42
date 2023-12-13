import api from '@/api';
import React, { useEffect } from 'react';
import store, { setProfile } from '@/redux/store';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { AxiosError } from 'axios';
import { ThemeProvider } from "@material-tailwind/react";
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
			<ThemeProvider>
			<main>
				<Component {...pageProps} />
			</main>
			</ThemeProvider>
		</Provider>
  );
}

