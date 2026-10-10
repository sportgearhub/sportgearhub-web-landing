import { createElement } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
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
import { rentHeading, rentList } from '~/lib/wording';
import type { Route } from './+types/activity';

/** Build time, one page per activity with offers (react-router.config lists them): its stocked categories and offers. */
export async function loader({ params }: Route.LoaderArgs) {
  const slug = toApiSlug(params.activity);
  const [options, products] = await Promise.all([publicApi.options(), publicApi.products({ pageSize: 24, activity: slug })]);
  const activity = options?.activities.find((a) => a.slug === slug && a.count > 0);
  if (!activity) throw data(null, { status: 404 });
  return {
    activity: { slug: activity.slug, title: activity.title, count: activity.count },
    categories: liveCategories(toCategories(options?.categories ?? [])).filter((c) => c.activities.some((a) => a.slug === slug)),
    offers: toProductCards(products ?? [], config.apiBaseUrl),
  };
}

const crumbs = (title: string, slug: string): Crumb[] => [
  { label: 'Главная', path: '/' },
  { label: title, path: activityPath(slug) },
];

export const meta: Route.MetaFunction = ({ loaderData: loaded }) => {
  if (!loaded) return [{ title: 'Страница не найдена | Sportgearhub' }, { name: 'robots', content: 'noindex' }];
  const { activity, categories, offers } = loaded;
  const list = rentList(categories);
  const names = categories.slice(0, 4).map((c) => c.title.toLowerCase());
  return [
    ...seo({
      title: `${activity.title}: ${list ?? 'прокат снаряжения'}`,
      description: `${activity.title} — снаряжение напрокат у проверенных прокатов${names.length ? `: ${names.join(', ')}` : ''}. Бронь онлайн, оплата картой или через СБП.`,
      path: activityPath(activity.slug),
    }),
    { 'script:ld+json': { '@context': 'https://schema.org', '@graph': [breadcrumbLd(crumbs(activity.title, activity.slug)), offersLd(offers)] } },
  ];
};

/**
 * An activity's page for search: a drawn hero in its hue with its icon floating, the categories it has (each to its
 * own page), its real offers, the guarantees and the seller band.
 */
export default function Activity({ loaderData }: Route.ComponentProps) {
  const { activity, categories, offers } = loaderData;
  const Icon = activityIcon(activity.slug);
  return (
    <>
      <section className="container-page pt-4 sm:pt-8">
        <Breadcrumbs items={crumbs(activity.title, activity.slug)} />
        <div className="relative isolate mt-3 overflow-hidden rounded-3xl text-white">
          <HeroBackdrop background={activityGradient(activity.slug)} icons={[Icon, Icon, Icon, Icon, Icon, Icon, Icon, Icon]} />
          <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{activity.title}: прокат снаряжения</h1>
            <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">Всё, что нужно для занятия, — напрокат у проверенных прокатов, с онлайн-бронью и оплатой.</p>
            <a href={appLink('/', { activity: activity.slug })} className={buttonClass('inverse', 'lg', 'mt-6')}>
              {activity.count >= MIN_SHOWN_COUNT ? `Все ${activity.count} ${plural(activity.count, ['предложение', 'предложения', 'предложений'])}` : 'Открыть в каталоге'} <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {categories.length ? (
        <Section title="Что взять">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={rentPath(c.slug)} className="group flex min-h-16 items-center gap-3 rounded-2xl bg-canvas p-3 transition-colors hover:bg-muted">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: activityGradient(activity.slug) }}>
                    {createElement(Icon, { className: 'size-5 text-white', 'aria-hidden': true })}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{rentHeading(c.slug, c.title)}</span>
                    {c.count >= MIN_SHOWN_COUNT ? <span className="block text-sm text-muted-foreground">{`${c.count} ${plural(c.count, ['предложение', 'предложения', 'предложений'])}`}</span> : null}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {offers.length ? (
        <Section title="Сейчас в прокате" className="pt-0 sm:pt-0 lg:pt-0">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {offers.map((o, i) => (
              <li key={o.id}>
                <OfferCard offer={o} eager={i < 2} delay={(i % 4) * 400} />
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
