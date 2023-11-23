import { AppProps } from 'next/app';
import { AuthProvider } from '../components/Auth/AuthProvider';
import '../style/global.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Component {...pageProps} />
	);
  }

export default MyApp;
