import { config } from '~/lib/config';

/** Pages worth indexing; the catalogue and offers live in the app (app.sportgearhub.ru has its own). */
const PAGES = ['/', '/about', '/partners', '/documents'];

export function loader() {
  const urls = PAGES.map((path) => `  <url><loc>${config.siteUrl}${path === '/' ? '/' : path}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
