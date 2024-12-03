// import { NextRequest,NextResponse } from 'next/server'

//  export { default } from "next-auth/middleware"  //next auth js for entire file
//  import { getToken } from 'next-auth/jwt'
// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   console.log("middeware exceuted");
  
//   const token = await getToken({req:request});
//   const url = request.nextUrl

//   if(token && 
//     (url.pathname.startsWith('/sign-in')) || 
//     (url.pathname.startsWith('/sign-up')) ||
//     (url.pathname.startsWith('/verify')) ||
//     (url.pathname.startsWith('/'))){
//   return NextResponse.redirect(new URL('/dashboard', request.url)) 

//   }
//   if(!token && url.pathname.startsWith('/dashboard')){
//     return NextResponse.redirect(new URL('/sign-in',request.url))
//   }
//   return NextResponse.redirect(new URL('/home', request.url)) 
// }
 
// // See "Matching Paths" below to learn more
// export const config = {                               //kaha kaha middleware run kare 
//   matcher: ['/sign-in','/sign-up','/','/dashboard/:path*','/verify/:path*'],  //make array to apply the middleware 
// }

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request:NextRequest) {
  console.log("Middleware executed");

  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token && 
      (url.pathname.startsWith('/sign-in') || 
       url.pathname.startsWith('/sign-up') || 
       url.pathname.startsWith('/verify'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

 
  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*'],  
};
