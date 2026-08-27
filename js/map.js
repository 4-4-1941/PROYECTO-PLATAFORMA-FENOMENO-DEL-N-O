/* map.js - Mapa base + capa de departamentos tocable (estilo Google Maps/Earth) */
window.Mapa = (function(){
  let map, grp, deptoLayer, onDeptoClic;
  function init(geoUrl, onDeptoClic){
    map = L.map('map',{zoomControl:true}).setView([-9.5,-75],5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'© OpenStreetMap © CARTO',subdomains:'abcd',r:'@2x'}).addTo(map);
    L.control.scale({imperial:false}).addTo(map);
    grp = L.layerGroup().addTo(map);
    onDeptoClic = onDeptoClic;
    // Capa de departamentos (polígonos reales) para tocar en el mapa
    deptoLayer = L.layerGroup();
    fetch(geoUrl).then(r=>r.json()).then(gj=>{
      L.geoJSON(gj,{
        style:{color:'#7e22ce',weight:1.4,fillColor:'#c084fc',fillOpacity:.08},
        onEachFeature:(f,l)=>{
          const nom=f.properties.nombdep||f.properties.ccdd||'';
          l.bindPopup(`<b>${nom}</b><br><small>Departamento · ccdd ${f.properties.ccdd||''}</small>`);
          l.on('click',()=>{
            const b=l.getBounds();
            map.fitBounds(b,{padding:[40,40],maxZoom:9});
            if(onDeptoClic) onDeptoClic(nom);
          });
        }
      }).addTo(deptoLayer);
      deptoLayer.addTo(map);
    }).catch(()=>{});
    return map;
  }
  function pintar(datos,NIV,nivelDe){
    grp.clearLayers();
    datos.forEach(o=>{const n=nivelDe(o.mm),info=NIV[n];
      L.circleMarker([o.r[2],o.r[3]],{radius:Math.max(8,Math.min(22,7+o.mm)),color:'#0f172a',weight:1,fillColor:info.col,fillOpacity:.8}).addTo(grp)
        .bindPopup(`<b>${o.r[0]}</b><br>Lluvia 72h: <b>${o.mm.toFixed(1)} mm</b><br>Nivel: ${info.label}`);});
  }
  function centrar(lat,lon,z){map.setView([lat,lon],z||8);}
  function onClic(fn){map.on('click',fn);}
  function has(l){return map.hasLayer(l);}
  function rm(l){map.removeLayer(l);} function add(l){l.addTo(map);}
  function getMap(){return map;}
  function zoomDepto(nom){
    let found=false;
    deptoLayer.eachLayer(l=>{if(!found&&l.feature&&(l.feature.properties.nombdep===nom)){map.fitBounds(l.getBounds(),{padding:[40,40],maxZoom:9});found=true;}});
  }
  return {init,pintar,centrar,onClic,has,rm,add,getMap,zoomDepto};
})();
      
