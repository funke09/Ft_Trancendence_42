import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import api from "@/api";
import store, { setProfile } from "@/redux/store";
import Loading from "@/components/Layout/Loading";
import { Nav } from "@/components/Layout/NavBar";
import Dashboard from "@/components/User/Dashboard";

export default function Profile() {
	const [id, setId] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (router.query.userID)
			setId(router.query.userID as string);
	}, [router]);

	useEffect(() => {
		api.get("/user/profile")
			.then((res: any) => {
				if (res.status == 200)
					store.dispatch(setProfile(res.data));
				else
					router.push("/");
			})
			.catch((err: any) => {
				router.push("/");
			});
	}, []);


	if (id == '')
		return <Loading/>

	return (
		<>
			<Nav/>
			<Dashboard id={id} key={id} />
		</>
	)
}