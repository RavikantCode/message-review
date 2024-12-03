import {z} from 'zod'

export const UserNameValidation = z.string()
                .min(2,'username must be atleast 2 characters')
                .max(20,'username must be not more than 20 characters')
                .regex(/^[a-zA-Z0-9_]+$/,'username must not contain special character')


export const signUpchema = z.object({
        username:UserNameValidation,
        email:z.string().email({
            message:'Invalid email address'
        }),
        password:z.string().min(6,{message:'password at least 6 characters'})

})