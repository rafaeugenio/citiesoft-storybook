import type { Abas } from '../Layout';

export const sombrasUso: Abas = {
  'HTML + CSS': { codigo: `@import url('citiesoft.tokens.css');

.cartao  { box-shadow: var(--shadow-card); }
.menu    { box-shadow: var(--shadow-dropdown); }
.painel  { box-shadow: var(--shadow-md); }

/* O tema escuro troca os valores sozinho: basta a classe no <html> */
/* <html class="dark"> ou <html data-theme="dark"> */` },
  'SCSS': { codigo: `@use 'sass:map';
@use 'citiesoft.tokens' as t;

.cartao { box-shadow: t.$shadow-card; }
.menu   { box-shadow: t.$shadow-dropdown; }

// Valor do tema escuro, se precisar dele em tempo de compilação
.cartao-fixo-escuro { box-shadow: map.get(t.$tokens-escuro, 'shadow-card'); }` },
  'Tailwind': { codigo: `<div class="rounded-2xl bg-background-primary-default shadow-card">Cartão</div>
<div class="rounded-2xl bg-background-primary-default shadow-dropdown">Menu</div>
<div class="rounded-2xl bg-background-primary-default shadow-md">Painel</div>` },
  'Angular': { codigo: `/* componente.scss */
.cartao { box-shadow: var(--shadow-card); }
.menu   { box-shadow: var(--shadow-dropdown); }

// Alternar o tema: adicione ou remova a classe "dark" no <html>
document.documentElement.classList.toggle('dark');` },
  'React': { codigo: `export const Cartao = ({ children }: { children: React.ReactNode }) => (
  <div style={{ boxShadow: 'var(--shadow-card)' }}>{children}</div>
);

// Tema escuro: document.documentElement.classList.toggle('dark')` },
};

export const sombrasEscuro: Abas = {
  'HTML + CSS': { codigo: `/* citiesoft.tokens.css já declara os dois temas */
:root { --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.06), 0 4px 6px -1px rgb(0 0 0 / 0.10); }
.dark,
[data-theme='dark'] { --shadow-md: 0 2px 4px -1px rgb(0 0 0 / 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.18); }

/* Seu CSS só usa var(--shadow-md) */` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

// Os mesmos nomes existem em t.$tokens-escuro
// (ex.: 'shadow-md', 'shadow-card', 'shadow-dropdown').
.painel { box-shadow: var(--shadow-md); } // troca com a classe .dark` },
  'Tailwind': { codigo: `/* Tailwind v4 grava o valor da sombra na classe, no momento do build.
   Para o tema escuro funcionar, aponte a classe de volta para o token: */
.dark .shadow-2xs { --tw-shadow: var(--shadow-2xs); }
.dark .shadow-xs  { --tw-shadow: var(--shadow-xs); }
.dark .shadow-sm  { --tw-shadow: var(--shadow-sm); }
.dark .shadow-md  { --tw-shadow: var(--shadow-md); }
.dark .shadow-lg  { --tw-shadow: var(--shadow-lg); }
.dark .shadow-xl  { --tw-shadow: var(--shadow-xl); }
.dark .shadow-card     { --tw-shadow: var(--shadow-card); }
.dark .shadow-dropdown { --tw-shadow: var(--shadow-dropdown); }
.dark .shadow-sidebar  { --tw-shadow: var(--shadow-sidebar); }
.dark .shadow-waitlist { --tw-shadow: var(--shadow-waitlist); }` },
  'Angular': { codigo: `// Sem Tailwind, var(--shadow-*) já acompanha o tema.
// Em app.component.ts, alterne a classe no <html>:
toggleTema() {
  document.documentElement.classList.toggle('dark');
}` },
  'React': { codigo: `// Use var(--shadow-*) e o tema escuro vem junto
const Painel = () => <div style={{ boxShadow: 'var(--shadow-md)' }} />;

// Um contêiner com a classe "dark" aplica o tema só à sua subárvore
<div className="dark"><Painel /></div>` },
};
