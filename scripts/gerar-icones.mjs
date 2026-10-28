// Gera tokens/remixicon.json e copia SVGs, webfont e sprite do Remix Icon para public/icons.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pacote = join(raiz, 'node_modules/remixicon');
const versao = JSON.parse(readFileSync(join(pacote, 'package.json'), 'utf8')).version;

const pascal = (nome) => nome.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
const exportsReais = new Set(Object.keys(await import('@remixicon/react')));

const categorias = readdirSync(join(pacote, 'icons'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const icones = [];
const semComponente = [];
const destSvg = join(raiz, 'public/icons/svg');
rmSync(destSvg, { recursive: true, force: true });

for (const categoria of categorias) {
  mkdirSync(join(destSvg, categoria), { recursive: true });
  for (const arq of readdirSync(join(pacote, 'icons', categoria)).filter((f) => f.endsWith('.svg')).sort()) {
    const nome = arq.slice(0, -4);
    const componente = 'Ri' + pascal(nome);
    const estilo = nome.endsWith('-line') ? 'line' : nome.endsWith('-fill') ? 'fill' : 'unico';
    if (!exportsReais.has(componente)) semComponente.push(`${categoria}/${nome} -> ${componente}`);
    icones.push({ nome, componente, categoria, estilo });
    copyFileSync(join(pacote, 'icons', categoria, arq), join(destSvg, categoria, arq));
  }
}

mkdirSync(join(raiz, 'tokens'), { recursive: true });
writeFileSync(join(raiz, 'tokens/remixicon.json'), JSON.stringify({ versao, total: icones.length, categorias, icones }) + '\n');

const fontes = join(raiz, 'public/icons');
mkdirSync(fontes, { recursive: true });
for (const f of ['remixicon.woff2', 'remixicon.woff', 'remixicon.ttf', 'remixicon.eot', 'remixicon.svg', 'remixicon.symbol.svg']) {
  if (existsSync(join(pacote, 'fonts', f))) copyFileSync(join(pacote, 'fonts', f), join(fontes, f));
}
// O CSS usa caminhos relativos (mesma pasta das fontes) e fica sem o cache-buster ?t=.
const css = readFileSync(join(pacote, 'fonts/remixicon.css'), 'utf8').replace(/\?t=\d+/g, '');
writeFileSync(join(fontes, 'remixicon.css'), css);

console.log(`Remix Icon ${versao}: ${icones.length} ícones, ${categorias.length} categorias.`);
console.log(`Sem componente em @remixicon/react: ${semComponente.length}`);
semComponente.forEach((s) => console.log('  ' + s));
