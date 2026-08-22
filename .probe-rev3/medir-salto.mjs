import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:6199';
const ID = 'moléculas-feedback-toast--toast-empilhado';
const browser = await chromium.launch();

for (const tema of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(
    `${BASE}/iframe.html?id=${encodeURIComponent(ID)}&viewMode=story&globals=theme:${tema}`,
  );
  await page.waitForSelector('.citie-toast-stack__item', { timeout: 15000 });
  // A play function dispara 4; espera a pilha assentar em 3.
  await page.waitForTimeout(1500);
  const antes = await page.$$eval('.citie-toast-stack__item', (n) => n.length);

  await page.evaluate(() => {
    const pilha = document.querySelector('.citie-toast-stack');
    window.__amostras = [];
    window.__res = null;
    let alvo = null;
    let vizinho = null;
    let t0 = 0;
    const amostrar = () => {
      if (!alvo || !vizinho) return;
      if (!alvo.isConnected) return;
      window.__amostras.push({
        t: +(performance.now() - t0).toFixed(1),
        margemSaindo: getComputedStyle(alvo).marginBlockEnd,
        hSaindo: +alvo.getBoundingClientRect().height.toFixed(2),
        topoUltimo: +vizinho.getBoundingClientRect().top.toFixed(2),
      });
      requestAnimationFrame(amostrar);
    };
    const obs = new MutationObserver((regs) => {
      for (const r of regs) {
        if (
          r.type === 'attributes' &&
          !alvo &&
          r.target.classList.contains('citie-toast-stack__item--saindo')
        ) {
          alvo = r.target;
          vizinho = alvo.nextElementSibling;
          t0 = performance.now();
          requestAnimationFrame(amostrar);
        }
        for (const rem of r.removedNodes) {
          if (alvo && rem === alvo) {
            const ultimo = window.__amostras[window.__amostras.length - 1];
            const intervalo = performance.now() - t0;
            obs.disconnect();
            requestAnimationFrame(() => {
              const topoFinal = +vizinho.getBoundingClientRect().top.toFixed(2);
              window.__res = {
                intervaloMs: +intervalo.toFixed(1),
                topoInicial: window.__amostras[0]?.topoUltimo,
                ultimoTopoAntesDaRemocao: ultimo?.topoUltimo,
                margemNoUltimoQuadro: ultimo?.margemSaindo,
                topoFinal,
                saltoNaRemocao: +Math.abs(topoFinal - ultimo.topoUltimo).toFixed(2),
                deslocamentoTotal: +Math.abs(
                  topoFinal - window.__amostras[0].topoUltimo,
                ).toFixed(2),
              };
            });
            return;
          }
        }
      }
    });
    obs.observe(pilha, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  });

  await page.getByRole('button', { name: 'Disparar notificação' }).click();
  await page.waitForFunction(() => window.__res !== null, null, { timeout: 8000 });
  const res = await page.evaluate(() => ({ res: window.__res, amostras: window.__amostras }));
  const a = res.amostras;
  const passo = Math.max(1, Math.floor(a.length / 6));
  console.log(`\n### tema ${tema} (itens antes: ${antes})`);
  console.log(JSON.stringify(res.res, null, 2));
  console.log(
    a
      .filter((_, i) => i % passo === 0 || i === a.length - 1)
      .map((s) => `t=${s.t} margem=${s.margemSaindo} h=${s.hSaindo} topo=${s.topoUltimo}`)
      .join('\n'),
  );
  await ctx.close();
}

await browser.close();
