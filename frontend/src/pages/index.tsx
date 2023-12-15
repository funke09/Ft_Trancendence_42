import api from '@/api';
import Header from '@/components/Layout/Header';
import store, { setProfile } from '@/redux/store';
import {Nav} from '@/components/Layout/NavBar';
import { useEffect, useState } from 'react';
import Loading from '@/components/Layout/Loading';
  
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
		return(<Loading/>);
	} 

  return (
    <div>
		<Nav/>
      <div>
        <Header />
      </div>
    </div>
  );
};

export default Home;
