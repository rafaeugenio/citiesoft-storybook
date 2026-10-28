/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Pré-otimiza o que os blocos importam. Sem isto o Vite descobre cada pacote só ao abrir
    // a story, invalida o cache no meio do carregamento e a tela mostra "Failed to fetch
    // dynamically imported module" (504 Outdated Optimize Dep).
    include: [
      'aria-query', 'dom-accessibility-api', 'lz-string', 'pretty-format', 'chalk',
      '@tanstack/react-table', 'motion/react', 'react-aria-components', '@internationalized/date',
      '@remixicon/react', 'tailwind-merge', 'recharts', 'react-aria', 'use-sync-external-store/shim', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities', '@ai-sdk/react', 'ai', 'react/jsx-dev-runtime',
    ],
  },
  resolve: {
    alias: { '@': dirname, 'next/link': path.join(dirname, '.storybook/shims/next-link.tsx'), 'next/image': path.join(dirname, '.storybook/shims/next-image.tsx'), 'next/navigation': path.join(dirname, '.storybook/shims/next-navigation.ts') } },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        // Os templates são páginas inteiras e pesadas; com 80+ arquivos em paralelo o padrão de 15s estoura.
        testTimeout: 60000,
        // Stories de streaming animam a opacidade e o axe pode medir um quadro intermediário.
        retry: 2,
        browser: {
          enabled: true,
          headless: true,
          // Todas as histórias compartilham o mesmo documento de preview e
          // alternam tema pelo toolbar. Rodar em série evita que uma auditoria
          // leia os tokens de outra história no mesmo frame.
          fileParallelism: false,
          // CITIE_PW_CHANNEL=chrome usa o Chrome instalado quando o download do Chromium falha.
          provider: playwright({
            contextOptions: { reducedMotion: 'reduce' },
            ...(process.env.CITIE_PW_CHANNEL ? { launchOptions: { channel: process.env.CITIE_PW_CHANNEL } } : {}),
          }),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});
