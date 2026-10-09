import type { MetaDescriptor } from 'react-router';
import { config } from './config';
import { HERO } from './content';

const SITE_NAME = 'Sportgearhub';

/** Title, description, canonical URL, Open Graph and Twitter tags for one page. */
export function seo({ title, description, path, image = HERO.image }: { title?: string; description: string; path: string; image?: string }): MetaDescriptor[] {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — аренда спортивного снаряжения рядом`;
  const url = `${config.siteUrl}${path === '/' ? '/' : path}`;
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];
}
