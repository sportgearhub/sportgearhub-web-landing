import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { config } from '~/lib/config';

export type Crumb = { label: string; path: string };

/** «Главная › Прокат лыж»: the trail on the page; the last crumb is the page itself (not a link). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Навигационная цепочка" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={c.path} className="inline-flex items-center gap-1">
            {i > 0 ? <ChevronRight className="size-3.5" aria-hidden /> : null}
            {i < items.length - 1 ? (
              <Link to={c.path} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The same trail as BreadcrumbList structured data, with absolute URLs. */
export function breadcrumbLd(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: `${config.siteUrl}${c.path === '/' ? '/' : c.path}` })),
  };
}

/** Real offers as an ItemList: names and links only — no prices (production prices aren't final). */
export function offersLd(offers: { id: string; title: string }[]) {
  return {
    '@type': 'ItemList',
    itemListElement: offers.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.title, url: `${config.appUrl}/offers/${o.id}` })),
  };
}
