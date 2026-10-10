import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router';
import type { Route } from './+types/root';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { NotFound } from './components/NotFound';
import { publicApi } from './lib/api.server';
import { navCatalog } from './lib/catalog';
import './app.css';

/** Build time: what has offers now, for the header's «Прокат» menu and the footer (the same on every page). */
export async function loader() {
  return { nav: navCatalog(await publicApi.options()) };
}

export const links: Route.LinksFunction = () => [
  // The icon set (from assets/logo-rounded-square): ICO for old browsers and anything asking /favicon.ico (sizes keeps
  // modern browsers on the SVG), the SVG, the 180px full-bleed one for iOS, and the manifest's PNGs.
  { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
  { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
  // Photos come from these hosts: connect early.
  { rel: 'preconnect', href: 'https://images.pexels.com' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="format-detection" content="telephone=no" />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
          К содержимому
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Page>
      <Outlet />
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  const nav = useRouteLoaderData<typeof loader>('root')?.nav;
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader nav={nav} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter nav={nav} />
    </div>
  );
}

/** Unknown paths in the browser (and the static 404 page) render the same «not found» inside the site chrome. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <Page>
      <NotFound title={notFound ? 'Такой страницы нет' : 'Что-то пошло не так'} />
    </Page>
  );
}
