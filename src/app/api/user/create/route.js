import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
    try {
        console.log('Received user creation request');
        
        const body = await request.json();
        console.log('Request body:', body);

        const { 
            name, 
            email, 
            firebaseUid, 
            jobTitle = 'Software Engineer' // Default value if not provided
        } = body;

        // Validate required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!firebaseUid) missingFields.push('firebaseUid');

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return NextResponse.json(
                { 
                    error: 'Missing required fields',
                    details: `Missing fields: ${missingFields.join(', ')}`
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Invalid email format:', email);
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate jobTitle against enum values
        const validJobTitles = [
            'Software Engineer',
            'Web Developer',
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Mobile Developer',
            'DevOps Engineer',
            'UI/UX Designer',
            'Data Scientist',
            'Machine Learning Engineer',
            'Other'
        ];

        if (!validJobTitles.includes(jobTitle)) {
            console.error('Invalid job title:', jobTitle);
            return NextResponse.json(
                { 
                    error: 'Invalid job title',
                    details: `Job title must be one of: ${validJobTitles.join(', ')}`
                },
                { status: 400 }
            );
        }

        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected to database');

        // Check if user already exists
        console.log('Checking for existing user...');
        const existingUser = await User.findOne({
            $or: [
                { email },
                { firebaseUid }
            ]
        });

        if (existingUser) {
            console.log('User already exists:', {
                existingEmail: existingUser.email,
                newEmail: email,
                existingFirebaseUid: existingUser.firebaseUid,
                newFirebaseUid: firebaseUid
            });
            return NextResponse.json(
                { 
                    error: 'User already exists',
                    details: 'A user with this email or Firebase ID already exists'
                },
                { status: 409 }
            );
        }

        console.log('Creating new user:', { name, email, firebaseUid, jobTitle });

        // Create new user with default values
        const newUser = await User.create({
            name,
            email,
            firebaseUid,
            jobTitle,
            role: 'user',
            isApproved: false,
            approvalRequest: true,
            bio: `Hi, I'm ${name}, a ${jobTitle}`,
            aboutYourself: 'Tell us about yourself...',
            background: 'Share your background...',
            contact: {
                email: email
            },
            skills: [],
            experience: [],
            education: [],
            projects: [],
            blogPosts: [],
            certifications: [],
            socialLinks: {
                github: '',
                linkedin: '',
                facebook: '',
                twitter: '',
                website: ''
            }
        });

        console.log('User created successfully:', {
            id: newUser._id,
            email: newUser.email,
            firebaseUid: newUser.firebaseUid,
            jobTitle: newUser.jobTitle
        });

        // Convert MongoDB document to plain object and handle dates
        const sanitizedUser = {
            ...newUser.toObject(),
            _id: newUser._id.toString(),
            createdAt: newUser.createdAt.toISOString(),
            updatedAt: newUser.updatedAt.toISOString()
        };

        return NextResponse.json({
            message: 'User created successfully',
            user: sanitizedUser
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));

            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validationErrors
                },
                { status: 400 }
            );
        }

        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    error: 'Duplicate key error',
                    details: 'A user with this email or Firebase ID already exists'
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { 
                error: 'Failed to create user',
                details: error.message
            },
            { status: 500 }
        );
    }
} 