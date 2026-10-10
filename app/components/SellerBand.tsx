import { createElement } from 'react';
import { ArrowRight, Bike, CalendarCheck, QrCode, Snowflake, Store, Tent, Wallet, Waves, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { config } from '~/lib/config';
import { SELLER_CTA } from '~/lib/content';
import { cn } from '~/lib/utils';
import { buttonClass } from './button';

/** The bubbles: the seller's tools (bigger) among the gear they rent out. Position in %, size in rem, float delay in s. */
const BUBBLES: { icon: LucideIcon; x: number; y: number; size: number; delay: number; strong?: boolean }[] = [
  { icon: Store, x: 18, y: 22, size: 4.5, delay: 0, strong: true },
  { icon: CalendarCheck, x: 58, y: 12, size: 4, delay: 1.2, strong: true },
  { icon: Wallet, x: 70, y: 52, size: 4.5, delay: 0.6, strong: true },
  { icon: QrCode, x: 30, y: 62, size: 4, delay: 1.8, strong: true },
  { icon: Bike, x: 4, y: 58, size: 3, delay: 2.4 },
  { icon: Snowflake, x: 44, y: 38, size: 2.75, delay: 3 },
  { icon: Tent, x: 86, y: 18, size: 3, delay: 0.9 },
  { icon: Waves, x: 52, y: 80, size: 2.75, delay: 2.1 },
];

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** A fine dot grid, tiled. */
const DOTS = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><circle cx="2" cy="2" r="1.1" fill="#fff" fill-opacity=".28"/></svg>');

/** Soft contour lines, map-like, one wide tile that repeats sideways (it drifts, see `band-drift`). */
const CONTOURS = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" fill="none" stroke="#fff" stroke-linecap="round">
<g stroke-opacity=".16" stroke-width="1.2">
<path d="M0 290 C120 230 220 330 360 270 S600 210 720 290"/>
<path d="M0 250 C130 190 230 290 360 230 S590 170 720 250"/>
<path d="M0 210 C140 150 240 250 360 190 S580 130 720 210"/>
<path d="M0 120 C110 80 250 150 360 100 S610 60 720 120"/>
<path d="M0 80 C120 40 240 110 360 60 S600 20 720 80"/>
</g>
<g stroke-opacity=".1" stroke-width="1">
<ellipse cx="540" cy="160" rx="90" ry="46"/><ellipse cx="540" cy="160" rx="58" ry="28"/><ellipse cx="540" cy="160" rx="26" ry="12"/>
<ellipse cx="160" cy="330" rx="70" ry="30"/><ellipse cx="160" cy="330" rx="38" ry="15"/>
</g>
</svg>`);

/**
 * Seller acquisition, last before the footer on every page: a vivid blue-to-violet gradient with white copy, and on
 * the right a cluster of frosted icon bubbles bobbing gently (the `float` utility; still with reduced motion) — the
 * seller's tools among the gear they rent out — instead of a photo. Under it all, SVG patterns over the whole card:
 * soft contour lines drifting sideways (`band-drift`) and a dot grid fading out under the copy. Defaults to the
 * site-wide pitch with «Как это устроено»; the seller page passes its own closing words and no link back to itself.
 */
export function SellerBand({ title = SELLER_CTA.title, text = SELLER_CTA.text, more = true }: { title?: string; text?: string; more?: boolean }) {
  return (
    <section aria-label={title} className="container-page pb-12 sm:pb-16 lg:pb-20">
      <div className="relative isolate grid overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-violet-600 text-white sm:grid-cols-[1.3fr_1fr]">
        {/* Over the whole card, under the content: a light glow, contour lines drifting sideways, and a dot grid that
            fades out under the copy. */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(30rem_18rem_at_85%_20%,oklch(1_0_0/0.18),transparent)]" aria-hidden />
        <div className="band-drift absolute inset-0 -z-10" style={{ backgroundImage: CONTOURS, backgroundSize: '720px 360px', backgroundPosition: '0 50%' }} aria-hidden />
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: DOTS,
            maskImage: 'radial-gradient(70% 90% at 80% 50%, #000, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 90% at 80% 50%, #000, transparent)',
          }}
          aria-hidden
        />
        <div className="p-6 sm:p-10 lg:p-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-md text-white/80">{text}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a href={config.providerUrl} className={buttonClass('inverse', 'lg')}>
              Подключить прокат <ArrowRight />
            </a>
            {more ? (
              <Link to="/sellers" className={buttonClass('ghost', 'lg', 'text-white ring-1 ring-white/30 hover:bg-white/10')}>
                Как это устроено
              </Link>
            ) : null}
          </div>
        </div>
        <div className="relative hidden min-h-64 sm:block" aria-hidden>
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className={cn(
                'float absolute grid place-items-center rounded-2xl ring-1 backdrop-blur-md',
                b.strong ? 'bg-white/20 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.35)] ring-white/40' : 'bg-white/10 ring-white/20',
              )}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}rem`, height: `${b.size}rem`, animationDelay: `-${b.delay}s` }}
            >
              {createElement(b.icon, { className: b.strong ? 'size-[45%] text-white' : 'size-[45%] text-white/70', strokeWidth: 1.75 })}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
