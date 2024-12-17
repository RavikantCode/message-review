import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request:Request) {
    const session = await getServerSession(authOptions)
    const user :User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:'Not Authenticated'
        },{status:401})
    }
   
    const userId = user.id;
    const numericUserID = userId ? parseInt(userId,10):undefined

    const {acceptMessages} = await request.json();
    
    try {
        const updatedUser = await prisma.user.update({
            where:{id:numericUserID},
            data:{
                isAcceptingMessage:acceptMessages
            }
        })
        if(!updatedUser){
            return Response.json({
                success:false,
                message:'Failed to update user status to acceptmessages '
            },{status:401}
        )}
        return Response.json({
            success:true,
            message:'Message Acceptance status successfully ',
            updatedUser
        },{status:200})

    } catch (error) {
        console.error('Failed to update user status to acceptmessages ')
        return Response.json({
            success:false,
            message:'Failed to update user status to acceptmessages '
        },{status:500})
    }
}

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
    const numericUserID = userId ? parseInt(userId,10):undefined

   try{
    const foundUser = await prisma.user.findFirst({
        where:{
            id:numericUserID
        }
    })
    if(!foundUser){
        return Response.json({
            success:false,
            message:'User  Not Found'
        },{status:404}) 
    }
    return Response.json({
        success:true,
        isAcceptingMessage:foundUser.isAcceptingMessage
        
      },{status:200})
   }catch(e){
    console.error('Error in getting message acceptance status',e)
    return Response.json({
        success:false,
        message:'Error in getting message acceptance status '
    },{status:500})
   }
}