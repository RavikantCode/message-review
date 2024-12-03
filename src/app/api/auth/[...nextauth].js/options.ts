import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from 'bcryptjs'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                console.log(credentials);
                
                // await dbConnect()
                try {
                    const user = await prisma.user.findFirst({
                        where:{
                           
                                email:credentials.identifier.email
                            
                        }
                    })

                    if(!user){
                        throw new Error('No user Found with that Email')
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify Your Email')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);

                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error('Invalid Password')
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                
                token.id = user.id    //next auth ko nhi pata woh field esliye hume define karna hoga 
                token.isVerified = user.isVerified
                token.isAcceptingMessage=user.isAcceptingMessage
                token.username = user.username

                //token ke andar bohot sarre value hain jisse no of  request minimize kar sakta haun tuh
            }
          return token
        },
        async session({ session, token }) {
            if(token){
                session.user.id = token.id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        },
    },
    pages:{
        signIn:'/signin'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
    
}


// import { NextAuthOptions } from "next-auth";
// import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs"
// const prisma = new PrismaClient()
// import { PrismaClient } from "@prisma/client";
// export const authOptions :NextAuthOptions={
//     providers:[
//         CredentialsProvider({
//             id:"credentials",
//             name:"credentials",
//             credentials:{
//                 username:{label:"username",type:"text"},
//                 password:{label:"password",type:"text"}

//             },
//             async authorize(credentials:any):Promise<any>{
//                 try {
//                     const user= await prisma.user.findUnique({
//                         where:{
//                             OR:[
//                                 {email:credentials.identifier},
//                                 {isVerified:true}
//                             ]
//                         }
//                     })

//                     if(!user){
//                         throw new Error('No User found')
//                     }
//                 } catch (error:any) {
//                     // console.log(error);
//                     return null
                    
//                 } 
//             }
//         })
//     ]
// }