// Renders the link-preview images (Open Graph / Twitter, 1200×630 PNG): one per landing page into public/og/, and the
// customer app's into ../sportgearhub-web-app/public/og.png when that repo sits next to this one. Each is a gradient
// with a soft glow and a dot grid, lucide icons floating on the right (a few in frosted bubbles), the logo with the
// wordmark, a headline and the domain. Needs rsvg-convert (brew install librsvg). Run after changing the copy, the
// logo or the icons:  npm run og
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const iconsDir = `${root}node_modules/lucide-react/dist/esm/icons/`;
const W = 1200;
const H = 630;
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/** A lucide icon's elements as SVG markup (aliases like `waves` only re-export another file: follow them). */
async function icon(name) {
  let file = `${name}.mjs`;
  for (let hop = 0; hop < 4; hop++) {
    const mod = await import(pathToFileURL(iconsDir + file).href);
    const node = mod.__iconData?.node ?? mod.__iconNode;
    if (node) return node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
    file = readFileSync(iconsDir + file, 'utf8').match(/from '\.\/([\w-]+\.mjs)'/)?.[1];
    if (!file) break;
  }
  throw new Error(`No lucide icon "${name}"`);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const logo = `data:image/svg+xml;base64,${readFileSync(`${root}assets/logo-rounded-square.svg`).toString('base64')}`;

/** Where icons float on the right: x, y, size, turn, opacity, bubble. */
const SCATTER = [
  [880, 70, 150, -8, 1, true],
  [1040, 250, 132, 10, 1, true],
  [800, 330, 118, 6, 1, true],
  [1010, 470, 104, -12, 1, true],
  [700, 120, 54, 14, 0.28],
  [1110, 90, 48, -16, 0.3],
  [690, 500, 50, -6, 0.24],
  [930, 560, 44, 18, 0.26],
  [1130, 410, 46, 8, 0.28],
  [960, 220, 40, -20, 0.22],
  [760, 250, 38, 22, 0.2],
  [1150, 560, 40, -10, 0.22],
];

async function render({ title, subtitle, domain, colors, icons }) {
  const glyphs = await Promise.all(icons.map(icon));
  const symbols = glyphs.map((g, i) => `<symbol id="i${i}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${g}</symbol>`).join('');
  const placed = SCATTER.map(([x, y, size, turn, opacity, bubble], i) => {
    const id = `i${i % glyphs.length}`;
    const c = `rotate(${turn} ${x + size / 2} ${y + size / 2})`;
    return bubble
      ? `<g transform="${c}"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.28}" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".35" stroke-width="2"/><use href="#${id}" x="${x + size * 0.24}" y="${y + size * 0.24}" width="${size * 0.52}" height="${size * 0.52}"/></g>`
      : `<use href="#${id}" x="${x}" y="${y}" width="${size}" height="${size}" opacity="${opacity}" transform="${c}"/>`;
  }).join('');
  const titleLines = title.map((line, i) => `<text x="80" y="${300 + i * 76}" font-size="66" font-weight="700" letter-spacing="-1.5">${esc(line)}</text>`).join('');
  const subY = 300 + title.length * 76 + 8;
  const subLines = subtitle.map((line, i) => `<text x="80" y="${subY + i * 40}" font-size="30" fill-opacity=".82">${esc(line)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${colors[0]}"/><stop offset=".55" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient>
  <radialGradient id="glow" cx="1" cy="0" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow2" cx="0" cy="1" r=".6"><stop offset="0" stop-color="${colors[2]}" stop-opacity=".55"/><stop offset="1" stop-color="${colors[2]}" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#fff" fill-opacity=".16"/></pattern>
  ${symbols}
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow2)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
${placed}
<g font-family="${FONT}" fill="#fff">
  <image href="${logo}" x="80" y="72" width="84" height="84"/>
  <text x="184" y="128" font-size="38" font-weight="800" font-style="italic" letter-spacing="1">SPORTGEAR</text>
  <rect x="456" y="96" width="78" height="40" rx="9" fill="#fff" transform="skewX(-6)"/>
  <text x="495" y="127" text-anchor="middle" font-size="27" font-weight="800" fill="${colors[0]}" transform="skewX(-6)">HUB</text>
  ${titleLines}
  ${subLines}
  <rect x="80" y="${H - 104}" width="${domain.length * 14.2 + 56}" height="52" rx="26" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".3"/>
  <text x="108" y="${H - 69}" font-size="26" font-weight="600">${esc(domain)}</text>
</g>
</svg>`;
}

const ACTIVITIES = ['bike', 'snowflake', 'tent', 'waves', 'mountain', 'fish', 'compass', 'tree-palm', 'dumbbell', 'battery-charging', 'footprints', 'zap'];

const IMAGES = [
  {
    out: `${root}public/og/home.png`,
    title: ['Прокат спортивного', 'снаряжения рядом'],
    subtitle: ['Велосипеды, SUP, лыжи, палатки —', 'бронируйте онлайн у проверенных прокатов'],
    domain: 'sportgearhub.ru',
    colors: ['#0114fc', '#4338ca', '#7c3aed'],
    icons: ACTIVITIES,
  },
  {
    out: `${root}public/og/sellers.png`,
    title: ['Больше клиентов', 'для вашего проката'],
    subtitle: ['Онлайн-брони, оплата, чеки и выплаты —', 'автоматически, без абонентской платы'],
    domain: 'sportgearhub.ru/sellers',
    colors: ['#1e1b4b', '#3730a3', '#0e7490'],
    icons: ['store', 'calendar-check', 'wallet', 'qr-code', 'bike', 'snowflake', 'tent', 'scan-line', 'sailboat', 'mountain', 'waves', 'dumbbell'],
  },
  {
    out: `${root}public/og/about.png`,
    title: ['Прокат снаряжения', 'в одном месте'],
    subtitle: ['Для любого занятия: зима и лето,', 'горы и вода, тренировка и отдых'],
    domain: 'sportgearhub.ru/about',
    colors: ['#064e3b', '#0f766e', '#0369a1'],
    icons: ['mountain', 'tent', 'snowflake', 'waves', 'bike', 'fish', 'compass', 'tree-palm', 'footprints', 'dumbbell', 'zap', 'battery-charging'],
  },
  {
    out: join(root, '..', 'sportgearhub-web-app', 'public', 'og.png'),
    title: ['Аренда спортивного', 'снаряжения рядом'],
    subtitle: ['Каталог прокатов: выберите, забронируйте', 'и оплатите онлайн'],
    domain: 'app.sportgearhub.ru',
    colors: ['#0114fc', '#2563eb', '#0891b2'],
    icons: ['bike', 'mountain-snow', 'sailboat', 'tent', 'backpack', 'snowflake', 'kayak', 'hard-hat', 'shirt', 'fish', 'motorbike', 'scooter'],
  },
];

const work = join(tmpdir(), `og-${process.pid}`);
mkdirSync(work, { recursive: true });
for (const image of IMAGES) {
  const dir = image.out.slice(0, image.out.lastIndexOf('/'));
  if (!existsSync(join(dir, '..'))) {
    console.log(`skip ${image.out} (no such repo here)`);
    continue;
  }
  mkdirSync(dir, { recursive: true });
  const svg = join(work, 'og.svg');
  writeFileSync(svg, await render(image));
  execFileSync('rsvg-convert', ['-w', String(W), '-h', String(H), '-f', 'png', '-o', image.out, svg]);
  console.log(`og: ${image.out}`);
}
