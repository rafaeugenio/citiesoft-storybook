import type { Abas } from '../Layout';

export const bibliotecaUsoPorStack: Abas = {
  'React': { codigo: `// npm i @remixicon/react
import { RiArrowRightLine, RiUserFill } from '@remixicon/react';

<RiArrowRightLine className="size-5" aria-hidden="true" />
<RiUserFill size={24} color="currentColor" aria-hidden="true" />` },
  'HTML webfont': { codigo: `<link rel="stylesheet" href="/icons/remixicon.css">

<i class="ri-arrow-right-line" aria-hidden="true"></i>
<i class="ri-user-fill ri-xl" aria-hidden="true"></i>` },
  'HTML SVG inline': { codigo: `<!-- Copie o conteúdo do SVG pelo catálogo -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
</svg>` },
  'HTML sprite': { codigo: `<!-- remixicon.symbol.svg: use o id ri-<nome> -->
<svg width="24" height="24" fill="currentColor" aria-hidden="true">
  <use href="/icons/remixicon.symbol.svg#ri-arrow-right-line"></use>
</svg>` },
  'Angular': { codigo: `// npm i remixicon
// angular.json, em "styles"
"styles": ["node_modules/remixicon/fonts/remixicon.css", "src/styles.scss"]

<!-- template -->
<i class="ri-arrow-right-line" aria-hidden="true"></i>

<!-- PrimeNG -->
<p-button label="Avançar" icon="ri-arrow-right-line" />` },
  'Tailwind/CSS': { codigo: `/* Tamanho e cor: o ícone herda currentColor */
.icone { width: 20px; height: 20px; fill: currentColor; }

/* Tailwind */
<RiArrowRightLine className="size-5 text-foreground-icon-primary" />
<i className="ri-user-fill text-xl text-text-secondary" />` },
};
