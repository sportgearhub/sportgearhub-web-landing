import { createElement, Fragment, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronDown, LayoutGrid, Menu, X } from 'lucide-react';
import { activityIcon, activityTone } from '~/lib/activity-icons';
import { activityPath, rentPath, type NavCatalog } from '~/lib/catalog';
import { appLink, config } from '~/lib/config';
import { cn } from '~/lib/utils';
import { rentHeading } from '~/lib/wording';
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
 * height; the current page's is blue with an underline on the header's bottom edge. After «Главная», «Прокат» opens
 * the catalogue pages (activities and gear with offers, `nav` from the root loader) — on hover or keyboard focus, in
 * CSS, so before hydration too; the phone menu lists them under the links.
 */
export function SiteHeader({ nav }: { nav?: NavCatalog }) {
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
            {NAV.map((item, i) => (
              <Fragment key={item.label}>
                <NavLink {...item} className={navItemClass} />
                {i === 0 && nav ? <RentMenu nav={nav} /> : null}
              </Fragment>
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
              <nav
                aria-label="Меню"
                className="fixed inset-x-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b bg-background px-4 pt-2 pb-safe shadow-float sm:top-16 sm:rounded-b-2xl sm:border-x sm:px-5"
              >
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
                {nav ? <RentLists nav={nav} onPick={closeMenu} compact /> : null}
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

const navItemClass = (current: boolean) =>
  cn(
    'relative flex items-center px-3.5 text-[15px] font-semibold transition-colors outline-none focus-visible:text-primary',
    current ? 'text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-primary' : 'text-muted-foreground hover:text-foreground',
  );

/**
 * «Прокат ▾» in the desktop nav: a dropdown of the catalogue pages, opened by hover or keyboard focus (CSS
 * `group-hover`/`group-focus-within`, so it works before hydration). Underlined on a /rent or /activities page.
 */
function RentMenu({ nav }: { nav: NavCatalog }) {
  const { pathname } = useLocation();
  if (!nav.activities.length && !nav.categories.length) return null;
  const current = pathname.startsWith('/rent/') || pathname.startsWith('/activities/');
  return (
    <div className="group/rent relative flex">
      <button type="button" aria-haspopup="true" className={cn(navItemClass(current), 'gap-1')}>
        Прокат
        <ChevronDown className="size-4 transition-transform group-focus-within/rent:rotate-180 group-hover/rent:rotate-180" aria-hidden />
      </button>
      {/* pt-2 bridges the gap, so moving the pointer down to the panel doesn't close it. */}
      <div className="invisible absolute top-full left-0 z-50 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within/rent:visible group-focus-within/rent:opacity-100 group-hover/rent:visible group-hover/rent:opacity-100">
        <div className="w-[36rem] rounded-2xl border bg-card p-4 shadow-float">
          <RentLists nav={nav} />
        </div>
      </div>
    </div>
  );
}

/** The two lists — activities and gear — each entry with its activity's icon on its tone, linking to its page. */
function RentLists({ nav, onPick, compact = false }: { nav: NavCatalog; onPick?: () => void; compact?: boolean }) {
  const groups = [
    { title: 'Занятия', items: nav.activities.map((a) => ({ key: a.slug, label: a.title, to: activityPath(a.slug), activity: a.slug })) },
    { title: 'Снаряжение', items: nav.categories.map((c) => ({ key: c.slug, label: rentHeading(c.slug, c.title), to: rentPath(c.slug), activity: c.activity })) },
  ].filter((g) => g.items.length);
  return (
    <div className={cn('grid gap-4', compact ? 'border-t pt-3 pb-1' : 'grid-cols-2')}>
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{g.title}</p>
          <ul className={cn('grid', compact && 'grid-cols-2')}>
            {g.items.map((item) => {
              const tone = activityTone(item.activity);
              return (
                <li key={item.key}>
                  <Link to={item.to} onClick={onPick} className="flex min-h-11 items-center gap-2.5 rounded-xl px-2 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:bg-muted">
                    <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', tone.ground)}>
                      {createElement(activityIcon(item.activity), { className: cn('size-4', tone.icon), 'aria-hidden': true })}
                    </span>
                    <span className="min-w-0 truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
