export async function getProjects() {
  const res = await fetch('http://localhost:3000/projects.json', { 
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const data = await res.json();
  return data.projects;
} 