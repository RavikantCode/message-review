import {UserNameValidation} from "@/schema/signUpschema"
import { PrismaClient } from "@prisma/client";
import {z} from 'zod'
const prisma = new PrismaClient();

export async function POST(request:Request) {
    if(request.method !== "POST"){
        return Response.json({
            success:false,
            message:'Method not allowed'
        },{status:405})
    } 
    try {
        const {username,code} = await request.json();

        const decodeUsername = decodeURIComponent(username)
        const user = await prisma.user.findFirst({where:{
            username:decodeUsername
        }})

        if(!user){
            return Response.json({
                success:false,
                message:'User Not Found'
            },{status:500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeExpired){
            user.isVerified = true
        }else if(!isCodeExpired){
            return Response.json({
                success:false,
                message:'Verification Code Expired !! Please signUp again to get a new Code'
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:'Incorrect Verification Code'
            },{status:400})
        }
        const userVerified =await prisma.user.update({
            where:{username},
            data:{isVerified:true}
        })
        return Response.json({
            success:true,
            message:'Account verfied successfully'
        },{status:200})

     } catch (error) {
        console.error("Error Verifying user",error)
        return Response.json({
            success:false,
            message:'Error verifying user'
        },{status:500})
     }
}