/* ui.js - Panel lateral y tarjetas */
window.UI = (function(){
  let panel,placeCard,pT,pS,pB,pD,pA;
  function init(){
    panel=document.getElementById('panel');placeCard=document.getElementById('placeCard');
    pT=document.getElementById('pTitle');pS=document.getElementById('pSub');pB=document.getElementById('pBadge');pD=document.getElementById('pDetail');pA=document.getElementById('pAccion');
    document.getElementById('togglePanel').addEventListener('click',()=>panel.classList.toggle('closed'));
  }
  function lugar(titulo,sub,mm,umb,accion,NIV,nivelDe){
    const n=nivelDe(mm),info=NIV[n];
    pT.textContent=titulo;pS.textContent=sub;pB.textContent=info.label;pB.className='badge-lg '+n;
    pD.innerHTML=`<b>Lluvia prevista (72h):</b> ${mm.toFixed(1)} mm<br><b>Niveles:</b> verde ${umb.verde} · naranja ${umb.naranja} · rojo ${umb.rojo}`;
    pA.innerHTML=`<b>Acción preventiva →</b> ${accion}`;
    placeCard.classList.add('show');panel.classList.remove('closed');
  }
  function noResultado(){pT.textContent='No encontrado';pS.textContent='Prueba: Samegua, Chincha, Piura…';pB.className='badge-lg bajo';pB.textContent='?';panel.classList.remove('closed');}
  return {init,lugar,noResultado};
})();
