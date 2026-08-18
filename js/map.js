/* map.js - Mapa base y capas */
window.Mapa = (function(){
  let map, grp;
  function init(){
    map = L.map('map',{zoomControl:true}).setView([-9.5,-75],5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'© OpenStreetMap © CARTO',subdomains:'abcd',r:'@2x'}).addTo(map);
    L.control.scale({imperial:false}).addTo(map);
    grp = L.layerGroup().addTo(map);
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
  return {init,pintar,centrar,onClic,has,rm,add,getMap:()=>map};
})();
