/**
 * Verificação de catálogo — roda contra o índice PUBLICADO, nunca contra uma lista paralela.
 *
 * Motivo de existir: a documentação chegou a afirmar "zero órfãos e zero destinos
 * inventados" enquanto o mapa legado apontava para um título que não existia no catálogo e
 * um componente publicado (Sparkline) não constava de nenhuma das duas fontes de verdade.
 * Uma afirmação de rastreabilidade que ninguém consegue executar não vale nada, então esta
 * checagem lê `storybook-static/index.json`, que é o que o navegador realmente serve.
 *
 * Uso:
 *   npm run build-storybook && node scripts/verificar-catalogo.mjs
 *
 * Sai com código 1 se qualquer invariante falhar, para poder entrar em CI.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const caminhoIndice = resolve(raiz, 'storybook-static/index.json');
const caminhoMapa = resolve(raiz, 'docs/atomic-design/legacy-story-map.json');
const caminhoClassificacao = resolve(raiz, 'docs/atomic-design/classificacao.json');

const NIVEIS = ['Visão geral', 'Fundações', 'Átomos', 'Moléculas', 'Organismos', 'Templates', 'Páginas'];

const falhas = [];
const avisos = [];

function exigir(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
}

if (!existsSync(caminhoIndice)) {
  console.error(
    'storybook-static/index.json não existe. Rode `npm run build-storybook` antes desta verificação.',
  );
  process.exit(1);
}

const indice = JSON.parse(readFileSync(caminhoIndice, 'utf8'));
const entradas = Object.values(indice.entries);

/** Todo título que o catálogo publica de fato. É esta a fonte contra a qual tudo é conferido. */
const titulosPublicados = new Set(entradas.map((e) => e.title));
const stories = entradas.filter((e) => e.type === 'story');

// ---------------------------------------------------------------------------
// 1. Ordem e existência dos sete grupos atômicos
// ---------------------------------------------------------------------------
const gruposPublicados = [...new Set([...titulosPublicados].map((t) => t.split('/')[0]))];
for (const nivel of NIVEIS) {
  exigir(gruposPublicados.includes(nivel), `Grupo ausente no catálogo publicado: "${nivel}"`);
}
const inesperados = gruposPublicados.filter((g) => !NIVEIS.includes(g));
exigir(
  inesperados.length === 0,
  `Grupo de primeiro nível fora da taxonomia atômica: ${inesperados.join(', ')}`,
);

// ---------------------------------------------------------------------------
// 2. Todo destino do mapa legado existe no catálogo publicado
// ---------------------------------------------------------------------------
const mapa = JSON.parse(readFileSync(caminhoMapa, 'utf8'));
const entradasMapa = Array.isArray(mapa) ? mapa : (mapa.titulos ?? mapa.entradas ?? []);

const destinos = new Set();
for (const entrada of entradasMapa) {
  for (const destino of entrada.destinos ?? []) {
    const titulo = typeof destino === 'string' ? destino : destino.tituloNovo;
    if (titulo) destinos.add(titulo);
  }
}

exigir(destinos.size > 0, 'O mapa legado não produziu nenhum destino. O formato mudou?');

const inventados = [...destinos].filter((d) => !titulosPublicados.has(d));
exigir(
  inventados.length === 0,
  `Destino inventado no mapa legado (não existe no catálogo publicado):\n    ${inventados.join('\n    ')}`,
);

// ---------------------------------------------------------------------------
// 3. Todo componente publicado consta da classificação
// ---------------------------------------------------------------------------
const classificacao = JSON.parse(readFileSync(caminhoClassificacao, 'utf8'));
const listaClassificada = Array.isArray(classificacao)
  ? classificacao
  : (classificacao.componentes ?? []);
const nomesClassificados = new Set(listaClassificada.map((c) => c.nome ?? c.componente));

/** Títulos de componente: excluem os grupos que não descrevem peça de código. */
const titulosDeComponente = [...titulosPublicados].filter(
  (t) => !['Visão geral', 'Fundações', 'Templates', 'Páginas'].includes(t.split('/')[0]),
);
const orfaos = titulosDeComponente
  .map((t) => ({ titulo: t, nome: t.split('/').pop() }))
  .filter(({ nome }) => !nomesClassificados.has(nome));

