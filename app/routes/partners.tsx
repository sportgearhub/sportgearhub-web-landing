import { ArrowRight, ExternalLink } from 'lucide-react';
import { buttonClass } from '~/components/button';
import { Section } from '~/components/Section';
import { config } from '~/lib/config';
import { FOR_PARTNERS } from '~/lib/content';
import { seo } from '~/lib/seo';
import type { Route } from './+types/partners';

export const meta: Route.MetaFunction = () => seo({ title: 'Партнёрам', description: FOR_PARTNERS.subtitle, path: '/partners' });

/** Seller acquisition. Sign-up itself happens in the seller console. */
export default function Partners() {
  return (
    <>
      <section className="container-page py-12 sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">Для прокатов</p>
          <h1 className="text-4xl font-black tracking-tight text-balance sm:text-5xl">{FOR_PARTNERS.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{FOR_PARTNERS.subtitle}</p>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <a href={config.providerUrl} className={buttonClass('primary', 'lg')}>
              Подключить прокат <ArrowRight />
            </a>
            <a href={config.docsUrl} target="_blank" rel="noreferrer" className={buttonClass('outline', 'lg')}>
              Документация <ExternalLink />
            </a>
          </div>
        </div>
      </section>

      <section aria-label="Преимущества" className="bg-muted/60">
        <ul className="container-page grid gap-6 py-10 sm:grid-cols-2 sm:gap-8 sm:py-14 lg:grid-cols-4">
          {FOR_PARTNERS.benefits.map((b) => (
            <li key={b.title} className="rounded-2xl bg-card p-5 shadow-card">
              <h2 className="font-semibold">{b.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Section title="Как подключиться">
        <ol className="grid gap-6 sm:grid-cols-3 sm:gap-8">
          {FOR_PARTNERS.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4 sm:block">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-sm font-bold text-background tabular-nums sm:mb-3">{i + 1}</span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <a href={config.providerUrl} className={buttonClass('primary', 'lg', 'mt-8')}>
          Начать <ArrowRight />
        </a>
      </Section>
    </>
  );
}
