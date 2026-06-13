import { projectsData } from "@/lib/projectsData";

export default function sitemap() {
  const baseUrl = 'https://asvind-portfolio-3d-sand.vercel.app';

  // Base URLs
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Dynamically add all projects
  for (const catKey in projectsData) {
    const cat = projectsData[catKey];
    for (const sub of cat.subcategories) {
      for (const proj of sub.projects) {
        routes.push({
          url: `${baseUrl}/?project=${proj.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  }

  return routes;
}
