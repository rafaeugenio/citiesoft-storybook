import type { Abas } from '../Layout';

export const camadasExemplo: Abas = {
  'CSS': { codigo: `/* 1. Primitivo: valor bruto */
--color-neutral-950: #0a0a0a;

/* 2. Semântico: aponta para o primitivo e vira o contrato */
--color-text-primary: var(--color-neutral-950);

/* 3. Componente: aponta para o accent, que aponta para a paleta */
--color-button-ghost-foreground: var(--color-accent-700);
--color-accent-700: var(--color-blue-700);` },
  'JSON': { codigo: `{
  "color": {
    "neutral-950": { "$type": "color", "$value": "#0a0a0a" },
    "text-primary": {
      "$type": "color",
      "$value": "#0a0a0a",
      "$extensions": { "com.citiesoft.modo": { "escuro": "#fafafa" } }
    }
  }
}

// No JSON os valores já vêm resolvidos em hex. O tema escuro fica em $extensions.` },
};

export const nomesExemplo: Abas = {
  'Papel (correto)': { codigo: `--color-text-primary                texto principal
--color-text-secondary              texto de apoio
--color-background-secondary-default  fundo de superfície
--color-border-focus-ring           anel de foco
--color-status-lime-text            texto de status positivo` },
  'Aparência (evite)': { codigo: `--color-cinza-claro
--color-azul-do-botao
--color-texto-12px

/* Esses nomes ficam errados quando o tema, a marca ou o contraste mudam. */` },
};

export const fluxoUso: Abas = {
  'HTML/CSS': { codigo: `<link rel="stylesheet" href="citiesoft.tokens.css">
<link rel="stylesheet" href="citiesoft.text.css">

<style>
  .aviso {
    color: var(--color-text-primary);
    background: var(--color-background-secondary-default);
    border: 1px solid var(--color-border-button-default);
  }
</style>
<p class="aviso text-body-regular">Pedido enviado.</p>` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.aviso {
  color: t.$color-text-primary;
  background: t.$color-background-secondary-default;
  border: 1px solid t.$color-border-button-default;
}

// Os valores SCSS são do tema claro.
// Para reagir ao tema escuro, use var(--color-...) do CSS.` },
  'Tailwind': { codigo: `/* app.css */
@import 'tailwindcss';
@import './citiesoft.tailwind-theme.css';
@import './citiesoft.tailwind-typography.css';
@custom-variant dark (&:where(.dark, .dark *));

<!-- uso -->
<p class="text-body-regular text-text-primary bg-background-secondary-default border border-border-button-default">
  Pedido enviado.
</p>` },
  'Angular': { codigo: `// angular.json
"styles": [
  "src/styles.scss",
  "src/assets/tokens/citiesoft.tokens.css",
  "src/assets/tokens/citiesoft.text.css"
]

/* aviso.component.scss */
:host {
  color: var(--color-text-primary);
  background: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-button-default);
}

// Com PrimeNG, os tokens do Design System convivem com o tema do PrimeNG.
// Use var(--color-...) nos seus componentes e deixe o PrimeNG nos dele.` },
  'React': { codigo: `import './citiesoft.tokens.css';
import './citiesoft.text.css';

export function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-body-regular"
      style={{
        color: 'var(--color-text-primary)',
        background: 'var(--color-background-secondary-default)',
        border: '1px solid var(--color-border-button-default)',
      }}
    >
      {children}
    </p>
  );
}` },
};

export const temaEscuro: Abas = {
  'HTML/CSS': { codigo: `<!-- Qualquer um dos dois ativa o tema escuro -->
<html class="dark">
<html data-theme="dark">

<script>
  const escuro = matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', escuro);
</script>` },
  'SCSS': { codigo: `@use 'sass:map';
@use 'citiesoft.tokens' as t;

// Mapa com os valores do tema escuro
$texto-escuro: map.get(t.$tokens-escuro, 'color-text-primary');

// Preferível: use o CSS e deixe a classe .dark trocar os valores
.titulo { color: var(--color-text-primary); }` },
  'Tailwind': { codigo: `/* app.css */
@custom-variant dark (&:where(.dark, .dark *));

/* Os tokens semânticos já trocam sozinhos. Não use dark: para cores do sistema. */
<html class="dark">` },
  'Angular': { codigo: `// tema.service.ts
alternar(escuro: boolean) {
  document.documentElement.classList.toggle('dark', escuro);
}

// PrimeNG: faça o tema do PrimeNG seguir a mesma classe
// providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.dark' } } })` },
  'React': { codigo: `import { useEffect, useState } from 'react';

export function useTema() {
  const [escuro, setEscuro] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', escuro);
  }, [escuro]);
  return [escuro, setEscuro] as const;
}` },
};
