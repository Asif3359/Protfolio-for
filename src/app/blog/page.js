import Navigation from "@/components/Navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

async function getData() {
    try {
        await connectDB();
        const user = await User.findOne({});
        return { user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { user: null };
    }
}

async function getBlogPosts() {
    try {
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            throw new Error('No user data found');
        }

        // Initialize empty array if blogPosts doesn't exist
        if (!user.blogPosts) {
            return [];
        }

        // Sort posts by date in descending order and only return published posts
        const posts = user.blogPosts
            .filter(post => post?.published)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(post => ({
                ...post.toObject(),
                _id: post._id.toString(),
                date: post.date.toISOString().split('T')[0]
            }));

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export default async function BlogPage() {
    const blogPosts = await getBlogPosts();
    const { user } = await getData();
    return (
        <div className="min-h-screen pt-20 px-8">
            <Navigation userData={user}></Navigation>
            <div className="max-w-4xl mx-auto mt-5">
                <h1 className="text-3xl font-bold mb-8">Blog</h1>
                {blogPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold mb-4">No Posts Yet</h2>
                        <p className="text-foreground/60">Check back later for new content!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {blogPosts.map((post) => (
                            <article key={post._id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title hover:text-primary transition-colors">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="text-sm text-foreground/60">{post.date}</p>
                                    <p className="text-foreground/80">{post.excerpt}</p>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {post.tags.map((tag, index) => (
                                                <span key={index} className="badge badge-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="card-actions justify-end mt-4">
                                        <Link 
                                            href={`/blog/${post.slug}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 