import { appLink } from '~/lib/config';
import type { Activity, Category, City } from '~/lib/catalog';

/** Crawlable entry points into the catalogue, in one quiet block above the footer (never a wall of links mid-page). */
export function PopularLinks({ categories, activities, cities }: { categories: Category[]; activities: Activity[]; cities: City[] }) {
  const groups = [
    { title: 'Категории', links: categories.map((c) => ({ label: c.title, href: appLink('/', { category: c.slug }) })) },
    { title: 'Чем заняться', links: activities.map((a) => ({ label: a.title, href: appLink('/', { activity: a.slug }) })) },
    { title: 'Города', links: cities.map((c) => ({ label: `Прокат снаряжения: ${c.name}`, href: appLink('/', { city: c.slug }) })) },
  ].filter((g) => g.links.length);
  if (!groups.length) return null;

  return (
    <section aria-label="Популярное" className="border-t">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="text-sm font-semibold">{g.title}</h2>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground sm:grid sm:gap-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-foreground hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </section>
  );
}
