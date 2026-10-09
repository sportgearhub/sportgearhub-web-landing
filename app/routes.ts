import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('partners', 'routes/partners.tsx'),
  route('documents', 'routes/documents.tsx'),
  // Served by the static server for any unknown path (see sws.toml).
  route('404', 'routes/not-found.tsx'),
  route('sitemap.xml', 'routes/sitemap.ts'),
] satisfies RouteConfig;
