/**
 * Search wording in grammatical Russian. «Прокат» takes the genitive plural («прокат лыж», «прокат велосипедов»), and
 * the API names categories in the nominative, so the forms are listed here; a category without one falls back to
 * «Лыжи напрокат», which reads right with any noun. No prices in titles or descriptions: they would go stale, and
 * production prices aren't final.
 */
const RENT_FORMS: Record<string, string> = {
  bicycle: 'велосипедов',
  mountain_bike: 'горных велосипедов',
  road_bike: 'шоссейных велосипедов',
  city_bike: 'городских велосипедов',
  kids_bike: 'детских велосипедов',
  ebike: 'электровелосипедов',
  kick_scooter: 'самокатов',
  e_scooter: 'электросамокатов',
  skis: 'лыж',
  alpine_skis: 'горных лыж',
  nordic_skis: 'беговых лыж',
  alpine_ski_set: 'горнолыжных комплектов',
  snowboard: 'сноубордов',
  snowboard_set: 'сноубордических комплектов',
  ice_skates: 'коньков',
  snowshoes: 'снегоступов',
  sledge_tube: 'санок и тюбингов',
  sup_board: 'SUP-досок',
  kayak: 'каяков',
  canoe: 'каноэ',
  boat: 'лодок',
  wakeboard: 'вейкбордов',
  wetsuit: 'гидрокостюмов',
  tent: 'палаток',
  sleeping_bag: 'спальных мешков',
  backpack: 'рюкзаков',
  roller_skates: 'роликовых коньков',
  skateboard: 'скейтбордов',
  longboard: 'лонгбордов',
  motorcycle: 'мотоциклов',
  quad_bike: 'квадроциклов',
  snowmobile: 'снегоходов',
  jet_ski: 'гидроциклов',
  buggy: 'багги',
  e_unicycle: 'моноколёс',
  gyroboard: 'гироскутеров',
  segway: 'сигвеев',
  action_camera: 'экшн-камер',
};

/** A category page's heading: «Прокат лыж», or «Велосипед напрокат» without a listed form. */
export const rentHeading = (slug: string, title: string) => (RENT_FORMS[slug] ? `Прокат ${RENT_FORMS[slug]}` : `${title} напрокат`);

/** «прокат лыж, сноубордов и коньков» for an activity's title, from the categories that have forms (up to three). */
export function rentList(categories: { slug: string }[]): string | null {
  const forms = categories.map((c) => RENT_FORMS[c.slug]).filter((f): f is string => !!f).slice(0, 3);
  if (!forms.length) return null;
  return `прокат ${forms.length > 1 ? `${forms.slice(0, -1).join(', ')} и ${forms[forms.length - 1]}` : forms[0]}`;
}

const offersWord = (n: number) => {
  const abs = n % 100;
  const last = n % 10;
  if (abs > 10 && abs < 20) return 'предложений';
  if (last === 1) return 'предложение';
  if (last > 1 && last < 5) return 'предложения';
  return 'предложений';
};

/** A category page's description: what, where, how it's paid; the count only from three up (MIN_SHOWN_COUNT). */
export function rentDescription(title: string, count: number) {
  const tail = count >= 3 ? ` В каталоге — ${count} ${offersWord(count)}.` : '';
  return `${title} напрокат у проверенных прокатов: цена и залог видны до оплаты, бронь онлайн, оплата картой или через СБП.${tail}`;
}
