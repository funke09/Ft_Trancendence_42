import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import './../style/global.css'
import { CurrentUserProvider } from '@/api/userContext';
import { useRouter } from 'next/router';
import { loader as appLoader } from '../utils/loader';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => {
	  const loadData = async () => {
		const data = await appLoader();
  
		if (!data) {
		  router.push('/login');
		}
	  };
  
	  loadData();
	}, []);
	
	return (
	<CurrentUserProvider user={pageProps.user} token={pageProps.token}>
		<div className='App'>
			<Component {...pageProps}/>
		</div>
	</CurrentUserProvider>
  );
}
export default MyApp;

