import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { appLink, config } from '~/lib/config';
import { cn } from '~/lib/utils';
import { buttonClass } from './button';
import { Wordmark } from './Wordmark';

const NAV = [
  { label: 'Каталог', href: appLink('/'), external: true },
  { label: 'Как это работает', href: '/#how', external: false },
  { label: 'Партнёрам', href: '/partners', external: false },
  { label: 'О сервисе', href: '/about', external: false },
];

/**
 * Sticky site header: the wordmark, a few links (desktop), «Войти» and «Каталог» into the app. Phones fold the links
 * into a menu built on <details>, so it opens even before the page has hydrated. A hairline appears once scrolled.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => menu.current?.removeAttribute('open');

  return (
    <header className={cn('sticky top-0 z-40 bg-background/90 backdrop-blur-md transition-shadow supports-[backdrop-filter]:bg-background/75', scrolled && 'shadow-[0_1px_0_var(--color-border)]')}>
      <div className="container-page flex h-14 items-center gap-6 sm:h-16">
        <Link to="/" aria-label="Sportgearhub — на главную" className="rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
          <Wordmark />
        </Link>

        <nav aria-label="Основная навигация" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.label} {...item} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <a href={appLink('/account')} className={buttonClass('ghost', 'md', 'hidden px-3 sm:inline-flex')}>
            Войти
          </a>
          <a href={appLink('/')} className={buttonClass('primary', 'md', 'h-10 px-4')}>
            Каталог
          </a>
          <details ref={menu} className="group relative lg:hidden">
            <summary
              className="grid size-11 cursor-pointer list-none place-items-center rounded-full outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden"
              aria-label="Меню"
            >
              <Menu className="size-5 group-open:hidden" aria-hidden />
              <X className="hidden size-5 group-open:block" aria-hidden />
            </summary>
            <nav aria-label="Меню" className="fixed inset-x-0 top-14 border-b bg-background px-4 pt-2 pb-safe shadow-float sm:top-16 sm:px-6">
              <ul className="grid">
                {NAV.map((item) => (
                  <li key={item.label}>
                    <NavLink {...item} onClick={closeMenu} className="flex min-h-12 items-center border-b text-base font-medium last:border-b-0" />
                  </li>
                ))}
                <li>
                  <a href={appLink('/account')} className="flex min-h-12 items-center text-base font-medium sm:hidden">
                    Войти
                  </a>
                </li>
              </ul>
              <a href={config.providerUrl} className="mt-2 mb-1 block text-sm text-muted-foreground">
                Кабинет партнёра
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function NavLink({ label, href, external, className, onClick }: { label: string; href: string; external: boolean; className?: string; onClick?: () => void }) {
  return external ? (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  ) : (
    <Link to={href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}
