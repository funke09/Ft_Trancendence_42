import api from '@/api';
import Header from '@/components/Layout/Header';
import Navbar from '@/components/Layout/NavBar';
import store, { setProfile } from '@/redux/store';
import {Nav} from '@/components/Layout/nav';
import { useEffect, useState } from 'react';
  
const Home: React.FC = () => {
	const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/user/profile")
            .then((res: any) => {
                if (res.status == 200) {
                    store.dispatch(setProfile(res.data));
                    setLoading(false);
                } else {
                    window.location.href = "/";
                }
            })
            .catch((err: any) => {
                window.location.href = "/login";
            });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

  return (
    <div>
		<Nav/>
      {/* <Navbar /> */}
      <div>
        <Header />
      </div>
    </div>
  );
};

export default Home;
