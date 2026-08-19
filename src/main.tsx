import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './tokens/tokens.css';
import './index.css';
import { Button } from './components/atoms/Button/Button';

/**
 * Este projeto é um workshop de componentes. A vitrine real é o Storybook
 * (`npm run storybook`); esta página existe só como sanity check do build Vite.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <h1>Design System Citiesoft</h1>
      <p>A documentação executável dos componentes vive no Storybook.</p>
      <Button onClick={() => window.open('http://localhost:6006', '_blank')}>
        Abrir o Storybook
      </Button>
    </main>
  </StrictMode>,
);
