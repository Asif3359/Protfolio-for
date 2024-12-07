import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        const user = await User.findOne({});

        if (!user) {
            return NextResponse.json({ error: 'No user found' }, { status: 404 });
        }

        // Return only social links data for inspection
        return NextResponse.json({
            socialLinks: user.socialLinks,
            _id: user._id,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error checking social links:', error);
        return NextResponse.json(
            { error: 'Failed to check social links' },
            { status: 500 }
        );
    }
} 