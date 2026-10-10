import { describe, expect, it } from 'vitest';
import { appLink } from './config';
import {
  activitiesOf,
  inSeasonFirst,
  liveCollections,
  plural,
  priceFrom,
  resolveMediaUrl,
  seasonOf,
  sellersOf,
  toProductCards,
  type Category,
  type ProductCard,
  type ShowcaseCard,
  type WireProduct,
} from './catalog';

const API = 'https://api.example';

const wire = (id: string, extra: Partial<WireProduct> = {}): WireProduct => ({
  product_id: id,
  title: `Товар ${id}`,
  price: 500,
  media_preview_url: `/api/v1/media/${id}`,
  images: [],
  category: { slug: 'bicycle', title: 'Велосипед' },
  seller: { seller_id: 's-1', slug: null, display_name: 'Прокат', description: null },
  ...extra,
});

const card = (id: string, extra: Partial<ProductCard> = {}): ProductCard => ({
  kind: 'product',
  id,
  title: id,
  price: 100,
  imageUrl: `/${id}.jpg`,
  images: [`/${id}.jpg`],
  categorySlug: 'bicycle',
  categoryTitle: 'Велосипед',
  seller: null,
  ...extra,
});

const categories: Category[] = [
  { slug: 'sup', title: 'SUP', count: 1, activities: [{ slug: 'water_sports', title: 'Водный спорт' }, { slug: 'tourism', title: 'Туризм' }] },
  { slug: 'skis', title: 'Лыжи', count: 2, activities: [{ slug: 'winter_sports', title: 'Зимний спорт' }, { slug: 'tourism', title: 'Туризм' }] },
  { slug: 'empty', title: 'Пусто', count: 0, activities: [{ slug: 'active_leisure', title: 'Активный отдых' }] },
];

describe('toProductCards', () => {
  it('takes the first photo by order, resolves API media paths, links the shop by slug or id, and drops products with no photo', () => {
    const cards = toProductCards(
      [
        wire('a', { images: [{ url: '/m/2', sort_order: 2 }, { url: '/m/1', sort_order: 1 }] }),
        wire('b', { media_preview_url: 'https://cdn.example/b.jpg', seller: { seller_id: 's-2', slug: 'velo', display_name: 'Вело', description: null } }),
        wire('c', { media_preview_url: null }),
      ],
      API,
    );
    expect(cards.map((c) => c.imageUrl)).toEqual(['https://api.example/m/1', 'https://cdn.example/b.jpg']);
    expect(cards.map((c) => c.seller?.key)).toEqual(['s-1', 'velo']);
  });

  it('keeps every photo in order for the card carousel, without repeats, up to five', () => {
    const images = [3, 1, 2, 2, 4, 5, 6].map((n, i) => ({ url: `/m/${n}`, sort_order: n * 10 + i }));
    const [cardA] = toProductCards([wire('a', { images })], API);
    expect(cardA!.images).toEqual([1, 2, 3, 4, 5].map((n) => `${API}/m/${n}`));
    expect(toProductCards([wire('b')], API)[0]!.images).toEqual([`${API}/api/v1/media/b`]);
  });

  it('leaves absolute URLs alone', () => {
    expect(resolveMediaUrl('http://x.example/p.jpg', API)).toBe('http://x.example/p.jpg');
  });
});

describe('arranging', () => {
  it('gives a category the lowest priced offer, or nothing', () => {
    const products = [card('a', { price: 900 }), card('b', { price: 500 }), card('c', { price: null })];
    expect(priceFrom(products, 'bicycle')).toBe(500);
    expect(priceFrom(products, 'sup')).toBeNull();
  });

  it('puts offers in season first', () => {
    const products = [card('bike', { categorySlug: 'bike' }), card('skis', { categorySlug: 'skis' }), card('sup', { categorySlug: 'sup' })];
    expect(inSeasonFirst(products, categories, 'winter').map((p) => p.id)).toEqual(['skis', 'bike', 'sup']);
    expect(inSeasonFirst(products, categories, 'offseason').map((p) => p.id)).toEqual(['bike', 'skis', 'sup']);
  });

  it('knows the season of a date', () => {
    expect([new Date(2026, 6, 1), new Date(2026, 0, 10), new Date(2026, 9, 9)].map(seasonOf)).toEqual(['summer', 'winter', 'offseason']);
  });

  it('counts offers per shop, most first', () => {
    const shop = (key: string) => ({ key, name: key, description: null });
    const sellers = sellersOf([card('a', { seller: shop('x') }), card('b', { seller: shop('y') }), card('c', { seller: shop('y') }), card('d')]);
    expect(sellers.map((s) => [s.key, s.offers])).toEqual([
      ['y', 2],
      ['x', 1],
    ]);
  });

  it('keeps only collections whose activity has offers now', () => {
    const tile = (activity: string): ShowcaseCard => ({ kind: 'showcase', id: activity, title: activity, hint: '', imageUrl: '', activity });
    expect(liveCollections([tile('water_sports'), tile('cycling'), tile('active_leisure'), tile('tourism')], categories).map((c) => c.id)).toEqual([
      'water_sports',
      'tourism',
    ]);
  });

  it('lists each activity once', () => {
    expect(activitiesOf(categories).map((a) => a.slug)).toEqual(['water_sports', 'tourism', 'winter_sports', 'active_leisure']);
  });
});

describe('appLink', () => {
  it('builds catalogue links into the app, dropping empty filters', () => {
    expect(appLink('/', { category: 'bicycle', q: undefined }, 'https://app.example')).toBe('https://app.example/?category=bicycle');
    expect(appLink('/offers/42', {}, 'https://app.example')).toBe('https://app.example/offers/42');
  });
});

describe('plural', () => {
  it('picks Russian forms', () => {
    const forms: [string, string, string] = ['предложение', 'предложения', 'предложений'];
    expect([1, 3, 5, 11, 21].map((n) => plural(n, forms))).toEqual(['предложение', 'предложения', 'предложений', 'предложений', 'предложение']);
  });
});
