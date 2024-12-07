import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
                { status: 400 }
            );
        }

        // Get file extension and generate unique filename
        const ext = file.type.split('/')[1];
        const fileName = `${uuidv4()}.${ext}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
            await writeFile(path.join(uploadDir, fileName), buffer);
        } catch (error) {
            console.error('Error saving file:', error);
            return NextResponse.json(
                { error: 'Failed to save file' },
                { status: 500 }
            );
        }

        // Return the URL for the uploaded file
        const url = `/uploads/${fileName}`;
        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error handling upload:', error);
        return NextResponse.json(
            { error: 'Failed to process upload' },
            { status: 500 }
        );
    }
}

// Increase payload size limit for image uploads
export const config = {
    api: {
        bodyParser: false,
    },
}; 