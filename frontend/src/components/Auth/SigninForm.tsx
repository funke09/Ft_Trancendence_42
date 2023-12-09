import { signinRequest } from "@/utils/auth";
import { setCookie } from "@/utils/cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SigninForm() {
	// const [username, setUsername] = useState('');
	// const [password, setPassword] = useState('');
	// const [error, setError] = useState('');
	// const router = useRouter();
  
	// useEffect(() => {
	//   async function loader() {
	// 	let validLogin = false;
	// 	let oauthCode = router.query.oauth_code as string;
  
	// 	if (oauthCode) {
	// 	  const res = await signinRequest(oauthCode, '');
	// 	  if (res && res.data) {
	// 		setCookie('access_token', res.data.access_token);
	// 		validLogin = true;
	// 	  }
	// 	} else {
	// 	  setCookie('access_token', '');
	// 	}
  
	// 	if (validLogin) {
	// 	  router.push('/');
	// 	}
	//   }
  
	//   loader();
	// }, [router]);
  
	// const handleResponse = (data) => {
	//   if (data && data.access_token) {
	// 	setCookie('access_token', data.access_token);
	// 	router.push('/');
	//   } else {
	// 	setError('Username or password incorrect');
	//   }
	// };
  
	// const handleSubmit = async () => {
	//   if (!username.trim() || !password.trim()) {
	// 	setError('Username or password empty');
	// 	return;
	//   }
  
	//   const { error, errMessage, res } = await signinRequest(username.trim(), password.trim());
	//   if (!error) {
	// 	handleResponse(res.data);
	//   } else {
	// 	setError(errMessage);
	//   }
	// };

		return (
		<div className="container mx-auto">
				<div className="-mx-4 flex flex-wrap">
				<div className="w-full px-4">
					<div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
					<div className="mb-10 text-center md:mb-16">
					</div>
						<form>
							<div className="mb-6">
								<input
								type="text"
								name="username"
								placeholder="Username"
								className="w-full rounded-md border border-stroke bg-[#D9D9D9] px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
								></input>
							</div>
							<div className="mb-6">
								<input
								type="password"
								name="password"
								placeholder="Password"
								className="w-full rounded-md border border-stroke bg-[#D9D9D9] px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
								></input>
							</div>
							<div className="mb-10">
							<input
								type="submit"
								value="Login"
								className="w-full cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium text-white hover:ease-in duration-300"
							/>
							</div>
						</form>
						<div className="flex flex-row justify-between items-baseline">
							<hr className="border-[1px] rounded-full border-white w-[40%]"></hr>
							<p className="mb-6 text-base text-white">OR</p>
							<hr className="border-[1px] rounded-full border-white w-[40%]"></hr>
						</div>
						<ul className="-mx-2 mb-12 flex justify-center">
							<li className="w-[75%] px-2">
							<a
								href="http://localhost:5000/auth/42"
								className="flex h-11 items-center text-semibold text-white text-[18px] justify-center gap-4 rounded-full bg-[#1B1B1B] hover:bg-opacity-90"
							>
								<img
								src="images/42_Logo.png"
								alt="42"
								className="inline-block max-w-[50px] max-h-[30px] shadow-md">
								</img>
								Login with Intra</a>
							</li>
						</ul>

						<div>
							<span className="absolute right-1 top-1">
							<svg
								width="40"
								height="40"
								viewBox="0 0 40 40"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
								cx="1.39737"
								cy="38.6026"
								r="1.39737"
								transform="rotate(-90 1.39737 38.6026)"
								fill="#FFFFFF"
								/>
								<circle
								cx="1.39737"
								cy="1.99122"
								r="1.39737"
								transform="rotate(-90 1.39737 1.99122)"
								fill="#FFFFFF"
								/>
								<circle
								cx="13.6943"
								cy="38.6026"
								r="1.39737"
								transform="rotate(-90 13.6943 38.6026)"
								fill="#FFFFFF"
								/>
								<circle
								cx="13.6943"
								cy="1.99122"
								r="1.39737"
								transform="rotate(-90 13.6943 1.99122)"
								fill="#FFFFFF"
								/>
								<circle
								cx="25.9911"
								cy="38.6026"
								r="1.39737"
								transform="rotate(-90 25.9911 38.6026)"
								fill="#FFFFFF"
								/>
								<circle
								cx="25.9911"
								cy="1.99122"
								r="1.39737"
								transform="rotate(-90 25.9911 1.99122)"
								fill="#FFFFFF"
								/>
								<circle
								cx="38.288"
								cy="38.6026"
								r="1.39737"
								transform="rotate(-90 38.288 38.6026)"
								fill="#FFFFFF"
								/>
								<circle
								cx="38.288"
								cy="1.99122"
								r="1.39737"
								transform="rotate(-90 38.288 1.99122)"
								fill="#FFFFFF"
								/>
								<circle
								cx="1.39737"
								cy="26.3057"
								r="1.39737"
								transform="rotate(-90 1.39737 26.3057)"
								fill="#FFFFFF"
								/>
								<circle
								cx="13.6943"
								cy="26.3057"
								r="1.39737"
								transform="rotate(-90 13.6943 26.3057)"
								fill="#FFFFFF"
								/>
								<circle
								cx="25.9911"
								cy="26.3057"
								r="1.39737"
								transform="rotate(-90 25.9911 26.3057)"
								fill="#FFFFFF"
								/>
								<circle
								cx="38.288"
								cy="26.3057"
								r="1.39737"
								transform="rotate(-90 38.288 26.3057)"
								fill="#FFFFFF"
								/>
								<circle
								cx="1.39737"
								cy="14.0086"
								r="1.39737"
								transform="rotate(-90 1.39737 14.0086)"
								fill="#FFFFFF"
								/>
								<circle
								cx="13.6943"
								cy="14.0086"
								r="1.39737"
								transform="rotate(-90 13.6943 14.0086)"
								fill="#FFFFFF"
								/>
								<circle
								cx="25.9911"
								cy="14.0086"
								r="1.39737"
								transform="rotate(-90 25.9911 14.0086)"
								fill="#FFFFFF"
								/>
								<circle
								cx="38.288"
								cy="14.0086"
								r="1.39737"
								transform="rotate(-90 38.288 14.0086)"
								fill="#FFFFFF"
								/>
							</svg>
							</span>
							<span className="absolute bottom-1 left-1">
							<svg
								width="29"
								height="40"
								viewBox="0 0 29 40"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
								cx="2.288"
								cy="25.9912"
								r="1.39737"
								transform="rotate(-90 2.288 25.9912)"
								fill="#FFFFFF"
								/>
								<circle
								cx="14.5849"
								cy="25.9911"
								r="1.39737"
								transform="rotate(-90 14.5849 25.9911)"
								fill="#FFFFFF"
								/>
								<circle
								cx="26.7216"
								cy="25.9911"
								r="1.39737"
								transform="rotate(-90 26.7216 25.9911)"
								fill="#FFFFFF"
								/>
								<circle
								cx="2.288"
								cy="13.6944"
								r="1.39737"
								transform="rotate(-90 2.288 13.6944)"
								fill="#FFFFFF"
								/>
								<circle
								cx="14.5849"
								cy="13.6943"
								r="1.39737"
								transform="rotate(-90 14.5849 13.6943)"
								fill="#FFFFFF"
								/>
								<circle
								cx="26.7216"
								cy="13.6943"
								r="1.39737"
								transform="rotate(-90 26.7216 13.6943)"
								fill="#FFFFFF"
								/>
								<circle
								cx="2.288"
								cy="38.0087"
								r="1.39737"
								transform="rotate(-90 2.288 38.0087)"
								fill="#FFFFFF"
								/>
								<circle
								cx="2.288"
								cy="1.39739"
								r="1.39737"
								transform="rotate(-90 2.288 1.39739)"
								fill="#FFFFFF"
								/>
								<circle
								cx="14.5849"
								cy="38.0089"
								r="1.39737"
								transform="rotate(-90 14.5849 38.0089)"
								fill="#FFFFFF"
								/>
								<circle
								cx="26.7216"
								cy="38.0089"
								r="1.39737"
								transform="rotate(-90 26.7216 38.0089)"
								fill="#FFFFFF"
								/>
								<circle
								cx="14.5849"
								cy="1.39761"
								r="1.39737"
								transform="rotate(-90 14.5849 1.39761)"
								fill="#FFFFFF"
								/>
								<circle
								cx="26.7216"
								cy="1.39761"
								r="1.39737"
								transform="rotate(-90 26.7216 1.39761)"
								fill="#FFFFFF"
								/>
							</svg>
							</span>
						</div>
						</div>
					</div>
					</div>
			</div>
	);
}
