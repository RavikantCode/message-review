import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request:Request) {
    const { username,content } = await request.json();
    try {
        const user = await prisma.user.findFirst({
            where:{
                username
            }
        })

        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            },{status:404})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:'User is not accepting the messages'
            },{status:403})
        }

        // const newMessage = {content,createdAt: new Date()}

        // user.messages.push(newMessage);

        const newMessage = await prisma.message.create({
            data:{
                content,
                createdAt:new Date(),
                userId:user.id
            }
        })
        return Response.json({
            success:true,
            message:'Message Send Successfully'
        },{status:401})



    } catch (error) {
        console.error("Error ading Messages",error);
        return Response.json({
            success:false,       
            messages: 'Internal Server Error'
        },{status:500})
    }
}