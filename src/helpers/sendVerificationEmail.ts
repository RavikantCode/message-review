import {resend} from '../lib/resend'

import VerificationEmail from '../../emails/VerificationEmail'

import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse> {
    try{
        await resend.emails.send({ 
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
        return {success:true,message:'Verification Email sent successsfully'}
    }catch(emailError){
        console.log('Error sending the email',emailError);
        return{success:false,message:'Failed to send verification email'}
        
    }
}

// import VerificationEmail from '../../emails/VerificationEmail'
// import { Resend } from 'resend';
// import * as React from 'react';
// import { ApiResponse } from '@/types/ApiResponse'
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse> {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: email,
//       subject: "Hello world",
//       react: VerificationEmail({ username, otp: verifyCode }) as React.ReactElement,
//     });

//     if (error) {
//         return{success:false,message:'Failed to send verification email'}
//     }

//     return {success:true,message:'Verification Email sent successsfully'}
//   } catch (error) {
//     return {success:false,message:'Internal server error'}
//   }
// }