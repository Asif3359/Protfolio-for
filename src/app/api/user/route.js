import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET handler to fetch user data
export async function GET() {
    try {
        await connectDB();
        const user = await User.findOne({});

        if (!user) {
            return NextResponse.json(
                { error: 'No user found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}

// PUT handler to update user data
export async function PUT(request) {
    try {
        await connectDB();
        const { update } = await request.json();

        // Find the user
        const user = await User.findOne({});
        if (!user) {
            return NextResponse.json(
                { error: 'No user found' },
                { status: 404 }
            );
        }

        // If we're only updating social links, skip other validations
        if (update.socialLinks && Object.keys(update).length === 1) {
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { 
                    $set: { 
                        socialLinks: {
                            github: update.socialLinks.github || '',
                            linkedin: update.socialLinks.linkedin || '',
                            facebook: update.socialLinks.facebook || '',
                            twitter: update.socialLinks.twitter || '',
                            website: update.socialLinks.website || ''
                        } 
                    } 
                },
                { new: true }
            );
            return NextResponse.json({ user: updatedUser });
        }

        // For other updates, validate required fields
        const requiredFields = ['name', 'role', 'bio', 'aboutYourself', 'background'];
        for (const field of requiredFields) {
            if (!update[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Validate contact email
        if (!update.contact?.email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Update existing user with all fields
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    name: update.name,
                    role: update.role,
                    bio: update.bio,
                    aboutYourself: update.aboutYourself,
                    background: update.background,
                    image: update.image,
                    contact: {
                        email: update.contact.email,
                        phone: update.contact.phone || '',
                        location: update.contact.location || ''
                    }
                }
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user data' },
            { status: 500 }
        );
    }
}

// POST create user data (if needed)
export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();

        let user = await User.findOne({});
        if (!user) {
            user = await User.create(data);
        } else {
            Object.assign(user, data);
            await user.save();
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error creating/updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}