import type { MetaDescriptor } from 'react-router';
import { config } from './config';

const SITE_NAME = 'Sportgearhub';

/** The link-preview images (public/og/, 1200×630, rendered by `npm run og`): one per page, `home` for the rest. */
export type OgImage = 'home' | 'sellers' | 'about';

const OG_ALT: Record<OgImage, string> = {
  home: 'Sportgearhub — прокат спортивного снаряжения рядом',
  sellers: 'Sportgearhub для прокатов — больше клиентов для вашего проката',
  about: 'Sportgearhub — прокат снаряжения в одном месте',
};

/**
 * Title, description, canonical URL, Open Graph and Twitter tags for one page. `title` is the search phrase, first; the
 * page title adds «| Sportgearhub» after it, the Open Graph title doesn't (og:site_name carries the brand). Keep it to
 * ~55 characters (results cut at ~60–65) and the description to ~155. The preview image is absolute (bots don't resolve
 * relative ones reliably) and declares its size, type and alt.
 */
export function seo({ title, description, path, image = 'home' }: { title: string; description: string; path: string; image?: OgImage }): MetaDescriptor[] {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${config.siteUrl}${path === '/' ? '/' : path}`;
  const imageUrl = `${config.siteUrl}/og/${image}.png`;
  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: OG_ALT[image] },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: OG_ALT[image] },
  ];
}
