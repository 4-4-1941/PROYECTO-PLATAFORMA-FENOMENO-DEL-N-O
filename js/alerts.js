/* alerts.js - Panel de alertas por lluvia */
window.Alerts = (function(){
  let el;
  function init(sel){el=document.getElementById(sel);}
  function render(datos,NIV,nivelDe,nota){
    const orden=datos.slice().sort((a,b)=>b.mm-a.mm);
    const en=orden.filter(o=>nivelDe(o.mm)!=='bajo');
    let html=en.length===0?`<div class="al"><span class="loc">Sin alertas hoy</span></div>`:en.slice(0,6).map(o=>{const info=NIV[nivelDe(o.mm)];return `<div class="al" style="border-left-color:${info.col}"><span class="loc">${o.r[0]}</span> <span class="mm">${o.mm.toFixed(1)} mm · ${info.label}</span></div>`;}).join('');
    el.innerHTML=html+(nota||`<p class="note">Últ. act ${new Date().toLocaleTimeString('es-PE')} · cada ${CFG.refreshMin} min</p>`);
  }
  return {init,render};
})();
