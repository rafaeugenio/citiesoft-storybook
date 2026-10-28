import type { Abas } from '../Layout';

export const escuroAtivar: Abas = {
  'HTML/CSS': { codigo: `<!-- O CSS exportado responde a .dark e a data-theme="dark" -->
<html lang="pt-BR" data-theme="dark">

/* seus estilos só usam o token; o valor troca sozinho */
body {
  background: var(--color-background-full);
  color: var(--color-text-primary);
}` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

// Não duplique cores por tema. O CSS já troca as variáveis.
.cartao {
  background: var(--color-background-primary-default);
  border: 1px solid var(--color-border-button-default);
}

// Precisa do valor escuro em Sass? Leia o mapa
// t.$tokens-escuro` },
  'Tailwind': { codigo: `/* app.css */
@import 'tailwindcss';
@import './citiesoft.tailwind-theme.css';
@custom-variant dark (&:where(.dark, .dark *));

<html class="dark">
<div class="bg-background-primary-default text-text-primary"></div>` },
  'Angular': { codigo: `// angular.json: carregue citiesoft.tokens.css
// index.html
<html lang="pt-BR" data-theme="light">

// PrimeNG: aponte o seletor do tema escuro para o mesmo atributo
// providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '[data-theme=dark]' } } })` },
  'React': { codigo: `// A classe fica no <html>, não em um componente
document.documentElement.classList.toggle('dark', true);
document.documentElement.style.colorScheme = 'dark';` },
};

export const escuroAlternar: Abas = {
  'JS puro': { codigo: `const CHAVE = 'tema';
const consulta = window.matchMedia('(prefers-color-scheme: dark)');

function aplicar(tema) {
  const escuro = tema === 'dark';
  document.documentElement.classList.toggle('dark', escuro);
  document.documentElement.dataset.theme = tema;
  document.documentElement.style.colorScheme = tema;
}

function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === 'light' || salvo === 'dark') return salvo;
  } catch {}
  return consulta.matches ? 'dark' : 'light';
}

function alternar() {
  const novo = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  try { localStorage.setItem(CHAVE, novo); } catch {}
  aplicar(novo);
}

aplicar(temaInicial());
// Sem escolha salva, acompanha o sistema
consulta.addEventListener('change', (e) => {
  try { if (localStorage.getItem(CHAVE)) return; } catch {}
  aplicar(e.matches ? 'dark' : 'light');
});
document.querySelector('#botao-tema')?.addEventListener('click', alternar);

// Coloque o trecho de temaInicial/aplicar em <script> no <head>
// para evitar o flash de tema claro.` },
  'Angular': { codigo: `// tema.service.ts
import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemaService {
  readonly tema = signal<'light' | 'dark'>(this.inicial());

  constructor() {
    effect(() => {
      const t = this.tema();
      const el = document.documentElement;
      el.classList.toggle('dark', t === 'dark');
      el.dataset['theme'] = t;
      el.style.colorScheme = t;
      localStorage.setItem('tema', t);
    });
  }

  alternar() { this.tema.update((t) => (t === 'dark' ? 'light' : 'dark')); }

  private inicial(): 'light' | 'dark' {
    const salvo = localStorage.getItem('tema');
    if (salvo === 'light' || salvo === 'dark') return salvo;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}` },
  'React': { codigo: `import { useEffect, useState } from 'react';

type Tema = 'light' | 'dark';

function inicial(): Tema {
  try {
    const salvo = localStorage.getItem('tema');
    if (salvo === 'light' || salvo === 'dark') return salvo;
  } catch {}
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(inicial);
  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('dark', tema === 'dark');
    el.dataset.theme = tema;
    el.style.colorScheme = tema;
    try { localStorage.setItem('tema', tema); } catch {}
  }, [tema]);
  return { tema, alternar: () => setTema((t) => (t === 'dark' ? 'light' : 'dark')) };
}` },
};

export const escuroRegras: Abas = {
  'Certo': { codigo: `.cartao {
  background: var(--color-background-primary-default);
  color: var(--color-text-primary);
}` , linguagem: 'css' },
  'Errado': { codigo: `/* Hex fixo: não troca no escuro */
.cartao { background: #ffffff; color: #0a0a0a; }

/* dark: com cor crua: duplica a decisão de cor */
<div class="bg-white dark:bg-neutral-800"></div>` , linguagem: 'css' },
};
