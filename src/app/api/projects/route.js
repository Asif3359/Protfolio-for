import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';

const auth = getAuth(adminApp);

// Helper function to sanitize projects
function sanitizeProjects(projects) {
    return projects.map(project => ({
        ...project,
        _id: project._id.toString()
    }));
}

// Get current user's projects
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

        return NextResponse.json({ 
            projects: sanitizeProjects(user.projects || [])
        }, { status: 200 });
    } catch (error) {
        console.error('Error getting projects:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Add new project for current user
export async function POST(request) {
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
        
        const body = await request.json();
        await connectDB();
        
        const user = await User.findOne({ firebaseUid: decodedClaims.uid });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.projects.length >= 6) {
            return NextResponse.json({ error: 'Maximum 6 projects allowed' }, { status: 400 });
        }

        user.projects.push(body);
        await user.save();

        const newProject = user.projects[user.projects.length - 1];
        return NextResponse.json({ 
            message: 'Project added successfully', 
            project: {
                ...newProject.toObject(),
                _id: newProject._id.toString()
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding project:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update project for current user
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
        
        const body = await request.json();
        const { projectId, ...updateData } = body;
        
        await connectDB();
        const user = await User.findOne({ firebaseUid: decodedClaims.uid });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const projectIndex = user.projects.findIndex(p => p._id.toString() === projectId);
        if (projectIndex === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Update the project while preserving the _id
        user.projects[projectIndex] = {
            _id: user.projects[projectIndex]._id,
            ...updateData
        };

        await user.save();

        return NextResponse.json({ 
            message: 'Project updated successfully', 
            project: {
                ...user.projects[projectIndex].toObject(),
                _id: user.projects[projectIndex]._id.toString()
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Delete project for current user
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
        
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');
        
        await connectDB();
        const user = await User.findOne({ firebaseUid: decodedClaims.uid });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const projectIndex = user.projects.findIndex(p => p._id.toString() === projectId);
        if (projectIndex === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const deletedProject = user.projects[projectIndex];
        user.projects.splice(projectIndex, 1);
        await user.save();

        return NextResponse.json({ 
            message: 'Project deleted successfully',
            project: {
                ...deletedProject.toObject(),
                _id: deletedProject._id.toString()
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 