exigir(
  orfaos.length === 0,
  `Componente publicado ausente de classificacao.json:\n    ${orfaos
    .map((o) => `${o.nome}  (título: ${o.titulo})`)
    .join('\n    ')}`,
);

// ---------------------------------------------------------------------------
// 4. Nível declarado bate com a pasta em que o componente vive
// ---------------------------------------------------------------------------
const PASTA_POR_NIVEL = { atomo: 'atoms', molecula: 'molecules', organismo: 'organisms' };
const GRUPO_POR_NIVEL = { atomo: 'Átomos', molecula: 'Moléculas', organismo: 'Organismos' };

/** O caminho real de cada título vem do índice publicado, não de um campo declarado à mão. */
const caminhoPorTitulo = new Map();
for (const entrada of entradas) {
  if (entrada.importPath && !caminhoPorTitulo.has(entrada.title)) {
    caminhoPorTitulo.set(entrada.title, entrada.importPath);
  }
}

for (const item of listaClassificada) {
  const nome = item.nome ?? item.componente;
  const nivel = item.nivel;
  const pastaEsperada = PASTA_POR_NIVEL[nivel];
  const grupoEsperado = GRUPO_POR_NIVEL[nivel];
  if (!pastaEsperada) continue;

  const tituloPublicado = [...titulosPublicados].find((t) => t.endsWith(`/${nome}`));
  if (!tituloPublicado) {
    falhas.push(`${nome} está em classificacao.json mas não tem título publicado no catálogo.`);
    continue;
  }
  if (!tituloPublicado.startsWith(`${grupoEsperado}/`)) {
    falhas.push(
      `${nome} é "${nivel}" mas está publicado sob "${tituloPublicado.split('/')[0]}" (${tituloPublicado}).`,
    );
  }
  const caminho = caminhoPorTitulo.get(tituloPublicado);
  if (caminho && !caminho.includes(`/${pastaEsperada}/`)) {
    falhas.push(
      `${nome} é "${nivel}" mas o arquivo publicado é ${caminho}. ` +
        `classification.md promete que o nível manda na pasta.`,
    );
  }
}

// ---------------------------------------------------------------------------
// 5. Um título por componente: nenhum arquivo documenta dois componentes
// ---------------------------------------------------------------------------
const porTitulo = new Map();
for (const entrada of stories) {
  if (!porTitulo.has(entrada.title)) porTitulo.set(entrada.title, new Set());
  if (entrada.importPath) porTitulo.get(entrada.title).add(entrada.importPath);
}
for (const [titulo, arquivos] of porTitulo) {
  if (arquivos.size > 1) {
    avisos.push(`"${titulo}" é alimentado por ${arquivos.size} arquivos de story.`);
  }
}

// ---------------------------------------------------------------------------
// 6. Contagens, para a documentação poder citar número conferido
// ---------------------------------------------------------------------------
const contagem = {};
for (const nivel of NIVEIS) {
  contagem[nivel] = [...titulosPublicados].filter((t) => t.startsWith(`${nivel}/`) || t === nivel)
    .length;
}

console.log('Catálogo publicado');
console.log(`  entradas no índice: ${entradas.length}`);
console.log(`  stories: ${stories.length}`);
console.log(`  títulos: ${titulosPublicados.size}`);
for (const nivel of NIVEIS) console.log(`  ${nivel}: ${contagem[nivel]} títulos`);
console.log(`  destinos conferidos no mapa legado: ${destinos.size}`);
console.log(`  componentes em classificacao.json: ${nomesClassificados.size}`);

if (avisos.length) {
  console.log('\nAvisos');
  for (const a of avisos) console.log(`  · ${a}`);
}

if (falhas.length) {
  console.error(`\n${falhas.length} falha(s) de invariante:`);
  for (const f of falhas) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log('\nTodas as invariantes do catálogo passaram.');
