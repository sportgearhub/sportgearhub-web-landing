import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from './home';

type HomeProps = Parameters<typeof Home>[0];

const loaderData = {
  activities: [
    {
      slug: 'winter_sports',
      title: 'Зимний спорт',
      count: 4,
      imageUrl: 'https://img.example/winter.jpg',
      hint: 'Лыжи и сноуборды на сезон',
      categories: [{ slug: 'skis', title: 'Лыжи', count: 4, from: 900, imageUrl: 'https://img.example/skis.jpg' }],
    },
    {
      slug: 'cycling',
      title: 'Велоспорт',
      count: 1,
      imageUrl: 'https://img.example/bike.jpg',
      hint: null,
      categories: [{ slug: 'bicycle', title: 'Велосипед', count: 1, from: 50, imageUrl: 'https://img.example/b.jpg' }],
    },
  ],
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
  offers: [
    {
      kind: 'product' as const,
      id: 'p1',
      title: 'Шоссейный велосипед',
      price: 900,
      imageUrl: 'https://img.example/p1.jpg',
      images: ['https://img.example/p1.jpg', 'https://img.example/p1-2.jpg'],
    },
  ],
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
    expect(link.querySelectorAll('img')).toHaveLength(3); // both photos, plus the first again for the endless loop
  });

  it('shows each activity with offers, opening the app on it, and its categories with real prices', () => {
    renderHome();
    const section = screen.getByRole('region', { name: 'Чем займёмся?' });
    expect(within(section).getByRole('link', { name: /Зимний спорт/ })).toHaveAttribute('href', 'https://app.sportgearhub.ru/?activity=winter_sports');
    const skis = within(section).getByRole('link', { name: /Лыжи/ });
    expect(skis).toHaveAttribute('href', 'https://app.sportgearhub.ru/?category=skis&activity=winter_sports');
    expect(skis).toHaveTextContent('от 900');
    expect(skis).toHaveTextContent('4 предложения');
  });

  it('shows counts only from three up', () => {
    renderHome();
    const section = screen.getByRole('region', { name: 'Чем займёмся?' });
    const bike = within(section).getByRole('link', { name: /Велосипед/ });
    expect(bike).toHaveTextContent('от 50');
    expect(bike).not.toHaveTextContent('предложени');
    expect(within(section).getByRole('link', { name: /Велоспорт/ })).toHaveTextContent('Смотреть предложения');
  });

  it('lists the whole catalogue, linking only what can be booked now', () => {
    renderHome();
    const all = screen.getByRole('region', { name: 'Найдите что угодно' });
    expect(all).toHaveTextContent('3 вида снаряжения в 2 занятиях');
    // Each row is there twice (the loop); only the first copy is reachable.
    expect(within(all).getAllByRole('link', { name: /Лыжи/ })).toHaveLength(1);
    expect(within(all).getByRole('link', { name: /Лыжи/ })).toHaveAttribute('href', 'https://app.sportgearhub.ru/?category=skis');
    expect(within(all).queryByRole('link', { name: /Сноуборд|Удочка/ })).toBeNull();
    expect(within(all).getAllByText('Удочка').length).toBeGreaterThan(0);
  });

  it('answers questions without JS', () => {
    renderHome();
    const faq = screen.getByRole('region', { name: 'Частые вопросы' });
    expect(within(faq).getAllByRole('group')).toHaveLength(7);
  });
});
