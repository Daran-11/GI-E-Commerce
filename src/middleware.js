// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect to login if no token is found
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { role } = token;
  const url = req.nextUrl.pathname;

  // Define access control for specific roles
  if (url.startsWith('/account/user') && !['customer', 'admin', 'farmer', 'municipal'].includes(role)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Admin access control: restrict to specific order paths only
  if (url.startsWith('/dashboard') && role === 'admin') {
    const orderPathRegex = /^\/dashboard\/orders\/\d+$/; // e.g., /dashboard/orders/[orderId]
    if (!orderPathRegex.test(url)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next(); // Admin can access specific order paths
  }

  // Role-based restrictions for different dashboards
  if (url.startsWith('/admin-dashboard') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (url.startsWith('/dashboard_municipality') && role !== 'municipal') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (url.startsWith('/dashboard') && !['admin', 'municipal'].includes(role)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If none of the restricted conditions apply, allow access
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: [
    '/admin-dashboard/:path*',         // Match all subpaths of /admin-dashboard
    '/dashboard/:path*',               // Match all subpaths of /dashboard
    '/account/user/:path*',            // Match all subpaths of /account/user
    '/api/users/:path*',               // Match all API routes under /api/users
    '/dashboard_municipality/:path*',  // Match all subpaths of /dashboard_municipality
  ],
};
