// Renders portrait images for posting (not link previews — those are scripts/og-images.mjs, 1200×630): for each of
// the same four pictures (home, sellers, about, the app), a 4:5 one (1080×1350: feed posts in Instagram, VK, Telegram)
// and a 9:16 one (1080×1920: stories, reels, shorts), into assets/social/. Same copy, gradients and icons as the
// previews; laid out top to bottom: the logo, a cluster of floating icons, then the headline, subtitle and domain.
// Needs rsvg-convert (brew install librsvg). Run:  npm run social
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const iconsDir = `${root}node_modules/lucide-react/dist/esm/icons/`;
const OUT = `${root}assets/social`;
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

/**
 * The two portrait layouts. `scatter`: x, y, size, turn, opacity, bubble — the bubbles big in the middle band, faint
 * outlines around them. `title`/`sub`: first baseline, font size, line height. The domain pill follows the subtitle.
 */
const LAYOUTS = {
  '4x5': {
    W: 1080,
    H: 1350,
    logoY: 96,
    scatter: [
      [90, 280, 180, -8, 1, true],
      [430, 230, 160, 10, 1, true],
      [790, 300, 190, 6, 1, true],
      [240, 540, 170, -12, 1, true],
      [620, 560, 160, 8, 1, true],
      [70, 520, 64, 14, 0.28],
      [950, 220, 56, -16, 0.3],
      [480, 460, 56, -6, 0.24],
      [910, 620, 60, 18, 0.26],
      [130, 770, 52, 8, 0.28],
      [960, 780, 50, -20, 0.22],
      [450, 770, 48, 22, 0.2],
    ],
    title: { y: 900, size: 84, lh: 96 },
    sub: { size: 38, lh: 52 },
  },
  '9x16': {
    W: 1080,
    H: 1920,
    logoY: 140,
    scatter: [
      [90, 360, 200, -8, 1, true],
      [480, 310, 180, 10, 1, true],
      [800, 430, 200, 6, 1, true],
      [230, 720, 190, -12, 1, true],
      [640, 780, 180, 8, 1, true],
      [420, 1060, 160, 4, 1, true],
      [80, 640, 64, 14, 0.28],
      [950, 280, 58, -16, 0.3],
      [520, 620, 58, -6, 0.24],
      [930, 1040, 62, 18, 0.26],
      [110, 1080, 56, 8, 0.28],
      [780, 1180, 52, -20, 0.22],
    ],
    // Kept clear of the bottom ~200px, where stories put their own buttons.
    title: { y: 1360, size: 88, lh: 100 },
    sub: { size: 40, lh: 56 },
  },
};

async function render(layout, { title, subtitle, domain, colors, icons }) {
  const { W, H, logoY, scatter } = layout;
  const glyphs = await Promise.all(icons.map(icon));
  const symbols = glyphs.map((g, i) => `<symbol id="i${i}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${g}</symbol>`).join('');
  const placed = scatter.map(([x, y, size, turn, opacity, bubble], i) => {
    const id = `i${i % glyphs.length}`;
    const c = `rotate(${turn} ${x + size / 2} ${y + size / 2})`;
    return bubble
      ? `<g transform="${c}"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.28}" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".35" stroke-width="2.5"/><use href="#${id}" x="${x + size * 0.24}" y="${y + size * 0.24}" width="${size * 0.52}" height="${size * 0.52}"/></g>`
      : `<use href="#${id}" x="${x}" y="${y}" width="${size}" height="${size}" opacity="${opacity}" transform="${c}"/>`;
  }).join('');
  const t = layout.title;
  const titleLines = title.map((line, i) => `<text x="80" y="${t.y + i * t.lh}" font-size="${t.size}" font-weight="700" letter-spacing="-1.5">${esc(line)}</text>`).join('');
  const subY = t.y + (title.length - 1) * t.lh + layout.sub.lh + 24;
  const subLines = subtitle.map((line, i) => `<text x="80" y="${subY + i * layout.sub.lh}" font-size="${layout.sub.size}" fill-opacity=".82">${esc(line)}</text>`).join('');
  // The wordmark, scaled up from the preview's (logo 84, text 38): logo 104, text 46; HUB centred in its badge.
  const base = logoY + 70;
  // Right under the subtitle, so a longer one pushes it down rather than running into it.
  const pillY = subY + (subtitle.length - 1) * layout.sub.lh + 44;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${colors[0]}"/><stop offset=".55" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient>
  <radialGradient id="glow" cx="1" cy="0" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow2" cx="0" cy="1" r=".7"><stop offset="0" stop-color="${colors[2]}" stop-opacity=".6"/><stop offset="1" stop-color="${colors[2]}" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#fff" fill-opacity=".16"/></pattern>
  ${symbols}
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow2)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
${placed}
<g font-family="${FONT}" fill="#fff">
  <image href="${logo}" x="80" y="${logoY}" width="104" height="104"/>
  <text x="208" y="${base}" font-size="46" font-weight="800" font-style="italic" letter-spacing="1">SPORTGEAR</text>
  <rect x="${545 + base * 0.105 - 14}" y="${base - 40}" width="94" height="49" rx="11" fill="#fff" transform="skewX(-6)"/>
  <text x="${545 + base * 0.105 - 14 + 47}" y="${base - 2}" text-anchor="middle" font-size="33" font-weight="800" fill="${colors[0]}" transform="skewX(-6)">HUB</text>
  ${titleLines}
  ${subLines}
  <rect x="80" y="${pillY}" width="${domain.length * 17.6 + 68}" height="66" rx="33" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>
  <text x="114" y="${pillY + 44}" font-size="32" font-weight="600">${esc(domain)}</text>
