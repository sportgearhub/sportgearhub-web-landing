import { Check } from 'lucide-react';
import { CategoryGrid } from '~/components/CategoryGrid';
import { Collections } from '~/components/Collections';
import { Faq } from '~/components/Faq';
import { Guarantees } from '~/components/Guarantees';
import { HowItWorks } from '~/components/HowItWorks';
import { OfferRow } from '~/components/OfferCard';
import { Partners } from '~/components/Partners';
import { PopularLinks } from '~/components/PopularLinks';
import { SearchForm } from '~/components/SearchForm';
import { SellerBand } from '~/components/SellerBand';
import { Section } from '~/components/Section';
import { publicApi } from '~/lib/api.server';
import { activitiesOf, formatMoney, inSeasonFirst, liveCategories, liveCollections, seasonOf, sellersOf, toCategories, toProductCards } from '~/lib/catalog';
import { appLink, config } from '~/lib/config';
import { FAQ, HERO, SHOWCASE } from '~/lib/content';
import { seo } from '~/lib/seo';
import type { Route } from './+types/home';

/** Runs at build time (pre-rendering): the page ships with the catalogue as it was then. CI rebuilds it on a schedule. */
export async function loader() {
  const [categories, products] = await Promise.all([publicApi.categories(), publicApi.products()]);
  return {
    categories: liveCategories(toCategories(categories ?? [])),
    products: toProductCards(products ?? [], config.apiBaseUrl),
    season: seasonOf(new Date()),
  };
}

const OFFERS_TITLE = { summer: 'Летний сезон', winter: 'Зимний сезон', offseason: 'Сейчас в прокате' } as const;

export const meta: Route.MetaFunction = () => [
  ...seo({ description: HERO.subtitle, path: '/' }),
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', name: 'Sportgearhub', url: `${config.siteUrl}/`, logo: `${config.siteUrl}/favicon.svg` },
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
  const { categories, products, season } = loaderData;
  const offers = inSeasonFirst(products, categories, season).slice(0, 8);
  const collections = liveCollections(SHOWCASE, categories);
  const sellers = sellersOf(products);
  const featured = offers[0];

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

        <div className="relative hidden lg:block">
          <img
            src={featured?.imageUrl ?? HERO.image}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/3.6] w-full rounded-3xl object-cover"
          />
          {featured ? (
            <a
              href={appLink(`/offers/${featured.id}`)}
              className="absolute -bottom-6 -left-8 flex max-w-80 items-center gap-3 rounded-2xl bg-card p-3 pr-5 shadow-float outline-none hover:ring-2 hover:ring-primary/30 focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <img src={featured.imageUrl} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
              <span className="min-w-0">
                <span className="line-clamp-1 text-sm font-semibold">{featured.title}</span>
                {featured.price != null ? (
                  <span className="text-sm text-muted-foreground">
                    от <span className="font-bold text-foreground">{formatMoney(featured.price)}</span>
                  </span>
                ) : null}
                <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden />
                  Можно забронировать онлайн
                </span>
              </span>
            </a>
          ) : null}
        </div>
      </section>

      <Section title="Что взять в прокат" more={{ href: appLink('/'), label: 'Весь каталог' }} className="lg:pt-16">
        <CategoryGrid categories={categories} products={products} />
      </Section>

      {offers.length ? (
        <Section title={OFFERS_TITLE[season]} intro="Свежие предложения прокатов — бронируйте онлайн." more={{ href: appLink('/'), label: 'Все предложения' }} className="pt-0 sm:pt-0 lg:pt-0">
          <OfferRow offers={offers} />
        </Section>
      ) : null}

      {collections.length ? (
        <Section title="Идеи на выходные" intro="Подборки по занятиям — от реки до горнолыжного склона." className="pt-0 sm:pt-0 lg:pt-0">
          <Collections items={collections} />
        </Section>
      ) : null}

      {sellers.length ? (
        <Section title="Прокаты-партнёры" intro="Местные прокаты, которые работают через Sportgearhub." className="pt-0 sm:pt-0 lg:pt-0">
          <Partners sellers={sellers} />
        </Section>
      ) : null}

      <Section id="how" title="Как это работает" intro="Три шага от поиска до выдачи — без звонков и очередей." className="pt-0 sm:pt-0 lg:pt-0">
        <HowItWorks />
      </Section>

      <Guarantees />
      <Faq />
      <SellerBand />
      <PopularLinks categories={categories} activities={activitiesOf(categories)} />
    </>
  );
}
