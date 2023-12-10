import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import './../style/global.css'
import { CurrentUserProvider } from '@/api/userContext';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CurrentUserProvider user={pageProps.user} token={pageProps.token}>
		<div className='App'>
			<Component {...pageProps} />
		</div>
		</CurrentUserProvider>
  );
}
export default MyApp;

