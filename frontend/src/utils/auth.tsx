import axios from "axios";

export async function getTokenRequest(oAuth_code: string) {
	return (
		axios.post("http://localhost:5000/auth/42/trade", {
			oAuth_code,
		})
		.then(res => res)
		.catch(err => err)
	)
}

export async function signinRequest(username: string, password: string) {
	return axios
	  .post(`${process.env.REACT_APP_BACK}/auth/signin`, {
		username,
		password,
	  })
	  .then((res) => ({ error: false, res }))
	  .catch((res) => {
		if (res.response)
		  return {
			error: true,
			errMessage: 'Username or password incorrect',
		  };
		else
		  return {
			error: true,
			errMessage: res.message,
		  };
	  });
  }
  