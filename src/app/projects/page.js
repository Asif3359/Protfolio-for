import Navigation from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

async function getProjects() {
    try {
        await connectDB();
        const user = await User.findOne({});
        
        if (!user) {
            throw new Error('No user data found');
        }

        return JSON.parse(JSON.stringify(user.projects)) || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-background py-20">
            <Navigation />
            <div className="max-w-6xl mx-auto px-8 pt-5">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold">All Projects</h1>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold mb-4">No Projects Found</h2>
                        <p className="text-foreground/60">Projects will appear here once added.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project._id} className="card bg-base-100 shadow-xl overflow-hidden">
                                <figure className="aspect-video relative">
                                    <Image
                                        src={project.image || '/placeholder-project.jpg'}
                                        alt={`${project.title} preview`}
                                        fill
                                        className="object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h3 className="card-title">{project.title}</h3>
                                    <p className="text-foreground/60">{project.description.slice(0, 300) + '...'}</p>
                                    {project.technologies && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.technologies.split(',').map((tech, index) => (
                                                <span key={index} className="badge badge-primary">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="card-actions justify-end mt-4">
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                className="btn btn-primary btn-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Live Demo
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                className="btn btn-outline btn-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 