import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({ status: 'success' });

        // Clear the session cookie
        response.cookies.set({
            name: '__session',
            value: '',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        );
    }
} 