/* search.js - Búsqueda jerárquica tipo árbol INEI (depto -> prov -> distrito) */
window.Search = (function(){
  let DISTRITOS,PROVINCIAS,REGIONES,norm,irDistrito,irProvincia,irRegion,sugEl,qi,expandido,ARBOL;
  function init(opts){DISTRITOS=opts.distritos;PROVINCIAS=opts.provincias;REGIONES=opts.regiones;norm=opts.norm;irDistrito=opts.irDistrito;irProvincia=opts.irProvincia;irRegion=opts.irRegion;sugEl=opts.sugEl;qi=opts.qi;ARBOL=construir();expandido=null;
    qi.addEventListener('input',sugerir);qi.addEventListener('keydown',e=>{if(e.key==='Enter'){buscar();ocultar();}});
    document.addEventListener('click',e=>{if(!e.target.closest('#searchBox'))ocultar();});}
  function construir(){const a={};DISTRITOS.forEach(d=>{const dep=d.departamento,prov=d.provincia;if(!a[dep])a[dep]={};if(!a[dep][prov])a[dep][prov]=[];a[dep][prov].push(d);});return a;}
  function ocultar(){sugEl.classList.remove('show');}
  function renderArbol(q){const deps=Object.keys(ARBOL).filter(d=>norm(d).includes(q)||d.includes(q)).sort();let html='';deps.forEach(dep=>{html+='<div class="gc-item" data-a="dep" data-dep="'+dep+'"><b>🏙️ '+dep+'</b> <small>Departamento · toca ▸</small></div>';if(expandido&&expandido.dep===dep){Object.keys(ARBOL[dep]).sort().forEach(prov=>{const ds=ARBOL[dep][prov];html+='<div class="gc-item" style="padding-left:24px" data-a="prov" data-dep="'+dep+'" data-prov="'+prov+'"><b>▸ '+prov+'</b> <small>'+ds.length+' distritos ▸</small></div>';if(expandido.prov===prov){ds.forEach(d=>{if(d.latitud!=null)html+='<div class="gc-item" style="padding-left:44px" data-a="dist" data-d="'+encodeURIComponent(JSON.stringify(d))+'"><b>• '+d.distrito+'</b> <small>UBIGEO '+d.ubigeo_distrito+'</small></div>';});}});}});return html;}
  function bind(){sugEl.querySelectorAll('.gc-item').forEach(el=>el.addEventListener('click',()=>{const a=el.dataset.a;
    if(a==='dep'){expandido={dep:el.dataset.dep,prov:null};sugEl.innerHTML=renderArbol(norm(qi.value));bind();}
    else if(a==='prov'){expandido={dep:el.dataset.dep,prov:el.dataset.prov};sugEl.innerHTML=renderArbol(norm(qi.value));bind();}
    else if(a==='dist'){irDistrito(JSON.parse(decodeURIComponent(el.dataset.d)));ocultar();}}));}
  function sugerir(){const q=norm(qi.value);if(q.length<1){ocultar();return;}if(sugEl.dataset.q&&sugEl.dataset.q!==q)expandido=null;sugEl.dataset.q=q;const html=renderArbol(q);if(!html){ocultar();return;}sugEl.innerHTML=html;sugEl.classList.add('show');bind();}
  function buscar(){const q=norm(qi.value);if(!q)return;let d=DISTRITOS.find(x=>norm(x.distrito)===q||norm(x.provincia)===q);if(d){irDistrito(d);return;}let p=PROVINCIAS.find(x=>norm(x.provincia)===q);if(p){irProvincia(p);return;}let r=REGIONES.find(x=>norm(x[0])===q||norm(x[1])===q);if(r){irRegion(r);return;}window.UI&&UI.noResultado&&UI.noResultado();}
  return {init};
})();
