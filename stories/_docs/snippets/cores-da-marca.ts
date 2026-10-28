import type { Abas } from '../Layout';

export const gradientesCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `/* Institucional, 135° */
background: linear-gradient(135deg, #146BFA 0%, #0B3C8F 100%);

/* Tecnológico, 135° */
background: linear-gradient(135deg, #1261E4 0%, #00B5F0 100%);` },
  'SVG': { linguagem: 'xml', codigo: `<linearGradient id="citie-institucional" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#146BFA"/>
  <stop offset="100%" stop-color="#0B3C8F"/>
</linearGradient>

<linearGradient id="citie-tecnologico" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#1261E4"/>
  <stop offset="100%" stop-color="#00B5F0"/>
</linearGradient>` },
};

export const azuisCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `:root {
  --color-brand-500: #146BFA; /* institucional: logo, capa, slide, hero */
  --color-brand-600: #1261E4; /* produto: botão, link, estado ativo, foco */
  --color-brand-700: #0E4DB8; /* hover do botão primário */

  --color-primary:        var(--color-brand-500);
  --color-primary-action: var(--color-brand-600);
  --color-primary-hover:  var(--color-brand-700);
}` },
};
