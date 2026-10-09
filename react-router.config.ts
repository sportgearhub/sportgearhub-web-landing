import type { Config } from '@react-router/dev/config';

/**
 * Static site: every route is rendered to HTML at build time (its loader runs then, against the live API), and
 * static-web-server serves the files. No runtime server: no `action`/`headers` exports.
 */
export default {
  ssr: false,
  prerender: true,
} satisfies Config;
