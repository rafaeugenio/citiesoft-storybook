import type { Abas } from '../Layout';

export const coresUso: Abas = {
  'CSS': { codigo: `/* 1. Importe as variáveis uma vez, no HTML ou no CSS global */
@import url('citiesoft.tokens.css');

/* 2. Use var() com o nome do token */
.cartao {
  background: var(--color-background-primary-default);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-button-default);
}
.cartao__legenda { color: var(--color-text-secondary); }` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.cartao {
  background: t.$color-background-primary-default;
  color: t.$color-text-primary;
  border: 1px solid t.$color-border-button-default;
}

// Tema escuro: leia o mapa t.$tokens-escuro ou use o CSS com var()` },
  'Tailwind': { codigo: `/* app.css (Tailwind CSS v4) */
@import 'tailwindcss';
@import './citiesoft.tailwind-theme.css';
@import './citiesoft.tailwind-typography.css';
@custom-variant dark (&:where(.dark, .dark *));

<!-- uso -->
<div class="bg-background-primary-default text-text-primary border border-border-button-default"></div>` },
  'Angular': { codigo: `// angular.json
"styles": ["src/styles.scss", "src/assets/tokens/citiesoft.tokens.css"]

/* cartao.component.scss */
:host {
  display: block;
  background: var(--color-background-primary-default);
  color: var(--color-text-primary);
}

// PrimeNG: aponte o preset para o token de ação
// definePreset(Aura, { semantic: { primary: { 500: 'var(--color-accent-500)' } } })` },
  'React': { codigo: `import './citiesoft.tokens.css';

export function Cartao({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--color-background-primary-default)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border-button-default)',
    }}>
      {children}
    </div>
  );
}` },
  'JSON': { codigo: `{
  "color": {
    "text-primary": {
      "$type": "color",
      "$value": "#0a0a0a",
      "$extensions": { "com.citiesoft.modo": { "escuro": "#fafafa" } }
    }
  }
}

// Formato W3C Design Tokens (DTCG): compatível com Style Dictionary,
// Tokens Studio e geração de temas para Android e iOS.` },
};
