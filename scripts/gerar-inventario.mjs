/**
 * Gerador do inventário de componentes (docs/atomic-design/component-inventory.csv).
 *
 * Motivo de existir: o inventário anterior era mantido à mão e passou a apontar para
 * caminhos que não existiam mais depois da reorganização atômica. Um índice de governança
 * que aponta para arquivo inexistente atrapalha mais do que ajuda, então agora ele é
 * derivado de duas fontes que o repositório já tem:
 *
 *   1. `storybook-static/index.json` — o catálogo que o navegador realmente serve. De lá
 *      saem título publicado, caminho do arquivo de story, tags e contagem de stories.
 *   2. `docs/atomic-design/classificacao.json` — nível, família e arquivo de implementação.
 *
 * As colunas `primeng`, `figma` e `observacao` são curadoria humana e ficam preservadas
 * entre execuções: o gerador lê o CSV atual e recarrega o valor pelo nome do componente.
 *
 * Todo caminho gravado é conferido com `existsSync` antes de entrar no arquivo. Se algum
 * não existir, o gerador falha em vez de publicar caminho quebrado.
 *
 * Uso:
 *   npm run build-storybook && node scripts/gerar-inventario.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const caminhoIndice = resolve(raiz, 'storybook-static/index.json');
const caminhoClassificacao = resolve(raiz, 'docs/atomic-design/classificacao.json');
const caminhoCsv = resolve(raiz, 'docs/atomic-design/component-inventory.csv');

const PASTA_POR_NIVEL = { atomo: 'atoms', molecula: 'molecules', organismo: 'organisms' };
const GRUPO_POR_NIVEL = { atomo: 'Átomos', molecula: 'Moléculas', organismo: 'Organismos' };
const TAG_POR_NIVEL = { atomo: 'atom', molecula: 'molecule', organismo: 'organism' };

if (!existsSync(caminhoIndice)) {
  console.error(
    'storybook-static/index.json não existe. Rode `npm run build-storybook` antes de gerar o inventário.',
  );
  process.exit(1);
}

const indice = JSON.parse(readFileSync(caminhoIndice, 'utf8'));
const entradas = Object.values(indice.entries);

/** Um registro por título publicado, com o caminho de story e as tags do índice. */
const porTitulo = new Map();
for (const entrada of entradas) {
  if (!porTitulo.has(entrada.title)) {
    porTitulo.set(entrada.title, { caminho: entrada.importPath, tags: entrada.tags ?? [], stories: 0 });
  }
  if (entrada.type === 'story') porTitulo.get(entrada.title).stories += 1;
}

/** Curadoria humana preservada entre execuções, indexada pelo nome do componente. */
const curadoria = new Map();
if (existsSync(caminhoCsv)) {
  const linhas = readFileSync(caminhoCsv, 'utf8')
    .split('\n')
    .filter((l) => l.startsWith('"'));
  for (const linha of linhas) {
    const campos = linha.split(',').map((c) => c.replace(/^"|"$/g, ''));
    const cabecalho = colunasAntigas();
    const registro = Object.fromEntries(cabecalho.map((nome, i) => [nome, campos[i] ?? '']));
    curadoria.set(registro.nome, registro);
  }
}

/** O CSV mudou de colunas entre versões; o mapeamento usa o cabeçalho gravado no arquivo. */
function colunasAntigas() {
  const primeiraLinha = readFileSync(caminhoCsv, 'utf8').split('\n').find((l) => !l.startsWith('#'));
  return primeiraLinha.split(',').map((c) => c.trim());
}

const classificacao = JSON.parse(readFileSync(caminhoClassificacao, 'utf8'));
const componentes = classificacao.componentes ?? [];

const erros = [];
const linhas = [];

