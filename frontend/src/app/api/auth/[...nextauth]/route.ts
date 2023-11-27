import { NextApiHandler } from "next";
import { options } from './options'
import NextAuth from "next-auth";

const handler: NextApiHandler = NextAuth(options);

export {handler as GET, handler as POST};