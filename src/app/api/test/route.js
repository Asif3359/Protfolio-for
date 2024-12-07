import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json(
            { message: 'Successfully connected to MongoDB' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Test endpoint error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to MongoDB', details: error.message },
            { status: 500 }
        );
    }
} 