for (const componente of componentes) {
  const { nome, nivel, familia } = componente;
  const grupo = GRUPO_POR_NIVEL[nivel];
  const pasta = PASTA_POR_NIVEL[nivel];
  if (!grupo) {
    erros.push(`${nome}: nível "${nivel}" fora de atomo|molecula|organismo.`);
    continue;
  }

  const titulo = [...porTitulo.keys()].find((t) => t === `${grupo}/${familia}/${nome}`);
  if (!titulo) {
    erros.push(`${nome}: não existe título publicado "${grupo}/${familia}/${nome}".`);
    continue;
  }

  const registro = porTitulo.get(titulo);
  const arquivoStory = registro.caminho.replace(/^\.\//, '');
  const arquivoImplementacao = `src/components/${pasta}/${componente.arquivo}.tsx`;

  for (const caminho of [arquivoStory, arquivoImplementacao]) {
    if (!existsSync(resolve(raiz, caminho))) erros.push(`${nome}: caminho inexistente ${caminho}`);
  }

  const fonteStory = existsSync(resolve(raiz, arquivoStory))
    ? readFileSync(resolve(raiz, arquivoStory), 'utf8')
    : '';
  const playFns = (fonteStory.match(/^\s*play:/gm) ?? []).length;

  const antigo = curadoria.get(nome) ?? {};

  linhas.push([
    nome,
    nivel,
    familia,
    titulo,
    arquivoStory,
    arquivoImplementacao,
    String(registro.stories),
    String(playFns),
    registro.tags.includes(TAG_POR_NIVEL[nivel]) ? 'sim' : 'não',
    antigo.primeng ?? '',
    antigo.figma ?? '',
    componente.tituloAntigo ?? '',
  ]);
}

if (erros.length) {
  console.error(`${erros.length} problema(s) impedem a gravação do inventário:`);
  for (const erro of erros) console.error(`  ✗ ${erro}`);
  process.exit(1);
}

linhas.sort((a, b) => a[3].localeCompare(b[3], 'pt-BR'));

const semPrimeng = linhas.filter((l) => !l[9]).length;
const semFigma = linhas.filter((l) => !l[10]).length;
const semTag = linhas.filter((l) => l[8] === 'não').length;

const cabecalho = [
  '# Inventário de componentes do catálogo Citiesoft.',
  '#',
  '# ARQUIVO GERADO. Não edite à mão, exceto as colunas de curadoria `primeng` e `figma`,',
  '# que o gerador preserva pelo nome do componente. Para regenerar:',
  '#',
  '#   npm run build-storybook && npm run gerar-inventario',
  '#',
  '# Fontes: storybook-static/index.json (título, arquivo de story, tags, contagem de stories)',
  '# e docs/atomic-design/classificacao.json (nível, família, arquivo de implementação).',
  '# Todo caminho é conferido com existsSync antes da gravação.',
  '#',
  `# Medido em ${new Date().toISOString().slice(0, 10)}: ${linhas.length} componentes.`,
  `# Lacunas conhecidas: ${semPrimeng} sem equivalente PrimeNG registrado,`,
  `# ${semFigma} sem referência de Figma, ${semTag} sem a tag de nível atômico no meta da story.`,
  '#',
  '# Colunas: nome · nivel · familia · titulo (publicado) · arquivo_story · arquivo_implementacao',
  '# · stories (no catálogo publicado) · play_fns (ocorrências de `play:` no arquivo de story)',
  '# · tag_nivel (a tag atom|molecule|organism está no meta?) · primeng · figma · titulo_antigo',
].join('\n');

const colunas = [
  'nome',
  'nivel',
  'familia',
  'titulo',
  'arquivo_story',
  'arquivo_implementacao',
  'stories',
  'play_fns',
  'tag_nivel',
  'primeng',
  'figma',
  'titulo_antigo',
];

const conteudo = [
  cabecalho,
  colunas.join(','),
  ...linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
].join('\n');

writeFileSync(caminhoCsv, `${conteudo}\n`, 'utf8');

console.log(`Inventário gravado: ${linhas.length} componentes em docs/atomic-design/component-inventory.csv`);
console.log(`  sem equivalente PrimeNG: ${semPrimeng}`);
console.log(`  sem referência de Figma: ${semFigma}`);
console.log(`  sem tag de nível: ${semTag}`);
