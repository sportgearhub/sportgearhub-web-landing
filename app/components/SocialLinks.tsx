import { Camera, MessageCircle, Send } from 'lucide-react';
import { SOCIALS } from '~/lib/content';
import { cn } from '~/lib/utils';

type Social = (typeof SOCIALS)[number];

/**
 * A tile per network in its brand colour with a plain glyph or monogram — not the networks' logos (lucide has none,
 * and they are trademarks): Telegram's plane, a chat bubble for «Написать нам», «M» for Max, «VK», a camera for
 * Instagram.
 */
function Mark({ id }: { id: Social['id'] }) {
  const tile = 'grid size-7 shrink-0 place-items-center rounded-lg text-white';
  switch (id) {
    case 'telegram':
      return (
        <span className={cn(tile, 'bg-[#229ED9]')}>
          <Send className="size-3.5 -translate-x-px translate-y-px" aria-hidden />
        </span>
      );
    case 'telegram-chat':
      return (
        <span className={cn(tile, 'bg-[#229ED9]')}>
          <MessageCircle className="size-3.5" aria-hidden />
        </span>
      );
    case 'max':
      return <span className={cn(tile, 'bg-gradient-to-br from-[#3E7BFA] to-[#8B3DFF] text-xs font-black')}>M</span>;
    case 'vk':
      return <span className={cn(tile, 'bg-[#0077FF] text-[10px] font-black')}>VK</span>;
    case 'instagram':
      return (
        <span className={cn(tile, 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]')}>
          <Camera className="size-3.5" aria-hidden />
        </span>
      );
  }
}

/** The footer's social links: a brand tile and the label; the ones not open yet are muted, unlinked, «скоро». */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('grid gap-2', className)}>
      {SOCIALS.map((s) => (
        <li key={s.id}>
          {s.href ? (
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-8 items-center gap-2.5 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
            >
              <Mark id={s.id} />
              {s.label}
            </a>
          ) : (
            <span className="inline-flex min-h-8 items-center gap-2.5 text-muted-foreground/70">
              <span className="opacity-50 grayscale">
                <Mark id={s.id} />
              </span>
              {s.label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold">скоро</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
