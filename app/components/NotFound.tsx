import { Link } from 'react-router';
import { appLink } from '~/lib/config';
import { buttonClass } from './button';

export function NotFound({ title = 'Такой страницы нет' }: { title?: string }) {
  return (
    <section className="container-page grid min-h-[60dvh] place-content-center justify-items-center py-16 text-center">
      <p className="text-6xl font-black tracking-tight text-primary">404</p>
      <h1 className="mt-3 text-2xl font-bold">{title}</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">Возможно, ссылка устарела. Начните с главной или откройте каталог.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to="/" className={buttonClass('outline')}>
          На главную
        </Link>
        <a href={appLink('/')} className={buttonClass('primary')}>
          Каталог
        </a>
      </div>
    </section>
  );
}
