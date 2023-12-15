import api from "@/api";
import Loading from "@/components/Layout/Loading";
import { Nav } from "@/components/Layout/NavBar";
import store, { setProfile } from "@/redux/store";
import { useEffect, useState } from "react";

function Profile() {
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
			
		  </div>
	  </div>
	);
  }
	export default Profile;