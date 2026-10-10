import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from './home';

type HomeProps = Parameters<typeof Home>[0];

const loaderData = {
  categories: [{ slug: 'bicycle', title: 'Велосипед', count: 1, activities: [{ slug: 'cycling', title: 'Велоспорт' }] }],
  products: [
    {
      kind: 'product' as const,
      id: 'p1',
      title: 'Шоссейный велосипед',
      price: 900,
      imageUrl: 'https://img.example/p1.jpg',
      images: ['https://img.example/p1.jpg', 'https://img.example/p1-2.jpg'],
      categorySlug: 'bicycle',
      categoryTitle: 'Велосипед',
      seller: { key: 'velo', name: 'Велопрокат', description: null },
    },
  ],
  season: 'offseason' as const,
};

function renderHome() {
  render(
    <MemoryRouter>
      <Home {...({ loaderData } as unknown as HomeProps)} />
    </MemoryRouter>,
  );
}

describe('Home', () => {
  it('searches in the app’s catalogue, without a city', () => {
    renderHome();
    const form = screen.getByRole('search');
    expect(form).toHaveAttribute('action', 'https://app.sportgearhub.ru/');
    expect(form.querySelector('[name="city"]')).toBeNull();
  });

  it('shows real offers as cards linking to the app, priced from', () => {
    renderHome();
    const offers = screen.getByRole('region', { name: 'Сейчас в прокате' });
    const link = within(offers).getByRole('link', { name: /Шоссейный велосипед/ });
    expect(link).toHaveAttribute('href', 'https://app.sportgearhub.ru/offers/p1');
    expect(link).toHaveTextContent('от 900');
    expect(link).not.toHaveTextContent('Велопрокат');
    expect(link.querySelectorAll('img')).toHaveLength(3); // both photos, plus the first again for the endless loop
  });

  it('shows the category price without a count while offers are few', () => {
    renderHome();
    const categories = screen.getByRole('region', { name: 'Что взять в прокат' });
    const tile = within(categories).getByRole('link', { name: /Велосипед/ });
    expect(tile).toHaveAttribute('href', 'https://app.sportgearhub.ru/?category=bicycle');
    expect(tile).toHaveTextContent('от 900');
    expect(tile).not.toHaveTextContent('предложени');
  });

  it('offers collections only for activities that have offers, and the shop behind them', () => {
    renderHome();
    const collections = screen.getByRole('region', { name: 'Идеи на выходные' });
    expect(within(collections).getAllByRole('link')).toHaveLength(1);
    expect(within(collections).getByRole('link', { name: /На велосипеде/ })).toHaveAttribute('href', 'https://app.sportgearhub.ru/?activity=cycling');
    expect(within(screen.getByRole('region', { name: 'Прокаты-партнёры' })).getByRole('link', { name: /Велопрокат/ })).toHaveAttribute('href', 'https://app.sportgearhub.ru/providers/velo');
  });

  it('answers questions without JS', () => {
    renderHome();
    const faq = screen.getByRole('region', { name: 'Частые вопросы' });
    expect(within(faq).getAllByRole('group')).toHaveLength(7);
  });
});
