import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('http://localhost:6187/index.html?path=/story/'+encodeURIComponent('moléculas-feedback-toast--toast-empilhado'),{waitUntil:'load'});
await p.waitForFunction(()=>document.querySelector('#storybook-preview-iframe')?.contentDocument?.querySelectorAll('.citie-toast-stack__item').length===3,null,{timeout:40000});
await p.waitForTimeout(600);
// Caso C: fecha os dois últimos. Rastreia o topo do PRIMEIRO item (o sobrevivente) por id de nó.
const r = await p.evaluate(()=>new Promise(res=>{
  const f=document.querySelector('#storybook-preview-iframe'), d=f.contentDocument, w=f.contentWindow;
  const pilha=d.querySelector('.citie-toast-stack');
  const sobrevivente=pilha.querySelector('.citie-toast-stack__item');
  const quadros=[]; let inicio=null;
  const tick=()=>{
    const saindo=pilha.querySelectorAll('.citie-toast-stack__item--saindo').length;
    if(saindo&&inicio===null) inicio=w.performance.now();
    if(inicio!==null){
      const rc=sobrevivente.getBoundingClientRect();
      quadros.push({t:+(w.performance.now()-inicio).toFixed(0), nSaindo:saindo,
        topo:+rc.top.toFixed(2), base:+rc.bottom.toFixed(2), conectado:sobrevivente.isConnected});
    }
    if(inicio!==null&&w.performance.now()-inicio>420){res(quadros);return;}
    w.requestAnimationFrame(tick);
  };
  w.requestAnimationFrame(tick);
  const btns=[...pilha.querySelectorAll('button[aria-label="Fechar notificação"]')];
  btns[btns.length-1].click(); btns[btns.length-2].click();
}));
let maior=0, ant=null;
for(const q of r){ if(ant) maior=Math.max(maior, Math.abs(q.topo-ant.topo), Math.abs(q.base-ant.base)); ant=q; }
console.log('C) topo/base do item SOBREVIVENTE, maior variacao entre quadros =', maior.toFixed(2),'px');
console.log('   primeiro:',JSON.stringify(r[0]),' ultimo:',JSON.stringify(r[r.length-1]));
await b.close();
