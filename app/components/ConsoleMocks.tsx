import { Camera, Check, Clock, QrCode, ScanLine } from 'lucide-react';
import { SELLER_SCREENS } from '~/lib/content';
import { cn } from '~/lib/utils';

/**
 * Seller console screens for /sellers, drawn like the HowItWorks scenes: a browser window for the desktop, a phone
 * for the counter. Decorative (the copy beside them carries the meaning). Each one turns into a real screenshot once
 * its path is set in SELLER_SCREENS; in dev, an unset one wears a «макет» tag so it's easy to spot.
 */
type ScreenId = keyof typeof SELLER_SCREENS;

function Shot({ id, className, children }: { id: ScreenId; className?: string; children: React.ReactNode }) {
  const src = SELLER_SCREENS[id];
  return (
    <div className={cn('relative', className)} aria-hidden>
      {src ? <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" /> : children}
      {!src && import.meta.env.DEV ? (
        <span className="absolute top-2 right-2 z-10 rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-semibold text-background">макет · {id}</span>
      ) : null}
    </div>
  );
}

export function BrowserFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl bg-card shadow-float ring-1 ring-border', className)}>
      <div className="flex items-center gap-1.5 border-b bg-muted px-3 py-2">
        {['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]'].map((c) => (
          <span key={c} className={cn('size-2.5 rounded-full', c)} />
        ))}
        <span className="mx-auto rounded-md bg-card px-3 py-0.5 text-[10px] text-muted-foreground">crm.sportgearhub.ru</span>
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('overflow-hidden rounded-[2rem] border-[6px] border-foreground bg-card shadow-float', className)}>
      <div className="mx-auto mt-1.5 h-1.5 w-12 rounded-full bg-foreground/80" />
      {children}
    </div>
  );
}

const Line = ({ w, className }: { w: string; className?: string }) => <span className={cn('block h-2 rounded-full bg-foreground/10', className)} style={{ width: w }} />;

const BADGE = {
  wait: 'bg-amber-100 text-amber-800',
  today: 'bg-accent text-accent-foreground',
  out: 'bg-success/15 text-success',
} as const;

function Badge({ tone, children }: { tone: keyof typeof BADGE; children: React.ReactNode }) {
  return <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', BADGE[tone])}>{children}</span>;
}

/** Hero: the bookings list on a laptop, the counter on a phone in front of it. */
export function HeroMock() {
  return (
    <Shot id="hero" className="mx-auto w-full max-w-xl pb-8 lg:pb-0">
      <BrowserFrame className="mr-24 sm:mr-32">
        <BookingsTable className="pr-14" />
      </BrowserFrame>
      <PhoneFrame className="absolute right-0 -bottom-2 w-36 sm:w-44 lg:-bottom-10">
        <CounterScreen compact />
      </PhoneFrame>
    </Shot>
  );
}

export function BookingsMock() {
  return (
    <Shot id="bookings">
      <BrowserFrame>
        <BookingsTable withFilters />
      </BrowserFrame>
    </Shot>
  );
}

export function CounterMock() {
  return (
    <Shot id="counter" className="mx-auto w-56 sm:w-64">
      <PhoneFrame>
        <CounterScreen />
      </PhoneFrame>
    </Shot>
  );
}

