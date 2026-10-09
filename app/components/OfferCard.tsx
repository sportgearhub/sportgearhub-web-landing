import { appLink } from '~/lib/config';
import { formatMoney, type ProductCard } from '~/lib/catalog';
import { cn } from '~/lib/utils';

/**
 * A real offer, as in the app's catalogue: 4:3 photo, category eyebrow, two-line title, the shop, «от X ₽». No rating
 * until reviews exist (a «Новинка» badge instead of an empty star). Opens the offer in the app.
 */
export function OfferCard({ offer, eager = false, className }: { offer: ProductCard; eager?: boolean; className?: string }) {
  return (
    <a href={appLink(`/offers/${offer.id}`)} className={cn('group block rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40', className)}>
      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <img
          src={offer.imageUrl}
          alt=""
          width={640}
          height={480}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">Новинка</span>
      </span>
      <span className="mt-3 block">
        {offer.categoryTitle ? <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">{offer.categoryTitle}</span> : null}
        <span className="mt-0.5 line-clamp-2 font-semibold leading-snug">{offer.title}</span>
        {offer.seller ? <span className="mt-0.5 block truncate text-sm text-muted-foreground">{offer.seller.name}</span> : null}
        {offer.price != null ? (
          <span className="mt-1.5 block text-[15px]">
            от <span className="font-bold">{formatMoney(offer.price)}</span>
          </span>
        ) : null}
      </span>
    </a>
  );
}

/** Offers in a row: a swipe on phones (1.3 cards in view, so the swipe is obvious), a grid from tablets. */
export function OfferRow({ offers }: { offers: ProductCard[] }) {
  return (
    <ul className="snap-row gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {offers.map((offer, i) => (
        <li key={offer.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
          <OfferCard offer={offer} eager={i < 2} />
        </li>
      ))}
    </ul>
  );
}
