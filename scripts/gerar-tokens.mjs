/**
 * Gera os tokens do Design System Citiesoft em formatos que qualquer stack consome.
 *
 * Fonte única: `styles/theme.css` e `styles/typography.css`, mais o tema padrão do Tailwind
 * (que define a paleta primitiva em OKLCH). O Tailwind remove do CSS final toda variável que
 * nenhum componente usa, então ler o CSS compilado entregaria uma paleta incompleta. Por isso
 * este script monta um CSS próprio com todas as declarações e pede ao Chrome para resolver
 * `var()`, `color-mix()` e OKLCH em cores sRGB.
 *
 * Saídas:
 *   tokens/citiesoft.tokens.json        base das páginas de Fundação (nome, origem, claro, escuro)
 *   public/tokens/citiesoft.tokens.css  variáveis CSS (:root e .dark / [data-theme="dark"])
 *   public/tokens/citiesoft.tokens.scss variáveis SCSS e mapa do tema escuro
 *   public/tokens/citiesoft.tokens.json tokens no formato W3C Design Tokens (DTCG)
 *   public/tokens/citiesoft.text.css    classes de estilo de texto para HTML puro
 *   public/tokens/citiesoft.tailwind-*.css  tema e tipografia para projetos Tailwind v4
 *
 * Uso: `npm run gerar-tokens` (usa o Chrome instalado; `CITIE_PW_CHANNEL` troca o canal).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(raiz + '/');
const { chromium } = require('playwright');

const ler = (p) => readFileSync(resolve(raiz, p), 'utf8');
const semComentario = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Devolve o corpo de cada bloco cujo cabeçalho casa com `cabecalho` (ex.: /^@theme\s*$/). */
function blocos(css, cabecalho) {
  const out = [];
  const texto = semComentario(css);
  let i = 0;
  while (i < texto.length) {
    const abre = texto.indexOf('{', i);
    if (abre < 0) break;
    const ini = Math.max(texto.lastIndexOf('}', abre), texto.lastIndexOf(';', abre)) + 1;
    const cab = texto.slice(ini, abre).trim();
    let prof = 1, j = abre + 1;
    while (j < texto.length && prof > 0) { if (texto[j] === '{') prof++; else if (texto[j] === '}') prof--; j++; }
    if (cabecalho.test(cab)) out.push(texto.slice(abre + 1, j - 1));
    i = j;
  }
  return out;
}

/** Declarações `--nome: valor;` no nível raiz do bloco, ignorando at-rules aninhadas. */
function declaracoes(corpo) {
  const out = [];
  let prof = 0, atual = '';
  for (const ch of corpo) {
    if (ch === '{') { prof++; atual = ''; continue; }
    if (ch === '}') { prof--; atual = ''; continue; }
    if (prof > 0) continue;
    if (ch === ';') {
      const m = atual.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
      if (m) out.push([m[1], m[2].replace(/\s+/g, ' ')]);
      atual = '';
    } else atual += ch;
  }
  return out;
}

const tailwind = ler('node_modules/tailwindcss/theme.css');
const tema = ler('styles/theme.css');
const tipografia = ler('styles/typography.css');

const base = blocos(tailwind, /^@theme default$/).flatMap(declaracoes);
const temaDecl = blocos(tema, /^@theme$/).flatMap(declaracoes);
const tipoDecl = blocos(tipografia, /^@theme$/).flatMap(declaracoes);
// `:root, .light` permite forçar o tema claro dentro de uma área escura.
const semanticosClaro = blocos(tema, /^:root(?:,\s*\.light)?$/).flatMap(declaracoes);
const escuro = blocos(tema, /^\.dark$/).flatMap(declaracoes);

// As fontes do tema apontam para variáveis que o Next injeta; fora dele a família é a própria fonte.
const fontes = (v) => v.replace(/var\(--font-inter\),\s*/g, "'Inter', ").replace(/var\(--font-mono-source\),\s*/g, "'Red Hat Mono', ");

const ordem = [];
const declarado = new Map();
for (const [n, v] of [...base, ...temaDecl, ...tipoDecl, ...semanticosClaro]) {
  if (!declarado.has(n)) ordem.push(n);
  declarado.set(n, fontes(v));
}
const declaradoEscuro = new Map(escuro.map(([n, v]) => [n, fontes(v)]));
for (const n of declaradoEscuro.keys()) if (!declarado.has(n)) { ordem.push(n); declarado.set(n, ''); }

const css = `:root{${[...declarado].map(([n, v]) => `${n}:${v}`).join(';')}}
.dark{${[...declaradoEscuro].map(([n, v]) => `${n}:${v}`).join(';')}}`;

const browser = await chromium.launch({ channel: process.env.CITIE_PW_CHANNEL ?? 'chrome' });
const page = await browser.newPage();
await page.setContent(`<style>${css}</style><body><div id="a"></div><canvas id="c" width="1" height="1"></canvas></body>`);

