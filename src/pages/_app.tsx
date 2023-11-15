import { AppProps } from 'next/app'; // Import AppProps from next/app
import '../style/global.css'; // Adjust the path based on your project structure

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
