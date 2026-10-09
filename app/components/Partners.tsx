import { Store } from 'lucide-react';
import { appLink } from '~/lib/config';
import { plural, type sellersOf } from '~/lib/catalog';

type Seller = ReturnType<typeof sellersOf>[number];

/** The rental shops behind the offers, as people-like cards (Tripster's guides): each opens its page in the app. */
export function Partners({ sellers }: { sellers: Seller[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {sellers.map((s) => (
        <li key={s.key}>
          <a
            href={appLink(`/providers/${encodeURIComponent(s.key)}`)}
            className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-4 transition-shadow outline-none hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
              <img src={s.imageUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              <span className="absolute right-0 bottom-0 grid size-6 place-items-center rounded-full border-2 border-card bg-foreground text-background">
                <Store className="size-3" aria-hidden />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold group-hover:text-primary">{s.name}</span>
              {s.description ? <span className="line-clamp-1 text-sm text-muted-foreground">{s.description}</span> : null}
              <span className="mt-1 block text-sm">
                {s.offers} {plural(s.offers, ['предложение', 'предложения', 'предложений'])}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
