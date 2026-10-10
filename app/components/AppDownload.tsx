import { Play, QrCode, ShoppingBag, Smartphone, type LucideIcon } from 'lucide-react';
import { MOBILE_APPS } from '~/lib/content';
import { cn } from '~/lib/utils';

/** A neutral glyph per store until its official badge is set (no brand logos drawn here). */
const GLYPHS: Record<(typeof MOBILE_APPS.stores)[number]['id'], LucideIcon> = { rustore: ShoppingBag, 'google-play': Play, 'app-store': Smartphone };

/**
 * The footer's mobile apps: a QR tile (the QR image once set, a drawn placeholder until then) and a badge per store.
 * A store with a link is a link (its official badge image if set); without one it says «Скоро в …» and isn't
 * clickable — the apps aren't out yet, and the footer mustn't pretend they are.
 */
export function AppDownload() {
  const { title, qr, stores } = MOBILE_APPS;
  const live = stores.some((s) => s.href);
  return (
    <div className="pt-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-white p-2 ring-1 ring-border" aria-hidden={!qr}>
          {qr ? <img src={qr} alt="QR-код для установки приложения" className="h-full w-full" /> : <QrCode className="size-14 text-foreground/25" strokeWidth={1.25} />}
        </span>
        <ul className="grid gap-1.5">
          {stores.map((s) => {
            const Glyph = GLYPHS[s.id];
            const body = s.badge ? (
              <img src={s.badge} alt={s.name} className="h-9 w-auto" />
            ) : (
              <>
                <Glyph className="size-4 shrink-0" aria-hidden />
                <span className="leading-tight">
                  <span className="block text-[10px] font-medium opacity-70">{s.href ? 'Скачайте в' : 'Скоро в'}</span>
                  <span className="block text-xs font-semibold">{s.name}</span>
                </span>
              </>
            );
            const badge = cn('flex h-9 w-36 items-center gap-2 rounded-lg px-2.5', !s.badge && (s.href ? 'bg-foreground text-white hover:bg-foreground/85' : 'bg-foreground/80 text-white/90'));
            return (
              <li key={s.id}>
                {s.href ? (
                  <a href={s.href} className={cn(badge, 'transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40')}>
                    {body}
                  </a>
                ) : (
                  <span className={badge}>{body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {live ? null : <p className="mt-2 text-xs text-muted-foreground">Мобильное приложение готовится к выходу.</p>}
    </div>
  );
}
