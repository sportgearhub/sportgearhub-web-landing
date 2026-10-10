import { publicApi } from '~/lib/api.server';
import { activityPath, rentPath } from '~/lib/catalog';
import { config } from '~/lib/config';

/** Fixed pages worth indexing; the catalogue and offers live in the app (app.sportgearhub.ru has its own). */
const PAGES = ['/', '/about', '/sellers', '/documents'];

/**
 * Built with the site: the fixed pages and a page per category and activity with offers (the same list the build
 * pre-renders), each with the build date as `lastmod`.
 */
export async function loader() {
  const options = await publicApi.options();
  const catalog = [
    ...(options?.categories ?? []).filter((c) => c.count > 0).map((c) => rentPath(c.slug)),
    ...(options?.activities ?? []).filter((a) => a.count > 0).map((a) => activityPath(a.slug)),
  ];
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [...PAGES, ...catalog]
    .map((path) => `  <url><loc>${config.siteUrl}${path === '/' ? '/' : path}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
