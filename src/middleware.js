import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('Middleware is running');

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('Token:', token);

  if (!token) {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { role } = token;
  console.log('User role:', role);

  const url = req.nextUrl.pathname;
  console.log('Requested URL:', url);

  // Protect user routes
  if (url.startsWith('/account/user') && role !== 'customer' && role !== 'admin' && role !== 'farmer') {
    console.log('User is not authorized, redirecting to homepage');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Admin cannot access the farmer dashboard and its nested pages
  if (url.startsWith('/dashboard') && role === 'admin') {
    console.log('Admin is not allowed to access the farmer dashboard, redirecting to homepage');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Farmer cannot access the admin dashboard and its nested pages
  if (url.startsWith('/admin-dashboard') && role === 'farmer') {
    console.log('Farmer is not allowed to access the admin dashboard, redirecting to homepage');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // User is authorized, allowing access
  console.log('User is authorized, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',  // Match all subpaths of /admin-dashboard
    '/dashboard/:path*',        // Match all subpaths of /dashboard
    '/account/user/:path*',     // Match all subpaths of /account/user
  ],
};
