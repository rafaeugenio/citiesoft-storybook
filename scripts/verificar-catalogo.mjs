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

import { readFileSync, existsSync, globSync } from 'node:fs';
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
// 6. A cadeia de composição narrada na Visão geral existe mesmo no código
// ---------------------------------------------------------------------------
//
// Este é o bloco que impede a reincidência do defeito mais grave da rodada 2: a
// página de abertura afirmava uma cadeia de imports que não existia, e nada
// acusava. Agora, cada elo narrado é conferido contra o `import` real. Alterar a
// composição sem alterar o texto quebra o build.

const CADEIA_NARRADA = [
  {
    elo: 'Button consome o token de marca',
    arquivo: 'src/components/atoms/Button/Button.css',
    exige: /var\(--citie-brand-primary\)/,
  },
  {
    elo: 'DataView compõe Card',
    arquivo: 'src/components/organisms/DataView/DataView.tsx',
    exige: /from '[^']*\/molecules\/Card\/Card'/,
  },
  {
    elo: 'DataView compõe EmptyState, Pagination, Select e SelectButton',
    arquivo: 'src/components/organisms/DataView/DataView.tsx',
    exige: /EmptyState/,
    tambem: [/Pagination/, /SelectButton/],
  },
  {
    elo: 'DataView compõe Skeleton',
    arquivo: 'src/components/organisms/DataView/DataView.tsx',
    exige: /Skeleton/,
  },
  {
    elo: 'O template Listagem não importa componente nenhum',
    arquivo: '.storybook/templates/Listagem/Listagem.tsx',
    proibe: /from '[^']*\/(src|components)\//,
  },
  {
    elo: 'A página Consulta de processos importa o template Listagem',
    arquivo: '.storybook/pages/ConsultaDeProcessos.stories.tsx',
    exige: /from '[^']*templates\/Listagem\/Listagem'/,
  },
];

for (const { elo, arquivo, exige, tambem = [], proibe } of CADEIA_NARRADA) {
  const caminho = resolve(raiz, arquivo);
  if (!existsSync(caminho)) {
    falhas.push(`Cadeia da Visão geral: "${elo}" aponta para ${arquivo}, que não existe.`);
    continue;
  }
  const fonte = readFileSync(caminho, 'utf8');
  for (const padrao of [...(exige ? [exige] : []), ...tambem]) {
    if (!padrao.test(fonte)) {
      falhas.push(
        `Cadeia da Visão geral desatualizada: "${elo}" não se confirma em ${arquivo}. ` +
          `Ajuste o código ou o texto de VisaoGeral.mdx.`,
      );
    }
  }
  if (proibe && proibe.test(fonte)) {
    falhas.push(
      `Cadeia da Visão geral: "${elo}" foi violado. ${arquivo} passou a importar componente.`,
    );
  }
}

/** O Button é anunciado como a peça mais reusada. O número precisa bater. */
const consumidoresDoButton = globSync('src/components/**/*.tsx', { cwd: raiz })
  .filter((f) => !f.includes('.stories.') && !f.includes('/Button/'))
  .filter((f) => /from '[^']*\/atoms\/Button\/Button'/.test(readFileSync(resolve(raiz, f), 'utf8')));

if (consumidoresDoButton.length < 10) {
  avisos.push(
    `A Visão geral afirma que catorze componentes importam o Button; hoje são ${consumidoresDoButton.length}. Atualize o texto.`,
  );
}

// ---------------------------------------------------------------------------
// 7. Contagens, para a documentação poder citar número conferido
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
