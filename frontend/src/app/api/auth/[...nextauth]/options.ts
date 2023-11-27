import type { NextAuthOptions } from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";

export const options: NextAuthOptions = {
	providers: [
		FortyTwoProvider({
			clientId: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
		}),
	],
}

