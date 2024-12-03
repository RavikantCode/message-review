// import { UserNameValidation } from "@/schema/signUpschema";
import {UserNameValidation} from "@/schema/signUpschema"
import { PrismaClient } from "@prisma/client";
import {z} from 'zod'
const prisma = new PrismaClient();

const UsernameQuerySchema = z.object({
    username:UserNameValidation
})

export async function GET(request:Request){
    try {
        const {searchParams} = new URL(request.url);      //used to get ptovide the username availbale to user
        const queryParam = {                               
            username:searchParams.get('username')        // note there is an object 
        }
        //validate with zod
        const result=UsernameQuerySchema.safeParse(queryParam)
        console.log(result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []         //username ke erros aayega mast wala n
            return Response.json({
                success:false,
                message:usernameErrors?.length > 0 ? usernameErrors.join(','):"Invalid Query Parameters"
            },{
                status:400
            })
        }

        const {username} = result.data ; 

        await prisma.user.findMany({
            where:{
                username,isVerified:true
            }
        })
        
    } catch (error) {
       console.error(error);
       return Response.json({
        success:false,
        message:"Error checking username"
       },{
        status:500
       })
        
    }
}