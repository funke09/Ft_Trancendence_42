import { AppProps } from 'next/app';
import '../style/global.css';
import { Provider } from 'react-redux';
import store, { setProfile } from '@/redux/store';
import { useEffect } from 'react';
import api from '@/api';
import { AxiosError } from 'axios';
import SocketComp from '@/api/sockets';


function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		api.get("/user/profile")
		.then((res: any) => {
			if (res.status == 200)
				store.dispatch(setProfile(res.data));
		})
		.catch((err: AxiosError<{ message: string }>) => {});
	}, []);
	
  return (
	<Provider store={store}>
		<SocketComp/>
		<main>
    		<Component {...pageProps} />
		</main>
	</Provider>
  );
}

export default MyApp;
