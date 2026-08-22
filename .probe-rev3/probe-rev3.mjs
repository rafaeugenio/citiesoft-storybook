import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:6100';
const url = (id, extra = '') =>
  `${BASE}/iframe.html?id=${id}&viewMode=story${extra}`;

const out = (t, v) => console.log(`\n### ${t}\n` + JSON.stringify(v, null, 2));

const browser = await chromium.launch();

async function novaPagina(tema = 'light', w = 1280, h = 900) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') erros.push(m.text());
  });
  page.on('pageerror', (e) => erros.push('PAGEERROR ' + e.message));
  page._erros = erros;
  page._tema = tema;
  return page;
}

const temaParam = (t) => (t === 'dark' ? '&globals=theme:dark' : '&globals=theme:light');

// ---------------------------------------------------------------- 1. MODAL
for (const tema of ['light', 'dark']) {
  const page = await novaPagina(tema);
  await page.goto(url('moléculas-overlay-hovercard--dentro-de-dialog-modal', temaParam(tema)));
  await page.evaluate(() => { const d = document.querySelector('dialog.citie-dialog'); if (!d || !d.open) { [...document.querySelectorAll('button')].find(b => b.textContent.includes('Abrir processo'))?.click(); } });
  await page.waitForTimeout(500);
  await page.locator('a[href="#processo"]').hover({ force: true });
  await page.waitForSelector('[role=tooltip]', { timeout: 5000 });
  await page.waitForTimeout(400);

  const r = await page.evaluate(() => {
    const painel = document.querySelector('[role=tooltip]');
    const gatilho = document.querySelector('a[href="#processo"]');
    const dialogo = document.querySelector('dialog.citie-dialog');
    const c = painel.getBoundingClientRect();
    const cs = getComputedStyle(painel);
    const centro = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    // grade 5x5
    let acertos = 0;
    for (let i = 1; i <= 5; i++)
      for (let j = 1; j <= 5; j++) {
        const el = document.elementFromPoint(
          c.left + (c.width * i) / 6,
          c.top + (c.height * j) / 6,
        );
        if (painel.contains(el)) acertos++;
      }
    return {
      painelClosestP: painel.closest('p') ? painel.closest('p').tagName : null,
      gatilhoClosestP: gatilho.closest('p') ? gatilho.closest('p').tagName : null,
      paiDoPainel: painel.parentElement.tagName + '.' + painel.parentElement.className,
      dialogoContemPainel: dialogo.contains(painel),
      popoverAttr: painel.getAttribute('popover'),
      popoverOpen: painel.matches(':popover-open'),
      bg: cs.backgroundColor,
      cor: cs.color,
      centroEhPainel: painel.contains(centro),
      centroTag: centro && centro.tagName,
      acertos25: acertos,
      passaRodape: c.bottom - dialogo.getBoundingClientRect().bottom,
      dentroDaJanela: c.top >= 0 && c.bottom <= window.innerHeight,
      // validade de aninhamento medida no DOM vivo
      cadeiaAteBody: (() => {
        const cad = [];
        let n = painel.parentElement;
        while (n && n !== document.body) {
          cad.push(n.tagName);
          n = n.parentElement;
        }
        return cad;
      })(),
    };
  });
  out(`1. Dentro de Dialog modal (${tema})`, r);

  // Escape em camadas
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const esc = await page.evaluate(() => ({
    painel: !!document.querySelector('[role=tooltip]'),
    dialogoAberto: document.querySelector('dialog.citie-dialog').open,
  }));
  out(`1b. Escape em camadas (${tema})`, esc);
  out(`1c. Console (${tema})`, page._erros.slice(0, 10));
  await page.screenshot({ path: `/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/modal-${tema}.png` }).catch(() => {});
  await page.context().close();
}

