import axios from "axios";

export async function getUser(id: number | string, token: string | null) {
	return (
		axios.get(`http://localhost:5000/user/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then(res => res)
			.catch(err => err)
	)
}

export async function getUserByUsername(username: any, token: string)  {
	return (
		axios.get(`http://localhost:5000/user?username=${username}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then(res => res)
			.catch(err => err)
	)
}

export async function updateUser(user: any, id: number | string, token: string) {
	return (
		axios.patch(`http://localhost:5000/user/${id}`, {
			...user
		}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then(res => res)
			.catch(err => err)
	)
}

export async function login(user: any, token: any) {
	if (user && user.id) {
		updateUser(
		  { userStatus: "ONLINE" },
		  user.id,
		  token
		);
	  } else {
		console.error("Invalid user object:", user);
	  }
}

export async function logout(user: any, token: string) {
	updateUser(
		{ userStatus: "OFFLINE"},
		user.id,
		token
	)
}

export async function getUserAvatar(id: number | string, token: string | null) {
	return(
		axios.get(`http://localhost:5000/user/${id}/profileImage`, {
			responseType: 'arraybuffer',
			headers: {
				Authorization: `Bearer ${token}`
			}
		},)
			.then(res => res)
			.catch(err => err)
	)
}