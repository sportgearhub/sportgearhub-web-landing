import { ArrowRight, Bike, Check, Mountain, Snowflake, Tent, Waves } from 'lucide-react';
import { ActivityGrid } from '~/components/ActivityGrid';
import { buttonClass } from '~/components/button';
import { HeroBackdrop } from '~/components/HeroBackdrop';
import { CatalogMarquee } from '~/components/CatalogMarquee';
import { Guarantees } from '~/components/Guarantees';
import { HowItWorks } from '~/components/HowItWorks';
import { SellerBand } from '~/components/SellerBand';
import { Section } from '~/components/Section';
import { publicApi } from '~/lib/api.server';
import { gearOf, plural, taxonomyOf, toCategories } from '~/lib/catalog';
import { appLink } from '~/lib/config';
import { activityIcon } from '~/lib/activity-icons';
import { ABOUT, CATALOG_PITCH, RENT_REASONS } from '~/lib/content';
import { seo } from '~/lib/seo';
import type { Route } from './+types/about';

/** Build time: the platform's whole catalogue by activity, with what can be booked now — read once, baked in. */
export async function loader() {
  const [tree, options] = await Promise.all([publicApi.tree(), publicApi.options()]);
  return { taxonomy: taxonomyOf(tree ?? [], toCategories(options?.categories ?? [])) };
}

/**
 * The hero's ground: an outdoorsy green through teal to sky (the seller page is indigo, the closing band blue to
 * violet), with the platform's activities floating over it as frosted bubbles.
 */
const HERO_BACKGROUND = [
  'radial-gradient(38rem 24rem at 92% 0%, oklch(1 0 0 / 0.18), transparent 70%)',
  'radial-gradient(32rem 22rem at 0% 100%, oklch(0.85 0.14 130 / 0.3), transparent 70%)',
  'linear-gradient(125deg, oklch(0.3 0.07 170), oklch(0.45 0.11 172) 40%, oklch(0.52 0.12 205) 72%, oklch(0.62 0.12 230))',
].join(', ');
/** Without the catalogue (API down at build), a few activities anyway. */
const FALLBACK_ICONS = [Bike, Snowflake, Tent, Waves, Mountain];

export const meta: Route.MetaFunction = () => seo({ title: 'О сервисе', description: ABOUT.text, path: '/about', image: 'about' });

/**
 * «О сервисе»: what Sportgearhub is, then how wide it goes — every activity it covers (tiles), why rent at all, and
 * every kind of gear (the drifting catalogue) — then how it works, the guarantees and the seller band. The catalogue
 * parts are real (the tree and live counts); without the API they are left out.
 */
export default function About({ loaderData }: Route.ComponentProps) {
  const { taxonomy } = loaderData;
  const gear = gearOf(taxonomy);
  const heroIcons = taxonomy.length ? [...new Set(taxonomy.map((a) => activityIcon(a.slug)))] : FALLBACK_ICONS;
  return (
    <>
      <section className="container-page pt-6 sm:pt-10">
        <div className="relative isolate overflow-hidden rounded-3xl bg-emerald-950 text-white">
          <HeroBackdrop background={HERO_BACKGROUND} icons={heroIcons} bubbles />
          <div className="px-6 pt-20 pb-10 sm:px-12 sm:pt-28 sm:pb-14 lg:pt-32">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{ABOUT.title}</h1>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{ABOUT.text}</p>
            {gear.length ? (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/90">
                <li className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-brand" strokeWidth={3} aria-hidden />
                  {taxonomy.length} {plural(taxonomy.length, ['направление', 'направления', 'направлений'])} спорта и отдыха
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-brand" strokeWidth={3} aria-hidden />
                  {gear.length} {plural(gear.length, ['вид', 'вида', 'видов'])} снаряжения
                </li>
              </ul>
            ) : null}
            <a href={appLink('/')} className={buttonClass('inverse', 'lg', 'mt-7')}>
              Открыть каталог <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      {taxonomy.length ? (
        <Section title="Для любого занятия" intro="Зимой и летом, в горах и на воде, для тренировки и для отдыха — выберите, чем займётесь.">
          <ActivityGrid taxonomy={taxonomy} />
        </Section>
      ) : null}

      <Section title="Зачем брать в прокат" className={taxonomy.length ? 'pt-0 sm:pt-0 lg:pt-0' : undefined}>
        <ol className="snap-row sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {RENT_REASONS.map((r, i) => (
            <li key={r.title} className="w-[78%] shrink-0 snap-start rounded-3xl bg-canvas p-5 sm:w-auto sm:p-6">
              <span className="text-4xl font-extrabold tracking-tight text-primary/25 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-bold">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {gear.length ? (
        <Section title={CATALOG_PITCH.title} intro={CATALOG_PITCH.text} className="pt-0 sm:pt-0 lg:pt-0">
          <CatalogMarquee gear={gear} activities={taxonomy} lines={4} />
        </Section>
      ) : null}

      <Section title="Как это работает" className="pt-0 sm:pt-0 lg:pt-0">
        <HowItWorks />
      </Section>
      <Guarantees />
      <SellerBand />
    </>
  );
}
