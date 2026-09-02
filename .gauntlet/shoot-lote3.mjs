// Captura de evidência do Lote 3: stories do lote nos 4 breakpoints e nos dois temas,
// servindo o storybook-static por um servidor estático mínimo.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const raiz = resolve('/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/static-lote3');
const saida = resolve('/Users/rafaeleugenio/Documents/Cursor/Repositorios/citiesoft-storybook/.gauntlet/capturas-lote3');
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
  ['card-hub', 'moléculas-contêineres-card--hub'],
  ['card-anatomia', 'moléculas-contêineres-card--anatomia'],
  ['card-rodape', 'moléculas-contêineres-card--com-rodape'],
  ['panel', 'organismos-layout-panel--padrao'],
  ['fieldset', 'organismos-formulário-fieldset--formulario'],
  ['message-anatomia', 'moléculas-feedback-message--message-anatomia'],
  ['message-tipos', 'moléculas-feedback-message--message-tipos'],
  ['toast-sucesso', 'moléculas-feedback-toast--toast-sucesso'],
  ['toast-erro', 'moléculas-feedback-toast--toast-erro'],
  ['empty-molduras', 'moléculas-feedback-emptystate--molduras'],
  ['skeleton', 'átomos-feedback-skeleton--formas'],
  ['hovercard', 'moléculas-overlay-hovercard--estrutura-completa'],
];
const larguras = [320, 375, 414, 768, 1280];
const temas = ['light', 'dark'];

const navegador = await chromium.launch();
const erros = [];
for (const tema of temas) {
  for (const largura of larguras) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1 });
    const pagina = await contexto.newPage();
    pagina.on('console', (m) => { if (m.type() === 'error') erros.push(`${tema}/${largura}: ${m.text()}`); });
    pagina.on('pageerror', (e) => erros.push(`${tema}/${largura}: ${e.message}`));
    for (const [nome, id] of stories) {
      if (largura !== 1280 && largura !== 375 && !['card-hub', 'message-anatomia', 'toast-sucesso', 'empty-molduras'].includes(nome)) continue;
      await pagina.goto(`http://localhost:${porta}/iframe.html?id=${id}&viewMode=story&globals=theme:${tema}`, { waitUntil: 'networkidle' });
      await pagina.waitForTimeout(600);
      await pagina.screenshot({ path: join(saida, `${nome}--${tema}--${largura}.png`), fullPage: true });
    }
    await contexto.close();
  }
}

// Interações que exigem abrir: diálogo, drawer, tooltip e pilha de toasts, no desktop.
for (const tema of temas) {
  const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
  const abrir = async (nome, id, acao) => {
    const pagina = await contexto.newPage();
    pagina.on('pageerror', (e) => erros.push(`${tema}/${nome}: ${e.message}`));
    await pagina.goto(`http://localhost:${porta}/iframe.html?id=${id}&viewMode=story&globals=theme:${tema}`, { waitUntil: 'networkidle' });
    await pagina.waitForSelector('#storybook-root button, #storybook-root [role=button]', { timeout: 15000 });
    await pagina.waitForTimeout(300);
    try { await acao(pagina); } catch (e) { erros.push(`${tema}/${nome}: ${e.message.split('\n')[0]}`); }
    await pagina.waitForTimeout(500);
    await pagina.screenshot({ path: join(saida, `${nome}--${tema}--1280.png`) });
    await pagina.close();
  };
  await abrir('dialog-aberto', 'organismos-overlay-dialog--anatomia', (pagina) => pagina.getByRole('button', { name: 'Abrir diálogo' }).click());
  await abrir('dialog-obrigatorio', 'organismos-overlay-dialog--obrigatorio', (pagina) => pagina.getByRole('button', { name: 'Abrir aceite de termos' }).click());
  await abrir('drawer-aberto', 'organismos-overlay-drawer--painel-de-filtros', (pagina) => pagina.getByRole('button', { name: 'Abrir filtros' }).click());
  await abrir('tooltip-aberto', 'moléculas-overlay-tooltip--anatomia', (pagina) => pagina.getByRole('button', { name: 'CNES' }).focus());
  await abrir('toast-pilha', 'moléculas-feedback-toast--toast-empilhado', async (pagina) => {
    const b = pagina.getByRole('button', { name: 'Disparar notificação' });
    await b.click(); await b.click(); await b.click();
  });
  await abrir('confirmpopup-aberto', 'moléculas-overlay-confirmpopup--padrao', async (pagina) => {
    const b = pagina.getByRole('button').first();
    await b.click();
  });
  await contexto.close();
}

await navegador.close();
servidor.close();
console.log('capturas em', saida);
console.log('erros de console/página:', erros.length ? erros : 'nenhum');
