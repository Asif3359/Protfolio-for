import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen pt-20 px-8">
            <div className="max-w-4xl mx-auto mt-5 text-center">
                <h2 className="text-3xl font-bold mb-4">Blog Post Not Found</h2>
                <p className="text-foreground/60 mb-8">
                    Sorry, the blog post you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/blog" className="btn btn-primary">
                    Back to Blog
                </Link>
            </div>
        </div>
    );
} 