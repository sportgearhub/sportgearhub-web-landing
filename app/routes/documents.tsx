import { ExternalLink } from 'lucide-react';
import { LegalDetails } from '~/components/LegalDetails';
import { LEGAL_DOCUMENTS } from '~/lib/content';
import { seo } from '~/lib/seo';
import type { Route } from './+types/documents';

export const meta: Route.MetaFunction = () =>
  seo({ title: 'Документы и реквизиты', description: 'Условия сервиса, политика конфиденциальности, оферта и реквизиты Sportgearhub.', path: '/documents' });

export default function Documents() {
  return (
    <div className="container-page max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Документы</h1>
      <ul className="mt-6 grid divide-y rounded-2xl border bg-card">
        {LEGAL_DOCUMENTS.map((d) => (
          <li key={d.href}>
            <a href={d.href} target="_blank" rel="noreferrer" className="flex min-h-16 items-center justify-between gap-3 px-5 py-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-muted/60">
              <span>
                <span className="block font-semibold">{d.title}</span>
                <span className="block text-sm text-muted-foreground">{d.hint}</span>
              </span>
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 mb-3 text-lg font-bold">Реквизиты и оплата</h2>
      <LegalDetails className="text-sm" />
    </div>
  );
}
