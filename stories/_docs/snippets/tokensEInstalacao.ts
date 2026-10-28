import type { Abas } from '../Layout';

export const instalacao: Abas = {
  'HTML puro': { codigo: `<!-- 1. Copie os arquivos para a pasta do projeto, por exemplo /css -->
<!-- 2. Carregue no <head>, nesta ordem -->
<link rel="stylesheet" href="css/citiesoft.tokens.css">
<link rel="stylesheet" href="css/citiesoft.text.css">

<!-- 3. Fonte da interface -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Red+Hat+Display:wght@400;500;600;700&family=Red+Hat+Mono:wght@400;500&display=swap">` },
  'Angular': { codigo: `// 1. Copie os arquivos para src/assets/tokens/
// 2. angular.json, em projects.<app>.architect.build.options
"styles": [
  "src/styles.scss",
  "src/assets/tokens/citiesoft.tokens.css",
  "src/assets/tokens/citiesoft.text.css"
]

// 3. src/index.html: tags <link> da fonte Inter, como no HTML puro

// 4. PrimeNG (opcional): faça o tema escuro seguir a classe .dark
// app.config.ts
providePrimeNG({
  theme: { preset: Aura, options: { darkModeSelector: '.dark' } }
})

// Os tokens e o tema do PrimeNG convivem. Use var(--color-...) nos seus estilos.` },
  'React / Vite / Next': { codigo: `// 1. Copie os arquivos para src/styles/

// Vite: src/main.tsx
import './styles/citiesoft.tokens.css';
import './styles/citiesoft.text.css';

// Next.js (App Router): app/layout.tsx
import './styles/citiesoft.tokens.css';
import './styles/citiesoft.text.css';

// Fonte: <link> no index.html (Vite) ou no layout (Next),
// ou import '@fontsource-variable/inter';` },
  'Tailwind v4': { codigo: `/* 1. Copie os dois arquivos .tailwind-* para o projeto */

/* 2. src/app.css */
@import 'tailwindcss';
@import './citiesoft.tailwind-theme.css';
@import './citiesoft.tailwind-typography.css';
@custom-variant dark (&:where(.dark, .dark *));

/* 3. Os utilitários passam a existir:
      bg-background-primary-default, text-text-primary, text-body-regular, rounded-lg */

/* Não importe citiesoft.tokens.css junto: o tema já traz as variáveis. */` },
  'SCSS': { codigo: `// 1. Copie citiesoft.tokens.scss como _citiesoft.tokens.scss

// 2. Em qualquer arquivo .scss
@use 'citiesoft.tokens' as t;

.cartao { padding: t.$spacing * 4; border-radius: t.$radius-xl; }

// 3. Valores SCSS são do tema claro. O mapa t.$tokens-escuro traz os do escuro.
// Para troca automática de tema, importe também citiesoft.tokens.css e use var().` },
  'JSON / Style Dictionary': { codigo: `// 1. npm i -D style-dictionary
// 2. Copie citiesoft.tokens.json para a raiz do projeto
// 3. style-dictionary.config.mjs
export default {
  source: ['citiesoft.tokens.json'],
  platforms: {
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [{
        destination: 'citiesoft_colors.xml',
        format: 'android/resources',
        filter: (token) => token.$type === 'color',
      }],
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [{
        destination: 'Citiesoft.swift',
        format: 'ios-swift/class.swift',
        className: 'Citiesoft',
        filter: (token) => token.$type === 'color',
      }],
    },
  },
};

// 4. npx style-dictionary build
// O valor do tema escuro está em $extensions["com.citiesoft.modo"].escuro.` },
};

