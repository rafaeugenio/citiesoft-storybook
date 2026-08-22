import { chromium } from 'playwright';
const BASE = 'http://127.0.0.1:6100';
const url = (id, e = '') => `${BASE}/iframe.html?id=${id}&viewMode=story${e}`;
const out = (t, v) => console.log(`\n### ${t}\n` + JSON.stringify(v, null, 2));
const browser = await chromium.launch();

// A. Sem popover dentro do modal, COM translate no dialogo (bloco de contenção)
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    delete HTMLElement.prototype.showPopover;
    delete HTMLElement.prototype.hidePopover;
    delete HTMLElement.prototype.togglePopover;
  });
  await page.goto(url('moléculas-overlay-hovercard--dentro-de-dialog-modal'));
  await page.waitForTimeout(2500);
  const semTranslate = await page.evaluate(() => {
    const d = document.querySelector('dialog.citie-dialog');
    const p = document.querySelector('[role=tooltip]');
    const c = p.getBoundingClientRect(), cd = d.getBoundingClientRect();
    return {
      translateDoDialogo: getComputedStyle(d).translate,
      transformDoDialogo: getComputedStyle(d).transform,
      passaDoRodape: +(c.bottom - cd.bottom).toFixed(1),
      pontoAbaixoEhPainel: p.contains(document.elementFromPoint(c.left + c.width / 2, cd.bottom + (c.bottom - cd.bottom) / 2)),
    };
  });
  out('A1. Sem popover, dialogo em repouso', semTranslate);

  const comTranslate = await page.evaluate(() => {
    const d = document.querySelector('dialog.citie-dialog');
    d.style.translate = '0 -8px';
    const p = document.querySelector('[role=tooltip]');
    // força remedição
    window.dispatchEvent(new Event('resize'));
    return new Promise((res) => setTimeout(() => {
      const c = p.getBoundingClientRect(), cd = d.getBoundingClientRect();
      const abaixo = c.bottom - cd.bottom;
      res({
        translateDoDialogo: getComputedStyle(d).translate,
        caixaPainel: { t: +c.top.toFixed(1), b: +c.bottom.toFixed(1), h: +c.height.toFixed(1) },
        passaDoRodape: +abaixo.toFixed(1),
        pontoAbaixoEhPainel: abaixo > 4 ? p.contains(document.elementFromPoint(c.left + c.width / 2, cd.bottom + abaixo / 2)) : null,
        centroEhPainel: p.contains(document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2)),
        scrollHeight: d.scrollHeight, clientHeight: d.clientHeight,
      });
    }, 400));
  });
  out('A2. Sem popover, dialogo COM translate (bloco de contenção)', comTranslate);
  await ctx.close();
}

// B. Movimento reduzido
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url('moléculas-overlay-hovercard--atravessa-ate-o-painel'));
  await page.waitForTimeout(2000);
  await page.locator('#storybook-root button').hover();
  await page.waitForFunction(() => !!document.querySelector('[role=tooltip]'), null, { timeout: 8000 });
  const r = await page.evaluate(() => {
    const p = document.querySelector('[role=tooltip]');
    const cs = getComputedStyle(p);
    return { animationName: cs.animationName, opacity: cs.opacity, visibility: cs.visibility, matchReduce: matchMedia('(prefers-reduced-motion: reduce)').matches };
  });
  out('B. Movimento reduzido', r);
  await ctx.close();
}

// C. Contraste do Kbd nos dois temas
for (const tema of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url('átomos-marcadores-kbd--nome-por-extenso', tema === 'dark' ? '&globals=theme:dark' : ''));
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const k = document.querySelector('.citie-kbd__tecla');
    const cs = getComputedStyle(k);
    const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const l1 = lum(rgb(cs.color)), l2 = lum(rgb(cs.backgroundColor));
    return {
      cor: cs.color, bg: cs.backgroundColor,
      contraste: +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05))).toFixed(2),
      fontSize: cs.fontSize, altura: +k.getBoundingClientRect().height.toFixed(1),
      sombra: cs.boxShadow,
    };
  });
  out(`C. Kbd contraste (${tema})`, r);
  await page.screenshot({ path: `/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/kbd-${tema}.png` });
  await ctx.close();
}

// D. Capturas nos dois temas / duas larguras
for (const tema of ['light', 'dark']) {
  for (const w of [1280, 360]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(url('moléculas-campos-inputgroup--unidade-monetaria', tema === 'dark' ? '&globals=theme:dark' : ''));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/inputgroup-${tema}-${w}.png` });
    await page.goto(url('moléculas-ações-buttongroup--horizontal', tema === 'dark' ? '&globals=theme:dark' : ''));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/buttongroup-${tema}-${w}.png` });
    await ctx.close();
  }
}
console.log('\ncapturas OK');
await browser.close();
