import Navigation from "@/components/Navigation";

export default function CertificationsPage() {
  const certifications = [
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      image: "/images/aws-cert.png", // Add your certification images
      link: "#"
    },
    {
      title: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2023",
      image: "/images/psm-cert.png",
      link: "#"
    },
    // ... Add more certifications as needed
  ];

  return (
    <div className="min-h-screen pt-20 px-8">

      <div className="max-w-4xl mx-auto mt-5">
        <h1 className="text-3xl font-bold mb-8">Certifications</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <a 
              key={index} 
              href={cert.link}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <img 
                src={cert.image} 
                alt={cert.title}
                className="w-16 h-16 object-contain mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{cert.title}</h2>
              <p className="text-foreground/60 mb-1">{cert.issuer}</p>
              <p className="text-foreground/60">{cert.date}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 