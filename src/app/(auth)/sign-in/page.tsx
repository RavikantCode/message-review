"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from 'next/link'            
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { FormControl, FormField, FormItem, FormLabel, FormMessage,Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInschema } from "@/schema/signInschema"
import { signIn } from "next-auth/react"
import Credentials from "next-auth/providers/credentials"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {

  const [isSubmitting,setIsSubmitting] = useState(false)
  const {toast} = useToast()
  const router = useRouter()
 

  //zod impl
  const form = useForm<z.infer<typeof signInschema>>({    
    resolver:zodResolver(signInschema),
    defaultValues:{
      // email:'',
      Identifier:'',
      password:''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInschema>)=>{
    setIsSubmitting(true);
    console.log("data is here",data);
    
    // try {
    //   const res = await axios.post<ApiResponse>(`/api/sign-in`,data);
    //   toast({
    //     title:'Success',
    //     description:res.data.message
    //   })
    //   router.replace(`/dashboard`)
    //   setIsSubmitting(false)
    // } catch (error) {
    //   console.error('Error in SignUp',error)    
    //   const axiosError = error as AxiosError<ApiResponse>;
    //   let errorMessage = axiosError.response?.data.message

    //   toast({
    //     title:'SignUp Failed',
    //     description:errorMessage,
    //     variant:'destructive'
    //   })
    //   setIsSubmitting(false);
    // }

   const res = await signIn('credentials',{
      redirect:false,
      identifier:data.Identifier,
      password:data.password
    })

    if(res?.error){
      if(res.error == 'CredentialsSignIn'){
        toast({
          title:"login failed",
          description:"Incorrect username or password",
          variant:"destructive"
        })
       
      }
    }else{
        toast({
          title:"Error",
          description:res?.error,
        })
    }
    if(res?.url){
      router.replace('/dashboard')
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
           


        <FormField
          control={form.control}
          name="Identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="Email/Username" {...field} 
                // onChange={(e)=>{                                //do jagha manage kar rahe hain !! 
                //   field.onChange(e)                      //yaha nhi hoga
                //   setUsername(e.target.value)
                // }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} 
                // onChange={(e)=>{                                //do jagha manage kar rahe hain !! 
                //   field.onChange(e)                      //yaha nhi hoga
                //   setUsername(e.target.value)              //isSubmitting true toh button disabled 
                // }}
                />                                        
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>SignIn</Button> 
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin">Please Wait</Loader2>
          </>
        ):('')}
            </form>
          </Form>
          <div><p>Create an Account{' '}<Link href={'/sign-up'} className="text-blue-600 hover:text-blue-800">SignUp</Link></p></div>
      </div>
      </div>
    </div>
  )
}

export default page