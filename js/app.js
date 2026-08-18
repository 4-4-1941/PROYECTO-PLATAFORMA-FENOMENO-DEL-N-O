/* app.js - Orquestador principal */
(function(){
  const DISTRITOS=window.DISTRITOS_DATA||[],PROVINCIAS=window.PROVINCIAS_DATA||[];
  const $=id=>document.getElementById(id);
  const CFG={refreshMin:15,umbrales:{verde:20,naranja:35,rojo:50}};
  const REGIONES=[['AMAZONAS','Chachapoyas',-6.23,-77.87,'Monitorear quebradas','Avisar comunidades','Evacuar cauces'],['ANCASH','Huaraz',-9.53,-77.53,'Monitorear quebradas','Evacuar márgenes','Activar comités'],['APURIMAC','Abancay',-13.64,-72.88,'Vigilar quebradas','Avisar caseríos','Evacuar laderas'],['AREQUIPA','Arequipa',-16.40,-71.54,'Vigilar cauces torrenciales','Alertar quebradas','Evacuar zonas bajas'],['AYACUCHO','Ayacucho',-13.16,-74.22,'Vigilar quebradas','Alertar huaicos','Evacuar cauces'],['CAJAMARCA','Cajamarca',-7.16,-78.51,'Vigilar quebradas','Alertar deslizamientos','Activar albergues'],['CALLAO','Callao',-12.07,-77.14,'Vigilar inundación','Preparar brigadas','Evacuar zonas inundables'],['CUSCO','Cusco',-13.53,-71.97,'Vigilar laderas','Alertar deslizamientos','Evacuar laderas'],['HUANCAVELICA','Huancavelica',-12.79,-74.97,'Vigilar quebradas','Avisar caseríos','Evacuar laderas'],['HUANUCO','Huánuco',-9.93,-76.24,'Vigilar ríos','Alertar deslizamientos','Evacuar riberas'],['ICA','Ica',-14.07,-75.73,'Vigilar cauces secos','Alertar agrícola','Evacuar cauces'],['JUNIN','Huancayo',-12.07,-75.21,'Vigilar ríos','Alertar deslizamientos','Evacuar zonas bajas'],['LA LIBERTAD','Trujillo',-8.11,-79.02,'Vigilar quebradas','Alertar poblados','Coordinar refugios'],['LAMBAYEQUE','Chiclayo',-6.77,-79.84,'Descolmatar canales','Alertar mercados','Evacuar zonas anegables'],['LIMA','Lima',-12.05,-77.04,'Vigilar quebradas','Alertar poblados','Limpiar cauces'],['LORETO','Iquitos',-3.75,-73.25,'Monitorear ríos amazónicos','Alertar riberas','Preparar evacuación'],['MADRE DE DIOS','Puerto Maldonado',-12.59,-69.19,'Monitorear ríos','Alertar comunidades','Evacuar riberas'],['MOQUEGUA','Moquegua',-17.19,-70.93,'Vigilar quebradas costeras','Alertar valles','Evacuar zonas bajas'],['PASCO','Cerro de Pasco',-10.68,-76.26,'Vigilar quebradas','Alertar altura','Evacuar laderas'],['PIURA','Piura',-5.19,-80.63,'Descolmatar drenajes','Alertar ribereños','Evacuar márgenes del río'],['PUNO','Puno',-15.84,-70.03,'Vigilar lago y ríos','Alertar ribereños','Evacuar riberas'],['SAN MARTIN','Moyobamba',-6.03,-76.97,'Vigilar ríos selva','Alertar comunidades','Evacuar riberas'],['TACNA','Tacna',-18.01,-70.25,'Vigilar cauces secos','Alertar valles','Evacuar zonas bajas'],['TUMBES','Tumbes',-3.57,-80.45,'Limpiar drenajes','Alertar ribereños','Preparar refugios'],['UCAYALI','Pucallpa',-8.38,-74.53,'Vigilar ríos amazónicos','Alertar comunidades','Preparar evacuación']];
  const NIV={rojo:{label:'ROJO',col:'#dc2626',idx:3,actIdx:2},naranja:{label:'NARANJA',col:'#f59e0b',idx:2,actIdx:1},verde:{label:'VERDE',col:'#22c55e',idx:1,actIdx:0},bajo:{label:'BAJO',col:'#94a3b8',idx:0,actIdx:0}};
  const norm=s=>s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9 ]/g,'').trim();
  function nivelDe(mm){return mm>=CFG.umbrales.rojo?'rojo':mm>=CFG.umbrales.naranja?'naranja':mm>=CFG.umbrales.verde?'verde':'bajo';}
  const riesgoMap={};
  function onDatos(datos,nota){Mapa.pintar(datos,NIV,nivelDe);Alerts.render(datos,NIV,nivelDe,nota);datos.forEach(o=>riesgoMap[o.r[0]]=o);}
  function irDistrito(d){if(d&&d.latitud!=null){Mapa.centrar(d.latitud,d.longitud,12);const reg=REGIONES.find(r=>r[0]===d.departamento);const o=reg&&riesgoMap[reg[0]];const mm=o?o.mm:0;const acc=reg?(reg.slice(4)[NIV[nivelDe(mm)].actIdx]||reg[4]):'Vigilancia preventiva.';UI.lugar(d.distrito,`Distrito de ${d.provincia}, ${d.departamento} · UBIGEO ${d.ubigeo_distrito}`,mm,CFG.umbrales,acc,NIV,nivelDe);}}
  function irProvincia(p){Mapa.centrar(p.latitud,p.longitud,10);const o=riesgoMap[p.departamento];const mm=o?o.mm:0;const acc=o?o.r[4]:'Vigilancia preventiva.';UI.lugar(p.provincia,`Provincia de ${p.departamento}`,mm,CFG.umbrales,acc,NIV,nivelDe);}
  function irRegion(r){Mapa.centrar(r[2],r[3],7);const o=riesgoMap[r[0]];const mm=o?o.mm:0;UI.lugar(r[0],`Región (${r[1]})`,mm,CFG.umbrales,r.slice(4)[NIV[nivelDe(mm)].actIdx]||r[4],NIV,nivelDe);}
  // Al tocar un departamento en el mapa: centrar + mostrar detalle
  function irDepartamento(nom){
    const r=REGIONES.find(x=>x[0]===nom);
    const provs=PROVINCIAS.filter(p=>p.departamento===nom);
    const dists=DISTRITOS.filter(d=>d.departamento===nom);
    UI.mostrarJerarquia(nom,provs,dists,riesgoMap,r,NIV,nivelDe,CFG);
  }
  Mapa.init('geo/departamentos.geojson', irDepartamento);
  Oni.init('oni');
  Alerts.init('alerts');
  UI.init();
  Weather.init(REGIONES,CFG,NIV,nivelDe,onDatos);
  Weather.cargar();
  setInterval(Weather.cargar,CFG.refreshMin*60*1000);
  Search.init({distritos:DISTRITOS,provincias:PROVINCIAS,regiones:REGIONES,norm,irDistrito,irProvincia,irRegion,sugEl:$('sug'),qi:$('q')});
  $('fuentes').innerHTML=[['ENFEN','https://enfen.imarpe.gob.pe/'],['SENAMHI','https://www.senamhi.gob.pe/site/descarga-datos/'],['CENEPRED','https://sigrid.cenepred.gob.pe/sigridv3/'],['INDECI','https://portal.indeci.gob.pe/fondes/zonas-expuestas-a-alto-peligro/'],['NOAA ONI','https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_v5.php'],['INEI','https://m.inei.gob.pe/'],['CHIRPS','https://www.chc.ucsb.edu/data/chirps'],['GloFAS','https://global-flood.emergency.copernicus.eu/']].map(f=>`<a class="link" href="${f[1]}" target="_blank" rel="noopener">${f[0]}</a>`).join('');
  Map.onClic(e=>{let hit=null;DISTRITOS.forEach(d=>{if(!hit&&d.latitud!=null&&Math.abs(d.latitud-e.latlng.lat)<0.1&&Math.abs(d.longitud-e.latlng.lng)<0.1)hit=d;});if(hit)irDistrito(hit);});
})();


