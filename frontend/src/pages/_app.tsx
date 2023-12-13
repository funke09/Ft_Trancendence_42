import api from '@/api';
import React, { useEffect } from 'react';
import store, { setProfile } from '@/redux/store';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { AxiosError } from 'axios';
import './../style/global.css'
import './../style/ProfileCard.css'
import './../style/fonts.css'


export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
					console.log(res.data);
                    store.dispatch(setProfile(res.data));
                }
            })
            .catch((err: AxiosError<{ message: string }>) => {});
    }, []);

	return (
		<Provider store={store}>
			<main>
				<Component {...pageProps} />
			</main>
		</Provider>
  );
}

