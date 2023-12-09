import jwt from 'jsonwebtoken';
import defaultAvatar from '../../public/images/defaultAvatar.png';
import { extractCookie, setCookie } from '@/utils/cookie';
import { getUser, getUserAvatar } from '@/utils/user';
import { useRouter } from "next/router";
import { User } from './types';

export async function loader() {
	const router = useRouter();
	let decodedToken = null;
	const token = extractCookie('access_token');
	if (token) {
	  try {
		  decodedToken = jwt.decode(token) as { id: number };
	  } catch (e) {
		setCookie('access_token', '');
		return router.replace('/login');
	  }
	}

	if (decodedToken) {
	  const userId: number = decodedToken.id;
	  let err: boolean = false;
	  let image: any = defaultAvatar;
	  let user: User | null = null;

	  try {
		const userResponse = await getUser(userId, token);
		if (userResponse.status === 200 || userResponse.statusText !== 'OK') {
		  user = userResponse.data;
		} else {
		  err = true;
		}

		const imageResponse = await getUserAvatar(userId, token);
		if (imageResponse.status === 200 && imageResponse.statusText === 'OK') {
		  image = window.URL.createObjectURL(new Blob([imageResponse.data]));
		} else {
		  err = true;
		}
	  } catch (error) {
		err = true;
	  }

	  if (!err) {
		return { user: { ...user, url: image }, token };
	  }
	}

	setCookie('access_token', '');
	return router.replace('/login');
}