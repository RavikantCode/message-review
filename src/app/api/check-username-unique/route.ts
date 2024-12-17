import {UserNameValidation} from "@/schema/signUpschema"
import { PrismaClient } from "@prisma/client";
import {z} from 'zod'
const prisma = new PrismaClient();

const UsernameQuerySchema = z.object({
    username:UserNameValidation                  //add many validation for sign-up and all
})

// export async function GET(request:Request){
//     if(request.method !== 'GET'){
//         return Response.json({
//             success:false,
//             message:'Method not allowed'
//         },{status:405})
//     }
//     try {
//         const {searchParams} = new URL(request.url);      //used to get ptovide the username availbale to user
//         const queryParam = {                               
//             username:searchParams.get('username')        // note there is an object 
//         }
//         //validate with zod
//         const result=UsernameQuerySchema.safeParse(queryParam)
//         console.log(result);

//         console.log(result.data);

 
//         if(!result.success){
//             const usernameErrors = result.error.format().username?._errors || []         //username ke erros aayega mast wala n
//             return Response.json({
//                 success:false,
//                 message:usernameErrors?.length > 0 ? usernameErrors.join(','):"Invalid Query Parameters"
//             },{
//                 status:400 
//             })
//         }

//         const {username} = result.data ; 

//         const ExistingVerifiedUser = await prisma.user.findFirst({
//             where:{
//                 username,
//                 // isVerified:true
//             }
//         })

//         if(ExistingVerifiedUser){
//             return Response.json({
//                 success:false,
//                 message:"Username is Already Taken"
//             },{
//                 status:400 
//             })
//         }
//         return Response.json({
//             success:true,
//             message:'Username is Available'
//         },{status:200})
        
//     } catch (error) {
//        console.error(error);
//        return Response.json({
//         success: false,
//     message: "Error checking username"
// }, { status: 500 });
        
//     }
// }

export async function GET(request: Request) {
    // Early return for invalid method
    if (request.method !== 'GET') {
        return Response.json(
            { success: false, message: 'Method not allowed' }, 
            { status: 405 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Early validation for null/empty username
        if (!username) {
            return Response.json(
                { 
                    success: false, 
                    message: 'Username is required' 
                }, 
                { status: 400 }
            );
        }

        const queryParam = { username };
        const result = UsernameQuerySchema.safeParse(queryParam);

        // Validation errors
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 
                        ? usernameErrors.join(', ') 
                        : "Invalid username"
                },
                { status: 400 }
            );
        }

        // Check database
        const existingUser = await prisma.user.findFirst({
            where: { 
                username: result.data.username
                // Uncomment if you want to check only verified users
                // isVerified: true 
            }
        });

        // Return availability status
        return Response.json(
            {
                success: !existingUser,
                message: existingUser 
                    ? "Username is already taken" 
                    : "Username is available"
            },
            { status: existingUser ? 400 : 200 }
        );
        
    } catch (error) {
        console.error('Username availability check error:', error);
        return Response.json(
            {
                success: false,
                message: error instanceof Error 
                    ? error.message 
                    : "Unexpected error checking username"
            },
            { status: 500 }
        );
    }
}