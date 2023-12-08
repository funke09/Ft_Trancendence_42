import { cookies } from "next/headers";

export default async function getPreAuthData() {
	const cookie = cookies();
	const response = await fetch("http://localhost:3000/auth/preAuthData", {
	  credentials: "include",
	  method: "GET",
	  headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		Cookie: cookies()
		  .getAll()
		  .map(({ name, value }) => `${name}=${value}`)
		  .join("; "),
	  },
	});
	if (response.ok) {
	  const res = await response.json();
	  return res.user;
	} else alert("Failed to fetch user data");
  }