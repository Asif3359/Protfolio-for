import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Define protected routes
    const isProtectedRoute = path.startsWith('/dashboard');
    
    // Get the Firebase ID token from the cookie
    const session = request.cookies.get('__session');

    if (isProtectedRoute && !session) {
        // Redirect to login page if accessing protected route without session
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
}; 