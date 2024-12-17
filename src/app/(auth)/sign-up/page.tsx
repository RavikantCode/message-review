"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from 'next/link'            
import { useEffect, useState } from "react"
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpchema } from "@/schema/signUpschema"
import axios , {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, FormField, FormItem, FormLabel, FormMessage,Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {
  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const debouncedUsername = useDebounceCallback(()=>{checkUsernameUnique(username)}, 300); 
  const [isSubmitting,setIsSubmitting] = useState(false)
  const {toast} = useToast()
  const router = useRouter()
  

  //zod impl
  const form = useForm<z.infer<typeof signUpchema>>({    
    resolver:zodResolver(signUpchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  const checkUsernameUnique = async (value:string)=>{
    if(value){
      setIsCheckingUsername(true);
      setUsernameMessage('')
      try {
        const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${value}`)
        console.log(response);
        
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
      } finally{
        setIsCheckingUsername(false);
      }
    }
  };
  
  useEffect(()=>{
    if(username){

      checkUsernameUnique(username);
    }

  },[debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpchema>)=>{
    setIsSubmitting(true);
    console.log("data is here",data);
    
    try {
      const res = await axios.post<ApiResponse>(`/api/sign-up`,data);
      toast({
        title:'Success',
        description:res.data.message
      })
      // router.replace(`/verify/${username}`)
      router.replace('/sign-in')
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error in SignUp',error)    
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message

      toast({
        title:'SignUp Failed',
        description:errorMessage,
        variant:'destructive'
      })
      setIsSubmitting(false);
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={(e)=>{                                //do jagha manage kar rahe hain !! 
                  field.onChange(e)
                  checkUsernameUnique(e.target.value)
                }}
                />
              </FormControl>
                {isCheckingUsername && <Loader2 className="animate-spin"></Loader2>}
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} 
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
              <FormLabel>Email</FormLabel>
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

        <Button type="submit" disabled={isSubmitting}>SignUp</Button> 
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin">Please Wait</Loader2>
          </>
        ):('SignUp')}
            </form>
          </Form>
          <div><p>Already a Member?{' '}<Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">SignIn</Link></p></div>
      </div>
      </div>
    </div>
  )
}

export default page

