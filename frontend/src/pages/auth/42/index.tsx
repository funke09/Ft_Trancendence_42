import api from "@/api";
import { useEffect, useState } from "react";

export default function Callback() {
	const [error, setError] = useState<string>("");
	
	useEffect(() => {
		api.get("/user/profile")
		.then((res) => {
			if (res.status === 200)
				window.location.href = "/dashboard";
			else
				setError(res.data.message);
		})
		.catch((eror) => {
			setError(eror?.response?.data?.message);
		});
	}, []);

	return (
		<div className="w-[100%] h-[100vh] justify-center align-middle">
		</div>
	);
}