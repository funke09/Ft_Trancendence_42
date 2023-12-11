import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import './../style/global.css'
import { Provider } from 'react-redux';
import api from '@/api';
import store, { setProfile } from '@/redux/store';
import { AxiosError } from 'axios';

export default function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        api.get("/auth/status")
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
			<div className='App'>
				<Component {...pageProps} />
			</div>
		</Provider>
  );
}

