import { describe, expect, it } from 'vitest';
import { appLink } from './config';
import { activityCards, gearOf, plural, resolveMediaUrl, sampleOf, seasonOf, taxonomyOf, toProductCards, type Category, type ShowcaseCard, type WireProduct, type WireTreeCategory } from './catalog';

const API = 'https://api.example';

const wire = (id: string, extra: Partial<WireProduct> = {}): WireProduct => ({
  product_id: id,
  title: `Товар ${id}`,
  price: 500,
  images: [{ url: `/api/v1/media/${id}`, sort_order: 0 }],
  ...extra,
});

describe('toProductCards', () => {
  it('keeps every photo in order, resolved, without repeats, up to five; drops products with none', () => {
    const images = [3, 1, 2, 2, 4, 5, 6].map((n, i) => ({ url: `/m/${n}`, sort_order: n * 10 + i }));
    const cards = toProductCards([wire('a', { images }), wire('b', { images: [] }), wire('c', { images: null })], API);
    expect(cards.map((c) => c.id)).toEqual(['a']);
    expect(cards[0]!.images).toEqual([1, 2, 3, 4, 5].map((n) => `${API}/m/${n}`));
    expect(cards[0]!.imageUrl).toBe(`${API}/m/1`);
  });

  it('leaves absolute URLs alone', () => {
    expect(resolveMediaUrl('http://x.example/p.jpg', API)).toBe('http://x.example/p.jpg');
  });
});

describe('sampleOf', () => {
  it('takes the lowest price among the offers and the first photo, even when the cheapest has none', () => {
    expect(sampleOf([wire('a', { price: 300, images: [] }), wire('b', { price: 450 })], API)).toEqual({ from: 300, imageUrl: `${API}/api/v1/media/b` });
    expect(sampleOf([], API)).toBeUndefined();
    expect(sampleOf(null, API)).toBeUndefined();
  });
});

describe('activityCards', () => {
  const cat = (slug: string, count: number, activities: string[]): Category => ({ slug, title: slug, count, activities: activities.map((a) => ({ slug: a, title: a })) });
  const categories = [cat('bicycle', 1, ['cycling', 'tourism']), cat('skis', 4, ['winter_sports', 'tourism']), cat('helmet', 0, ['winter_sports'])];
  const activities = [
    { slug: 'tourism', title: 'Туризм', count: 5 },
    { slug: 'winter_sports', title: 'Зимний спорт', count: 4 },
    { slug: 'cycling', title: 'Велоспорт', count: 1 },
    { slug: 'yoga', title: 'Йога', count: 0 },
  ];
  const showcase: ShowcaseCard[] = [{ kind: 'showcase', id: 'w', title: 'Зимние выходные', hint: 'Лыжи на сезон', activity: 'winter_sports', imageUrl: '/curated.jpg' }];
  const samples = {
    byActivity: { tourism: { from: 900, imageUrl: '/tour.jpg' }, cycling: { from: 500, imageUrl: '/bike.jpg' } },
    byCategory: { bicycle: { from: 500, imageUrl: '/b.jpg' }, skis: { from: 900, imageUrl: '/s.jpg' } },
  };

  it('lists activities with offers, each with its stocked categories, price and photo from the samples', () => {
    const cards = activityCards(activities, categories, samples, showcase, 'offseason');
    expect(cards.map((c) => [c.slug, c.categories.map((r) => r.slug)])).toEqual([
      ['tourism', ['bicycle', 'skis']],
      ['winter_sports', ['skis']],
      ['cycling', ['bicycle']],
    ]);
    expect(cards[1]!.categories[0]).toEqual({ slug: 'skis', title: 'skis', count: 4, from: 900, imageUrl: '/s.jpg' });
  });

  it('covers an activity with its curated photo first, else a real offer’s', () => {
    const cards = activityCards(activities, categories, samples, showcase, 'offseason');
    expect(cards.find((c) => c.slug === 'winter_sports')).toMatchObject({ imageUrl: '/curated.jpg', hint: 'Лыжи на сезон' });
    expect(cards.find((c) => c.slug === 'tourism')).toMatchObject({ imageUrl: '/tour.jpg', hint: null });
  });

  it('puts the season’s activities first', () => {
    expect(activityCards(activities, categories, samples, showcase, 'winter').map((c) => c.slug)).toEqual(['winter_sports', 'tourism', 'cycling']);
    expect(activityCards(activities, categories, samples, showcase, 'summer')[0]!.slug).toBe('cycling');
  });

  it('knows the season of a date', () => {
    expect([new Date(2026, 6, 1), new Date(2026, 0, 10), new Date(2026, 9, 9)].map(seasonOf)).toEqual(['summer', 'winter', 'offseason']);
  });
});

describe('taxonomyOf', () => {
  const node = (id: string, slug: string, parent: string | null, activities: string[]): WireTreeCategory => ({
    category_id: id,
    parent_id: parent,
    slug,
    name: slug,
    activities: activities.map((a) => ({ slug: a, title: a })),
  });
  const tree = [
    node('g1', 'winter_gear', null, ['winter_sports']),
    node('c1', 'skis', 'g1', ['winter_sports', 'tourism']),
    node('c2', 'snowboard', 'g1', ['winter_sports']),
    node('c3', 'tent', null, ['tourism', 'camping']),
  ];

  it('lists every activity with its kinds of gear (groups are headings, not gear), counted from the live list, busiest first', () => {
    const taxonomy = taxonomyOf(tree, [{ slug: 'skis', title: 'skis', count: 4, activities: [] }]);
    expect(taxonomy.map((a) => [a.slug, a.count, a.categories.map((c) => [c.slug, c.count])])).toEqual([
      ['winter_sports', 4, [['skis', 4], ['snowboard', 0]]],
      ['tourism', 4, [['skis', 4], ['tent', 0]]],
      ['camping', 0, [['tent', 0]]],
    ]);
  });

  it('gives every kind of gear once, under the first activity listing it', () => {
    expect(gearOf(taxonomyOf(tree, [])).map((g) => [g.slug, g.activity])).toEqual([
      ['skis', 'winter_sports'],
      ['snowboard', 'winter_sports'],
      ['tent', 'tourism'],
    ]);
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
