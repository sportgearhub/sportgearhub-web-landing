import { createElement } from 'react';
import { activityIcon, activityTone } from '~/lib/activity-icons';
import { activityPath, rentPath, type gearOf, type TaxonomyActivity } from '~/lib/catalog';
import { Link } from 'react-router';
import { cn } from '~/lib/utils';

type Gear = ReturnType<typeof gearOf>[number];
/** A chip: a kind of gear or an activity, with the activity icon it wears and what it opens (its page on this site). */
type Item = { key: string; title: string; count: number; activity: string; filter: { category: string } | { activity: string } };

/**
 * «Весь каталог»: the platform's whole catalogue as `lines` rows of chips drifting slowly, each the other way (the
 * `marquee` utility: hover or focus holds a row, reduced motion turns it into a row scrolled by hand). With
 * `activities`, the first row is the activities and the rest the kinds of gear. What can be booked now wears its
 * activity's colour, with a green dot and its count, and opens its page (/rent/…, /activities/…); the rest is shown
 * quietly, with no link, since it would be an empty page. The second copy of a row only closes the loop: hidden from assistive tech and the tab order.
 */
export function CatalogMarquee({ gear, activities, lines = 2 }: { gear: Gear[]; activities?: TaxonomyActivity[]; lines?: number }) {
  const gearItems: Item[] = gear.map((g) => ({ key: g.slug, title: g.title, count: g.count, activity: g.activity, filter: { category: g.slug } }));
  const gearLines = activities?.length ? lines - 1 : lines;
  const rows: Item[][] = [
    ...(activities?.length ? [activities.map((a) => ({ key: a.slug, title: a.title, count: a.count, activity: a.slug, filter: { activity: a.slug } }))] : []),
    ...Array.from({ length: gearLines }, (_, r) => gearItems.filter((_, i) => i % gearLines === r)),
  ].filter((row) => row.length);
  return (
    <div className="-mx-4 grid gap-1.5 sm:-mx-6 lg:-mx-8" style={{ maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)' }}>
      {rows.map((row, r) => (
        <div key={r} className="overflow-hidden motion-reduce:overflow-x-auto motion-reduce:scrollbar-hide">
          <ul
            className={cn('marquee flex w-max gap-2 px-4 sm:px-6 lg:px-8', r % 2 === 1 && '[animation-direction:reverse]')}
            style={{ ['--marquee-duration' as string]: `${Math.max(40, row.length * 4) + r * 6}s` }}
          >
            {[...row, ...row].map((item, i) => (
              <Chip key={`${item.key}-${i}`} item={item} copy={i >= row.length} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Chip({ item: g, copy }: { item: Item; copy: boolean }) {
  const live = g.count > 0;
  const tone = activityTone(g.activity);
  // One flat chip for all; what can be booked now wears its activity's colour (icon circle, name) and a green dot with
  // its count.
  const body = (
    <>
      <span className={cn('grid size-7 shrink-0 place-items-center rounded-full', live ? tone.ground : 'bg-muted')}>
        {createElement(activityIcon(g.activity), { className: cn('size-4', live ? tone.icon : 'text-muted-foreground'), 'aria-hidden': true })}
      </span>
      {g.title}
      {live ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success tabular-nums">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          {g.count}
        </span>
      ) : null}
    </>
  );
  const chip = 'flex h-11 items-center gap-2 rounded-full bg-card/60 pr-4 pl-2 text-sm font-medium whitespace-nowrap';
  return (
    <li aria-hidden={copy || undefined} inert={copy || undefined}>
      {live ? (
        <Link
          to={'category' in g.filter ? rentPath(g.filter.category) : activityPath(g.filter.activity)}
          className={cn(chip, tone.icon, 'transition-colors outline-none hover:bg-card focus-visible:ring-[3px] focus-visible:ring-ring/40')}
        >
          {body}
        </Link>
      ) : (
        <span className={cn(chip, 'text-muted-foreground')}>{body}</span>
      )}
    </li>
  );
}
