import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

/** Where icons sit, in order: x, y in %, size in rem, turn in degrees, strength, float delay in s. */
const SCATTER: [number, number, number, number, number, number][] = [
  [4, 12, 3, -12, 0.22, 0],
  [92, 8, 2.75, 6, 0.2, 0.5],
  [18, 70, 2.25, 15, 0.18, 1.4],
  [70, 6, 2.25, -10, 0.16, 2.9],
  [34, 6, 2.5, 8, 0.16, 2.6],
  [95, 74, 2.5, -14, 0.18, 1.1],
  [8, 84, 2.75, 0, 0.14, 3.2],
  [76, 90, 2, 8, 0.15, 3.8],
  [42, 88, 2.5, -6, 0.15, 0.8],
  [64, 36, 1.75, 0, 0.12, 2.4],
  [26, 40, 1.75, 10, 0.12, 4.1],
  [50, 22, 2, -18, 0.14, 1.9],
  [2, 46, 2, 22, 0.13, 2.2],
  [58, 62, 1.75, 12, 0.13, 3.6],
  [84, 44, 2.25, -8, 0.14, 1.6],
];

const DOTS = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="2" cy="2" r="1" fill="#fff" fill-opacity=".22"/></svg>')}")`;

/**
 * A hero's ground instead of a photo: a gradient (`background`, any CSS background), a faint dot grid fading
 * downwards, and `icons` scattered over the whole card, floating slowly (`float`; still with reduced motion) — as plain
 * white outlines, or as frosted glass bubbles (`bubbles`). At most as many icons as SCATTER has places. Decorative only;
 * it sits behind the hero's content (`-z-10` in the hero's isolated card).
 */
export function HeroBackdrop({ background, icons, bubbles = false }: { background: string; icons: LucideIcon[]; bubbles?: boolean }) {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0" style={{ background }} />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: DOTS, maskImage: 'linear-gradient(to bottom, #000, transparent 85%)', WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 85%)' }}
      />
      {icons.slice(0, SCATTER.length).map((icon, i) => {
        const [x, y, size, turn, strength, delay] = SCATTER[i]!;
        const glyph = createElement(icon, {
          className: 'text-white',
          strokeWidth: 1.5,
          style: bubbles ? { width: '45%', height: '45%' } : { width: `${size}rem`, height: `${size}rem`, rotate: `${turn}deg` },
        });
        return (
          <span
            key={i}
            className={cn('float absolute', bubbles && 'grid place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm')}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              opacity: bubbles ? Math.min(1, strength * 4) : strength,
              animationDelay: `-${delay}s`,
              animationDuration: `${7 + (i % 4)}s`,
              ...(bubbles ? { width: `${size + 1}rem`, height: `${size + 1}rem`, rotate: `${turn / 2}deg` } : {}),
            }}
          >
            {glyph}
          </span>
        );
      })}
    </div>
  );
}
