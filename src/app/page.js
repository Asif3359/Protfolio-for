import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

async function getData() {
  try {
    await connectDB();
    const user = await User.findOne({});

    if (!user) {
      throw new Error('No user data found');
    }

    return {
      user: JSON.parse(JSON.stringify(user))
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      user: null
    };
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

            {/* Right side - Image */}
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
              <Image
                src={user?.image || "https://img.freepik.com/premium-psd/woman-with-black-shirt-that-says-i-love-you-it_176841-44070.jpg"}
                alt={user?.name || "Profile picture"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-300/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12 text-center border-b-2 border-primary pb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user?.projects?.slice(0, 4).map((project) => (
              <div key={project._id} className="card bg-base-100 shadow-xl">
                <figure className="aspect-video relative">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    className="object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="opacity-60">{project.description.slice(0, 200) + '...'}</p>
                  <div className="flex flex-wrap gap-2 my-2">
                    {project.technologies.split(',').map((tech, index) => (
                      <span key={index} className="badge badge-outline">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions justify-end">
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
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="btn btn-primary btn-sm rounded-full"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Working Tools Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-center border-b-2 border-primary pb-4 ">Working Tools</h2>
            <p className="text-lg opacity-60 max-w-2xl mx-auto">
              Here are the primary tools and technologies I work with. I'm constantly learning and adding new skills to my toolkit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((toolCategory) => (
              <div key={toolCategory.category} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">{toolCategory.category}</h3>
                  <div className="space-y-6">
                    {toolCategory.skills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="ml-auto text-sm opacity-60">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-base-300 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency}%` }}
                          />
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
