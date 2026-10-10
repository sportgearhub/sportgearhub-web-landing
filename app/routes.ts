import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('sellers', 'routes/sellers.tsx'),
  route('documents', 'routes/documents.tsx'),
  // A page per category and activity with offers (the list is react-router.config's prerender).
  route('rent/:category', 'routes/rent.tsx'),
  route('activities/:activity', 'routes/activity.tsx'),
  // Served by the static server for any unknown path (see sws.toml).
  route('404', 'routes/not-found.tsx'),
  route('sitemap.xml', 'routes/sitemap.ts'),
] satisfies RouteConfig;