// ------------------------------------------------- 2. INÉRCIA: portal fora do modal
{
  const page = await novaPagina('light');
  await page.goto(url('moléculas-overlay-hovercard--dentro-de-dialog-modal'));
  await page.evaluate(() => { const d = document.querySelector('dialog.citie-dialog'); if (!d || !d.open) { [...document.querySelectorAll('button')].find(b => b.textContent.includes('Abrir processo'))?.click(); } });
  await page.waitForTimeout(500);
  await page.locator('a[href="#processo"]').hover({ force: true });
  await page.waitForSelector('[role=tooltip]');
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const painel = document.querySelector('[role=tooltip]');
    const antes = (() => {
      const c = painel.getBoundingClientRect();
      const el = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
      return { apontavel: painel.contains(el), tag: el && el.tagName };
    })();
    // move o painel para fora do dialogo, mantendo popover aberto
    const tema = document.querySelector('[data-theme]') || document.body;
    painel.hidePopover?.();
    tema.appendChild(painel);
    try { painel.showPopover(); } catch (e) { /* ignora */ }
    const c = painel.getBoundingClientRect();
    const el = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    const cs = getComputedStyle(painel);
    return {
      antes,
      depoisFora: {
        popoverOpen: painel.matches(':popover-open'),
        visivel: cs.display !== 'none' && cs.visibility !== 'hidden' && c.width > 0,
        largura: c.width,
        apontavel: painel.contains(el),
        elementFromPointTag: el && el.tagName,
        // inércia declarada pelo próprio navegador
        painelInerte: !!painel.closest('[inert]') || painel.matches(':is(*)') && (() => {
          // checa se algum ancestral está inerte via propriedade
          let n = painel;
          while (n) { if (n.inert) return true; n = n.parentElement; }
          return false;
        })(),
      },
    };
  });
  out('2. Inércia: painel portalizado para fora do modal', r);
  await page.context().close();
}

// ------------------------------------------------- 3. FORA de modal (alvo = [data-theme])
{
  const page = await novaPagina('light');
  await page.goto(url('moléculas-overlay-hovercard--por-teclado'));
  await page.evaluate(() => { document.querySelector('#storybook-root a, #storybook-root button')?.focus(); });
  await page.waitForSelector('[role=tooltip]');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const painel = document.querySelector('[role=tooltip]');
    const p = painel.parentElement;
    const c = painel.getBoundingClientRect();
    const g = document.querySelector('a[href="#processo"]').getBoundingClientRect();
    return {
      pai: p.tagName + (p.dataset.theme ? `[data-theme=${p.dataset.theme}]` : '') + '.' + p.className,
      popoverOpen: painel.matches(':popover-open'),
      folga: +(c.top - g.bottom).toFixed(2),
      apontavel: painel.contains(document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2)),
      bg: getComputedStyle(painel).backgroundColor,
    };
  });
  out('3. Fora de modal: alvo do portal e folga', r);
  await page.context().close();
}

// ------------------------------------------------- 4. Tabela com overflow
{
  const page = await novaPagina('light');
  await page.goto(url('moléculas-overlay-hovercard--escapa-do-overflow'));
  await page.evaluate(() => { document.querySelector('#storybook-root a, #storybook-root button')?.focus(); });
  await page.waitForSelector('[role=tooltip]');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const painel = document.querySelector('[role=tooltip]');
    const moldura = document.querySelector('[data-testid=moldura-com-overflow]');
    const c = painel.getBoundingClientRect();
    const m = moldura.getBoundingClientRect();
    const y = m.bottom + (c.bottom - m.bottom) / 2;
    const el = document.elementFromPoint(c.left + c.width / 2, y);
    return {
      pai: painel.parentElement.tagName,
      molduraContemPainel: moldura.contains(painel),
      passaDaBorda: +(c.bottom - m.bottom).toFixed(1),
      apontavelAbaixoDaBorda: painel.contains(el),
      popoverOpen: painel.matches(':popover-open'),
    };
  });
  out('4. Tabela com overflow', r);
  await page.context().close();
}

