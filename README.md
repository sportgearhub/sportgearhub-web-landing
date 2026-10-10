# Sportgearhub Web Landing

The public site at **sportgearhub.ru**: the landing (activities with their categories, real offers, how it works,
guarantees, FAQ), «О сервисе»,
«Продавцам», «Документы». Everything you *do* — browse the catalogue, open an offer, sign in, book — happens in the
customer app at **app.sportgearhub.ru**; every action here links there.

React + TypeScript + Tailwind v4, built with React Router (framework mode) and **pre-rendered**: `npm run build`
renders every page to finished HTML, with the catalogue read from the public API at that moment. Search engines and
link previews get the full page; in the browser React then hydrates it. There is no runtime server — static files
served by static-web-server, like the app.

## Run

```bash
npm install
npm run dev          # http://localhost:5173 (loaders call the API on each request in dev)
npm run lint && npm run typecheck && npm test
npm run build        # → build/client: one index.html per page, sitemap.xml, hashed assets
npm run preview      # serve build/client
```

Settings are build-time Vite variables with production defaults (see `.env.example`):

| Variable | Default | Used for |
|---|---|---|
| `VITE_SITE_URL` | `https://sportgearhub.ru` | canonical URLs, Open Graph, sitemap |
| `VITE_APP_URL` | `https://app.sportgearhub.ru` | every link into the app (catalogue, offers, sign-in) |
| `VITE_API_BASE_URL` | `https://api.sportgearhub.ru` | build-time reads, product photo URLs |
| `VITE_PROVIDER_URL` | `https://seller.sportgearhub.ru` | seller sign-up and console |

## How the data gets in

`app/routes/home.tsx` has a `loader` that runs **at build time** (`app/lib/api.server.ts`): activities and categories
with live counts (`/products/options`), the newest offers, and for each activity and stocked category a small sample
(a cover photo, the cheapest price). The browser never calls the API from this site. If the API is down during a build, the page
still builds with curated content (a warning in the log) instead of failing.

Because the data is baked in, production is rebuilt every 6 hours by a schedule in `deploy-production.yml`, besides
every push to `production`. Run the workflow by hand to publish new offers sooner.

## Layout

```
app/
  root.tsx              document, header/footer, 404 boundary
  routes.ts             /, /about, /sellers, /documents, /rent/:category, /activities/:activity, /404, /sitemap.xml
  routes/               one module per page (loader + meta + component)
  components/           header, footer, search, offer cards, categories, collections, how-it-works, FAQ…
  lib/
    api.server.ts       build-time API reads (never shipped to the browser)
    catalog.ts          wire → card mapping, prices, seasons, shops, collections, formatting (pure, tested)
    content.ts          copy and curated photos
    config.ts           URLs, appLink()
    seo.ts              title/description/canonical/Open Graph per page
sws.toml                static-web-server: caching, 404 page, redirects of old app paths to app.sportgearhub.ru
```

## Deploy

Same pattern as the web app: GitHub Actions builds, pushes `ghcr.io/sportgearhub/sportgearhub-web-landing`, and runs
it on the VPS with `docker-compose.yml`, bound to `127.0.0.1:8005` (`LANDING_HTTP_PORT`; 8000–8004 are taken on the VPS). The host nginx proxies
`sportgearhub.ru` to it. Environment `production`: secret `SSH_KEY`; variables `DEPLOY_HOST`, `SSH_USER`,
`SSH_PORT` (optional).

Moving the app to app.sportgearhub.ru touches other repos and the server: see
[docs/app-subdomain-migration.md](docs/app-subdomain-migration.md).
