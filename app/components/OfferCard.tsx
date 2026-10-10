import { useEffect, useRef, useState } from 'react';
import { appLink } from '~/lib/config';
import { formatMoney, type ProductCard } from '~/lib/catalog';
import { cn } from '~/lib/utils';

/**
 * A real offer, as in the app's catalogue: 4:3 photo (cycling through the offer's photos when it has several), category
 * eyebrow, two-line title, «от X ₽». No rating until reviews exist (a «Новинка» badge instead of an empty star). Opens
 * the offer in the app.
 */
export function OfferCard({ offer, eager = false, delay = 0, className }: { offer: ProductCard; eager?: boolean; delay?: number; className?: string }) {
  return (
    <a href={appLink(`/offers/${offer.id}`)} className={cn('group block rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40', className)}>
      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <PhotoCarousel images={offer.images} eager={eager} delay={delay} />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">Новинка</span>
      </span>
      <span className="mt-3 block">
        {offer.categoryTitle ? <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">{offer.categoryTitle}</span> : null}
        <span className="mt-0.5 line-clamp-2 font-semibold leading-snug">{offer.title}</span>
        {offer.price != null ? (
          <span className="mt-1.5 block text-[15px]">
            от <span className="font-bold">{formatMoney(offer.price)}</span>
          </span>
        ) : null}
      </span>
    </a>
  );
}

const INTERVAL_MS = 3500;
const SLIDE_MS = 500;

/**
 * The offer's photos sliding left on their own, endlessly: a copy of the first photo at the end of the strip, and a
 * jump back to the real first one (without animation) once the copy is in view. Dots at the bottom centre show where
 * it is; they're decorative, the card itself is the link. Runs only while the card is on screen and the tab is
 * visible, and not at all with reduced motion. Before hydration it's simply the first photo. No hover zoom: the photos
 * sit side by side unclipped, so a scaled one would show its neighbour's edge.
 */
function PhotoCarousel({ images, eager, delay }: { images: string[]; eager: boolean; delay: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const count = images.length;

  useEffect(() => {
    const el = root.current;
    if (count < 2 || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      setAnimate(true);
      setIndex((i) => i + 1);
      timer = setTimeout(tick, INTERVAL_MS);
    };
    const sync = () => {
      clearTimeout(timer);
      timer = undefined;
      // A slide that ended while hidden may have missed its transitionend: settle on a real photo first.
      setAnimate(false);
      setIndex((i) => (i >= count ? 0 : i));
      // Cards start at slightly different moments, so a row doesn't flip all at once.
      if (visible && !document.hidden) timer = setTimeout(tick, INTERVAL_MS + delay);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [count, delay]);

  // The copy of the first photo has slid in: snap back to the real one, unseen.
  const onSlid = (event: React.TransitionEvent) => {
    if (event.target === event.currentTarget && index >= count) {
      setAnimate(false);
      setIndex(0);
    }
  };

  const strip = count > 1 ? [...images, images[0]!] : images;
  return (
    <span ref={root} className="absolute inset-0 block">
      <span
        className={cn('flex h-full ease-out', animate && 'transition-transform')}
        style={{ transform: `translateX(-${index * 100}%)`, transitionDuration: animate ? `${SLIDE_MS}ms` : undefined }}
        onTransitionEnd={onSlid}
      >
        {strip.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            width={640}
            height={480}
            loading={eager && i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </span>
      {count > 1 ? (
        <span className="absolute inset-x-0 bottom-2.5 flex justify-center" aria-hidden>
          <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-sm">
            {images.map((src, i) => (
              <span
                key={src}
                className={cn('h-1.5 rounded-full bg-white transition-all duration-300', i === index % count ? 'w-4' : 'w-1.5 opacity-60')}
              />
            ))}
          </span>
        </span>
      ) : null}
    </span>
  );
}

/** Offers in a row: a swipe on phones (1.3 cards in view, so the swipe is obvious), a grid from tablets. */
export function OfferRow({ offers }: { offers: ProductCard[] }) {
  return (
    <ul className="snap-row gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {offers.map((offer, i) => (
        <li key={offer.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
          <OfferCard offer={offer} eager={i < 2} delay={(i % 4) * 400} />
        </li>
      ))}
    </ul>
  );
}
