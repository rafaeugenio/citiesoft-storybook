import type { Abas } from '../Layout';

export const espacamentoCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}

/* Densidade padrão: card e gap de 24px */
.grade { display: grid; gap: var(--space-6); }
.card { padding: var(--space-6); }` },
  'Tailwind': { linguagem: 'js', codigo: `// tailwind.config.js, extensão Citie
spacing: {
  'citie-xs':  '8px',
  'citie-sm':  '12px',
  'citie-md':  '16px',
  'citie-lg':  '24px',
  'citie-xl':  '32px',
  'citie-2xl': '40px',
  'citie-3xl': '48px',
  'citie-4xl': '64px',
}` },
};

export const areaSeguraCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `/* Slide 1920x1080: topo, direita, base, esquerda */
.slide-area-segura { padding: 64px 80px 72px 80px; }

/* Post social 1080x1080 */
.social-area-segura { padding: 64px; }

/* Banner full-width: texto e logo nos 1040px centrais */
.banner-conteudo { max-width: 1040px; margin: 0 auto; }

/* E-mail HTML */
.email-container { max-width: 600px; margin: 0 auto; padding: 24px 32px; }` },
};
