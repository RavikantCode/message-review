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

//---------------------------------------------------------------------------------------------------------------------------

// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export const config = {
//   matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*'],  
// };
// export async function middleware(request:NextRequest) {
  
//   const token = await getToken({ req: request });
//   console.log("token is here:",token);
  
  
//   const url = request.nextUrl; 

//   console.log("URL:", url.pathname);
//   console.log("Middleware executed");

//   if (token && 
//       (url.pathname.startsWith('/sign-in') || 
//        url.pathname.startsWith('/sign-up') || 
//        url.pathname.startsWith('/verify') ||
//       url.pathname === '/')
//     ) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   if (!token && url.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

 
//   return NextResponse.next();
// }

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*'],  
};

export async function middleware(request: NextRequest) {
  // Get the token from the request using next-auth's getToken
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  console.log("Token is here:", token);  // Log the token for debugging
  
  const url = request.nextUrl;  // Get the current URL
  
  console.log("URL:", url.pathname);  // Log the current URL
  console.log("Middleware executed");  // Log when middleware is executed
  
  // If the user is authenticated (token exists) and trying to access a public page (sign-in, sign-up, etc.), redirect them to the dashboard
  if (token && 
    (url.pathname.startsWith('/sign-in') || 
     url.pathname.startsWith('/sign-up') || 
     url.pathname.startsWith('/verify') ||
     url.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));  // Redirect to dashboard
  }
  
  // If the user is not authenticated (no token) and trying to access a protected page (dashboard), redirect them to the sign-in page
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));  // Redirect to sign-in
  }

  return NextResponse.next();  // Allow the request to continue
}
