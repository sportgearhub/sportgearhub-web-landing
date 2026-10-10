import { Check } from 'lucide-react';
import { ActivityCards } from '~/components/ActivityCards';
import { CatalogMarquee } from '~/components/CatalogMarquee';
import { Faq } from '~/components/Faq';
import { Guarantees } from '~/components/Guarantees';
import { HeroOffers } from '~/components/HeroOffers';
import { HowItWorks } from '~/components/HowItWorks';
import { OfferRow } from '~/components/OfferCard';
import { SearchForm } from '~/components/SearchForm';
import { SellerBand } from '~/components/SellerBand';
import { Section } from '~/components/Section';
import { publicApi } from '~/lib/api.server';
import { activityCards, gearOf, liveCategories, plural, sampleOf, seasonOf, taxonomyOf, toCategories, toProductCards, type ActivityCard } from '~/lib/catalog';
import { appLink, config } from '~/lib/config';
import { CATALOG_PITCH, FAQ, HERO, SHOWCASE } from '~/lib/content';
import { seo } from '~/lib/seo';
import type { Route } from './+types/home';

/**
 * Runs at build time (pre-rendering): the page ships with the catalogue as it was then; CI rebuilds it on a schedule.
 * `products/options` gives the activities and categories with counts; for every stocked category its cheapest few give
 * the «от» price and a photo; `catalog/categories` adds the whole tree, empty kinds included, for the drifting
 * catalogue. A handful of public requests per build. If the API is down the page still builds: the activity cards fall
 * back to the curated activities alone.
 */
export async function loader() {
  const [options, products, tree] = await Promise.all([publicApi.options(), publicApi.products({ pageSize: 12 }), publicApi.tree()]);
  const season = seasonOf(new Date());
  const categories = liveCategories(toCategories(options?.categories ?? []));
  const activities = (options?.activities ?? []).filter((a) => a.count > 0);

  const sample = async (key: string, query: Parameters<typeof publicApi.products>[0]) => [key, sampleOf(await publicApi.products(query), config.apiBaseUrl)] as const;
  const byCategory = Object.fromEntries(await Promise.all(categories.map((c) => sample(c.slug, { pageSize: 4, sort: 'price_asc', category: c.slug }))));

  const cards: ActivityCard[] = options
    ? activityCards(activities, categories, { byCategory }, SHOWCASE, season)
    : SHOWCASE.map((s) => ({ slug: s.activity, title: s.title, count: 0, hint: s.hint, categories: [] }));

  return {
    activities: cards,
    offers: toProductCards(products ?? [], config.apiBaseUrl),
    taxonomy: taxonomyOf(tree ?? [], categories),
  };
}

export const meta: Route.MetaFunction = () => [
  ...seo({ description: HERO.subtitle, path: '/' }),
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', name: 'Sportgearhub', url: `${config.siteUrl}/`, logo: `${config.siteUrl}/icon-512.png` },
        {
          '@type': 'WebSite',
          name: 'Sportgearhub',
          url: `${config.siteUrl}/`,
          inLanguage: 'ru-RU',
          potentialAction: { '@type': 'SearchAction', target: `${config.appUrl}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
      ],
    },
  },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  const { activities, offers, taxonomy } = loaderData;
  const gear = gearOf(taxonomy);

  return (
    <>
      {/* Hero: the promise, the search, three short guarantees. Desktop: a real offer's photo with its card. */}
      <section className="container-page grid items-center gap-10 pt-6 pb-4 sm:pt-12 sm:pb-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16 lg:pb-12">
        <div>
          <h1 className="text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {HERO.title} <span className="text-primary">рядом с вами</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">{HERO.subtitle}</p>
          <SearchForm className="mt-6 max-w-2xl sm:mt-8" />
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            {HERO.promises.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-success" strokeWidth={3} aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: real offers taking turns, each with its card. */}
        <HeroOffers offers={offers.slice(0, 5)} fallbackImage={HERO.image} />
      </section>

      {gear.length ? (
        <Section
          title={CATALOG_PITCH.title}
          intro={`${CATALOG_PITCH.text} ${gear.length} ${plural(gear.length, ['вид', 'вида', 'видов'])} снаряжения в ${taxonomy.length} ${plural(taxonomy.length, ['занятии', 'занятиях', 'занятиях'])}.`}
          className="lg:pt-16"
        >
          <CatalogMarquee gear={gear} activities={taxonomy} lines={4} />
        </Section>
      ) : null}

      {activities.length ? (
        <Section
          id="activities"
          title="Чем займёмся?"
          intro="Занятия, для которых есть снаряжение в прокате, и что для них взять."
          more={{ href: appLink('/'), label: 'Весь каталог' }}
          className="pt-0 sm:pt-0 lg:pt-0"
        >
          <ActivityCards items={activities} />
        </Section>
      ) : null}

      {offers.length ? (
        <Section title="Сейчас в прокате" intro="Свежие предложения прокатов — бронируйте онлайн." more={{ href: appLink('/'), label: 'Все предложения' }} className="pt-0 sm:pt-0 lg:pt-0">
          <OfferRow offers={offers.slice(0, 8)} />
        </Section>
      ) : null}

      <Section id="how" title="Как это работает" intro="Три шага от поиска до выдачи — без звонков и очередей." className="pt-0 sm:pt-0 lg:pt-0">
        <HowItWorks />
      </Section>

      <Guarantees />
      <Faq />
      <SellerBand />
    </>
  );
}
