import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { config } from '~/lib/config';
import { SELLER_CTA, SHOWCASE } from '~/lib/content';
import { buttonClass } from './button';

/** Seller acquisition, last before the footer: a light card with a photo, so it doesn't compete with the guarantees. */
export function SellerBand() {
  return (
    <section aria-label={SELLER_CTA.title} className="container-page pb-12 sm:pb-16 lg:pb-20">
      <div className="grid overflow-hidden rounded-3xl bg-accent sm:grid-cols-[1.4fr_1fr]">
        <div className="p-6 sm:p-10 lg:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">{SELLER_CTA.title}</h2>
          <p className="mt-2 max-w-md text-accent-foreground/80">{SELLER_CTA.text}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a href={config.providerUrl} className={buttonClass('primary', 'lg')}>
              Подключить прокат <ArrowRight />
            </a>
            <Link to="/sellers" className={buttonClass('ghost', 'lg', 'hover:bg-white/60')}>
              Как это устроено
            </Link>
          </div>
        </div>
        <img src={SHOWCASE[3]!.imageUrl} alt="" loading="lazy" decoding="async" className="hidden h-full min-h-64 w-full object-cover sm:block" />
      </div>
    </section>
  );
}
