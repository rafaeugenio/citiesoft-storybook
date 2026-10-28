import type { Abas } from '../Layout';

export const fontesCarregamento: Abas = {
  'HTML': { codigo: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Red+Hat+Display:wght@400;500;600;700&family=Red+Hat+Mono:wght@400;500&display=swap">` },
  'CSS (autohospedado)': { codigo: `@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 400 700;
  font-display: swap;
}
:root { font-family: var(--font-sans); }` },
  'Angular': { codigo: `// src/index.html: use as mesmas tags <link> do HTML
// styles.scss
body { font-family: var(--font-sans); }` },
  'React': { codigo: `// index.html (Vite) ou app/layout (Next.js): mesmas tags <link>
// ou: import '@fontsource-variable/inter';` },
};

export const tipografiaUso: Abas = {
  'HTML + CSS': { codigo: `<link rel="stylesheet" href="citiesoft.tokens.css">
<link rel="stylesheet" href="citiesoft.text.css">

<h1 class="text-title-1-semibold">Solicitações de TFD</h1>
<p class="text-body-regular">Acompanhe o andamento de cada pedido.</p>` },
  'CSS puro': { codigo: `.titulo {
  font-family: var(--font-sans);
  font-size: var(--text-title-1-semibold);
  line-height: var(--text-title-1-semibold--line-height);
  letter-spacing: var(--text-title-1-semibold--letter-spacing);
  font-weight: var(--text-title-1-semibold--font-weight);
}` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

@mixin estilo($nome) {
  font-family: var(--font-sans);
  font-size: var(--text-#{$nome});
  line-height: var(--text-#{$nome}--line-height);
  letter-spacing: var(--text-#{$nome}--letter-spacing);
  font-weight: var(--text-#{$nome}--font-weight);
}
.titulo { @include estilo('title-1-semibold'); }` },
  'Tailwind': { codigo: `<h1 class="text-title-1-semibold text-text-primary">Solicitações de TFD</h1>
<p class="text-body-regular text-text-secondary">Acompanhe o andamento de cada pedido.</p>` },
  'Angular': { codigo: `<!-- template -->
<h1 class="text-title-1-semibold">Solicitações de TFD</h1>

// styles.scss: importe citiesoft.text.css ou use o mixin acima` },
  'React': { codigo: `export const Titulo = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-title-1-semibold">{children}</h1>
);
// importe citiesoft.text.css uma vez na entrada da aplicação` },
};
