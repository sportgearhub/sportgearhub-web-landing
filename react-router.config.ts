import type { Config } from '@react-router/dev/config';
import { activityPath, rentPath } from './app/lib/catalog';

const API = (process.env.VITE_API_BASE_URL || 'https://api.sportgearhub.ru').replace(/\/+$/, '');

/**
 * The category and activity pages worth building: those with offers right now (`/products/options`), read once per
 * build. If the API is down, none — the build still succeeds with the fixed pages, as everywhere else.
 */
async function catalogPaths(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/api/v1/products/options?locale=ru-RU`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const options = (await res.json()) as { categories: { slug: string; count: number }[]; activities: { slug: string; count: number }[] };
    return [
      ...options.categories.filter((c) => c.count > 0).map((c) => rentPath(c.slug)),
      ...options.activities.filter((a) => a.count > 0).map((a) => activityPath(a.slug)),
    ];
  } catch (error) {
    console.warn(`[landing] catalogue pages skipped: /products/options unavailable at build time (${(error as Error).message}).`);
    return [];
  }
}

/**
 * Static site: every route is rendered to HTML at build time (its loader runs then, against the live API), and
 * static-web-server serves the files. No runtime server: no `action`/`headers` exports. The fixed pages, plus a page
 * per category and activity with offers.
 */
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), ...(await catalogPaths())];
  },
} satisfies Config;
