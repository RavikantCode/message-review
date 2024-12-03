// import bcrypt from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
// const prisma = new PrismaClient();
// export async function POST(request:Request) {
//     try {
//         // const {username,email,password} = await request.json();
        
//         // if(!username || !email || !password){                           //added by ravi
//         //     return new Response(JSON.stringify({
//         //         success:false,
//         //         message:'Username , email and Password are required'
//         //     }),{status:400})
//         // }
//         // console.log("Received input:",username,email,password);

//        const body = await request.json();

//        if(!body || typeof body !== 'object'){
//         return new Response(JSON.stringify({success:false,message:'Invalid request payload'}),{status:400})
//        }
//         const {username,email,password} = body

//         if (!username || !email || !password) {
//             return new Response(
//                 JSON.stringify({
//                     success: false,
//                     message: 'Username, email, and password are required.',
//                 }),
//                 { status: 400 }
//             );
//         }

//         const ExistingUserByUsername = await prisma.user.findFirst({
//             where:{
//                 AND:[

//                     {username},
//                     {isVerified:true},        //verify nhi hain toh username dusre ko milega
//                 ]
//             }
//         })
//         if(ExistingUserByUsername){
//             // return Response.json({
//             //     success:false, 
//             //     message:'Username is already Taken'
//             // },{
//             //     status:400
//             // })
//             return new Response(JSON.stringify({success:false,message:'username is already taken'}),{status:400})
//         }
//         // const ExistingUserByEmail= await prisma.user.findUnique({
//         //     where:email
//         // })
//         const ExistingUserByEmail = await prisma.user.findUnique({
//             where:{email}
//         })

//         const verifyCode = Math.floor(10000 + Math.random()*900000).toString()

//         if(ExistingUserByEmail){
//             if(ExistingUserByEmail.isVerified){
//                 return new Response(
//                     JSON.stringify({
//                     message:'user already exists with this email'
//                 }),{status:500})
//             }else{
//                 const hashedPassword = await bcrypt.hash(password,10);
//                 // ExistingUserByEmail.password = hashedPassword;
//                 // ExistingUserByEmail.verifyCode = verifyCode;           //mongodb
//                 // ExistingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
//                 const verifyCodeExpiry = new Date(Date.now()+3600000)

//                 await prisma.user.update({
//                     where:{
//                         email:ExistingUserByEmail.email,          //prisma

//                     },
//                     data:{
//                         password:hashedPassword,
//                         verifyCode:verifyCode,
//                         verifyCodeExpiry:verifyCodeExpiry,
//                     }
//                 })
//             }
//         }else{
//             const hashedPassword =await bcrypt.hash(password,10);
//             const ExpiryDate = new Date()
//             ExpiryDate.setHours(ExpiryDate.getHours()+1)      // const can be modified because
//                                                               // object ke piche kuch bhi hon let,const  object memory
//                                                               //  refrenece point use karta hain jisse  andar jo values hain  change ho  sakte  hain
//                 const data = await prisma.user.create({
//                     data: {
//                         username,             
//                         email,               
//                         password:hashedPassword,        
//                         verifyCode,            
//                         verifyCodeExpiry:ExpiryDate,     
//                         isVerified: false,     
//                         isAcceptingMessage:true,
//                         messages:{
//                             create:[]
//                         }
//                     },
//                 })
//                 console.log("user ko email ka data",data);
                
       
//             }

//        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
//         console.log("Email Response",emailResponse);
        
//        if(!emailResponse.success){
//             return new Response(JSON.stringify({
//                 success:false,
//                 message:emailResponse.message
//             }),{status:500})
//        }
//     //    return Response.json({
//     //     success:true,
//     //     message:'User Registered Successfully.Please Verify Your Email'
//     //    },{
//     //     status:200
//     //    })
//     return  new Response(
//         JSON.stringify({ success: true, message: 'User registered successfully..Please Verify Your Email' }),
//         { status: 200 }
//     );

//     } catch (error) {
//         console.log(error);
//         return new Response(JSON.stringify({
//             success: false,
//             message: 'Error Registering user'
//         }), {
//             status: 500
//         }) 
//     }
// }

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
       
        const  { username, email, password } = await request.json();
       

        if (!username || !email || !password) {
            console.log('Missing required fields:', { username, email, password });
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Username, email, and password are required.',
                }),
                { status: 400 }
            );
        }

        const existingUserByUsername = await prisma.user.findFirst({
            where: {
                AND: [{ username }, { isVerified: true }],
            },
        });

        if (existingUserByUsername) {
            console.log('Username already taken:', username);
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Username is already taken.',
                }),
                { status: 400 }
            );
        }

  
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });

        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                console.log('Email already verified:', email);
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: 'User already exists with this email.',
                    }),
                    { status: 400 }
                );
            }

            console.log('Updating unverified user:', email);
            const verifyCodeExpiry = new Date(Date.now() + 3600000);

            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry,
                },
            });
        } else {
           
            console.log('Creating new user:', { username, email,hashedPassword,password });
            const verifyCodeExpiry = new Date(Date.now() + 3600000);

            await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: {
                        create: [],
                    },
                },
            });
        }
        console.log("1");
        
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log("2");

        console.log('Email response:', emailResponse);
        console.log("3");


        if (!emailResponse || !emailResponse.success) {
        console.log("4");

            console.log('Failed to send verification email:', emailResponse);
        console.log("5");

        return new Response(
            JSON.stringify({
                success: false,
                message: emailResponse?.message || 'Failed to send verification email.',
            }),
            { status: 500 }
            
        );
    

        }
        console.log("6");


        return new Response(
            JSON.stringify({
                success: true,
                message: 'User registered successfully. Please verify your email.',
            }),
            { status: 200 }
        );
        
    } 
    
    catch (error) {
        console.error('Error during registration:', error);

        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error registering user',
            }),
            { status: 500 }
        );
    }
}
