import React from 'react';
import '../style/global.css'
import { AppProps } from 'next/app';
import { CurrentUserProvider } from '@/api/userContext';

function MyApp() {
	const { user, token }: any = useLoaderData();
  return (
    <CurrentUserProvider user={user} token={token}>
      <div className="App">
      </div>
    </CurrentUserProvider>
  );
}

export default MyApp;
