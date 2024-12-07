import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';

// Initialize admin auth
const auth = getAuth(adminApp);

// Set session expiration to 5 days
const SESSION_EXPIRATION_TIME = 60 * 60 * 24 * 5 * 1000;

export async function POST(request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            throw new Error('No ID token provided');
        }

        console.log('Creating session cookie...');
        
        // Create session cookie
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRATION_TIME,
        });

        if (!sessionCookie) {
            throw new Error('Failed to create session cookie');
        }

        console.log('Session cookie created successfully');

        // Set cookie options
        const options = {
            name: '__session',
            value: sessionCookie,
            maxAge: SESSION_EXPIRATION_TIME,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        };

        // Create response
        const response = NextResponse.json({ status: 'success' });

        // Set the cookie
        response.cookies.set(options);

        return response;
    } catch (error) {
        console.error('Session creation error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to create session',
                details: error.message,
                code: error.code
            },
            { status: 401 }
        );
    }
} 