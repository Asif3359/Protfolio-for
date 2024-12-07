import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST() {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected to database');

        const db = mongoose.connection;
        const collection = db.collection('users');

        // Update all users without a jobTitle field
        console.log('Updating users without jobTitle...');
        const updateResult = await collection.updateMany(
            { jobTitle: { $exists: false } },
            { $set: { jobTitle: 'Software Engineer' } }
        );

        console.log('Update result:', updateResult);

        return NextResponse.json({
            message: 'JobTitle field updated successfully',
            result: {
                matchedCount: updateResult.matchedCount,
                modifiedCount: updateResult.modifiedCount
            }
        });
    } catch (error) {
        console.error('Error updating jobTitle:', error);
        return NextResponse.json(
            { error: 'Failed to update jobTitle', details: error.message },
            { status: 500 }
        );
    }
} 