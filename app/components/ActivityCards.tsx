import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { activityGradient, activityIcon } from '~/lib/activity-icons';
import { formatMoney, MIN_SHOWN_COUNT, plural, type ActivityCard, type CategoryRow } from '~/lib/catalog';
import { appLink } from '~/lib/config';
import { HeroBackdrop } from './HeroBackdrop';

const offers = (n: number) => `${n} ${plural(n, ['предложение', 'предложения', 'предложений'])}`;

/**
 * «Чем займёмся?»: one card per activity with offers. On top its cover, drawn rather than photographed: a gradient
 * in the activity's hue with faint copies of its icon floating over a dot grid (HeroBackdrop), and the icon itself
 * large in a frosted bubble that lifts on hover; then its name, opening the app's catalogue for the activity; under it the categories it has, each a row with a real
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
              <HeroBackdrop background={activityGradient(a.slug)} icons={[Icon, Icon, Icon, Icon, Icon, Icon]} />
              <span className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/35 to-transparent" aria-hidden />
              {/* Outer: placement and the hover lift; inner: the bubble floating (`float` moves `translate` too, so the
                  two can't share an element). */}
              <span className="absolute top-1/2 right-5 -translate-y-[60%] transition-transform duration-500 group-hover:-translate-y-[70%]" aria-hidden>
                <span className="float grid size-20 place-items-center rounded-3xl bg-white/20 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.45)] ring-1 ring-white/40 backdrop-blur-md transition-[rotate] duration-500 group-hover:-rotate-6 sm:size-24">
                  <Icon className="size-10 text-white sm:size-12" strokeWidth={1.75} />
                </span>
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
