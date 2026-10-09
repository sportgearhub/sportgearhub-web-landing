import { defineConfig } from 'vitest/config';

// Tests import app code directly; the React Router plugin (route modules, pre-rendering) stays out of them.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./app/test/setup.ts'],
  },
});
