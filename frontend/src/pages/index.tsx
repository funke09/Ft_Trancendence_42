import Header from '@/components/Layout/Header';
import Navbar from '@/components/Layout/NavBar';
  
const Home: React.FC<{ user: any; token: string | null }> = ({ user, token }) => {
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
