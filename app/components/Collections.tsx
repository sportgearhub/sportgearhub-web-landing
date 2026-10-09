import { ArrowUpRight } from 'lucide-react';
import { appLink } from '~/lib/config';
import type { ShowcaseCard } from '~/lib/catalog';
import { cn } from '~/lib/utils';

/** «Идеи на выходные»: big photo tiles, the first one leading; each opens the catalogue for that activity. */
export function Collections({ items }: { items: ShowcaseCard[] }) {
  return (
    <ul className={cn('grid gap-3 sm:gap-6', items.length > 1 && 'sm:grid-cols-2', items.length > 2 && 'lg:grid-cols-3')}>
      {items.map((c, i) => (
        <li key={c.id} className={cn(i === 0 && items.length > 2 && 'lg:row-span-2')}>
          <a
            href={appLink('/', { activity: c.activity })}
            className={cn(
              'group relative isolate flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-3xl p-5 text-white outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:p-6',
              i === 0 && items.length > 2 && 'lg:min-h-[30rem]',
            )}
          >
            <img src={c.imageUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
            <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight className="size-5" aria-hidden />
            </span>
            <span className={cn('font-extrabold tracking-tight', i === 0 && items.length > 2 ? 'text-3xl' : 'text-2xl')}>{c.title}</span>
            <span className="mt-1 text-sm text-white/85">{c.hint}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
