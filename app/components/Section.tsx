import { ArrowRight } from 'lucide-react';
import { cn } from '~/lib/utils';

/**
 * A home page section: left-aligned heading with an optional one-line intro, and «Смотреть все →» at the end of the
 * heading row when there is somewhere to go. One spacing scale for every section.
 */
export function Section({
  id,
  title,
  intro,
  more,
  className,
  children,
}: {
  id?: string;
  title: string;
  intro?: string;
  more?: { href: string; label?: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-label={title} className={cn('container-page scroll-mt-20 py-12 sm:py-16 lg:py-20', className)}>
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">{title}</h2>
          {intro ? <p className="mt-1.5 max-w-2xl text-muted-foreground">{intro}</p> : null}
        </div>
        {more ? (
          <a href={more.href} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:text-primary">
            <span className="hidden sm:inline">{more.label ?? 'Смотреть все'}</span>
            <span className="sm:hidden">Все</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        ) : null}
      </div>
      {children}
    </section>
  );
}
