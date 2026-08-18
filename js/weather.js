/* weather.js - Riesgo de lluvia en vivo + fallback localStorage */
window.Weather = (function(){
  let REGIONES,CFG,NIV,nivelDe,onDatos;
  function init(regiones,cfg,niv,nivel,f){REGIONES=regiones;CFG=cfg;NIV=niv;nivelDe=nivel;onDatos=f;}
  const lats=()=>REGIONES.map(r=>r[2]).join(',');
  const lons=()=>REGIONES.map(r=>r[3]).join(',');
  function cargar(){
    return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats()}&longitude=${lons()}&hourly=precipitation&timezone=auto&forecast_days=3`)
    .then(x=>x.ok?x.json():Promise.reject())
    .then(cab=>{
      let arr;
      if(Array.isArray(cab)){arr=cab;}
      else if(cab&&Array.isArray(cab.results)){arr=cab.results;}
      else{arr=[cab];}
      const datos=REGIONES.map((r,i)=>{const h=((arr[i]||{}).hourly)||{};const p=(h.precipitation||[]).map(Number);return {r,mm:p.reduce((a,b)=>a+b,0)};});
      onDatos(datos,'');
      try{localStorage.setItem('elnino_riesgo',JSON.stringify({t:Date.now(),datos:datos.map(o=>({r:o.r[0],mm:o.mm}))}));}catch(e){}
    }).catch(()=>{
      try{const prev=localStorage.getItem('elnino_riesgo');
        if(prev){const p=JSON.parse(prev);if(p&&p.datos&&p.datos.length){const datos=p.datos.map(d=>({r:REGIONES.find(r=>r[0]===d.r),mm:d.mm})).filter(o=>o.r);onDatos(datos,`<p class="note">⚠️ Sin conexión. Mostrando datos guardados de ${new Date(p.t).toLocaleTimeString('es-PE')}</p>`);return;}}
        onDatos([],'<div class="al"><span class="loc">Sin conexión</span></div>');
      }catch(e){onDatos([],'<div class="al"><span class="loc">Sin conexión</span></div>');}
    });
  }
  return {init,cargar};
})();
