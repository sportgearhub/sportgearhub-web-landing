import { ChevronDown } from 'lucide-react';
import { activityIcon, activityTone } from '~/lib/activity-icons';
import { gearOf, plural, type TaxonomyActivity } from '~/lib/catalog';
import { cn } from '~/lib/utils';

const kinds = (n: number) => `${n} ${plural(n, ['вид', 'вида', 'видов'])}`;

/**
 * «Что можно сдавать» on the seller page: the platform's whole catalogue, pitched to a rental. Real figures up top, put
 * as opportunity: directions, kinds of gear one can list, rentals already connected (counted once per build; without
 * it, the categories already working), and the free categories waiting for a first rental. Then one tile per activity
 * in its colour that opens (a native <details>, so before hydration too) to its gear: what already works on the
 * platform is marked, the free ones are drawn inviting rather than empty.
 */
export function SellerCatalog({ taxonomy, sellers }: { taxonomy: TaxonomyActivity[]; sellers: number | null }) {
  const gear = gearOf(taxonomy);
  const live = gear.filter((g) => g.count > 0).length;
  const free = gear.length - live;
  const stats = [
    { value: taxonomy.length, label: plural(taxonomy.length, ['направление проката', 'направления проката', 'направлений проката']) },
    { value: gear.length, label: `${plural(gear.length, ['вид', 'вида', 'видов'])} снаряжения можно сдавать` },
    sellers
      ? { value: sellers, label: `${plural(sellers, ['прокат', 'проката', 'прокатов'])} уже ${plural(sellers, ['подключился', 'подключились', 'подключились'])}` }
      : { value: live, label: `${plural(live, ['категория', 'категории', 'категорий'])} уже ${plural(live, ['работает', 'работают', 'работают'])}` },
    { value: free, label: `${plural(free, ['свободная категория', 'свободные категории', 'свободных категорий'])} — займите первыми` },
  ];
  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className="border-l-2 border-primary pl-4">
            <p className="text-3xl font-black tracking-tight tabular-nums sm:text-4xl">{s.value}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{s.label}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-8 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {taxonomy.map((a) => {
          const Icon = activityIcon(a.slug);
          const tone = activityTone(a.slug);
          const rented = a.categories.filter((c) => c.count > 0).length;
          return (
            <li key={a.slug}>
              <details className="group rounded-2xl border bg-card transition-shadow open:shadow-card hover:shadow-card">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 rounded-2xl p-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden">
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105', tone.ground)}>
                    <Icon className={cn('size-5', tone.icon)} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{a.title}</span>
                    <span className="block text-sm text-muted-foreground">
                      {kinds(a.categories.length)}
                      {rented ? ` · ${rented} уже ${plural(rented, ['работает', 'работают', 'работают'])}` : ' · все свободны'}
                    </span>
                  </span>
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="flex flex-wrap gap-1.5 px-3 pb-3">
                  {a.categories.map((c) => (
                    <li
                      key={c.slug}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                        c.count > 0 ? 'bg-success/10 text-success' : 'bg-accent text-accent-foreground',
                      )}
                    >
                      {c.count > 0 ? <span className="size-1.5 rounded-full bg-success" aria-hidden /> : null}
                      {c.title}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="size-1.5 rounded-full bg-success" aria-hidden />
        уже работает на площадке; остальные категории свободны — откройте их первыми
      </p>
    </>
  );
}
