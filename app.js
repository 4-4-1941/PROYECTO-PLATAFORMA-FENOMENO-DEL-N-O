/* =========================================================
   ANTICIPACIÓN EL NIÑO · app.js
   Depende de: data.js (REGIONES, FUENTES) — cargar primero.
   ========================================================= */
(function(){
  const DATA = window.DATA || (typeof DATA !== 'undefined' ? DATA : null);
  if(!DATA || !DATA.REGIONES || !DATA.FUENTES){
    console.error('data.js no cargado. Cargar data.js antes de app.js.');
    return;
  }
  const REGIONES = DATA.REGIONES;
  const FUENTES = DATA.FUENTES;
  const map = L.map('map',{zoomControl:true}).setView([-9.5,-75],5);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'© Esri'}).addTo(map);
  L.control.scale({imperial:false}).addTo(map);

  /* ---------- Estado El Niño (ONI/NOAA) con respaldo documentado ---------- */
  const oniEl = document.getElementById('oni');
  function renderOni(o){
    const cls = o.phase==='warm'?'warm':o.phase==='cool'?'cool':'neutral';
    const ph = o.phase==='warm'?'🔴 El Niño (cálido)':o.phase==='cool'?'🔵 La Niña':'⚪ Neutro';
    oniEl.className = 'oni '+cls;
    oniEl.innerHTML = `<div class="ph">${ph}</div><div class="v">Índice ONI (Niño 3.4): <b>${o.val>0?'+':''}${o.val} °C</b> — ${o.msg}</div><div class="s">${o.date} · NOAA/CPC</div>`;
  }
  renderOni({val:1.4,phase:'warm',msg:'Favorece lluvias intensas en costa norte y sierra.',date:'2026-08 (NOAA ERSSTv6)'});
  try{
    fetch('https://api.allorigins.win/raw?url='+encodeURIComponent('https://psl.noaa.gov/data/correlation/oni.data'))
      .then(r=>r.ok?r.text():Promise.reject())
      .then(t=>{ let last=null;
        t.split('\n').filter(l=>/^20\d\d/.test(l)).forEach(ln=>{ const x=ln.trim().split(/\s+/); if(x.length>13&&x[0]>=2024){ const v=parseFloat(x[x.length-2]); if(!isNaN(v)) last=v; }});
        if(last!==null) renderOni({val:last,phase:last>=0.5?'warm':last<=-0.5?'cool':'neutral',msg:last>=0.5?'Favorece lluvias intensas en costa norte y sierra.':last<=-0.5?'Condiciones frías, vigilancia en sierra y selva.':'Condiciones neutras, vigilancia estándar.',date:'lectura en vivo NOAA/PSL'});
      }).catch(()=>{});
  }catch(e){}

  /* ---------- Riesgo en vivo: lluvia 72h por región ---------- */
  const grp = L.layerGroup().addTo(map);
  const alertsEl = document.getElementById('alerts');
  Promise.all(REGIONES.map(r=>
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lon}&hourly=precipitation&timezone=auto&forecast_days=3`)
      .then(x=>x.json()).then(d=>{ const a=d.hourly.precipitation.map(Number); return {r,mm:a.reduce((x,y)=>x+y,0)}; }).catch(()=>null)))
  .then(res=>{
    const datos = res.filter(Boolean);
    datos.forEach(o=>{ const mm=o.mm,u=o.r.umbral; const lvl=mm>=u*1.6?'hi':mm>=u?'mid':'ok';
      const col=lvl==='hi'?'#dc2626':lvl==='mid'?'#f59e0b':'#22c55e';
      L.circleMarker([o.r.lat,o.r.lon],{radius:Math.max(7,Math.min(20,6+mm)),color:'#0f172a',weight:1,fillColor:col,fillOpacity:.75})
        .bindPopup(`<b>${o.r.region}</b> (${o.r.cap})<br>Lluvia 72h: <b>${mm.toFixed(1)} mm</b> (umbral ${u})<br>Nivel: ${lvl.toUpperCase()}<br><b>Acción:</b> ${o.r.acciones.join(' · ')}`).addTo(grp);
    });
    const orden = datos.slice().sort((a,b)=>b.mm-a.mm);
    const riesgo = orden.filter(o=>o.mm>=o.r.umbral);
    let html = riesgo.length===0
      ? `<div class="al"><span class="loc">Sin regiones en riesgo hoy</span><p>Lluvia prevista bajo umbral en las 25 regiones. Vigilancia.</p></div>`
      : riesgo.slice(0,8).map(o=>`<div class="al ${o.mm>=o.r.umbral*1.6?'hi':'mid'}"><span class="loc">${o.r.region}</span><span class="pl ${o.mm>=o.r.umbral*1.6?'hi':'mid'}">${o.mm>=o.r.umbral*1.6?'ALTO':'MODERADO'}</span><p>${o.mm.toFixed(1)} mm/72h (umbral ${o.r.umbral}).</p><div class="act"><b>Acción →</b> ${o.r.acciones.join(' · ')}</div></div>`).join('');
    html += `<div class="al"><span class="loc">Vigilancia nacional</span><p>Máxima lluvia: <b>${orden[0].r.region}</b> con ${orden[0].mm.toFixed(1)} mm/72h.</p></div>`;
    alertsEl.innerHTML = html;
  }).catch(()=>{ alertsEl.innerHTML='<p class="note">Sin conexión al servicio de lluvia (Open-Meteo).</p>'; });

  /* ---------- Búsqueda ---------- */
  const qi=document.getElementById('q'), resEl=document.getElementById('res');
  function buscar(){
    const q=qi.value.trim().toUpperCase(); if(!q){ resEl.textContent=''; return; }
    const r=REGIONES.find(x=>x.region===q || x.cap.toUpperCase()===q);
    if(r){ map.setView([r.lat,r.lon],8); resEl.textContent=`${r.region} (${r.cap}) · umbral ${r.umbral} mm · ${r.acciones.join(' · ')}`; }
    else resEl.textContent='No encontrado. Prueba: Puno, Ayacucho, Amazonas, Loreto…';
  }
  qi.addEventListener('input',buscar);
  qi.addEventListener('keydown',e=>{ if(e.key==='Enter') buscar(); });

  /* ---------- Fuentes ---------- */
  const fuentesEl = document.getElementById('fuentes');
  fuentesEl.innerHTML = FUENTES.map(f=>`<a class="link" href="${f.url}" target="_blank" rel="noopener">${f.nombre}</a>`).join('');

  /* ---------- Capas ---------- */
  const tog=document.getElementById('tog');
  [['Riesgo por lluvia (en vivo)','#f97316',grp]].forEach(x=>{
    const b=document.createElement('button'); b.className='btn';
    b.innerHTML=`<b>${x[0]}</b><span style="color:${x[1]}">ON</span>`;
    b.onclick=()=>{ if(map.hasLayer(x[2])){ map.removeLayer(x[2]); const s=b.querySelector('span'); s.textContent='OFF'; s.style.color='#94a3b8'; } else { x[2].addTo(map); const s=b.querySelector('span'); s.textContent='ON'; s.style.color=x[1]; } };
    tog.appendChild(b);
  });
})();


