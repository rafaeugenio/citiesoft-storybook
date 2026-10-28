import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import { Button } from '@/components/base/buttons/button';

/**
 * Este projeto é um workshop de componentes. A vitrine real é o Storybook
 * (`npm run storybook`); esta página existe só como sanity check do build Vite.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="mx-auto flex max-w-xl flex-col items-start gap-4 p-12">
      <h1 className="text-title-2-medium text-text-primary">Design System Citiesoft</h1>
      <p className="text-body-medium text-text-secondary">
        A documentação executável dos componentes vive no Storybook.
      </p>
      <Button onClick={() => window.open('http://localhost:6006', '_blank')}>Abrir o Storybook</Button>
    </main>
  </StrictMode>,
);
