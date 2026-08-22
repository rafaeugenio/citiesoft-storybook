import { chromium } from 'playwright';

const STORY = 'moléculas-feedback-toast--toast-empilhado';
const url = (tema) =>
  'http://localhost:6187/index.html?path=/story/' + encodeURIComponent(STORY) + '&globals=theme:' + tema;

const browser = await chromium.launch();

async function abrir(tema, opts = {}) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 }, ...opts });
  await p.goto(url(tema), { waitUntil: 'load' });
  await p.waitForFunction(
    () => {
      const f = document.querySelector('#storybook-preview-iframe');
      return f?.contentDocument?.querySelectorAll('.citie-toast-stack__item').length === 3;
    },
    null,
    { timeout: 40000 },
  );
  await p.waitForTimeout(600);
  return p;
}

/**
 * Amostra por quadro: margem do(s) item(ns) que saem e o topo do último item da
 * pilha. `gatilho` roda dentro do iframe e decide quem sai.
 */
async function amostrar(p, gatilho) {
  return p.evaluate(
    (src) =>
      new Promise((res) => {
        const f = document.querySelector('#storybook-preview-iframe');
        const d = f.contentDocument;
        const w = f.contentWindow;
        const pilha = d.querySelector('.citie-toast-stack');
        const quadros = [];
        let inicio = null;
        const tick = () => {
          const itens = [...pilha.querySelectorAll('.citie-toast-stack__item')];
          const saindo = itens.filter((i) => i.classList.contains('citie-toast-stack__item--saindo'));
          if (saindo.length && inicio === null) inicio = w.performance.now();
          if (inicio !== null) {
            const ult = itens[itens.length - 1];
            quadros.push({
              t: +(w.performance.now() - inicio).toFixed(0),
              n: itens.length,
              nSaindo: saindo.length,
              margens: itens.map((i) => w.getComputedStyle(i).marginBlockEnd).join(','),
              baseDaPilha: itens.length
                ? +(ult.getBoundingClientRect().bottom - pilha.getBoundingClientRect().top).toFixed(2)
                : null,
              topoUltimo: itens.length ? +ult.getBoundingClientRect().top.toFixed(2) : null,
            });
          }
          if (inicio !== null && w.performance.now() - inicio > 340) {
            res(quadros);
            return;
          }
          w.requestAnimationFrame(tick);
        };
        w.requestAnimationFrame(tick);
        // eslint-disable-next-line no-new-func
        new Function('d', 'w', src)(d, w);
      }),
    gatilho,
  );
}

function relatar(rotulo, quadros) {
  console.log('--- ' + rotulo);
  let anterior = null;
  let maiorDegrau = 0;
  let quadroDoDegrau = null;
  for (const q of quadros) {
    if (anterior !== null && q.topoUltimo !== null && anterior.topoUltimo !== null) {
      const d = Math.abs(q.topoUltimo - anterior.topoUltimo);
      if (d > maiorDegrau) {
        maiorDegrau = d;
        quadroDoDegrau = q.t;
      }
    }
    anterior = q;
  }
  for (const q of quadros.slice(0, 16)) console.log('    ' + JSON.stringify(q));
  const prim = quadros[0];
  const ult = quadros[quadros.length - 1];
  const desl =
    prim.topoUltimo !== null && ult.topoUltimo !== null
      ? Math.abs(ult.topoUltimo - prim.topoUltimo).toFixed(2)
      : 'n/a';
  console.log(
    `    >> maior degrau entre quadros: ${maiorDegrau.toFixed(2)}px (t=${quadroDoDegrau}) · deslocamento total: ${desl}px`,
  );
}

const disparar = `[...d.querySelectorAll('button')].find(x=>x.textContent.trim()==='Disparar notificação').click();`;
const fecharUltimo = `{const b=[...d.querySelectorAll('.citie-toast-stack__item button[aria-label="Fechar notificação"]')];b[b.length-1].click();}`;
const fecharDoisUltimos = `{const b=[...d.querySelectorAll('.citie-toast-stack__item button[aria-label="Fechar notificação"]')];b[b.length-1].click();b[b.length-2].click();}`;
const fecharTodos = `{[...d.querySelectorAll('.citie-toast-stack__item button[aria-label="Fechar notificação"]')].forEach(x=>x.click());}`;

for (const tema of ['light', 'dark']) {
  console.log('======================= TEMA ' + tema.toUpperCase());
  {
    const p = await abrir(tema);
    relatar('A) excedente do max: sai o PRIMEIRO (não é :last-child)', await amostrar(p, disparar));
    await p.close();
  }
  {
    const p = await abrir(tema);
    relatar('B) fecha o ÚLTIMO da pilha (:last-child) — caso do :has()', await amostrar(p, fecharUltimo));
    await p.close();
  }
  {
    const p = await abrir(tema);
    relatar('C) fecha os DOIS últimos ao mesmo tempo', await amostrar(p, fecharDoisUltimos));
    await p.close();
  }
  {
    const p = await abrir(tema);
    relatar('D) fecha TODOS ao mesmo tempo', await amostrar(p, fecharTodos));
    await p.close();
  }
}

// E) item único na pilha
{
  const p = await abrir('light');
  const r = await p.evaluate(async () => {
    const f = document.querySelector('#storybook-preview-iframe');
    const d = f.contentDocument;
    const b = [...d.querySelectorAll('.citie-toast-stack__item button[aria-label="Fechar notificação"]')];
    b[0].click();
    b[1].click();
    await new Promise((r) => setTimeout(r, 900));
    const antes = d.querySelectorAll('.citie-toast-stack__item').length;
    const pilha = d.querySelector('.citie-toast-stack');
    const alturaAntes = pilha.getBoundingClientRect().height;
    d.querySelector('.citie-toast-stack__item button[aria-label="Fechar notificação"]').click();
    await new Promise((r) => setTimeout(r, 900));
    return {
      itensAntes: antes,
      alturaPilhaAntes: +alturaAntes.toFixed(2),
      itensDepois: d.querySelectorAll('.citie-toast-stack__item').length,
      alturaPilhaDepois: +pilha.getBoundingClientRect().height.toFixed(2),
    };
  });
  console.log('E) item ÚNICO na pilha =', JSON.stringify(r));
  await p.close();
}

await browser.close();
