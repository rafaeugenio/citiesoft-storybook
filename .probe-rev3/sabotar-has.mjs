import { chromium } from 'playwright';
const BASE='http://127.0.0.1:6199';
const ID='moléculas-feedback-toast--toast-empilhado';
const browser=await chromium.launch();
const ctx=await browser.newContext({viewport:{width:1280,height:900}});
const page=await ctx.newPage();
await page.goto(`${BASE}/iframe.html?id=${encodeURIComponent(ID)}&viewMode=story&globals=theme:light`);
await page.waitForSelector('.citie-toast-stack__item',{timeout:15000});
await page.waitForTimeout(1500);
const removidas=await page.evaluate(()=>{ let n=0;
  for(const f of document.styleSheets){ let regras; try{regras=f.cssRules}catch{continue}
    for(let i=regras.length-1;i>=0;i--){ const t=regras[i].selectorText;
      if(t&&t.includes(':has(+ .citie-toast-stack__item--saindo')||t&&t.includes(':has(+.citie-toast-stack__item--saindo')){f.deleteRule(i);n++;}}}
  return n;});
await page.evaluate(()=>{ const pilha=document.querySelector('.citie-toast-stack');
  window.__a=[];window.__r=null;let alvo=null,anterior=null;const base=pilha.getBoundingClientRect().top;
  const amostrar=()=>{if(!alvo||!alvo.isConnected)return;
    window.__a.push({margemAnterior:getComputedStyle(anterior).marginBlockEnd,fundo:+(pilha.getBoundingClientRect().bottom-base).toFixed(2)});
    requestAnimationFrame(amostrar);};
  const obs=new MutationObserver((regs)=>{for(const r of regs){
    if(r.type==='attributes'&&!alvo&&r.target.classList.contains('citie-toast-stack__item--saindo')){alvo=r.target;anterior=alvo.previousElementSibling;requestAnimationFrame(amostrar);}
    for(const rem of r.removedNodes){if(alvo&&rem===alvo){const u=window.__a[window.__a.length-1];obs.disconnect();
      requestAnimationFrame(()=>{const f=+(pilha.getBoundingClientRect().bottom-base).toFixed(2);
        window.__r={regrasRemovidas:0,margemAnteriorNoUltimoQuadro:u.margemAnterior,fundoAntes:u.fundo,fundoDepois:f,salto:+Math.abs(f-u.fundo).toFixed(2)};});return;}}}});
  obs.observe(pilha,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});});
const fechar=page.getByRole('button',{name:'Fechar notificação'});
await fechar.nth(await fechar.count()-1).click();
await page.waitForFunction(()=>window.__r!==null,null,{timeout:8000});
const r=await page.evaluate(()=>window.__r); r.regrasRemovidas=removidas;
console.log(JSON.stringify(r,null,2));
await browser.close();
