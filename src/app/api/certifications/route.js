import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Helper function to ensure user exists
async function ensureUser() {
    const user = await User.findOne({});
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

// GET all certifications
export async function GET() {
    try {
        await connectDB();
        const user = await ensureUser();
        return NextResponse.json({ certifications: user.certifications || [] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching certifications:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new certification
export async function POST(request) {
    try {
        const formData = await request.formData();
        await connectDB();
        const user = await ensureUser();

        // Get form fields
        const title = formData.get('title');
        const issuer = formData.get('issuer');
        const date = formData.get('date');
        const link = formData.get('link');
        let imageUrl = formData.get('imageUrl');

        // Validate required fields
        if (!title || !issuer || !date) {
            return NextResponse.json({ 
                error: 'Title, issuer, and date are required' 
            }, { status: 400 });
        }

        // Handle file upload if present
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            try {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Generate unique filename
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = uniqueSuffix + '-' + imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '');
                const uploadDir = 'public/uploads/certifications';
                const filePath = `${uploadDir}/${filename}`;

                // Ensure directory exists
                const fs = require('fs');
                const path = require('path');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Save file
                fs.writeFileSync(filePath, buffer);
                imageUrl = `/uploads/certifications/${filename}`;
            } catch (error) {
                console.error('Error uploading file:', error);
                return NextResponse.json({ 
                    error: 'Failed to upload image' 
                }, { status: 500 });
            }
        }

        // Initialize certifications array if it doesn't exist
        if (!Array.isArray(user.certifications)) {
            user.certifications = [];
        }

        // Create new certification
        const newCertification = {
            title,
            issuer,
            date,
            image: imageUrl || '',
            link: link || '#'
        };

        user.certifications.push(newCertification);
        await user.save();

        return NextResponse.json({ 
            message: 'Certification added successfully',
            certification: user.certifications[user.certifications.length - 1]
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding certification:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update certification
export async function PUT(request) {
    try {
        const formData = await request.formData();
        const certificationId = formData.get('certificationId');
        
        if (!certificationId) {
            return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
        }

        await connectDB();
        const user = await ensureUser();

        const certIndex = user.certifications.findIndex(c => c._id.toString() === certificationId);
        if (certIndex === -1) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        // Get form fields
        const title = formData.get('title');
        const issuer = formData.get('issuer');
        const date = formData.get('date');
        const link = formData.get('link');
        let imageUrl = formData.get('imageUrl');

        // Handle file upload if present
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            try {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Generate unique filename
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = uniqueSuffix + '-' + imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '');
                const uploadDir = 'public/uploads/certifications';
                const filePath = `${uploadDir}/${filename}`;

                // Ensure directory exists
                const fs = require('fs');
                const path = require('path');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Save file
                fs.writeFileSync(filePath, buffer);
                imageUrl = `/uploads/certifications/${filename}`;
            } catch (error) {
                console.error('Error uploading file:', error);
                return NextResponse.json({ 
                    error: 'Failed to upload image' 
                }, { status: 500 });
            }
        }

        // Update certification
        user.certifications[certIndex] = {
            ...user.certifications[certIndex].toObject(),
            title: title || user.certifications[certIndex].title,
            issuer: issuer || user.certifications[certIndex].issuer,
            date: date || user.certifications[certIndex].date,
            image: imageUrl || user.certifications[certIndex].image,
            link: link || user.certifications[certIndex].link,
            _id: user.certifications[certIndex]._id
        };

        await user.save();

        return NextResponse.json({ 
            message: 'Certification updated successfully',
            certification: user.certifications[certIndex]
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating certification:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE certification
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const certificationId = searchParams.get('id');
        
        if (!certificationId) {
            return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
        }

        await connectDB();
        const user = await ensureUser();

        const certIndex = user.certifications.findIndex(c => c._id.toString() === certificationId);
        if (certIndex === -1) {
            return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
        }

        // Delete the image file if it exists
        const imageUrl = user.certifications[certIndex].image;
        if (imageUrl && imageUrl.startsWith('/uploads/certifications/')) {
            try {
                const fs = require('fs');
                const path = require('path');
                const filePath = path.join(process.cwd(), 'public', imageUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error('Error deleting image file:', error);
            }
        }

        user.certifications.splice(certIndex, 1);
        await user.save();

        return NextResponse.json({ 
            message: 'Certification deleted successfully',
            deletedId: certificationId
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting certification:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 