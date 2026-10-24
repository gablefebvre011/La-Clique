/* Ordinateur virtuel : ordinateur fictif + mission 1 (défi 1, mots de passe).
   Tout est simulé dans la page. Aucun mot de passe n'est envoyé nulle part. */
(function(){
'use strict';
var KEY='laclique_atelier_v1';
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function save(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}

/* ---------- Personnages ---------- */
var PERSONAS=[
 {pre:'Marie',nom:'Tremblay',an:1985,ville:'Sherbrooke',bete:'chat',nomBete:'Minou',mail:'marie.tremblay@exemple.ca'},
 {pre:'Marc',nom:'Gagnon',an:1992,ville:'Gatineau',bete:'chien',nomBete:'Rex',mail:'marc.gagnon@exemple.ca'},
 {pre:'Julie',nom:'Roy',an:1978,ville:'Trois-Rivières',bete:'chat',nomBete:'Tigrou',mail:'julie.roy@exemple.ca'}
];

/* ---------- Évaluateur (simulation pédagogique) ---------- */
var COMMON=['password','motdepasse','qwerty','azerty','bonjour','canada','quebec','montreal','hockey','canadiens','soleil','chocolat','admin','letmein','welcome','iloveyou','dragon','master','secret','princesse','123456','12345678','123456789','000000','111111','abc123'];
var DICT=['chat','chien','maison','soleil','lune','hiver','ete','neige','bleu','rouge','vert','jaune','noir','blanc','pomme','poutine','erable','lac','riviere','montagne','velo','auto','camion','tuque','canot','forte','fort','mon','ma','mes','le','la','les','un','une','de','du','et','moi','toi','amour','famille','travail','banque','compte','pirate','tigre','loup','ours','orignal','castor','biere','cafe','the','pain','fromage','ciel','nuit','jour','etoile'];
function strip(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function leet(s){return s.replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e').replace(/4/g,'a').replace(/5/g,'s').replace(/7/g,'t').replace(/@/g,'a').replace(/\$/g,'s')}
function evaluate(pw,p){
  var raw=strip(pw),lt=leet(raw),letters=lt.replace(/[^a-z]/g,'');
  var res=[];
  /* 1 liste courante */
  var c1=false,i;
  for(i=0;i<COMMON.length;i++){var w=COMMON[i];if(letters===w||raw===w||(letters.indexOf(w)===0&&letters.length-w.length<=3)||raw.indexOf(w)===0&&raw.length-w.length<=4){c1=true;break}}
  if(/^(\d)\1*$/.test(pw)||/^(0123456789|1234567890|abcdefghij)/.test(raw))c1=true;
  res.push({k:'Liste des mots de passe les plus courants',bad:c1,msg:c1?'Trouvé dans la liste : c’est un mot de passe très répandu.':'Absent de la liste.'});
  /* 2 infos perso */
  var toks=[p.pre,p.nom,p.ville,p.nomBete].map(function(t){return strip(t).replace(/[^a-z]/g,'')});
  var c2=false,which='';
  toks.forEach(function(t){if(!c2&&t&&(lt.replace(/[^a-z]/g,'').indexOf(t)>-1||raw.replace(/[^a-z]/g,'').indexOf(t)>-1)){c2=true;which='un prénom, un nom, une ville ou le nom de l’animal'}});
  if(!c2&&pw.indexOf(String(p.an))>-1){c2=true;which='l’année de naissance'}
  res.push({k:'Infos personnelles trouvées en ligne',bad:c2,msg:c2?'Il contient '+which+' : facile à deviner à partir de ses profils.':'Aucune info personnelle reconnue.'});
  /* 3 dictionnaire + chiffres */
  var parts=pw.replace(/([a-zà-ÿ])([A-ZÀ-Ý])/g,'$1 $2').split(/[^A-Za-zÀ-ÿ]+/).filter(Boolean).map(function(x){return leet(strip(x))});
  var allDict=parts.length>0&&parts.every(function(x){return DICT.indexOf(x)>-1});
  var c3=(parts.length<=2&&allDict)||DICT.indexOf(letters)>-1;
  if(!c3&&parts.length<=2&&parts.length>0&&parts.some(function(x){return DICT.indexOf(x)>-1})&&pw.length<14)c3=true;
  res.push({k:'Mot du dictionnaire + chiffres ou symboles',bad:c3,msg:c3?'Un mot courant avec un chiffre ou un point d’exclamation : les robots testent ça en premier.':'Pas de mot isolé évident.'});
  /* 4 force brute */
  var uniq={};pw.split('').forEach(function(ch){uniq[ch]=1});
  var nu=Object.keys(uniq).length;
  var size=0;if(/[a-zà-ÿ]/.test(pw))size+=34;if(/[A-ZÀ-Ý]/.test(pw))size+=34;if(/\d/.test(pw))size+=10;if(/[^A-Za-zÀ-ÿ\d\s]/.test(pw))size+=30;if(/\s/.test(pw))size+=1;
  var sec=Math.pow(Math.max(size,2),pw.length)/1e10;
  var c4=pw.length<14||nu<6;
  function dur(s){if(s<1)return'moins d’une seconde';if(s<60)return Math.round(s)+' secondes';if(s<3600)return Math.round(s/60)+' minutes';if(s<86400)return Math.round(s/3600)+' heures';if(s<31.5e6)return Math.round(s/86400)+' jours';var y=s/31.5e6;return y>1e6?'des millions d’années':'environ '+Math.round(y).toLocaleString('fr-CA')+' ans'}
  res.push({k:'Force brute (toutes les combinaisons)',bad:c4,msg:c4?(nu<6&&pw.length>=14?'Trop répétitif.':'Cassé en '+dur(sec)+'.'):'Il faudrait '+dur(sec)+' à ce rythme.'});
  var okn=res.filter(function(r){return!r.bad}).length;
  return{res:res,ok:okn===4,pct:Math.round(okn/4*100)};
}

/* ---------- État ---------- */
var MK=(function(){var m=/[?&]m=(\d+)/.exec(location.search);return m?+m[1]:1})();
var PL=(window.MISSIONS&&window.MISSIONS[MK])||null;if(!PL&&MK>2)MK=1;
var S=load();S.m1=S.m1||{tries:0};S.m2=S.m2||{tries:0};S['m'+MK]=S['m'+MK]||{tries:0};
function MS(){return S['m'+MK]}
var st={phase:'notion',persona:0,step:0,help:0,seen:{notes:0,browser:0,fav:0,mail:0},acc:[],inp:{},page:'start',pw:'',tried:false,lastOK:false,busy:false,exTries:0};
var wins={},zTop=10;
var say=$('aSayText'),mission=$('aMission'),screen=$('aScreen');
function setSay(t){say.textContent=t}
function P(){return PERSONAS[st.persona]}
/* ---------- Mission 2 : fuite de données et bourrage d'identifiants ---------- */
var SCEN=[
 {leak:'Boutique Vélo Plus',pw:'Sherbrooke1985',accts:[['Boutique Vélo Plus','Sherbrooke1985'],['Banque du Coin','Sherbrooke1985'],['Courriel','Sherbrooke1985'],['Club de lecture','tricot-lampe-brume-27'],['Streaming Maison','Sherbrooke1985']]},
 {leak:'Ligue de hockey en ligne',pw:'Gatineau1992!',accts:[['Ligue de hockey en ligne','Gatineau1992!'],['Banque du Coin','Gatineau1992!'],['Boutique Auto','Gatineau1993!'],['Forum jeux','cactus-brique-ondee-81'],['Messagerie','Gatineau1992!']]},
 {leak:'Recettes Québec',pw:'Tigrou1978',accts:[['Recettes Québec','Tigrou1978'],['Banque du Coin','Tigrou1978'],['Courriel','Tigrou1979'],['Épicerie en ligne','tisane-granit-vague-09'],['Messagerie','Tigrou1978']]}
];
function initAcc(){st.acc=SCEN[st.persona].accts.map(function(a){return{site:a[0],pw:a[1],orig:a[1],changed:false}});st.inp={}}
function bas(x){return strip(x).replace(/[^a-z]/g,'')}
function similar(a,b){if(strip(a)===strip(b))return true;var x=bas(a),y=bas(b);if(!x||!y)return false;if(x===y)return x.length>=4;var sh=x.length<y.length?x:y,lo=sh===x?y:x;return sh.length>=6&&lo.indexOf(sh)>-1}
function slugS(x){return strip(x).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}


/* ---------- Icônes (dessinées ici, aucune marque) ---------- */
var IC={
 browser:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#2b7de9"/><g fill="none" stroke="#fff" stroke-width="1.6" opacity=".92"><ellipse cx="16" cy="16" rx="6" ry="14"/><path d="M2.5 12h27M2.5 20h27"/></g></svg>',
 notes:'<svg viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" rx="3" fill="#fff" stroke="#9fb3c8" stroke-width="1.5"/><rect x="6" y="3" width="20" height="6" rx="3" fill="#2f8bd8"/><path d="M10 14h12M10 18h12M10 22h8" stroke="#9fb3c8" stroke-width="1.8" stroke-linecap="round"/></svg>',
 files:'<svg viewBox="0 0 32 32"><path d="M3 8a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#f4b73f"/><path d="M3 13h26v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#ffd36b"/></svg>',
 mail:'<svg viewBox="0 0 32 32"><rect x="3" y="7" width="26" height="18" rx="3" fill="#3b8fe6"/><path d="M4 9l12 9 12-9" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>',
 security:'<svg viewBox="0 0 32 32"><path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill="#2fa866"/><path d="M11 16l4 4 7-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 settings:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="9.5" fill="none" stroke="#6b7a8a" stroke-width="5" stroke-dasharray="3.4 3.4"/><circle cx="16" cy="16" r="8" fill="#8c9bab"/><circle cx="16" cy="16" r="3.6" fill="#eef2f6"/></svg>'
};
var APPS={
  notes:{t:'Bloc-notes',x:170,y:30,w:360,h:350},
  browser:{t:'Navigateur',x:70,y:40,w:540,h:400},
  settings:{t:'Paramètres',x:110,y:40,w:560,h:400},
  files:{t:'Explorateur de fichiers',x:60,y:40,w:580,h:380},
  mail:{t:'Courriel',x:90,y:30,w:620,h:420},
  security:{t:'Sécurité Windows',x:120,y:50,w:540,h:380}
};
var ORDER=['browser','files','mail','notes','security','settings'];
if(PL&&PL.extra)Object.keys(PL.extra).forEach(function(k){var e=PL.extra[k];APPS[k]={t:e.t,x:e.x||100,y:e.y||40,w:e.w||460,h:e.h||400};IC[k]=e.icon;ORDER.push(k)});
if(PL&&PL.geom)Object.keys(PL.geom).forEach(function(k){for(var q in PL.geom[k])APPS[k][q]=PL.geom[k][q]});

/* ---------- Fenêtres ---------- */
var wins={},zTop=10,focused=null;
function mobile(){return window.matchMedia('(max-width:980px)').matches}
function updateTb(){
  ORDER.forEach(function(id){
    var b=$('tb-'+id);if(!b)return;var w=wins[id];
    b.classList.toggle('run',!!w);
    b.classList.toggle('on',!!w&&focused===id&&!w.el.classList.contains('min'));
  });
}
function focusWin(id){
  focused=id;
  Object.keys(wins).forEach(function(k){wins[k].el.classList.toggle('focus',k===id)});
  if(wins[id])wins[id].el.style.zIndex=++zTop;
  updateTb();
}
function closeWin(id){if(!wins[id])return;wins[id].el.remove();delete wins[id];if(focused===id)focused=null;updateTb()}
function toggleMax(id){var w=wins[id];if(w)w.el.classList.toggle('max')}
function openApp(id){
  closeStart();
  var w=wins[id];
  if(w){
    if(w.el.classList.contains('min')){w.el.classList.remove('min');focusWin(id)}
    else if(focused===id){w.el.classList.add('min');focused=null;updateTb()}
    else focusWin(id);
    return;
  }
  var def=APPS[id],el=document.createElement('div');
  el.className='a-win';el.setAttribute('role','dialog');
  var AWN=$('aWindows'),AW=AWN.clientWidth,AH=AWN.clientHeight,ww=Math.min(def.w,AW-40),hh=Math.min(def.h,AH-24);
  el.style.width=ww+'px';el.style.height=hh+'px';
  el.style.left=Math.max(8,Math.min(def.x,AW-ww-12))+'px';el.style.top=Math.max(6,Math.min(def.y,AH-hh-8))+'px';
  el.innerHTML='<div class="a-bar">'+IC[id]+'<b></b><div class="a-wb"><button class="a-mn" aria-label="Réduire">&#8211;</button><button class="a-mx" aria-label="Agrandir">&#9633;</button><button class="a-x" aria-label="Fermer">&#10005;</button></div></div><div class="a-body"></div>';
  $('aWindows').appendChild(el);
  wins[id]={el:el,body:el.querySelector('.a-body'),title:el.querySelector('b')};
  el.addEventListener('pointerdown',function(){focusWin(id)});
  el.querySelector('.a-x').onclick=function(){closeWin(id)};
  el.querySelector('.a-mn').onclick=function(e){e.stopPropagation();el.classList.add('min');focused=null;updateTb()};
  el.querySelector('.a-mx').onclick=function(){toggleMax(id)};
  var bar=el.querySelector('.a-bar'),dx,dy,drag=false;
  bar.addEventListener('dblclick',function(e){if(!e.target.closest('.a-wb'))toggleMax(id)});
  bar.addEventListener('pointerdown',function(e){if(mobile()||el.classList.contains('max')||e.target.closest('.a-wb'))return;drag=true;dx=e.clientX-el.offsetLeft;dy=e.clientY-el.offsetTop;bar.setPointerCapture(e.pointerId)});
  bar.addEventListener('pointermove',function(e){if(!drag)return;var sw=$('aWindows');el.style.left=Math.max(-el.offsetWidth+90,Math.min(sw.clientWidth-90,e.clientX-dx))+'px';el.style.top=Math.max(0,Math.min(sw.clientHeight-40,e.clientY-dy))+'px'});
  bar.addEventListener('pointerup',function(){drag=false});
  renderApp(id);focusWin(id);
  if(PL&&PL.onOpen)PL.onOpen(id,A);
  if(id==='mail'&&!st.seen.mail){st.seen.mail=1;progress('mail')}
  if(id==='notes'&&!st.seen.notes){st.seen.notes=1;progress('notes')}
  if(id==='browser'&&!st.seen.browser){st.seen.browser=1;progress('browser')}
}
function renderApp(id){
  var w=wins[id];if(!w)return;
  if(PL&&PL.apps&&PL.apps[id]){PL.apps[id](w,A);return}
  if(PL&&(id==='notes'||id==='browser')){w.title.textContent=APPS[id].t;w.body.innerHTML='<div class="a-page"><p>Rien à voir ici pour cette mission.</p></div>';return}
  if(id==='notes')renderNotes();else if(id==='browser')renderBrowser();else if(id==='settings')renderSettings();else if(id==='files')renderFiles();else if(id==='mail')renderMail();else if(id==='security')renderSecurity();
}

/* ---------- Bloc-notes ---------- */
function renderNotes(){
  var w=wins.notes;if(!w)return;var p=P();
  if(MK===2){
    w.title.textContent='mes-mots-de-passe.txt \u2013 Bloc-notes';
    var t2=['Mes mots de passe','',].concat(SCEN[st.persona].accts.map(function(a){return a[0]+' : '+a[1]})).concat(['','(oui, je sais, ça se ressemble pas mal...)']).join('\n');
    w.body.innerHTML='<div class="a-np"><div class="a-np-m"><span>Fichier</span><span>Modifier</span><span>Affichage</span></div><div class="a-np-t">'+esc(t2)+'</div><div class="a-np-s">Ln 1, Col 1 \u00a0\u00b7\u00a0 UTF-8</div></div>';
    return;
  }
  w.title.textContent=p.pre+' '+p.nom+'.txt – Bloc-notes';
  var txt=['Infos de '+p.pre+' '+p.nom,'','Prénom : '+p.pre,'Nom : '+p.nom,'Née/né en : '+p.an,'Ville : '+p.ville,(p.bete==='chat'?'Son chat : ':'Son chien : ')+p.nomBete,'Courriel : '+p.mail,'','(Des infos que n’importe qui peut trouver','sur ses réseaux sociaux.)'].join('\n');
  w.body.innerHTML='<div class="a-np"><div class="a-np-m"><span>Fichier</span><span>Modifier</span><span>Affichage</span></div><div class="a-np-t">'+esc(txt)+'</div><div class="a-np-s">Ln 1, Col 1  ·  UTF-8</div></div>';
}

/* ---------- Paramètres ---------- */
var setPage='Système',tg={cam:true,mic:true,loc:false},upd='ok';
function renderSettings(){
  var w=wins.settings;if(!w)return;
  w.title.textContent='Paramètres';
  var pages=['Système','Réseau','Comptes','Confidentialité','Mises à jour'],h='<div class="a-set"><nav>'+pages.map(function(n){return'<button data-p="'+n+'" class="'+(n===setPage?'on':'')+'">'+n+'</button>'}).join('')+'</nav><main><h3>'+setPage+'</h3>';
  function row(a,b,r){return'<div class="row"><div>'+a+(b?'<small>'+b+'</small>':'')+'</div>'+(r||'')+'</div>'}
  function tgl(k){return'<span class="a-tg'+(tg[k]?' on':'')+'" data-t="'+k+'" role="switch" aria-checked="'+tg[k]+'" tabindex="0"></span>'}
  if(setPage==='Système')h+=row('PC-MARIE','Ordinateur fictif · système simulé')+row('Mémoire','8 Go')+row('Stockage','256 Go · 61 % utilisé');
  else if(setPage==='Réseau')h+=row('Wi-Fi','Maison-Tremblay · connecté · sécurité WPA2','<span>✓</span>')+row('Réseau privé','Appareils de la maison seulement');
  else if(setPage==='Comptes')h+=row(esc(P().pre)+' '+esc(P().nom),'Compte local')+row('Options de connexion','Mot de passe, code PIN','<button class="btn" disabled>Modifier</button>');
  else if(setPage==='Confidentialité')h+=row('Accès à la caméra','Les applications peuvent utiliser la caméra',tgl('cam'))+row('Accès au micro','Les applications peuvent utiliser le micro',tgl('mic'))+row('Localisation','Les applications peuvent connaître ta position',tgl('loc'));
  else h+=row(upd==='ok'?'Tu es à jour':(upd==='busy'?'Recherche en cours…':'Tu es à jour'),upd==='ok'?'Dernière vérification : aujourd’hui':'','<button class="btn" id="bUpd"'+(upd==='busy'?' disabled':'')+'>Rechercher des mises à jour</button>');
  h+='</main></div>';
  w.body.innerHTML=h;
  w.body.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){setPage=b.getAttribute('data-p');renderSettings()}});
  w.body.querySelectorAll('.a-tg').forEach(function(t){t.onclick=function(){var k=t.getAttribute('data-t');tg[k]=!tg[k];renderSettings()}});
  var u=$('bUpd');if(u)u.onclick=function(){upd='busy';renderSettings();setTimeout(function(){upd='ok';renderSettings()},1200)};
}


/* ---------- Explorateur de fichiers ---------- */
var FILES={
 'Bureau':[['Raccourci Navigateur.lnk','Raccourci','1 Ko','hier']],
 'Documents':[['CV-2026.docx','Document Word','48 Ko','2 oct.'],['Budget.xlsx','Feuille Excel','22 Ko','28 sept.'],['Notes-banque.txt','Document texte','1 Ko','hier']],
 'Téléchargements':[['facture-octobre.pdf.exe','Application','2 840 Ko','aujourd’hui'],['photo-vacances.jpg','Image JPEG','1 920 Ko','3 oct.'],['lecteur-video-gratuit.exe','Application','5 310 Ko','aujourd’hui'],['releve-septembre.pdf','Document PDF','310 Ko','1 oct.']],
 'Images':[['chat.jpg','Image JPEG','1 100 Ko','12 sept.'],['famille.png','Image PNG','2 400 Ko','5 août']]
};
var fx={path:'Téléchargements',sel:null,ext:false};
function fileIcon(n){var e=n.split('.').pop().toLowerCase();var c={exe:'#d9534f',pdf:'#e04b3c',docx:'#2b7de9',xlsx:'#2fa866',txt:'#8a97a4',jpg:'#7e57c2',png:'#7e57c2',lnk:'#8a97a4'}[e]||'#8a97a4';return'<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 2h9l5 5v15H5z" fill="'+c+'"/><path d="M14 2v5h5" fill="#fff" opacity=".5"/></svg>'}
function shownName(n){if(fx.ext)return n;var i=n.lastIndexOf('.');return i>0?n.slice(0,i):n}
function renderFiles(){
  var w=wins.files;if(!w)return;
  w.title.textContent=fx.path+' – Explorateur de fichiers';
  var h='<div class="a-fx"><div class="a-fx-bar"><span class="a-fx-path">Ce PC › '+esc(fx.path)+'</span><label class="a-fx-opt"><input type="checkbox" id="fxExt"'+(fx.ext?' checked':'')+'> Extensions de noms de fichiers</label></div><div class="a-fx-main"><nav>';
  Object.keys(FILES).forEach(function(k){h+='<button data-p="'+esc(k)+'" class="'+(k===fx.path?'on':'')+'">📁 '+esc(k)+'</button>'});
  h+='</nav><div class="a-fx-list"><div class="a-fx-h"><span>Nom</span><span>Modifié</span><span>Taille</span></div>';
  FILES[fx.path].forEach(function(f,i){h+='<button class="a-fx-r'+(fx.sel===i?' on':'')+'" data-i="'+i+'"><span>'+fileIcon(f[0])+' '+esc(shownName(f[0]))+'</span><span>'+f[3]+'</span><span>'+f[2]+'</span></button>'});
  h+='</div></div><div class="a-fx-s">'+(fx.sel!=null?'Type : '+FILES[fx.path][fx.sel][1]:FILES[fx.path].length+' éléments')+'</div></div>';
  w.body.innerHTML=h;
  w.body.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){fx.path=b.getAttribute('data-p');fx.sel=null;renderFiles()}});
  w.body.querySelectorAll('.a-fx-r').forEach(function(b){b.onclick=function(){fx.sel=+b.getAttribute('data-i');renderFiles()}});
  $('fxExt').onchange=function(){fx.ext=this.checked;renderFiles()};
}

