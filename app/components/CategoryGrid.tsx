import { appLink } from '~/lib/config';
import { formatMoney, MIN_SHOWN_COUNT, plural, priceFrom, type Category, type ProductCard } from '~/lib/catalog';
import { SHOWCASE } from '~/lib/content';

/**
 * Category tiles: a real offer's photo (else a curated one), the name, «от X ₽» from the live offers, and the number
 * of offers once it is worth showing. Without live data, the curated tiles by activity.
 */
export function CategoryGrid({ categories, products }: { categories: Category[]; products: ProductCard[] }) {
  const tiles = categories.length
    ? categories.map((c) => {
        const from = priceFrom(products, c.slug);
        const count = c.count >= MIN_SHOWN_COUNT ? `${c.count} ${plural(c.count, ['предложение', 'предложения', 'предложений'])}` : null;
        return {
          key: c.slug,
          title: c.title,
          hint: [from != null ? `от ${formatMoney(from)}` : null, count].filter(Boolean).join(' · ') || 'Смотреть',
          href: appLink('/', { category: c.slug }),
          imageUrl:
            products.find((p) => p.categorySlug === c.slug)?.imageUrl ??
            SHOWCASE.find((s) => c.activities.some((a) => a.slug === s.activity))?.imageUrl ??
            SHOWCASE[0]!.imageUrl,
        };
      })
    : SHOWCASE.map((s) => ({ key: s.id, title: s.title, hint: s.hint, href: appLink('/', { activity: s.activity }), imageUrl: s.imageUrl }));

  return (
    <ul className="snap-row gap-3 sm:grid sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {tiles.map((t) => (
        <li key={t.key} className="w-[42%] shrink-0 snap-start sm:w-auto">
          <a href={t.href} className="group block rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
            <span className="block aspect-square overflow-hidden rounded-2xl bg-muted sm:aspect-[4/3]">
              <img src={t.imageUrl} alt="" loading="lazy" decoding="async" width={480} height={360} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </span>
            <span className="mt-2.5 block font-semibold">{t.title}</span>
            <span className="block text-sm text-muted-foreground">{t.hint}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
