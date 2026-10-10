import { Link } from 'react-router';
import { appLink, config } from '~/lib/config';
import { CONTACTS, LEGAL_DOCUMENTS } from '~/lib/content';
import { AppDownload } from './AppDownload';
import { LegalDetails } from './LegalDetails';
import { SocialLinks } from './SocialLinks';
import { Wordmark } from './Wordmark';

const linkClass = 'text-muted-foreground transition-colors hover:text-foreground';

/** Site footer: the brand with the apps, short link columns and contacts (two-up on phones), then the legal details. */
export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-[1fr_auto_auto] sm:gap-12 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:gap-16">
        <div className="col-span-2 space-y-3 sm:col-span-1">
          <Wordmark size="sm" />
          <p className="max-w-xs text-sm text-muted-foreground">Прокат спортивного снаряжения от проверенных локальных партнёров.</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Sportgearhub</p>
          <AppDownload />
        </div>
        <FooterColumn title="Сервис">
          <a className={linkClass} href={appLink('/')}>
            Каталог
          </a>
          <Link className={linkClass} to="/about">
            О сервисе
          </Link>
          <a className={linkClass} href={appLink('/account')}>
            Войти
          </a>
        </FooterColumn>
        <FooterColumn title="Продавцам">
          <Link className={linkClass} to="/sellers">
            Как подключиться
          </Link>
          <a className={linkClass} href={config.providerUrl}>
            Кабинет продавца
          </a>
          <a className={linkClass} href={config.docsUrl}>
            Документация
          </a>
        </FooterColumn>
        <FooterColumn title="Документы">
          {LEGAL_DOCUMENTS.map((d) => (
            <a key={d.href} className={linkClass} href={d.href}>
              {d.title}
            </a>
          ))}
          <Link className={linkClass} to="/documents">
            Реквизиты
          </Link>
        </FooterColumn>
        <FooterColumn title="Контакты">
          <a className={linkClass} href={`tel:${CONTACTS.phone}`}>
            {CONTACTS.phoneLabel}
          </a>
          <a className={`${linkClass} break-all`} href={`mailto:${CONTACTS.email}`}>
            {CONTACTS.email}
          </a>
          <SocialLinks className="mt-2" />
        </FooterColumn>
      </div>
      <div className="container-page grid gap-4 border-t py-6 pb-safe">
        <LegalDetails />
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title} className="grid content-start gap-2.5 text-sm">
      <span className="font-semibold">{title}</span>
      {children}
    </nav>
  );
}
