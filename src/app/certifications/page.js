import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Image from "next/image";
import Navigation from "@/components/Navigation";

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

async function getCertifications() {
  try {
    await connectDB();
    const user = await User.findOne({});

    if (!user || !user.certifications) {
      return [];
    }

    return user.certifications.map(cert => ({
      ...cert.toObject(),
      _id: cert._id.toString()
    }));
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

export default async function CertificationsPage() {
  const { user } = await getData();
  const certifications = await getCertifications();

  return (
    <main className=" bg-base-100">
      {/* Header Section */}
      <Navigation userData={user}></Navigation>
      <div className="bg-base-100 mt-20  py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Certifications & Achievements
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {certifications.length === 0 ? (
          <div className="text-center py-20  rounded-lg shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              No Certifications Yet
            </h2>
            <p className="text-foreground/60">
              Check back later for certifications and achievements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {certifications.map((cert) => (
              <a
                key={cert._id}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block  rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-2 border-base-200"
              >
                {/* Image Container */}
                <div className="aspect-[4/3]  relative overflow-hidden bg-gray-100 border-b">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-200">
                      <svg
                        className="w-16 h-16 text-base-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-6 bg-base-100 ">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-foreground/60">
                      <span className="font-medium">Issuer:</span> {cert.issuer}
                    </p>
                    <p className="text-sm sm:text-base text-foreground/60">
                      <span className="font-medium">Date:</span> {cert.date}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center text-sm text-primary group-hover:text-primary-focus">
                        View Certificate
                        <svg
                          className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 