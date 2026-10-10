import { NotFound } from '~/components/NotFound';
import type { Route } from './+types/not-found';

export const meta: Route.MetaFunction = () => [{ title: 'Страница не найдена | Sportgearhub' }, { name: 'robots', content: 'noindex' }];

export default function NotFoundPage() {
  return <NotFound />;
}
