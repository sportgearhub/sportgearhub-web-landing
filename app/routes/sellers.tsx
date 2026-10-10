import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bike,
  CalendarCheck,
  Check,
  Clock,
  Dumbbell,
  Fish,
  Hourglass,
  Layers,
  LifeBuoy,
  MapPin,
  Mountain,
  QrCode,
  ReceiptText,
  Sailboat,
  ScanLine,
  Snowflake,
  Store,
  Tent,
  Users,
  Wallet,
  Waves,
  Zap,
} from 'lucide-react';
import { buttonClass } from '~/components/button';
import { HeroBackdrop } from '~/components/HeroBackdrop';
import { BookingsMock, CatalogMock, CounterMock, HeroMock } from '~/components/ConsoleMocks';
import { Faq } from '~/components/Faq';
import { SellerBand } from '~/components/SellerBand';
import { SellerCatalog } from '~/components/SellerCatalog';
import { Section } from '~/components/Section';
import { publicApi } from '~/lib/api.server';
import { taxonomyOf, toCategories } from '~/lib/catalog';
import { config } from '~/lib/config';
import { SELLER_FAQ, SELLERS } from '~/lib/content';
import { seo } from '~/lib/seo';
import { cn } from '~/lib/utils';
import type { Route } from './+types/sellers';

/**
 * Build time: the whole catalogue with what is already rented, and how many rentals are connected — read once and baked
 * into the page. No city: the platform isn't about one city, so the page doesn't name any.
 */
export async function loader() {
  const [tree, options, sellers] = await Promise.all([publicApi.tree(), publicApi.options(), publicApi.sellerCount()]);
  return {
    taxonomy: taxonomyOf(tree ?? [], toCategories(options?.categories ?? [])),
    sellers,
  };
}

export const meta: Route.MetaFunction = () => [
  ...seo({ title: 'Продавцам', description: SELLERS.subtitle, path: '/sellers' }),
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SELLER_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  },
];

/**
 * The hero's ground: deep indigo through the brand blue to teal (the closing band is blue to violet, so the page opens
 * and ends differently), with the gear people rent out and the seller's tools floating over it.
 */
const HERO_BACKGROUND = [
  'radial-gradient(40rem 26rem at 90% 0%, oklch(1 0 0 / 0.16), transparent 70%)',
  'radial-gradient(34rem 22rem at 0% 100%, oklch(0.8 0.13 195 / 0.35), transparent 70%)',
  'linear-gradient(125deg, oklch(0.27 0.1 275), oklch(0.42 0.19 268) 42%, oklch(0.5 0.15 240) 72%, oklch(0.6 0.12 205))',
].join(', ');
const HERO_ICONS = [Bike, Store, Snowflake, CalendarCheck, Tent, Wallet, Waves, QrCode, Mountain, ScanLine, Sailboat, Fish, Dumbbell, Zap];

const JOURNEY_SCREENS = [<CatalogMock key="c" />, <BookingsMock key="b" />, <CounterMock key="q" />];
const FLOW_ICONS = [ReceiptText, Clock, Hourglass, Banknote];
const FEATURE_ICONS = [MapPin, Users, Store, Layers, LifeBuoy, ReceiptText];

/**
 * Seller acquisition, its own look within the site's tokens: a dark «for business» hero and closing band around a
 * light page. Benefit first, then plain rules as big numbers, the seller's day as a journey of console screens, money,
 * everything else as one-liners, advice, onboarding and questions. Sign-up itself happens in the console.
 */
