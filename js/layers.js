/* layers.js - Capas analíticas (radar de lluvia + mapa de calor de riesgo) */
window.Layers = (function(){
  let map, radarLayer=null, heatLayer=null, radarOn=false, heatOn=false, heatLoading=false;

  function init(m){
    map=m;
    addControls();
    // 25 capitales desde datos globales INEI (departamento.js)
    const deps=window.DEPARTAMENTOS_DATA||[];
    CAPS=deps.map(d=>[d.departamento,d.latitud,d.longitud]);
  }

  // ---- Radar de lluvia (RainViewer, sin clave) ----
  function toggleRadar(){
    if(radarOn){ if(radarLayer){map.removeLayer(radarLayer);radarLayer=null;} radarOn=false; setLbl('radarBtn','Radar lluvia'); return; }
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>{
        const tiles=d.radar.past.concat(d.radar.nowcast||[]);
        const t=tiles[tiles.length-1]||{path:''};
        const url='https://tilecache.rainviewer.com'+t.path+'/256/{z}/{x}/{y}/2/1_1.png';
        if(radarLayer){map.removeLayer(radarLayer);}
        radarLayer=L.tileLayer(url,{opacity:.6,maxZoom:12}).addTo(map);
        radarOn=true; setLbl('radarBtn','Radar ON');
      }).catch(()=>setLbl('radarBtn','Radar: sin datos'));
  }

  // ---- Mapa de calor de riesgo (Leaflet.heat) por lluvia 72h ----
  function toggleHeat(){
    if(!CAPS){setLbl('heatBtn','Sin coords');return;}
    if(heatLoading)return;
    if(heatOn){ if(heatLayer){map.removeLayer(heatLayer);heatLayer=null;} heatOn=false; setLbl('heatBtn','Capa de riesgo'); return; }
    heatOn=true; heatLoading=true; setLbl('heatBtn','Cargando riesgo…');
    const pts=[],done={n:0};
    CAPS.forEach(c=>{
      fetch('https://api.open-meteo.com/v1/forecast?latitude='+c[1]+'&longitude='+c[2]+'&hourly=precipitation&timezone=auto&forecast_days=3')
        .then(r=>r.ok?r.json():Promise.reject())
        .then(d=>{const p=((d.hourly&&d.hourly.precipitation)||[]).map(Number);pts.push([c[1],c[2],Math.min(1,p.reduce((a,b)=>a+b,0)/50)]);})
        .catch(()=>{})
        .then(()=>{done.n++;if(done.n===CAPS.length&&heatOn){
          if(heatLayer)map.removeLayer(heatLayer);
          heatLayer=L.heatLayer(pts,{radius:35,blur:25,maxZoom:9,minOpacity:.4,gradient:{0.0:'#22c55e',0.33:'#f59e0b',0.66:'#ef4444'}}).addTo(map);
          heatLoading=false;setLbl('heatBtn','Riesgo ON');
        }});
    });
  }

  function setLbl(id,t){const b=document.getElementById(id);if(b)b.textContent=t;}
  function ctlBtn(id,label,fn){
    const div=L.DomUtil.create('div','leaflet-bar');
    div.innerHTML='<a id="'+id+'" href="#" role="button" title="'+label+'">'+label+'</a>';
    div.firstChild.style.cssText='display:block;padding:8px 12px;background:#fff;color:#0f172a;font-weight:700;font-size:.85rem;border-radius:6px;box-shadow:0 2px 8px rgba(15,23,42,.2);text-decoration:none;';
    L.DomEvent.on(div.firstChild,'click',function(e){L.DomEvent.stop(e);fn();});
    return div;
  }
  function addControls(){
    if(window.L&&L.control){
      const c1=L.control({position:'bottomleft'});c1.onAdd=()=>ctlBtn('radarBtn','Radar lluvia',toggleRadar);c1.addTo(map);
      const c2=L.control({position:'bottomleft'});c2.onAdd=()=>ctlBtn('heatBtn','Capa de riesgo',toggleHeat);c2.addTo(map);
    }
  }

  // auto-arranque: el mapa ya existe (cargado tras app.js)
  if(window.Mapa&&Mapa.getMap&&Mapa.getMap()){ init(Mapa.getMap()); }

  return {init};
})();


