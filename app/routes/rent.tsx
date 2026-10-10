import { createElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { data, Link } from 'react-router';
import { Breadcrumbs, breadcrumbLd, offersLd, type Crumb } from '~/components/Breadcrumbs';
import { buttonClass } from '~/components/button';
import { Guarantees } from '~/components/Guarantees';
import { HeroBackdrop } from '~/components/HeroBackdrop';
import { OfferCard } from '~/components/OfferCard';
import { Section } from '~/components/Section';
import { SellerBand } from '~/components/SellerBand';
import { activityGradient, activityIcon } from '~/lib/activity-icons';
import { publicApi } from '~/lib/api.server';
import { activityPath, liveCategories, MIN_SHOWN_COUNT, plural, rentPath, toApiSlug, toCategories, toProductCards } from '~/lib/catalog';
import { appLink, config } from '~/lib/config';
import { seo } from '~/lib/seo';
import { rentDescription, rentHeading } from '~/lib/wording';
import type { Route } from './+types/rent';

/**
 * Build time, one page per category with offers (react-router.config lists them): the category with its live count and
 * activities, its offers (newest first), and the other stocked categories that share an activity with it.
 */
export async function loader({ params }: Route.LoaderArgs) {
  const slug = toApiSlug(params.category);
  const [options, products] = await Promise.all([publicApi.options(), publicApi.products({ pageSize: 24, category: slug })]);
  const live = liveCategories(toCategories(options?.categories ?? []));
  const category = live.find((c) => c.slug === slug);
  if (!category) throw data(null, { status: 404 });
  const shared = new Set(category.activities.map((a) => a.slug));
  return {
    category,
    offers: toProductCards(products ?? [], config.apiBaseUrl),
    related: live.filter((c) => c.slug !== slug && c.activities.some((a) => shared.has(a.slug))).slice(0, 10),
  };
}

const crumbs = (heading: string, slug: string): Crumb[] => [
  { label: 'Главная', path: '/' },
  { label: heading, path: rentPath(slug) },
];

export const meta: Route.MetaFunction = ({ loaderData: loaded }) => {
  if (!loaded) return [{ title: 'Страница не найдена | Sportgearhub' }, { name: 'robots', content: 'noindex' }];
  const { category, offers } = loaded;
  const heading = rentHeading(category.slug, category.title);
  return [
    ...seo({ title: `${heading} — онлайн-бронь и оплата`, description: rentDescription(category.title, category.count), path: rentPath(category.slug) }),
    { 'script:ld+json': { '@context': 'https://schema.org', '@graph': [breadcrumbLd(crumbs(heading, category.slug)), offersLd(offers)] } },
  ];
};

/**
 * «Прокат лыж»: a category's page for search. A drawn hero in the hue of its first activity (its icon floating, as on
 * the home cards) with the heading and a way into the app's catalogue on it; then the real offers, the activities it
 * belongs to, related categories, the guarantees and the seller band. Every offer opens in the app.
 */
export default function Rent({ loaderData }: Route.ComponentProps) {
  const { category, offers, related } = loaderData;
  const heading = rentHeading(category.slug, category.title);
  const activity = category.activities[0]?.slug ?? category.slug;
  const Icon = activityIcon(activity);
  return (
    <>
      <section className="container-page pt-4 sm:pt-8">
        <Breadcrumbs items={crumbs(heading, category.slug)} />
        <div className="relative isolate mt-3 overflow-hidden rounded-3xl text-white">
          <HeroBackdrop background={activityGradient(activity)} icons={[Icon, Icon, Icon, Icon, Icon, Icon, Icon, Icon]} />
          <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{heading}</h1>
            <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">
              {category.title} напрокат у проверенных прокатов: цена и залог видны до оплаты, бронь онлайн, оплата картой или через СБП.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={appLink('/', { category: category.slug })} className={buttonClass('inverse', 'lg')}>
                {category.count >= MIN_SHOWN_COUNT ? `Все ${category.count} ${plural(category.count, ['предложение', 'предложения', 'предложений'])}` : 'Открыть в каталоге'} <ArrowRight />
              </a>
              {category.activities.map((a) => (
                <Link key={a.slug} to={activityPath(a.slug)} className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium ring-1 ring-white/30 transition-colors hover:bg-white/25">
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {offers.length ? (
        <Section title="Сейчас в прокате" intro="Реальные предложения прокатов — откройте, чтобы выбрать даты и забронировать.">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {offers.map((o, i) => (
              <li key={o.id}>
                <OfferCard offer={o} eager={i < 2} delay={(i % 4) * 400} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {related.length ? (
        <Section title="Что ещё взять" className="pt-0 sm:pt-0 lg:pt-0">
          <ul className="flex flex-wrap gap-2">
            {related.map((c) => (
              <li key={c.slug}>
                <Link to={rentPath(c.slug)} className="inline-flex h-11 items-center gap-2 rounded-full border bg-card pr-4 pl-2 text-sm font-medium transition-colors hover:bg-muted">
                  <span className="grid size-7 place-items-center rounded-full" style={{ background: activityGradient(c.activities[0]?.slug ?? c.slug) }}>
                    {createElement(activityIcon(c.activities[0]?.slug ?? c.slug), { className: 'size-4 text-white', 'aria-hidden': true })}
                  </span>
                  {rentHeading(c.slug, c.title)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Guarantees />
      <SellerBand />
    </>
  );
}
