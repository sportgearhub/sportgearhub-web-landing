import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SELLER_FAQ, SELLERS } from '~/lib/content';
import Sellers from './sellers';

type SellersProps = Parameters<typeof Sellers>[0];

function renderSellers() {
  const loaderData = {
    sellers: 2,
    taxonomy: [
      {
        slug: 'winter_sports',
        title: 'Зимний спорт',
        count: 4,
        categories: [
          { slug: 'skis', title: 'Лыжи', count: 4 },
          { slug: 'snowboard', title: 'Сноуборд', count: 0 },
        ],
      },
      { slug: 'fishing', title: 'Рыбалка', count: 0, categories: [{ slug: 'fishing_rod', title: 'Удочка', count: 0 }] },
    ],
  };
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

  it('pitches what can be rented out: real figures as opportunity, and per activity what works and what is free', () => {
    renderSellers();
    const section = screen.getByRole('region', { name: 'Что можно сдавать' });
    expect(section).toHaveTextContent('2направления проката');
    expect(section).toHaveTextContent('3вида снаряжения можно сдавать');
    expect(section).toHaveTextContent('2проката уже подключились');
    expect(section).toHaveTextContent('2свободные категории — займите первыми');
    expect(within(section).getAllByRole('group')).toHaveLength(2);
    expect(within(section).getByText(/Рыбалка/).closest('summary')).toHaveTextContent('1 вид · все свободны');
  });

  it('answers seller questions without JS', () => {
    renderSellers();
    const faq = screen.getByRole('region', { name: 'Частые вопросы' });
    expect(within(faq).getAllByRole('group')).toHaveLength(SELLER_FAQ.length);
  });
});
