/**
 * Fotografa o valor computado de todo token `--citie-*` de `src/tokens/tokens.css`
 * nos dois temas, para provar que uma reorganização do arquivo não mexeu em valor.
 *
 * Uso: node scripts/snapshot-tokens.mjs <arquivo-de-saida.json>
 *
 * O navegador resolve `var()` e `color-mix()` na hora de computar a propriedade
 * personalizada, então a comparação pega tanto valor literal quanto valor
 * derivado de outro token.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const cssPath = new URL('../src/tokens/tokens.css', import.meta.url);
const css = readFileSync(cssPath, 'utf8');
const nomes = [...new Set(css.match(/--citie-[a-z0-9-]+/g) ?? [])].sort();

const saida = process.argv[2];
if (!saida) {
  console.error('Informe o arquivo de saída.');
  process.exit(1);
}

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.setContent('<html><head></head><body></body></html>');
await pagina.addStyleTag({ content: css });

const ler = () =>
  pagina.evaluate((lista) => {
    const estilo = getComputedStyle(document.documentElement);
    return Object.fromEntries(lista.map((n) => [n, estilo.getPropertyValue(n).trim()]));
  }, nomes);

const claro = await ler();
await pagina.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
const escuro = await ler();

await navegador.close();

writeFileSync(saida, JSON.stringify({ total: nomes.length, claro, escuro }, null, 2));
console.log(`${nomes.length} tokens fotografados em ${saida}`);
