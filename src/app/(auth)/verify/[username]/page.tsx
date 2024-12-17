"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schema/verifyschema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
// import { useRouter } from 'next/router'
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as  z  from 'zod';

type Props = {}

const page = (props: Props) => {
    const router = useRouter();
    const params = useParams<{username:string}>();    //explain this 
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({    
        resolver:zodResolver(verifySchema),
        
      })
    const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
        try {
            const response = await axios.post(`/api/verify-code`,{username:params.username,code:data.code})

            toast({
                title:"Success",
                description:response.data.message
              })
              router.replace('sign-in')     
        } catch (error) {
            console.log("error in signup of user",error);
            
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message

      toast({
        title:'SignUp Failed',
        description:errorMessage,
        variant:'destructive'
      })

        }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold
                tracking-tight lg:text-5xl mb-6">Verify Your account</h1>
                <p className="mb-4">Enter the verification code sent to your email</p>
            </div>

            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}

export default page