import { createElement } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { activityIcon, activityTone } from '~/lib/activity-icons';
import { plural, type TaxonomyActivity } from '~/lib/catalog';
import { appLink } from '~/lib/config';
import { cn } from '~/lib/utils';

/**
 * Every activity the platform covers, as tiles in its colour: icon, name, a few of its kinds of gear and how many there
 * are in all. An activity that can be booked now says so and opens the app's catalogue on it; the rest are shown
 * without a link (they would open an empty page), so the grid tells what exists from what is stocked.
 */
export function ActivityGrid({ taxonomy }: { taxonomy: TaxonomyActivity[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {taxonomy.map((a) => {
        const tone = activityTone(a.slug);
        const live = a.count > 0;
        const examples = a.categories.slice(0, 3).map((c) => c.title.toLowerCase());
        const rest = a.categories.length - examples.length;
        const body = (
          <>
            <span className="flex items-start justify-between">
              <span className={cn('grid size-12 place-items-center rounded-2xl transition-transform group-hover:scale-105', tone.ground)}>
                {createElement(activityIcon(a.slug), { className: cn('size-6', tone.icon), 'aria-hidden': true })}
              </span>
              {live ? <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /> : null}
            </span>
            <span className="mt-4 block font-bold">{a.title}</span>
            <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground first-letter:uppercase">
              {examples.join(', ')}
              {rest > 0 ? ` и ещё ${rest}` : ''}
            </span>
            <span className={cn('mt-3 inline-flex items-center gap-1.5 text-xs font-semibold', live ? 'text-success' : 'text-muted-foreground')}>
              {live ? <span className="size-1.5 rounded-full bg-success" aria-hidden /> : null}
              {live ? 'Можно забронировать' : `${a.categories.length} ${plural(a.categories.length, ['вид', 'вида', 'видов'])} снаряжения`}
            </span>
          </>
        );
        const tile = 'group flex h-full flex-col rounded-3xl border bg-card p-4 sm:p-5';
        return (
          <li key={a.slug}>
            {live ? (
              <a
                href={appLink('/', { activity: a.slug })}
                className={cn(tile, 'transition-[box-shadow,transform] outline-none hover:-translate-y-0.5 hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-ring/40')}
              >
                {body}
              </a>
            ) : (
              <div className={tile}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
