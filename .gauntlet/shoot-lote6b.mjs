// Captura de evidência do Lote 6b: templates recompostos nos dois temas, em
// 1366 e 375, servindo um build estático privado por um servidor mínimo.
// Uso: node .gauntlet/shoot-lote6b.mjs <caminho-do-build-estatico>
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const raiz = resolve(process.argv[2] ?? 'storybook-static');
const saida = resolve('.gauntlet/capturas-lote6b');
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
  ['shell-anatomia', 'templates-estrutura-shell-de-aplicação--anatomia'],
  ['shell-cartao', 'templates-estrutura-shell-de-aplicação--moldura-em-cartao'],
  ['shell-colapsado', 'templates-estrutura-shell-de-aplicação--menu-colapsado'],
  ['shell-celular', 'templates-estrutura-shell-de-aplicação--celular'],
  ['listagem', 'templates-listagem-listagem-com-filtros--estrutura'],
  ['listagem-filterbar', 'templates-listagem-listagem-com-filtros--com-filter-bar'],
  ['listagem-celular', 'templates-listagem-listagem-com-filtros--celular-375'],
  ['consulta', 'páginas-processos-consulta-de-processos--com-dados'],
  ['consulta-celular', 'páginas-processos-consulta-de-processos--celular'],
  ['dashboard', 'templates-dashboard-painel-de-indicadores--estrutura'],
  ['dashboard-hub', 'templates-dashboard-painel-de-indicadores--hub-de-atalhos'],
  ['dashboard-telefone', 'templates-dashboard-painel-de-indicadores--telefone'],
  ['painel-tfd', 'páginas-processos-painel-de-tfd--com-dados'],
  ['painel-tfd-telefone', 'páginas-processos-painel-de-tfd--telefone'],
  ['formulario-longo', 'templates-formulário-cadastro--formulario-longo'],
  ['formulario-evolucao', 'templates-formulário-cadastro--registro-de-evolucao'],
  ['acesso-entrar', 'templates-acesso-fluxo-de-acesso--entrar'],
  ['acesso-criar-conta', 'templates-acesso-fluxo-de-acesso--criar-conta'],
  ['acesso-recuperar', 'templates-acesso-fluxo-de-acesso--recuperar-senha'],
  ['acesso-verificar', 'templates-acesso-fluxo-de-acesso--verificar-email'],
  ['acesso-nova-senha', 'templates-acesso-fluxo-de-acesso--nova-senha'],
  ['acesso-celular', 'templates-acesso-fluxo-de-acesso--celular'],
];
const SO_375 = new Set(['shell-celular', 'listagem-celular', 'consulta-celular', 'dashboard-telefone', 'painel-tfd-telefone', 'acesso-celular']);
const temas = ['light', 'dark'];

const navegador = await chromium.launch();
const erros = [];
for (const tema of temas) {
  for (const [nome, id] of stories) {
    const largura = SO_375.has(nome) ? 375 : 1366;
    const contexto = await navegador.newContext({ viewport: { width: largura, height: largura === 375 ? 812 : 768 }, deviceScaleFactor: 1 });
    const pagina = await contexto.newPage();
    pagina.on('pageerror', (e) => erros.push(`${tema}/${nome}: ${e.message}`));
    const resposta = await pagina.goto(`http://localhost:${porta}/iframe.html?id=${id}&viewMode=story&globals=theme:${tema}`, { waitUntil: 'networkidle' });
    if (!resposta?.ok()) erros.push(`${nome}: HTTP ${resposta?.status()}`);
    await pagina.waitForTimeout(800);
    const vazio = await pagina.evaluate(() => document.querySelector('#storybook-root')?.childElementCount === 0);
    if (vazio) erros.push(`${nome}/${tema}: story vazia (id errado?)`);
    await pagina.screenshot({ path: join(saida, `${nome}--${tema}--${largura}.png`), fullPage: true });
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
