import { AppProps } from 'next/app';
import { AuthProvider } from '../components/Auth/AuthProvider';
import '../style/global.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
	  <AuthProvider>
		<Component {...pageProps} />
	  </AuthProvider>
	);
  }

export default MyApp;
