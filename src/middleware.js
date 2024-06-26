import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  console.log('Middleware is running')

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  console.log('Token:', token)

  if (!token) {
    console.log('No token found, redirecting to /Login')
    return NextResponse.redirect(new URL('/Login', req.url))
  }

  const { role } = token
  console.log('User role:', role)

  const url = req.nextUrl.pathname
  console.log('Requested URL:', url)

  // Protect admin routes
  if (url.startsWith('/admin') && role !== 'admin') {
    console.log('User is not an admin, redirecting to homepage')
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Protect user routes
  if (url.startsWith('/user') && role !== 'user' && role !== 'admin') {
    console.log('User is not authorized, redirecting to homepage')
    return NextResponse.redirect(new URL('/', req.url))
  }

  //สำหรับ farmer
  /*if (url.startsWith('/farmer') && role !== 'farmer' ) {
    console.log('User is not authorized, redirecting to homepage')
    return NextResponse.redirect(new URL('/', req.url))
  }*/


  // User is authorized, allowing access
  console.log('User is authorized, allowing access')
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
  ],
}