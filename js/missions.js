/* Missions de l'ordinateur virtuel (défis 3 à 14). Tout est simulé dans la page. */
(function(){
window.MISSIONS=window.MISSIONS||{};
var MX={};
MX.wrap=function(h){return '<div class="mx">'+h+'</div>'};
MX.on=function(w,sel,fn){w.body.querySelectorAll(sel).forEach(function(e){e.onclick=function(ev){fn(e,ev)}})};
MX.pill=function(k,t){return '<span class="mx-pill '+k+'">'+t+'</span>'};
MX.pick=function(A,list){return list[Math.min(A.persona(),list.length-1)]};
window.MX=MX;
})();
/* Mission 3 : gestionnaire de mots de passe */
(function(){
var A0,T={};
var SC=[
 {pre:'Marie',
  files:{'Bureau':[{n:'mots-de-passe.txt',pw:1,x:'Banque du Coin : Sherbrooke1985\nCourriel : Minou1985\nStreaming Maison : Minou2020\nClub de lecture : tricot-lampe-brume-27'},{n:'Raccourci Navigateur.lnk',x:'(raccourci vers le navigateur)'}],
   'Documents':[{n:'CV-2026.docx',x:'Marie Tremblay\nCurriculum vitae\nExpérience : accueil et service à la clientèle…'},{n:'Budget.xlsx',x:'Loyer 950 $\nÉpicerie 420 $\nTransport 90 $\nLoisirs 120 $'},{n:'codes-sites.xlsx',pw:1,x:'Site | Utilisateur | Mot de passe\nBanque du Coin | marie.tremblay | Sherbrooke1985\nCourriel | marie.tremblay | Minou1985'}],
   'Images':[{n:'chat.jpg',x:'(photo de Minou, couché sur le divan)'},{n:'liste-mdp-photo.jpg',pw:1,x:'(photo d’une feuille avec des mots de passe écrits au stylo)'}]},
  mail:{s:'Moi-même : mes mots de passe',b:'Banque du Coin : Sherbrooke1985\nCourriel : Minou1985\nStreaming Maison : Minou2020',n:'Marie Tremblay',a:'marie.tremblay@exemple.ca'},
  accts:['Banque du Coin','Courriel','Streaming Maison','Club de lecture']},
 {pre:'Marc',
  files:{'Bureau':[{n:'codes.txt',pw:1,x:'banque : Gatineau1992!\nhockey : Rex1992\ncourriel : Gatineau1992!'},{n:'hockey-horaire.pdf',x:'Horaire de la ligue : mardi 20 h, dimanche 18 h'}],
   'Documents':[{n:'Impôts-2025.xlsx',x:'Revenus, déductions, remboursement estimé'},{n:'Comptes et mots de passe.xlsx',pw:1,x:'Service | Mot de passe\nBanque | Gatineau1992!\nLigue de hockey | Rex1992'}],
   'Téléchargements':[{n:'photo-carnet-codes.png',pw:1,x:'(photo d’un carnet ouvert avec des codes et des mots de passe)'},{n:'jeu-installateur.exe',x:'(programme d’installation d’un jeu)'}]},
  mail:{s:'Note à moi',b:'banque : Gatineau1992!\nhockey : Rex1992\ncourriel : Gatineau1992!',n:'Marc Gagnon',a:'marc.gagnon@exemple.ca'},
  accts:['Banque','Ligue de hockey','Courriel','Messagerie']},
 {pre:'Julie',
  files:{'Bureau':[{n:'Nouveau document texte.txt',x:'Liste d’épicerie : lait, pain, oeufs, tisane, pommes'},{n:'Capture post-its.png',pw:1,x:'(capture d’écran de petits papiers collés : « Tigrou1978 », « Tigrou1979 », « Recettes : Tigrou78 »)'},{n:'recettes.docx',x:'Pâté chinois, tourtière, soupe aux pois…'}],
   'Documents':[{n:'Budget-maison.xlsx',x:'Hypothèque, électricité, internet, épicerie'},{n:'Notes.docx',pw:1,x:'Courriel : Tigrou1978\nÉpicerie en ligne : Tigrou1979\nRecettes Québec : Tigrou78'}],
   'Images':[{n:'vacances.jpg',x:'(photo d’une plage)'}]},
  mail:{s:'Rappel mots de passe',b:'Courriel : Tigrou1978\nÉpicerie en ligne : Tigrou1979\nRecettes Québec : Tigrou78',n:'Julie Roy',a:'julie.roy@exemple.ca'},
  accts:['Courriel','Épicerie en ligne','Recettes Québec','Messagerie']}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){
  A0=A;var s=S(),f={};
  Object.keys(s.files).forEach(function(k){f[k]=s.files[k].map(function(o){return{n:o.n,pw:!!o.pw,x:o.x,gone:false}})});
  T={files:f,path:Object.keys(f)[0],sel:null,v:{created:false,master:'',twofa:false,imported:false},busy:false,botHTML:'',lostUseful:[],show:false};
}
function pwLeft(){var n=0;Object.keys(T.files).forEach(function(k){T.files[k].forEach(function(o){if(o.pw&&!o.gone)n++})});if(!A0.ml().del[0])n++;return n}
function chk(){if(pwLeft()===0)A0.step(3)}
function files(w,A){
  var s=S();w.title.textContent=T.path+' – Explorateur de fichiers';
  var h='<div class="a-fx"><div class="a-fx-bar"><span class="a-fx-path">Ce PC › '+A.esc(T.path)+'</span></div><div class="a-fx-main"><nav>';
  Object.keys(T.files).forEach(function(k){h+='<button data-p="'+A.esc(k)+'" class="'+(k===T.path?'on':'')+'">📁 '+A.esc(k)+'</button>'});
  h+='</nav><div class="a-fx-list" style="display:flex;flex-direction:column">';
  var vis=T.files[T.path].map(function(o,i){return{o:o,i:i}}).filter(function(r){return!r.o.gone});
  vis.forEach(function(r){h+='<button class="a-fx-r'+(T.sel===r.i?' on':'')+'" data-i="'+r.i+'" style="grid-template-columns:1fr"><span>'+A.esc(r.o.n)+'</span></button>'});
  if(!vis.length)h+='<p style="padding:10px;color:#666">Dossier vide.</p>';
  var cur=T.sel!=null?T.files[T.path][T.sel]:null;
  if(cur&&!cur.gone)h+='<div class="mx-card" style="margin:8px 4px"><b>'+A.esc(cur.n)+'</b><div class="mx-mono" style="white-space:pre-wrap;margin:6px 0">'+A.esc(cur.x)+'</div><button class="mx-b dng" id="m3Del">Supprimer ce fichier</button></div>';
  h+='</div></div><div class="a-fx-s"><button class="mx-b" id="m3Chk" style="padding:3px 10px;font-size:12px">🔍 Tester avec le voleur</button> &nbsp;Clique sur un fichier pour voir ce qu’il contient.</div></div>';
  w.body.innerHTML=h;
  w.body.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){T.path=b.getAttribute('data-p');T.sel=null;files(w,A)}});
  w.body.querySelectorAll('.a-fx-r').forEach(function(b){b.onclick=function(){T.sel=+b.getAttribute('data-i');files(w,A)}});
  var d=A.$('m3Del');if(d)d.onclick=function(){if(T.busy)return;cur.gone=true;T.sel=null;if(!cur.pw&&A.phase)T.lostUseful.push(cur.n);chk();files(w,A);if(A.wins.coffre)A.refresh('coffre')};
  A.$('m3Chk').onclick=check;
}
function coffre(w,A){
  chk();var v=T.v,s=S();w.title.textContent='Coffre à mots de passe';
  var h='<div class="mx"><h3>🔐 Coffre à mots de passe</h3>';
  if(!v.created){
    h+='<p>Un seul mot de passe à retenir : le mot de passe maître. Tous les autres seront rangés derrière.</p><div class="mx-card"><label>Mot de passe maître<br><input type="'+(T.show?'text':'password')+'" id="m3Pw" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%;margin-top:4px" value="'+A.esc(v.master)+'"></label><div class="mx-bar"><button class="mx-b" id="m3Show">'+(T.show?'Cacher':'Voir')+'</button><button class="mx-b pri" id="m3Make">Créer le coffre</button></div></div>';
  }else{
    h+='<p>Le coffre de '+A.esc(s.pre)+' est créé.</p><div class="mx-row"><div><b>Double vérification</b><br><small>Une deuxième preuve pour ouvrir le coffre</small></div><span class="a-tg'+(v.twofa?' on':'')+'" id="m3Tg" role="switch" tabindex="0" aria-checked="'+v.twofa+'"></span></div>';
    h+='<h4>Comptes</h4>';
    if(!v.imported)h+='<div class="mx-card"><p>Aucun compte dans le coffre pour le moment.</p><button class="mx-b pri" id="m3Imp">Ajouter les comptes de '+A.esc(s.pre)+' (mots de passe forts générés)</button></div>';
    else s.accts.forEach(function(a){h+='<div class="mx-row"><div><b>'+A.esc(a)+'</b><br><small>mot de passe fort généré · •••••••••••••••••</small></div>'+MX.pill('ok','dans le coffre')+'</div>'});
    h+='<div class="mx-bar"><button class="mx-b" id="m3Chk2">🔍 Tester avec le voleur</button></div>';
  }
  if(T.botHTML)h+='<div id="aBot">'+T.botHTML+'</div>';else h+='<div id="aBot"></div>';
  w.body.innerHTML=h+'</div>';
  var sh=A.$('m3Show');if(sh)sh.onclick=function(){v.master=A.$('m3Pw').value;T.show=!T.show;coffre(w,A)};
  var pw=A.$('m3Pw');if(pw)pw.oninput=function(){v.master=pw.value};
  var mk=A.$('m3Make');if(mk)mk.onclick=function(){if(!v.master){A.setSay('Écris d’abord ton mot de passe maître.');return}v.created=true;T.botHTML='';A.step(1);coffre(w,A)};
  var tg=A.$('m3Tg');if(tg)tg.onclick=function(){v.twofa=!v.twofa;coffre(w,A)};
  var im=A.$('m3Imp');if(im)im.onclick=function(){v.imported=true;A.step(2);coffre(w,A)};
  var c2=A.$('m3Chk2');if(c2)c2.onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,s=S(),rows=[],why=[];chk();
  var pwmail=!A.ml().del[0];
  Object.keys(T.files).forEach(function(k){
    var left=T.files[k].filter(function(o){return o.pw&&!o.gone});
    if(!left.length)rows.push({k:'Dossier « '+k+' »',bad:false,goodLabel:'✓ rien'});
    else{rows.push({k:'Dossier « '+k+' »',bad:true,badLabel:'✕ trouvé'});why.push('Dans « '+k+' », le fichier « '+left[0].n+' » contient des mots de passe en clair.')}
  });
  rows.push({k:'Courriel (messages à soi-même)',bad:pwmail,badLabel:'✕ trouvé',goodLabel:'✓ rien'});if(pwmail)why.push('Dans le courriel, « '+s.mail.s+' » contient des mots de passe en clair.');
  var v=T.v;
  rows.push({k:'Un coffre existe',bad:!v.created,badLabel:'✕ aucun',goodLabel:'✓ oui'});if(!v.created)why.push('Il n’y a pas de coffre : où Marie va-t-elle retrouver ses mots de passe ?'.replace('Marie',s.pre));
  if(v.created){
    var ev=A.evaluate(v.master,A.P()),bd=ev.res.filter(function(r){return r.bad})[0];
    rows.push({k:'Mot de passe maître',bad:!ev.ok,badLabel:'✕ deviné',goodLabel:'✓ résiste'});if(!ev.ok)why.push('Mot de passe maître trop faible : '+bd.msg);
    rows.push({k:'Double vérification du coffre',bad:!v.twofa,badLabel:'✕ absente',goodLabel:'✓ active'});if(!v.twofa)why.push('Le coffre n’a pas de double vérification : le mot de passe maître seul ne devrait pas suffire.');
    rows.push({k:'Comptes rangés dans le coffre',bad:!v.imported,badLabel:'✕ non',goodLabel:'✓ oui'});if(!v.imported)why.push('Les comptes ne sont pas dans le coffre.');
  }
  rows.push({k:'Fichiers utiles conservés',bad:T.lostUseful.length>0,badLabel:'✕ supprimés',goodLabel:'✓ oui'});if(T.lostUseful.length)why.push('Tu as supprimé un fichier qui n’avait rien à voir : « '+T.lostUseful[0]+' ». Regarde ce qu’il contient avant de supprimer.');
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  var host=(A.wins.coffre&&A.$('aBot'))||(A.wins.files&&A.wins.files.body.querySelector('.a-fx-s'));
  T.busy=true;
  if(!A.wins.coffre)A.openApp('coffre');
  var box=A.$('aBot');
  if(!box){T.busy=false;return}
  A.runBot(box,'🕵️ Voleur d’ordinateur (simulation)',rows,function(){return res.ok?'<b class="good">Le voleur repart les mains vides.</b> Tout est rangé derrière une vraie porte.':'<b class="bad">Le voleur a trouvé de quoi entrer.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;A.finish(res)});
}
window.MISSIONS[3]={
 defiId:'defi-11-gestionnaire-de-mots-de-passe',
 extra:{coffre:{t:'Coffre à mots de passe',x:80,y:30,w:460,h:420,icon:'<svg viewBox="0 0 32 32"><rect x="4" y="9" width="24" height="18" rx="3" fill="#6b4fd8"/><path d="M10 9V7a6 6 0 0 1 12 0v2" fill="none" stroke="#b9a8ff" stroke-width="2.4"/><circle cx="16" cy="18" r="3.2" fill="#fff"/><rect x="15" y="18" width="2" height="5" fill="#fff"/></svg>'}},
 reset:reset,
 mails:function(A){var s=S(),p=A.P();return[
  {n:s.mail.n,a:s.mail.a,s:s.mail.s,d:'12 sept.',b:s.mail.b,l:null},
  {n:'Louise Tremblay',a:'louise.tremblay@exemple.ca',s:'Souper dimanche ?',d:'hier',b:'Salut '+p.pre+' ! Tu es libre dimanche pour souper ?',l:null},
  {n:'Épicerie Express',a:'commandes@epicerie-express.example',s:'Ta commande est prête',d:'2 oct.',b:'Ta commande est prête à être récupérée.',l:null}]},
 apps:{files:files,coffre:coffre},
 onOpen:function(id,A){if(id==='files')A.step(0);if(id==='mail')A.refresh('mail')},
 cfg:{tag:'Mission 3 · Défi 3',title:'Un coffre au lieu de post-its',
  steps:['Ouvrir l’Explorateur de fichiers et regarder où traînent les mots de passe','Ouvrir le Coffre et le créer (mot de passe maître)','Mettre les comptes dans le coffre','Supprimer ce qui contient des mots de passe en clair (fichiers et courriel)','Tester : le voleur ne doit rien trouver'],
  help:[['Indice','Clique sur les fichiers : leur nom ne dit pas toujours ce qu’ils contiennent. Regarde aussi dans le Courriel.'],['Méthode','Un coffre = un seul mot de passe maître, long et sans lien avec toi, plus la double vérification. Ensuite on met tout dedans et on détruit les copies en clair.'],['Explication','Un voleur d’ordinateur ouvre les dossiers et la boîte courriel. S’il ne trouve aucun mot de passe en clair, il doit casser le coffre, et sans la deuxième preuve il n’y arrive pas.'],['Accompagnement','1) Crée le coffre avec quatre mots sans lien reliés par des tirets. 2) Active la double vérification. 3) Ajoute les comptes. 4) Supprime seulement les fichiers qui contiennent des mots de passe. 5) Teste.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Où ranges-tu tes mots de passe pour qu’un voleur d’ordinateur ne les trouve pas ?", "o": ["Dans un fichier « mdp.txt »", "Dans un coffre protégé par un mot de passe maître et la double vérification", "Sur un post-it sous le clavier"], "ok": 1, "why": "Le coffre est le seul endroit où ils ne sont pas lisibles par n’importe qui."}]],
  notion:'<p>Un <b>gestionnaire de mots de passe</b>, c’est un coffre : tu retiens un seul mot de passe (le maître) et il range tous les autres, chiffrés.</p><p style="margin-top:8px"><b>Exemple :</b> un fichier « mots-de-passe.txt » sur le bureau, c’est une clé sous le paillasson. Le premier qui ouvre l’ordinateur les lit tous.</p>',
  intro:'Marie garde ses mots de passe un peu partout. Aide-la à tout mettre dans un coffre.',
  ex:function(){return'<p>Cette fois, sans aide. <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> garde ses mots de passe à plusieurs endroits. Mets-les à l’abri.</p>'},
  saySt:'Commence par fouiller l’ordinateur de Marie, comme le ferait un voleur. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Protection : '+p+' %. Regarde ce que le voleur a trouvé et recommence avec un autre personnage.'},
  win:'Plus rien en clair, tout est derrière une vraie porte. C’est ça, un coffre.',
  bad:'Le voleur a trouvé quelque chose. Regarde quoi et corrige.'}
};
})();
/* Mission 4 : double vérification (2FA) */
(function(){
var A0,T={};
var SC=[
 {leak:'Un site vient de se faire voler ses mots de passe : le voleur connaît celui de Marie, partout.',accts:[['Courriel','none'],['Banque du Coin','none'],['Boutique en ligne','none'],['Club de lecture','none']]},
 {accts:[['Courriel','question'],['Banque du Coin','pw2'],['Ligue de hockey','none'],['Messagerie','email']]},
 {accts:[['Courriel','sms'],['Épicerie en ligne','question'],['Recettes Québec','none'],['Banque du Coin','email']]}
];
var OPT=[['none','Aucune : seulement mon mot de passe'],['question','Une question secrète (le nom de mon premier animal)'],['pw2','Un deuxième mot de passe'],['email','Mon adresse courriel'],['sms','Un code par texto sur mon téléphone'],['app','Une application qui affiche un code (change toutes les 30 secondes)'],['key','Une clé de sécurité physique (USB)']];
var LABEL={none:'aucune',question:'question secrète',pw2:'2ᵉ mot de passe',email:'adresse courriel',sms:'code par texto',app:'application de codes',key:'clé physique'};
var GOOD={sms:1,app:1,key:1};
function S(){return SC[Math.min(A0.persona(),2)]}
function totp(site,off){var t=Math.floor(Date.now()/30000)+(off||0),x=0,s=site+'|'+t+'|laclique';for(var i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))>>>0;return('000000'+(x%1000000)).slice(-6)}
function reset(A){
  A0=A;T={acc:S().accts.map(function(a){return{site:a[0],f:a[1]}}),edit:null,sel:'sms',sent:null,sms:[],page:'start',botHTML:'',busy:false,msg:'',appDone:false};
}
function allGood(){return T.acc.every(function(a){return GOOD[a.f]})}
function after(A){if(allGood())A.step(3);A.refresh('browser');if(A.wins.tel)A.refresh('tel')}
function browser(w,A){
  var home=T.page==='start';
  w.title.textContent=(home?'Nouvel onglet':'Sécurité des comptes')+' – Navigateur';
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(home?'Nouvel onglet':'Sécurité des comptes')+'</div></div><div class="a-url"><button disabled aria-label="Précédent">←</button><span>'+(home?'accueil':'mes-comptes.example/securite')+'</span></div><div class="a-page" style="padding:0">';
  if(home)h+='<div style="padding:22px 20px"><h3>Page d’accueil</h3><p>Tes favoris :</p><button class="a-bm" id="m4Fav">🛡️ Sécurité des comptes</button></div>';
  else{
    h+='<div class="mx"><h3>Sécurité des comptes</h3>';
    if(A.phase()==='pratique')h+='<p>'+A.esc(S().leak||'')+'</p>';
    T.acc.forEach(function(a,i){
      if(T.edit===i){
        h+='<div class="mx-card"><b>'+A.esc(a.site)+'</b><p style="margin-top:4px">Choisis ta deuxième preuve :</p><select id="m4Sel">'+OPT.map(function(o){return'<option value="'+o[0]+'"'+(T.sel===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select><div id="m4Act" style="margin-top:8px"></div></div>';
      }else{
        h+='<div class="mx-row"><div><b>'+A.esc(a.site)+'</b><br><small>Deuxième preuve : </small>'+MX.pill(a.f==='none'?'warn':'',LABEL[a.f])+'</div><button class="mx-b" data-e="'+i+'">Modifier</button></div>';
      }
    });
    h+='<div class="mx-bar"><button class="mx-b pri" id="m4Go"'+(T.busy?' disabled':'')+'>Tester avec le voleur</button></div><div id="aBot">'+(T.botHTML||'')+'</div></div>';
  }
  h+='</div></div>';w.body.innerHTML=h;
  var f=A.$('m4Fav');if(f)f.onclick=function(){T.page='sec';A.step(0);browser(w,A)};
  MX.on(w,'[data-e]',function(b){if(T.busy)return;T.edit=+b.getAttribute('data-e');T.sel='sms';T.sent=null;T.msg='';browser(w,A)});
  var sel=A.$('m4Sel');if(sel){sel.onchange=function(){T.sel=sel.value;T.sent=null;T.msg='';act(w,A)};act(w,A)}
  var go=A.$('m4Go');if(go)go.onclick=check;
}
function act(w,A){
  var d=A.$('m4Act');if(!d)return;var a=T.acc[T.edit],h='';
  if(T.sel==='sms'){
    h+=T.sent?'<p>Un texto a été envoyé au téléphone de '+A.esc(A.P().pre)+'. Entre le code reçu :</p><input type="text" id="m4In" inputmode="numeric" maxlength="6" placeholder="6 chiffres" autocomplete="off"> <button class="mx-b pri" id="m4Ok">Confirmer</button>':'<button class="mx-b" id="m4Send">Envoyer le code par texto</button>';
  }else if(T.sel==='app'){
    h+='<p>Ajoute ce compte dans l’application de codes du téléphone, puis entre le code à 6 chiffres qu’elle affiche.</p><div class="mx-card" style="text-align:center;margin:6px 0"><span style="font-size:34px">▦</span><br><small>Code à scanner (simulé) : ajoute « '+A.esc(a.site)+' » dans le téléphone</small></div><input type="text" id="m4In" inputmode="numeric" maxlength="6" placeholder="6 chiffres" autocomplete="off"> <button class="mx-b pri" id="m4Ok">Confirmer</button>';
  }else if(T.sel==='key'){
    h+='<p>Branche ta clé de sécurité dans l’ordinateur, puis touche-la.</p><button class="mx-b pri" id="m4Ok">Ma clé est branchée</button>';
  }else{
    h+='<button class="mx-b pri" id="m4Ok">Enregistrer</button>';
  }
  h+=' <button class="mx-b" id="m4Cx">Annuler</button><p id="m4Msg" style="color:#a4262c;margin-top:6px">'+A.esc(T.msg)+'</p>';
  d.innerHTML=h;
  var cx=A.$('m4Cx');cx.onclick=function(){T.edit=null;A.refresh('browser')};
  var sd=A.$('m4Send');if(sd)sd.onclick=function(){T.sent=String(100000+Math.floor(Math.random()*899999));T.sms.unshift({t:'Ton code de vérification est '+T.sent+'. Ne le donne à personne.',from:a.site});A.refresh('tel');act(w,A)};
  var ok=A.$('m4Ok');if(ok)ok.onclick=function(){
    var v=A.$('m4In')?A.$('m4In').value.trim():'';
    if(T.sel==='sms'){if(v!==T.sent){T.msg='Ce code n’est pas le bon.';act(w,A);return}}
    if(T.sel==='app'){if(v!==totp(a.site,0)&&v!==totp(a.site,-1)){T.msg='Ce code n’est pas (ou plus) le bon. Regarde le téléphone de '+A.P().pre+'.';act(w,A);return}T.appDone=true;A.step(2)}
    a.f=T.sel;T.edit=null;T.botHTML='';after(A)};
  var inp=A.$('m4In');if(inp)inp.focus();
}
function tel(w,A){
  w.title.textContent='Téléphone de '+A.P().pre;
  var tab=T.tab||'sms';
  var h='<div class="mx"><div class="mx-tabs"><button data-t="sms" class="'+(tab==='sms'?'on':'')+'">Messages</button><button data-t="app" class="'+(tab==='app'?'on':'')+'">Authentificateur</button></div>';
  if(tab==='sms'){
    if(!T.sms.length)h+='<p>Aucun message pour le moment.</p>';
    T.sms.forEach(function(m){h+='<div class="mx-card"><small>'+A.esc(m.from)+'</small><br>'+A.esc(m.t)+'</div>'});
  }else{
    var now=Math.floor(Date.now()/1000),left=30-(now%30);
    var shown=T.acc.filter(function(a){return a.f==='app'||(T.edit!=null&&T.acc[T.edit]===a&&T.sel==='app')});
    if(!shown.length)h+='<p>Aucun compte ajouté. Ajoute-en un depuis le navigateur.</p>';
    shown.forEach(function(a){h+='<div class="mx-card"><small>'+A.esc(a.site)+'</small><div class="mx-code">'+totp(a.site,0).replace(/(\d{3})(\d{3})/,'$1 $2')+'</div><div class="mx-tm"><i style="width:'+Math.round(left/30*100)+'%"></i></div><small>Change dans '+left+' s</small></div>'});
  }
  w.body.innerHTML=h+'</div>';
  MX.on(w,'[data-t]',function(b){T.tab=b.getAttribute('data-t');tel(w,A)});
}
setInterval(function(){var A=A0;if(A&&A.wins&&A.wins.tel&&(T.tab==='app'))A.refresh('tel')},1000);
function check(){
  if(T.busy)return;var A=A0,why=[],rows=T.acc.map(function(a){
    var bad=!GOOD[a.f];
    if(bad)why.push('<b>'+A.esc(a.site)+'</b> : '+({none:'seul le mot de passe protège ce compte, et le voleur l’a.',question:'une question secrète, c’est encore une chose que tu sais : elle se devine ou fuit au même endroit.',pw2:'un deuxième mot de passe, c’est la même famille de preuve : le voleur le trouve de la même façon.',email:'ton adresse courriel est publique : ce n’est pas une preuve.'})[a.f]);
    return{k:a.site+' ('+LABEL[a.f]+')',bad:bad}});
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.botHTML='';A.refresh('browser');
  A.runBot(A.$('aBot'),'🕵️ Voleur avec le mot de passe (simulation)',rows,function(){return res.ok?'<b class="good">Le voleur bloque sur la deuxième preuve.</b> Il a le mot de passe, mais pas le téléphone ni la clé.':'<b class="bad">Le voleur est entré.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;if(A.wins.browser)A.refresh('browser');A.finish(res)});
}
window.MISSIONS[4]={
 geom:{browser:{x:16,y:24,w:500,h:430}},
 defiId:'defi-02-authentification-a-deux-facteurs-2fa',
 extra:{tel:{t:'Téléphone',x:560,y:24,w:290,h:400,icon:'<svg viewBox="0 0 32 32"><rect x="9" y="3" width="14" height="26" rx="3.5" fill="#33414e"/><rect x="11" y="6" width="10" height="17" rx="1.5" fill="#6fd0ff"/><circle cx="16" cy="26" r="1.3" fill="#9fb3c8"/></svg>'}},
 reset:reset,
 apps:{browser:browser,tel:tel},
 onOpen:function(id,A){if(id==='tel')A.step(1)},
 cfg:{tag:'Mission 4 · Défi 4',title:'Le voleur a ton mot de passe, mais pas ton téléphone',
  steps:['Ouvrir le Navigateur, favori « Sécurité des comptes »','Ouvrir le Téléphone de Marie','Ajouter l’application de codes à un compte : tape le code affiché sur le téléphone','Mettre une vraie deuxième preuve sur chaque compte','Tester : le voleur ne doit entrer nulle part'],
  help:[['Indice','Il faut deux preuves de familles différentes : ce que tu sais, et ce que tu possèdes.'],['Méthode','Valables : un code reçu sur ton téléphone, une application de codes, une clé physique. Pas valables : une question secrète, un deuxième mot de passe, ton adresse courriel.'],['Explication','Le voleur peut avoir le mot de passe. Mais il n’a pas le téléphone ni la clé dans sa main.'],['Accompagnement','Pour chaque compte, clique sur « Modifier » et choisis une deuxième preuve qui te rend possesseur de quelque chose. Confirme avec le code. Puis teste.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Lequel est une vraie deuxième preuve ?", "o": ["Un deuxième mot de passe", "Le nom de ton premier animal", "Un code qui apparaît sur ton téléphone"], "ok": 2, "why": "Une deuxième preuve est quelque chose que tu possèdes, que le voleur n’a pas dans sa main."}]],
  notion:'<p>La <b>double vérification</b> demande deux preuves de familles différentes : ce que tu <i>sais</i> (le mot de passe) et ce que tu <i>possèdes</i> (le téléphone, une clé).</p><p style="margin-top:8px"><b>Exemple :</b> une question secrète n’est pas une deuxième preuve : c’est encore quelque chose que tu sais.</p>',
  intro:'Un voleur a le mot de passe de Marie. Ajoute-lui une vraie deuxième preuve.',
  ex:function(){return'<p>Cette fois, sans aide. Le voleur a le mot de passe de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b>. Protège ses comptes.</p>'},
  saySt:'Ouvre le navigateur et le téléphone de Marie. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Protection : '+p+' %. Regarde ce que le voleur a ouvert et recommence avec un autre personnage.'},
  win:'Même avec le mot de passe, le voleur reste dehors. C’est ça, deux preuves.',
  bad:'Le voleur est entré quelque part. Regarde où et corrige.'}
};
})();
/* Mission 5 : hameçonnage */
(function(){
var A0,T={};
var SC=[
 [{n:'Banque du Coin Sécurité',a:'alerte@banque-du-coin-securite.example',s:'URGENT : compte suspendu, agis dans 24 h',d:'aujourd’hui',b:'Cher client,\n\nNous avons détecté une activité inhabituelle. Ton compte sera fermé dans 24 heures si tu ne confirmes pas ton identité.',l:['Confirmer mon identité','http://banque-du-coin-verif.example/login'],p:1,w:'L’adresse du site imite la banque, le lien est en http://, « cher client » et la menace de fermeture en 24 h : urgence et pression.'},
  {n:'Banque du Coin',a:'service@banque-du-coin.example',s:'Ton relevé de septembre est disponible',d:'1 oct.',b:'Bonjour Marie,\n\nTon relevé de septembre est prêt. Tu peux le consulter dans ton espace client.',l:['Voir mon relevé','https://banque-du-coin.example/releve'],p:0},
  {n:'Colis Express',a:'noreply@colis-express.example',s:'Ton colis est en attente : 2,99 $ de frais',d:'hier',b:'Ton colis ne peut pas être livré. Paie 2,99 $ de frais de douane pour le recevoir.',l:['colis-express.example/suivi','http://colis-express-paiement.example/pay'],p:1,w:'Le texte du lien dit une chose, l’adresse réelle en est une autre (colis-express-paiement). Petits frais pour te faire entrer ta carte.'},
  {n:'Louise Tremblay',a:'louise.tremblay@exemple.ca',s:'Photos du party',d:'3 oct.',b:'Salut Marie !\n\nJe t’envoie les photos du party de samedi quand je les ai triées. Bises !',l:null,p:0},
  {n:'Service informatique',a:'ti@entreprise-marie.example',s:'Mise à jour obligatoire de ton mot de passe',d:'hier',b:'Ouvre la pièce jointe et suis les instructions pour mettre à jour ton mot de passe.',l:null,att:'mot-de-passe.zip',p:1,w:'Un vrai service TI ne demande jamais ton mot de passe par une pièce jointe. Un fichier .zip inattendu est un piège classique.'},
  {n:'Clinique Santé Estrie',a:'rendez-vous@clinique-estrie.example',s:'Rappel : ton rendez-vous demain à 10 h',d:'aujourd’hui',b:'Bonjour Marie,\n\nCeci est un rappel de ton rendez-vous demain à 10 h. Si tu dois annuler, appelle-nous au numéro habituel de la clinique.',l:null,p:0}],
 [{n:'Remboursement d’impôt',a:'remboursement@arc-gouv-verif.example',s:'Remboursement en attente : 412,60 $',d:'aujourd’hui',b:'Bonjour,\n\nUn remboursement de 412,60 $ t’attend. Réclame-le avant 17 h aujourd’hui ou il sera annulé.',l:['Réclamer mon remboursement','http://arc-remboursement.example/form'],p:1,w:'Un domaine qui n’est pas celui du gouvernement, du http://, et une échéance « avant 17 h » : le levier numéro un.'},
  {n:'Ligue de hockey',a:'info@ligue-hockey-gatineau.example',s:'Horaire de la semaine',d:'hier',b:'Salut Marc,\n\nVoici l’horaire de la semaine. Bonne partie !',l:['Voir l’horaire','https://ligue-hockey-gatineau.example/horaire'],p:0},
  {n:'Netflux',a:'support@netflux-facturation.example',s:'Paiement refusé : mets à jour ta carte aujourd’hui',d:'aujourd’hui',b:'Cher abonné,\n\nTon paiement a été refusé. Mets à jour ta carte aujourd’hui pour ne pas perdre ton compte.',l:['Mettre à jour ma carte','http://netflux-paiement.example/carte'],p:1,w:'« Cher abonné » au lieu de ton nom, urgence, domaine qui n’est pas celui du service et lien en http://.'},
  {n:'Alex Morin',a:'alex.morin@entreprise-marc.example',s:'Rapport de jeudi',d:'2 oct.',b:'Salut Marc,\n\nVoici le rapport de jeudi comme convenu. Dis-moi si tu as des questions.',l:null,att:'rapport-jeudi.pdf',p:0},
  {n:'Le directeur général',a:'dg@entreprise-marc-direction.example',s:'Virement urgent, sois discret',d:'aujourd’hui',b:'Marc,\n\nJ’ai besoin que tu paies une facture de 3 800 $ aujourd’hui. Ne dis rien à personne, je t’expliquerai plus tard.',l:null,p:1,w:'L’adresse n’est pas celle de ton entreprise (entreprise-marc-direction), argent, urgence et secret : le trio de la fraude au président.'},
  {n:'Pharmacie du Coin',a:'avis@pharmacie-du-coin.example',s:'Ton renouvellement est prêt',d:'1 oct.',b:'Bonjour Marc,\n\nTon renouvellement est prêt à être récupéré en pharmacie.',l:['Voir mon dossier','https://pharmacie-du-coin.example/dossier'],p:0}],
 [{n:'Postes Can Livraison',a:'suivi@postes-can-livraison.example',s:'Colis retenu : confirme ton adresse',d:'aujourd’hui',b:'Ton colis est retenu. Confirme ton adresse dans les 24 heures ou il sera retourné.',l:['Confirmer mon adresse','http://postes-can-livraison.example/adresse'],p:1,w:'Un domaine bizarre qui imite un transporteur, du http://, et une échéance de 24 h.'},
  {n:'Recettes Québec',a:'infolettre@recettes-quebec.example',s:'Nouvelle recette : tarte au sucre',d:'hier',b:'Bonjour Julie,\n\nCette semaine : la tarte au sucre de grand-maman. Bon appétit !',l:['Lire la recette','https://recettes-quebec.example/tarte'],p:0},
  {n:'Support ordinateur',a:'alerte@support-ordi-urgent.example',s:'Ton ordinateur est infecté : appelle tout de suite',d:'aujourd’hui',b:'ATTENTION !\n\nTon ordinateur est infecté. N’éteins surtout pas ton appareil et appelle le 1 800 555 0199 immédiatement.',l:null,p:1,w:'Alarme, majuscules, urgence et un numéro à appeler : l’hameçonnage peut aussi viser le téléphone (vishing).'},
  {n:'Épicerie en ligne',a:'commandes@epicerie-en-ligne.example',s:'Ta commande est confirmée',d:'2 oct.',b:'Bonjour Julie,\n\nMerci pour ta commande. Elle sera prête jeudi.',l:['Voir ma commande','https://epicerie-en-ligne.example/commande'],p:0},
  {n:'Ton compte courriel',a:'securite@courriel-exemple-verif.example',s:'Ta boîte sera supprimée aujourd’hui',d:'aujourd’hui',b:'Cher utilisateur,\n\nTa boîte courriel sera supprimée aujourd’hui si tu ne confirmes pas ton compte.',l:['Garder mon compte','http://courriel-exemple-verif.example/garder'],p:1,w:'« Cher utilisateur », menace de suppression, domaine qui n’est pas celui de ton fournisseur, lien en http://.'},
  {n:'Sophie Dubois',a:'sophie.d@exemple.ca',s:'Super recette !',d:'3 oct.',b:'Salut Julie,\n\nMerci pour la recette de tourtière, toute la famille a adoré !',l:null,p:0}]
];
function M(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={sel:0,flag:{},opened:{0:1},link:'',botHTML:'',busy:false,viewBot:false,lk:false}}
function mail(w,A){
  var L=M();w.title.textContent='Courriel – Boîte de réception';
  var h='<div class="a-ml"><div class="a-ml-l">';
  L.forEach(function(m,i){h+='<button class="a-ml-i'+(T.sel===i&&!T.viewBot?' on':'')+'" data-i="'+i+'"><b>'+A.esc(m.n)+'</b><span>'+A.esc(m.s)+'</span><small>'+m.d+(T.flag[i]?' · 🚩 signalé':'')+'</small></button>'});
  h+='</div><div class="a-ml-r">';
  if(T.viewBot){h+='<div id="aBot">'+T.botHTML+'</div>'}
  else{
    var m=L[T.sel];
    h+='<h4>'+A.esc(m.s)+'</h4><p class="a-ml-f">De : '+A.esc(m.n)+' &lt;'+A.esc(m.a)+'&gt;</p><div class="a-ml-b">'+A.esc(m.b)+'</div>';
    if(m.att)h+='<p class="a-ml-att">📎 '+A.esc(m.att)+'</p>';
    if(m.l)h+='<p><a href="#" class="a-ml-lk" data-u="'+A.esc(m.l[1])+'">'+A.esc(m.l[0])+'</a></p>';
    h+='<p class="a-ml-u">'+(T.link&&m.l?'Destination réelle du lien : <b>'+A.esc(T.link)+'</b>':'')+'</p><div class="a-ml-a"><button class="btn" id="m5Fl">'+(T.flag[T.sel]?'Retirer le signalement':'Signaler comme hameçonnage')+'</button><button class="btn" id="m5Done" style="background:#0067c0;color:#fff;border-color:#0067c0"'+(T.busy?' disabled':'')+'>Terminer le tri</button></div>';
  }
  h+='</div></div>';w.body.innerHTML=h;
  w.body.querySelectorAll('.a-ml-i').forEach(function(b){b.onclick=function(){if(T.busy)return;T.viewBot=false;T.sel=+b.getAttribute('data-i');T.link='';T.opened[T.sel]=1;if(Object.keys(T.opened).length>=L.length)A.step(1);mail(w,A)}});
  var lk=w.body.querySelector('.a-ml-lk');if(lk)lk.onclick=function(e){e.preventDefault();T.link=lk.getAttribute('data-u');A.step(2);mail(w,A)};
  var f=A.$('m5Fl');if(f)f.onclick=function(){T.flag[T.sel]=!T.flag[T.sel];if(Object.keys(T.flag).some(function(k){return T.flag[k]}))A.step(3);mail(w,A)};
  var d=A.$('m5Done');if(d)d.onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,L=M(),why=[];
  var rows=L.map(function(m,i){
    var fl=!!T.flag[i],bad=m.p?!fl:fl,r={k:m.n,bad:bad};
    if(m.p){r.badLabel='✕ cliqué';r.goodLabel='✓ repéré';if(bad)why.push('<b>'+A.esc(m.n)+'</b> : '+m.w)}
    else{r.badLabel='✕ signalé à tort';r.goodLabel='✓ reçu';if(bad)why.push('<b>'+A.esc(m.n)+'</b> était un vrai message : même adresse que d’habitude, aucun piège. Un signalement à tort fait perdre de vrais courriels.')}
    return r});
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.viewBot=true;T.botHTML='';A.refresh('mail');
  A.runBot(A.$('aBot'),'🎣 Les arnaqueurs envoient leurs messages (simulation)',rows,function(){return res.ok?'<b class="good">Aucun hameçon n’a mordu.</b> Tu as repéré chaque piège sans signaler un seul vrai message.':'<b class="bad">Quelqu’un a mordu.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;A.finish(res)});
}
window.MISSIONS[5]={
 defiId:'defi-04-hameconnage-phishing',
 reset:reset,
 apps:{mail:mail},
 onOpen:function(id,A){if(id==='mail')A.step(0)},
 cfg:{tag:'Mission 5 · Défi 5',title:'Trier le vrai du faux dans la boîte courriel',
  steps:['Ouvrir le Courriel','Lire tous les messages','Cliquer sur un lien pour voir où il mène vraiment','Signaler les messages d’hameçonnage','Terminer le tri : aucun arnaqueur ne doit réussir'],
  help:[['Indice','Regarde l’adresse de l’expéditeur lettre par lettre, et l’adresse réelle des liens. Le texte d’un lien peut mentir.'],['Méthode','Cherche : une adresse qui ressemble à la vraie sans l’être, un « cher client » au lieu de ton nom, une urgence ou une menace, un lien en http://, un fichier joint inattendu.'],['Explication','L’hameçonnage mise sur la précipitation. Un vrai message tient le coup quand tu prends dix secondes pour vérifier.'],['Accompagnement','Ouvre chaque message. Pour ceux qui ont un lien, clique dessus : la destination réelle s’affiche sans rien ouvrir. Signale seulement ceux qui se trahissent. Un vrai message urgent mais sans piège n’est pas de l’hameçonnage.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Un courriel de « ta banque » écrit « Cher client » et menace de fermer ton compte dans une heure. Premier réflexe ?", "o": ["Cliquer vite pour régler ça", "Ne pas cliquer et aller sur le vrai site, que tu tapes toi-même", "Répondre au courriel pour demander si c’est vrai"], "ok": 1, "why": "L’urgence et le « cher client » sont des signaux. On vérifie par un chemin qu’on contrôle."}]],
  notion:'<p>L’<b>hameçonnage</b> imite quelqu’un de confiance pour que tu cliques ou donnes une information. Le message parfait n’existe pas : ce qui trahit, c’est l’adresse, l’urgence et le lien.</p><p style="margin-top:8px"><b>Exemple :</b> un courriel de « ta banque » dont le lien mène à <i>banque-verif.example</i> au lieu du vrai site.</p>',
  intro:'Marie a reçu six messages. Certains sont des pièges, d’autres sont vrais.',
  ex:function(){return'<p>Cette fois, sans aide. Voici la boîte courriel de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b>. Trie les messages.</p>'},
  saySt:'Ouvre le Courriel de Marie. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Tri : '+p+' %. Regarde ce que les arnaqueurs ont obtenu et recommence avec un autre personnage.'},
  win:'Tous les pièges repérés, tous les vrais messages gardés. C’est ça, un œil entraîné.',
  bad:'Quelqu’un a mordu à l’hameçon. Regarde lequel et pourquoi.'}
};
})();
/* Mission 6 : ingénierie sociale */
(function(){
var A0,T={};
var SC=[
 {kind:'appel',from:'Numéro masqué',who:'Daniel (« service technique »)',rounds:[
  {line:'Bonjour madame Tremblay, ici Daniel, du service technique de votre fournisseur Internet. Nous avons détecté un virus sur votre ordinateur. Il faut le régler tout de suite.',sig:'Un inconnu qui t’appelle de lui-même et invente un problème qui fait peur.',
   ch:[{v:'g',t:'« Je ne vous connais pas. Je raccroche et je rappelle le numéro officiel de mon fournisseur. »'},{v:'m',t:'« Un virus ? Ah non ! Qu’est-ce que je dois faire ? »',fb:'Tu restes en ligne : il va en profiter pour t’entraîner plus loin.'},{v:'c',t:'« D’accord, je vous donne accès à mon ordinateur. »'}]},
  {line:'Pas de panique, je vais vous guider. Dites-moi votre mot de passe pour que je corrige ça. Et ne raccrochez pas, c’est urgent.',sig:'Il demande ton mot de passe et t’empêche de raccrocher : aucun service légitime ne fait ça.',
   ch:[{v:'g',t:'« Aucun service ne me demande mon mot de passe. Je raccroche et je rappelle le numéro officiel. »'},{v:'m',t:'« Mais comment je sais que vous êtes bien de mon fournisseur ? »',fb:'Bonne question, mais tu la poses à lui. Il répondra n’importe quoi.'},{v:'c',t:'« Mon mot de passe, c’est Minou1985. »'}]},
  {line:'Vous voyez bien que je suis légitime : je connais votre nom et votre adresse. Maintenant, lisez-moi le code que vous allez recevoir par texto.',sig:'Connaître ton nom ne prouve rien (ça se trouve en ligne), et le code reçu par texto est ta deuxième preuve.',
   ch:[{v:'g',t:'« Ces infos se trouvent en ligne. Je raccroche et je vérifie avec le numéro officiel. »'},{v:'c',t:'« Le code est 482 913. »'},{v:'c',t:'« Attendez, je regarde mon téléphone… voilà, 482 913. »'}]}]},
 {kind:'appel',from:'Numéro inconnu',who:'« Agent Lavoie »',rounds:[
  {line:'Bonjour monsieur Gagnon, ici l’agent Lavoie. Votre nom apparaît dans un dossier de fraude. Pour régler ça, vous devez faire un virement aujourd’hui.',sig:'Autorité, urgence et argent : une vraie police ne demande jamais un virement par téléphone.',
   ch:[{v:'c',t:'« D’accord, quel montant ? »'},{v:'g',t:'« Une vraie police ne demande pas de virement par téléphone. Je raccroche et j’appelle le poste de police au numéro officiel. »'},{v:'m',t:'« Un dossier de fraude ? Mais je n’ai rien fait ! »',fb:'La peur, c’est exactement le levier qu’il utilise.'}]},
  {line:'Si vous n’agissez pas dans l’heure, on envoie une équipe à votre porte. Ne parlez à personne de cet appel.',sig:'Menace et demande de secret : il veut t’isoler pour que personne ne te fasse vérifier.',
   ch:[{v:'m',t:'« Bon… dites-moi comment faire. »',fb:'Il t’isole et t’impose son rythme. C’est le but.'},{v:'g',t:'« Je vais en parler à mon entourage et vérifier au numéro officiel du poste de police. »'},{v:'c',t:'« Je fais le virement tout de suite. »'}]},
  {line:'Lisez-moi le code qu’on vient de vous envoyer par texto pour confirmer le virement.',sig:'Le code reçu par texto, c’est ta deuxième preuve : le lui lire, c’est lui ouvrir la porte.',
   ch:[{v:'c',t:'« Le code est 713 094. »'},{v:'g',t:'« Ce code est ma deuxième preuve, je ne le donne jamais. Je raccroche. »'},{v:'c',t:'« Je vous l’envoie par texto en vitesse. »'}]}]},
 {kind:'texto',from:'Numéro inconnu',who:'« Martin, ton patron »',rounds:[
  {line:'Salut Julie, c’est Martin, ton patron. J’ai changé de numéro. Urgent : j’ai besoin que tu m’achètes des cartes-cadeaux pour un client. Reste discrète.',sig:'Un nouveau numéro, de l’urgence et de la discrétion : un faux patron.',
   ch:[{v:'c',t:'« OK, j’y vais tout de suite. »'},{v:'m',t:'« Quel montant ? »',fb:'Tu entres dans son jeu au lieu de vérifier.'},{v:'g',t:'« Je vais appeler Martin à son numéro habituel pour confirmer. »'}]},
  {line:'500 $ en cartes-cadeaux. Envoie-moi les codes en photo. Je suis en réunion, je ne peux pas répondre au téléphone.',sig:'Il refuse que tu l’appelles : un vrai patron préfère que tu vérifies.',
   ch:[{v:'g',t:'« Si tu ne peux pas répondre, je préviens quelqu’un d’autre aux ressources humaines pour valider. »'},{v:'m',t:'« Pourquoi pas ton ancien numéro ? »',fb:'Il va inventer une raison. Ne discute pas avec lui : vérifie ailleurs.'},{v:'c',t:'« Voici les codes. »'}]},
  {line:'Ne dérange personne, c’est confidentiel. Dépêche-toi.',sig:'Le secret et la hâte : il veut que personne ne puisse t’arrêter.',
   ch:[{v:'c',t:'« D’accord, voici les codes. »'},{v:'g',t:'« Non, je valide d’abord avec lui, à son vrai numéro. »'},{v:'c',t:'« Bon… je les envoie. »'}]}]}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function reset(A){A0=A;T={stage:'ring',r:0,log:[],ch:null,res:null,botHTML:'',busy:false,fb:'',visited:[]}}
function tel(w,A){
  var s=S();w.title.textContent='Téléphone de '+A.P().pre;
  var h='<div class="mx">';
  if(T.stage==='ring'){
    h+='<div style="text-align:center;padding:30px 0"><div style="font-size:42px">'+(s.kind==='appel'?'📞':'💬')+'</div><h3>'+(s.kind==='appel'?'Appel entrant':'Nouveau message')+'</h3><p>'+A.esc(s.from)+'</p><button class="mx-b pri" id="m6Ans" style="padding:10px 22px;font-size:15px">'+(s.kind==='appel'?'Répondre':'Ouvrir le message')+'</button></div>';
  }else{
    h+='<p><b>'+A.esc(s.who)+'</b> · '+(s.kind==='appel'?'appel en cours':'conversation')+'</p><div class="mx-chat">';
    T.log.forEach(function(m){h+='<div class="mx-msg '+m.w+'">'+A.esc(m.t)+'</div>'});
    h+='</div>';
    if(T.stage==='play'&&T.ch)h+='<div class="mx-ch">'+T.ch.map(function(c,i){return'<button data-i="'+i+'" data-v="'+c.v+'">'+A.esc(c.t)+'</button>'}).join('')+'</div>';
    if(T.fb)h+='<p style="margin-top:8px;color:#8a5a00">🚩 '+A.esc(T.fb)+'</p>';
    h+='<div id="aBot">'+(T.botHTML||'')+'</div>';
  }
  w.body.innerHTML=h+'</div>';
  var an=A.$('m6Ans');if(an)an.onclick=function(){A.step(1);T.stage='play';T.r=0;talk(w,A)};
  MX.on(w,'.mx-ch button',function(b){pick(w,A,T.ch[+b.getAttribute('data-i')])});
  var sc=w.body.querySelector('.mx-chat');if(sc&&sc.lastChild)sc.lastChild.scrollIntoView({block:'nearest'});
}
function talk(w,A){var rd=S().rounds[T.r];T.log.push({w:'in',t:rd.line});T.ch=shuffle(rd.ch);T.fb='';tel(w,A)}
function pick(w,A,c){
  if(T.busy)return;var rd=S().rounds[T.r];A.step(2);
  T.log.push({w:'out',t:c.t});T.visited.push({r:T.r,v:c.v,sig:rd.sig});
  if(c.v==='g'){end(w,A,true);return}
  if(c.v==='c'||T.r>=S().rounds.length-1){end(w,A,false);return}
  T.fb=(A.phase()==='pratique'&&c.fb)?c.fb:'';T.r++;talk(w,A);
}
function end(w,A,safe){
  T.stage='end';T.ch=null;T.fb='';
  T.log.push({w:'sys',t:safe?'Tu as raccroché (ou coupé la conversation).':'La conversation continue… et l’autre obtient ce qu’il voulait.'});
  tel(w,A);
  var rows=T.visited.map(function(x,i){return{k:'Étape '+(i+1)+' : '+(x.v==='g'?'tu vérifies par un autre chemin':x.v==='m'?'tu restes en ligne':'tu cèdes'),bad:x.v!=='g',badLabel:x.v==='m'?'✕ tombé dans le piège':'✕ cédé',goodLabel:'✓ bon réflexe'}});
  var idx=safe?T.visited.length-1:-1,pct=safe?[100,67,33][idx]||33:0,res={ok:safe,pct:pct};
  T.busy=true;
  A.runBot(A.$('aBot'),'📋 Ce qui s’est passé',rows,function(){return(safe?'<b class="good">Bien joué : tu as vérifié par un autre chemin.</b><br>':'<b class="bad">L’autre a obtenu ce qu’il voulait.</b><br>')+'<small>Signaux d’alerte de cette conversation :</small><br>• '+T.visited.map(function(x){return x.sig}).join('<br>• ')},function(html){T.botHTML=html;T.busy=false;A.finish(res)});
}
window.MISSIONS[6]={
 defiId:'defi-05-ingenierie-sociale',
 extra:{tel:{t:'Téléphone',x:230,y:24,w:360,h:420,icon:'<svg viewBox="0 0 32 32"><rect x="9" y="3" width="14" height="26" rx="3.5" fill="#33414e"/><rect x="11" y="6" width="10" height="17" rx="1.5" fill="#6fd0ff"/><circle cx="16" cy="26" r="1.3" fill="#9fb3c8"/></svg>'}},
 reset:reset,
 apps:{tel:tel},
 onOpen:function(id,A){if(id==='tel')A.step(0)},
 cfg:{tag:'Mission 6 · Défi 6',title:'Quelqu’un t’appelle : à toi de décider',
  steps:['Ouvrir le Téléphone de Marie','Répondre à l’appel','Choisir tes réponses, une étape à la fois','Couper et vérifier par un autre chemin (le numéro officiel)'],
  help:[['Indice','Voix calme, vocabulaire de pro, il connaît ton nom : ça ne prouve rien. Ce qui compte, c’est ce qu’il te demande.'],['Méthode','Les signaux : urgence, peur, secret, argent, mot de passe ou code demandé. Le bon réflexe : couper, puis vérifier par un chemin que tu contrôles.'],['Explication','Un vrai service accepte que tu vérifies. Un fraudeur a besoin que tu restes en ligne et que tu n’aies pas le temps de réfléchir.'],['Accompagnement','À chaque étape, choisis la réponse qui coupe la conversation et vérifie ailleurs, au numéro officiel. Ne discute pas avec lui.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Quelqu’un te téléphone, très poli, et te demande le code reçu par texto. Que fais-tu ?", "o": ["Je le donne, il connaît mon nom", "Je raccroche et je vérifie au numéro officiel", "Je le donne, mais lentement"], "ok": 1, "why": "Un vrai service ne te demande jamais ton code."}]],
  notion:'<p>L’<b>ingénierie sociale</b>, c’est obtenir une information en manipulant une personne, pas une machine. On ne force pas la porte : on te demande gentiment de l’ouvrir.</p><p style="margin-top:8px"><b>Exemple :</b> un faux technicien qui connaît ton nom, te fait peur avec un virus et te demande ton mot de passe « pour régler ça ».</p>',
  intro:'Un inconnu appelle Marie. Choisis ses réponses.',
  ex:function(){return'<p>Cette fois, sans aide. <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> reçoit '+(S().kind==='appel'?'un appel':'des messages')+' d’un inconnu. Choisis ses réponses.</p>'},
  saySt:'Ouvre le Téléphone de Marie : quelqu’un l’appelle. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Relis les signaux d’alerte et recommence avec un autre personnage.'},
  win:'Tu as coupé et vérifié par un autre chemin. C’est le meilleur réflexe.',
  bad:'L’autre a obtenu ce qu’il voulait. Relis les signaux d’alerte.'}
};
})();
/* Mission 7 : vulnérabilité et correctif */
(function(){
var A0,T={};
var SC=[
 [{id:'win',t:'Windows : mise à jour de sécurité cumulative',d:'Corrige une faille critique atteignable depuis Internet. Publiée il y a 6 mois, jamais installée.',sec:1,tag:'Windows'},
  {id:'nav',t:'Navigateur : correctif de sécurité',d:'Tu l’ouvres tous les jours.',sec:1,tag:'Navigateur'},
  {id:'pdf',t:'Lecteur PDF : correctif de sécurité',d:'Ce logiciel ouvre les fichiers que les autres t’envoient.',sec:1,tag:'Lecteur PDF'},
  {id:'emo',t:'Pack d’émojis et nouveau thème de couleurs',d:'Ajoute seulement du confort : aucune faille corrigée.',sec:0}],
 [{id:'win',t:'Windows : mise à jour de sécurité cumulative',d:'Corrige une faille critique atteignable depuis Internet.',sec:1,tag:'Windows'},
  {id:'av',t:'Antivirus : nouvelles définitions de virus',d:'Sans elles, l’antivirus ne reconnaît pas les menaces récentes.',sec:1,tag:'Antivirus'},
  {id:'nav',t:'Navigateur : correctif de sécurité',d:'Corrige une faille exploitée par des sites piégés.',sec:1,tag:'Navigateur'},
  {id:'vid',t:'Lecteur vidéo : nouveaux filtres et nouveau fond d’écran',d:'Aucune faille corrigée : du confort.',sec:0},
  {id:'son',t:'Nouveaux sons de notification',d:'Seulement du confort.',sec:0}],
 [{id:'win',t:'Windows : mise à jour de sécurité cumulative',d:'Corrige une faille critique atteignable depuis Internet.',sec:1,tag:'Windows'},
  {id:'off',t:'Suite bureautique : correctif de sécurité',d:'Corrige une faille qui s’ouvre avec un document piégé.',sec:1,tag:'Suite bureautique'},
  {id:'nav',t:'Navigateur : correctif de sécurité',d:'Tu l’ouvres tous les jours.',sec:1,tag:'Navigateur'},
  {id:'pho',t:'Application photos : nouveaux albums partagés',d:'Une nouveauté, aucune faille corrigée.',sec:0},
  {id:'dark',t:'Thème sombre pour tout le système',d:'Du confort, pas de la protection.',sec:0}]
];
function L(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={st:{},router:'old',busy:false,page:'Mises à jour',bpage:'start',botHTML:'',asked:false}}
function allSec(){return L().filter(function(u){return u.sec}).every(function(u){return T.st[u.id]==='done'})}
function settings(w,A){
  w.title.textContent='Paramètres';
  var pages=['Système','Réseau','Mises à jour'],h='<div class="a-set"><nav>'+pages.map(function(n){return'<button data-p="'+n+'" class="'+(n===T.page?'on':'')+'">'+n+'</button>'}).join('')+'</nav><main><h3>'+T.page+'</h3>';
  function row(a,b,r){return'<div class="row"><div>'+a+(b?'<small>'+b+'</small>':'')+'</div>'+(r||'')+'</div>'}
  if(T.page==='Système')h+=row('PC-'+A.esc(A.P().pre.toUpperCase()),'Ordinateur fictif')+row('Mémoire','8 Go');
  else if(T.page==='Réseau')h+=row('Wi-Fi','Maison · connecté','<span>✓</span>')+row('Box Internet','Micrologiciel de 2023 · se gère dans le navigateur (192.168.1.1)');
  else{
    L().forEach(function(u){
      var s=T.st[u.id];
      h+=row('<b>'+A.esc(u.t)+'</b>',A.esc(u.d),s==='busy'?'<span>Installation…</span>':(s==='done'?MX.pill('ok','Installé ✓'):'<button class="btn" data-i="'+u.id+'">Installer</button>'));
    });
    h+='<div class="mx-bar"><button class="btn" id="m7Go"'+(T.busy?' disabled':'')+'>🔍 Lancer le scanner de pirates</button></div><div id="aBot">'+(T.botHTML||'')+'</div>';
  }
  w.body.innerHTML=h+'</main></div>';
  w.body.querySelectorAll('nav button').forEach(function(b){b.onclick=function(){T.page=b.getAttribute('data-p');settings(w,A)}});
  w.body.querySelectorAll('[data-i]').forEach(function(b){b.onclick=function(){var id=b.getAttribute('data-i');T.st[id]='busy';T.botHTML='';settings(w,A);setTimeout(function(){T.st[id]='done';if(allSec())A.step(1);if(A.wins.settings)settings(A.wins.settings,A)},1300)}});
  var g=A.$('m7Go');if(g)g.onclick=check;
}
function browser(w,A){
  var home=T.bpage==='start';w.title.textContent=(home?'Nouvel onglet':'Box Internet')+' – Navigateur';
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(home?'Nouvel onglet':'Box Internet')+'</div></div><div class="a-url"><button disabled>←</button><span>'+(home?'accueil':'192.168.1.1')+'</span></div><div class="a-page" style="padding:0">';
  if(home)h+='<div style="padding:22px 20px"><h3>Page d’accueil</h3><p>Tes favoris :</p><button class="a-bm" id="m7Box">📡 Box Internet (192.168.1.1)</button></div>';
  else{
    h+='<div class="mx"><h3>Box Internet</h3><div class="mx-row"><div><b>Micrologiciel</b><br><small>'+(T.router==='done'?'Version 2.4.1 (à jour)':T.router==='busy'?'Installation en cours…':'Version 1.0.3 · 2023 · une mise à jour de sécurité est disponible')+'</small></div>'+(T.router==='done'?MX.pill('ok','À jour ✓'):T.router==='busy'?'<span>…</span>':'<button class="mx-b pri" id="m7Fw">Mettre à jour</button>')+'</div><button class="mx-b" id="m7Back">← Retour</button></div>';
  }
  w.body.innerHTML=h+'</div></div>';
  var b=A.$('m7Box');if(b)b.onclick=function(){T.bpage='box';browser(w,A)};
  var f=A.$('m7Fw');if(f)f.onclick=function(){T.router='busy';browser(w,A);setTimeout(function(){T.router='done';A.step(2);if(A.wins.browser)browser(A.wins.browser,A)},1500)};
  var k=A.$('m7Back');if(k)k.onclick=function(){T.bpage='start';browser(w,A)};
}
function check(){
  if(T.busy)return;var A=A0,why=[],rows=[];
  L().filter(function(u){return u.sec}).forEach(function(u){var ok=T.st[u.id]==='done';rows.push({k:u.tag+' : faille connue',bad:!ok,badLabel:'✕ exploitée',goodLabel:'✓ corrigée'});if(!ok)why.push('<b>'+A.esc(u.tag)+'</b> : le trou connu est toujours là, le mode d’emploi circule librement.')});
  rows.push({k:'Box Internet : faille connue',bad:T.router!=='done',badLabel:'✕ exploitée',goodLabel:'✓ corrigée'});if(T.router!=='done')why.push('<b>La box Internet</b> : on l’oublie, mais elle est visible de l’extérieur. Ses trous s’accumulent depuis trois ans.');
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.botHTML='';if(A.wins.settings)settings(A.wins.settings,A);
  A.runBot(A.$('aBot'),'🕵️ Scanner de pirates (simulation)',rows,function(){return res.ok?'<b class="good">Le scanner ne trouve plus aucun trou connu.</b>':'<b class="bad">Le pirate est entré par un trou connu.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;if(A.wins.settings)settings(A.wins.settings,A);A.finish(res)});
}
window.MISSIONS[7]={
 defiId:'defi-08-vulnerabilite-correctif-patch',
 reset:reset,
 apps:{settings:settings,browser:browser},
 onOpen:function(id,A){if(id==='settings')A.step(0)},
 cfg:{tag:'Mission 7 · Défi 7',title:'Reboucher les trous avant qu’on s’y glisse',
  steps:['Ouvrir Paramètres › Mises à jour','Installer les correctifs de sécurité','Penser à la box Internet (dans le Navigateur)','Lancer le scanner : plus aucun trou connu'],
  help:[['Indice','Un trou de sécurité qu’on n’a pas bouché, c’est une porte dont tout le monde connaît le mode d’emploi.'],['Méthode','Installe d’abord ce qui bouche un trou : surtout ce que tu utilises tous les jours, ce qui ouvre des fichiers d’inconnus et ce qui est visible d’Internet.'],['Explication','Les pirates visent les trous connus mais pas encore bouchés. Les nouveautés de confort (émojis, thèmes) peuvent attendre.'],['Accompagnement','Installe chaque correctif de sécurité. Puis pense à la box Internet : elle a aussi son propre logiciel, dans le Navigateur (192.168.1.1).'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Un correctif de sécurité est disponible. Quand l’installes-tu ?", "o": ["Dès que possible", "Dans six mois", "Jamais, ça marche déjà"], "ok": 0, "why": "Un trou connu mais pas bouché est une porte dont tout le monde connaît le mode d’emploi."}]],
  notion:'<p>Une <b>vulnérabilité</b>, c’est un trou connu dans un logiciel. Un <b>correctif</b> (patch), c’est le ciment qu’on met dedans. La <b>mise à jour</b>, c’est le geste de reboucher.</p><p style="margin-top:8px"><b>Exemple :</b> un correctif publié il y a six mois et jamais installé, c’est un trou que tout le monde connaît depuis six mois.</p>',
  intro:'L’ordinateur de Marie a des trous. Bouche-les.',
  ex:function(){return'<p>Cette fois, sans aide. Mets à jour l’ordinateur de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> comme il faut.</p>'},
  saySt:'Ouvre les Paramètres de Marie, puis regarde les mises à jour. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Protection : '+p+' %. Regarde quels trous restent ouverts et recommence avec un autre personnage.'},
  win:'Tous les trous connus sont bouchés. Les nouveautés de confort peuvent attendre.',
  bad:'Un pirate est entré par un trou connu. Regarde lequel.'}
};
})();
/* Mission 8 : pare-feu (portier) */
(function(){
var A0,T={};
var SC=[
 {prof:{d:true,p:true,pu:false},rules:[
  {n:'Pages web que tu demandes',port:443,o:'demande',need:1,on:1},
  {n:'Mises à jour que l’ordinateur va chercher lui-même',port:443,o:'demande',need:1,on:1},
  {n:'Imprimante du salon',port:9100,o:'maison',need:1,on:1},
  {n:'Bureau à distance',port:3389,o:'internet',need:0,on:1},
  {n:'Caméra de la maison',port:554,o:'internet',need:0,on:1},
  {n:'Partage de fichiers',port:445,o:'internet',need:0,on:1}]},
 {prof:{d:true,p:false,pu:true},rules:[
  {n:'Télé qui parle au service de vidéos',port:443,o:'demande',need:1,on:1},
  {n:'Mises à jour que l’ordinateur va chercher lui-même',port:443,o:'demande',need:1,on:1},
  {n:'Imprimante du bureau',port:9100,o:'maison',need:1,on:1},
  {n:'Porte réservée à l’administrateur',port:22,o:'internet',need:0,on:1},
  {n:'Caméra de la maison',port:8554,o:'internet',need:0,on:1},
  {n:'Bureau à distance',port:3389,o:'internet',need:0,on:0}]},
 {prof:{d:true,p:true,pu:true},rules:[
  {n:'Pages web que tu demandes',port:443,o:'demande',need:1,on:1},
  {n:'Imprimante de la maison',port:9100,o:'maison',need:1,on:1},
  {n:'Ta télé, qui parle au service de vidéos choisi',port:443,o:'demande',need:1,on:1},
  {n:'Porte réservée à l’administrateur',port:8080,o:'internet',need:0,on:1},
  {n:'Partage de fichiers',port:445,o:'internet',need:0,on:1},
  {n:'Caméra du chalet',port:554,o:'internet',need:0,on:1},
  {n:'Bureau à distance',port:3389,o:'internet',need:0,on:1}]}
];
var OL={demande:'ce que tu as demandé',maison:'vient de la maison',internet:'vient d’Internet, sans invitation'};
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;var s=S();T={prof:{d:s.prof.d,p:s.prof.p,pu:s.prof.pu},rules:s.rules.map(function(r){return{n:r.n,port:r.port,o:r.o,need:r.need,on:!!r.on}}),busy:false,botHTML:'',seenProf:false,seenFix:false}}
function sec(w,A){
  w.title.textContent='Sécurité Windows';
  var all=T.prof.d&&T.prof.p&&T.prof.pu;
  var h='<div class="a-set"><main style="width:100%"><h3>'+(all?'✅ Pare-feu actif sur tous les réseaux':'⚠️ Le pare-feu est coupé sur un réseau')+'</h3>';
  function row(a,b,r){return'<div class="row"><div>'+a+(b?'<small>'+b+'</small>':'')+'</div>'+(r||'')+'</div>'}
  function tg(k,on){return'<span class="a-tg'+(on?' on':'')+'" data-p="'+k+'" role="switch" aria-checked="'+on+'" tabindex="0"></span>'}
  h+=row('Réseau de domaine','Réseau du travail',tg('d',T.prof.d))+row('Réseau privé','Ta maison',tg('p',T.prof.p))+row('Réseau public','Café, bibliothèque, aéroport',tg('pu',T.prof.pu));
  h+='<h3 style="font-size:15px;margin:14px 0 8px">Portes autorisées</h3><p style="font-size:12px;color:#555;margin-bottom:8px">Le portier laisse passer ce qui est autorisé et bloque le reste.</p>';
  T.rules.forEach(function(r,i){h+=row('<b>'+A.esc(r.n)+'</b>','Porte '+r.port+' · '+OL[r.o],'<span class="a-tg'+(r.on?' on':'')+'" data-r="'+i+'" role="switch" aria-checked="'+r.on+'" tabindex="0"></span>')});
  h+='<div class="mx-bar"><button class="btn" id="m8Go"'+(T.busy?' disabled':'')+'>🔍 Lancer le scanner depuis Internet</button></div><div id="aBot">'+(T.botHTML||'')+'</div>';
  w.body.innerHTML=h+'</main></div>';
  w.body.querySelectorAll('[data-p]').forEach(function(t){t.onclick=function(){if(T.busy)return;var k=t.getAttribute('data-p');T.prof[k]=!T.prof[k];T.botHTML='';if(T.prof.d&&T.prof.p&&T.prof.pu)A.step(1);sec(w,A)}});
  w.body.querySelectorAll('[data-r]').forEach(function(t){t.onclick=function(){if(T.busy)return;var r=T.rules[+t.getAttribute('data-r')];r.on=!r.on;T.botHTML='';if(T.rules.every(function(x){return x.o!=='internet'||!x.on}))A.step(2);sec(w,A)}});
  A.$('m8Go').onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,why=[],rows=[];
  var all=T.prof.d&&T.prof.p&&T.prof.pu;
  rows.push({k:'Pare-feu actif sur chaque réseau',bad:!all,badLabel:'✕ coupé quelque part',goodLabel:'✓ actif'});if(!all)why.push('Le pare-feu est coupé sur un réseau : sans portier, tout peut entrer.');
  T.rules.forEach(function(r){
    if(r.need){var bad=!r.on;rows.push({k:r.n+' (porte '+r.port+')',bad:bad,badLabel:'✕ bloqué à tort',goodLabel:'✓ fonctionne'});if(bad)why.push('« '+A.esc(r.n)+' » est bloqué alors que c’est '+(r.o==='maison'?'la maison':'ce que tu as demandé')+' : le portier doit laisser passer.')}
    else{var bad2=r.on;rows.push({k:r.n+' (porte '+r.port+')',bad:bad2,badLabel:'✕ porte ouverte',goodLabel:'✓ fermée'});if(bad2)why.push('« '+A.esc(r.n)+' » : personne ne l’a demandé depuis Internet. Cette porte-là ne s’ouvre jamais au public.')}
  });
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.botHTML='';if(A.wins.security)sec(A.wins.security,A);
  A.runBot(A.$('aBot'),'🕵️ Scanner d’Internet (simulation)',rows,function(){return res.ok?'<b class="good">Le portier fait bien son travail.</b> Rien n’entre sans invitation, et tout ce qui est prévu passe.':'<b class="bad">Le scanner a trouvé un problème.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;if(A.wins.security)sec(A.wins.security,A);A.finish(res)});
}
window.MISSIONS[8]={
 defiId:'defi-8-le-portier-de-ton-reseau',
 reset:reset,
 apps:{security:sec},
 onOpen:function(id,A){if(id==='security')A.step(0)},
 cfg:{tag:'Mission 8 · Défi 8',title:'Le portier de ton réseau',
  steps:['Ouvrir Sécurité Windows','S’assurer que le pare-feu est actif sur tous les réseaux','Fermer les portes que personne n’a demandées','Lancer le scanner d’Internet : le portier doit bien travailler'],
  help:[['Indice','Le portier a une liste : il laisse passer ce que l’habitant a demandé ou ce qui vient de la maison. Le reste, il le bloque.'],['Méthode','Regarde l’origine de chaque porte. Ce que tu as demandé et ce qui vient de la maison reste ouvert. Ce qui vient d’Internet sans invitation se ferme.'],['Explication','Une porte ouverte sans raison est une porte qu’un inconnu peut essayer. Mais si tu bloques ton imprimante, elle ne marche plus.'],['Accompagnement','Vérifie les trois interrupteurs du haut (domaine, privé, public). Puis, dans la liste, coupe seulement les portes marquées « vient d’Internet, sans invitation ».'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Le pare-feu bloque une connexion qui vient d’Internet sans que tu l’aies demandée. Est-ce bon ?", "o": ["Oui, le portier fait son travail", "Non, il faut tout laisser entrer", "Ça dépend de la couleur de la fenêtre"], "ok": 0, "why": "Ce qui n’a pas été demandé et ne vient pas de la maison reste dehors."}]],
  notion:'<p>Un <b>pare-feu</b>, c’est le portier de ton réseau. Il a une liste : il laisse passer ce qui est prévu, bloque le reste.</p><p style="margin-top:8px"><b>Exemple :</b> la page web que tu viens de demander peut revenir. Une connexion qui frappe à ta caméra depuis Internet, sans invitation, reste dehors.</p>',
  intro:'Le portier de Marie est un peu perdu. Aide-le à bien faire sa liste.',
  ex:function(){return'<p>Cette fois, sans aide. Règle le pare-feu de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b>.</p>'},
  saySt:'Ouvre Sécurité Windows : le pare-feu est là. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Regarde ce que le scanner a trouvé et recommence avec un autre personnage.'},
  win:'Les inconnus restent dehors, et la maison fonctionne. C’est un bon portier.',
  bad:'Le scanner a trouvé un problème. Regarde quoi.'}
};
})();
/* Mission 9 : rançongiciel et règle 3-2-1 */
(function(){
var A0,T={};
var ICON={ext:'💽',usb:'🔌',nas:'🗄️',cloud:'☁️'};
var SC=[
 {what:'les photos de famille de Marie',devs:[{id:'ext',n:'Disque externe',sub:'branché au port USB',net:0},{id:'usb',n:'Clé USB',sub:'branchée au port USB',net:0},{id:'cloud',n:'Service en ligne (nuage)',sub:'copie envoyée par Internet',net:0}]},
 {what:'les souvenirs de hockey et de famille de Marc',devs:[{id:'nas',n:'Boîtier de stockage de la maison (NAS)',sub:'toujours connecté au réseau de la maison',net:1},{id:'ext',n:'Disque externe',sub:'branché au port USB',net:0},{id:'cloud',n:'Service en ligne (nuage)',sub:'copie envoyée par Internet',net:0}]},
 {what:'les recettes et les photos de Julie',devs:[{id:'ext',n:'Disque externe',sub:'branché au port USB',net:0},{id:'usb',n:'Clé USB',sub:'branchée au port USB',net:0},{id:'cloud',n:'Service en ligne (nuage)',sub:'copie envoyée par Internet',net:0}]}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={d:{},busy:false,botHTML:''};S().devs.forEach(function(d){T.d[d.id]={copy:false,plugged:d.id!=='cloud',busy:false}})}
function nCopies(){return S().devs.filter(function(d){return T.d[d.id].copy}).length}
function sauv(w,A){
  var s=S();w.title.textContent='Centre de sauvegarde';
  var h='<div class="mx"><h3>💾 Sauvegarde</h3><p>À protéger : <b>'+A.esc(s.what)+'</b> (sur le disque de l’ordinateur).</p>';
  s.devs.forEach(function(d){
    var x=T.d[d.id];
    h+='<div class="mx-row"><div class="mx-dev"><i>'+ICON[d.id]+'</i><div><b>'+A.esc(d.n)+'</b><br><small>'+(d.id==='cloud'?'Nuage':x.plugged?A.esc(d.sub):'débranché')+(x.copy?' · copie présente':' · aucune copie')+'</small></div></div><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">'
     +'<button class="mx-b" data-c="'+d.id+'"'+((x.busy||T.busy||(d.id!=='cloud'&&!x.plugged))?' disabled':'')+'>'+(x.busy?'Copie…':x.copy?'Recopier':'Copier ici')+'</button>'
     +((d.id==='cloud'||d.net)?'':'<button class="mx-b" data-u="'+d.id+'"'+(T.busy?' disabled':'')+'>'+(x.plugged?'Débrancher':'Rebrancher')+'</button>')+'</div></div>';
  });
  h+='<div class="mx-bar"><button class="mx-b pri" id="m9Go"'+(T.busy?' disabled':'')+'>☠️ Lancer la rançon (simulation)</button></div><div id="aBot">'+(T.botHTML||'')+'</div></div>';
  w.body.innerHTML=h;
  MX.on(w,'[data-c]',function(b){var id=b.getAttribute('data-c');T.d[id].busy=true;T.botHTML='';sauv(w,A);setTimeout(function(){T.d[id].busy=false;T.d[id].copy=true;if(nCopies()>=2)A.step(1);if(A.wins.sauv)sauv(A.wins.sauv,A)},1100)});
  MX.on(w,'[data-u]',function(b){var id=b.getAttribute('data-u');T.d[id].plugged=!T.d[id].plugged;T.botHTML='';if(!T.d[id].plugged&&T.d[id].copy)A.step(2);sauv(w,A)});
  A.$('m9Go').onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,s=S(),rows=[],why=[];
  T.busy=true;T.botHTML='';if(A.wins.sauv)sauv(A.wins.sauv,A);
  var surv=0,types={pc:1},copies=1;
  rows.push({k:'Disque de l’ordinateur (l’original)',bad:true,badLabel:'🔒 chiffré',info:1});
  s.devs.forEach(function(d){
    var x=T.d[d.id];if(!x.copy)return;
    copies++;types[d.id==='cloud'?'cloud':d.id]=1;
    var safe=d.id==='cloud'||!x.plugged;if(safe)surv++;
    rows.push({k:d.n,bad:!safe,badLabel:'🔒 chiffré (branché)',goodLabel:'✓ intact',info:1});
  });
  var nt=Object.keys(types).length;
  rows.push({k:'Règle 3-2-1 : 3 copies',bad:copies<3,badLabel:'✕ '+copies+' seulement',goodLabel:'✓ '+copies});if(copies<3)why.push('Il te faut 3 copies en tout (l’original + 2). Là, tu en as '+copies+'.');
  rows.push({k:'Règle 3-2-1 : 2 supports différents',bad:nt<2,badLabel:'✕ '+nt+' seulement',goodLabel:'✓ '+nt});if(nt<2)why.push('Tout est sur le même type de support : un seul incident et tout part.');
  rows.push({k:'Règle 3-2-1 : 1 copie ailleurs ou débranchée',bad:surv<1,badLabel:'✕ aucune',goodLabel:'✓ oui'});if(surv<1)why.push('Une rançon chiffre tout ce qui est branché à l’ordinateur. Aucune de tes copies n’est restée à l’abri : débranche le disque ou envoie une copie dans le nuage.');
  var okRows=rows.filter(function(r){return!r.info}),okn=okRows.filter(function(r){return!r.bad}).length,res={ok:okn===okRows.length,pct:Math.round(okn/okRows.length*100)};
  A.runBot(A.$('aBot'),'☠️ Rançongiciel (simulation)',rows,function(){return res.ok?'<b class="good">Tes souvenirs sont sauvés.</b> L’original est chiffré, mais une copie a échappé à la rançon.':'<b class="bad">Les souvenirs sont perdus (ou en danger).</b><br>• '+why.join('<br>• ')+(surv<1?'<br><small>Et payer ne garantit rien : c’est un pari, pas une sauvegarde.</small>':'')},function(html){T.botHTML=html;T.busy=false;if(A.wins.sauv)sauv(A.wins.sauv,A);A.finish(res)});
}
window.MISSIONS[9]={
 defiId:'defi-09-rancongiciel-ransomware-regle-3-2-1',
 extra:{sauv:{t:'Centre de sauvegarde',x:90,y:24,w:520,h:420,icon:'<svg viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" rx="3" fill="#2f9e8f"/><circle cx="23" cy="16" r="2.2" fill="#d7fff6"/><path d="M8 13h9M8 17h6" stroke="#d7fff6" stroke-width="2" stroke-linecap="round"/></svg>'}},
 reset:reset,
 apps:{sauv:sauv},
 onOpen:function(id,A){if(id==='sauv')A.step(0)},
 cfg:{tag:'Mission 9 · Défi 9',title:'Une copie ailleurs, avant que la rançon frappe',
  steps:['Ouvrir le Centre de sauvegarde','Faire des copies sur au moins deux destinations','Débrancher ce qui doit l’être','Lancer la rançon (simulation) : une copie doit survivre'],
  help:[['Indice','Une rançon chiffre tout ce qui est branché à l’ordinateur à ce moment-là, y compris les disques et les clés.'],['Méthode','La règle 3-2-1 : 3 copies, sur 2 supports différents, dont 1 loin de l’ordinateur ou débranchée.'],['Explication','Si l’original est pris, une copie qui n’était pas branchée (ou qui est dans le nuage) n’est pas touchée.'],['Accompagnement','Copie sur deux destinations (par exemple le disque externe et le nuage). Puis débranche le disque : une copie branchée est chiffrée avec le reste.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Tes fichiers sont sur ton ordinateur et sur un disque externe toujours branché. Si une rançon chiffre l’ordinateur, que devient le disque ?", "o": ["Il est protégé, il est à part", "Il est probablement chiffré aussi, car il est branché", "Il disparaît"], "ok": 1, "why": "Une copie branchée peut être chiffrée avec le reste. D’où la copie ailleurs, débranchée."}]],
  notion:'<p>Un <b>rançongiciel</b> chiffre tes fichiers et te réclame de l’argent. La seule vraie parade, c’est une copie ailleurs qui ne dépend pas de ta machine : la <b>règle 3-2-1</b>.</p><p style="margin-top:8px"><b>Exemple :</b> un disque externe laissé branché en permanence est chiffré avec le reste. Une copie utile est débranchée.</p>',
  intro:'Marie veut mettre ses souvenirs à l’abri d’une rançon.',
  ex:function(){return'<p>Cette fois, sans aide. Protège '+A0.esc(S().what)+' d’une rançon.</p>'},
  saySt:'Ouvre le Centre de sauvegarde de Marie. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Regarde ce que la rançon a pris et recommence avec un autre personnage.'},
  win:'L’original est tombé, mais une copie a survécu. C’est exactement à ça que sert la règle 3-2-1.',
  bad:'La rançon a tout pris. Regarde ce qui manquait.'}
};
})();
/* Mission 10 : chiffrement et HTTPS */
(function(){
var A0,T={};
var SC=[
 {net:'Wi-Fi du café (réseau public)',pages:[
  {u:'ma-banque-exemple.fr',http:1,https:1,t:'Connexion à ta banque',f:['Courriel','Mot de passe'],real:1},
  {u:'boutique.exemple.com/panier',http:0,t:'Ton panier',f:['Adresse de livraison','Numéro de carte'],real:1},
  {u:'wifi-cafe-gratuit.fr/connexion',http:1,https:0,t:'Connexion au Wi-Fi du café',f:['Courriel','Mot de passe'],real:1},
  {u:'clinique-exemple.ca/rendez-vous',http:0,t:'Demande de rendez-vous',f:['Nom','Téléphone'],real:1},
  {u:'bnq-secure-verif.com',http:0,t:'Banque du Québec : vérification',f:['Courriel','Mot de passe'],real:0},
  {u:'club-lecture-exemple.org/inscription',http:1,https:1,t:'Inscription au club de lecture',f:['Courriel','Mot de passe'],real:1}]},
 {net:'Wi-Fi de l’aéroport (réseau public)',pages:[
  {u:'ma-caisse-exemple.ca/acces',http:1,https:1,t:'Accès à ta caisse',f:['Numéro de membre','Mot de passe'],real:1},
  {u:'billets-hockey.example/paiement',http:0,t:'Paiement de tes billets',f:['Nom','Numéro de carte'],real:1},
  {u:'wifi-aeroport-gratuit.example/login',http:1,https:0,t:'Connexion au Wi-Fi gratuit',f:['Courriel','Mot de passe'],real:1},
  {u:'pharmacie-exemple.ca/renouveler',http:0,t:'Renouvellement d’ordonnance',f:['Nom','Numéro de dossier'],real:1},
  {u:'caisse-secure-verif.com',http:0,t:'Caisse : vérification de sécurité',f:['Numéro de membre','Mot de passe'],real:0},
  {u:'ligue-exemple.org/inscription',http:1,https:1,t:'Inscription à la ligue',f:['Courriel','Mot de passe'],real:1}]},
 {net:'Wi-Fi de la bibliothèque (réseau public)',pages:[
  {u:'epicerie-exemple.ca/connexion',http:1,https:1,t:'Connexion à l’épicerie en ligne',f:['Courriel','Mot de passe'],real:1},
  {u:'recettes-exemple.ca/compte',http:0,t:'Ton compte de recettes',f:['Courriel','Mot de passe'],real:1},
  {u:'wifi-biblio-gratuit.example/connexion',http:1,https:0,t:'Connexion au Wi-Fi de la bibliothèque',f:['Courriel','Mot de passe'],real:1},
  {u:'dentiste-exemple.ca/rendez-vous',http:0,t:'Rendez-vous chez le dentiste',f:['Nom','Téléphone'],real:1},
  {u:'banque-exemple-verification.com',http:0,t:'Banque : vérification de ton compte',f:['Courriel','Mot de passe'],real:0},
  {u:'tricot-exemple.org/inscription',http:1,https:1,t:'Inscription au cercle de tricot',f:['Courriel','Mot de passe'],real:1}]}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={cur:null,p:S().pages.map(function(){return{act:null,sw:false}}),busy:false,botHTML:'',saw:''}}
function isHttps(i){var p=S().pages[i];return !p.http||T.p[i].sw}
function done(){return T.p.every(function(x){return x.act})}
function browser(w,A){
  var s=S();w.title.textContent='Navigateur · '+s.net;
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(T.cur==null?'Favoris':'Page')+'</div></div>';
  if(T.cur==null){
    h+='<div class="a-url"><button disabled>←</button><span>favoris · '+A.esc(s.net)+'</span></div><div class="a-page" style="padding:0"><div class="mx"><h3>Favoris</h3><p>Tu es sur le '+A.esc(s.net)+'. Visite chaque page et décide quoi faire.</p>';
    s.pages.forEach(function(p,i){var x=T.p[i];h+='<div class="mx-row"><div><b>'+A.esc(p.t)+'</b></div><div style="display:flex;gap:8px;align-items:center">'+(x.act?MX.pill(x.act==='send'?'ok':'warn',x.act==='send'?'envoyé':'quitté'):'')+'<button class="mx-b" data-v="'+i+'"'+(T.busy?' disabled':'')+'>'+(x.act?'Revoir':'Visiter')+'</button></div></div>'});
    h+='<div class="mx-bar"><button class="mx-b pri" id="m10Go"'+(done()&&!T.busy?'':' disabled')+'>👀 Lancer le curieux du café</button></div><div id="aBot">'+(T.botHTML||'')+'</div></div></div>';
  }else{
    var p=s.pages[T.cur],x=T.p[T.cur],hs=isHttps(T.cur);
    h+='<div class="a-url"><button id="m10Back">←</button><span>'+(hs?'🔒 https://':'⚠️ http://')+A.esc(p.u)+'</span></div><div class="a-page" style="padding:0"><div class="mx"><h3>'+A.esc(p.t)+'</h3><p>'+(hs?'Connexion chiffrée (cadenas).':'Connexion non chiffrée : pas de cadenas.')+'</p><div class="mx-card">';
    p.f.forEach(function(f){h+='<label style="display:block;margin-bottom:8px;font-size:12px;color:#4a5a66">'+A.esc(f)+'<br><input type="text" readonly value="'+(/mot de passe/i.test(f)?'••••••••••':/carte/i.test(f)?'4512 •••• •••• 8890':'exemple')+'" style="width:100%"></label>'});
    h+='<div class="mx-bar"><button class="mx-b pri" id="m10Send">Envoyer</button>'+(p.http&&p.https&&!x.sw?'<button class="mx-b" id="m10Sw">Essayer en https://</button>':'')+'<button class="mx-b" id="m10Quit">Quitter la page</button></div></div>';
    if(T.saw)h+='<div class="a-bot" style="margin-top:10px"><h4>👀 Ce que voit le curieux du café</h4>'+T.saw+'</div>';
    h+='</div></div>';
  }
  w.body.innerHTML=h+'</div>';
  MX.on(w,'[data-v]',function(b){T.cur=+b.getAttribute('data-v');T.saw='';T.botHTML='';A.step(1);browser(w,A)});
  var bk=A.$('m10Back');if(bk)bk.onclick=function(){T.cur=null;T.saw='';browser(w,A)};
  var sw=A.$('m10Sw');if(sw)sw.onclick=function(){T.p[T.cur].sw=true;T.saw='';browser(w,A)};
  var q=A.$('m10Quit');if(q)q.onclick=function(){T.p[T.cur].act='quit';T.cur=null;T.saw='';A.step(2);browser(w,A)};
  var sd=A.$('m10Send');if(sd)sd.onclick=function(){
    var p=S().pages[T.cur],hs=isHttps(T.cur);T.p[T.cur].act='send';A.step(2);
    if(A.phase()==='pratique'){
      if(!hs)T.saw='<p style="margin:0">Il lit tout, comme sur une carte postale :<br><b style="color:#ff8a80">'+p.f.map(function(f){return A.esc(f)+' : '+(/mot de passe/i.test(f)?'MonMotDePasse1':/carte/i.test(f)?'4512 3456 7890 8890':'exemple')}).join('<br>')+'</b></p>';
      else if(!p.real)T.saw='<p style="margin:0">Tout est chiffré en route… mais ça arrive chez un <b style="color:#ff8a80">imposteur</b> : le cadenas ne prouve pas que c’est ta vraie banque.</p>';
      else T.saw='<p style="margin:0">▒▒▒ ▒▒▒▒▒▒ ▒▒ ▒▒▒▒▒▒▒ : il ne voit qu’une bouillie illisible.</p>';
      browser(w,A);
    }else{T.cur=null;T.saw='';browser(w,A)}};
  var go=A.$('m10Go');if(go)go.onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,s=S(),why=[],rows=s.pages.map(function(p,i){
    var x=T.p[i],hs=isHttps(i),bad=false,r={k:p.t};
    if(x.act==='send'){
      if(!hs){bad=true;r.badLabel='✕ lu en clair';why.push('<b>'+A.esc(p.t)+'</b> : tu as envoyé tes infos sur une page sans cadenas. Tout voyageait à découvert dans la salle.')}
      else if(!p.real){bad=true;r.badLabel='✕ chez un imposteur';why.push('<b>'+A.esc(p.t)+'</b> : le cadenas était là, mais l’adresse (<i>'+A.esc(p.u)+'</i>) n’est pas la vraie. Le cadenas protège ce que tu dis, pas à qui tu le dis.')}
      else r.goodLabel='✓ illisible pour lui';
    }else{
      if(hs&&p.real){bad=true;r.badLabel='✕ page sûre évitée';why.push('<b>'+A.esc(p.t)+'</b> : la page était chiffrée et honnête, tu pouvais t’en servir.')}
      else r.goodLabel='✓ évitée avec raison'
    }
    r.bad=bad;return r});
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.botHTML='';browser(A.wins.browser,A);
  A.runBot(A.$('aBot'),'👀 Le curieux du café (simulation)',rows,function(){return res.ok?'<b class="good">Le curieux n’a rien lu d’utile.</b> Enveloppe fermée, bonne adresse, chaque fois.':'<b class="bad">Le curieux a ramassé de quoi faire mal.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;if(A.wins.browser)browser(A.wins.browser,A);A.finish(res)});
}
window.MISSIONS[10]={
 defiId:'defi-07-chiffrement-https-tls',
 geom:{browser:{x:60,y:20,w:560,h:430}},
 reset:reset,
 apps:{browser:browser},
 onOpen:function(id,A){if(id==='browser')A.step(0)},
 cfg:{tag:'Mission 10 · Défi 10',title:'La carte postale et la lettre scellée',
  steps:['Ouvrir le Navigateur (réseau du café)','Visiter les pages des favoris','Décider pour chaque page : envoyer, passer en https:// ou quitter','Lancer le curieux du café : il ne doit rien lire d’utile'],
  help:[['Indice','Regarde le début de l’adresse et le cadenas. Puis lis l’adresse en entier, lettre par lettre.'],['Méthode','Sans cadenas (http://), ce que tu écris voyage à découvert. Avec le cadenas (https://), c’est illisible en route. Mais le cadenas ne dit pas à qui tu écris.'],['Explication','Sur un réseau public, tout le monde dans la salle peut regarder passer ce que tu envoies. Un faux site peut aussi avoir un cadenas.'],['Accompagnement','Si la page est en http:// : essaie la version https:// si elle existe, sinon quitte. Si elle est en https:// mais que l’adresse n’est pas la vraie, quitte. Si tout va bien, envoie.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "La page affiche http:// sans cadenas. Que peux-tu y envoyer ?", "o": ["Mon mot de passe, ça va", "Rien de sensible : ça voyage à découvert", "Seulement mon numéro de carte"], "ok": 1, "why": "Sans chiffrement, ce que tu écris peut être lu en route."}]],
  notion:'<p>Le <b>chiffrement</b> transforme ton message en bouillie illisible pour tous, sauf pour celui qui a la clé. Dans le navigateur, c’est le <b>cadenas</b> et le <b>https://</b>.</p><p style="margin-top:8px"><b>Exemple :</b> sur http://, c’est une carte postale. Sur https://, c’est une lettre scellée. Mais la lettre peut quand même être adressée à un imposteur.</p>',
  intro:'Marie est au café, sur un réseau qu’elle ne contrôle pas. Aide-la à choisir.',
  ex:function(){return'<p>Cette fois, sans aide. <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> est sur un réseau public. Décide pour chaque page.</p>'},
  saySt:'Ouvre le Navigateur : Marie est sur le Wi-Fi du café. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Regarde ce que le curieux a lu et recommence avec un autre personnage.'},
  win:'Rien de lisible pour le curieux, rien chez les imposteurs. Le cadenas aide, mais l’adresse compte aussi.',
  bad:'Le curieux a lu quelque chose. Regarde quoi.'}
};
})();
/* Mission 11 : adresse IP, annuaire (DNS), porte (port) */
(function(){
var A0,T={};
var SC=[
 {dns:{'cafeducoin.example':'203.0.113.25','laboutique.example':'198.51.100.8','reservation.cafeducoin.example':'203.0.113.40','imprimante-cafe.example':'203.0.113.61','lecafe-voisin.example':'198.51.100.31'},
  bons:[{t:'Afficher le site chiffré (https) du Café du Coin',nom:'cafeducoin.example',port:443},{t:'Afficher l’ancien site sans chiffrement (http) de la boutique',nom:'laboutique.example',port:80},{t:'Joindre le service de réservation du café, par la porte 8443',nom:'reservation.cafeducoin.example',port:8443}]},
 {dns:{'billets-hockey.example':'192.0.2.17','ligue-exemple.org':'192.0.2.44','admin.ligue-exemple.org':'192.0.2.45','boutique-ligue.example':'192.0.2.60','arena-gatineau.example':'192.0.2.88'},
  bons:[{t:'Acheter des billets sur le site chiffré (https) des billets de hockey',nom:'billets-hockey.example',port:443},{t:'Afficher le site sans chiffrement (http) de la ligue',nom:'ligue-exemple.org',port:80},{t:'Joindre la page d’administration de la ligue, par la porte 8080',nom:'admin.ligue-exemple.org',port:8080}]},
 {dns:{'recettes-exemple.ca':'198.51.100.77','tricot-exemple.org':'198.51.100.90','catalogue.biblio-exemple.ca':'203.0.113.99','biblio-exemple.ca':'203.0.113.98','cuisine-voisine.example':'203.0.113.12'},
  bons:[{t:'Afficher le site chiffré (https) des recettes',nom:'recettes-exemple.ca',port:443},{t:'Afficher le site sans chiffrement (http) du cercle de tricot',nom:'tricot-exemple.org',port:80},{t:'Joindre le catalogue de la bibliothèque, par la porte 8081',nom:'catalogue.biblio-exemple.ca',port:8081}]}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={q:'',hist:[],res:'',ip:['','',''],pt:['','',''],busy:false,botHTML:''}}
function reseau(w,A){
  var s=S();w.title.textContent='Console réseau';
  var h='<div class="mx"><div class="mx-two"><div><h3>📖 Annuaire (DNS)</h3><p>Écris un nom : l’annuaire te donne son adresse.</p><div style="display:flex;gap:6px"><input type="text" id="m11Q" placeholder="ex. nom-du-site.example" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1;min-width:0" value="'+A.esc(T.q)+'"><button class="mx-b pri" id="m11Look">Chercher</button></div>';
  if(T.res)h+='<div class="mx-card mx-mono" style="margin-top:8px">'+T.res+'</div>';
  if(T.hist.length){h+='<h4>Déjà cherchés</h4>';T.hist.forEach(function(x){h+='<div class="mx-mono" style="font-size:12px">'+A.esc(x)+'</div>'})}
  h+='</div><div><h3>📦 Bons de livraison</h3><p>Chaque colis a besoin d’une <b>adresse (IP)</b> et d’une <b>porte</b>.</p>';
  s.bons.forEach(function(b,i){h+='<div class="mx-card"><b>'+A.esc(b.t)+'</b><br><small>Nom : '+A.esc(b.nom)+'</small><div style="display:flex;gap:6px;margin-top:6px"><input type="text" data-k="ip" data-i="'+i+'" placeholder="Adresse IP" style="flex:1;min-width:0" value="'+A.esc(T.ip[i])+'" autocomplete="off"><input type="text" data-k="pt" data-i="'+i+'" placeholder="Porte" style="width:72px" value="'+A.esc(T.pt[i])+'" autocomplete="off"></div></div>'});
  h+='<div class="mx-bar"><button class="mx-b pri" id="m11Go"'+(T.busy?' disabled':'')+'>🚚 Lancer les livraisons</button></div></div></div><div id="aBot">'+(T.botHTML||'')+'</div></div>';
  w.body.innerHTML=h;
  var q=A.$('m11Q');q.oninput=function(){T.q=q.value};
  q.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();look(w,A)}};
  A.$('m11Look').onclick=function(){look(w,A)};
  w.body.querySelectorAll('[data-k]').forEach(function(inp){inp.oninput=function(){T[inp.getAttribute('data-k')][+inp.getAttribute('data-i')]=inp.value;var ok=T.ip.every(function(v){return v.trim()})&&T.pt.every(function(v){return v.trim()});if(ok)A.step(2)}});
  A.$('m11Go').onclick=check;
}
function look(w,A){
  var n=(T.q||'').trim().toLowerCase();if(!n)return;
  var ip=S().dns[n];
  T.res=ip?A.esc(n)+' → <b>'+ip+'</b>':A.esc(n)+' : aucun nom trouvé dans l’annuaire.';
  if(ip&&T.hist.indexOf(n+' → '+ip)<0)T.hist.push(n+' → '+ip);
  if(ip)A.step(1);
  reseau(w,A);
  var q=A.$('m11Q');if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length)}
}
function check(){
  if(T.busy)return;var A=A0,s=S(),why=[],rows=s.bons.map(function(b,i){
    var ip=(T.ip[i]||'').trim(),pt=(T.pt[i]||'').trim(),good=s.dns[b.nom],bad=false,r={k:b.nom};
    if(!ip){bad=true;why.push('<b>'+A.esc(b.nom)+'</b> : aucune adresse. Le facteur ne peut pas livrer un nom : c’est l’annuaire qui le traduit en adresse.')}
    else if(/[a-z]/i.test(ip)){bad=true;why.push('<b>'+A.esc(b.nom)+'</b> : tu as écrit un nom au lieu d’une adresse. Passe par l’annuaire pour la trouver.')}
    else if(ip!==good){bad=true;why.push('<b>'+A.esc(b.nom)+'</b> : cette adresse n’est pas la bonne. Retourne chercher le nom dans l’annuaire.')}
    else if(pt!==String(b.port)){bad=true;why.push('<b>'+A.esc(b.nom)+'</b> : bonne adresse, mauvaise porte. 443 pour un site chiffré (https), 80 pour un site sans chiffrement (http), sinon le numéro demandé.')}
    r.bad=bad;r.badLabel='✕ colis perdu';r.goodLabel='✓ livré';return r});
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.botHTML='';reseau(A.wins.reseau,A);
  A.runBot(A.$('aBot'),'🚚 Le facteur d’Internet (simulation)',rows,function(){return res.ok?'<b class="good">Tous les colis sont arrivés.</b> Nom → annuaire → adresse → bonne porte.':'<b class="bad">Des colis sont perdus.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;if(A.wins.reseau)reseau(A.wins.reseau,A);A.finish(res)});
}
window.MISSIONS[11]={
 defiId:'defi-11-l-adresse-l-annuaire-et-la-porte',
 extra:{reseau:{t:'Console réseau',x:40,y:20,w:640,h:440,icon:'<svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22" rx="3" fill="#1c2a36"/><path d="M8 12l4 4-4 4" fill="none" stroke="#6fe3ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 21h8" stroke="#6fe3ff" stroke-width="2.2" stroke-linecap="round"/></svg>'}},
 reset:reset,
 apps:{reseau:reseau},
 onOpen:function(id,A){if(id==='reseau')A.step(0)},
 cfg:{tag:'Mission 11 · Défi 11',title:'L’adresse, l’annuaire et la porte',
  steps:['Ouvrir la Console réseau','Chercher une adresse dans l’annuaire (DNS)','Remplir l’adresse IP et la porte de chaque bon','Lancer les livraisons : tous les colis doivent arriver'],
  help:[['Indice','Un colis a besoin de deux choses : l’adresse de l’appareil (IP) et la porte du bon service. Le nom, lui, ne sert que pour chercher dans l’annuaire.'],['Méthode','Écris le nom dans l’annuaire pour obtenir l’adresse IP. Ensuite choisis la porte : 443 pour un site chiffré (https), 80 pour un site sans chiffrement (http), ou celle que le bon demande.'],['Explication','Le DNS traduit un nom facile à retenir en adresse. L’adresse mène à l’appareil, le numéro de porte mène au bon service sur cet appareil.'],['Accompagnement','Pour chaque bon : cherche son nom dans l’annuaire, copie l’adresse dans « Adresse IP », puis écris la porte. Lance les livraisons.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Pour joindre un service sur Internet, il faut l’adresse de l’appareil et…", "o": ["le numéro de porte du bon service", "la couleur du site", "ton mot de passe"], "ok": 0, "why": "L’adresse mène à l’appareil, le numéro de porte mène au bon service sur cet appareil."}]],
  notion:'<p>Un nom devient une adresse grâce à l’<b>annuaire (DNS)</b>. L’<b>adresse IP</b> mène à l’appareil. Le <b>port</b> (la porte) mène au bon service sur cet appareil.</p><p style="margin-top:8px"><b>Exemple :</b> cafeducoin.example → 203.0.113.25, porte 443 : le site chiffré du café.</p>',
  intro:'Aide le facteur d’Internet à livrer les colis de Marie.',
  ex:function(){return'<p>Cette fois, sans aide. Livre les colis de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b>.</p>'},
  saySt:'Ouvre la Console réseau : il y a trois colis à livrer. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Regarde quels colis sont perdus et recommence avec un autre personnage.'},
  win:'Nom, adresse, porte : tu as tout remis dans l’ordre.',
  bad:'Des colis sont perdus. Regarde pourquoi.'}
};
})();
/* Mission 12 : Wi-Fi public et VPN */
(function(){
var A0,T={};
var SC=[
 {place:'café',real:'CafeDuCoin_Clients',fake:'Cafe_Gratuit_Rapide',other:'Voisin_5G',vpnOk:'VPN de l’employeur (Entreprise Tremblay inc.)',vpnBad:'VPN-Gratuit-100%-Anonyme (éditeur inconnu)',bank:'ma-banque-exemple.fr',staff:'le personnel du café'},
 {place:'aéroport',real:'Aeroport_Passagers_Officiel',fake:'Aeroport_Wifi_Gratuit',other:'Hotspot_Marc_5G',vpnOk:'VPN de ton entreprise (Entreprise Marc ltée)',vpnBad:'FreeVPN-Anonyme-Total (éditeur inconnu)',bank:'ma-caisse-exemple.ca',staff:'le comptoir d’information'},
 {place:'bibliothèque',real:'BiblioMunicipale_Public',fake:'Biblio_Gratuit_Rapide',other:'Livre_Prive',vpnOk:'VPN de ton employeur (Ville de Trois-Rivières)',vpnBad:'Super-VPN-Gratuit-Illimité (éditeur inconnu)',bank:'ma-banque-exemple.ca',staff:'la bibliothécaire'}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={order:[0,1,2].sort(function(){return Math.random()-.5}),asked:false,net:null,vpn:{ok:false,bad:false},url:'',visit:null,mlink:'',busy:false,botHTML:'',tab:'Réseau'}}
function settings(w,A){
  var s=S();w.title.textContent='Paramètres';
  var h='<div class="a-set"><nav><button class="on">Réseau</button></nav><main><h3>Réseau et Internet</h3>';
  h+='<div class="mx-card"><b>Au comptoir</b><p style="margin:4px 0">Tu es dans '+(s.place==='aéroport'?'l’':'le ')+A.esc(s.place)+'. Tu ne sais pas lequel de ces réseaux est le vrai.</p>'+(T.asked?'<p style="color:#157347"><b>'+A.esc(s.staff.charAt(0).toUpperCase()+s.staff.slice(1))+' te répond :</b> « Le réseau s’appelle <b>'+A.esc(s.real)+'</b>. »</p>':'<button class="mx-b" id="m12Ask">Demander à '+A.esc(s.staff)+' le nom du réseau</button>')+'</div>';
  h+='<h4>Réseaux Wi-Fi à portée</h4>';
  var NL=[[s.fake,'Ouvert · signal fort'],[s.real,'Sécurisé · signal moyen'],[s.other,'Sécurisé · signal faible (privé)']];T.order.map(function(i){return NL[i]}).forEach(function(n){h+='<div class="mx-row"><div><b>'+A.esc(n[0])+'</b><br><small>'+n[1]+'</small></div>'+(T.net===n[0]?MX.pill('ok','Connecté ✓'):'<button class="mx-b" data-n="'+A.esc(n[0])+'">Se connecter</button>')+'</div>'});
  h+='<h4>VPN</h4>';
  [[s.vpnOk,'ok'],[s.vpnBad,'bad']].forEach(function(v){var on=T.vpn[v[1]];h+='<div class="mx-row'+(T.net?'':' off')+'"><div><b>'+A.esc(v[0])+'</b></div><span class="a-tg'+(on?' on':'')+'" data-v="'+v[1]+'" role="switch" aria-checked="'+on+'" tabindex="0"></span></div>'});
  if(!T.net)h+='<p><small>Connecte-toi d’abord à un réseau pour utiliser un VPN.</small></p>';
  h+='<div class="mx-bar"><button class="mx-b pri" id="m12Go"'+(T.busy?' disabled':'')+'>👀 Lancer le curieux du café</button></div><div id="aBot">'+(T.botHTML||'')+'</div>';
  w.body.innerHTML=h+'</main></div>';
  var ak=A.$('m12Ask');if(ak)ak.onclick=function(){T.asked=true;A.step(1);settings(w,A)};
  MX.on(w,'[data-n]',function(b){if(T.busy)return;T.net=b.getAttribute('data-n');if(T.net===S().real)A.step(2);else A.setSay('Tu es connecté. Es-tu sûr que c’est le bon réseau ?');if(!T.net){}T.vpn={ok:false,bad:false};T.botHTML='';settings(w,A)});
  MX.on(w,'[data-v]',function(b){if(T.busy||!T.net)return;var k=b.getAttribute('data-v');T.vpn[k]=!T.vpn[k];if(k==='ok'&&T.vpn.ok)A.step(3);settings(w,A)});
  A.$('m12Go').onclick=check;
}
function browser(w,A){
  var s=S();w.title.textContent='Navigateur';
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(T.visit?'Page':'Nouvel onglet')+'</div></div>';
  h+='<div class="a-url" style="gap:6px"><input type="text" id="m12U" placeholder="Tape l’adresse ici" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+A.esc(T.url)+'" style="flex:1;min-width:0;border:0;background:transparent;font:13px \'Segoe UI\',sans-serif;outline:none"><button id="m12Go2" style="width:auto;padding:0 10px">Aller</button></div><div class="a-page" style="padding:0"><div class="mx">';
  if(!T.visit)h+='<h3>Nouvel onglet</h3><p>Tape l’adresse de ta banque dans la barre.</p>';
  else if(!T.visit.found)h+='<h3>Page introuvable</h3><p>Cette adresse ne mène nulle part.</p>';
  else h+='<div class="mx-url'+(T.visit.good?'':' bad')+'"><span class="lock">'+(T.visit.https?'🔒':'⚠️')+'</span> '+A.esc(T.visit.shown)+'</div><h3>'+(T.visit.good?'Connexion à ta banque':T.visit.imp?'Banque : vérification de ton compte':'Connexion à ta banque (non chiffrée)')+'</h3><p>'+(T.visit.https?'Connexion chiffrée.':'Connexion non chiffrée.')+'</p>';
  w.body.innerHTML=h+'</div></div></div>';
  var go=function(){T.url=A.$('m12U').value;var v=T.url.trim().toLowerCase().replace(/\/+$/,'');var m=/^(https?:\/\/)?(.*)$/.exec(v),sch=m[1]||'https://',host=m[2];
    if(host===s.bank.toLowerCase()){T.visit={found:1,https:sch==='https://',good:sch==='https://',shown:sch+s.bank,typed:1};if(T.visit.good)A.step(4)}else T.visit={found:0};
    T.botHTML='';browser(w,A)};
  A.$('m12Go2').onclick=go;A.$('m12U').onkeydown=function(e){if(e.key==='Enter')go()};
}
function mail(w,A){
  var s=S(),p=A.P(),real='https://'+s.bank+'.connexion-securisee.example';
  w.title.textContent='Courriel – Boîte de réception';
  var h='<div class="a-ml"><div class="a-ml-l"><button class="a-ml-i on"><b>Ta banque</b><span>Connecte-toi pour voir ton solde</span><small>aujourd’hui</small></button></div><div class="a-ml-r"><h4>Connecte-toi pour voir ton solde</h4><p class="a-ml-f">De : Ta banque &lt;info@'+A.esc(s.bank.replace(/^ma-/,''))+'.example&gt;</p><div class="a-ml-b">Bonjour '+A.esc(p.pre)+',\n\nPour voir ton solde et tes dernières opérations, clique sur le lien ci-dessous.</div><p><a href="#" class="a-ml-lk">Ouvrir ma banque</a></p><p class="a-ml-u">'+(T.mlink?'Le lien t’a envoyé vers : <b>'+A.esc(real)+'</b>':'')+'</p></div></div>';
  w.body.innerHTML=h;
  w.body.querySelector('.a-ml-lk').onclick=function(e){e.preventDefault();T.mlink=real;T.visit={found:1,https:true,good:false,imp:true,shown:real};T.botHTML='';mail(w,A);A.openApp('browser');if(A.wins.browser)browser(A.wins.browser,A)};
}
function check(){
  if(T.busy)return;var A=A0,s=S(),why=[],rows=[];
  var realNet=T.net===s.real;
  rows.push({k:'Le réseau',bad:!realNet,badLabel:T.net?'✕ faux réseau':'✕ aucun',goodLabel:'✓ le vrai'});
  if(!realNet)why.push(T.net?'Tu es branché à « '+A.esc(T.net)+' », un réseau que n’importe qui peut créer : tu parlerais directement au faux. Demande le nom exact au personnel.':'Tu n’es connecté à aucun réseau.');
  var vOk=T.vpn.ok&&!T.vpn.bad;
  rows.push({k:'Le tunnel (VPN)',bad:!vOk,badLabel:T.vpn.bad?'✕ au bout, un inconnu':'✕ aucun tunnel',goodLabel:'✓ sérieux'});
  if(!vOk)why.push(T.vpn.bad?'Le VPN gratuit inconnu déplace la confiance chez quelqu’un que tu ne connais pas : c’est peut-être lui qui t’écoute.':'Sans tunnel, tout le monde dans la salle voit passer ton trafic. Active le VPN de ton employeur (celui dont tu connais l’entreprise).');
  var vi=T.visit,vbad=!(vi&&vi.found&&vi.good&&vi.typed);
  rows.push({k:'L’adresse de la banque',bad:vbad,badLabel:!vi?'✕ pas visitée':vi.imp?'✕ imposteur':!vi.https?'✕ en clair':'✕ erreur',goodLabel:'✓ tapée par toi, en https'});
  if(vbad)why.push(!vi?'Tu n’es pas allé sur le site de ta banque : tape toi-même son adresse, en https://.':vi.imp?'Tu as cliqué le lien du courriel : il menait à un imposteur. Tape toi-même l’adresse de la banque.':!vi.https?'L’adresse commençait par http:// : sans cadenas, ce que tu écris voyage à découvert.':'Vérifie l’adresse.');
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  T.busy=true;T.botHTML='';if(A.wins.settings)settings(A.wins.settings,A);else A.openApp('settings');
  A.runBot(A.$('aBot'),'👀 Le curieux du '+s.place+' (simulation)',rows,function(){return res.ok?'<b class="good">Le curieux ne voit rien d’utile.</b> Bon réseau, tunnel de confiance, adresse tapée par toi.':'<b class="bad">Le curieux a trouvé une faille.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;if(A.wins.settings)settings(A.wins.settings,A);A.finish(res)});
}
window.MISSIONS[12]={
 defiId:'defi-12-le-wi-fi-du-cafe-et-le-tunnel',
 reset:reset,
 apps:{settings:settings,browser:browser,mail:mail},
 onOpen:function(id,A){if(id==='settings')A.step(0)},
 cfg:{tag:'Mission 12 · Défi 12',title:'Le Wi-Fi du café et le tunnel',
  steps:['Ouvrir Paramètres › Réseau','Demander au personnel le nom exact du réseau','Se connecter à ce réseau-là, et à aucun autre','Activer un VPN sérieux, dont on connaît l’entreprise','Taper soi-même l’adresse de la banque, en https://','Lancer le curieux : il ne doit rien voir d’utile'],
  help:[['Indice','Tout le monde dans la salle est sur le même réseau. Et n’importe qui peut créer un faux réseau avec un nom tentant.'],['Méthode','Dans l’ordre : demander le nom du vrai réseau, s’y connecter, activer un VPN sérieux, puis taper toi-même l’adresse de la banque.'],['Explication','Le tunnel (VPN) cache ce que tu fais aux curieux de la salle. Mais il ne te protège pas d’un faux site : c’est pour ça que tu tapes l’adresse toi-même.'],['Accompagnement','1) « Demander » au comptoir. 2) Te connecter au réseau nommé. 3) Activer seulement le VPN de ton employeur. 4) Dans le Navigateur, taper l’adresse de ta banque en https://. Ne clique pas le lien du courriel.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Au café, tu dois consulter ta banque. Quel est le meilleur choix ?", "o": ["Le réseau « Café_Gratuit » ouvert, sans VPN", "Le réseau demandé au comptoir, avec un VPN sérieux, en tapant toi-même l’adresse", "Le premier réseau trouvé"], "ok": 1, "why": "Le bon réseau, le tunnel, et l’adresse tapée par toi : ensemble, ça te protège."}]],
  notion:'<p>Sur un <b>Wi-Fi public</b>, tout le monde est dans la même salle. Un <b>VPN</b> est un tunnel chiffré : les curieux voient le tunnel, pas ce qu’il y a dedans.</p><p style="margin-top:8px"><b>Exemple :</b> un VPN gratuit « 100 % anonyme » que personne ne connaît déplace la confiance : au bout du tunnel, quelqu’un voit tout.</p>',
  intro:'Marie est au café et veut consulter sa banque. Fais-le en sécurité.',
  ex:function(){return'<p>Cette fois, sans aide. <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> est dans '+(S().place==='aéroport'?'l’':'le ')+A0.esc(S().place)+' et doit consulter sa banque.</p>'},
  saySt:'Ouvre les Paramètres de Marie : elle est au café. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Regarde ce que le curieux a vu et recommence avec un autre personnage.'},
  win:'Bon réseau, bon tunnel, bonne adresse. C’est comme ça qu’on utilise un Wi-Fi public.',
  bad:'Le curieux a trouvé une faille. Regarde laquelle.'}
};
})();
/* Mission 13 : journaux (logs) et détection */
(function(){
var A0,T={};
var SC=[
 {sys:'le serveur de Marie',lines:[
  ['09:12','connexion réussie — marie (10.0.4.12)',0],['09:40','connexion réussie — marie (10.0.4.12)',0],['10:02','connexion réussie — marie (10.0.4.12)',0],
  ['10:02','connexion RÉUSSIE — admin (185.22.14.9)',1,'Un compte administrateur depuis une adresse jamais vue, à la même minute qu’une connexion normale : c’est la ligne qui raconte tout.'],
  ['10:03','échec connexion — admin (185.22.14.9)',0],['10:04','sauvegarde lancée — système (interne)',0],
  ['10:07','nouveau compte créé — admin (185.22.14.9)',1,'Une fois entré, il se crée un deuxième accès pour pouvoir revenir.'],
  ['10:09','4 000 fichiers copiés vers 185.22.14.9 — admin',1,'Des milliers de fichiers qui sortent vers la même adresse inconnue : c’est le vol lui-même.'],
  ['10:15','mise à jour automatique — système (interne)',0],['10:20','déconnexion — marie (10.0.4.12)',0]]},
 {sys:'le serveur de Marc',lines:[
  ['08:50','connexion réussie — marc (10.0.2.8)',0],['09:31','échec connexion — marc (10.0.2.8)',0],['09:31','connexion réussie — marc (10.0.2.8)',0],
  ['11:58','échec connexion — admin (203.0.113.77)',1,'Série d’échecs sur le compte administrateur depuis une adresse inconnue : quelqu’un essaie des mots de passe.'],
  ['11:58','échec connexion — admin (203.0.113.77)',1,'Même adresse, même compte, quelques secondes plus tard : ce n’est pas une faute de frappe.'],
  ['11:58','échec connexion — admin (203.0.113.77)',1,'Troisième essai de suite : une machine qui devine.'],
  ['11:59','connexion RÉUSSIE — admin (203.0.113.77)',1,'Après la série d’échecs, ça passe : le robot a trouvé.'],
  ['12:03','pare-feu désactivé — admin (203.0.113.77)',1,'Il coupe le portier pour pouvoir agir sans être bloqué.'],
  ['12:10','sauvegarde lancée — système (interne)',0],['12:15','mise à jour automatique — système (interne)',0],['13:02','déconnexion — marc (10.0.2.8)',0]]},
 {sys:'le serveur de Julie',lines:[
  ['03:12','connexion réussie — julie (198.51.100.23, pays inconnu)',1,'À 3 h du matin, depuis un endroit où Julie ne se connecte jamais : ce n’est pas Julie.'],
  ['03:14','droits administrateur accordés — julie',1,'Le compte vient d’obtenir plus de pouvoir qu’il n’en avait.'],
  ['03:20','journaux effacés — julie (198.51.100.23)',1,'Il efface ses traces. Heureusement, l’effacement lui-même est noté.'],
  ['03:25','12 000 contacts exportés vers 198.51.100.23 — julie',1,'Une grosse quantité de données qui sort vers la même adresse inconnue : le vol.'],
  ['04:00','sauvegarde lancée — système (interne)',0],['05:00','mise à jour automatique — système (interne)',0],
  ['08:55','connexion réussie — julie (10.0.7.5)',0],['12:10','connexion réussie — julie (10.0.7.5)',0],['17:05','déconnexion — julie (10.0.7.5)',0]]}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={sel:{},filt:'tout',busy:false,botHTML:'',read:false}}
var F={tout:function(){return true},connexions:function(t){return /connexion/.test(t)},admin:function(t){return /admin|droits|pare-feu|journaux|exportés|copiés|compte créé/.test(t)}};
function journal(w,A){
  var s=S();w.title.textContent='Journal des événements – '+s.sys;
  var h='<div class="mx"><div class="mx-tabs">'+['tout','connexions','admin'].map(function(k){return'<button data-f="'+k+'" class="'+(T.filt===k?'on':'')+'">'+({tout:'Tout',connexions:'Connexions',admin:'Actions sensibles'})[k]+'</button>'}).join('')+'</div><p>Clique sur les lignes qui racontent l’attaque.</p><div style="border:1px solid #dde3e8;border-radius:8px;overflow:hidden">';
  s.lines.forEach(function(l,i){if(!F[T.filt](l[1]))return;h+='<button class="mx-log'+(T.sel[i]?' on':'')+'" data-i="'+i+'"><span>'+(T.sel[i]?'🚩':'')+'</span><span>'+l[0]+'</span><span>'+A.esc(l[1])+'</span></button>'});
  h+='</div><div class="mx-bar"><button class="mx-b pri" id="m13Go"'+(T.busy?' disabled':'')+'>📖 Raconter l’attaque</button></div><div id="aBot">'+(T.botHTML||'')+'</div></div>';
  w.body.innerHTML=h;
  MX.on(w,'[data-f]',function(b){T.filt=b.getAttribute('data-f');if(!T.read){T.read=true;A.step(1)}journal(w,A)});
  MX.on(w,'[data-i]',function(b){if(T.busy)return;var i=+b.getAttribute('data-i');T.sel[i]=!T.sel[i];T.botHTML='';if(!T.read){T.read=true;A.step(1)}if(Object.keys(T.sel).some(function(k){return T.sel[k]}))A.step(2);journal(w,A)});
  A.$('m13Go').onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,s=S(),rows=[],why=[],tp=0,fp=0,fn=0;
  s.lines.forEach(function(l,i){
    var sel=!!T.sel[i],att=!!l[2];
    if(sel&&att){tp++;rows.push({k:l[0]+' '+l[1].split(' — ')[0],bad:false,goodLabel:'✓ fait partie de l’attaque'})}
    else if(sel&&!att){fp++;rows.push({k:l[0]+' '+l[1].split(' — ')[0],bad:true,badLabel:'✕ routine'});why.push('<b>'+l[0]+'</b> « '+A.esc(l[1])+' » : ligne normale, rien d’inhabituel. Une ligne seule ne dit rien, c’est celle qui ne ressemble pas aux autres qui compte.')}
    else if(!sel&&att){fn++;rows.push({k:l[0]+' '+l[1].split(' — ')[0],bad:true,badLabel:'✕ manquée'});why.push('<b>'+l[0]+'</b> « '+A.esc(l[1])+' » : '+l[3])}
  });
  var res={ok:fp===0&&fn===0,pct:Math.round(tp/(tp+fp+fn)*100)};
  T.busy=true;T.botHTML='';journal(A.wins.journal,A);
  A.runBot(A.$('aBot'),'📖 Le récit du journal',rows,function(){
    if(!res.ok)return'<b class="bad">Le récit ne tient pas.</b><br>• '+why.join('<br>• ');
    return'<b class="good">Tu as lu l’attaque, ligne par ligne.</b><br>'+s.lines.filter(function(l){return l[2]}).map(function(l){return'• <b>'+l[0]+'</b> : '+l[3]}).join('<br>')},function(html){T.botHTML=html;T.busy=false;if(A.wins.journal)journal(A.wins.journal,A);A.finish(res)});
}
window.MISSIONS[13]={
 defiId:'defi-10-journaux-logs-detection',
 extra:{journal:{t:'Journal des événements',x:50,y:20,w:620,h:440,icon:'<svg viewBox="0 0 32 32"><rect x="6" y="3" width="20" height="26" rx="3" fill="#f2f5f8" stroke="#9fb3c8" stroke-width="1.5"/><path d="M10 10h12M10 14h12M10 18h7" stroke="#6b7a8a" stroke-width="1.8" stroke-linecap="round"/><circle cx="22" cy="22" r="4.5" fill="#e0524f"/><path d="M22 19.5v3M22 24v.3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>'}},
 reset:reset,
 apps:{journal:journal},
 onOpen:function(id,A){if(id==='journal')A.step(0)},
 cfg:{tag:'Mission 13 · Défi 13',title:'Lire les traces de pas dans la neige',
  steps:['Ouvrir le Journal des événements','Lire les lignes (essaie les filtres)','Marquer les lignes qui racontent l’attaque','Raconter l’attaque : aucune ligne manquée, aucune de trop'],
  help:[['Indice','Cherche ce qui ne ressemble pas aux autres : un compte inhabituel, une adresse jamais vue, une heure bizarre.'],['Méthode','Une ligne seule peut être banale. C’est la suite qui raconte : une entrée suspecte, puis un nouvel accès, puis des données qui sortent.'],['Explication','Chaque action laisse une trace. On ne devine pas, on lit.'],['Accompagnement','Marque d’abord l’entrée suspecte. Puis ce qu’elle a fait ensuite avec la même adresse. Les tâches du système (sauvegarde, mise à jour) sont de la routine.'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "À 3 h du matin, un compte se connecte depuis un pays inconnu. Que fais-tu de cette ligne ?", "o": ["Je l’ignore, c’est la nuit", "Je la remarque : elle ne ressemble pas aux autres", "Je supprime le journal"], "ok": 1, "why": "Détecter, c’est repérer la ligne qui ne ressemble pas aux autres."}]],
  notion:'<p>Un <b>journal (log)</b>, c’est la liste datée de ce qui s’est passé sur une machine. <b>Détecter</b>, c’est repérer la ligne qui ne ressemble pas aux autres.</p><p style="margin-top:8px"><b>Exemple :</b> un compte administrateur qui se connecte depuis une adresse jamais vue, puis crée un compte et copie des milliers de fichiers.</p>',
  intro:'Une attaque s’est cachée dans le journal du serveur de Marie (l’ordinateur qui fait marcher son site). Retrouve-la.',
  ex:function(){return'<p>Cette fois, sans aide. Lis le journal de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> et retrouve l’attaque.</p>'},
  saySt:'Ouvre le Journal des événements du serveur de Marie. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Relis ce qui est dit sur les lignes manquées et recommence avec un autre personnage.'},
  win:'Tu as raconté l’attaque heure par heure, sans te laisser distraire par la routine.',
  bad:'Le récit ne tient pas. Regarde ce qui manque ou ce qui est de trop.'}
};
})();
/* Mission 14 : quand c'est arrivé, couper, prévenir, réparer */
(function(){
var A0,T={};
var SC=[
 {what:'Marie vient d’entrer le mot de passe de sa banque sur un faux site.',svc:'Banque du Coin',mailFrom:'Banque du Coin Sécurité',mailAddr:'alerte@banque-du-coin-securite.example',mailSubj:'URGENT : confirme ton identité',cut:['pw'],official:'Banque du Coin : numéro officiel (au dos de ta carte)',fake:'Numéro écrit dans le courriel'},
 {what:'Marc vient de donner le numéro de sa carte de paiement sur un faux site de livraison.',svc:'Caisse du Coin',mailFrom:'Colis Express',mailAddr:'noreply@colis-express-livraison.example',mailSubj:'Ton colis : 2,99 $ de frais',cut:['card'],official:'Caisse du Coin : numéro officiel (au dos de ta carte)',fake:'Numéro écrit dans le courriel'},
 {what:'Julie vient d’entrer le mot de passe de son courriel sur un faux site de vérification.',svc:'Courriel',mailFrom:'Ton compte courriel',mailAddr:'securite@courriel-exemple-verif.example',mailSubj:'Ta boîte sera supprimée aujourd’hui',cut:['pw','dev'],official:'Assistance du fournisseur de courriel : numéro officiel (sur son vrai site)',fake:'Numéro écrit dans le courriel'}
];
function S(){return SC[Math.min(A0.persona(),2)]}
function reset(A){A0=A;T={log:[],note:false,calls:[],page:'start',msg:'',botHTML:'',busy:false,done:{},sent:false,sel:0,reply:false}}
function add(a){T.log.push(a)}
function has(a){return T.log.indexOf(a)>-1}
function nowS(){var d=new Date();return d.getHours()+' h '+('0'+d.getMinutes()).slice(-2)}
function mail(w,A){
  var s=S();w.title.textContent='Courriel – Boîte de réception';
  var gone=has('delete');
  var h='<div class="a-ml"><div class="a-ml-l">'+(gone?'':'<button class="a-ml-i on"><b>'+A.esc(s.mailFrom)+'</b><span>'+A.esc(s.mailSubj)+'</span><small>aujourd’hui</small></button>')+'<button class="a-ml-i"><b>Louise Tremblay</b><span>Souper dimanche ?</span><small>hier</small></button></div><div class="a-ml-r">';
  if(gone)h+='<p class="a-ml-e">Le courriel a été supprimé. Les traces sont parties avec.</p>';
  else h+='<h4>'+A.esc(s.mailSubj)+'</h4><p class="a-ml-f">De : '+A.esc(s.mailFrom)+' &lt;'+A.esc(s.mailAddr)+'&gt;</p><div class="a-ml-b">Cher client,\n\nConfirme ton identité en cliquant ici. Sans quoi ton compte sera fermé.</div><div class="a-ml-a"><button class="btn" id="m14Fl">'+(has('flag')?'Signalé ✓':'Signaler comme hameçonnage')+'</button><button class="btn" id="m14Re">Répondre à l’expéditeur</button><button class="btn" id="m14Del">Supprimer</button></div>'+(T.reply?'<p style="color:#a4262c;margin-top:8px">Tu as répondu : le fraudeur sait maintenant que ton adresse est active.</p>':'');
  w.body.innerHTML=h+'</div></div>';
  var f=A.$('m14Fl');if(f)f.onclick=function(){if(!has('flag'))add('flag');mail(w,A)};
  var r=A.$('m14Re');if(r)r.onclick=function(){T.reply=true;if(!has('reply'))add('reply');mail(w,A)};
  var d=A.$('m14Del');if(d)d.onclick=function(){if(!has('delete'))add('delete');mail(w,A)};
}
function notes(w,A){
  var s=S();w.title.textContent='Notes de l’incident – Bloc-notes';
  var t='Ce qui s’est passé\n\n'+s.what.replace(/vient d’/,'a ')+'\n\n';
  if(T.note)t+=nowS()+' : j’ai cliqué sur le lien d’un courriel et rempli le formulaire.\n'+nowS()+' : je m’en suis rendu compte juste après.\n';
  else t+='(rien d’écrit pour l’instant)';
  w.body.innerHTML='<div class="a-np"><div class="a-np-m"><span>Fichier</span><span>Modifier</span><span>Affichage</span></div><div class="a-np-t">'+A.esc(t)+'</div><div style="padding:6px 10px;background:#f3f3f3;border-top:1px solid #e1e1e1"><button class="mx-b" id="m14Note"'+(T.note?' disabled':'')+'>'+(T.note?'Note ajoutée ✓':'Noter l’heure et ce que j’ai cliqué')+'</button></div></div>';
  var b=A.$('m14Note');if(b)b.onclick=function(){T.note=true;add('note');A.step(0);notes(w,A)};
}
function browser(w,A){
  var s=S(),home=T.page==='start';w.title.textContent=(home?'Nouvel onglet':s.svc)+' – Navigateur';
  var h='<div class="a-br"><div class="a-br-tabs"><div class="a-br-tab">'+(home?'Nouvel onglet':s.svc)+'</div></div><div class="a-url"><button disabled>←</button><span>'+(home?'accueil':'🔒 '+A.esc(s.svc.toLowerCase().replace(/ /g,'-'))+'.example/mon-compte')+'</span></div><div class="a-page" style="padding:0">';
  if(home)h+='<div style="padding:22px 20px"><h3>Page d’accueil</h3><p>Tes favoris :</p><button class="a-bm" id="m14Fav">⭐ '+A.esc(s.svc)+' (le vrai site)</button></div>';
  else{
    h+='<div class="mx"><h3>'+A.esc(s.svc)+' · mon compte</h3><div class="mx-row"><div><b>Changer le mot de passe</b><br><small>'+(T.done.pw?'✓ fait':'Choisis-en un nouveau, long et sans lien avec toi')+'</small></div></div>'+(T.done.pw?'':'<div style="display:flex;gap:6px;margin:-2px 0 8px"><input type="text" id="m14Pw" placeholder="Nouveau mot de passe" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1;min-width:0"><button class="mx-b pri" id="m14PwGo">Changer</button></div>');
    if(T.msg)h+='<p style="color:#a4262c">'+A.esc(T.msg)+'</p>';
    [['dev','Déconnecter tous les autres appareils','Ferme toutes les sessions ouvertes ailleurs'],['card','Bloquer la carte','Les achats avec cette carte seront refusés'],['2fa','Activer la double vérification','Ajoute une deuxième preuve pour entrer']].forEach(function(r){h+='<div class="mx-row"><div><b>'+r[1]+'</b><br><small>'+r[2]+'</small></div>'+(T.done[r[0]]?MX.pill('ok','fait ✓'):'<button class="mx-b" data-a="'+r[0]+'">Faire</button>')+'</div>'});
    h+='</div>';
  }
  w.body.innerHTML=h+'</div></div>';
  var f=A.$('m14Fav');if(f)f.onclick=function(){T.page='acc';browser(w,A)};
  var g=A.$('m14PwGo');if(g)g.onclick=function(){var v=A.$('m14Pw').value;if(!v){return}var ev=A.evaluate(v,A.P());if(!ev.ok){T.msg='Ce mot de passe est trop faible : un robot le devinerait. Choisis-en un plus long.';browser(w,A);return}T.msg='';T.done.pw=true;add('cut');gate(A);browser(w,A)};
  MX.on(w,'[data-a]',function(b){var k=b.getAttribute('data-a');T.done[k]=true;if(k==='2fa'){add('repair');A.step(3)}else{add('cut');gate(A)}browser(w,A)});
}
function gate(A){var need=S().cut,ok=need.every(function(k){return T.done[k]});if(ok)A.step(1)}
function tel(w,A){
  var s=S();w.title.textContent='Téléphone de '+A.P().pre;
  var h='<div class="mx"><h3>📞 Appeler</h3>';
  [[s.official,'official'],[s.fake,'fake']].sort(function(){return 0}).forEach(function(c){h+='<div class="mx-row"><div><b>'+A.esc(c[0])+'</b></div><button class="mx-b pri" data-c="'+c[1]+'">Appeler</button></div>'});
  if(T.calls.length){h+='<div class="mx-chat">';T.calls.forEach(function(c){h+='<div class="mx-msg sys">Appel : '+A.esc(c==='official'?s.official:s.fake)+'</div><div class="mx-msg in">'+(c==='official'?'« Merci de nous avoir appelés. Nous surveillons votre dossier et nous bloquons toute opération suspecte. »':'« Oui, tout est en ordre, donnez-moi votre mot de passe pour confirmer… »')+'</div>'});h+='</div>'}
  w.body.innerHTML=h+'</div>';
  MX.on(w,'[data-c]',function(b){var c=b.getAttribute('data-c');T.calls.push(c);add(c==='official'?'warn':'badcall');if(c==='official')A.step(2);tel(w,A)});
}
function check(){
  if(T.busy)return;var A=A0,s=S(),rows=[],why=[];
  var cut=s.cut.every(function(k){return T.done[k]});
  rows.push({k:'Couper : l’accès du voleur',bad:!cut,badLabel:'✕ encore ouvert',goodLabel:'✓ fermé'});if(!cut)why.push('Il reste un accès ouvert au voleur : '+(s.cut.indexOf('card')>-1?'bloque la carte depuis le vrai site.':s.cut.indexOf('dev')>-1?'change le mot de passe depuis le vrai site et déconnecte les autres appareils.':'change le mot de passe depuis le vrai site, que tu tapes toi-même.'));
  var warn=has('warn');
  rows.push({k:'Prévenir : la bonne personne',bad:!warn,badLabel:'✕ personne prévenu',goodLabel:'✓ numéro officiel'});if(!warn)why.push('Appelle le numéro officiel (pas celui du message) pour qu’on surveille et bloque les opérations suspectes.');
  var rep=has('repair');rows.push({k:'Réparer : double vérification',bad:!rep,badLabel:'✕ non activée',goodLabel:'✓ active'});if(!rep)why.push('Active la double vérification : un mot de passe volé ne suffira plus.');
  var iC=T.log.indexOf('cut'),iW=T.log.indexOf('warn'),iR=T.log.indexOf('repair'),first=T.log.filter(function(a){return a==='cut'||a==='warn'||a==='repair'})[0];
  var order=cut&&warn&&first==='cut'&&(iW<0||iC<iW)&&(iR<0||iC<iR);
  rows.push({k:'Dans l’ordre : couper d’abord',bad:!order,badLabel:'✕ mauvais ordre',goodLabel:'✓ oui'});if(!order&&cut&&warn)why.push('L’ordre compte : on coupe d’abord ce qui est ouvert au voleur, ensuite on prévient, ensuite on répare.');
  var traces=!has('delete')&&!has('reply')&&!has('badcall');
  rows.push({k:'Traces gardées, pas de contact avec le fraudeur',bad:!traces,badLabel:'✕ erreur',goodLabel:'✓ oui'});if(!traces)why.push(has('delete')?'Tu as supprimé le courriel : il aide à comprendre et à signaler. On garde les traces.':has('reply')?'Tu as répondu à l’expéditeur : tu lui confirmes que ton adresse est active. Avec un fraudeur, on ne discute pas.':'Tu as appelé le numéro du message : c’était peut-être le fraudeur.');
  rows.push({k:'Noter ce qui s’est passé',bad:!T.note,badLabel:'✕ rien noté',goodLabel:'✓ noté'});if(!T.note)why.push('Note l’heure et ce que tu as cliqué : ça aide la banque à comprendre.');
  var okn=rows.filter(function(r){return!r.bad}).length,res={ok:okn===rows.length,pct:Math.round(okn/rows.length*100)};
  var bar=A.wins.browser;
  T.busy=true;T.botHTML='';
  if(!A.wins.tel)A.openApp('tel');else A.wins.tel.el.classList.remove('min');var host=A.wins.tel.body;var box=document.createElement('div');box.id='aBot';host.appendChild(box);
  A.runBot(box,'🕵️ Le voleur, cinq minutes plus tard (simulation)',rows,function(){return res.ok?'<b class="good">Le voleur se heurte à une porte fermée.</b> Tu as coupé, prévenu et réparé, dans l’ordre.':'<b class="bad">Le voleur a encore une chance.</b><br>• '+why.join('<br>• ')},function(html){T.botHTML=html;T.busy=false;A.finish(res)});
}
window.MISSIONS[14]={
 defiId:'defi-14-quand-c-est-arrive-couper-prevenir-reparer',
 extra:{tel:{t:'Téléphone',x:560,y:24,w:290,h:400,icon:'<svg viewBox="0 0 32 32"><rect x="9" y="3" width="14" height="26" rx="3.5" fill="#33414e"/><rect x="11" y="6" width="10" height="17" rx="1.5" fill="#6fd0ff"/><circle cx="16" cy="26" r="1.3" fill="#9fb3c8"/></svg>'},
        verify:{t:'Vérifier',x:60,y:20,w:300,h:200,icon:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#2fa866"/><path d="M10 16l4 4 8-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>'}},
 geom:{browser:{x:16,y:24,w:520,h:430}},
 reset:reset,
 apps:{mail:mail,notes:notes,browser:browser,tel:tel,verify:function(w,A){w.title.textContent='Vérifier';w.body.innerHTML='<div class="mx"><h3>Terminé ?</h3><p>Quand tu as tout fait, laisse le voleur essayer.</p><button class="mx-b pri" id="m14Go">Lancer le voleur</button></div>';A.$('m14Go').onclick=function(){A.closeWin('verify');check()}}},
 onOpen:function(id,A){},
 cfg:{tag:'Mission 14 · Défi 14',title:'Quand c’est arrivé : couper, prévenir, réparer',
  steps:['Noter ce qui s’est passé (Bloc-notes)','Couper l’accès du voleur (Navigateur, vrai site)','Prévenir : appeler le numéro officiel (Téléphone)','Réparer : activer la double vérification','Ouvrir « Vérifier » : le voleur ne doit plus avoir de chance'],
  help:[['Indice','Ne reste pas planté là : il y a un ordre. D’abord couper ce qui est ouvert, puis prévenir, puis réparer.'],['Méthode','Couper : changer le mot de passe (ou bloquer la carte) depuis le vrai site, que tu tapes toi-même. Prévenir : appeler le numéro officiel. Réparer : double vérification.'],['Explication','Les voleurs agissent en quelques minutes. Et les traces (le courriel, l’historique) aident à comprendre : on ne les supprime pas, on n’écrit pas au fraudeur.'],['Accompagnement','1) Note l’heure et ce que tu as cliqué. 2) Navigateur : va sur le vrai site et coupe l’accès du voleur. 3) Téléphone : appelle le numéro officiel. 4) Active la double vérification. 5) Ouvre « Vérifier ».'],['Exercice complémentaire','Essaie ceci, sous une autre forme.',{"q": "Tu viens de cliquer sur un faux lien et d’entrer ton mot de passe. Premier geste ?", "o": ["Changer le mot de passe depuis le vrai site, tapé toi-même", "Écrire au fraudeur", "Effacer le courriel pour cacher la trace"], "ok": 0, "why": "D’abord couper l’accès du voleur, depuis un chemin que tu contrôles."}]],
  notion:'<p>Quand ça arrive : <b>1. couper</b> ce qui est ouvert au voleur, <b>2. prévenir</b> les bonnes personnes, <b>3. réparer</b>, puis apprendre. Dans cet ordre, sans paniquer.</p><p style="margin-top:8px"><b>Exemple :</b> ton mot de passe est parti sur un faux site : change-le tout de suite depuis le vrai site, appelle ta banque au numéro officiel, puis ajoute la double vérification. Et garde le courriel : ne le supprime pas.</p>',
  intro:'Marie vient d’entrer son mot de passe sur un faux site. Que fait-on, et dans quel ordre ?',
  ex:function(){return'<p>Cette fois, sans aide. '+A0.esc(S().what)+' Réagis.</p>'},
  saySt:'Respire : on coupe, on prévient, on répare. Je suis là si tu veux de l’aide.',
  fail:function(p){return'Presque ! Résultat : '+p+' %. Relis ce qui manquait et recommence avec un autre personnage.'},
  win:'Tu as coupé, prévenu et réparé, dans l’ordre, sans effacer les traces. C’est le bon réflexe.',
  bad:'Le voleur a encore une chance. Regarde ce qui manque.'}
};
})();
/* Missions 101-113 : Cyber-Algèbre (défis 1.1 à 3.4 ; 113 = défi 1.3) */
(function(){
var DATA={"101": {"id": "defi-1-1-qui-a-le-droit-de-tester-la-serrure", "title": "Défi 1.1 — Qui a le droit de tester la serrure ?", "hints": ["Indice : pose-toi une seule question : est-ce que le propriétaire a donné sa permission ?", "Autre façon de le dire : le geste est le même, ce qui change tout, c'est qui t'a donné le droit de le faire."], "blocks": [{"kind": "cls", "con": "Pour chaque situation : est-ce de la sécurité offensive autorisée, ou une attaque ?", "show": 6, "items": [{"t": "Une entreprise engage une spécialiste pour tester son site. Il y a un contrat signé.", "b": "Autorisé", "w": "Autorisé. Il y a une permission écrite et un but : corriger les faiblesses."}, {"t": "Un étudiant teste le site de son école « juste pour voir », sans le dire à personne.", "b": "Pas autorisé", "w": "Pas autorisé. Même par curiosité et sans mauvaise intention, sans permission, c'est une intrusion."}, {"t": "Tu t'exerces sur un ordinateur de laboratoire que tu as installé chez toi pour apprendre.", "b": "Autorisé", "w": "Autorisé. C'est ton propre terrain d'entraînement : il existe pour ça."}, {"t": "Un inconnu essaie d'entrer sur le site de ta banque, depuis son salon, pour voir si ça marche.", "b": "Pas autorisé", "w": "Pas autorisé. Même technique que la spécialiste engagée par la banque, mais aucune permission."}, {"t": "Une employée de l’équipe de sécurité teste le réseau interne un samedi, avec l’accord écrit de la direction", "b": "Autorisé", "w": "Permission écrite, cible précise, but de corriger : c’est exactement le cadre autorisé, même un samedi."}, {"t": "Un concours de sécurité où les organisateurs invitent le public à attaquer un site fait exprès", "b": "Autorisé", "w": "Le site existe pour ça et le règlement le dit : tu es invité."}, {"t": "Tu trouves une faille sur le site d’un commerce et tu l’essaies à fond avant de les prévenir", "b": "Pas autorisé", "w": "Trouver est une chose. L’essayer sans permission, c’est entrer sans qu’on t’ait ouvert."}, {"t": "Un « testeur » écrit à un commerce : « Payez-moi, ou je publie la faille que j’ai trouvée »", "b": "Pas autorisé", "w": "Aucune permission, et une menace. Ce n’est pas un test, c’est du chantage."}, {"t": "Tu essaies sur le compte d’une inconnue un mot de passe trouvé dans une fuite", "b": "Pas autorisé", "w": "C’est du bourrage d’identifiants, vu dans l’Alphabet. Sans permission, c’est une attaque, même « juste un essai »."}]}]}, "102": {"id": "defi-1-2-ton-terrain-d-entrainement", "title": "Défi 1.2 — Ton terrain d'entraînement", "hints": ["Indice : pour chaque endroit, demande-toi : est-ce à moi ? Est-ce que quelqu'un m'a dit oui ?", "Autre façon de le dire : un terrain permis, c'est à toi, ou fait exprès pour s'exercer, ou prêté par écrit."], "blocks": [{"kind": "cls", "con": "Tu veux t'exercer. Pour chaque endroit : est-ce un terrain permis, ou pas le tien ?", "show": 6, "items": [{"t": "Un faux café en ligne, créé par une plateforme d'apprentissage pour que les élèves l'attaquent", "b": "Terrain permis", "w": "Il existe exprès pour ça, avec un règlement. Tu es invité à essayer."}, {"t": "Le site de ton école, un soir où tu t'ennuies", "b": "Pas le tien", "w": "Ce n'est pas à toi et personne n'a dit oui. Même par curiosité, c'est une intrusion."}, {"t": "Une machine que tu as installée toi-même sur ton ordinateur, coupée du reste de ton réseau", "b": "Terrain permis", "w": "Elle est à toi et elle ne touche à personne. Tu peux la casser autant que tu veux."}, {"t": "Le Wi-Fi de ton voisin, juste pour voir si c'est solide", "b": "Pas le tien", "w": "Même idée : pas à toi, pas de permission."}, {"t": "Le vrai site du Café du Coin, avec l'accord écrit du patron, à une date convenue", "b": "Terrain permis", "w": "Ce n'est pas un laboratoire, mais il y a une permission écrite. C'est le cadre du défi 1.1."}, {"t": "Un défi de sécurité organisé par une communauté, avec ses règles écrites", "b": "Terrain permis", "w": "Les règles disent quoi attaquer et comment. C’est une invitation."}, {"t": "Un logiciel volontairement fragile que tu installes dans une machine virtuelle isolée sur ton ordinateur", "b": "Terrain permis", "w": "Il est à toi, fait exprès pour être cassé, et coupé du reste. Aucun risque pour personne."}, {"t": "Le site de ton ancien employeur, dont tu as encore le mot de passe", "b": "Pas le tien", "w": "Tu y avais accès avant. Tu n’en as plus le droit. Garder le mot de passe ne donne aucune permission."}, {"t": "Le routeur du café, pour voir si le mot de passe par défaut fonctionne", "b": "Pas le tien", "w": "Pas à toi, pas de permission. « Juste voir » reste une intrusion."}, {"t": "Le pare-feu de ton école, en essayant d’ouvrir des portes sur son réseau", "b": "Pas le tien", "w": "Le portier de quelqu’un d’autre n’est pas ton terrain d’entraînement."}]}]}, "103": {"id": "defi-1-4-les-metiers-qui-fait-quoi", "title": "Défi 1.4 — Les métiers : qui fait quoi", "hints": ["Indice : qui teste une chose précise ? Qui joue le scénario complet ? Qui construit ?", "Autre façon de le dire : un seul produit = pentester. Toute l'entreprise, en secret = équipe rouge. Construire = ingénieur."], "blocks": [{"kind": "cls", "con": "Pour chaque tâche, quel métier ?", "show": 6, "items": [{"t": "Tester pendant deux semaines le site de paiement d'une banque, puis remettre la liste des failles", "b": "Pentester", "w": "Cible précise, durée limitée, rapport à la fin : c'est un test d'intrusion."}, {"t": "Jouer pendant des semaines le rôle d'un vrai groupe d'attaquants contre toute l'entreprise, sans prévenir la plupart des employés", "b": "Équipe rouge", "w": "Ce n'est pas un seul produit : toute l'organisation est mise à l'épreuve, y compris sa capacité à détecter. Seules quelques personnes de la direction sont au courant."}, {"t": "Choisir et installer le système qui verrouille un compte après trop d'essais ratés", "b": "Ingénieur sécurité", "w": "Il construit les protections que les autres viendront tester."}, {"t": "Dessiner d'avance comment le réseau sera séparé en zones, avant même la construction", "b": "Ingénieur sécurité", "w": "Penser la sécurité dès le plan, c'est son travail."}, {"t": "Tester l’application mobile d’une assurance pendant dix jours, puis remettre un rapport", "b": "Pentester", "w": "Cible précise, durée limitée, rapport à la fin : un test d’intrusion."}, {"t": "Confirmer qu’une faille est réelle et la décrire pour que l’équipe puisse la corriger", "b": "Pentester", "w": "Trouver, prouver, expliquer : le cœur du travail du pentester."}, {"t": "Tenter d’entrer dans l’édifice par la réception, puis d’atteindre les serveurs, pour voir si quelqu’un réagit", "b": "Équipe rouge", "w": "On met à l’épreuve toute l’organisation, y compris les gens et la détection, pas un seul produit."}, {"t": "Régler le pare-feu pour que seule la porte prévue reste ouverte", "b": "Ingénieur sécurité", "w": "Il construit le portier que les autres viendront tester."}, {"t": "Mettre en place la double vérification pour tous les employés", "b": "Ingénieur sécurité", "w": "Il installe les protections. Il ne joue pas l’attaquant."}]}, {"kind": "order", "con": "Un test d’intrusion se déroule en quatre temps. Clique d’abord sur le premier.", "show": 4, "items": [{"t": "Se mettre d’accord par écrit sur la cible et les règles", "n": 1, "w": "Sans accord écrit, tout ce qui suit serait une intrusion. C’est toujours le point de départ."}, {"t": "Tester la cible, dans les limites prévues", "n": 2, "w": "Tu joues l’attaquant, mais seulement sur ce qui a été convenu."}, {"t": "Noter chaque faille trouvée, avec la preuve", "n": 3, "w": "Une faille non notée ne peut pas être corrigée. La preuve montre qu’elle est réelle."}, {"t": "Remettre le rapport au propriétaire", "n": 4, "w": "Le but du test, c’est que l’entreprise puisse réparer. Le rapport est le livrable."}]}]}, "104": {"id": "defi-2-1-les-serrures-et-les-cameras", "title": "Défi 2.1 — Les serrures et les caméras", "hints": ["Indice : est-ce que le geste ferme la porte, ou est-ce qu'il garde un témoin ?", "Autre façon de le dire : le verrou empêche. La caméra voit. Le message d'alerte, c'est une caméra qui crie."], "blocks": [{"kind": "cls", "con": "Pour chaque geste du patron : est-ce que ça empêche, ou est-ce que ça permet de voir ?", "show": 6, "items": [{"t": "Un verrou sur la porte arrière", "b": "Empêcher", "w": "Il bloque l'entrée. C'est de la prévention."}, {"t": "Une caméra au-dessus de la caisse", "b": "Voir", "w": "Elle ne bloque personne, mais elle garde ce qui s'est passé."}, {"t": "Un mot de passe solide sur le compte du patron", "b": "Empêcher", "w": "Il rend l'entrée beaucoup plus difficile."}, {"t": "Un message au patron quand quelqu'un essaie 20 mots de passe d'affilée", "b": "Voir", "w": "Il n'empêche rien tout seul, mais il permet de réagir tout de suite."}, {"t": "Installer la mise à jour du logiciel de caisse", "b": "Empêcher", "w": "Elle bouche un trou connu avant qu'on s'en serve."}, {"t": "Un pare-feu qui ferme les portes inutilisées", "b": "Empêcher", "w": "Moins de portes ouvertes, moins d’entrées possibles : de la prévention."}, {"t": "La double vérification sur les comptes", "b": "Empêcher", "w": "Même avec le mot de passe, il manque la deuxième preuve. L’entrée est bloquée."}, {"t": "Un journal qui garde qui s’est connecté, et quand", "b": "Voir", "w": "Il ne bloque personne, mais il permet de reconstituer ce qui s’est passé."}, {"t": "Une alerte quand un employé copie des milliers de fichiers d’un coup", "b": "Voir", "w": "Elle n’arrête rien toute seule, mais quelqu’un peut réagir tout de suite."}]}]}, "105": {"id": "defi-2-2-la-salle-de-controle", "title": "Défi 2.2 — La salle de contrôle", "hints": ["Indice : est-ce que la tâche consiste à surveiller et à repérer ce qui est dangereux ?", "Autre façon de le dire : le SOC surveille, trie et prévient. Il ne répare pas les ordinateurs et ne crée pas de sites."], "blocks": [{"kind": "cls", "con": "Pour chaque tâche : est-ce le travail d'un SOC, ou non ?", "show": 6, "items": [{"t": "Surveiller en continu ce qui se passe sur les systèmes", "b": "Le travail du SOC", "w": "C'est le cœur du métier : rester présent, jour et nuit."}, {"t": "Réparer l'ordinateur d'une employée qui ne démarre plus", "b": "Pas le SOC", "w": "C'est le travail du soutien technique. Utile, mais ce n'est pas de la surveillance de sécurité."}, {"t": "Trier les alertes pour trouver les vraies", "b": "Le travail du SOC", "w": "Presque tout est normal. Le SOC repère ce qui ne l'est pas."}, {"t": "Créer le site web de l'entreprise", "b": "Pas le SOC", "w": "Aucun rapport avec la surveillance ou la détection."}, {"t": "Avertir les bonnes personnes quand un vrai problème est confirmé", "b": "Le travail du SOC", "w": "Voir ne suffit pas : il faut aussi appeler quelqu'un qui peut agir."}, {"t": "Repérer qu’un compte se connecte à 3 h du matin depuis un pays inhabituel", "b": "Le travail du SOC", "w": "Surveiller, c’est justement remarquer ce qui sort de l’ordinaire."}, {"t": "Noter à quelle heure l’alerte a été confirmée et qui a été prévenu", "b": "Le travail du SOC", "w": "Un SOC garde la trace de ce qu’il a fait : c’est ce qui permet de comprendre ensuite."}, {"t": "Dessiner à l’avance comment le réseau sera séparé en zones", "b": "Pas le SOC", "w": "C’est le travail de l’ingénieur de sécurité : construire. Le SOC surveille ce qui existe."}, {"t": "Faire, avec permission, un test d’intrusion sur le site de l’entreprise", "b": "Pas le SOC", "w": "C’est le métier du pentester : jouer l’attaquant. Le SOC, lui, joue la surveillance."}]}]}, "106": {"id": "defi-2-3-trop-de-bruit", "title": "Défi 2.3 — Trop de bruit", "hints": ["Indice : laquelle ne ressemble pas à ce qui arrive tous les jours ?", "Autre façon de le dire : cherche ce qui est trop rapide, trop nombreux ou au mauvais endroit."], "blocks": [{"kind": "multi", "con": "Voici des alertes reçues ce matin. Lesquelles regardes-tu en premier ? Trouve-les toutes.", "show": 5, "items": [{"t": "Une employée se trompe deux fois de mot de passe, puis réussit.", "ok": 0, "w": "Ça arrive à tout le monde. Deux essais, puis ça passe : c'est de l'humain, pas une attaque."}, {"t": "Une cliente se connecte au Wi-Fi du café.", "ok": 0, "w": "Un événement ordinaire. Il s'en passe des dizaines par jour."}, {"t": "Sur le compte du patron : 40 mots de passe essayés en une minute, depuis un pays où il n'est jamais allé.", "ok": 1, "w": "Trop vite, trop nombreux, au mauvais endroit. Un humain ne fait pas ça : c'est un programme qui essaie."}, {"t": "Le logiciel de caisse fait sa mise à jour automatique à 3 h du matin.", "ok": 0, "w": "C'est prévu : il le fait chaque nuit."}, {"t": "Le compte d’une employée se connecte à 3 h du matin depuis un pays étranger, puis copie tous les fichiers de la comptabilité", "ok": 1, "w": "Heure inhabituelle, lieu inhabituel, geste inhabituel : trois signaux qui s’additionnent."}, {"t": "Un compte de comptabilité essaie d’ouvrir 300 fichiers en dix secondes", "ok": 1, "w": "Un humain ne lit pas 300 fichiers en dix secondes. C’est un programme."}, {"t": "Une mise à jour automatique des postes lancée à minuit", "ok": 0, "w": "Planifiée, interne, régulière. C’est du bruit."}, {"t": "Un employé se connecte au Wi-Fi du café depuis son nouveau téléphone", "ok": 0, "w": "Un appareil nouveau, ça arrive. Rien d’inhabituel dans le geste lui-même."}, {"t": "Un nouvel employé se connecte pour la première fois et change son mot de passe", "ok": 0, "w": "Exactement ce qu’on attend d’un premier jour."}]}]}, "107": {"id": "defi-2-4-quel-genre-de-probleme", "title": "Défi 2.4 — Quel genre de problème ?", "hints": ["Indice : qu'est-ce qui s'est passé en premier ? Des essais de mot de passe, des fichiers illisibles, ou un clic ?", "Autre façon de le dire : beaucoup d'essais rapides = mot de passe deviné. Un message qui réclame de l'argent = fichiers pris en otage. Un clic sur un faux lien = faux courriel."], "blocks": [{"kind": "cls", "con": "Au Café du Coin, trois choses arrivent. Pour chacune, quelle fiche sors-tu ?", "show": 6, "items": [{"t": "Le journal montre 200 essais de mot de passe sur le compte du patron, en deux minutes.", "b": "Mot de passe deviné", "w": "Beaucoup d'essais très rapides sur un même compte : on bloque la source et on renforce le compte."}, {"t": "Les fichiers de la caisse sont illisibles. Un message demande de l'argent pour les récupérer.", "b": "Fichiers pris en otage", "w": "On isole l'ordinateur, on ne paie pas sans conseil, on appelle les bonnes personnes et on restaure la copie de sauvegarde."}, {"t": "Une employée a cliqué sur un lien dans un faux courriel de livraison et a entré son mot de passe.", "b": "Faux courriel cliqué", "w": "On change vite le mot de passe, on prévient, et on regarde si le compte a servi."}, {"t": "Une alerte signale 50 échecs de connexion en 30 secondes sur la messagerie du patron", "b": "Mot de passe deviné", "w": "Beaucoup d’essais, très vite, sur un même compte : on bloque la source et on renforce le compte."}, {"t": "Le journal montre 80 essais depuis la même adresse sur le compte d’un employé, tous ratés", "b": "Mot de passe deviné", "w": "Même scénario, même fiche. Les essais ratés comptent aussi : on bloque avant qu’un essai réussisse."}, {"t": "Un message à l’écran : « Vos fichiers sont chiffrés, payez en cryptomonnaie »", "b": "Fichiers pris en otage", "w": "Rançon classique. On isole l’ordinateur et on restaure la copie de sauvegarde."}, {"t": "Les photos des clients ne s’ouvrent plus et portent une extension bizarre", "b": "Fichiers pris en otage", "w": "Des fichiers illisibles qui ont changé de nom : le signe d’un chiffrement. On isole avant que ça se propage."}, {"t": "Une employée vient de taper ses identifiants sur une fausse page de connexion de la messagerie", "b": "Faux courriel cliqué", "w": "Elle a donné son mot de passe. On le change tout de suite, on prévient, et on regarde si le compte a servi."}, {"t": "Un employé dit : « J’ai cliqué sur le lien d’un courriel de facture et j’ai entré mon mot de passe »", "b": "Faux courriel cliqué", "w": "Même fiche : changer le mot de passe, prévenir, vérifier."}]}]}, "108": {"id": "defi-2-5-enqueter-et-bloquer", "title": "Défi 2.5 — Enquêter et bloquer", "hints": ["Indice : quel geste ferme la porte utilisée sans mettre tout le café à l'arrêt ?", "Autre façon de le dire : on bloque, on renforce, on vérifie. On n'éteint pas tout et on n'efface rien."], "blocks": [{"kind": "cls", "con": "À 14 h 02, le journal du compte du patron montre : 200 essais de mot de passe depuis la même adresse, puis une connexion réussie. Que fais-tu ?", "show": 7, "items": [{"t": "Bloquer l'adresse d'où viennent les essais", "b": "À faire", "w": "Tu coupes l'accès utilisé. C'est rapide, et tu peux l'annuler si tu t'es trompé."}, {"t": "Éteindre tout le système du café", "b": "À ne pas faire", "w": "Tous les clients en pâtissent, et tu perds des indices. On ferme la porte visée, pas tout le café."}, {"t": "Changer le mot de passe et ajouter la double vérification sur ce compte", "b": "À faire", "w": "Le mot de passe a été trouvé. Il faut une deuxième preuve qu'il n'a pas."}, {"t": "Effacer le journal pour repartir sur une base propre", "b": "À ne pas faire", "w": "C'est ta seule preuve. Sans lui, tu ne sauras plus ce qui a été touché."}, {"t": "Vérifier ce que ce compte a fait après la connexion réussie", "b": "À faire", "w": "Entrer n'est pas la fin : il faut voir ce que la personne a touché."}, {"t": "Noter l’heure exacte et l’adresse d’où viennent les essais", "b": "À faire", "w": "Ces détails servent à bloquer, à enquêter et à rédiger le rapport."}, {"t": "Prévenir la personne responsable du café", "b": "À faire", "w": "Voir ne suffit pas : il faut qu’une personne qui peut agir soit au courant."}, {"t": "Répondre à l’attaquant pour lui dire qu’on l’a repéré", "b": "À ne pas faire", "w": "Tu lui apprends qu’il est surveillé et tu lui laisses le temps de changer de méthode."}, {"t": "Attendre au lendemain pour voir si ça recommence", "b": "À ne pas faire", "w": "Une fois entré, il agit en minutes. Attendre, c’est le laisser faire."}, {"t": "Débrancher tous les ordinateurs, caisse comprise, en pleine heure de pointe", "b": "À ne pas faire", "w": "On ferme la porte visée, pas tout le café. Sinon c’est le café qui paie."}]}, {"kind": "order", "con": "Une attaque est en cours sur le compte du patron. Remets les gestes dans l’ordre. Clique d’abord sur le premier.", "show": 4, "items": [{"t": "Relire le journal pour voir ce qui s’est passé", "n": 1, "w": "On ne bloque pas à l’aveugle : il faut d’abord savoir d’où ça vient et ce qui a été touché."}, {"t": "Bloquer l’adresse d’où viennent les essais", "n": 2, "w": "Tu coupes l’accès que la personne utilise, vite et sans casser le reste du café."}, {"t": "Changer le mot de passe et ajouter la double vérification", "n": 3, "w": "Tu ajoutes la protection qui manquait pour que ça ne recommence pas."}, {"t": "Noter ce qui s’est passé et ce qu’on a renforcé", "n": 4, "w": "Ce qu’on écrit aujourd’hui servira à la prochaine fois, et à ceux qui devront être prévenus."}]}]}, "109": {"id": "defi-3-1-trouver-n-est-pas-croire", "title": "Défi 3.1 — Trouver n'est pas croire", "hints": ["Indice : pour chaque source, demande-toi : qui parle, et sur quelle preuve ?", "Autre façon de le dire : une source solide se nomme et montre ses preuves. Une source à vérifier reste floue ou presse."], "blocks": [{"kind": "cls", "con": "Tu cherches de l'information sur une faille dans un logiciel. Pour chaque source : solide, ou à vérifier ?", "show": 7, "items": [{"t": "La page officielle de l'entreprise qui fabrique le logiciel et qui parle de sa propre faille", "b": "Solide", "w": "Elle connaît son produit et elle annonce le problème elle-même. Garde quand même un œil sur ce qu'elle minimise."}, {"t": "Une capture d'écran sans nom ni date, publiée par un compte anonyme", "b": "À vérifier", "w": "Personne ne répond de ce qu'elle montre. Elle peut être fausse, vieille ou modifiée."}, {"t": "L'article d'un chercheur connu qui explique sa méthode et cite ses sources", "b": "Solide", "w": "Il montre ses preuves et on peut refaire son chemin. Confirme tout de même avec une autre source."}, {"t": "Un courriel qui dit « Urgent : installe ce correctif ici »", "b": "À vérifier", "w": "L'urgence et un lien qui arrive tout seul : c'est le profil d'un message piégé. Va chercher le correctif sur le site officiel, que tu tapes toi-même."}, {"t": "Un commentaire en ligne : « Tout le monde sait que ça marche »", "b": "À vérifier", "w": "« Tout le monde sait » n'est pas une preuve. Qui est « tout le monde » ?"}, {"t": "L’avis de sécurité publié par un organisme national de cybersécurité", "b": "Solide", "w": "Il n’a rien à vendre, il cite la faille et la correction, et on peut le vérifier à la source."}, {"t": "Un article de recherche qui donne ses données et que d’autres chercheurs ont refait avec le même résultat", "b": "Solide", "w": "Reproduire un résultat, c’est la meilleure preuve : d’autres que l’auteur y arrivent aussi."}, {"t": "Une vidéo d’un influenceur qui vend un cours de piratage « garanti »", "b": "À vérifier", "w": "Qu’est-ce que ça lui rapporte ? Il a intérêt à ce que tu y croies."}, {"t": "Un forum où un inconnu dit avoir « testé » la faille sans rien montrer", "b": "À vérifier", "w": "Aucune preuve. Seulement une affirmation."}, {"t": "Un site apparu la semaine dernière qui copie un article sans citer l’auteur", "b": "À vérifier", "w": "Qui parle ? On ne sait pas. Et ce qu’il copie peut avoir été modifié."}, {"t": "Un courriel de « ta banque » qui te donne un lien pour « vérifier la faille »", "b": "À vérifier", "w": "Un lien reçu tout seul, avec une raison pressante : le profil d’un message piégé, vu dans l’Alphabet."}]}]}, "110": {"id": "defi-3-2-chercher-ailleurs-que-dans-google", "title": "Défi 3.2 — Chercher ailleurs que dans Google", "hints": ["Indice : la réponse est-elle sur une page d'aujourd'hui, sur une page d'autrefois, ou sur un appareil branché ?", "Autre façon de le dire : question générale = Google. Page d'autrefois = archives. Appareil visible de l'extérieur = moteur d'appareils."], "blocks": [{"kind": "cls", "con": "Quelle question pour quel outil ?", "show": 6, "items": [{"t": "À quoi ressemblait le site du Café du Coin il y a cinq ans ?", "b": "Archives du web", "w": "Les archives gardent des copies datées des pages. Google montre surtout la page d'aujourd'hui."}, {"t": "Comment faire un gâteau au fromage ?", "b": "Google", "w": "Question générale, plein de pages utiles : un grand moteur fait très bien ça."}, {"t": "L'imprimante de mon bureau est-elle visible depuis Internet, alors qu'elle ne devrait pas ?", "b": "Moteur d'appareils branchés", "w": "Ces moteurs listent les appareils visibles de l'extérieur. Tu peux vérifier tes propres appareils."}, {"t": "Que disait la page « À propos » d'une entreprise avant sa refonte ?", "b": "Archives du web", "w": "C'est une ancienne version d'une page : le travail des archives du web."}, {"t": "Retrouver ce que disait une page supprimée la semaine dernière", "b": "Archives du web", "w": "Les archives gardent des copies datées. Une page effacée aujourd’hui peut avoir été copiée hier."}, {"t": "Quel numéro de téléphone un commerce affichait-il avant de fermer son site ?", "b": "Archives du web", "w": "Une ancienne version de page : le travail des archives."}, {"t": "Ma caméra de surveillance est-elle visible depuis Internet, sans mot de passe ?", "b": "Moteur d'appareils branchés", "w": "Ces moteurs listent les appareils visibles de l’extérieur. Tu peux vérifier les tiens."}, {"t": "Combien de caisses du même modèle que la mienne sont visibles depuis Internet ?", "b": "Moteur d'appareils branchés", "w": "Ce sont des appareils exposés : un moteur spécialisé les liste, pas un moteur général."}, {"t": "Quel est le nom du logiciel de caisse que recommande mon fournisseur ?", "b": "Google", "w": "Question générale, réponse sur de nombreuses pages : un grand moteur suffit."}, {"t": "Quelle est la différence entre un correctif et une mise à jour ?", "b": "Google", "w": "Une explication générale : un grand moteur la trouve bien."}]}]}, "111": {"id": "defi-3-3-le-numero-de-dossier-d-une-faille", "title": "Défi 3.3 — Le numéro de dossier d'une faille", "hints": ["Indice : pour chaque fiche, deux questions : est-ce que ça me concerne ? Est-ce que tout le monde peut l'atteindre ?", "Autre façon de le dire : grave + je l'utilise + exposé = en premier. Je ne l'utilise pas = pas pour moi."], "blocks": [{"kind": "cls", "con": "Le Café du Coin utilise un logiciel de caisse et un site web. Voici quatre fiches de failles. Dans quel ordre t'en occupes-tu ?", "show": 6, "items": [{"t": "Note 9,8. Touche le logiciel de la caisse. Visible depuis Internet.", "b": "En premier", "w": "Très grave, ça touche ce que tu utilises, et tout le monde peut l'atteindre."}, {"t": "Note 9,8. Touche un logiciel que le café n'utilise pas.", "b": "Pas pour moi", "w": "La note mesure la gravité en général. Si tu n'as pas ce logiciel, ça ne te concerne pas."}, {"t": "Note 4,3. Touche le logiciel de la caisse. Atteignable seulement depuis l'intérieur du café.", "b": "Plus tard", "w": "Moins grave et difficile à atteindre. À corriger, mais sans urgence."}, {"t": "Note 7,5. Touche le site web du café. Visible depuis Internet.", "b": "En premier", "w": "Grave, et exposé à tout le monde. Ce n'est pas une faille qu'on remet à plus tard."}, {"t": "Note 7,8. Touche le site web du café. Visible depuis Internet.", "b": "En premier", "w": "Grave et exposé à tout le monde : on s’en occupe avant les autres."}, {"t": "Note 3,1. Touche le site web du café. Atteignable seulement depuis l’intérieur.", "b": "Plus tard", "w": "Peu grave et difficile à atteindre. À corriger, sans urgence."}, {"t": "Note 5,0. Touche le logiciel de la caisse. Atteignable seulement depuis l’intérieur du café.", "b": "Plus tard", "w": "Moyen, et il faut déjà être dans la place. On le planifie."}, {"t": "Note 8,8. Touche une caisse d’une autre marque que celle du café.", "b": "Pas pour moi", "w": "La note est haute, mais ça ne concerne pas ce que tu utilises."}, {"t": "Note 9,1. Touche une imprimante que le café n’a jamais achetée.", "b": "Pas pour moi", "w": "Une faille très grave sur un appareil que tu n’as pas : pas ton dossier."}]}]}, "112": {"id": "defi-3-4-le-code-trouve-en-ligne-lire-avant-d-essayer", "title": "Défi 3.4 — Le code trouvé en ligne : lire avant d'essayer", "hints": [], "blocks": [{"kind": "multi", "con": "Tu trouves un script qui promet de tester une faille. Quelles sont les bonnes premières étapes ? Trouve-les toutes.", "show": 5, "items": [{"t": "Je le lance tout de suite sur mon ordinateur de tous les jours", "ok": 0, "w": "Si c'est piégé ou raté, c'est ton ordinateur qui paie."}, {"t": "Je le lis pour comprendre ce qu'il fait. Je ne l'essaie que dans mon laboratoire isolé.", "ok": 1, "w": "Tu vérifies qu'il fait ce qu'il annonce. Et s'il se trompe, tu ne perds rien."}, {"t": "Je lui fais confiance : il a beaucoup d'étoiles sur la page", "ok": 0, "w": "Les étoiles disent que c'est populaire, pas que c'est sûr."}, {"t": "Je le lance sur le site de quelqu'un d'autre, pour voir", "ok": 0, "w": "Sans permission, c'est une intrusion. Même « juste pour voir »."}, {"t": "Je cherche qui l’a écrit et d’où il vient, puis je le lis avant de l’essayer dans mon laboratoire isolé", "ok": 1, "w": "Tu vérifies la source, tu comprends ce qu’il fait, et tu ne risques rien si c’est raté."}, {"t": "Je regarde si d’autres chercheurs ont confirmé qu’il fait bien ce qu’il promet", "ok": 1, "w": "Une confirmation indépendante vaut plus que la promesse de l’auteur."}, {"t": "Je désactive mon antivirus pour qu’il ne le bloque pas, puis je le lance", "ok": 0, "w": "S’il le bloque, c’est peut-être pour une raison. Tu retires la seule protection."}, {"t": "Je le modifie un peu et je le lance sur le site de mon ancien patron", "ok": 0, "w": "Aucune permission : c’est une intrusion, même avec un script « modifié »."}, {"t": "Je l’envoie à mes collègues sans l’avoir lu pour qu’ils l’essaient", "ok": 0, "w": "Tu leur passes un risque que tu n’as pas mesuré."}]}, {"kind": "cls", "con": "Bilan de la Cyber-Algèbre : bon ou mauvais réflexe ? Il n’y a pas d’indice, cette fois.", "show": 6, "items": [{"t": "Demander une autorisation écrite avant de tester le site d’un client", "b": "Bon réflexe", "w": "Sans permission écrite, même un test devient une intrusion."}, {"t": "Bloquer l’adresse qui essaie 200 mots de passe, puis renforcer le compte", "b": "Bon réflexe", "w": "On coupe l’accès utilisé, puis on ajoute la protection qui manquait."}, {"t": "Garder le journal intact : c’est la preuve", "b": "Bon réflexe", "w": "Sans lui, on ne sait plus ce qui a été touché."}, {"t": "Trier les alertes pour regarder d’abord celle qui est vraiment étrange", "b": "Bon réflexe", "w": "Presque tout est normal. Le travail, c’est de repérer ce qui ne l’est pas."}, {"t": "Se demander qui parle, sur quelle preuve, et ce que ça lui rapporte", "b": "Bon réflexe", "w": "Les trois questions pour évaluer une source."}, {"t": "Lire un script inconnu avant de l’essayer, dans un labo isolé", "b": "Bon réflexe", "w": "Tu vérifies ce qu’il fait, et tu ne risques rien si c’est piégé."}, {"t": "Tester « juste pour voir » le site de son école", "b": "Mauvais réflexe", "w": "Même par curiosité, sans permission, c’est une intrusion."}, {"t": "Éteindre tout le système à la première alerte, clients compris", "b": "Mauvais réflexe", "w": "On ferme la porte visée, pas tout le café."}, {"t": "Corriger en premier la faille de note 9,8 sur un logiciel qu’on n’utilise pas", "b": "Mauvais réflexe", "w": "La note mesure la gravité en général. Ça ne te concerne pas."}, {"t": "Croire un commentaire parce que « tout le monde sait que ça marche »", "b": "Mauvais réflexe", "w": "« Tout le monde sait » n’est pas une preuve."}, {"t": "Lancer un script trouvé en ligne sur son ordinateur de tous les jours", "b": "Mauvais réflexe", "w": "Si c’est piégé ou raté, c’est ton ordinateur qui paie."}, {"t": "Effacer le journal pour repartir sur une base propre", "b": "Mauvais réflexe", "w": "C’est ta seule preuve."}]}]}, "113": {"id": "defi-1-3-la-porte-de-service", "title": "Défi 1.3 — La porte de service", "hints": ["Indice : pour chaque cas, demande-toi ce qui arrive si un inconnu tombe sur l'adresse. Est-ce qu'on lui demande qui il est ?", "Autre façon de le dire : une porte qu'on ne voit pas de la rue, mais qui n'est pas barrée, reste une porte ouverte."], "blocks": [{"kind": "cls", "con": "Pour chaque page ou fichier du café : est-ce vraiment protégé, ou seulement caché ?", "show": 6, "items": [{"t": "Une page de gestion des ventes qui n’apparaît dans aucun menu, et qui ne demande aucun mot de passe.", "b": "Seulement cachée", "w": "Seulement cachée. Ne pas être dans un menu ne bloque personne : quiconque a l’adresse entre."}, {"t": "Une page de gestion qui demande un compte, un mot de passe fort et la double vérification.", "b": "Protégée", "w": "Protégée. Même si quelqu’un trouve l’adresse, on lui demande de prouver qui il est."}, {"t": "Un fichier de sauvegarde mis en ligne avec un nom très compliqué, ouvert à quiconque a le lien.", "b": "Seulement cachée", "w": "Seulement caché. Un nom compliqué n’est pas une serrure : un lien finit toujours par circuler."}, {"t": "Un espace employés où chaque personne a son propre compte, et où les autres sont refusés.", "b": "Protégée", "w": "Protégé. Chaque entrée est vérifiée, et les inconnus sont refusés."}, {"t": "Une vieille page de test oubliée en ligne, « que personne ne connaît ».", "b": "Seulement cachée", "w": "Seulement cachée. « Personne ne la connaît » ne protège rien. Une page oubliée, on la retire ou on la ferme."}, {"t": "La liste des clients partagée avec un lien « toute personne ayant le lien ».", "b": "Seulement cachée", "w": "Seulement cachée. N’importe qui qui reçoit ou trouve le lien peut l’ouvrir."}, {"t": "Un document partagé seulement avec deux comptes précis, qui doivent se connecter pour l’ouvrir.", "b": "Protégée", "w": "Protégé. L’accès est donné à des personnes nommées, pas à quiconque a le lien."}, {"t": "La page d’administration n’est joignable que depuis le réseau interne du café, et demande en plus un compte.", "b": "Protégée", "w": "Protégée. Deux barrières : il faut être à l’intérieur, et prouver qui on est."}, {"t": "Le mot de passe de la page de gestion est écrit en commentaire dans le code du site.", "b": "Seulement cachée", "w": "Pas protégé. Le code d’un site, tout le monde peut l’afficher : c’est une clé laissée sous le paillasson."}, {"t": "Les factures sont rangées dans un dossier du site dont on n’a « donné l’adresse à personne ».", "b": "Seulement cachée", "w": "Seulement cachées. Une adresse non donnée n’est pas une adresse fermée."}]}, {"kind": "order", "con": "Ton mandat signé t’autorise à vérifier le site du café. Tu tombes sur une page de gestion ouverte à tous. Remets tes gestes dans l’ordre. Clique d’abord sur le premier.", "show": 4, "items": [{"t": "Noter ce que tu as vu (l’adresse, l’heure), sans rien modifier", "n": 1, "w": "Tu gardes la preuve, et tu ne touches à rien : ton rôle est de constater, pas de changer."}, {"t": "T’arrêter là : ne pas fouiller plus loin que ce que le mandat permet", "n": 2, "w": "Le mandat fixe les limites. Une porte ouverte n’est pas une invitation à tout visiter."}, {"t": "Prévenir le patron dans ton rapport, sans attendre", "n": 3, "w": "Une faille connue mais pas signalée reste ouverte pour les autres."}, {"t": "Proposer la correction : demander un compte pour entrer, ou retirer la page", "n": 4, "w": "Le but, c’est que le café répare. On ferme la porte, on ne se contente pas de la cacher mieux."}]}]}};
var META={"101": {"emoji": "📁", "app": "Dossier des mandats", "the": "le Dossier des mandats", "id": "mandats", "tag": "Mission · Défi 1.1", "title": "Qui a le droit de tester la serrure ?", "notion": "<p>La <b>sécurité offensive</b>, c’est jouer l’attaquant pour trouver les faiblesses avant les vrais attaquants, <b>avec la permission du propriétaire</b>.</p><p style=\"margin-top:8px\"><b>Exemple :</b> une serrurière engagée pour crocheter ta porte et te remettre un rapport. La nuit, quelqu’un fait le même geste sans permission : c’est une intrusion.</p>", "intro": "Le Dossier des mandats contient des situations. Pour chacune : autorisé, ou attaque ?", "scene": "📁 Dossier de {pre}. Chaque fiche est une situation. La technique est la même : seule la permission change tout.", "go": "🤖 Faire vérifier", "ok": "La technique ne distingue pas un pro d’un pirate. La permission, oui.", "win": "Tu as séparé le test autorisé de l’attaque : c’est la permission qui compte.", "m": "Pour chaque cas, cherche une seule chose : est-ce que le propriétaire a donné sa permission, de préférence par écrit ? La technique ne compte pas, c’est la permission qui change tout.", "e": "La sécurité offensive, c’est jouer l’attaquant pour trouver les faiblesses avant les vrais attaquants, avec la permission du propriétaire. Comme la serrurière que tu engages pour tester ta porte : même geste que le voleur de la nuit, mais autorisé.", "a": "Prends le premier cas ensemble : lis-le, puis demande-toi « qui est le propriétaire, et a-t-il dit oui clairement ? ». Si tu ne trouves aucun oui, c’est une attaque. Refais la même chose pour chaque cas.", "q": {"q": "Une amie te dit : « Teste mon site, je suis d’accord. » Qu’est-ce qui rend le cadre vraiment solide ?", "o": ["Rien de plus, un oui à voix haute suffit", "Un accord écrit qui dit quoi tester et quand", "Un outil plus puissant"], "ok": 1, "why": "Un accord écrit précise la cible et le moment. Sans lui, personne ne peut prouver qu’il y avait une permission."}}, "102": {"emoji": "🧪", "app": "Carte des terrains", "the": "la Carte des terrains", "id": "terrains", "tag": "Mission · Défi 1.2", "title": "Ton terrain d’entraînement", "notion": "<p>Une <b>machine de laboratoire</b>, c’est un faux système, isolé du monde réel, fait exprès pour qu’on s’exerce à l’attaquer sans rien risquer.</p><p style=\"margin-top:8px\"><b>Exemple :</b> un pilote apprenti s’entraîne dans un simulateur, pas avec de vrais passagers.</p>", "intro": "La Carte des terrains liste des endroits où t’exercer. Lesquels sont permis ?", "scene": "🧪 Carte de {pre}. Pour chaque endroit : un terrain permis pour t’exercer, ou pas le tien ?", "go": "🤖 Faire vérifier", "ok": "Un terrain permis existe exprès pour ça, ou t’appartient en entier.", "win": "Tu sais où t’entraîner sans toucher à ce qui n’est pas à toi.", "m": "Pose-toi deux questions : cet endroit existe-t-il exprès pour qu’on s’y exerce ? ou m’appartient-il en entier et est-il coupé de tout le reste ? Si ce n’est ni l’un ni l’autre, ce n’est pas un terrain permis.", "e": "Une machine de laboratoire est un faux système, isolé du monde réel, où l’on a le droit de se tromper. Comme le simulateur de vol du pilote apprenti : il peut « s’écraser », personne n’est blessé.", "a": "Prends le premier endroit : qui l’a créé, et pour quoi ? Si quelqu’un a dit « ici, c’est permis », ou s’il est à toi et isolé, c’est un terrain permis. Sinon, il n’est pas à toi.", "q": {"q": "Tu as repéré une faille sur le site de ton école. Où t’exerces-tu à comprendre comment elle fonctionne ?", "o": ["Sur le site de l’école, discrètement", "Dans un labo prévu pour ça, ou sur ta propre machine isolée", "Sur le site d’un commerce du coin"], "ok": 1, "why": "Pour comprendre une faille, on s’exerce sur un terrain permis, jamais sur le vrai système de quelqu’un d’autre."}}, "103": {"emoji": "🎭", "app": "Tableau des métiers", "the": "le Tableau des métiers", "id": "metiers", "tag": "Mission · Défi 1.4", "title": "Les métiers : qui fait quoi", "notion": "<p><b>Pentester</b> : teste une cible précise, avec permission, et remet un rapport. <b>Équipe rouge</b> : joue l’adversaire contre toute l’entreprise. <b>Ingénieur sécurité</b> : conçoit et entretient les protections.</p><p style=\"margin-top:8px\">Trois métiers, aucun ne remplace les autres.</p>", "intro": "Associe chaque tâche à son métier, puis remets les étapes d’un test d’intrusion dans l’ordre.", "scene": "🎭 Équipe de {pre}. Qui fait quoi ? Puis clique les étapes dans l’ordre (le premier, le deuxième…). Clique un numéro pour le retirer.", "go": "🤖 Faire vérifier", "ok": "Trois directions, une pour commencer.", "win": "Tu distingues le pentester, l’équipe rouge et l’ingénieur, et tu connais l’ordre d’un test.", "m": "Demande-toi : la cible est-elle précise, avec un rapport à la fin (pentester) ? Est-ce toute l’organisation mise à l’épreuve (équipe rouge) ? Ou construit-on les protections (ingénieur sécurité) ? Pour l’ordre, cherche ce qui doit exister avant que le reste soit permis.", "e": "Pentester : teste une cible précise, avec permission, et remet un rapport. Équipe rouge : joue l’adversaire contre toute l’entreprise. Ingénieur sécurité : conçoit et entretient les protections. Comme sur un chantier : l’inspectrice, l’équipe cambrioleuse et l’architecte.", "a": "Pour chaque tâche, trouve le mot qui la décrit : « une cible précise », « toute l’entreprise », ou « installer / régler une protection ». Pour l’ordre des quatre temps, commence par ce qui rend tout le reste légal, et termine par ce qui permet au propriétaire de réparer.", "q": {"q": "Une entreprise veut savoir si ses employés remarqueraient une vraie attaque, pendant des semaines. Qui engage-t-elle ?", "o": ["Un pentester", "Une équipe rouge", "Un ingénieur sécurité"], "ok": 1, "why": "Toute l’organisation est mise à l’épreuve, y compris sa capacité à détecter : c’est le travail d’une équipe rouge."}}, "104": {"emoji": "🔒", "app": "Plan de défense", "the": "le Plan de défense", "id": "defense", "tag": "Mission · Défi 2.1", "title": "Les serrures et les caméras", "notion": "<p>Défendre, c’est deux métiers : <b>empêcher</b> les intrusions, et <b>voir</b> celles qui passent quand même pour pouvoir réagir.</p><p style=\"margin-top:8px\"><b>Exemple :</b> un verrou empêche. Une caméra permet de voir. Un bon système a les deux.</p>", "intro": "Chaque geste du Plan de défense : est-ce qu’il empêche, ou qu’il permet de voir ?", "scene": "🔒 Plan de défense de {pre}. Pour chaque geste : empêcher, ou voir ?", "go": "🤖 Faire vérifier", "ok": "Empêcher et voir : un bon système a les deux.", "win": "Tu sais distinguer ce qui bloque de ce qui permet de réagir.", "m": "Pour chaque geste, imagine un voleur : est-ce que ça le bloque (empêcher) ? Ou est-ce que ça garde une trace ou t’avertit pour que tu réagisses (voir) ?", "e": "Défendre, c’est deux métiers : empêcher les intrusions et voir celles qui passent quand même. Comme au café : le verrou empêche, la caméra permet de voir.", "a": "Prends le premier geste. Pose-toi la question : « est-ce qu’il arrête quelqu’un, ou est-ce qu’il me dit ce qui s’est passé ? ». Un seul mot : empêcher ou voir. Refais la même chose pour chacun.", "q": {"q": "Un journal note chaque connexion au serveur. Est-ce que ça empêche, ou que ça permet de voir ?", "o": ["Empêcher", "Voir"], "ok": 1, "why": "Le journal ne bloque personne, mais il garde la trace de ce qui s’est passé."}}, "105": {"emoji": "🖥️", "app": "Salle de contrôle", "the": "la Salle de contrôle", "id": "soc", "tag": "Mission · Défi 2.2", "title": "La salle de contrôle", "notion": "<p>Un <b>SOC</b> (centre des opérations de sécurité), c’est l’équipe qui surveille les systèmes jour et nuit pour repérer ce qui est dangereux et alerter.</p><p style=\"margin-top:8px\">Il ne voit pas « tout » : il trie, et reconnaît la petite chose qui n’est pas normale.</p>", "intro": "Dans la Salle de contrôle, chaque tâche est-elle le travail d’un SOC ?", "scene": "🖥️ Salle de contrôle de {pre}. Pour chaque tâche : le travail du SOC, ou pas ?", "go": "🤖 Faire vérifier", "ok": "Surveiller, trier, alerter : c’est ça, un SOC.", "win": "Tu reconnais le travail d’un SOC : surveiller, trier, alerter.", "m": "Demande-toi : cette tâche, c’est surveiller les systèmes, trier les signaux ou prévenir quelqu’un en cas de vrai problème ? Si c’est réparer un poste ou créer quelque chose, c’est utile, mais ce n’est pas le SOC.", "e": "Un SOC, c’est l’équipe qui surveille les systèmes jour et nuit pour repérer ce qui est dangereux et alerter. Comme l’agent de la salle de contrôle : il ne regarde pas tout le monde, il repère ce qui ne ressemble pas aux autres.", "a": "Prends la première tâche et cherche les mots « surveiller », « trier », « avertir ». Si tu les trouves, c’est le travail d’un SOC. Si la tâche répare, installe ou fabrique, c’est un autre métier.", "q": {"q": "Quelle est la différence entre le SOC et le soutien technique ?", "o": ["Le SOC surveille la sécurité en continu, le soutien répare les problèmes de poste", "Il n’y en a aucune", "Le SOC installe les ordinateurs"], "ok": 0, "why": "Les deux sont utiles, mais le SOC regarde ce qui est dangereux, pas ce qui est en panne."}}, "106": {"emoji": "🚨", "app": "Boîte d’alertes", "the": "la Boîte d’alertes", "id": "alertes", "tag": "Mission · Défi 2.3", "title": "Trop de bruit", "notion": "<p>Une <b>alerte</b>, c’est un signal qui dit « regarde ici ». Une <b>fausse alerte</b> (faux positif) avait l’air dangereuse, mais ne l’était pas.</p><p style=\"margin-top:8px\">Trop d’alertes, et on finit par ne plus les lire. Il faut repérer celles qui détonnent.</p>", "intro": "La Boîte d’alertes déborde. Marque celles que tu regardes en premier.", "scene": "🚨 Boîte d’alertes de {pre}. Clique sur les alertes à regarder en premier, et seulement celles-là.", "go": "🤖 Faire vérifier", "ok": "Tu as trouvé le vrai signal dans le bruit.", "win": "Tu as trié le bruit pour garder les vraies alertes.", "m": "Cherche ce qui détonne : trop vite, trop nombreux, mauvaise heure, mauvais endroit. Une alerte habituelle ou prévue peut attendre, mais plusieurs signaux qui s’additionnent méritent un coup d’œil.", "e": "Une alerte dit « regarde ici ». Une fausse alerte avait l’air dangereuse, mais ne l’était pas. Comme un samedi midi au café : sur mille clients, un seul rôde, et c’est lui qu’il faut reconnaître.", "a": "Pour chaque alerte, demande-toi : est-ce habituel ? est-ce prévu ? y a-t-il plusieurs signaux louches en même temps ? Ne marque que celles qui ne sont ni habituelles ni prévues, ou qui cumulent les signaux.", "q": {"q": "Un humain se trompe une fois de mot de passe puis réussit. Une machine en essaie 500 en une minute. Laquelle regardes-tu en premier ?", "o": ["L’humain", "La machine", "Les deux pareil"], "ok": 1, "why": "Trop nombreux, trop vite : un humain ne fait pas ça, c’est un programme qui essaie."}}, "107": {"emoji": "📋", "app": "Cahier des fiches", "the": "le Cahier des fiches", "id": "fiches", "tag": "Mission · Défi 2.4", "title": "Quel genre de problème ?", "notion": "<p>Un <b>playbook</b> est une fiche qui dit : « si tu vois ça, fais ceci, dans cet ordre ». On l’écrit d’avance, au calme.</p><p style=\"margin-top:8px\">On repère le type de problème, on prend la bonne fiche, on suit les étapes.</p>", "intro": "Pour chaque problème, choisis la bonne fiche dans le Cahier.", "scene": "📋 Cahier de {pre}. Quelle fiche sors-tu pour chaque problème ?", "go": "🤖 Faire vérifier", "ok": "La bonne fiche pour le bon problème.", "win": "Tu sors la bonne fiche sans hésiter.", "m": "Repère le symptôme principal : beaucoup d’essais rapides sur un même compte, des fichiers illisibles avec une demande d’argent, ou un clic sur un faux lien. Chaque symptôme a sa fiche.", "e": "Un playbook est une fiche qui dit « si tu vois ça, fais ceci, dans cet ordre ». On l’écrit à l’avance, au calme. Comme les fiches plastifiées du restaurant : feu, vol, fuite d’eau, chacune a ses étapes.", "a": "Pour le premier problème, cherche le mot-clé dans la description : « essais », « fichiers illisibles / argent » ou « lien / courriel ». Prends la fiche qui correspond et passe au suivant.", "q": {"q": "Que contient une bonne fiche ?", "o": ["Cinq gestes courts et qui appeler", "Cinquante pages de théorie", "Le mot de passe du patron"], "ok": 0, "why": "Une bonne fiche est courte : on la suit sous pression, sans hésiter."}}, "108": {"emoji": "🔎", "app": "Console d’enquête", "the": "la Console d’enquête", "id": "enquete", "tag": "Mission · Défi 2.5", "title": "Enquêter et bloquer", "notion": "<p><b>Enquêter</b> : relire les journaux. <b>Bloquer</b> : couper l’accès utilisé. <b>Renforcer</b> : ajouter une protection pour que ça ne recommence pas.</p><p style=\"margin-top:8px\">On ne supprime jamais les journaux : ce sont les preuves. Et on ne coupe pas tout le café pour un seul accès.</p>", "intro": "À la Console d’enquête, décide quoi faire, puis remets les étapes dans l’ordre.", "scene": "🔎 Console de {pre}. Un compte vient d’être attaqué. Que fais-tu ? Puis clique les étapes dans l’ordre. Clique un numéro pour le retirer.", "go": "🤖 Faire vérifier", "ok": "Enquêter, bloquer, renforcer, sans toucher aux preuves.", "win": "Tu as enquêté, bloqué et renforcé, sans effacer les preuves.", "m": "Trois mots : enquêter (lire les journaux), bloquer (couper l’accès utilisé), renforcer (ajouter une protection). Jamais effacer les preuves, jamais tout éteindre.", "e": "Enquêter, c’est relire les journaux. Bloquer, c’est couper l’accès que la personne utilise. Renforcer, c’est ajouter une protection pour que ça ne recommence pas. Comme le patron qui relit les images, ferme la porte visée et ajoute un verrou, sans démolir le café.", "a": "Pour chaque geste, demande-toi : est-ce qu’il coupe seulement l’accès utilisé ? est-ce qu’il garde les preuves ? Si oui, plutôt à faire. Pour l’ordre : comprendre avant de couper, couper avant de renforcer, noter à la fin.", "q": {"q": "Pourquoi ne supprime-t-on jamais les journaux ?", "o": ["Ils ralentissent l’ordinateur", "Ce sont les preuves de ce qui s’est passé", "Ils sont trop petits"], "ok": 1, "why": "Sans le journal, tu ne sais plus ce qui a été touché."}}, "109": {"emoji": "📰", "app": "Dossier de presse", "the": "le Dossier de presse", "id": "sources", "tag": "Mission · Défi 3.1", "title": "Trouver n’est pas croire", "notion": "<p><b>Évaluer une source</b>, c’est poser trois questions : qui parle ? sur quelle preuve ? qu’est-ce que ça lui rapporte ?</p><p style=\"margin-top:8px\">Pour les choses importantes, une seule source ne suffit pas : on cherche une deuxième, indépendante.</p>", "intro": "Le Dossier de presse contient des sources sur une faille. Solide, ou à vérifier ?", "scene": "📰 Dossier de {pre}. Tu cherches de l’information sur une faille. Pour chaque source : solide, ou à vérifier ?", "go": "🤖 Faire vérifier", "ok": "Qui parle, quelle preuve, quel intérêt.", "win": "Tu sais faire la différence entre trouver et croire.", "m": "Pour chaque source, trois questions : qui parle ? sur quelle preuve ? qu’est-ce que ça lui rapporte ? Une source anonyme, urgente ou sans preuve est à vérifier.", "e": "Évaluer une source, c’est poser trois questions : qui parle ? sur quelle preuve ? qu’est-ce que ça lui rapporte ? Comme quand ton voisin te dit que le citron guérit tout et que la pharmacienne te dit autre chose : tu ne les crois pas de la même façon.", "a": "Prends la première source et réponds aux trois questions dans ta tête. Si tu trouves un nom, une preuve et peu d’intérêt caché, elle est solide. Si une des trois manque, elle est à vérifier.", "q": {"q": "Une seule source affirme qu’un logiciel est dangereux. Que fais-tu avant d’agir ?", "o": ["Je la crois, elle a l’air sûre", "Je cherche une deuxième source indépendante", "Je la partage à tout le monde"], "ok": 1, "why": "Pour les choses importantes, une seule source ne suffit pas."}}, "110": {"emoji": "🔭", "app": "Annuaire des outils", "the": "l’Annuaire des outils", "id": "outils", "tag": "Mission · Défi 3.2", "title": "Chercher ailleurs que dans Google", "notion": "<p>Un <b>moteur de recherche spécialisé</b> cherche très bien dans un seul domaine : les appareils branchés à Internet, d’anciennes versions de pages, les failles connues…</p><p style=\"margin-top:8px\">Chaque question a son annuaire.</p>", "intro": "Pour chaque question, choisis le bon outil dans l’Annuaire.", "scene": "🔭 Annuaire de {pre}. Quelle question pour quel outil ?", "go": "🤖 Faire vérifier", "ok": "Chaque question a son outil.", "win": "Tu choisis le bon outil pour chaque question.", "m": "Demande-toi sur quoi porte la question : une page du passé (archives du web), un appareil visible depuis Internet (moteur d’appareils), ou une question générale (grand moteur).", "e": "Un moteur spécialisé cherche très bien dans un seul domaine. Comme l’annuaire des commerces et l’annuaire des appareils branchés à Internet : chacun connaît très bien son domaine.", "a": "Pour la première question, cherche le mot qui compte : « avant / ancienne version », « visible depuis Internet » ou une question toute simple. Choisis l’annuaire qui correspond.", "q": {"q": "Tu veux voir à quoi ressemblait ta page web il y a trois ans. Quel outil ?", "o": ["Un moteur d’appareils", "Les archives du web", "Un moteur de recettes"], "ok": 1, "why": "Les archives du web gardent des copies datées des pages."}}, "111": {"emoji": "🗂️", "app": "Fiches de failles", "the": "les Fiches de failles", "id": "cve", "tag": "Mission · Défi 3.3", "title": "Le numéro de dossier d’une faille", "notion": "<p>Une <b>CVE</b> est le numéro de dossier unique d’une faille connue. Le <b>CVSS</b> est sa note de gravité, de 0 à 10 (9,0 et plus : critique).</p><p style=\"margin-top:8px\">La note dit la gravité en général. Ce qui compte pour toi : est-ce que tu utilises ce logiciel, et est-ce atteignable ?</p>", "intro": "Parmi les Fiches de failles, dans quel ordre t’en occupes-tu ?", "scene": "🗂️ Fiches de {pre}. Pour chaque faille : en premier, plus tard, ou pas pour moi ?", "go": "🤖 Faire vérifier", "ok": "Gravité, mais aussi ce que tu utilises et ce qui est exposé.", "win": "Tu priorises les failles selon ce que tu utilises vraiment.", "m": "Pour chaque faille, trois questions : est-ce que j’utilise ce logiciel ? est-ce atteignable depuis Internet ? quelle est la note ? Si je ne l’utilise pas, ça ne me concerne pas.", "e": "Une CVE est le numéro de dossier unique d’une faille connue. Le CVSS est sa note de gravité, de 0 à 10. Comme à l’hôpital : un numéro de dossier, et une gravité de bénin à urgent.", "a": "Prends la première faille : réponds d’abord « est-ce que je l’utilise ? ». Si non, ce n’est pas pour toi. Si oui, regarde si elle est atteignable depuis Internet et quelle est sa note, puis classe-la.", "q": {"q": "À partir de quelle note parle-t-on de gravité « critique » ?", "o": ["4,0", "7,0", "9,0"], "ok": 2, "why": "À partir de 9,0, on parle de gravité critique."}}, "112": {"emoji": "🧾", "app": "Bilan de la Cyber-Algèbre", "the": "le Bilan de la Cyber-Algèbre", "id": "bilan", "tag": "Mission · Défi 3.4", "title": "Le code trouvé en ligne : lire avant d’essayer", "notion": "<p>Une <b>preuve de concept (PoC)</b> est un petit programme qui montre qu’une faille est réelle. Il n’est pas fait pour être utilisé tel quel, et il est parfois piégé.</p><p style=\"margin-top:8px\">On le lit avant de l’essayer, et seulement dans un laboratoire isolé.</p>", "intro": "Dernier défi : que fais-tu d’un petit programme (un script) trouvé en ligne ? Puis un bilan de toute la Cyber-Algèbre.", "scene": "🧾 Bilan de {pre}. D’abord le script trouvé en ligne, puis un bilan : bon ou mauvais réflexe, sans indice.", "go": "🤖 Faire vérifier", "ok": "Lire d’abord, essayer ensuite dans un labo isolé.", "win": "Tu as fini la Cyber-Algèbre : tu lis avant d’essayer, et tu as la permission avant de tester.", "i": "Ce qui est écrit dans le script compte plus que le nombre d’étoiles sur sa page. Que fais-tu avant de l’essayer ?", "m": "Lire avant d’essayer, essayer seulement dans un labo isolé, et jamais sur le système de quelqu’un d’autre. Les étoiles et la popularité ne prouvent rien.", "e": "Une preuve de concept est un petit programme qui montre qu’une faille est réelle. Il est souvent incomplet, parfois piégé. Comme une recette trouvée en ligne : tu la lis avant de mettre quoi que ce soit au four.", "a": "Pour chaque proposition, demande-toi : est-ce que ça protège mon ordinateur de tous les jours ? est-ce que j’ai la permission ? est-ce que j’ai lu le code ? Si une réponse est non, c’est un mauvais réflexe.", "q": {"q": "Après avoir lu un script, où l’essaies-tu en premier ?", "o": ["Sur mon ordinateur de tous les jours", "Dans mon labo isolé", "Sur le site de mon ancien patron"], "ok": 1, "why": "Seul un labo isolé te permet de te tromper sans rien perdre ni toucher à quelqu’un d’autre."}}, "113": {"emoji": "🚪", "app": "Dossier du site", "the": "le Dossier du site", "id": "portes", "tag": "Mission · Défi 1.3", "title": "La porte de service", "notion": "<p>Une page <b>cachée</b>, c’est une page qu’on ne voit pas dans les menus. Une page <b>protégée</b>, c’est une page qui demande de prouver qui on est avant d’entrer (un compte, un mot de passe, la double vérification).</p><p style=\"margin-top:8px\"><b>Exemple :</b> la porte de service à l’arrière du café. On ne la voit pas de la rue, mais si elle n’est pas barrée, n’importe qui qui fait le tour peut entrer. Caché, ce n’est pas protégé.</p>", "intro": "Le patron du café t’a signé un mandat pour vérifier son site. Dans le Dossier du site : protégé, ou seulement caché ?", "scene": "🚪 Dossier du site, préparé pour {pre}. Tu as un mandat signé du patron. Pour chaque page ou fichier : vraiment protégé, ou seulement caché ? Puis remets tes gestes dans l’ordre.", "go": "🤖 Faire vérifier", "ok": "Caché, ce n’est pas protégé. Et quand tu trouves une porte ouverte, tu notes, tu t’arrêtes, tu préviens.", "win": "Tu sais faire la différence entre une page cachée et une page protégée, et tu sais quoi faire quand tu trouves une porte ouverte.", "m": "Pour chaque cas, imagine qu’un inconnu tombe sur l’adresse. Lui demande-t-on de prouver qui il est (un compte, un mot de passe) ? Si oui, c’est protégé. Si rien ne l’arrête, c’est seulement caché. Pour l’ordre des gestes : d’abord garder la preuve, puis respecter les limites, puis prévenir, puis réparer.", "e": "Cacher une page, c’est l’enlever des menus. La protéger, c’est demander à chaque visiteur de prouver qui il est. Des robots essaient des milliers d’adresses chaque jour : « personne ne la connaît » ne tient pas longtemps.", "a": "Prends le premier cas. Cherche un mot comme « compte », « mot de passe », « double vérification » ou « personnes précises ». Si tu en trouves un, c’est protégé. Si tu lis plutôt « aucun menu », « nom compliqué », « personne ne connaît » ou « toute personne ayant le lien », c’est seulement caché.", "q": {"q": "Le patron dit : « Ma page de gestion est en sécurité, son adresse est super compliquée. » Qu’en penses-tu ?", "o": ["Il a raison, personne ne devinera", "Elle est seulement cachée : il faut un compte pour y entrer", "Il faut juste changer l’adresse chaque mois"], "ok": 1, "why": "Une adresse compliquée cache la page, mais ne la ferme pas. Ce qui protège, c’est de demander qui entre."}}};
var A0,T={};window.MX100={get:function(){return T},data:DATA};
function rng(seed){var s=seed*9301+49297;return function(){s=(s*9301+49297)%233280;return s/233280}}
function shuffle(a,r){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function rot(a,o){var n=a.length;return a.map(function(_,i){return a[(i+o)%n]})}
function pickBlock(b,p,N){
  var r=rng(p*7+N),items=[];
  if(b.kind==='order'){items=shuffle(b.items.map(function(x,i){return{t:x.t,w:x.w,n:x.n}}),r);
    if(items.map(function(x){return x.n}).join()===[1,2,3,4].join())items.reverse();
    return{kind:'order',con:b.con,items:items}}
  var show=b.show,key=b.kind==='cls'?'b':'ok',groups={},order=[];
  b.items.forEach(function(x){var k=String(x[key]);if(!groups[k]){groups[k]=[];order.push(k)}groups[k].push(x)});
  var take=[];
  if(b.kind==='cls'){
    var lists=order.map(function(k){return rot(groups[k],p*2)}),i=0;
    while(take.length<show&&lists.some(function(l){return l.length})){var l=lists[i%lists.length];if(l.length)take.push(l.shift());i++}
  }else{
    var ok=rot(groups['1']||[],p),no=rot(groups['0']||[],p),nOk=Math.min(ok.length,Math.ceil(show*.45));
    take=ok.slice(0,nOk).concat(no.slice(0,show-nOk));
  }
  items=shuffle(take,r);
  var buckets=b.kind==='cls'?order.slice():null;
  return{kind:b.kind,con:b.con,items:items,buckets:buckets};
}
function reset(A){
  A0=A;var p=Math.min(A.persona(),2),N=T.N;
  T={N:N,p:p,blocks:DATA[N].blocks.map(function(b){return pickBlock(b,p,N-100)}),ans:{},seq:{},busy:false,botHTML:'',touched:false};
}
function allAnswered(){
  return T.blocks.every(function(b,bi){
    if(b.kind==='order')return(T.seq[bi]||[]).length===b.items.length;
    if(b.kind==='multi')return T.touched;
    return b.items.every(function(_,i){return T.ans[bi+'-'+i]!=null})});
}
function app(w,A){
  var M=META[T.N],pre=A.P().pre;
  w.title.textContent=M.app;
  var h='<div class="mx"><p>'+M.scene.replace('{pre}',A.esc(pre))+'</p>';
  T.blocks.forEach(function(b,bi){
    h+='<h4 style="margin:12px 0 6px">'+A.esc(b.con)+'</h4><div style="border:1px solid #dde3e8;border-radius:8px;overflow:hidden">';
    b.items.forEach(function(it,i){
      var id=bi+'-'+i;
      if(b.kind==='cls'){
        h+='<div class="mx-row" style="display:block"><div style="margin-bottom:6px">'+A.esc(it.t)+'</div><div class="mx-tabs" style="margin:0">'+b.buckets.map(function(k){return'<button data-c="'+id+'" data-v="'+A.esc(k)+'" class="'+(T.ans[id]===k?'on':'')+'">'+A.esc(k)+'</button>'}).join('')+'</div></div>';
      }else if(b.kind==='multi'){
        h+='<button class="mx-log'+(T.ans[id]?' on':'')+'" data-m="'+id+'"><span>'+(T.ans[id]?'🚩':'')+'</span><span>'+A.esc(it.t)+'</span></button>';
      }else{
        var seq=T.seq[bi]||[],k=seq.indexOf(i);
        h+='<button class="mx-log'+(k>=0?' on':'')+'" data-o="'+bi+'-'+i+'"><span>'+(k>=0?'<b>'+(k+1)+'</b>':'')+'</span><span>'+A.esc(it.t)+'</span></button>';
      }
    });
    h+='</div>';
  });
  h+='<div class="mx-bar"><button class="mx-b pri" id="m100Go"'+(T.busy?' disabled':'')+'>'+M.go+'</button></div><div id="aBot">'+(T.botHTML||'')+'</div></div>';
  var sc=w.body.scrollTop;w.body.innerHTML=h;w.body.scrollTop=sc;
  var touch=function(){T.botHTML='';if(!T.touched){T.touched=true;A.step(1)}};
  MX.on(w,'[data-c]',function(b){if(T.busy)return;touch();T.ans[b.getAttribute('data-c')]=b.getAttribute('data-v');if(allAnswered())A.step(2);app(w,A)});
  MX.on(w,'[data-m]',function(b){if(T.busy)return;touch();var k=b.getAttribute('data-m');T.ans[k]=!T.ans[k];A.step(2);app(w,A)});
  MX.on(w,'[data-o]',function(b){if(T.busy)return;touch();var p=b.getAttribute('data-o').split('-'),bi=+p[0],i=+p[1],s=T.seq[bi]=T.seq[bi]||[],k=s.indexOf(i);
    if(k>=0)s.splice(k);else s.push(i);if(allAnswered())A.step(2);app(w,A)});
  A.$('m100Go').onclick=check;
}
function check(){
  if(T.busy)return;var A=A0,rows=[],why=[],good=0,tot=0;
  T.blocks.forEach(function(b,bi){
    if(b.kind==='order'){
      var s=T.seq[bi]||[],ordered=b.items.map(function(x,i){return i}).sort(function(a,c){return b.items[a].n-b.items[c].n});
      ordered.forEach(function(idx,pos){tot++;var ok=s[pos]===idx;if(ok)good++;
        rows.push({k:'Étape '+(pos+1),bad:!ok,badLabel:'✕ pas dans l’ordre',goodLabel:'✓ bonne place'});
        if(!ok)why.push('<b>Étape '+(pos+1)+'</b> : « '+A.esc(b.items[idx].t)+' ». '+A.esc(b.items[idx].w))});
      return;
    }
    b.items.forEach(function(it,i){
      tot++;var id=bi+'-'+i,ok,lab=A.esc(it.t.length>46?it.t.slice(0,44)+'…':it.t);
      if(b.kind==='cls'){ok=T.ans[id]===it.b}else{ok=!!T.ans[id]===!!it.ok}
      if(ok)good++;
      rows.push({k:lab,bad:!ok,badLabel:b.kind==='cls'?(T.ans[id]?'✕ pas là':'✕ sans réponse'):(it.ok?'✕ manquée':'✕ à laisser'),goodLabel:'✓'});
      if(!ok)why.push('« '+A.esc(it.t)+' » : '+A.esc(it.w))});
  });
  var res={ok:good===tot,pct:Math.round(good/tot*100)};
  T.busy=true;T.botHTML='';app(A.wins[META[T.N].id],A);
  A.runBot(A.$('aBot'),'🤖 Le robot vérifie',rows,function(){
    if(!res.ok)return'<b class="bad">Pas encore.</b><br>• '+why.join('<br>• ');
    return'<b class="good">Tout est juste.</b> '+META[T.N].ok},function(html){T.botHTML=html;T.busy=false;var w=A.wins[META[T.N].id];if(w)app(w,A);A.finish(res)});
}
function icon(e){return'<svg viewBox="0 0 32 32"><rect x="3" y="3" width="26" height="26" rx="6" fill="#eaf2fb" stroke="#9fb3c8" stroke-width="1.5"/><text x="16" y="23" font-size="16" text-anchor="middle">'+e+'</text></svg>'}
Object.keys(META).forEach(function(N){
  var M=META[N],D=DATA[N],extra={};
  extra[M.id]={t:M.app,x:50,y:16,w:640,h:470,icon:icon(M.emoji)};
  var apps={};apps[M.id]=function(w,A){T.N=+N;if(!T.blocks||T.N!==+N)reset(A);app(w,A)};
  var labs=['Indice','Autre façon de le dire','Réponse'];
  window.MISSIONS[N]={
   defiId:D.id,defiKey:'laclique_salles_v1',next:'./cours.html?c=algebre',
   extra:extra,
   reset:function(A){T.N=+N;reset(A)},
   apps:apps,
   onOpen:function(id,A){if(id===M.id)A.step(0)},
   cfg:{tag:M.tag,title:M.title,
    steps:['Ouvrir '+M.the,'Lire chaque cas, un par un','Faire ton choix pour chacun','Demander au robot de vérifier'],
    help:[['Indice',M.i||D.hints[0].replace(/^Indice\s*:\s*/,'').replace(/^./,function(c){return c.toUpperCase()})],['Méthode',M.m],['Explication',M.e],['Accompagnement',M.a],['Exercice complémentaire','Essaie ceci, sous une autre forme.',M.q]],
    notion:M.notion,intro:M.intro,
    ex:function(){return'<p>Cette fois, sans aide. Ouvre '+M.the+' de <b>'+A0.esc(A0.P().pre)+' '+A0.esc(A0.P().nom)+'</b> et fais ton travail.</p>'},
    saySt:'Ouvre '+M.the+'. Je suis là si tu veux de l’aide.',
    fail:function(p){return'Presque ! Résultat : '+p+' %. Relis ce que dit le robot et recommence avec un autre personnage.'},
    win:M.win,bad:'Le robot a trouvé des erreurs. Regarde ce qu’il dit.'}
  };
});
})();
