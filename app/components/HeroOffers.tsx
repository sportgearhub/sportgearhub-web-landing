import { useEffect, useRef, useState } from 'react';
import { formatMoney, type ProductCard } from '~/lib/catalog';
import { appLink } from '~/lib/config';
import { cn } from '~/lib/utils';

const INTERVAL_MS = 5000;

/**
 * The hero's right side (desktop): real offers taking turns. Each photo cross-fades in and slowly leans closer while it
 * is shown; a card over its corner names the offer and its price and opens it in the app; dots pick one. Moves on only
 * while on screen, in a visible tab, not hovered, and not at all with reduced motion. Before hydration it is simply
 * the first offer. With one offer there is nothing to turn.
 */
export function HeroOffers({ offers, fallbackImage }: { offers: ProductCard[]; fallbackImage: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const hovered = useRef(false);
  const count = offers.length;

  useEffect(() => {
    const el = root.current;
    if (count < 2 || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting));
    observer.observe(el);
    const timer = window.setInterval(() => {
      if (visible && !hovered.current && !document.hidden) setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [count]);

  if (!count) {
    return <img src={fallbackImage} alt="" fetchPriority="high" decoding="async" className="hidden aspect-[4/3.6] w-full rounded-3xl object-cover lg:block" />;
  }

  const current = offers[index]!;
  return (
    <div ref={root} className="relative hidden lg:block" onMouseEnter={() => (hovered.current = true)} onMouseLeave={() => (hovered.current = false)}>
      <div className="relative aspect-[4/3.6] overflow-hidden rounded-3xl bg-muted">
        {offers.map((o, i) => (
          <img
            key={o.id}
            src={o.imageUrl}
            alt=""
            fetchPriority={i === 0 ? 'high' : undefined}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-1000', i === index ? 'opacity-100' : 'opacity-0')}
            style={i === index ? { animation: `ken-burns ${INTERVAL_MS + 1000}ms ease-out both` } : undefined}
          />
        ))}
        {count > 1 ? (
          <div className="absolute right-4 bottom-4 flex gap-1.5 rounded-full bg-black/25 p-1.5 backdrop-blur-sm">
            {offers.map((o, i) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Предложение ${i + 1} из ${count}`}
                aria-current={i === index || undefined}
                className={cn('h-2 rounded-full bg-white transition-all duration-300', i === index ? 'w-6' : 'w-2 opacity-60 hover:opacity-90')}
              />
            ))}
          </div>
        ) : null}
      </div>
      <a
        key={current.id}
        href={appLink(`/offers/${current.id}`)}
        className="absolute -bottom-6 -left-8 flex max-w-80 items-center gap-3 rounded-2xl bg-card p-3 pr-5 shadow-float outline-none hover:ring-2 hover:ring-primary/30 focus-visible:ring-[3px] focus-visible:ring-ring/40"
        style={{ animation: 'rise-in 400ms ease-out both' }}
      >
        <img src={current.imageUrl} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
        <span className="min-w-0">
          <span className="line-clamp-1 text-sm font-semibold">{current.title}</span>
          {current.price != null ? (
            <span className="text-sm text-muted-foreground">
              от <span className="font-bold text-foreground">{formatMoney(current.price)}</span>
            </span>
          ) : null}
          <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Можно забронировать онлайн
          </span>
        </span>
      </a>
    </div>
  );
}
