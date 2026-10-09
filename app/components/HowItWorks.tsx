import { Check, MapPin, Search } from 'lucide-react';
import { HOW_IT_WORKS } from '~/lib/content';

/**
 * Three steps as tall cards, each with a small drawing of that moment in the app (search, dates and price, the
 * booking ticket) instead of icon circles. Decorative: the step text carries the meaning. Swipe on phones.
 */
export function HowItWorks() {
  const scenes = [<SearchScene key="s" />, <BookScene key="b" />, <PickupScene key="p" />];
  return (
    <ol className="snap-row gap-4 sm:grid sm:grid-cols-3 sm:gap-6">
      {HOW_IT_WORKS.map((step, i) => (
        <li key={step.title} className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-canvas sm:w-auto">
          <div className="relative h-48 overflow-hidden px-5 pt-6 sm:h-52" aria-hidden>
            {scenes[i]}
          </div>
          <div className="flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-5">
            <span className="text-5xl font-extrabold tracking-tight text-primary/25 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const Line = ({ w, className = '' }: { w: string; className?: string }) => <span className={`block h-2 rounded-full bg-foreground/10 ${className}`} style={{ width: w }} />;

function SearchScene() {
  return (
    <div className="mx-auto max-w-72">
      <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm shadow-card">
        <Search className="size-4 text-muted-foreground" />
        <span className="font-medium">Велосипед</span>
        <span className="ml-0.5 h-4 w-px animate-pulse bg-primary" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {['от 900 ₽', 'от 1 200 ₽'].map((price, i) => (
          <div key={price} className="rounded-xl bg-card p-2 shadow-card">
            <div className={`aspect-[4/3] rounded-lg ${i === 0 ? 'bg-accent' : 'bg-brand/30'}`} />
            <Line w="80%" className="mt-2" />
            <span className="mt-1.5 block text-xs font-bold">{price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookScene() {
  const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  return (
    <div className="mx-auto max-w-72 rounded-2xl bg-card p-3.5 shadow-card">
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <span key={d} className={`rounded-lg py-1.5 text-[11px] leading-tight ${i === 5 ? 'bg-primary font-semibold text-primary-foreground' : 'text-muted-foreground'}`}>
            {d}
            <span className="block text-xs font-semibold">{12 + i}</span>
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs font-medium">
        <span>10:00 → 14:00</span>
        <span className="text-muted-foreground">4 часа</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Итого <span className="block text-base font-bold text-foreground">1 800 ₽</span>
        </span>
        <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Оплатить</span>
      </div>
    </div>
  );
}

function PickupScene() {
  // A fixed pattern that reads as a QR code at this size.
  const qr = '1110111100101110111001001010111110100110010111010110110011101011';
  return (
    <div className="mx-auto max-w-72 rounded-2xl bg-card p-3.5 shadow-card">
      <div className="flex items-start justify-between">
        <span>
          <span className="block text-xs text-muted-foreground">Бронь</span>
          <span className="block font-bold">№ 1042</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[11px] font-semibold text-success">
          <Check className="size-3" strokeWidth={3} />
          Оплачено
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-16 shrink-0 grid-cols-8 gap-px rounded-md bg-card p-1 ring-1 ring-border">
          {[...qr].map((bit, i) => (
            <span key={i} className={bit === '1' ? 'bg-foreground' : ''} />
          ))}
        </span>
        <span className="min-w-0 text-xs">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="size-3.5 text-primary" />
            Пункт выдачи
          </span>
          <span className="mt-1 block text-muted-foreground">сб, 10:00</span>
          <span className="mt-1 block text-muted-foreground">Чек отправлен</span>
        </span>
      </div>
    </div>
  );
}
