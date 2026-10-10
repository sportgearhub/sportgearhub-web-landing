import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { activityIcon } from '~/lib/activity-icons';
import { formatMoney, MIN_SHOWN_COUNT, plural, type ActivityCard, type CategoryRow } from '~/lib/catalog';
import { appLink } from '~/lib/config';

const offers = (n: number) => `${n} ${plural(n, ['предложение', 'предложения', 'предложений'])}`;

/**
 * «Чем займёмся?»: one card per activity with offers. On top its cover (a curated photo, else a real offer's) with its
 * icon and name, opening the app's catalogue for the activity; under it the categories it has, each a row with a real
 * offer's photo and the cheapest price, opening that category within the activity. Counts only from MIN_SHOWN_COUNT.
 * Plain links, so it works before hydration. A swipe row on phones, a grid from tablets.
 */
export function ActivityCards({ items }: { items: ActivityCard[] }) {
  return (
    <ul className="snap-row gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {items.map((a) => {
        const Icon = activityIcon(a.slug);
        return (
          // Flat: a light panel, no shadow (a shadow reads as a frame, and a scrolling row would clip it).
          <li key={a.slug} className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-canvas sm:w-auto">
            <a
              href={appLink('/', { activity: a.slug })}
              className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden p-4 text-white outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:ring-inset sm:p-5"
            >
              {a.imageUrl ? (
                <img src={a.imageUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              ) : (
                <span className="absolute inset-0 -z-10 bg-gradient-to-br from-primary to-brand" aria-hidden />
              )}
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-transparent" aria-hidden />
              <span className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur-md" aria-hidden>
                <Icon className="size-5" />
              </span>
              <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/90 text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
                <ArrowUpRight className="size-5" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight">{a.title}</span>
              <span className="mt-0.5 text-sm text-white/85">{a.count >= MIN_SHOWN_COUNT ? offers(a.count) : (a.hint ?? 'Смотреть предложения')}</span>
            </a>
            {a.categories.length ? (
              <ul className="grid flex-1 content-start gap-0.5 p-2">
                {a.categories.map((c) => (
                  <Row key={c.slug} category={c} activity={a.slug} />
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Row({ category: c, activity }: { category: CategoryRow; activity: string }) {
  const meta = [c.from != null ? `от ${formatMoney(c.from)}` : null, c.count >= MIN_SHOWN_COUNT ? offers(c.count) : null].filter(Boolean).join(' · ');
  return (
    <li>
      <a
        href={appLink('/', { category: c.slug, activity })}
        className="group flex min-h-14 items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors outline-none hover:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/40"
      >
        <span className="size-11 shrink-0 overflow-hidden rounded-xl bg-card">
          {c.imageUrl ? <img src={c.imageUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{c.title}</span>
          {meta ? <span className="block truncate text-sm text-muted-foreground">{meta}</span> : null}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
      </a>
    </li>
  );
}
