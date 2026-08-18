/* oni.js - Estado El Niño (honesto: cache vs en vivo) */
window.Oni = (function(){
  let el;
  function init(sel){el=document.getElementById(sel);renderRef();tryVivo();}
  function render(o){el.className='oni '+o.phase;const f=o.live?'lectura en vivo NOAA':'valor de referencia NOAA (no en vivo)';el.innerHTML=`<div class="ph">${o.phase==='warm'?'🔴 El Niño (cálido)':o.phase==='cool'?'🔵 La Niña':'⚪ Neutro'}</div><div class="v">ONI (Niño 3.4): <b>${o.val>0?'+':''}${o.val} °C</b> — ${o.msg}</div><div class="s">${o.date} · ${f}</div>`;}
  function renderRef(){render({val:1.4,phase:'warm',msg:'Favorece lluvias intensas en costa norte y sierra.',date:'2026-08 (NOAA ERSSTv6)',live:false});}
  function tryVivo(){try{fetch('https://api.allorigins.win/raw?url='+encodeURIComponent('https://psl.noaa.gov/data/correlation/oni.data')).then(r=>r.ok?r.text():Promise.reject()).then(t=>{let last=null;t.split('\n').filter(l=>/^20\d\d/.test(l)).forEach(ln=>{const x=ln.trim().split(/\s+/);if(x.length>13&&x[0]>=2024){const v=parseFloat(x[x.length-2]);if(!isNaN(v))last=v;}});if(last!==null)render({val:last,phase:last>=0.5?'warm':last<=-0.5?'cool':'neutral',msg:last>=0.5?'Favorece lluvias intensas.':last<=-0.5?'Condiciones frías.':'Condiciones neutras.',date:'lectura en vivo NOAA',live:true});}).catch(()=>{});}catch(e){}}
  return {init};
})();
