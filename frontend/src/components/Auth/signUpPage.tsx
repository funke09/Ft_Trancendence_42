import Cookies from "js-cookie";
import SignUp from './signup';
import { User } from "@/utils/types";


async function getPreAuthData() {
	const token = Cookies.get("USER");
	const response = await fetch("http://localhost:5000/auth/preAuthData", {
	  method: "GET",
	  headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		Authorization: `Bearer ${token}`,
	  },
	});
  
	if (response.ok) {
	  const res = await response.json();
	  return res.user;
	} else {
	  console.error("Failed to fetch user data");
	  return null;
	}
  }

export default async function SignUpPage() {
	const user: User = await getPreAuthData();
	return (
		<>
			<SignUp{...user} />
		</>
	)
}