/* ---------- Courriel ---------- */
function mails(){var p=P();
 if(PL&&PL.mails)return PL.mails(A);
 if(PL)return[];
 if(MK===2){var lk=SCEN[st.persona].leak;return[
  {n:lk,a:'securite@'+slugS(lk)+'.example',s:'Incident de sécurité : change ton mot de passe',d:'aujourd\u2019hui',b:'Bonjour '+p.pre+',\n\nNous avons subi une fuite de données. Des adresses courriel et des mots de passe de clients ont été volés, dont le tien.\n\nSi tu utilises ce mot de passe sur d\u2019autres sites, change-le partout dès maintenant.',l:null},
  {n:'Louise Tremblay',a:'louise.tremblay@exemple.ca',s:'Souper dimanche ?',d:'hier',b:'Salut '+p.pre+' !\n\nTu es libre dimanche pour souper chez moi ? Dis-moi si tu apportes un dessert.',l:null},
  {n:'Épicerie Express',a:'commandes@epicerie-express.example',s:'Ta commande est prête',d:'2 oct.',b:'Ta commande est prête à être récupérée en magasin.',l:null}
 ]}
 return[
 {n:'Banque du Coin',a:'service@banque-du-coin.example',s:'Ton relevé de septembre est disponible',d:'1 oct.',b:'Bonjour '+p.pre+',\n\nTon relevé de septembre est prêt. Tu peux le consulter dans ton espace client.',l:['Voir mon relevé','https://banque-du-coin.example/releve']},
 {n:'Banque du Coin Sécurité',a:'alerte@banque-du-coin-securite.example',s:'URGENT : compte suspendu, agis dans 24 h',d:'aujourd’hui',b:'Cher client,\n\nNous avons détecté une activité inhabituelle. Ton compte sera fermé dans 24 heures si tu ne confirmes pas ton identité.',l:['https://banque-du-coin.example/verification','https://banque-du-coin-verif.example/connexion']},
 {n:'Louise Tremblay',a:'louise.tremblay@exemple.ca',s:'Photos du party',d:'3 oct.',b:'Salut '+p.pre+' !\n\nJe t’envoie les photos du party de samedi quand je les ai triées. Bises !',l:null},
 {n:'Colis Express',a:'noreply@colis-express.example',s:'Ton colis est en attente : 2,99 $ de frais',d:'hier',b:'Ton colis ne peut pas être livré. Paie 2,99 $ de frais de douane pour le recevoir.',l:['Payer maintenant','http://colis-express-paiement.example/pay']},
 {n:'Service informatique',a:'ti@entreprise-marie.example',s:'Mise à jour obligatoire de ton mot de passe',d:'hier',b:'Ouvre la pièce jointe et suis les instructions pour mettre à jour ton mot de passe.',l:null,att:'mot-de-passe.zip'}
]}
var ml={sel:0,flag:{},del:{},link:''};
function renderMail(){
  var w=wins.mail;if(!w)return;var M=mails();
  w.title.textContent='Courriel – Boîte de réception';
  var h='<div class="a-ml"><div class="a-ml-l">';
  M.forEach(function(m,i){if(ml.del[i])return;h+='<button class="a-ml-i'+(ml.sel===i?' on':'')+'" data-i="'+i+'"><b>'+esc(m.n)+'</b><span>'+esc(m.s)+'</span><small>'+m.d+(ml.flag[i]?' · 🚩 signalé':'')+'</small></button>'});
  h+='</div><div class="a-ml-r">';
  var m=M[ml.sel];
  if(!m||ml.del[ml.sel])h+='<p class="a-ml-e">Aucun message sélectionné.</p>';
  else{
    h+='<h4>'+esc(m.s)+'</h4><p class="a-ml-f">De : '+esc(m.n)+' &lt;'+esc(m.a)+'&gt;</p><div class="a-ml-b">'+esc(m.b)+'</div>';
    if(m.att)h+='<p class="a-ml-att">📎 '+esc(m.att)+'</p>';
    if(m.l){var txt=m.l.length===2&&m.l[0].indexOf('http')!==0?m.l[0]:m.l[0],real=m.l[1]||m.l[0];h+='<p><a href="#" class="a-ml-lk" data-u="'+esc(real)+'">'+esc(txt)+'</a></p>'}
    h+='<p class="a-ml-u">'+(ml.link&&m.l?'Destination réelle du lien : <b>'+esc(ml.link)+'</b>':'')+'</p><div class="a-ml-a"><button class="btn" id="mlFlag">'+(ml.flag[ml.sel]?'Retirer le signalement':'Signaler comme hameçonnage')+'</button><button class="btn" id="mlDel">Supprimer</button></div>';
  }
  h+='</div></div>';
  w.body.innerHTML=h;
  w.body.querySelectorAll('.a-ml-i').forEach(function(b){b.onclick=function(){ml.sel=+b.getAttribute('data-i');ml.link='';renderMail()}});
  var lk=w.body.querySelector('.a-ml-lk');if(lk)lk.onclick=function(e){e.preventDefault();ml.link=lk.getAttribute('data-u');renderMail()};
  var f=$('mlFlag');if(f)f.onclick=function(){ml.flag[ml.sel]=!ml.flag[ml.sel];renderMail()};
  var d=$('mlDel');if(d)d.onclick=function(){ml.del[ml.sel]=true;for(var i=0;i<M.length;i++){if(!ml.del[i]){ml.sel=i;break}}ml.link='';renderMail()};
}

