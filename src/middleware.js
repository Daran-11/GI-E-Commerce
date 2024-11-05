// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect to login if no token found
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { role } = token;
  const url = req.nextUrl.pathname;

  // Protect user routes: allow access only to specific roles
  if (url.startsWith('/account/user') && role !== 'customer' && role !== 'admin' && role !== 'farmer') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Admin-specific access control: allow access to specific order details
  if (url.startsWith('/dashboard') && role === 'admin') {
    const orderPathRegex = /^\/dashboard\/orders\/\d+$/; // Match /dashboard/orders/[orderId]

    // Allow access to specified paths for admin, deny access to others
    if (!orderPathRegex.test(url)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next(); // Admin has access to the specific order path
  }

  // Restrict farmers from accessing the admin dashboard
  if (url.startsWith('/admin-dashboard') && role === 'farmer') {
    return NextResponse.redirect(new URL('/', req.url));
  }

    // Restrict farmers from accessing the admin dashboard
    if (url.startsWith('/dashboard') && role === 'customer') {
      return NextResponse.redirect(new URL('/', req.url));
    }

  // General case: user is authorized, allowing access
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: [
    '/admin-dashboard/:path*',  // Match all subpaths of /admin-dashboard
    '/dashboard/:path*',        // Match all subpaths of /dashboard
    '/account/user/:path*',     // Match all subpaths of /account/user
    '/api/users/:path*',        // Match all API routes under /api/users
  ],
};
