export default function sitemap() {
  const baseUrl = 'https://asvind-portfolio-3d-sand.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // If you want the model-capture page to be found by Google, uncomment this block:
    // {
    //   url: `${baseUrl}/model-capture`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];
}
