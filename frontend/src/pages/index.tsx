import Header from '@/components/Layout/Header';
import Navbar from '@/components/Layout/NavBar';
import { loader } from '@/utils/loader';
  
const Home: React.FC<{ user: any; token: string | null }> = ({ user, token }) => {
	// Your Home page content
	console.log('User:', user);
	console.log('Token:', token);
  return (
    <div>
      <Navbar{...user} />
      <div>
        <Header />
      </div>
    </div>
  );
};

export default Home;
