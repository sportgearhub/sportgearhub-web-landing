/** Build-time settings (see .env.example). Defaults are production, so a bare `npm run build` makes the real site. */
const env = import.meta.env;
const trim = (url: string) => url.replace(/\/+$/, '');

export const config = {
  /** This site: canonical URLs, Open Graph, the sitemap. */
  siteUrl: trim(env.VITE_SITE_URL || 'https://sportgearhub.ru'),
  /** The customer app: catalogue, offers, sign-in, bookings. Every action on the landing leads there. */
  appUrl: trim(env.VITE_APP_URL || 'https://app.sportgearhub.ru'),
  /** Public API, read at build time only (the browser never calls it from here). */
  apiBaseUrl: trim(env.VITE_API_BASE_URL || 'https://api.sportgearhub.ru'),
  /** Seller console: where rentals sign up and work. */
  providerUrl: trim(env.VITE_PROVIDER_URL || 'https://seller.sportgearhub.ru'),
  docsUrl: 'https://docs.sportgearhub.ru',
};

/** A link into the customer app, with catalogue filters as its query string (empty values dropped). */
export function appLink(path = '/', params: Record<string, string | undefined> = {}, base = config.appUrl): string {
  const url = new URL(path, `${base}/`);
  for (const [key, value] of Object.entries(params)) if (value) url.searchParams.set(key, value);
  return url.toString();
}
