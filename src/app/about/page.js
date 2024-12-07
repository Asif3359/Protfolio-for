import Image from "next/image";
import Navigation from "@/components/Navigation";
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

export default async function AboutPage() {
  const { user } = await getData();

  // Organize skills by category
  const skillsByCategory = user?.skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  // Sort experience by date
  const sortedExperience = user?.experience?.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  }) || [];

  // Sort education by date
  const sortedEducation = user?.education?.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation userData={user}></Navigation>
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-base-200">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold">About Me</h1>
                <p className="text-lg opacity-60">
                  {user?.bio || 'Loading...'}
                </p>
              </div>
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                <Image
                  src={user?.image || "https://img.freepik.com/premium-psd/woman-with-black-shirt-that-says-i-love-you-it_176841-44070.jpg"}
                  alt={user?.name || "Profile picture"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Background Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">About Myself</h2>
                <p className="text-lg opacity-60">
                  {user?.aboutYourself || 'Loading...'}
                </p>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">My Background</h2>
                <p className="text-lg opacity-60">
                  {user?.background || 'Loading...'}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Technical Skills</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-xl font-semibold">{category}</h3>
                      <ul className="list-disc list-inside space-y-2 opacity-60 ml-4">
                        {skills.map((skill) => (
                          <li key={skill.name} className="flex items-center justify-between">
                            <span>{skill.name}</span>
                            <span className="text-sm opacity-75">{skill.proficiency}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Experience</h2>
                <div className="space-y-8">
                  {sortedExperience.map((exp) => (
                    <div key={exp._id} className="space-y-2">
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      <p className="opacity-60">
                        {exp.company} • {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                      </p>
                      <p className="opacity-60">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Education</h2>
                {sortedEducation.map((edu) => (
                  <div key={edu._id} className="space-y-2">
                    <h3 className="text-xl font-semibold">{edu.degree} in {edu.field}</h3>
                    <p className="opacity-60">
                      {edu.school} • {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                    </p>
                    {edu.description && (
                      <p className="opacity-60">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 