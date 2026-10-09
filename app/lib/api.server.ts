import { config } from './config';
import type { WireCategory, WireCity, WireProduct } from './catalog';

/**
 * Build-time reads of the public API (`.server`: never shipped to the browser). A failure doesn't fail the build:
 * the page falls back to its curated content and the build log says what was missing.
 */
const LOCALE = 'ru-RU';
const TIMEOUT_MS = 15_000;

async function get<T>(path: string, query: Record<string, string | number> = {}): Promise<T | null> {
  const url = new URL(path, `${config.apiBaseUrl}/`);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, String(v));
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[landing] ${url.pathname} unavailable at build time (${(error as Error).message}); using fallback content.`);
    return null;
  }
}

export const publicApi = {
  categories: async () => (await get<{ categories: WireCategory[] }>('/api/v1/discovery/rental/categories', { locale: LOCALE }))?.categories ?? null,
  cities: () => get<WireCity[]>('/api/v1/catalog/cities'),
  /** Newest first: what the wall shows. */
  products: (pageSize = 48) => get<WireProduct[]>('/api/v1/products', { sort: 'newest', page: 1, page_size: pageSize, locale: LOCALE }),
};
