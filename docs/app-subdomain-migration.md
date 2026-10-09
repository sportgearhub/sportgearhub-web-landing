# Moving the customer app to app.sportgearhub.ru

Goal: **sportgearhub.ru** serves this landing; **app.sportgearhub.ru** serves `sportgearhub-web-app` (catalogue,
offers, sign-in, checkout, bookings, account, seller preview). Checked against the repos on 2026-10-09.

## Already in place

- API CORS allows both `https://sportgearhub.ru` and `https://app.sportgearhub.ru` (verified live).
- The OIDC client `sportgearhub-web` is registered with `https://app.sportgearhub.ru/auth/callback` and post-logout
  `https://app.sportgearhub.ru/` (`sportgearhub-api/.../appsettings.json:118-125`). The app itself signs in through
  `/api/v1/auth/*` and builds no redirect URI.
- The app builds its own links from `window.location.origin` (payment return `…/bookings/return`, share links), so
  they follow it to the new host with no change.

## Rollout (each step is reversible)

1. **DNS + TLS**: an `A` record for `app.sportgearhub.ru` → the VPS; a certificate covering it (the current one is
   issued for `sportgearhub.ru`).
2. **nginx**: a server block for `app.sportgearhub.ru` → `127.0.0.1:8001` (the web app container, unchanged), with the
   same headers as today's apex block. The app now answers on both hosts.
3. **Web app** (`sportgearhub-web-app`), then deploy:
   - links to the info pages go to the landing: `Footer.tsx` (`/about`, `/partners`, `/documents`),
     `SignInPage.tsx:23-29`, `AboutPage.tsx:69`; drop the public `/about`, `/partners`, `/documents` routes
     (`router.tsx:70-72`) or redirect them to `https://sportgearhub.ru/…`. The in-app `/account/about|partners|documents`
     screens stay.
   - the catalogue accepts `?city=<slug>` (the landing's search sends it; the city lives in localStorage today).
   - `docs/seller-preview.md`: preview origin → `https://app.sportgearhub.ru`.
4. **Landing**: create the GitHub repo `sportgearhub/sportgearhub-web-landing`, environment `production` (`SSH_KEY`,
   `DEPLOY_HOST`, `SSH_USER`, `SSH_PORT`), push `production`. The container listens on `127.0.0.1:8002`.
5. **nginx**: point the `sportgearhub.ru` server block at `127.0.0.1:8002`. Old app links on the apex
   (`/offers/…`, `/providers/…`, `/bookings…`, `/checkout/…`, `/account…`, `/auth/…`, `/preview/…`) are 301-redirected
   to the app by the landing's `sws.toml`, query string included. Rollback: point the apex back at `8001`.
6. **Seller console** (`sportgearhub-web-provider`): `VITE_STOREFRONT_BASE_URL` is not set anywhere, so the apex
   fallback in `providerStatus.ts:68` ships. Set it to `https://app.sportgearhub.ru` (deploy workflow + `vite-env.d.ts`).
   Its preview iframe loads `/offers/{id}` (`ProductDetailPage.tsx:550,572`), not `/preview/products/{id}`; only
   `/preview/**` allows framing by crm (`sws.toml`), so switch the iframe to the preview route while there.

## Decisions to make

- **ATOL place of settlement** (`Atol__PaymentAddress=https://sportgearhub.ru`, `.env:212`, also
  `appsettings.json:293`, `AtolSettings.cs:83`): printed on fiscal receipts and must match the cash register's
  registration. Payments will happen on `app.sportgearhub.ru`; whether the apex is still right (it is the platform's
  site) or the register needs re-registration is a question for the accountant / ATOL.
- **T-Bank Multisplit `siteUrl`** (`SellerPayoutRegistrationService.cs:28`): the apex, as the marketplace's site,
  reads correctly after the move; no change unless T-Bank asks for the payment page's host.
- **Indexing the app**: offers (`/offers/:id`) are worth indexing on app.sportgearhub.ru; account, checkout and
  bookings are not. Give the app its own `robots.txt`/sitemap once it moves.
- **Legal texts** (`sportgearhub-docs/docs/legal/*`) name `https://sportgearhub.ru` as the platform; still true, but
  `privacy_policy.md:73` links `https://sportgearhub.ru/privacy`, which exists on neither site (privacy lives on
  docs.sportgearhub.ru).

## Noticed on the way

- The API and the seller console both default to host port `8080` (`sportgearhub-web-provider` binds it on all
  interfaces, without `127.0.0.1:`). Fine only if a GitHub variable overrides one of them; worth a look.
