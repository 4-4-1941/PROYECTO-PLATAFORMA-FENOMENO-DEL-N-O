/* =========================================================
   ANTICIPACIÓN EL NIÑO · data.js
   Catálogo nacional de regiones + fuentes oficiales.
   Expone los datos de forma explícita (window.DATA) para que
   app.js los lea de forma robusta, sin depender de la
   semántica de variables entre scripts.
   ========================================================= */
(function(g){
  const REGIONES = [
    { region:'AMAZONAS',   cap:'Chachapoyas',       lat:-6.23, lon:-77.87, umbral:40, acciones:['Avisar a comunidades andino-amazónicas','Monitorear quebradas y ríos'] },
    { region:'ANCASH',     cap:'Huaraz',            lat:-9.53, lon:-77.53, umbral:25, acciones:['Monitorear quebradas activas','Evacuar márgenes de ríos'] },
    { region:'APURIMAC',   cap:'Abancay',           lat:-13.64,lon:-72.88, umbral:25, acciones:['Vigilar quebradas andinas','Avisar a caseríos de laderas'] },
    { region:'AREQUIPA',   cap:'Arequipa',          lat:-16.40,lon:-71.54, umbral:15, acciones:['Alertar poblados en quebradas de costa','Vigilar cauces torrenciales'] },
    { region:'AYACUCHO',   cap:'Ayacucho',          lat:-13.16,lon:-74.22, umbral:25, acciones:['Alertar por huaicos en quebradas','Evacuar cauces activos'] },
    { region:'CAJAMARCA',  cap:'Cajamarca',         lat:-7.16, lon:-78.51, umbral:40, acciones:['Alertar por deslizamientos en sierra norte','Vigilar quebradas'] },
    { region:'CALLAO',     cap:'Callao',            lat:-12.07,lon:-77.14, umbral:20, acciones:['Vigilar puntos de inundación urbana','Preparar brigadas vecinales'] },
    { region:'CUSCO',      cap:'Cusco',             lat:-13.53,lon:-71.97, umbral:30, acciones:['Avisar poblados en laderas','Vigilar deslizamientos en quebradas'] },
    { region:'HUANCAVELICA',cap:'Huancavelica',     lat:-12.79,lon:-74.97, umbral:25, acciones:['Vigilar quebradas andinas','Avisar caseríos de laderas'] },
    { region:'HUANUCO',    cap:'Huánuco',           lat:-9.93, lon:-76.24, umbral:30, acciones:['Alertar por deslizamientos en selva alta','Vigilar ríos'] },
    { region:'ICA',        cap:'Ica',               lat:-14.07,lon:-75.73, umbral:12, acciones:['Proteger zonas agrícolas','Avisar comunidades cerca de cauces secos'] },
    { region:'JUNIN',      cap:'Huancayo',          lat:-12.07,lon:-75.21, umbral:30, acciones:['Monitorear ríos de sierra y selva alta','Alertar zonas de deslizamiento'] },
    { region:'LA LIBERTAD',cap:'Trujillo',          lat:-8.11, lon:-79.02, umbral:30, acciones:['Avisar poblados en quebradas altas','Coordinar refugios urbanos'] },
    { region:'LAMBAYEQUE', cap:'Chiclayo',          lat:-6.77, lon:-79.84, umbral:30, acciones:['Descolmatar canales y drenajes','Avisar a mercados y zonas bajas'] },
    { region:'LIMA',       cap:'Lima',              lat:-12.05,lon:-77.04, umbral:20, acciones:['Avisar a poblados en quebradas de cuenca','Limpiar cauces'] },
    { region:'LORETO',     cap:'Iquitos',           lat:-3.75, lon:-73.25, umbral:50, acciones:['Monitorear crecida de ríos amazónicos','Preparar evacuación ribereña'] },
    { region:'MADRE DE DIOS',cap:'Puerto Maldonado',lat:-12.59,lon:-69.19, umbral:45, acciones:['Monitorear ríos','Alertar comunidades ribereñas'] },
    { region:'MOQUEGUA',   cap:'Moquegua',          lat:-17.19,lon:-70.93, umbral:12, acciones:['Vigilar quebradas costeras','Avisar a comunidades del valle'] },
    { region:'PASCO',      cap:'Cerro de Pasco',    lat:-10.68,lon:-76.26, umbral:25, acciones:['Vigilar quebradas y socavones','Alertar zonas de altura'] },
    { region:'PIURA',      cap:'Piura',             lat:-5.19, lon:-80.63, umbral:30, acciones:['Alertar barrios ribereños del río Piura','Descolmatar drenajes','Activar comités de defensa civil'] },
    { region:'PUNO',       cap:'Puno',              lat:-15.84,lon:-70.03, umbral:25, acciones:['Vigilar nivel del lago y ríos del altiplano','Alertar ribereños del Titicaca'] },
    { region:'SAN MARTIN', cap:'Moyobamba',         lat:-6.03, lon:-76.97, umbral:45, acciones:['Vigilar ríos de selva alta','Avisar a comunidades ribereñas'] },
    { region:'TACNA',      cap:'Tacna',             lat:-18.01,lon:-70.25, umbral:12, acciones:['Monitorear cauces secos','Avisar a comunidades del valle'] },
    { region:'TUMBES',     cap:'Tumbes',            lat:-3.57, lon:-80.45, umbral:25, acciones:['Avisar ribereños del río Tumbes','Preparar refugios','Limpiar drenajes'] },
    { region:'UCAYALI',    cap:'Pucallpa',          lat:-8.38, lon:-74.53, umbral:50, acciones:['Vigilar ríos amazónicos','Avisar a comunidades ribereñas'] }
  ];
  const FUENTES = [
    { nombre:'ENFEN · Comunicados operativos El Niño',  url:'https://enfen.imarpe.gob.pe/' },
    { nombre:'SENAMHI · Datos hidrometeorológicos',     url:'https://www.senamhi.gob.pe/site/descarga-datos/' },
    { nombre:'CENEPRED · SIGRID (peligros)',            url:'https://sigrid.cenepred.gob.pe/sigridv3/' },
    { nombre:'INDECI · Zonas a alto peligro',           url:'https://portal.indeci.gob.pe/fondes/zonas-expuestas-a-alto-peligro/' },
    { nombre:'NOAA · Índice ONI (El Niño/La Niña)',     url:'https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_v5.php' },
    { nombre:'CHIRPS · Lluvia satelital (libre)',       url:'https://www.chc.ucsb.edu/data/chirps' },
    { nombre:'GloFAS · Inundaciones fluviales',         url:'https://global-flood.emergency.copernicus.eu/' },
    { nombre:'INEI · Población y territorio',           url:'https://m.inei.gob.pe/' }
  ];
  g.DATA = { REGIONES, FUENTES };
  g.REGIONES = REGIONES;
  g.FUENTES = FUENTES;
})(typeof window !== 'undefined' ? window : globalThis);

