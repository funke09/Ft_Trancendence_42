import { AppProps } from 'next/app';
import '../style/global.css';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import SocketComp from '@/api/sockets';

function MyApp({ Component, pageProps }: AppProps) {
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
