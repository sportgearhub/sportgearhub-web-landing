import { createElement } from 'react';
import { BadgeCheck, BadgeRussianRuble, CalendarX2, FileCheck2, type LucideIcon } from 'lucide-react';
import { GUARANTEES, GUARANTEES_INTRO, PAYMENT_METHODS } from '~/lib/content';

/** One icon and one colour per guarantee, in GUARANTEES' order: price, cancellation, receipt, verified rentals. */
const MARKS: { icon: LucideIcon; color: string; glow: string }[] = [
  { icon: BadgeRussianRuble, color: 'text-primary', glow: 'shadow-[0_8px_20px_-8px_oklch(0.55_0.22_262/0.55)]' },
  { icon: CalendarX2, color: 'text-emerald-600', glow: 'shadow-[0_8px_20px_-8px_oklch(0.6_0.15_160/0.55)]' },
  { icon: FileCheck2, color: 'text-amber-600', glow: 'shadow-[0_8px_20px_-8px_oklch(0.7_0.16_70/0.55)]' },
  { icon: BadgeCheck, color: 'text-violet-600', glow: 'shadow-[0_8px_20px_-8px_oklch(0.55_0.2_295/0.55)]' },
];

/**
 * The band's ground: a sky-to-violet gradient with two soft glows, all painted as backgrounds. Not blurred blobs: a
 * `blur()` element escapes its parent's rounded corners in several browsers and shows square edges there.
 */
const GROUND = [
  'radial-gradient(28rem 20rem at 100% 0%, oklch(0.83 0.08 295 / 0.45), transparent 70%)',
  'radial-gradient(26rem 18rem at 0% 100%, oklch(0.86 0.07 230 / 0.5), transparent 70%)',
  'linear-gradient(135deg, oklch(0.97 0.02 230), oklch(0.96 0.025 270), oklch(0.94 0.04 295))',
].join(', ');

/**
 * What the customer can count on: a soft sky-to-violet gradient band, the promises as frosted cards each with its own
 * icon in a white tile with a glow of its colour, and the payment methods alongside.
 */
export function Guarantees() {
  return (
    <section aria-label={GUARANTEES_INTRO.title} className="container-page py-12 sm:py-16 lg:py-20">
      <div className="grid gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-[1fr_2fr] lg:gap-12 lg:p-14" style={{ background: GROUND }}>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">{GUARANTEES_INTRO.title}</h2>
          <p className="mt-2 text-muted-foreground">{GUARANTEES_INTRO.text}</p>
          <p className="mt-6 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Оплата</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <li key={m} className="rounded-full bg-white/80 px-3 py-1 text-sm font-medium ring-1 ring-indigo-100">
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">Платежи принимает АО «ТБанк»</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {GUARANTEES.map((g, i) => {
            const mark = MARKS[i % MARKS.length]!;
            return (
              <li key={g.title} className="rounded-2xl bg-white/70 p-5 ring-1 ring-white">
                <span className={`grid size-12 place-items-center rounded-2xl bg-white ${mark.glow}`}>
                  {createElement(mark.icon, { className: `size-6 ${mark.color}`, strokeWidth: 1.75, 'aria-hidden': true })}
                </span>
                <h3 className="mt-4 font-semibold">{g.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