export const cartaoMinimo: Abas = {
  'HTML/CSS': { codigo: `<style>
  .cartao {
    max-width: 24rem;
    padding: calc(var(--spacing) * 5);
    background: var(--color-background-primary-default);
    border: 1px solid var(--color-border-button-default);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-card);
  }
  .cartao__titulo { color: var(--color-text-primary); }
  .cartao__texto { margin: calc(var(--spacing) * 1) 0 calc(var(--spacing) * 4); color: var(--color-text-secondary); }
  .cartao__botao {
    padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
    color: var(--color-text-white);
    background: var(--color-accent-500);
    border: 0;
    border-radius: var(--radius-lg);
  }
  .cartao__botao:hover { background: var(--color-accent-600); }
  .cartao__botao:focus-visible { outline: 2px solid var(--color-border-focus-ring); outline-offset: 2px; }
</style>

<article class="cartao">
  <h2 class="cartao__titulo text-title-3-semibold">Solicitação enviada</h2>
  <p class="cartao__texto text-body-regular">Você recebe o retorno em até dois dias úteis.</p>
  <button class="cartao__botao text-body-medium" type="button">Acompanhar</button>
</article>` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.cartao {
  max-width: 24rem;
  padding: t.$spacing * 5;
  background: t.$color-background-primary-default;
  border: 1px solid t.$color-border-button-default;
  border-radius: t.$radius-xl;
  box-shadow: t.$shadow-card;

  &__titulo { color: t.$color-text-primary; }
  &__texto { margin: t.$spacing 0 t.$spacing * 4; color: t.$color-text-secondary; }
  &__botao {
    padding: t.$spacing * 2 t.$spacing * 4;
    color: t.$color-text-white;
    background: t.$color-accent-500;
    border: 0;
    border-radius: t.$radius-lg;
    &:hover { background: t.$color-accent-600; }
  }
}

// Com SCSS puro o cartão fica no tema claro.
// Para o tema escuro, troque t.$cor por var(--color-...) e carregue o CSS.` },
  'Tailwind': { codigo: `<article class="max-w-sm rounded-xl border border-border-button-default bg-background-primary-default p-5 shadow-card">
  <h2 class="text-title-3-semibold text-text-primary">Solicitação enviada</h2>
  <p class="mb-4 mt-1 text-body-regular text-text-secondary">
    Você recebe o retorno em até dois dias úteis.
  </p>
  <button
    type="button"
    class="rounded-lg bg-accent-500 px-4 py-2 text-body-medium text-text-white hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus-ring"
  >
    Acompanhar
  </button>
</article>` },
  'Angular': { codigo: `// cartao.component.ts
@Component({
  selector: 'app-cartao',
  standalone: true,
  templateUrl: './cartao.component.html',
  styleUrl: './cartao.component.scss',
})
export class CartaoComponent {}

<!-- cartao.component.html -->
<article class="cartao">
  <h2 class="cartao__titulo text-title-3-semibold">Solicitação enviada</h2>
  <p class="cartao__texto text-body-regular">Você recebe o retorno em até dois dias úteis.</p>
  <button class="cartao__botao text-body-medium" type="button">Acompanhar</button>
</article>

/* cartao.component.scss: mesmo CSS da aba HTML/CSS, sem a tag <style> */

// Com PrimeNG, troque o <button> por <p-button> e mantenha o cartão com os tokens.` },
  'React': { codigo: `import './citiesoft.tokens.css';
import './citiesoft.text.css';
import './cartao.css'; // mesmo CSS da aba HTML/CSS, sem a tag <style>

export function Cartao() {
  return (
    <article className="cartao">
      <h2 className="cartao__titulo text-title-3-semibold">Solicitação enviada</h2>
      <p className="cartao__texto text-body-regular">
        Você recebe o retorno em até dois dias úteis.
      </p>
      <button className="cartao__botao text-body-medium" type="button">
        Acompanhar
      </button>
    </article>
  );
}` },
  'JSON': { codigo: `// Tokens usados no cartão (citiesoft.tokens.json)
{
  "color": {
    "background-primary-default": { "$value": "#ffffff" },
    "border-button-default": { "$value": "#ebebeb" },
    "text-primary": { "$value": "#0a0a0a" },
    "text-secondary": { "$value": "#737373" },
    "text-white": { "$value": "#ffffff" },
    "accent-500": { "$value": "#2b7fff" }
  },
  "radius": { "xl": { "$value": "0.75rem" }, "lg": { "$value": "0.5rem" } }
}

// Em apps nativos, leia os valores gerados pelo Style Dictionary
// e aplique-os ao fundo, ao texto, à borda e ao botão.` },
};

export const validarCarga: Abas = {
  'HTML/CSS': { codigo: `// Console do navegador (F12)
getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary')
// esperado: " var(--color-neutral-950)" ou o valor resolvido

// Teste visual
<p style="color: var(--color-accent-500)">Deve aparecer em azul</p>` },
  'SCSS': { codigo: `// Se o @use falhar com "Can't find stylesheet", confira o nome do arquivo
// e o includePaths do Sass. Depois compile e procure o valor no CSS gerado.
.teste { color: t.$color-accent-500; } // deve sair #2b7fff` },
  'Tailwind': { codigo: `<!-- Deve ficar azul. Se ficar sem cor, o tema não foi importado -->
<p class="text-accent-500">Teste</p>
<p class="text-body-regular">Deve ter 14px e linha de 20px</p>` },
  'Angular': { codigo: `// Console do navegador, com a aplicação aberta
getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500')

// Se vier vazio, confira o caminho em angular.json (styles)
// e reinicie o ng serve: mudanças em angular.json exigem reinício.` },
  'React': { codigo: `// Console do navegador, com a aplicação aberta
getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500')

// Se vier vazio, confira se o import do CSS está na entrada
// (main.tsx no Vite, layout.tsx no Next).` },
};

export const atualizarTokens: Abas = {
  'Gerar': { codigo: `# No repositório do Storybook
npm run gerar-tokens

# Fonte: styles/theme.css e styles/typography.css
# Saída: public/tokens/ (css, scss, json, text.css, tailwind-theme, tailwind-typography)` },
  'HTML/CSS': { codigo: `# Substitua os dois arquivos no projeto e publique
cp citiesoft.tokens.css citiesoft.text.css ./css/` },
  'SCSS': { codigo: `cp citiesoft.tokens.scss ./src/styles/_citiesoft.tokens.scss
cp citiesoft.tokens.css ./src/styles/` },
  'Tailwind': { codigo: `cp citiesoft.tailwind-theme.css citiesoft.tailwind-typography.css ./src/` },
  'Angular': { codigo: `cp citiesoft.tokens.css citiesoft.text.css ./src/assets/tokens/
ng build` },
  'React': { codigo: `cp citiesoft.tokens.css citiesoft.text.css ./src/styles/
npm run build` },
  'JSON': { codigo: `cp citiesoft.tokens.json ./
npx style-dictionary build` },
};
