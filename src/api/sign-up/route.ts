import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
// import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
const prisma = new PrismaClient();
export async function POST(request:Request) {
    try {
        const {username,email,password}=await request.json();

        const ExistingUserByUsername = await prisma.user.findFirst({
            where:{
                AND:[

                    {username},
                    {isVerified:true},        //verify nhi hain toh username dusre ko milega
                ]
            }
        })
        if(ExistingUserByUsername){
            return Response.json({
                success:false, 
                message:'Username is already Taken'
            },{
                status:400
            })
        }
        // const ExistingUserByEmail= await prisma.user.findUnique({
        //     where:email
        // })
        const ExistingUserByEmail = await prisma.user.findUnique({
            where:{email}
        })

        const verifyCode = Math.floor(10000 + Math.random()*900000).toString()

        if(ExistingUserByEmail){
            if(ExistingUserByEmail.isVerified){
                return Response.json({
                    message:'user already exists with this email'
                },{status:500})
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                // ExistingUserByEmail.password = hashedPassword;
                // ExistingUserByEmail.verifyCode = verifyCode;           //mongodb
                // ExistingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                const verifyCodeExpiry = new Date(Date.now()+3600000)

                await prisma.user.update({
                    where:{
                        email:ExistingUserByEmail.email,          //prisma

                    },
                    data:{
                        password:hashedPassword,
                        verifyCode:verifyCode,
                        verifyCodeExpiry:verifyCodeExpiry,
                    }
                })
            }
        }else{
            const hashedPassword =await bcrypt.hash(password,10);
            const ExpiryDate = new Date()
            ExpiryDate.setHours(ExpiryDate.getHours()+1)      // const can be modified because
                                                              // object ke piche kuch bhi hon let,const  object memory
                                                              //  refrenece point use karta hain jisse  andar jo values hain  change ho  sakte  hain
                await prisma.user.create({
                    data: {
                        username,             
                        email,               
                        password:hashedPassword,        
                        verifyCode,            
                        verifyCodeExpiry:ExpiryDate,     
                        isVerified: false,     
                        isAcceptingMessage:true,
                        messages:{
                            create:[]
                        }
                    },
                })
       
            }

       const emailResponse = await sendVerificationEmail(email,username,verifyCode)

       if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
       }
       return Response.json({
        success:true,
        message:'User Registered Successfully.Please Verify Your Email'
       },{
        status:200
       })

    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:'Error Registering user'
        },{
            status:500
        }) 
    }
}