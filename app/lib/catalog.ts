/**
 * Public catalogue data as the landing uses it: the API's wire shapes (snake_case, read at build time) mapped to small
 * camelCase shapes, and the pure logic that arranges them (activities and their categories, seasons). No fetching here.
 */

// ---- wire shapes (only the fields the landing reads) --------------------------------------------------------------

export type WireActivity = { slug: string; title: string };

/** A category with its live count (`/products/options`); only stocked ones matter here. */
export type WireCategory = { slug: string; title: string; count: number; activities: WireActivity[] };

/** `GET /products/options`: categories and activities with counts for the scope (and sort orders, unused here). */
export type WireOptions = { categories: WireCategory[]; activities: (WireActivity & { count: number })[] };

/** `GET /catalog/categories`: the platform's whole tree, empty categories included, no counts; groups via `parent_id`. */
export type WireTreeCategory = { category_id: string; parent_id: string | null; slug: string; name: string; activities: WireActivity[] };

/** A `/products` item (since 2026-10-10): what a tile draws, nothing else. */
export type WireProduct = { product_id: string; title: string; price: number | null; images?: { url: string; sort_order: number }[] | null };

// ---- landing shapes ------------------------------------------------------------------------------------------------

export type Activity = { slug: string; title: string };
export type Category = { slug: string; title: string; count: number; activities: Activity[] };

/** A real offer: links to its page in the app. */
export type ProductCard = {
  kind: 'product';
  id: string;
  title: string;
  price: number | null;
  /** The main photo: the first of `images`. */
  imageUrl: string;
  /** Every photo in the seller's order, at most MAX_CARD_IMAGES (the card cycles through them). */
  images: string[];
};

/** A curated photo for an activity (content.ts): the activity card's cover when there is one. */
export type ShowcaseCard = { kind: 'showcase'; id: string; title: string; hint: string; imageUrl: string; activity: string };

/** A category inside an activity card: a real offer's photo and the lowest price, both from the API. */
export type CategoryRow = { slug: string; title: string; count: number; from: number | null; imageUrl: string | null };

/** «Чем займёмся?»: an activity with offers (its cover is drawn from its icon and hue) and its stocked categories. */
export type ActivityCard = {
  slug: string;
  title: string;
  count: number;
  /** A line from the curated showcase, shown while the count is too small to show. */
  hint: string | null;
  categories: CategoryRow[];
};

/** The whole catalogue by activity: every kind of gear the platform takes, with how many offers each has now (often 0). */
export type TaxonomyActivity = { slug: string; title: string; count: number; categories: { slug: string; title: string; count: number }[] };

/** A media path from the API (`/api/v1/media/…`) is relative to the API host. */
export function resolveMediaUrl(url: string | null | undefined, apiBaseUrl: string): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** A card shows this many photos at most: more dots stop reading as dots. */
export const MAX_CARD_IMAGES = 5;

