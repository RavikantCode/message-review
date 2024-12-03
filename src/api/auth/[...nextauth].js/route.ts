import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth].js/options";
// import { authOptions } from "@/app/api/auth/[...nextauth].js/options";
import { authOptions } from "@/app/api/auth/[...nextauth].js/options";

const handler = NextAuth(authOptions)

export {handler as GET,handler as POST}     //verbs se hi file chalte hain