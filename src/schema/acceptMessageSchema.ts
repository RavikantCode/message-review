import {z} from 'zod'

export const acceptMessageSchema = z.object({
    conetnt:z.string().min(10,{
        message:'Content Must be atleast 10 Character'
    }).max(300,{message:'Content must no longer then 300 characters'})
})