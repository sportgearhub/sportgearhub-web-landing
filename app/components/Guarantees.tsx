import { Check } from 'lucide-react';
import { GUARANTEES, PAYMENT_METHODS } from '~/lib/content';

/** What the customer can count on: concrete promises on one dark surface, payment methods alongside. */
export function Guarantees() {
  return (
    <section aria-label="Гарантии" className="container-page py-12 sm:py-16 lg:py-20">
      <div className="grid gap-8 rounded-3xl bg-foreground p-6 text-white sm:p-10 lg:grid-cols-[1fr_2fr] lg:gap-14 lg:p-14">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">Спокойная аренда</h2>
          <p className="mt-2 text-white/70">Всё важное видно до оплаты, а платёж и чек — по правилам.</p>
          <p className="mt-6 text-xs font-semibold tracking-wide text-white/50 uppercase">Оплата</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((m) => (
              <li key={m} className="rounded-full border border-white/20 px-3 py-1 text-sm font-medium">
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-white/60">Платежи принимает АО «ТБанк»</p>
        </div>
        <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {GUARANTEES.map((g) => (
            <li key={g.title} className="flex gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
              <div>
                <h3 className="font-semibold">{g.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{g.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
