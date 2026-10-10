import { describe, expect, it } from 'vitest';
import { activityPath, rentPath, toApiSlug, toUrlSlug } from './catalog';
import { rentDescription, rentHeading, rentList } from './wording';

describe('addresses', () => {
  it('uses the API slugs in English, hyphenated, and reads them back', () => {
    expect([rentPath('sup_board'), activityPath('winter_sports')]).toEqual(['/rent/sup-board', '/activities/winter-sports']);
    expect(toApiSlug(toUrlSlug('mountain_bike'))).toBe('mountain_bike');
  });
});

describe('wording', () => {
  it('puts «прокат» with the genitive plural, or falls back to «… напрокат»', () => {
    expect(rentHeading('skis', 'Лыжи')).toBe('Прокат лыж');
    expect(rentHeading('bicycle', 'Велосипед')).toBe('Прокат велосипедов');
    expect(rentHeading('trampoline', 'Батут')).toBe('Батут напрокат');
  });

  it('lists up to three categories for an activity, joined in Russian', () => {
    expect(rentList([{ slug: 'skis' }, { slug: 'snowboard' }, { slug: 'ice_skates' }, { slug: 'sledge_tube' }])).toBe('прокат лыж, сноубордов и коньков');
    expect(rentList([{ slug: 'skis' }])).toBe('прокат лыж');
    expect(rentList([{ slug: 'unknown' }])).toBeNull();
  });

  it('describes without prices, with the count only from three up', () => {
    expect(rentDescription('Лыжи', 4)).toMatch(/^Лыжи напрокат у проверенных прокатов.*В каталоге — 4 предложения\.$/);
    expect(rentDescription('Лыжи', 1)).not.toMatch(/предложени|₽/);
  });
});
