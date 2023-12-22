import api from '@/api';
import Loading from '@/components/Layout/Loading';
import { Nav } from '@/components/Layout/NavBar';
import Dashboard from '@/components/User/Dashboard';
import store, { setProfile } from '@/redux/store';
import React, { useEffect, useState } from 'react'

function Dash() {
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
	const userId = store.getState().profile.user.id;

	return (
		<>
			<Nav/>
			<Dashboard id={userId.toString()} key={userId.toString()} />
		</>
	)
}

export default Dash;