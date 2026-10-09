import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { FAQ } from '~/lib/content';

/** Questions as native <details> (open without JS); the same text goes into FAQPage structured data on the page. */
export function Faq() {
  return (
    <section id="faq" aria-label="Частые вопросы" className="container-page scroll-mt-20 py-12 sm:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-14">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Частые вопросы</h2>
          <p className="mt-2 text-muted-foreground">
            Подробности — в{' '}
            <a href="https://docs.sportgearhub.ru/offer" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              оферте
            </a>{' '}
            и на странице{' '}
            <Link to="/documents" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              документов
            </Link>
            .
          </p>
        </div>
        <div className="divide-y border-y">
          {FAQ.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold outline-none focus-visible:text-primary [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="pb-5 leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