/* ---------- Sécurité Windows ---------- */
var sec={rt:true,scan:'idle',fw:{d:true,p:true,pu:true}};
function renderSecurity(){
  var w=wins.security;if(!w)return;
  w.title.textContent='Sécurité Windows';
  function row(a,b,r){return'<div class="row"><div>'+a+(b?'<small>'+b+'</small>':'')+'</div>'+(r||'')+'</div>'}
  function tg(k,sub){var on=sub?sec.fw[sub]:sec[k];return'<span class="a-tg'+(on?' on':'')+'" data-k="'+k+'" data-s="'+(sub||'')+'" role="switch" aria-checked="'+on+'" tabindex="0"></span>'}
  var all=sec.rt&&sec.fw.d&&sec.fw.p&&sec.fw.pu;
  var h='<div class="a-set"><main style="width:100%"><h3>'+(all?'✅ Ton appareil est protégé':'⚠️ Une protection est désactivée')+'</h3>';
  h+=row('Protection en temps réel','Surveille les fichiers pendant que tu les ouvres',tg('rt'));
  h+=row('Analyse rapide',sec.scan==='busy'?'Analyse en cours…':(sec.scan==='done'?'Aucune menace trouvée':'Dernière analyse : hier'),'<button class="btn" id="bScan"'+(sec.scan==='busy'?' disabled':'')+'>Analyser</button>');
  h+='<h3 style="font-size:15px;margin:14px 0 8px">Pare-feu</h3>'+row('Réseau de domaine','',tg('fw','d'))+row('Réseau privé','Ta maison',tg('fw','p'))+row('Réseau public','Café, bibliothèque, aéroport',tg('fw','pu'));
  h+='</main></div>';
  w.body.innerHTML=h;
  w.body.querySelectorAll('.a-tg').forEach(function(t){t.onclick=function(){var k=t.getAttribute('data-k'),sb=t.getAttribute('data-s');if(sb)sec.fw[sb]=!sec.fw[sb];else sec[k]=!sec[k];renderSecurity()}});
  var b=$('bScan');if(b)b.onclick=function(){sec.scan='busy';renderSecurity();setTimeout(function(){sec.scan='done';renderSecurity()},1800)};
}