// ------------------------------------------------- 5. Guarda: API recusa e API ausente
for (const modo of ['recusa', 'ausente']) {
  const page = await novaPagina('light');
  await page.addInitScript((m) => {
    if (m === 'ausente') {
      delete HTMLElement.prototype.showPopover;
      delete HTMLElement.prototype.hidePopover;
      delete HTMLElement.prototype.togglePopover;
    } else {
      HTMLElement.prototype.showPopover = function () {
        throw new DOMException('recusado pelo teste', 'InvalidStateError');
      };
    }
  }, modo);
  await page.goto(url('moléculas-overlay-hovercard--escapa-do-overflow'));
  await page.evaluate(() => document.querySelector('#storybook-root button')?.focus());
  await page.waitForSelector('[role=tooltip]', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const painel = document.querySelector('[role=tooltip]');
    if (!painel) return { painelExiste: false };
    const c = painel.getBoundingClientRect();
    const cs = getComputedStyle(painel);
    const moldura = document.querySelector('[data-testid=moldura-com-overflow]');
    const m = moldura.getBoundingClientRect();
    const el = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    return {
      painelExiste: true,
      atributoPopover: painel.getAttribute('popover'),
      display: cs.display,
      visibility: cs.visibility,
      largura: +c.width.toFixed(1),
      altura: +c.height.toFixed(1),
      zIndex: cs.zIndex,
      bg: cs.backgroundColor,
      passaDaBorda: +(c.bottom - m.bottom).toFixed(1),
      apontavel: painel.contains(el),
      dentroDaJanela: c.top >= 0 && c.bottom <= window.innerHeight,
    };
  });
  out(`5. Guarda de compatibilidade: API ${modo}`, r);
  await page.screenshot({ path: `/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/guarda-${modo}.png` }).catch(() => {});
  await page.context().close();
}

// ------------------------------------------------- 6. Modal aberto sobre tabela + guarda dentro de modal
{
  const page = await novaPagina('light');
  await page.goto(url('moléculas-overlay-hovercard--dentro-de-dialog-modal'));
  // injeta uma moldura com overflow dentro do dialogo? Em vez disso: verifica
  // que fora do modal, com modal aberto, o gatilho de fora fica inerte.
  await page.evaluate(() => { const d = document.querySelector('dialog.citie-dialog'); if (!d || !d.open) { [...document.querySelectorAll('button')].find(b => b.textContent.includes('Abrir processo'))?.click(); } });
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const abrir = document.querySelector('button.citie-button');
    const c = abrir.getBoundingClientRect();
    const el = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    return {
      gatilhoDeForaApontavel: abrir.contains(el),
      elementFromPointTag: el && el.tagName,
      comentario: 'confirma que modal deixa inerte o que está fora dele',
    };
  });
  out('6. Modal aberto: inércia do que está fora', r);
  await page.context().close();
}

// ------------------------------------------------- 7. Regressões das rodadas anteriores
{
  const page = await novaPagina('light');
  // 7a. travessia da lacuna com ponteiro real
  await page.goto(url('moléculas-overlay-hovercard--atravessa-ate-o-painel'));
  const gat = page.getByRole('button', { name: 'Paciente' });
  await gat.hover();
  await page.waitForSelector('[role=tooltip]');
  await page.waitForTimeout(200);
  const caixas = await page.evaluate(() => {
    const p = document.querySelector('[role=tooltip]').getBoundingClientRect();
    const g = document.querySelector('button').getBoundingClientRect();
    return { p: { x: p.left + p.width / 2, y: p.top + 20, top: p.top }, g: { y: g.bottom }, folga: +(p.top - g.bottom).toFixed(2) };
  });
  // atravessa a lacuna passo a passo
  await page.mouse.move(caixas.p.x, caixas.g.y + 1);
  await page.mouse.move(caixas.p.x, caixas.g.y + 4);
  await page.mouse.move(caixas.p.x, caixas.p.top + 5);
  await page.mouse.move(caixas.p.x, caixas.p.y);
  await page.waitForTimeout(500);
  const sobreviveu = await page.evaluate(() => !!document.querySelector('[role=tooltip]'));
  // seleciona o CPF
  const sel = await page.evaluate(() => {
    const cpf = [...document.querySelectorAll('[role=tooltip] dd')].find((d) => d.textContent.includes('605.922'));
    if (!cpf) return null;
    const r = document.createRange();
    r.selectNodeContents(cpf);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    return getSelection().toString();
  });
  out('7a. Travessia da lacuna com ponteiro real', { folga: caixas.folga, sobreviveu, selecionado: sel });
  await page.context().close();
}

