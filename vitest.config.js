import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}', 'tests/**/*.spec.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        'vitest.config.js',
        'eslint.config.js',
        '*.js',
        '**/*.js',
      ],
      include: ['src/**/*.ts'],
    },
  },
});