/* ---------- Navigateur ---------- */
function renderBrowser(){
  if(MK===2)return renderBrowser2();
  var w=wins.browser;if(!w)return;
  var home=st.page==='start',url=home?'accueil':'banque-du-coin.example/inscription';
  w.title.textContent=(home?'Nouvel onglet':'Banque du Coin')+' – Navigateur';
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(home?'Nouvel onglet':'Banque du Coin')+'</div></div><div class="a-url"><button disabled aria-label="Précédent">←</button><span>'+url+'</span></div><div class="a-page">';
  if(home)h+='<h3>Page d’accueil</h3><p>Tes favoris :</p><button class="a-bm" id="bmBank">🏦 Banque du Coin — ouvrir un compte</button>';
  else h+='<h3>Crée ton compte</h3><p>Choisis un mot de passe pour protéger ton argent.</p><form class="a-form" id="aForm" autocomplete="off"><label>Courriel<input type="text" value="'+esc(P().mail)+'" readonly></label><label>Mot de passe<div class="a-row"><input id="aPw" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+esc(st.pw)+'"><button type="button" class="a-show" id="aShow">Voir</button></div></label><button class="a-go" id="aGo" type="submit"'+(st.busy?' disabled':'')+'>Créer mon compte</button></form><div id="aBot"></div>';
  h+='</div></div>';
  w.body.innerHTML=h;
  var bm=$('bmBank');if(bm)bm.onclick=function(){st.page='form';if(!st.seen.fav){st.seen.fav=1;progress('fav')}renderBrowser()};
  var f=$('aForm');
  if(f){
    $('aShow').onclick=function(){var i=$('aPw');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'Voir':'Cacher'};
    $('aPw').oninput=function(){st.pw=this.value};
    f.onsubmit=function(e){e.preventDefault();submitPw()};
    if(st.botHTML)$('aBot').innerHTML=st.botHTML;
  }
}


