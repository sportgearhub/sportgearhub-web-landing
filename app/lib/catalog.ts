/**
 * Public catalogue data as the landing uses it: the API's wire shapes (snake_case, read at build time) mapped to small
 * camelCase cards, and the pure logic that arranges them (the inventory wall, seasons). No fetching here.
 */

// ---- wire shapes (only the fields the landing reads) --------------------------------------------------------------

export type WireCategory = {
  slug: string;
  title: string;
  count: number;
  activities: { slug: string; title: string }[];
};

export type WireCity = { city_id: string; name: string; slug: string };

export type WireProduct = {
  product_id: string;
  title: string;
  price: number | null;
  media_preview_url: string | null;
  images?: { url: string; sort_order: number }[] | null;
  category: { slug: string; title: string } | null;
  seller: { seller_id: string; slug: string | null; display_name: string; description: string | null } | null;
};

// ---- landing shapes ------------------------------------------------------------------------------------------------

export type Category = { slug: string; title: string; count: number; activities: Activity[] };
export type Activity = { slug: string; title: string };
export type City = { name: string; slug: string };

/** A real offer on the wall: links to its page in the app. */
export type ProductCard = {
  kind: 'product';
  id: string;
  title: string;
  price: number | null;
  imageUrl: string;
  categorySlug: string | null;
  categoryTitle: string | null;
  seller: SellerRef | null;
};

/** A rental shop, as the product list names it. Linked by slug when it has one, else by id (the app takes both). */
export type SellerRef = { key: string; name: string; description: string | null };

/** A curated photo tile for an activity: categories' fallback cover and the collections. */
export type ShowcaseCard = { kind: 'showcase'; id: string; title: string; hint: string; imageUrl: string; activity: string };

/** A media path from the API (`/api/v1/media/…`) is relative to the API host. */
export function resolveMediaUrl(url: string | null | undefined, apiBaseUrl: string): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Products without a photo are left out: the wall is pictures first. */
export function toProductCards(products: WireProduct[], apiBaseUrl: string): ProductCard[] {
  return products.flatMap((p) => {
    const first = [...(p.images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? p.media_preview_url;
    const imageUrl = resolveMediaUrl(first, apiBaseUrl);
    if (!imageUrl) return [];
    const seller = p.seller ? { key: p.seller.slug ?? p.seller.seller_id, name: p.seller.display_name, description: p.seller.description } : null;
    return [
      { kind: 'product' as const, id: p.product_id, title: p.title, price: p.price, imageUrl, categorySlug: p.category?.slug ?? null, categoryTitle: p.category?.title ?? null, seller },
    ];
  });
}

export const toCategories = (categories: WireCategory[]): Category[] =>
  categories.map((c) => ({ slug: c.slug, title: c.title, count: c.count, activities: c.activities.map((a) => ({ slug: a.slug, title: a.title })) }));

export const toCities = (cities: WireCity[]): City[] => cities.map((c) => ({ name: c.name, slug: c.slug }));

// ---- arranging ----------------------------------------------------------------------------------------------------

/** The lowest price among a category's offers (the «от X ₽» on its tile), or null when none is priced. */
export function priceFrom(products: ProductCard[], categorySlug: string): number | null {
  const prices = products.filter((p) => p.categorySlug === categorySlug && p.price != null).map((p) => p.price!);
  return prices.length ? Math.min(...prices) : null;
}

/** Below this a count reads as "almost nothing here": tiles show the price alone. */
export const MIN_SHOWN_COUNT = 3;

export type SeasonKey = 'summer' | 'winter' | 'offseason';

/** The season a build date falls in: May–September summer, December–March winter, the rest in between. */
export function seasonOf(date: Date): SeasonKey {
  const month = date.getMonth() + 1;
  if (month >= 5 && month <= 9) return 'summer';
  if (month === 12 || month <= 3) return 'winter';
  return 'offseason';
}

/** Activities that belong to a season; the rest (tourism, active leisure…) suit any time. */
const SEASON_ACTIVITIES: Record<Exclude<SeasonKey, 'offseason'>, string[]> = {
  summer: ['water_sports', 'beach_leisure', 'cycling'],
  winter: ['winter_sports'],
};

/** Offers in season first (by their category's activities), the rest after, each group in its own order. */
export function inSeasonFirst(products: ProductCard[], categories: Category[], season: SeasonKey): ProductCard[] {
  if (season === 'offseason') return products;
  const wanted = SEASON_ACTIVITIES[season];
  const inSeason = new Set(categories.filter((c) => c.activities.some((a) => wanted.includes(a.slug))).map((c) => c.slug));
  const score = (p: ProductCard) => (p.categorySlug && inSeason.has(p.categorySlug) ? 0 : 1);
  return [...products].sort((a, b) => score(a) - score(b));
}

/** Distinct rental shops with how many of the listed offers each has, most offers first. */
export function sellersOf(products: ProductCard[]): (SellerRef & { offers: number; imageUrl: string })[] {
  const byKey = new Map<string, SellerRef & { offers: number; imageUrl: string }>();
  for (const p of products) {
    if (!p.seller) continue;
    const known = byKey.get(p.seller.key);
    if (known) known.offers += 1;
    else byKey.set(p.seller.key, { ...p.seller, offers: 1, imageUrl: p.imageUrl });
  }
  return [...byKey.values()].sort((a, b) => b.offers - a.offers);
}

/** Curated tiles whose activity really has offers now (never a collection that opens an empty catalogue). */
export function liveCollections(showcase: ShowcaseCard[], categories: Category[]): ShowcaseCard[] {
  const live = new Set(categories.filter((c) => c.count > 0).flatMap((c) => c.activities.map((a) => a.slug)));
  return showcase.filter((s) => live.has(s.activity));
}

/** Distinct activities across categories, in catalogue order. */
export function activitiesOf(categories: Category[]): Activity[] {
  const seen = new Map<string, Activity>();
  for (const c of categories) for (const a of c.activities) if (!seen.has(a.slug)) seen.set(a.slug, a);
  return [...seen.values()];
}

// ---- formatting ----------------------------------------------------------------------------------------------------

const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export const formatMoney = (amount: number) => rub.format(amount);

export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}
