/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'react-transition-group/TransitionGroupContext', replacement: path.resolve(__dirname, 'node_modules/react-transition-group/cjs/TransitionGroupContext.js') },
      { find: 'react-transition-group', replacement: path.resolve(__dirname, 'node_modules/react-transition-group/cjs/index.js') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.mts', '.json'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    server: {
      deps: {
        inline: [/@mui\//, /react-transition-group/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/features/admin/**', 'src/features/carreras/**'],
      exclude: [
        'src/features/admin/**/*.dto.ts',
        'src/features/admin/**/*.schema.ts',
        'src/features/admin/**/*.md',
        'src/features/admin/types/**',
        'src/features/admin/screens/**',
        'src/features/admin/index.ts',
        'src/features/admin/__tests__/**',
        'src/features/carreras/**/*.dto.ts',
        'src/features/carreras/__tests__/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
})