function renderBrowser2(){
  var w=wins.browser;if(!w)return;
  var home=st.page==='start',url=home?'accueil':'mes-comptes.example/securite';
  w.title.textContent=(home?'Nouvel onglet':'Mes comptes')+' – Navigateur';
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(home?'Nouvel onglet':'Mes comptes')+'</div></div><div class="a-url"><button disabled aria-label="Précédent">←</button><span>'+url+'</span></div><div class="a-page">';
  if(home)h+='<h3>Page d’accueil</h3><p>Tes favoris :</p><button class="a-bm" id="bmAcc">🔐 Mes comptes</button>';
  else{
    h+='<h3>Mes comptes</h3><p>Change le mot de passe d’un compte, puis passe au suivant.</p><div class="a-acc">';
    st.acc.forEach(function(a,i){h+='<div class="a-acc-r"><div class="a-acc-t"><b>'+esc(a.site)+'</b><span class="a-acc-s">'+(a.changed?'✓ mis à jour':'')+'</span></div><div class="a-row"><input type="text" data-i="'+i+'" placeholder="Nouveau mot de passe" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+esc(st.inp[i]||'')+'"><button type="button" class="a-show" data-c="'+i+'">Changer</button></div></div>'});
    h+='</div><button class="a-go" id="aVer"'+(st.busy?' disabled':'')+'>Vérifier avec le robot</button><div id="aBot"></div>';
  }
  h+='</div></div>';
  w.body.innerHTML=h;
  var bm=$('bmAcc');if(bm)bm.onclick=function(){st.page='form';if(!st.seen.fav){st.seen.fav=1;progress('fav')}renderBrowser()};
  w.body.querySelectorAll('.a-acc-r input').forEach(function(inp){inp.oninput=function(){st.inp[inp.getAttribute('data-i')]=inp.value}});
  w.body.querySelectorAll('[data-c]').forEach(function(b){b.onclick=function(){
    var i=+b.getAttribute('data-c'),v=st.inp[i]||'';
    if(!v){setSay('Écris d’abord un nouveau mot de passe.');return}
    st.acc[i].pw=v;st.acc[i].changed=true;st.inp[i]='';st.botHTML='';progress('change');renderBrowser()}});
  var vb=$('aVer');if(vb)vb.onclick=verify2;
  if(st.botHTML&&$('aBot'))$('aBot').innerHTML=st.botHTML;
}
function verify2(){
  if(st.busy)return;
  var leak=SCEN[st.persona].pw,n=st.acc.length;
  var rows=st.acc.map(function(a,i){
    var why='';
    if(similar(a.pw,leak))why=a.changed?'presque le même mot de passe que celui volé : le robot teste les variantes.':'toujours le mot de passe volé.';
    else{
      for(var j=0;j<n;j++){if(j!==i&&similar(a.pw,st.acc[j].pw)){why='même mot de passe (ou presque) que « '+st.acc[j].site+' » : une seule fuite ouvrirait les deux.';break}}
      if(!why&&a.changed){var ev=evaluate(a.pw,P());if(!ev.ok){var bd=ev.res.filter(function(r){return r.bad})[0];why='nouveau mot de passe trop faible. '+bd.msg}}
    }
    return{site:a.site,bad:!!why,why:why};
  });
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===n,pct:Math.round(okn/n*100)};
  st.busy=true;if(st.phase==='pratique'&&!done[3])done[3]=true;render();
  var vb=$('aVer');if(vb)vb.disabled=true;
  var box=$('aBot'),html='<div class="a-bot"><h4>🤖 Robot de bourrage d’identifiants (simulation)</h4>',i=0;
  box.innerHTML=html+'</div>';
  (function nxt(){
    if(i<rows.length){
      var r=rows[i];
      html+='<div class="st"><span>'+esc(r.site)+'</span><em class="'+(r.bad?'bad':'good')+'">'+(r.bad?'✕ ouvert':'✓ résiste')+'</em></div>';
      box.innerHTML=html+'</div>';box.scrollIntoView({block:'nearest'});i++;setTimeout(nxt,650);return;
    }
    var bad=rows.filter(function(r){return r.bad});
    html+='<div class="out">';
    if(res.ok)html+='<b class="good">Le robot abandonne.</b> Chaque compte a sa propre clé.';
    else html+='<b class="bad">Le robot est entré.</b> '+bad.map(function(r){return'<br>• <b>'+esc(r.site)+'</b> : '+esc(r.why)}).join('');
    html+='</div></div>';
    box.innerHTML=html;st.botHTML=html;st.busy=false;box.scrollIntoView({block:'nearest'});
    var g=$('aVer');if(g)g.disabled=false;
    finish(res);
  })();
}

/* ---------- Menu Démarrer + barre des tâches ---------- */
function closeStart(){$('aStart').hidden=true}
function buildStart(){
  var s=$('aStart');
  s.innerHTML='<input type="text" id="aSearch" placeholder="Taper ici pour rechercher" autocomplete="off"><h5>Épinglé</h5><div class="a-pins">'+ORDER.map(function(id){return'<button class="a-pin" data-app="'+id+'">'+IC[id]+'<span>'+APPS[id].t+'</span></button>'}).join('')+'</div><div class="a-st-foot"><i>'+esc(P().pre.charAt(0))+'</i><span>'+esc(P().pre)+' '+esc(P().nom)+'</span></div>';
  s.querySelectorAll('.a-pin').forEach(function(b){b.onclick=function(){openApp(b.getAttribute('data-app'))}});
  $('aSearch').oninput=function(){var q=strip(this.value);s.querySelectorAll('.a-pin').forEach(function(b){b.hidden=q&&strip(b.textContent).indexOf(q)<0})};
}
function buildDesk(){
  var tb='<button class="a-tb" id="tb-start" aria-label="Démarrer"><img src="./assets/brand/mark.svg" alt="" width="24" height="24"></button>';
  ORDER.forEach(function(id){tb+='<button class="a-tb" id="tb-'+id+'" aria-label="'+APPS[id].t+'">'+IC[id]+'</button>'});
  $('aTb').innerHTML=tb;
  $('aIcons').innerHTML=ORDER.map(function(id){return'<button class="a-ico" data-app="'+id+'">'+IC[id]+APPS[id].t+'</button>'}).join('');
  $('aIcons').addEventListener('click',function(e){var b=e.target.closest('.a-ico');if(b)openApp(b.getAttribute('data-app'))});
  ORDER.forEach(function(id){$('tb-'+id).onclick=function(){openApp(id)}});
  $('tb-start').onclick=function(e){e.stopPropagation();var s=$('aStart');s.hidden=!s.hidden;if(!s.hidden){buildStart();$('aSearch').focus()}};
  $('aStart').addEventListener('click',function(e){e.stopPropagation()});
  $('aScreen').addEventListener('click',function(e){if(!e.target.closest('#tb-start'))closeStart()});
}

/* ---------- Mission ---------- */
var STEPS1=['Ouvrir le Bloc-notes de Marie','Ouvrir le Navigateur','Cliquer sur le favori « Banque du Coin »','Créer un mot de passe et envoyer le formulaire','Résister aux 4 attaques du robot'];
var STEPS2=['Lire le courriel de la fuite','Ouvrir le Bloc-notes de Marie : sa liste de mots de passe','Ouvrir le Navigateur, favori « Mes comptes »','Changer le mot de passe des comptes touchés','Vérifier : le robot ne doit plus entrer nulle part'];
var done=[false,false,false,false,false];
function progress(k){
  if(PL)return;
  if(st.phase!=='pratique')return;
  var before=done.filter(Boolean).length;
  if(MK===1){if(k==='notes')done[0]=true;if(k==='browser')done[1]=true;if(k==='fav')done[2]=true}
  else{if(k==='mail')done[0]=true;if(k==='notes')done[1]=true;if(k==='fav')done[2]=true;if(k==='change')done[3]=true}
  render();if(done.filter(Boolean).length>before)clicReact('etape',{chance:before===0?1:.5});
}
var HELP1=[
 ['Indice','Les attaques utilisent des infos publiques sur la personne. Regarde son Bloc-notes : ce qui s’y trouve est à éviter.'],
 ['Méthode','Un robot teste d’abord les mots de passe courants, puis les infos perso, puis un mot + chiffres, puis toutes les combinaisons. Un mot de passe long fait de plusieurs mots sans lien entre eux bloque les quatre.'],
 ['Explication','Chaque caractère ajouté multiplie le travail du robot. Des mots sans lien avec la personne ne se trouvent dans aucune liste de ses infos.'],
 ['Accompagnement','Prends 4 mots au hasard qui n’ont aucun lien avec Marie ni entre eux, relie-les avec un tiret ou un espace, et ajoute un petit détail bizarre. Compte les caractères : vise 14 ou plus.'],
 ['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Lequel est le plus difficile à deviner pour un robot ?", "o": ["Minou2015!", "velo-orage-pomme-lune", "Marie1985"], "ok": 1, "why": "Des mots longs et sans lien avec toi : beaucoup de caractères, aucune info perso."}]
];
var HELP2=[
 ['Indice','Le courriel dit quel mot de passe a été volé. Cherche, dans la liste du Bloc-notes, où ce mot de passe apparaît d’autre.'],
 ['Méthode','Repère tous les comptes qui ont le même mot de passe, ou presque. Chacun doit recevoir un mot de passe nouveau et différent des autres.'],
 ['Explication','Après une fuite, des robots essaient le mot de passe volé sur des centaines d’autres sites, avec des variantes. Changer un chiffre ne suffit pas : il faut une clé nouvelle pour chaque porte.'],
 ['Accompagnement','Pour chaque compte touché, invente un mot de passe long fait de mots sans lien (ni avec Marie, ni avec le mot de passe volé), différent pour chaque compte. Ensuite, clique sur « Vérifier avec le robot ».'],
 ['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Un site où tu as un compte est piraté. Que fais-tu ?", "o": ["Je change le mot de passe sur ce site seulement", "Je change aussi le mot de passe partout où je l’avais réutilisé", "Je ne fais rien"], "ok": 1, "why": "Des robots essaient le mot de passe volé sur d’autres sites : chaque porte doit avoir sa propre clé."}]
];
var CFG={
 1:{tag:'Mission 1 · Défi 1',title:'Un mot de passe qu’un robot ne trouvera pas',steps:STEPS1,help:HELP1,
   notion:'<p>Un robot essaie 4 trucs, dans l’ordre : la liste des mots de passe courants, tes infos personnelles, un mot du dictionnaire avec un chiffre, puis toutes les combinaisons possibles.</p><p style="margin-top:8px"><b>Exemple :</b> « Sophie2010! » tombe tout de suite. Le prénom, l’année et un point d’exclamation : le robot les devine en quelques secondes.</p>',
   intro:'On va le faire ensemble, sur l’ordinateur de Marie.',
   ex:function(){return'<p>Cette fois, sans aide. Voici <b>'+esc(P().pre)+' '+esc(P().nom)+'</b>. Crée-lui un mot de passe qui résiste aux 4 attaques.</p>'},
   saySt:'Ouvre le Bloc-notes de Marie, puis le Navigateur. Je suis là si tu veux de l’aide.',
   fail:function(p){return'Presque ! Résistance : '+p+' %. Relis ce que le robot a trouvé et recommence avec un autre personnage.'},
   win:'Ton mot de passe a battu le robot sans aide. C’est ça, une vraie compétence.',
   bad:'Le robot est entré. Regarde ce qui l’a aidé et essaie un autre mot de passe.'},
 2:{tag:'Mission 2 · Défi 2',title:'Une fuite : la même clé ouvre toutes les portes',steps:STEPS2,help:HELP2,
   notion:'<p>Quand un site se fait voler ses mots de passe, des robots essaient aussitôt la même combinaison sur des centaines d’autres sites : c’est le bourrage d’identifiants. Ils testent aussi les variantes.</p><p style="margin-top:8px"><b>Exemple :</b> « Marie2019 » volé sur un site devient « Marie2020 » sur les autres, en une seconde. Changer un chiffre ne protège pas.</p>',
   intro:'Un site vient d’avoir une fuite. Aide Marie à protéger ses comptes.',
   ex:function(){return'<p>Cette fois, sans aide. Un site où <b>'+esc(P().pre)+' '+esc(P().nom)+'</b> a un compte vient d’annoncer une fuite. Protège ses comptes.</p>'},
   saySt:'Ouvre le courriel de Marie : un de ses sites a une mauvaise nouvelle. Je suis là si tu veux de l’aide.',
   fail:function(p){return'Presque ! Protection : '+p+' %. Regarde ce que le robot a ouvert et recommence avec un autre personnage.'},
   win:'Tes comptes ont tenu face au robot, sans aide. C’est ça, une vraie compétence.',
   bad:'Le robot est entré quelque part. Regarde pourquoi et corrige les comptes.'}
};
if(PL)CFG[MK]=PL.cfg;
/* Le bureau de Clic (languette sur le bord de l'écran) : même échelle d'aide, un cran à la fois */
function syncClic(){
  if(!window.ClicBureau)return;var C=CFG[MK];
  if(st.phase==='notion')ClicBureau.update({note:'Lis la notion et l’exemple. Dès que tu passes à la pratique, je peux t’aider, un cran à la fois.'});
  else if(st.phase==='pratique')ClicBureau.update({note:'<b>'+esc(C.title)+'</b><br>Je ne te donne pas la réponse : je t’aide à la trouver. Monte d’un cran seulement si tu bloques.',levels:C.help,shown:st.help,onMore:function(){if(st.help<C.help.length){st.help++;render()}}});
  else ClicBureau.update({note:'C’est l’exercice : cette fois, je ne t’aide pas. C’est ici que tu montres ce que tu sais faire. Tu peux quand même prendre une petite pause.'});
}
function render(){
  var C=CFG[MK],m=MS(),h='<span class="a-tag">'+C.tag+'</span><h2>'+C.title+'</h2>';
  var ph=['notion','pratique','exercice'],pl={notion:'Notion',pratique:'Pratique',exercice:'Exercice'};
  h+='<div class="a-phase">'+ph.map(function(k){var cls=k===st.phase?'on':(ph.indexOf(k)<ph.indexOf(st.phase)||m.done?'ok':'');return'<span class="'+cls+'">'+pl[k]+'</span>'}).join('')+'</div>';
  if(st.phase==='notion'){
    h+=C.notion+'<div class="a-help"><button class="a-btn pri" id="bGo">Passer à la pratique</button></div>';
  }else if(st.phase==='pratique'){
    h+='<p>'+C.intro+'</p><ul class="a-steps">'+C.steps.map(function(s,i){return'<li class="'+(done[i]?'done':'')+'"><i>'+(done[i]?'✓':'')+'</i><span>'+s+'</span></li>'}).join('')+'</ul>';
    var hl=st.help;
    if(hl>0)h+='<p class="a-stat">Aide de Clic : '+hl+' cran'+(hl>1?'s':'')+' sur '+C.help.length+'.</p>';
    h+='<div class="a-help"><button class="a-btn" id="bHelp">Besoin d’aide ? Va voir Clic</button></div>';
  }else{
    h+=C.ex()+'<p class="a-stat">Tout est sur son ordinateur. À toi de trouver quoi regarder.</p>';
    h+='<div class="a-help"><button class="a-btn" id="bBack">Retourner à la pratique</button></div>';
  }
  if(m.tries)h+='<p class="a-stat">Exercice : '+m.tries+' essai'+(m.tries>1?'s':'')+(m.first!=null?' · premier score '+m.first+' %':'')+'</p>';
  mission.innerHTML=h;
  var b;
  if((b=$('bGo')))b.onclick=function(){startPhase('pratique')};
  if((b=$('bHelp')))b.onclick=function(){if(st.help===0)st.help=1;render();if(window.ClicBureau){ClicBureau.open();ClicBureau.face('reflexion')}};
  syncClic();
  if((b=$('bBack')))b.onclick=function(){startPhase('pratique')};
}
function resetDesktopState(){
  st.page='start';st.pw='';st.botHTML='';st.busy=false;
  Object.keys(wins).forEach(function(k){wins[k].el.remove();delete wins[k]});
  focused=null;closeStart();updateTb();
  st.seen={notes:0,browser:0,fav:0,mail:0};ml={sel:0,flag:{},del:{},link:''};
}
function clicReact(k,o){if(window.ClicBureau&&ClicBureau.react)ClicBureau.react(k,o)}
function startPhase(ph){
  resetDesktopState();st.phase=ph;st.help=0;done=CFG[MK].steps.map(function(){return false});
  if(ph==='pratique'){st.persona=0;setSay(CFG[MK].saySt)}
  else{st.persona=1+(MS().tries%2);setSay('Exercice : plus d’aide cette fois. Tu as tout ce qu’il faut.')}
  if(PL&&PL.reset)PL.reset(A);else initAcc();
  render();
  clicReact(ph==='pratique'?'pratique':'exercice',{force:true});
}
function submitPw(){
  if(st.busy)return;
  var pw=st.pw;
  if(!pw){setSay('Écris d’abord un mot de passe.');return}
  st.busy=true;
  var ev=evaluate(pw,P());
  if(st.phase==='pratique'&&!done[3])done[3]=true;
  render();
  var go=$('aGo');if(go)go.disabled=true;
  var box=$('aBot');
  var html='<div class="a-bot"><h4>🤖 Robot testeur (simulation)</h4>';
  box.innerHTML=html+'</div>';
  var i=0;
  (function nxt(){
    if(i<ev.res.length){
      var r=ev.res[i];
      html+='<div class="st"><span>'+(i+1)+'. '+r.k+'</span><em class="'+(r.bad?'bad':'good')+'">'+(r.bad?'✕ cassé':'✓ résiste')+'</em></div>';
      box.innerHTML=html+'</div>';box.scrollIntoView({block:'nearest'});i++;setTimeout(nxt,650);return;
    }
    var bad=ev.res.filter(function(r){return r.bad});
    html+='<div class="out">';
    if(ev.ok)html+='<b class="good">Le robot abandonne.</b> Ton mot de passe a résisté aux 4 attaques.';
    else html+='<b class="bad">Le robot est entré.</b> '+bad.map(function(r){return esc(r.msg)}).join(' ');
    html+='</div></div>';
    box.innerHTML=html;st.botHTML=html;st.busy=false;box.scrollIntoView({block:'nearest'});
    var g=$('aGo');if(g)g.disabled=false;
    finish(ev);
  })();
}

/* La mission réussie valide le défi 1 dans les cours (même mémoire que cours.html) */
var DEFI_KEY=(PL&&PL.defiKey)||'laclique_alphabet_v1',DEFI_IDS={1:'defi-01-mot-de-passe-authentification',2:'defi-03-reutilisation-de-mot-de-passe-bourrage-d-identifiant'},DEFI_ID=(PL&&PL.defiId)||DEFI_IDS[MK];
function syncDefi(m){
  try{
    var c=JSON.parse(localStorage.getItem(DEFI_KEY))||{};
    c.done=c.done||[];c.sc=c.sc||{};
    var r=c.sc[DEFI_ID]||{tries:0,first:null,best:0};
    r.tries=m.tries;r.first=m.first;r.best=m.best;
    if(m.done){r.ok=true;if(c.done.indexOf(DEFI_ID)<0)c.done.push(DEFI_ID)}
    c.sc[DEFI_ID]=r;
    localStorage.setItem(DEFI_KEY,JSON.stringify(c));
  }catch(e){}
}
function finish(ev){
  if(st.phase==='pratique'){
    if(ev.ok){done[done.length-1]=true;render();setSay('Bravo ! Maintenant, un exercice sans aide, avec une autre personne.');clicReact('progres',{force:true});
      var b=document.createElement('div');b.className='a-help';b.innerHTML='<button class="a-btn pri" id="bEx">Passer à l’exercice</button>';mission.appendChild(b);$('bEx').onclick=function(){startPhase('exercice')}}
    else{setSay(CFG[MK].bad);clicReact('encourage',{force:true})}
    return;
  }
  var m=MS();m.tries=(m.tries||0)+1;
  if(m.first==null)m.first=ev.pct;
  m.best=Math.max(m.best||0,ev.pct);
  if(ev.ok)m.done=true;
  save(S);
  syncDefi(m);
  if(ev.ok){render();celebrate();clicReact('reussite',{force:true})}
  else{
    render();
    setSay(CFG[MK].fail(ev.pct));clicReact('echec',{force:true});
    var b2=document.createElement('div');b2.className='a-help';b2.innerHTML='<button class="a-btn pri" id="bRe">Réessayer</button>';mission.appendChild(b2);
    $('bRe').onclick=function(){startPhase('exercice')};
  }
}
function celebrate(){
  var d=$('aDone');
  d.innerHTML='<div><img src="./assets/cerebro.webp" alt="" width="617" height="640"><h3>Mission réussie !</h3><p>'+CFG[MK].win+'</p><div class="a-help"><a class="a-btn pri" href="'+((PL&&PL.next)||'./cours.html')+'">Continuer vers le défi suivant</a><button class="a-btn" id="bAgain">Rejouer</button></div></div>';
  d.hidden=false;
  $('bAgain').onclick=function(){d.hidden=true;startPhase('pratique')};
  setSay('Tu l’as fait tout seul. Bien joué !');
}

/* ---------- API pour les missions (js/missions.js) ---------- */
function runBot(box,title,rows,outFn,cb){
  var html='<div class="a-bot"><h4>'+title+'</h4>',i=0;box.innerHTML=html+'</div>';
  (function nxt(){
    if(i<rows.length){var r=rows[i];html+='<div class="st"><span>'+r.k+'</span><em class="'+(r.bad?'bad':'good')+'">'+(r.bad?(r.badLabel||'✕ ouvert'):(r.goodLabel||'✓ résiste'))+'</em></div>';box.innerHTML=html+'</div>';box.scrollIntoView({block:'nearest'});i++;setTimeout(nxt,600);return}
    html+='<div class="out">'+outFn(rows)+'</div></div>';box.innerHTML=html;box.scrollIntoView({block:'nearest'});cb(html);
  })();
}
var A={$:$,esc:esc,strip:strip,evaluate:evaluate,P:P,st:st,setSay:setSay,finish:finish,wins:wins,openApp:openApp,closeWin:closeWin,IC:IC,runBot:runBot,
  step:function(i){if(st.phase==='pratique'&&done[i]===false){done[i]=true;render();clicReact('etape',{chance:i===0?1:.5})}},
  refresh:function(id){renderApp(id)},
  refreshAll:function(){Object.keys(wins).forEach(renderApp)},
  ml:function(){return ml},
  phase:function(){return st.phase},
  persona:function(){return st.persona},
  mission:function(){return mission},
  renderMission:render
};

/* ---------- Démarrage ---------- */
buildDesk();if(PL&&PL.reset)PL.reset(A);else initAcc();
function tick(){var d=new Date(),mo=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];$('aClock').textContent=d.getHours()+':'+('0'+d.getMinutes()).slice(-2)+'\n'+d.getDate()+' '+mo[d.getMonth()]+' '+d.getFullYear()}
tick();setInterval(tick,30000);
setSay('Bienvenue sur l’ordinateur virtuel ! Ici, tu pratiques sur un vrai faux ordinateur. Rien ne peut se casser.');
render();
setTimeout(function(){if(st.phase==='notion')clicReact('notion')},11000);
})();
