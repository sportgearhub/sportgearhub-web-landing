# Sportgearhub Web Landing — working agreement

Public marketing site (sportgearhub.ru). Read `README.md` first. The customer app is a separate repo
(`sportgearhub-web-app`, app.sportgearhub.ru); this site only links into it.

## Rules

- **Every page is pre-rendered.** Data comes from route `loader`s at build time (`app/lib/api.server.ts`). No
  `action`/`headers` exports, no client-side API calls, no runtime server.
- **Every action leads to the app** through `appLink()` (`app/lib/config.ts`). Catalogue filters use the app's query
  keys (`q`, `category`, `activity`, `city`).
- **Never fake inventory.** Offer cards, shops, prices and counts come from the API. Curated photos only illustrate
  categories and collections, and a collection shows only when its activity has offers (`liveCollections`). Counts
  show from 3 up (`MIN_SHOWN_COUNT`); no invented ratings, reviews or stats. Every claim in `content.ts` must be true.
- **Pictures first, little text.** Copy lives in `app/lib/content.ts`; keep it short.
- **Mobile first.** Base styles are for phones; `sm:` / `lg:` add desktop. Tap targets ≥ 44px. Rows swipe on phones
  (`snap-row`) and become grids from `sm:`. Works before hydration: plain links, a GET search form, `<details>` for
  the phone menu and the FAQ.
- **One section rhythm.** Use `Section` (heading, optional intro and «Смотреть все»); don't invent per-section
  spacing or heading styles.
- Design tokens match the customer app (`app/app.css` ↔ `sportgearhub-web-app/src/index.css`). Copy is Russian,
  `lang="ru"`.
- Every page sets its meta through `seo()`; add new indexable pages to `routes/sitemap.ts`.
- Run `npm run lint && npm run typecheck && npm test` before finishing; `npm run build` when touching loaders, routes
  or meta (it is the pre-render check).
- Commits are attributed to the user only; no AI co-author trailers.
