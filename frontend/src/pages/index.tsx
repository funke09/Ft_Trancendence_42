import Header from "@/components/Layout/Header";
import Navbar from "@/components/Layout/NavBar";
import { loader } from "@/utils/loader";

const Home: React.FC = () => {
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

export async function getServerSideProps() {
  try {
    const data = await loader();

    return {
      props: {
        user: data|| null,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
