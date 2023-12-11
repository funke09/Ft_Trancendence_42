import Header from '@/components/Layout/Header';
import Navbar from '@/components/Layout/NavBar';
import { AppContext } from 'next/app';
  
const Home: React.FC<{ user: any; token: string | null }> = ({ user, token }) => {
  return (
    <div>
      <Navbar />
      <div>
        <Header />
      </div>
    </div>
  );
};

export default Home;
