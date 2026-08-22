import { chromium } from 'playwright';
const BASE='http://127.0.0.1:6199';
const ID='moléculas-feedback-toast--toast-empilhado';
const browser=await chromium.launch();
for (const tema of ['light','dark']) {
  const ctx=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await ctx.newPage();
  await page.goto(`${BASE}/iframe.html?id=${encodeURIComponent(ID)}&viewMode=story&globals=theme:${tema}`);
  await page.waitForSelector('.citie-toast-stack__item',{timeout:15000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{
    const pilha=document.querySelector('.citie-toast-stack');
    window.__a=[]; window.__r=null;
    let alvo=null, anterior=null, t0=0;
    const base=pilha.getBoundingClientRect().top;
    const amostrar=()=>{ if(!alvo||!alvo.isConnected) return;
      window.__a.push({t:+(performance.now()-t0).toFixed(1),
        margemAnterior:getComputedStyle(anterior).marginBlockEnd,
        fundoPilha:+(pilha.getBoundingClientRect().bottom-base).toFixed(2)});
      requestAnimationFrame(amostrar); };
    const obs=new MutationObserver((regs)=>{ for(const r of regs){
      if(r.type==='attributes'&&!alvo&&r.target.classList.contains('citie-toast-stack__item--saindo')){
        alvo=r.target; anterior=alvo.previousElementSibling; t0=performance.now(); requestAnimationFrame(amostrar);}
      for(const rem of r.removedNodes){ if(alvo&&rem===alvo){ const u=window.__a[window.__a.length-1]; obs.disconnect();
        requestAnimationFrame(()=>{ const f=+(pilha.getBoundingClientRect().bottom-base).toFixed(2);
          window.__r={eraUltimo:true,margemAnteriorNoUltimoQuadro:u.margemAnterior,fundoAntes:u.fundoPilha,fundoDepois:f,saltoNaRemocao:+Math.abs(f-u.fundoPilha).toFixed(2)};});
        return;}}}});
    obs.observe(pilha,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  });
  const fechar=page.getByRole('button',{name:'Fechar notificação'});
  await fechar.nth(await fechar.count()-1).click();
  await page.waitForFunction(()=>window.__r!==null,null,{timeout:8000});
  console.log(`\n### ultimo item, tema ${tema}`);
  console.log(JSON.stringify(await page.evaluate(()=>window.__r),null,2));
  await ctx.close();
}
await browser.close();
