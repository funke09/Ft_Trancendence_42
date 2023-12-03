import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const signup = async (username: string, email: string, password: string, router: AppRouterInstance) => {
	const response = await fetch("http://localhost:5000/auth/finish_signup", {
		credentials: "include",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			username: username,
			email: email,
			password: password,
		}),
	});
	if (response.ok) {
		const res = await response.json();
		console.log("res: ", res);
		router.push("/profile");
	} else alert("Failed to SugnUp");
}

export const login = async (username: string, password: string, router: AppRouterInstance) => {
	const response = await fetch("http://localhost:5000/auth/signin", {
		credentials: "include",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	});
	if (response.ok) {
		const res = await response.json();
		router.push("/profile");
	} else {
		alert("Failed to Login");
	}
};
