import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';

const auth = getAuth(adminApp);

// Helper function to sanitize MongoDB document
function sanitizeUser(user) {
    if (!user) return null;

    const sanitized = {
        ...user.toObject(),
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
    };

    // Handle nested arrays with dates and ObjectIds
    if (sanitized.experience) {
        sanitized.experience = sanitized.experience.map(exp => ({
            ...exp,
            _id: exp._id.toString(),
            startDate: exp.startDate?.toISOString(),
            endDate: exp.endDate?.toISOString()
        }));
    }

    if (sanitized.education) {
        sanitized.education = sanitized.education.map(edu => ({
            ...edu,
            _id: edu._id.toString(),
            startDate: edu.startDate?.toISOString(),
            endDate: edu.endDate?.toISOString()
        }));
    }

    if (sanitized.blogPosts) {
        sanitized.blogPosts = sanitized.blogPosts.map(post => ({
            ...post,
            _id: post._id.toString(),
            date: post.date?.toISOString()
        }));
    }

    if (sanitized.projects) {
        sanitized.projects = sanitized.projects.map(proj => ({
            ...proj,
            _id: proj._id.toString()
        }));
    }

    if (sanitized.skills) {
        sanitized.skills = sanitized.skills.map(skill => ({
            ...skill,
            _id: skill._id.toString()
        }));
    }

    if (sanitized.certifications) {
        sanitized.certifications = sanitized.certifications.map(cert => ({
            ...cert,
            _id: cert._id.toString()
        }));
    }

    return sanitized;
}

// Get current user's data
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

        // Get user data
        const user = await User.findOne({ firebaseUid: decodedClaims.uid });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user: sanitizeUser(user) });
    } catch (error) {
        console.error('Error getting user data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Update current user's data
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
        
        const { update } = await request.json();
        await connectDB();

        // Find and update user
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: decodedClaims.uid },
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user: sanitizeUser(updatedUser) });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// Delete current user's data
export async function DELETE(request) {
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

        // Delete user
        const deletedUser = await User.findOneAndDelete({ firebaseUid: decodedClaims.uid });

        if (!deletedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            message: 'User deleted successfully',
            user: sanitizeUser(deletedUser)
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}