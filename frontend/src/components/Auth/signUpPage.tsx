import Cookies from "js-cookie";
import SignUp from './signup';
import { User } from "@/utils/types";

export async function getPreAuthData() {
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

interface SignUpPageProps {
  user: User | null;
}

export default function SignUpPage({ user }: SignUpPageProps) {
	return (
	  <>
		{user ? <SignUp {...user} /> : <p>Loading...</p>}
	  </>
	);
  }