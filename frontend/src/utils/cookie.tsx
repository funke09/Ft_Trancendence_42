export function setCookie(key: string, value: string) {
	document.cookie = `${key}=${value}; path=/`;
}

export function extractCookie(key: string) {
	let cookies = document.cookie.split("; ");
	for (let i = 0; i < cookies.length; i++)
	{
		const params = cookies[i].split('=');
		if (params[0] === key && params[1])
			return params[1];
	}
	return null;
}