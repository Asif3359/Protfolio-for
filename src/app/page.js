import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import CodeAnimation from "@/components/CodeAnimation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

async function getData() {
    try {
        await connectDB();
        const users = await User.find({ isApproved: true }).lean();
        
        // For the home page, we'll show the first approved user's data
        // Later you can add a feature to select which user's portfolio to view
        const user = users[0] || null;

        // Convert MongoDB document to plain object and handle dates
        const sanitizedUser = user ? {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt?.toISOString(),
            updatedAt: user.updatedAt?.toISOString(),
            // Handle nested dates in arrays
            experience: user.experience?.map(exp => ({
                ...exp,
                _id: exp._id.toString(),
                startDate: exp.startDate?.toISOString(),
                endDate: exp.endDate?.toISOString()
            })),
            education: user.education?.map(edu => ({
                ...edu,
                _id: edu._id.toString(),
                startDate: edu.startDate?.toISOString(),
                endDate: edu.endDate?.toISOString()
            })),
            blogPosts: user.blogPosts?.map(post => ({
                ...post,
                _id: post._id.toString(),
                date: post.date?.toISOString()
            })),
            projects: user.projects?.map(proj => ({
                ...proj,
                _id: proj._id.toString()
            })),
            skills: user.skills?.map(skill => ({
                ...skill,
                _id: skill._id.toString()
            })),
            certifications: user.certifications?.map(cert => ({
                ...cert,
                _id: cert._id.toString()
            }))
        } : null;

        return { user: sanitizedUser };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { user: null };
    }
}

export default async function Home() {
    const { user } = await getData();

    // Organize skills by category
    const skillsByCategory = user?.skills?.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {}) || {};

    const tools = Object.entries(skillsByCategory).map(([category, skills]) => ({
        category,
        skills: skills.map(skill => ({
            name: skill.name,
            proficiency: skill.proficiency,
            icon: `/icons/${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`
        }))
    }));

    return (
        <div className="min-h-screen bg-background">
            <Navigation userData={user}></Navigation>
            <HeroSection userData={user} />

            {/* About Me Section */}
            <section className="py-20 ">
                <div className="max-w-6xl mx-auto px-8">
                    <h2 className="text-4xl font-bold mb-12 text-center border-b-2 border-primary pb-4">About Me</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left side - Text content */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">I Am {user?.name}</h2>
                            <p className="text-lg opacity-60">
                                {user?.aboutYourself
                                    ? user.aboutYourself.length > 100
                                        ? user.aboutYourself.substring(0, 300) + '...'
                                        : user.aboutYourself
                                    : 'Loading bio...'}

                                {user?.aboutYourself && user.aboutYourself.length > 300 && (
                                    <span className="pt-0">
                                        <Link href="/about" className="btn btn-link btn-sm">
                                            See More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                            </svg>
                                        </Link>
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Right side - Code Animation */}
                        <div className="relative h-[300px] flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full max-w-[300px] max-h-[300px] relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg filter blur-xl">
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <CodeAnimation />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-20 bg-base-200">
                <div className="max-w-6xl mx-auto px-8">
                    <h2 className="text-4xl font-bold mb-12 text-center border-b-2 border-primary pb-4">Skills & Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.map(({ category, skills }) => (
                            <div key={category} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-xl mb-4">{category}</h3>
                                    <div className="space-y-4">
                                        {skills.map((skill) => (
                                            <div key={skill.name}>
                                                <div className="flex justify-between mb-1">
                                                    <span>{skill.name}</span>
                                                    <span>{skill.proficiency}%</span>
                                                </div>
                                                <div className="w-full bg-base-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${skill.proficiency}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/about#skills" className="btn btn-primary">
                            View All Skills
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20">
                <div className="max-w-2xl mx-auto px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
                    <div className="flex justify-center gap-6">
                        {user?.socialLinks?.github && (
                            <a
                                href={user.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                GitHub
                            </a>
                        )}
                        {user?.socialLinks?.linkedin && (
                            <a
                                href={user.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                LinkedIn
                            </a>
                        )}
                        {user?.socialLinks?.facebook && (
                            <a
                                href={user.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                Facebook
                            </a>
                        )}
                        {user?.contact?.email && (
                            <a
                                href={`mailto:${user.contact.email}`}
                                className="hover:text-blue-600 transition-colors"
                            >
                                Email
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
