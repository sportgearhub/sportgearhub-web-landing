import { Baby, BatteryCharging, Bike, Compass, Dumbbell, Fish, Footprints, Gauge, Mountain, PersonStanding, Snowflake, Sparkles, Tent, TreePalm, Waves, Zap, type LucideIcon } from 'lucide-react';

/**
 * One icon per activity slug, the same as the customer app's (sportgearhub-web-app: category-icons.ts → ACTIVITY_ICONS),
 * so an activity looks alike on both sites. An activity added later gets a sparkle until it's added here.
 */
const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  extreme_sports: Zap,
  active_leisure: Footprints,
  winter_sports: Snowflake,
  cycling: Bike,
  tourism: Compass,
  fitness: Dumbbell,
  water_sports: Waves,
  camping: Tent,
  hiking_trekking: Mountain,
  fishing: Fish,
  beach_leisure: TreePalm,
  kids_active_leisure: Baby,
  yoga: PersonStanding,
  motorsports: Gauge,
  e_transport: BatteryCharging,
};

export const activityIcon = (slug: string): LucideIcon => ACTIVITY_ICONS[slug] ?? Sparkles;

/** A tile's colours: a soft ground and a stronger icon of the same hue (the app's activityTone). */
export type Tone = { ground: string; icon: string };

const TONES = {
  sky: { ground: 'bg-sky-50', icon: 'text-sky-600' },
  blue: { ground: 'bg-blue-50', icon: 'text-blue-600' },
  cyan: { ground: 'bg-cyan-50', icon: 'text-cyan-600' },
  teal: { ground: 'bg-teal-50', icon: 'text-teal-600' },
  emerald: { ground: 'bg-emerald-50', icon: 'text-emerald-600' },
  lime: { ground: 'bg-lime-50', icon: 'text-lime-700' },
  amber: { ground: 'bg-amber-50', icon: 'text-amber-600' },
  orange: { ground: 'bg-orange-50', icon: 'text-orange-600' },
  rose: { ground: 'bg-rose-50', icon: 'text-rose-600' },
  violet: { ground: 'bg-violet-50', icon: 'text-violet-600' },
  indigo: { ground: 'bg-indigo-50', icon: 'text-indigo-600' },
  slate: { ground: 'bg-slate-100', icon: 'text-slate-600' },
} satisfies Record<string, Tone>;

const ACTIVITY_TONES: Record<string, Tone> = {
  extreme_sports: TONES.orange,
  active_leisure: TONES.lime,
  winter_sports: TONES.sky,
  cycling: TONES.emerald,
  tourism: TONES.amber,
  fitness: TONES.rose,
  water_sports: TONES.cyan,
  camping: TONES.teal,
  hiking_trekking: TONES.emerald,
  fishing: TONES.blue,
  beach_leisure: TONES.amber,
  kids_active_leisure: TONES.violet,
  yoga: TONES.violet,
  motorsports: TONES.orange,
  e_transport: TONES.indigo,
};

export const activityTone = (slug: string): Tone => ACTIVITY_TONES[slug] ?? TONES.slate;

/** One hue per activity (oklch), as the app's backgrounds use (sportgearhub-web-app: activity-themes.ts → HUES). */
const ACTIVITY_HUES: Record<string, number> = {
  winter_sports: 235,
  water_sports: 205,
  cycling: 160,
  hiking_trekking: 150,
  camping: 180,
  tourism: 85,
  beach_leisure: 75,
  fishing: 245,
  extreme_sports: 50,
  motorsports: 40,
  fitness: 10,
  yoga: 300,
  kids_active_leisure: 300,
  active_leisure: 125,
  e_transport: 275,
};

/** An activity's cover: a deep-to-bright gradient in its hue with a soft light glow (brand blue for one we don't know). */
export function activityGradient(slug: string): string {
  const h = ACTIVITY_HUES[slug] ?? 262;
  return [
    'radial-gradient(18rem 12rem at 85% 0%, oklch(1 0 0 / 0.22), transparent 70%)',
    `linear-gradient(140deg, oklch(0.62 0.15 ${h}), oklch(0.48 0.16 ${h + 20}) 55%, oklch(0.36 0.12 ${h + 40}))`,
  ].join(', ');
}
