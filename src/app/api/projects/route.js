import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET all projects
export async function GET() {
    try {
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ projects: user.projects }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new project
export async function POST(request) {
    try {
        const body = await request.json();
        await connectDB();
        
        const user = await User.findOne({});
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.projects.length >= 6) {
            return NextResponse.json({ error: 'Maximum 6 projects allowed' }, { status: 400 });
        }

        user.projects.push(body);
        await user.save();

        return NextResponse.json({ message: 'Project added successfully', project: body }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update project
export async function PUT(request) {
    try {
        const body = await request.json();
        const { projectId, ...updateData } = body;
        
        await connectDB();
        const user = await User.findOne({});
        
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
            project: user.projects[projectIndex] 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE project
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');
        
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const projectIndex = user.projects.findIndex(p => p._id.toString() === projectId);
        if (projectIndex === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        user.projects.splice(projectIndex, 1);
        await user.save();

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 