/** Products without a photo are left out: the landing is pictures first. */
export function toProductCards(products: WireProduct[], apiBaseUrl: string): ProductCard[] {
  return products.flatMap((p) => {
    const urls = [...(p.images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => resolveMediaUrl(i.url, apiBaseUrl))
      .filter((u): u is string => !!u);
    const images = [...new Set(urls)].slice(0, MAX_CARD_IMAGES);
    const imageUrl = images[0];
    if (!imageUrl) return [];
    return [{ kind: 'product' as const, id: p.product_id, title: p.title, price: p.price, imageUrl, images }];
  });
}

/** What a sample of offers gives a card: the lowest price among them and the first photo. */
export type Sample = { from: number | null; imageUrl: string | null };

/** A few offers (a category's cheapest, an activity's newest) → their lowest price and first photo; none → undefined. */
export function sampleOf(products: WireProduct[] | null | undefined, apiBaseUrl: string): Sample | undefined {
  if (!products?.length) return undefined;
  const prices = products.map((p) => p.price).filter((p): p is number => p != null);
  return { from: prices.length ? Math.min(...prices) : null, imageUrl: toProductCards(products, apiBaseUrl)[0]?.imageUrl ?? null };
}

export const toCategories = (categories: WireCategory[]): Category[] =>
  categories.map((c) => ({ slug: c.slug, title: c.title, count: c.count, activities: c.activities.map((a) => ({ slug: a.slug, title: a.title })) }));


// ---- addresses ----------------------------------------------------------------------------------------------------

/** The API's slugs (`sup_board`) as URL slugs (`sup-board`): English, lowercase, hyphens. And back. */
export const toUrlSlug = (apiSlug: string) => apiSlug.replace(/_/g, '-');
export const toApiSlug = (urlSlug: string) => urlSlug.replace(/-/g, '_');

/** A category's page (`/rent/skis`) and an activity's (`/activities/winter-sports`). */
export const rentPath = (category: string) => `/rent/${toUrlSlug(category)}`;
export const activityPath = (activity: string) => `/activities/${toUrlSlug(activity)}`;

/** The header's «Прокат» menu and the footer's column: what has offers now, each with its activity for the icon. */
export type NavCatalog = { activities: Activity[]; categories: (Activity & { activity: string })[] };

export function navCatalog(options: WireOptions | null | undefined): NavCatalog {
  return {
    activities: (options?.activities ?? []).filter((a) => a.count > 0).map((a) => ({ slug: a.slug, title: a.title })),
    categories: (options?.categories ?? [])
      .filter((c) => c.count > 0)
      .map((c) => ({ slug: c.slug, title: c.title, activity: c.activities[0]?.slug ?? c.slug })),
  };
}

// ---- arranging ----------------------------------------------------------------------------------------------------

/** Below this a count reads as "almost nothing here": cards show the price alone. */
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

/** Categories with offers right now: an empty one would open an empty catalogue. */
export const liveCategories = (categories: Category[]): Category[] => categories.filter((c) => c.count > 0);

/**
 * «Чем займёмся?»: every activity with offers, in season first, then by how much it has. Each lists its stocked
 * categories (a category can sit under several), with a real offer's photo and the cheapest price from `byCategory`.
 * Nothing is invented: an activity or category without offers isn't shown.
 */
export function activityCards(
  activities: (Activity & { count: number })[],
  categories: Category[],
  samples: { byCategory: Record<string, Sample | undefined> },
  showcase: ShowcaseCard[],
  season: SeasonKey,
): ActivityCard[] {
  const inSeason = season === 'offseason' ? [] : SEASON_ACTIVITIES[season];
  const rows = (activity: string): CategoryRow[] =>
    liveCategories(categories)
      .filter((c) => c.activities.some((a) => a.slug === activity))
      .map((c) => {
        const sample = samples.byCategory[c.slug];
        return { slug: c.slug, title: c.title, count: c.count, from: sample?.from ?? null, imageUrl: sample?.imageUrl ?? null };
      });
  return activities
    .filter((a) => a.count > 0)
    .map((a) => {
      const curated = showcase.find((s) => s.activity === a.slug);
      return {
        slug: a.slug,
        title: a.title,
        count: a.count,
        hint: curated?.hint ?? null,
        categories: rows(a.slug),
      };
    })
    .sort((x, y) => Number(inSeason.includes(y.slug)) - Number(inSeason.includes(x.slug)) || y.count - x.count);
}

/**
 * Every activity the platform covers with the kinds of gear under it (the tree's leaves: groups are only headings),
 * each with its live count (0 when nobody rents it yet). Activities with offers first, by count; then by how much they
 * cover. This is what exists, not what is stocked: the UI must tell the two apart.
 */
export function taxonomyOf(tree: WireTreeCategory[], live: Category[]): TaxonomyActivity[] {
  const parents = new Set(tree.map((c) => c.parent_id).filter(Boolean));
  const counts = new Map(live.map((c) => [c.slug, c.count]));
  const byActivity = new Map<string, TaxonomyActivity>();
  for (const c of tree) {
    if (parents.has(c.category_id)) continue;
    const count = counts.get(c.slug) ?? 0;
    for (const a of c.activities) {
      const entry = byActivity.get(a.slug) ?? { slug: a.slug, title: a.title, count: 0, categories: [] };
      entry.categories.push({ slug: c.slug, title: c.name, count });
      entry.count += count;
      byActivity.set(a.slug, entry);
    }
  }
  return [...byActivity.values()].sort((x, y) => y.count - x.count || y.categories.length - x.categories.length);
}

/** Every kind of gear once (a category can sit under several activities), with the activity it is listed under first. */
export function gearOf(taxonomy: TaxonomyActivity[]): { slug: string; title: string; count: number; activity: string }[] {
  const seen = new Map<string, { slug: string; title: string; count: number; activity: string }>();
  for (const a of taxonomy) for (const c of a.categories) if (!seen.has(c.slug)) seen.set(c.slug, { ...c, activity: a.slug });
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
