import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SELLER_FAQ, SELLERS } from '~/lib/content';
import Sellers from './sellers';

type SellersProps = Parameters<typeof Sellers>[0];

const shop = (key: string) => ({ key, name: `Прокат ${key}`, description: null, offers: 2, imageUrl: 'https://img.example/p.jpg' });

function renderSellers(sellers = [shop('a')]) {
  const loaderData = { cities: [{ name: 'Уфа', slug: 'ufa' }], sellers };
  render(
    <MemoryRouter>
      <Sellers {...({ loaderData } as unknown as SellersProps)} />
    </MemoryRouter>,
  );
}

describe('Sellers', () => {
  it('sends every sign-up button to the seller console', () => {
    renderSellers();
    const signUps = screen.getAllByRole('link', { name: /Подключить прокат/ });
    expect(signUps.length).toBeGreaterThanOrEqual(2);
    for (const link of signUps) expect(link).toHaveAttribute('href', 'https://crm.sportgearhub.ru');
  });

  it('walks through the seller’s day, one step per journey item', () => {
    renderSellers();
    const how = screen.getByRole('region', { name: 'Как это работает' });
    expect(within(how).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(SELLERS.journey.map((s) => s.title));
  });

  it('hides the shops while there are fewer than three', () => {
    renderSellers();
    expect(screen.queryByRole('region', { name: 'Уже на Sportgearhub' })).toBeNull();
  });

  it('lists real shops once there are enough', () => {
    renderSellers([shop('a'), shop('b'), shop('c')]);
    expect(within(screen.getByRole('region', { name: 'Уже на Sportgearhub' })).getAllByRole('link')).toHaveLength(3);
  });

  it('answers seller questions without JS', () => {
    renderSellers();
    const faq = screen.getByRole('region', { name: 'Частые вопросы' });
    expect(within(faq).getAllByRole('group')).toHaveLength(SELLER_FAQ.length);
  });
});
