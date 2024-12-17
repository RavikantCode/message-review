import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request:Request) {
    const session = await getServerSession(authOptions)
    const user :User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:'Not Authenticated'
        },{status:401})
    }
   
    const userId = user.id;
    const numericUserID = userId ? parseInt(userId,10):undefined;

    try {
        const user = await prisma.user.findUnique({
            where:{
                id:numericUserID
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:'desc'
                    },
                }
            }
        })
        
        if(!user || user.messages.length === 0){
            return Response.json({
                success:false,
                message:'User Not Found'
            },{status:401})
        }
        return Response.json({
            success:true,       
            messages: user.messages  
        },{status:200})
    } catch (error) {
        console.error(error);

        return Response.json({
            success:false,       
            messages: 'Not Authenticated'
        },{status:401})
    }
}