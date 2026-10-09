import { ArrowRight } from 'lucide-react';
import { buttonClass } from '~/components/button';
import { Guarantees } from '~/components/Guarantees';
import { HowItWorks } from '~/components/HowItWorks';
import { PartnerBand } from '~/components/PartnerBand';
import { Section } from '~/components/Section';
import { appLink } from '~/lib/config';
import { ABOUT, HERO } from '~/lib/content';
import { seo } from '~/lib/seo';
import type { Route } from './+types/about';

export const meta: Route.MetaFunction = () => seo({ title: 'О сервисе', description: ABOUT.text, path: '/about' });

export default function About() {
  return (
    <>
      <section className="container-page pt-6 sm:pt-10">
        <div className="relative isolate overflow-hidden rounded-3xl bg-foreground text-white">
          <img src={HERO.image} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground via-foreground/50 to-transparent" aria-hidden />
          <div className="px-6 pt-32 pb-10 sm:px-12 sm:pt-48 sm:pb-14">
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{ABOUT.title}</h1>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{ABOUT.text}</p>
            <a href={appLink('/')} className={buttonClass('inverse', 'lg', 'mt-7')}>
              Открыть каталог <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <Section title="Как это работает">
        <HowItWorks />
      </Section>
      <Guarantees />
      <PartnerBand />
    </>
  );
}
