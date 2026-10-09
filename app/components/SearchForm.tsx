import { MapPin, Search } from 'lucide-react';
import { config } from '~/lib/config';
import type { City } from '~/lib/catalog';
import { cn } from '~/lib/utils';

/**
 * The hero search: a plain GET form into the app's catalogue (`?q=`, `?city=`), so it works before hydration and with
 * JS off. One city shows as a label; several become a native select (the phone's own picker).
 */
export function SearchForm({ cities, className }: { cities: City[]; className?: string }) {
  return (
    <form
      action={`${config.appUrl}/`}
      method="get"
      role="search"
      className={cn(
        'flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-card sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-1.5',
        className,
      )}
    >
      <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl px-3 sm:min-h-11 sm:rounded-full sm:pl-4">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="sr-only">Что ищете</span>
        <input
          name="q"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Велосипед, SUP, лыжи…"
          className="w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>

      {cities.length ? (
        <label className="flex min-h-12 items-center gap-2 rounded-xl border-t px-3 sm:min-h-11 sm:rounded-none sm:border-t-0 sm:border-l sm:pr-2 sm:pl-4">
          <MapPin className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <span className="sr-only">Город</span>
          {cities.length === 1 ? (
            <>
              <span className="text-sm font-medium">{cities[0]!.name}</span>
              <input type="hidden" name="city" value={cities[0]!.slug} />
            </>
          ) : (
            <select name="city" defaultValue={cities[0]!.slug} className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none sm:flex-none">
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </label>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-hover focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:h-11 sm:rounded-full"
      >
        Найти
      </button>
    </form>
  );
}
