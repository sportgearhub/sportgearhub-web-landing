import { useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { appLink, config } from '~/lib/config';
import { cn } from '~/lib/utils';
import { buttonClass } from './button';
import { Wordmark } from './Wordmark';

const NAV = [
  { label: 'Главная', href: '/' },
  { label: 'Как это работает', href: '/#how' },
  { label: 'Продавцам', href: '/sellers' },
  { label: 'О сервисе', href: '/about' },
];

/** The current page's link: «Главная» only on `/`, a page by its path; a link to a section (`/#how`) never is. */
const isCurrent = (href: string, pathname: string) => !href.includes('#') && (href === '/' ? pathname === '/' : pathname.startsWith(href));

/**
 * Sticky site header in the customer app's shell (sportgearhub-web-app: Header): from tablets a frosted panel as wide as
 * the page's column, rounded at the bottom; on phones a full-width frosted bar. Its own items, not the app's: the
 * wordmark, a few links (desktop), and «Каталог» into the app (once, as the button: a gradient pill with the app's grid
 * icon). No sign-in here: that belongs to the app. Phones fold
 * the links into a menu built on <details>, so it opens even before the page has hydrated. The links fill the row's
 * height; the current page's is blue with an underline on the header's bottom edge.
 */
export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => menu.current?.removeAttribute('open');

  return (
    // The panel reaches 20px past the content column on each side (container-page's gutter minus its own px-5), so the
    // wordmark and buttons line up with the content's edges below. `w-full`: the page is a flex column, where `mx-auto`
    // would otherwise shrink the header to its own content.
    <header className="sticky top-0 z-40 w-full sm:mx-auto sm:max-w-7xl sm:px-1 lg:px-3">
      <div className="border-b bg-background/90 backdrop-blur-lg sm:rounded-b-2xl sm:border-x sm:shadow-[0_6px_20px_-12px_rgb(15_23_42/0.25)]">
        <div className="flex h-14 items-center gap-6 px-4 sm:h-16 sm:px-5">
          <Link to="/" aria-label="Sportgearhub — на главную" className="rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
            <Wordmark />
          </Link>

          <nav aria-label="Основная навигация" className="hidden flex-1 items-stretch gap-1 self-stretch lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                className={(current) =>
                  cn(
                    'relative flex items-center px-3.5 text-[15px] font-semibold transition-colors outline-none focus-visible:text-primary',
                    current
                      ? 'text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <a
              href={appLink('/')}
              className={buttonClass(
                'primary',
                'md',
                'h-10 bg-gradient-to-r from-primary to-indigo-600 px-4 shadow-[0_6px_18px_-6px_oklch(0.55_0.22_262/0.65)] transition-[filter,translate,box-shadow] hover:-translate-y-px hover:brightness-110 hover:shadow-[0_10px_22px_-8px_oklch(0.55_0.22_262/0.7)]',
              )}
            >
              <LayoutGrid aria-hidden />
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
              <nav aria-label="Меню" className="fixed inset-x-0 top-14 border-b bg-background px-4 pt-2 pb-safe shadow-float sm:top-16 sm:rounded-b-2xl sm:border-x sm:px-5">
                <ul className="grid">
                  {NAV.map((item) => (
                    <li key={item.label}>
                      <NavLink
                        {...item}
                        onClick={closeMenu}
                        className={(current) => cn('flex min-h-12 items-center border-b text-base font-medium last:border-b-0', current && 'font-semibold text-primary')}
                      />
                    </li>
                  ))}
                </ul>
                <a href={config.providerUrl} className="mt-2 mb-1 block text-sm text-muted-foreground">
                  Кабинет продавца
                </a>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ label, href, className, onClick }: { label: string; href: string; className: (current: boolean) => string; onClick?: () => void }) {
  const { pathname } = useLocation();
  const current = isCurrent(href, pathname);
  return (
    <Link to={href} className={className(current)} onClick={onClick} aria-current={current ? 'page' : undefined}>
      {label}
    </Link>
  );
}
