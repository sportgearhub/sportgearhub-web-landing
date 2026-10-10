import { config } from './config';
import type { WireOptions, WireProduct, WireTreeCategory } from './catalog';

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

/** How many products the seller count reads at most (each costs a detail request, once per build). */
const SELLER_SCAN_LIMIT = 200;

export const publicApi = {
  /** Activities and categories with live counts (and sort orders): what «Чем займёмся?» is built from. */
  options: () => get<WireOptions>('/api/v1/products/options', { locale: LOCALE }),
  /** The whole category tree, empty categories included, no counts. */
  tree: async () => (await get<{ categories: WireTreeCategory[] }>('/api/v1/catalog/categories', { locale: LOCALE }))?.categories ?? null,
  /**
   * Distinct rentals with at least one published product. The list carries no seller since 2026-10-10, so this reads
   * up to SELLER_SCAN_LIMIT products and their pages, once per build (the number is baked into the HTML). Null when the
   * API is unavailable.
   */
  sellerCount: async (): Promise<number | null> => {
    const ids: string[] = [];
    for (let page = 1; ids.length < SELLER_SCAN_LIMIT; page++) {
      const batch = await get<WireProduct[]>('/api/v1/products', { sort: 'newest', page, page_size: 50, locale: LOCALE });
      if (!batch) return null;
      ids.push(...batch.map((p) => p.product_id));
      if (batch.length < 50) break;
    }
    const sellers = new Set<string>();
    for (let i = 0; i < ids.length; i += 10) {
      const details = await Promise.all(ids.slice(i, i + 10).map((id) => get<{ seller: { seller_id: string } | null }>(`/api/v1/products/${id}`, { locale: LOCALE })));
      for (const d of details) if (d?.seller) sellers.add(d.seller.seller_id);
    }
    return sellers.size;
  },
  /** Cards (id, title, price, images). Newest first by default; `price_asc` for a category's «от» price. */
  products: ({ pageSize = 12, sort = 'newest', activity, category }: { pageSize?: number; sort?: 'newest' | 'price_asc'; activity?: string; category?: string } = {}) =>
    get<WireProduct[]>('/api/v1/products', {
      sort,
      page: 1,
      page_size: pageSize,
      locale: LOCALE,
      ...(activity ? { activity } : {}),
      ...(category ? { category } : {}),
    }),
};