{
  // 7b. InputGroup: anel pelo campo, não pelo botão + concentricidade
  const page = await novaPagina('light');
  await page.goto(url('moléculas-campos-inputgroup--anel-do-grupo'));
  await page.waitForTimeout(400);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  const foco1 = await page.evaluate(() => {
    const t = document.querySelector('.citie-input-group-trilho');
    return {
      focado: document.activeElement.className,
      trilhoTemClasseFocado: t.classList.contains('citie-input-group-trilho--focado'),
      sombraTrilho: getComputedStyle(t).boxShadow,
    };
  });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  const foco2 = await page.evaluate(() => {
    const t = document.querySelector('.citie-input-group-trilho');
    const b = t.querySelector('button');
    return {
      focado: document.activeElement.tagName + '.' + document.activeElement.className,
      trilhoTemClasseFocado: t.classList.contains('citie-input-group-trilho--focado'),
      sombraTrilho: getComputedStyle(t).boxShadow,
      sombraBotao: b ? getComputedStyle(b).boxShadow : null,
    };
  });
  const raios = await page.evaluate(() => {
    const t = document.querySelector('.citie-input-group-trilho');
    const pecas = [...t.children].map((c) => ({
      tag: c.tagName + '.' + c.className.split(' ')[0],
      raio: getComputedStyle(c).borderTopLeftRadius + ' / ' + getComputedStyle(c).borderTopRightRadius,
    }));
    return { trilho: getComputedStyle(t).borderRadius, pecas };
  });
  out('7b. InputGroup: anel e concentricidade', { foco1, foco2, raios });
  await page.context().close();
}

{
  // 7c. Kbd 20px em linha de 32px
  const page = await novaPagina('light');
  await page.goto(url('átomos-marcadores-kbd--em-linha-de-menu'));
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const kbds = [...document.querySelectorAll('.citie-kbd__tecla')];
    const k = kbds[0];
    const raiz = k.closest('.citie-kbd');
    return {
      alturaTecla: k.getBoundingClientRect().height,
      larguraTecla: k.getBoundingClientRect().width,
      nomeAcessivel: raiz.textContent,
      linhas: [...document.querySelectorAll('li,[class*=item]')].slice(0, 3).map((e) => +e.getBoundingClientRect().height.toFixed(1)),
    };
  });
  out('7c. Kbd em linha de menu', r);
  await page.context().close();
}

{
  // 7d. Virada na borda + 360px
  const page = await novaPagina('light', 360, 640);
  await page.goto(url('moléculas-overlay-hovercard--vira-quando-nao-cabe'));
  await page.evaluate(() => { document.querySelector('#storybook-root a, #storybook-root button')?.focus(); });
  await page.waitForSelector('[role=tooltip]');
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const p = document.querySelector('[role=tooltip]');
    const c = p.getBoundingClientRect();
    return {
      classe: p.className,
      dentroDaJanela: c.left >= 0 && c.right <= window.innerWidth && c.top >= 0 && c.bottom <= window.innerHeight,
      caixa: { l: +c.left.toFixed(1), r: +c.right.toFixed(1), t: +c.top.toFixed(1), b: +c.bottom.toFixed(1) },
      janela: { w: window.innerWidth, h: window.innerHeight },
    };
  });
  out('7d. Virada na borda em 360px', r);
  await page.context().close();
}

{
  // 7e. ButtonGroup: junções de 1px e foco no plano 2
  const page = await novaPagina('light');
  await page.goto(url('moléculas-ações-buttongroup--horizontal'));
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const g = document.querySelector('.citie-button-group');
    const bs = [...g.querySelectorAll('button')];
    const caixas = bs.map((b) => b.getBoundingClientRect());
    const lacunas = [];
    for (let i = 1; i < caixas.length; i++) lacunas.push(+(caixas[i].left - caixas[i - 1].right).toFixed(2));
    return {
      role: g.getAttribute('role'),
      rotulo: g.getAttribute('aria-label'),
      lacunasEntrePecas: lacunas,
      raios: bs.map((b) => getComputedStyle(b).borderRadius),
      larguraBorda: bs.map((b) => getComputedStyle(b).borderLeftWidth),
    };
  });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  const foco = await page.evaluate(() => {
    const a = document.activeElement;
    return { tag: a.tagName, zIndex: getComputedStyle(a).zIndex, sombra: getComputedStyle(a).boxShadow };
  });
  out('7e. ButtonGroup', { ...r, foco });
  await page.context().close();
}

await browser.close();
