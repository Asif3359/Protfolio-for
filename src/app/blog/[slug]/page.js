import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

async function getBlogPost(slug) {
    try {
        await connectDB();
        const user = await User.findOne({
            'blogPosts.slug': slug
        });

        if (!user) {
            return null;
        }

        const post = user.blogPosts.find(post => post.slug === slug);
        if (!post || !post.published) {
            return null;
        }

        return {
            ...post.toObject(),
            _id: post._id.toString(),
            date: post.date.toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export default async function BlogPostPage({ params }) {
    const post = await getBlogPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-20 px-8">
            <div className="max-w-4xl mx-auto mt-5">
                {/* Back button */}
                <Link 
                    href="/blog"
                    className="btn btn-ghost btn-sm mb-8 gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                </Link>

                {/* Post header */}
                <article className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-foreground/60 mb-8">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                    <span key={index} className="badge badge-primary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Post content */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {/* Render excerpt as subtitle */}
                            <p className="text-xl text-foreground/80 mb-8 italic">
                                {post.excerpt}
                            </p>

                            {/* Main content */}
                            <div className="prose prose-lg max-w-none">
                                {/* Split content by newlines and map to paragraphs */}
                                {post.content.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && (
                                        <p key={index} className="mb-4">
                                            {paragraph}
                                        </p>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
} 