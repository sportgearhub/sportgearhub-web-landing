import { Search } from 'lucide-react';
import { config } from '~/lib/config';
import { cn } from '~/lib/utils';

/**
 * The hero search: a plain GET form into the app's catalogue (`?q=`), so it works before hydration and with JS off.
 */
export function SearchForm({ className }: { className?: string }) {
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

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary-hover focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:h-11 sm:rounded-full"
      >
        Найти
      </button>
    </form>
  );
}