const resolvido = await page.evaluate((nomes) => {
  const raiz = document.documentElement;
  const alvo = document.getElementById('a');
  const ctx = document.getElementById('c').getContext('2d', { willReadFrequently: true });
  const ehCor = (n, v) => /^--color-/.test(n) || /^(#|rgb|hsl|oklch|oklab|color\(|color-mix|transparent)/i.test(v);
  const paraHex = (v) => {
    alvo.style.backgroundColor = '';
    alvo.style.backgroundColor = v;
    const calc = getComputedStyle(alvo).backgroundColor;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = calc;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const h = (x) => x.toString(16).padStart(2, '0');
    return a === 255 ? `#${h(r)}${h(g)}${h(b)}` : `#${h(r)}${h(g)}${h(b)}${h(a)}`;
  };
  const ler = () => Object.fromEntries(nomes.map((n) => {
    const v = getComputedStyle(raiz).getPropertyValue(n).trim();
    return [n, v && ehCor(n, v) ? { cor: paraHex(`var(${n})`), bruto: v } : { texto: v }];
  }));
  raiz.classList.remove('dark');
  const claro = ler();
  raiz.classList.add('dark');
  const noEscuro = ler();
  return { claro, escuro: noEscuro };
}, ordem);
await browser.close();

const valor = (r) => (r.cor ?? r.texto);
const tokens = ordem.map((nome) => {
  const c = resolvido.claro[nome], e = resolvido.escuro[nome];
  const t = { nome, tipo: c.cor ? 'color' : 'text', declarado: declarado.get(nome), claro: valor(c) };
  if (c.cor && c.bruto && /^oklch|^color-mix/i.test(c.bruto)) t.bruto = c.bruto.replace(/ none/g, ' 0');
  if (declaradoEscuro.has(nome) && valor(e) !== valor(c)) { t.escuro = valor(e); t.declaradoEscuro = declaradoEscuro.get(nome); }
  return t;
}).filter((t) => t.claro !== '');

mkdirSync(resolve(raiz, 'tokens'), { recursive: true });
mkdirSync(resolve(raiz, 'public/tokens'), { recursive: true });
const grava = (p, c) => writeFileSync(resolve(raiz, p), c.endsWith('\n') ? c : c + '\n');
grava('tokens/citiesoft.tokens.json', JSON.stringify({ tokens }, null, 1));

const cab = '/* Design System Citiesoft. Arquivo gerado por `npm run gerar-tokens`: não edite à mão. */';
const alias = (t, escuroModo) => {
  const d = escuroModo ? t.declaradoEscuro : t.declarado;
  return /^var\(--[\w-]+\)$/.test(d ?? '') ? d : (escuroModo ? t.escuro : t.claro);
};
const cssClaro = tokens.map((t) => `  ${t.nome}: ${t.tipo === 'color' ? alias(t, false) : t.claro};`).join('\n');
const cssEscuro = tokens.filter((t) => t.escuro !== undefined).map((t) => `  ${t.nome}: ${t.tipo === 'color' ? alias(t, true) : t.escuro};`).join('\n');
grava('public/tokens/citiesoft.tokens.css', `${cab}\n/* Tema claro: padrão do :root. A classe .light força o tema claro dentro de uma área escura. */\n:root,\n.light {\n${cssClaro}\n}\n\n/* Tema escuro: classe .dark ou .app-dark (PrimeNG) no <html>, ou atributo data-theme="dark". */\n.dark,\n.app-dark,\n[data-theme='dark'] {\n${cssEscuro}\n}`);

const scssNome = (n) => '$' + n.replace(/^--/, '');
const scssClaro = tokens.map((t) => `${scssNome(t.nome)}: ${t.claro.includes(',') && t.tipo === 'text' && !/^\(/.test(t.claro) ? `(${t.claro})` : t.claro};`).join('\n');
const scssEscuro = tokens.filter((t) => t.escuro !== undefined).map((t) => `  '${t.nome.replace(/^--/, '')}': ${t.escuro},`).join('\n');
grava('public/tokens/citiesoft.tokens.scss', `// Design System Citiesoft. Arquivo gerado por \`npm run gerar-tokens\`: não edite à mão.\n${scssClaro}\n\n// Sobrescritas do tema escuro (nome do token sem o prefixo --).\n$tokens-escuro: (\n${scssEscuro}\n);`);

const grupo = (n) => n.replace(/^--/, '').split('-')[0];
const dtcg = {};
for (const t of tokens) {
  const g = (dtcg[grupo(t.nome)] ??= {});
  const chave = t.nome.replace(/^--/, '').split('-').slice(1).join('-');
  g[chave || grupo(t.nome)] = {
    $type: t.tipo === 'color' ? 'color' : 'string',
    $value: t.claro,
    ...(t.escuro !== undefined ? { $extensions: { 'com.citiesoft.modo': { escuro: t.escuro } } } : {}),
  };
}
grava('public/tokens/citiesoft.tokens.json', JSON.stringify({ $description: 'Design System Citiesoft', ...dtcg }, null, 2));

// Classes de texto para quem não usa Tailwind.
const estilos = new Map();
for (const t of tokens) {
  const m = t.nome.match(/^--text-([a-z0-9-]+?)-(regular|medium|semibold|bold)(--(line-height|letter-spacing|font-weight))?$/);
  if (!m) continue;
  const id = `${m[1]}-${m[2]}`;
  const e = estilos.get(id) ?? {};
  e[m[4] ?? 'size'] = t.claro;
  estilos.set(id, e);
}
const textoCss = [...estilos].map(([id, e]) => `.text-${id} {\n  font-size: ${e.size};\n  line-height: ${e['line-height']};\n  letter-spacing: ${e['letter-spacing']};\n  font-weight: ${e['font-weight']};\n}`).join('\n');
grava('public/tokens/citiesoft.text.css', `${cab}\n/* Classes de estilo de texto, com os mesmos nomes dos utilitários Tailwind. Exigem a variável --font-sans do arquivo de tokens. */\n.text-body-medium, [class*='text-'] { font-family: var(--font-sans); }\n${textoCss}`);

// Tema para projetos Tailwind v4: os mesmos arquivos que alimentam este Storybook.
grava('public/tokens/citiesoft.tailwind-theme.css', fontes(tema));
grava('public/tokens/citiesoft.tailwind-typography.css', tipografia);

console.log(`tokens: ${tokens.length} (${tokens.filter((t) => t.tipo === 'color').length} cores, ${tokens.filter((t) => t.escuro !== undefined).length} com tema escuro), estilos de texto: ${estilos.size}`);
