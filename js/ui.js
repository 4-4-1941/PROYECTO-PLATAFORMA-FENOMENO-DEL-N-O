/* ui.js - Panel lateral deslizable: detalle de lugar + jerarquía dep->prov->distrito */
window.UI = (function(){
  let panel,placeCard,pT,pS,pB,pD,pA, jerEl;
  function init(){
    panel=document.getElementById('panel');placeCard=document.getElementById('placeCard');
    pT=document.getElementById('pTitle');pS=document.getElementById('pSub');pB=document.getElementById('pBadge');pD=document.getElementById('pDetail');pA=document.getElementById('pAccion');
    jerEl=document.getElementById('jerarquia');
    document.getElementById('togglePanel').addEventListener('click',()=>panel.classList.toggle('closed'));
  }
  function lugar(titulo,sub,mm,umb,accion,NIV,nivelDe){
    const n=nivelDe(mm),info=NIV[n];
    pT.textContent=titulo;pS.textContent=sub;pB.textContent=info.label;pB.className='badge-lg '+n;
    pD.innerHTML=`<b>Lluvia prevista (72h):</b> ${mm.toFixed(1)} mm<br><b>Niveles:</b> verde ${umb.verde} · naranja ${umb.naranja} · rojo ${umb.rojo}`;
    pA.innerHTML=`<b>Acción preventiva →</b> ${accion}`;
    placeCard.classList.add('show');panel.classList.remove('closed');
  }
  // Panel jerárquico dep -> prov -> distrito (con ubigeo), deslizable
  function mostrarJerarquia(nom, provs, dists, riesgoMap, r, NIV, nivelDe, CFG){
    if(jerEl) jerEl.style.display='block';
    const reg=riesgoMap[nom]; const mm=reg?reg.mm:0;
    pT.textContent=nom; pS.textContent=`Departamento (ccdd) · lluvia local`;
    pB.textContent=reg?(NIV[nivelDe(mm)].label):'—'; pB.className='badge-lg '+(reg?nivelDe(mm):'bajo');
    pD.innerHTML=`<b>Lluvia prevista (72h):</b> ${mm.toFixed(1)} mm · <b>${provs.length} provincias · ${dists.length} distritos</b>`;
    pA.innerHTML=`<b>Explora abajo:</b> toca una provincia para ver sus distritos.`;
    // Lista de provincias expandibles
    let html='<div class="jer-title">📍 Provincias de '+nom+'</div>';
    provs.slice().sort((a,b)=>a.provincia.localeCompare(b.provincia)).forEach(p=>{
      const ds=dists.filter(d=>d.provincia===p.provincia);
      html+=`<div class="jer-item" data-prov="${p.provincia}"><b>▸ ${p.provincia}</b> <small>${ds.length} distritos</small><div class="jer-sub" style="display:none">`+
        ds.slice().sort((a,b)=>a.distrito.localeCompare(b.distrito)).map(d=>`<div class="jer-dist" data-lat="${d.latitud}" data-lon="${d.longitud}" data-nom="${d.distrito}" data-ub="${d.ubigeo_distrito}">• ${d.distrito} <small>UBIGEO ${d.ubigeo_distrito}</small></div>`).join('')+
        `</div></div>`;
    });
    if(jerEl) jerEl.innerHTML=html;
    placeCard.classList.add('show'); panel.classList.remove('closed');
    // Expandir provincia al tocar
    jerEl.querySelectorAll('.jer-item').forEach(item=>{
      item.querySelector('.jer-item > b, .jer-item').addEventListener('click',()=>{
        const sub=item.querySelector('.jer-sub');
        sub.style.display = sub.style.display==='none'?'block':'none';
      });
    });
    // Ir a distrito al tocar
    jerEl.querySelectorAll('.jer-dist').forEach(dist=>{
      dist.addEventListener('click',()=>{
        if(window.Mapa) Mapa.centrar(parseFloat(dist.dataset.lat),parseFloat(dist.dataset.lon),13);
        pS.textContent=`${dist.dataset.nom} · UBIGEO ${dist.dataset.ub}`;
      });
    });
  }
  function noResultado(){pT.textContent='No encontrado';pS.textContent='Prueba: Samegua, Chincha, Piura…';pB.className='badge-lg bajo';pB.textContent='?';panel.classList.remove('closed');}
  return {init,lugar,mostrarJerarquia,noResultado};
})();

    
