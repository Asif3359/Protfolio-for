import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectDB();
        
        const connectionState = mongoose.connection.readyState;
        const stateMap = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        return NextResponse.json({
            status: 'success',
            connection: {
                state: stateMap[connectionState],
                host: mongoose.connection.host,
                name: mongoose.connection.name,
                port: mongoose.connection.port,
            },
            message: 'MongoDB connection test successful'
        }, { status: 200 });
    } catch (error) {
        console.error('Connection test error:', error);
        return NextResponse.json({
            status: 'error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            code: error.code,
            name: error.name
        }, { status: 500 });
    }
} 