export default function Sellers({ loaderData }: Route.ComponentProps) {
  const { taxonomy, sellers } = loaderData;
  const { money } = SELLERS;
  return (
    <>
      {/* Hero */}
      <section className="container-page pt-4 sm:pt-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-indigo-950 text-white">
          <HeroBackdrop background={HERO_BACKGROUND} icons={HERO_ICONS} />
          <div className="grid items-center gap-10 px-6 pt-10 pb-12 sm:px-10 sm:pt-14 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-14 lg:py-20">
            <div>
              <p className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 ring-1 ring-white/15">
                <Store className="size-4" aria-hidden />
                Для прокатов
              </p>
              <h1 className="text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">{SELLERS.title}</h1>
              <p className="mt-4 max-w-xl text-base text-pretty text-white/75 sm:text-lg">{SELLERS.subtitle}</p>
              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <a href={config.providerUrl} className={buttonClass('inverse', 'lg')}>
                  Подключить прокат <ArrowRight />
                </a>
                <a href="#how" className={buttonClass('ghost', 'lg', 'text-white ring-1 ring-white/25 hover:bg-white/10')}>
                  Как это работает
                </a>
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/85">
                {SELLERS.facts.map((f) => (
                  <li key={f} className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-brand" strokeWidth={3} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <HeroMock />
          </div>
        </div>
      </section>

      {/* The rules that matter, as big numbers. */}
      <section aria-label="Коротко" className="container-page py-10 sm:py-14">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-8">
          {SELLERS.numbers.map((n) => (
            <li key={n.label} className="border-l-2 border-primary pl-4">
              <p className="text-3xl font-black tracking-tight sm:text-4xl">{n.value}</p>
              <p className="mt-0.5 text-sm font-semibold">{n.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* The seller's day: numbered steps on one line, each beside its console screen. */}
      <Section id="how" title="Как это работает" intro="Один кабинет — от карточки до выдачи." className="pt-0 sm:pt-0 lg:pt-0">
        <ol className="relative grid gap-14 sm:gap-20 lg:before:absolute lg:before:inset-y-6 lg:before:left-1/2 lg:before:w-px lg:before:bg-border">
          {SELLERS.journey.map((step, i) => (
            <li key={step.id} id={step.id} className="relative grid scroll-mt-24 items-center gap-6 lg:grid-cols-2 lg:gap-24">
              <span
                className="absolute top-6 left-1/2 hidden size-10 -translate-x-1/2 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground tabular-nums ring-8 ring-background lg:grid"
                aria-hidden
              >
                {i + 1}
              </span>
              <div className={cn(i % 2 === 1 && 'lg:order-2')}>
                <span className="text-5xl font-extrabold tracking-tight text-primary/25 tabular-nums lg:hidden">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.text}</p>
                <ul className="mt-5 grid gap-2.5">
                  {step.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              {JOURNEY_SCREENS[i]}
            </li>
          ))}
        </ol>
      </Section>

      {taxonomy.length ? (
        <Section
          id="catalog"
          title="Что можно сдавать"
          intro="От велосипеда до снегохода — площадка принимает всё, что сдают в прокат. Свободные категории ждут первого проката."
          className="pt-0 sm:pt-0 lg:pt-0"
        >
          <SellerCatalog taxonomy={taxonomy} sellers={sellers} />
        </Section>
      ) : null}

      {/* Money: the path of a payment, then what «Финансы» shows. */}
      <section id="money" aria-label={money.title} className="container-page scroll-mt-20 pb-12 sm:pb-16 lg:pb-20">
        <div className="rounded-3xl bg-canvas p-6 sm:p-10 lg:p-14">
          <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">{money.title}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{money.text}</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {money.flow.map((step, i) => {
              const Icon = FLOW_ICONS[i]!;
              return (
                <li key={step.title} className={cn('rounded-2xl bg-card p-5 shadow-card', i === money.flow.length - 1 && 'bg-primary text-primary-foreground')}>
                  <div className="flex items-center justify-between">
                    <Icon className={cn('size-6', i === money.flow.length - 1 ? 'text-primary-foreground' : 'text-primary')} aria-hidden />
                    <span className="text-xs font-semibold opacity-50 tabular-nums">{i + 1} / {money.flow.length}</span>
                  </div>
                  <h3 className="mt-4 font-bold">{step.title}</h3>
                  <p className={cn('mt-1 text-sm leading-relaxed', i === money.flow.length - 1 ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {money.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section title="И ещё в кабинете" className="pt-0 sm:pt-0 lg:pt-0">
        <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {SELLERS.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i]!;
            return (
              <li key={f} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="pt-1 text-sm leading-snug font-medium">{f}</span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Как продавать больше" intro="Несколько привычек, которые помогают карточкам работать." className="pt-0 sm:pt-0 lg:pt-0">
        <ol className="snap-row sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SELLERS.tips.map((t, i) => (
            <li key={t.title} className="w-[78%] shrink-0 snap-start rounded-2xl border p-5 sm:w-auto sm:p-6">
              <span className="text-4xl font-extrabold tracking-tight text-primary/25 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-bold">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="start" title="Как подключиться" intro="Шесть шагов. Чек-лист в кабинете покажет, чего ещё не хватает." className="pt-0 sm:pt-0 lg:pt-0">
        <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {SELLERS.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums',
                  i === SELLERS.steps.length - 1 ? 'bg-success/15 text-success' : 'bg-accent text-accent-foreground',
                )}
              >
                {i === SELLERS.steps.length - 1 ? <BadgeCheck className="size-5" aria-label={String(i + 1)} /> : i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Faq
        items={SELLER_FAQ}
        intro={
          <>
            Подробнее — в{' '}
            <a href={config.docsUrl} className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              документации
            </a>
            .
          </>
        }
      />

      {/* Closing band: the same as at the foot of every page, with this page's closing words. */}
      <SellerBand
        title="Готовы принимать брони онлайн?"
        text="Подключение — в кабинете продавца. Абонентской платы нет, комиссия только с состоявшихся броней."
        more={false}
      />

      {/* Phones: «Подключить» stays at hand once the hero's button has scrolled away (CSS only, see .cta-reveal). */}
      <div className="cta-reveal sticky bottom-0 z-30 border-t bg-background/90 px-4 pt-3 pb-safe backdrop-blur-md sm:hidden">
        <a href={config.providerUrl} className={buttonClass('primary', 'lg', 'w-full')}>
          Подключить прокат <ArrowRight />
        </a>
      </div>
    </>
  );
}
