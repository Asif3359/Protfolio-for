import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const auth = getAuth(adminApp);

// GET current user
export async function GET(request) {
    try {
        // Get the session cookie
        const sessionCookie = request.cookies.get('__session')?.value;

        if (!sessionCookie) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify the session cookie
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        
        await connectDB();
        const user = await User.findOne({ firebaseUid: decodedClaims.uid });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT/Update current user
export async function PUT(request) {
    try {
        // Get the session cookie
        const sessionCookie = request.cookies.get('__session')?.value;

        if (!sessionCookie) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify the session cookie
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        
        const updateData = await request.json();

        await connectDB();
        const user = await User.findOne({ firebaseUid: decodedClaims.uid });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user fields
        Object.keys(updateData).forEach(key => {
            user[key] = updateData[key];
        });

        await user.save();

        return NextResponse.json({ 
            message: 'User updated successfully',
            user 
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 