</g>
</svg>`;
}

const ACTIVITIES = ['bike', 'snowflake', 'tent', 'waves', 'mountain', 'fish', 'compass', 'tree-palm', 'dumbbell', 'battery-charging', 'footprints', 'zap'];

const IMAGES = [
  {
    name: 'home',
    title: ['Прокат спортивного', 'снаряжения рядом'],
    subtitle: ['Велосипеды, SUP, лыжи, палатки —', 'бронируйте онлайн у проверенных прокатов'],
    domain: 'sportgearhub.ru',
    colors: ['#0114fc', '#4338ca', '#7c3aed'],
    icons: ACTIVITIES,
  },
  {
    name: 'sellers',
    title: ['Больше клиентов', 'для вашего проката'],
    subtitle: ['Онлайн-брони, оплата, чеки и выплаты —', 'автоматически, без абонентской платы'],
    domain: 'sportgearhub.ru/sellers',
    colors: ['#1e1b4b', '#3730a3', '#0e7490'],
    icons: ['store', 'calendar-check', 'wallet', 'qr-code', 'bike', 'snowflake', 'tent', 'scan-line', 'sailboat', 'mountain', 'waves', 'dumbbell'],
  },
  {
    name: 'about',
    title: ['Прокат снаряжения', 'в одном месте'],
    subtitle: ['Для любого занятия: зима и лето,', 'горы и вода, тренировка и отдых'],
    domain: 'sportgearhub.ru/about',
    colors: ['#064e3b', '#0f766e', '#0369a1'],
    icons: ['mountain', 'tent', 'snowflake', 'waves', 'bike', 'fish', 'compass', 'tree-palm', 'footprints', 'dumbbell', 'zap', 'battery-charging'],
  },
  {
    name: 'app',
    title: ['Аренда спортивного', 'снаряжения рядом'],
    subtitle: ['Каталог прокатов: выберите,', 'забронируйте и оплатите онлайн'],
    domain: 'app.sportgearhub.ru',
    colors: ['#0114fc', '#2563eb', '#0891b2'],
    icons: ['bike', 'mountain-snow', 'sailboat', 'tent', 'backpack', 'snowflake', 'kayak', 'hard-hat', 'shirt', 'fish', 'motorbike', 'scooter'],
  },
];

const work = join(tmpdir(), `social-${process.pid}`);
mkdirSync(work, { recursive: true });
mkdirSync(OUT, { recursive: true });
for (const image of IMAGES) {
  for (const [ratio, layout] of Object.entries(LAYOUTS)) {
    const svg = join(work, 'social.svg');
    const out = `${OUT}/${image.name}-${ratio}.png`;
    writeFileSync(svg, await render(layout, image));
    execFileSync('rsvg-convert', ['-w', String(layout.W), '-h', String(layout.H), '-f', 'png', '-o', out, svg]);
    console.log(`social: ${out}`);
  }
}
