// Captura de evidência do Lote 5: stories de dados nos dois temas, em 1280 e
// 375, servindo o storybook-static por um servidor estático mínimo.
// Uso: node .gauntlet/shoot-lote5.mjs [caminho-do-storybook-static]
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const raiz = resolve(process.argv[2] ?? 'storybook-static');
const saida = resolve('.gauntlet/capturas-lote5');
await mkdir(saida, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const servidor = createServer(async (req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const arquivo = join(raiz, caminho === '/' ? 'index.html' : caminho);
  try {
    const corpo = await readFile(arquivo);
    res.writeHead(200, { 'content-type': MIME[extname(arquivo)] ?? 'application/octet-stream' });
    res.end(corpo);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((ok) => servidor.listen(0, ok));
const porta = servidor.address().port;

const stories = [
  ['table-confortavel', 'organismos-tabelas-table--confortavel'],
  ['table-em-cartao', 'organismos-tabelas-table--em-cartao'],
  ['table-selecao-par', 'organismos-tabelas-table--selecao-na-linha-par'],
  ['table-destaque', 'organismos-tabelas-table--destaque-de-linha'],
  ['treetable', 'organismos-tabelas-treetable--confortavel'],
  ['treetable-selecao', 'organismos-tabelas-treetable--selecao-na-linha-par'],
  ['dataview-lista', 'organismos-coleções-dataview--lista'],
  ['dataview-grade', 'organismos-coleções-dataview--grade'],
  ['filters-sismental', 'organismos-busca-filterbar--com-filtros-ativos'],
  ['filters-kit', 'organismos-busca-filterbar--barra-do-kit'],
  ['tree', 'organismos-hierarquia-tree--selecao-checkbox'],
  ['listbox', 'moléculas-campos-listbox--multipla'],
  ['orderlist', 'organismos-coleções-orderlist--default'],
  ['picklist', 'organismos-coleções-picklist--default'],
  ['timeline', 'organismos-histórico-timeline--vertical'],
  ['timeline-aberta', 'organismos-histórico-timeline--corpo-expansivel'],
  ['kpi-variacao', 'organismos-painel-kpiwidget--kpi-com-variacao'],
  ['kpi-faixa', 'organismos-painel-kpifaixa--faixa-de-fila'],
  ['barchart', 'organismos-gráficos-barchart--barras'],
  ['linechart', 'organismos-gráficos-linechart--linha'],
  ['donutchart', 'organismos-gráficos-donutchart--rosca'],
];
const larguras = [1280, 375];
const temas = ['light', 'dark'];

const navegador = await chromium.launch();
const erros = [];
for (const tema of temas) {
  for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
    const pagina = await contexto.newPage();
    pagina.on('pageerror', (e) => erros.push(`${tema}/${largura}: ${e.message}`));
    for (const [nome, id] of stories) {
      if (largura === 375 && !['table-em-cartao', 'dataview-grade', 'filters-kit', 'timeline', 'kpi-faixa'].includes(nome)) continue;
      const resposta = await pagina.goto(`http://localhost:${porta}/iframe.html?id=${id}&viewMode=story&globals=theme:${tema}`, { waitUntil: 'networkidle' });
      if (!resposta?.ok()) erros.push(`${nome}: HTTP ${resposta?.status()}`);
      await pagina.waitForTimeout(700);
      const vazio = await pagina.evaluate(() => document.querySelector('#storybook-root')?.childElementCount === 0);
      if (vazio) erros.push(`${nome}/${tema}/${largura}: story vazia (id errado?)`);
      // Dica do gráfico: passa o ponteiro pela primeira barra antes da captura.
      if (nome === 'barchart') {
        const barra = pagina.locator('.citie-chart__barra').first();
        if (await barra.count()) await barra.hover();
        await pagina.waitForTimeout(250);
      }
      await pagina.screenshot({ path: join(saida, `${nome}--${tema}--${largura}.png`), fullPage: true });
    }
    await contexto.close();
  }
}
await navegador.close();
servidor.close();
console.log(`${stories.length} stories × ${temas.length} temas em ${saida}`);
if (erros.length) {
  console.log('Erros:');
  for (const erro of erros) console.log(' ', erro);
}
