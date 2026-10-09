import { cn } from '~/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'inverse';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  outline: 'border border-input bg-card hover:bg-muted',
  ghost: 'hover:bg-muted',
  inverse: 'bg-white text-foreground hover:bg-white/90',
};

const SIZES: Record<Size, string> = {
  md: 'h-11 px-4 text-sm sm:h-10',
  lg: 'h-12 px-6 text-base',
};

/** Classes for a link or button that looks like a button (tap target ≥ 44px on phones). */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors outline-none select-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/40 [&_svg]:size-4 [&_svg]:shrink-0',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}
