import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET all blog posts
export async function GET() {
    try {
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Initialize empty array if blogPosts doesn't exist
        if (!user.blogPosts) {
            return NextResponse.json({ posts: [] }, { status: 200 });
        }

        // Sort posts by date in descending order
        const posts = user.blogPosts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(post => ({
                ...post.toObject(),
                _id: post._id.toString(),
                date: post.date.toISOString()
            }));

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new blog post
export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Received blog post data:', body);
        
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            console.error('No user found in database');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Initialize blogPosts array if it doesn't exist
        if (!Array.isArray(user.blogPosts)) {
            user.blogPosts = [];
        }

        // Validate required fields
        const requiredFields = ['title', 'content', 'excerpt'];
        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            return NextResponse.json({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            }, { status: 400 });
        }

        // Generate slug from title if not provided
        const slug = body.slug || body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check for duplicate slug
        if (user.blogPosts.some(post => post.slug === slug)) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }

        // Create new post object
        const newPost = {
            ...body,
            slug,
            date: new Date(),
            published: body.published ?? true,
            tags: body.tags || []
        };

        // Add post to array
        user.blogPosts.push(newPost);
        
        try {
            const savedUser = await user.save();
            console.log('Post saved successfully. Total posts:', savedUser.blogPosts.length);
            
            return NextResponse.json({ 
                message: 'Blog post added successfully',
                post: {
                    ...newPost,
                    _id: savedUser.blogPosts[savedUser.blogPosts.length - 1]._id
                }
            }, { status: 201 });
        } catch (saveError) {
            console.error('Error saving to database:', saveError);
            return NextResponse.json({ 
                error: 'Database error: ' + saveError.message 
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update blog post
export async function PUT(request) {
    try {
        const body = await request.json();
        const { postId, ...updateData } = body;
        
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const postIndex = user.blogPosts.findIndex(p => p._id.toString() === postId);
        if (postIndex === -1) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        // Check for duplicate slug if slug is being updated
        if (updateData.slug && 
            user.blogPosts.some(post => 
                post.slug === updateData.slug && 
                post._id.toString() !== postId
            )
        ) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
        }

        // Update the post
        user.blogPosts[postIndex] = {
            ...user.blogPosts[postIndex].toObject(),
            ...updateData,
            _id: user.blogPosts[postIndex]._id
        };

        await user.save();
        console.log('Post updated successfully');

        return NextResponse.json({ 
            message: 'Blog post updated successfully',
            post: user.blogPosts[postIndex]
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE blog post
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('id');
        
        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const postIndex = user.blogPosts.findIndex(p => p._id.toString() === postId);
        if (postIndex === -1) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        // Remove the post
        user.blogPosts.splice(postIndex, 1);
        await user.save();
        console.log('Post deleted successfully');

        return NextResponse.json({ 
            message: 'Blog post deleted successfully',
            deletedId: postId
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