export function CatalogMock() {
  const tiers = [
    ['до 2 ч', '600 ₽'],
    ['полдня', '900 ₽'],
    ['сутки', '1 400 ₽'],
  ];
  return (
    <Shot id="catalog">
      <BrowserFrame>
        <div className="grid gap-4 p-4 sm:grid-cols-[1fr_1.2fr] sm:p-5">
          <div>
            <div className="relative aspect-[4/3] rounded-xl bg-gradient-to-br from-brand/40 to-accent">
              <span className="absolute top-2 left-2 rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold">Главное</span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {['bg-accent', 'bg-brand/25', 'bg-muted'].map((c) => (
                <span key={c} className={cn('aspect-square rounded-lg', c)} />
              ))}
              <span className="grid aspect-square place-items-center rounded-lg border border-dashed text-muted-foreground">
                <Camera className="size-3.5" />
              </span>
            </div>
          </div>
          <div className="min-w-0 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold">Горный велосипед</span>
              <Badge tone="wait">На проверке</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {[
                ['Рама', 'M · 17″'],
                ['Тормоза', 'дисковые'],
                ['Колёса', '27,5″'],
                ['Цвет', 'графит'],
              ].map(([k, v]) => (
                <span key={k} className="rounded-lg bg-muted px-2 py-1.5">
                  <span className="block text-[10px] text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-1.5">
              {tiers.map(([k, v]) => (
                <span key={k} className="flex-1 rounded-lg border px-2 py-1.5 text-center">
                  <span className="block text-[10px] text-muted-foreground">{k}</span>
                  <span className="font-bold">{v}</span>
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              {['Залог 3 000 ₽', 'Бесплатная отмена', 'Входит: шлем, замок'].map((r) => (
                <span key={r} className="flex items-center gap-1.5">
                  <Check className="size-3 text-success" strokeWidth={3} />
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BrowserFrame>
    </Shot>
  );
}

function BookingsTable({ withFilters = false, className }: { withFilters?: boolean; className?: string }) {
  const rows = [
    { n: '1047', item: 'SUP-доска', time: 'сб 10:00', badge: <Badge tone="wait"><Clock className="size-2.5" />18 ч на ответ</Badge> },
    { n: '1046', item: 'Горный велосипед', time: 'сб 11:00', badge: <Badge tone="today">Выдача сегодня</Badge> },
    { n: '1042', item: 'Палатка 3-местная', time: 'пт 18:00', badge: <Badge tone="out">На руках</Badge> },
    { n: '1039', item: 'Каяк двухместный', time: 'пт 09:00', badge: <Badge tone="today">Возврат сегодня</Badge> },
  ];
  return (
    <div className={cn('p-3 text-xs sm:p-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Брони</span>
        <span className="text-[10px] text-muted-foreground">Сегодня, сб</span>
      </div>
      {withFilters ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            ['Ждут ответа', 1, true],
            ['Выдача сегодня', 1, false],
            ['Возврат сегодня', 1, false],
            ['На руках', 1, false],
          ].map(([label, count, active]) => (
            <span
              key={String(label)}
              className={cn('rounded-full px-2.5 py-1 text-[10px] font-semibold', active ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground')}
            >
              {label} · {count}
            </span>
          ))}
        </div>
      ) : null}
      <ul className="mt-3 divide-y">
        {rows.map((r) => (
          <li key={r.n} className="flex items-center gap-2 py-2">
            <span className="w-12 shrink-0 font-semibold text-muted-foreground tabular-nums">№{r.n}</span>
            <span className="min-w-0 flex-1 truncate font-medium">{r.item}</span>
            <span className="hidden shrink-0 text-muted-foreground sm:inline">{r.time}</span>
            {r.badge}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CounterScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn('text-xs', compact ? 'p-2' : 'p-3')}>
      <div className="relative grid aspect-square place-items-center overflow-hidden rounded-xl bg-foreground/90">
        <QrCode className={cn('text-white/90', compact ? 'size-12' : 'size-20')} strokeWidth={1.25} />
        <ScanLine className="absolute inset-0 m-auto size-[85%] text-brand" strokeWidth={0.75} />
        <span className="absolute inset-x-6 top-1/2 h-0.5 animate-pulse rounded-full bg-brand shadow-[0_0_12px_var(--color-brand)]" />
      </div>
      <div className={cn('mt-2 rounded-xl bg-muted', compact ? 'p-2' : 'p-3')}>
        <div className="flex items-center justify-between gap-1">
          <span className="font-bold">№ 1046</span>
          <Badge tone="out">Оплачено</Badge>
        </div>
        {compact ? null : (
          <div className="mt-2 space-y-1.5">
            <Line w="80%" />
            <Line w="55%" />
          </div>
        )}
        <span className={cn('mt-2 flex items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground', compact ? 'h-7 text-[10px]' : 'h-9')}>
          Выдать
        </span>
      </div>
    </div>
  );
}
