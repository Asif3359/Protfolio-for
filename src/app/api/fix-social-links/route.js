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

        // Fix GitHub URL
        if (user.socialLinks?.github) {
            user.socialLinks.github = user.socialLinks.github
                .replace(/https:\/\/github\.com\/https:\/\/github\.com\/https:\/\/github\.com\//, 'https://github.com/')
                .replace(/https:\/\/github\.com\/https:\/\/github\.com\//, 'https://github.com/');
        }

        // Fix LinkedIn URL
        if (user.socialLinks?.linkedin) {
            user.socialLinks.linkedin = user.socialLinks.linkedin
                .replace(/https:\/\/linkedin\.com\/in\/https:\/\/linkedin\.com\/in\/https:\/\/linkedin\.com\/in\//, 'https://linkedin.com/in/')
                .replace(/https:\/\/linkedin\.com\/in\/https:\/\/linkedin\.com\/in\//, 'https://linkedin.com/in/');
        }

        await user.save();

        return NextResponse.json({
            message: 'Social links fixed successfully',
            socialLinks: user.socialLinks
        });
    } catch (error) {
        console.error('Error fixing social links:', error);
        return NextResponse.json(
            { error: 'Failed to fix social links' },
            { status: 500 }
        );
    }
} 