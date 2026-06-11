export default function robots() {
  const baseUrl = 'https://asvind-portfolio-3d-sand.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
