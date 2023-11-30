import { AppProps } from 'next/app';
import '../style/global.css';

function MyApp({ Component,
	pageProps: {session, ...pageProps}
 }: AppProps) {
	return (
			<Component {...pageProps} />
	);
  }

export default MyApp;

