import { chromium } from 'playwright';
const BASE='http://127.0.0.1:6100';
const url=(id,e='')=>`${BASE}/iframe.html?id=${id}&viewMode=story${e}`;
const b=await chromium.launch();
for (const tema of ['light','dark']) {
  const g = tema==='dark'?'&globals=theme:dark':'';
  const ctx=await b.newContext({viewport:{width:1000,height:700}});
  const p=await ctx.newPage();
  await p.goto(url('moléculas-overlay-hovercard--estrutura-completa',g));
  await p.waitForTimeout(1800);
  await p.locator('#storybook-root button').hover();
  await p.waitForFunction(()=>!!document.querySelector('[role=tooltip]'),null,{timeout:8000}).catch(()=>{});
  await p.waitForTimeout(500);
  await p.screenshot({path:`/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/estrutura-${tema}.png`});
  await p.goto(url('moléculas-campos-inputgroup--juncoes',g));
  await p.waitForTimeout(1500);
  await p.screenshot({path:`/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/juncoes-${tema}.png`});
  await p.goto(url('átomos-marcadores-kbd--em-linha-de-menu',g));
  await p.waitForTimeout(1200);
  await p.screenshot({path:`/Users/rafaeleugenio/.claude/jobs/87efdce7/tmp/shots3/kbd-menu-${tema}.png`});
  await ctx.close();
}
await b.close(); console.log('ok');
