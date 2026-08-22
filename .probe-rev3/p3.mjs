import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:6100';
const url = (id, e = '') => `${BASE}/iframe.html?id=${id}&viewMode=story${e}`;
const out = (t, v) => console.log(`\n### ${t}\n` + JSON.stringify(v, null, 2));
const browser = await chromium.launch();

// A. Sem popover DENTRO do modal: o dialog recorta mesmo?
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  await page.addInitScript(() => {
    delete HTMLElement.prototype.showPopover;
    delete HTMLElement.prototype.hidePopover;
    delete HTMLElement.prototype.togglePopover;
  });
  await page.goto(url('moléculas-overlay-hovercard--dentro-de-dialog-modal'));
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const d = document.querySelector('dialog.citie-dialog');
    const painel = document.querySelector('[role=tooltip]');
    if (!painel) return { painelExiste: false, dialogoAberto: d?.open };
    const c = painel.getBoundingClientRect();
    const cd = d.getBoundingClientRect();
    const csd = getComputedStyle(d);
    const abaixo = c.bottom - cd.bottom;
    const y = abaixo > 4 ? cd.bottom + abaixo / 2 : c.top + c.height / 2;
    const el = document.elementFromPoint(c.left + c.width / 2, y);
    const elCentro = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    return {
      painelExiste: true,
      overflowDoDialogo: csd.overflow,
      dialogoContem: d.contains(painel),
      caixaPainel: { t: +c.top.toFixed(1), b: +c.bottom.toFixed(1), w: +c.width.toFixed(1), h: +c.height.toFixed(1) },
      caixaDialogo: { t: +cd.top.toFixed(1), b: +cd.bottom.toFixed(1) },
      passaDoRodape: +abaixo.toFixed(1),
      pontoAbaixoDoRodapeEhPainel: painel.contains(el),
      pontoAbaixoTag: el && el.tagName,
      centroEhPainel: painel.contains(elCentro),
      centroTag: elCentro && elCentro.tagName,
      scrollTopDoDialogo: d.scrollTop,
      scrollHeightDoDialogo: d.scrollHeight,
      clientHeightDoDialogo: d.clientHeight,
    };
  });
  out('A. Sem popover, dentro do modal: o dialog recorta?', r);
  out('A2. Console', erros.slice(0, 10));
  await page.screenshot({ path: '/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/sem-popover-no-modal.png' });
  await ctx.close();
}

// B. InputGroup: terceiro Tab (botão emendado)
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url('moléculas-campos-inputgroup--anel-do-grupo'));
  await page.waitForTimeout(1800);
  await page.evaluate(() => document.activeElement?.blur?.());
  const passos = [];
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    passos.push(await page.evaluate(() => {
      const t = document.querySelector('.citie-input-group-trilho');
      const b = t.querySelector('button');
      const a = document.activeElement;
      return {
        focado: a.tagName + '.' + (a.className || '').split(' ')[0],
        trilhoFocado: t.classList.contains('citie-input-group-trilho--focado'),
        sombraTrilho: getComputedStyle(t).boxShadow,
        sombraBotao: b ? getComputedStyle(b).boxShadow : null,
      };
    }));
  }
  out('B. InputGroup: sequência de Tab', passos);
  await ctx.close();
}

// C. Kbd em linha de menu: altura da linha real
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url('átomos-marcadores-kbd--em-linha-de-menu'));
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const k = document.querySelector('.citie-kbd');
    let n = k.parentElement, cadeia = [];
    while (n && n.id !== 'storybook-root') {
      cadeia.push({ tag: n.tagName, classe: (n.className || '').toString().slice(0, 40), h: +n.getBoundingClientRect().height.toFixed(1) });
      n = n.parentElement;
    }
    return { alturaKbd: +k.getBoundingClientRect().height.toFixed(1), cadeia };
  });
  out('C. Kbd: cadeia de alturas', r);
  await ctx.close();
}

// D. Movimento reduzido
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url('moléculas-overlay-hovercard--por-teclado'));
  await page.waitForTimeout(1800);
  await page.evaluate(() => document.querySelector('#storybook-root a')?.focus());
  await page.waitForFunction(() => !!document.querySelector('[role=tooltip]'), null, { timeout: 8000 });
  const r = await page.evaluate(() => {
    const p = document.querySelector('[role=tooltip]');
    const cs = getComputedStyle(p);
    return { animationName: cs.animationName, opacity: cs.opacity, visibility: cs.visibility };
  });
  out('D. Movimento reduzido', r);
  await ctx.close();
}

await browser.close();
