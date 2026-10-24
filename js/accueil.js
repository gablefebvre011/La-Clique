/* La Clique — accueil : lueur qui suit la souris, écran de connexion/inscription,
   indicateur de mot de passe et formulaire de contact.
   Les comptes (Supabase) se branchent dans js/comptes.js : tant qu'il n'est pas prêt,
   les formulaires affichent un message honnête au lieu de faire semblant. */
(function () {
  var $ = function (id) { return document.getElementById(id); };

  /* 1. Lueur cyan qui suit la souris (ou le doigt) dans le haut de la page */
  var hero = $('haut');
  if (hero) {
    var bouge = function (e) {
      var p = e.touches ? e.touches[0] : e, r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (p.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (p.clientY - r.top) + 'px');
    };
    hero.addEventListener('pointermove', bouge);
    hero.addEventListener('touchmove', bouge, { passive: true });
  }

  /* 2. Écran de connexion : s'ouvre en cercle à partir du bouton « Se connecter » */
  var page = $('page'), auth = $('auth'), btn = $('btnConnexion');
  var vLogin = $('viewLogin'), vSignup = $('viewSignup'), top = $('authTop');
  var tFocus = 0, tView = 0;
  /* Les écrans de la fenêtre : connexion, inscription, mon compte, nouveau mot de passe */
  var VUES = {
    login: { el: vLogin, titre: 'Connexion', label: 'authTitle', champ: 'authEmail' },
    signup: { el: vSignup, titre: 'Inscription', label: 'signupTitle', champ: 'signupName' },
    compte: { el: $('viewCompte'), titre: 'Mon compte', label: 'compteTitle', champ: null },
    nouveau: { el: $('viewNouveau'), titre: 'Nouveau mot de passe', label: 'nouveauTitle', champ: 'nouveauPw' }
  };
  function montrer(vue) {
    if (!VUES[vue]) vue = 'login';
    Object.keys(VUES).forEach(function (k) {
      var v = VUES[k], on = k === vue; if (!v.el) return;
      v.el.className = on ? 'view' : (k === 'login' ? 'view off-left' : 'view off-right');
      v.el.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) v.el.removeAttribute('inert'); else v.el.setAttribute('inert', '');
    });
    var onglets = vue === 'login' || vue === 'signup', tabs = $('authTabs');
    if (tabs) tabs.hidden = !onglets;
    top.hidden = onglets; top.textContent = onglets ? '' : VUES[vue].titre;
    [['tabLogin', 'login'], ['tabSignup', 'signup']].forEach(function (t) {
      var b = $(t[0]); if (!b) return; var on = t[1] === vue;
      b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    auth.setAttribute('aria-labelledby', VUES[vue].label);
  }
  function ouvrir(vue) {
    if (!auth) return;
    if (btn) {
      var r = btn.getBoundingClientRect();
      auth.style.setProperty('--ox', (r.left + r.width / 2) + 'px');
      auth.style.setProperty('--oy', (r.top + r.height / 2) + 'px');
    }
    clearTimeout(tView);
    montrer(vue || 'login');
    auth.removeAttribute('inert');
    auth.setAttribute('aria-hidden', 'false');
    auth.classList.add('open');
    page.classList.add('page-open');
    document.documentElement.style.overflow = 'hidden';
    clearTimeout(tFocus);
    tFocus = setTimeout(function () {
      var c = (VUES[vue] || VUES.login).champ, f = c ? $(c) : document.querySelector('#viewCompte a, #viewCompte button');
      if (f) f.focus({ preventScroll: true });
    }, 820);
  }
  function fermer() {
    if (!auth || !auth.classList.contains('open')) return;
    auth.classList.remove('open');
    page.classList.remove('page-open');
    auth.setAttribute('aria-hidden', 'true');
    auth.setAttribute('inert', '');
    document.documentElement.style.overflow = '';
    clearTimeout(tFocus);
    clearTimeout(tView); tView = setTimeout(function () { montrer('login'); }, 820);
    if (btn) btn.focus({ preventScroll: true });
  }
  if (btn) btn.addEventListener('click', function () { ouvrir(connecte() ? 'compte' : 'login'); });
  if ($('authClose')) $('authClose').addEventListener('click', fermer);
  function versOnglet(vue) {
    montrer(vue); clearTimeout(tFocus);
    tFocus = setTimeout(function () { var f = $(VUES[vue].champ); if (f) f.focus({ preventScroll: true }); }, 450);
  }
  if ($('tabLogin')) $('tabLogin').addEventListener('click', function () { versOnglet('login'); });
  if ($('tabSignup')) $('tabSignup').addEventListener('click', function () { versOnglet('signup'); });
  if ($('toSignup')) $('toSignup').addEventListener('click', function () {
    montrer('signup'); clearTimeout(tFocus);
    tFocus = setTimeout(function () { $('signupName').focus({ preventScroll: true }); }, 450);
  });
  if ($('toLogin')) $('toLogin').addEventListener('click', function () {
    montrer('login'); clearTimeout(tFocus);
    tFocus = setTimeout(function () { $('authEmail').focus({ preventScroll: true }); }, 450);
  });
  if (auth) auth.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
  /* Un lien #connexion ou #inscription ouvre directement le bon écran */
  if (location.hash === '#connexion') ouvrir('login');
  if (location.hash === '#inscription') ouvrir('signup');

  /* 3. Indicateur de mot de passe, dans l'esprit du défi 1 : la longueur compte plus que les symboles */
  function note(pw) {
    if (!pw) return 0;
    var s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    var sortes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(function (r) { return r.test(pw); }).length;
    if (sortes >= 3 || /[\s-].*[\s-]/.test(pw)) s++;
    if (pw.length >= 16) s++;
    return Math.max(1, Math.min(4, s));
  }
  var pw = $('signupPw'), etiquette = $('pwLabel');
  if (pw && etiquette) {
    var segs = vSignup.querySelectorAll('.seg'), noms = ['Ton mot de passe', 'Faible', 'Moyen', 'Solide', 'Excellent'];
    pw.addEventListener('input', function () {
      var n = note(pw.value);
      for (var i = 0; i < segs.length; i++) segs[i].className = n >= i + 1 ? 'seg s' + n : 'seg';
      etiquette.textContent = noms[n]; etiquette.className = 'pw' + n;
    });
  }

  /* 4. Connexion, inscription, Google/Facebook : passent par js/comptes.js quand il est prêt */
  var PAS_PRET = 'Les comptes s’en viennent! En attendant, ta progression est gardée sur cet appareil.';
  function message(id, texte, sorte) { var m = $(id); if (m) { m.textContent = texte; m.className = 'auth-msg' + (sorte ? ' ' + sorte : ''); } }
  function comptes() { return window.LaCliqueComptes && window.LaCliqueComptes.pret ? window.LaCliqueComptes : null; }
  function envoyer(form, idMsg, action) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = comptes();
      if (!c) { message(idMsg, PAS_PRET); return; }
      var b = form.querySelector('button[type=submit]'); if (b) b.disabled = true;
      message(idMsg, 'Un instant…');
      c[action](form).then(function (r) { message(idMsg, r.texte, r.ok ? 'ok' : 'err'); if (r.ok && r.fermer) { majCompte(); setTimeout(fermer, 1100); } })
        .catch(function () { message(idMsg, 'Oups, ça n’a pas marché. Réessaie dans un instant.', 'err'); })
        .then(function () { if (b) b.disabled = false; });
    });
  }
  if ($('loginForm')) envoyer($('loginForm'), 'loginMsg', 'connexion');
  if ($('signupForm')) envoyer($('signupForm'), 'signupMsg', 'inscription');
  Array.prototype.forEach.call(document.querySelectorAll('[data-fournisseur]'), function (b) {
    b.addEventListener('click', function () {
      var idMsg = vSignup.contains(b) ? 'signupMsg' : 'loginMsg', c = comptes();
      if (!c) { message(idMsg, PAS_PRET); return; }
      c.avecFournisseur(b.getAttribute('data-fournisseur')).catch(function () {
        message(idMsg, 'Ce bouton n’est pas encore branché. Utilise ton courriel pour l’instant.', 'err');
      });
    });
  });
  if ($('forgotPw')) $('forgotPw').addEventListener('click', function () {
    var c = comptes();
    if (!c) { message('loginMsg', PAS_PRET); return; }
    c.oubli($('authEmail').value).then(function (r) { message('loginMsg', r.texte, r.ok ? 'ok' : 'err'); });
  });

  /* 4 bis. Le compte : bouton de l'en-tête, écran « Mon compte », retour d'un lien de courriel */
  function connecte() { var c = comptes(); return !!(c && c.courriel()); }
  function majCompte() {
    var c = comptes(); if (!btn) return;
    if (c && c.courriel()) {
      btn.textContent = c.prenom() || 'Mon compte';
      btn.setAttribute('aria-label', 'Mon compte');
      if ($('comptePrenom')) $('comptePrenom').textContent = c.prenom();
      if ($('compteCourriel')) $('compteCourriel').textContent = 'Connecté avec ' + c.courriel();
    } else { btn.textContent = 'Se connecter'; btn.removeAttribute('aria-label'); }
  }
  if ($('btnDeconnexion')) $('btnDeconnexion').addEventListener('click', function () {
    var c = comptes(); if (!c) return;
    c.deconnexion().then(function () { majCompte(); fermer(); });
  });
  if ($('nouveauForm')) $('nouveauForm').addEventListener('submit', function (e) {
    e.preventDefault(); var c = comptes(); if (!c) return;
    message('nouveauMsg', 'Un instant…');
    c.nouveauMotDePasse($('nouveauPw').value).then(function (r) {
      message('nouveauMsg', r.texte, r.ok ? 'ok' : 'err');
      if (r.ok) { majCompte(); setTimeout(function () { montrer('compte'); }, 1200); }
    });
  });
  (function () {
    var c = comptes(); if (!c) return;
    var r = c.retour();
    c.moi().then(function () {
      majCompte();
      if (!r) return;
      if (r.type === 'recuperation') ouvrir('nouveau');
      else if (r.type === 'confirme') { ouvrir('compte'); message('compteMsg', 'Ton compte est confirmé. Bienvenue dans La Clique!', 'ok'); }
      else { ouvrir('login'); message('loginMsg', r.texte, 'err'); }
    });
  })();

  /* 4 ter. Les écrans « en savoir plus » (la méthode, les parcours, l'ordinateur virtuel, Clic, le contact).
     L'accueil reste un seul écran ; ces écrans s'ouvrent par-dessus et le bouton « retour » du téléphone les ferme. */
  var ecrans = $('ecrans'), corps = $('ecransCorps'), ECRANS = ['methode', 'parcours', 'ordi', 'clic', 'contact'], ecranOuvert = '', dejaPousse = false, avantEcran = null;
  function montrerEcran(id) {
    ECRANS.forEach(function (k) { var sct = $(k); if (sct) sct.classList.toggle('on', k === id); });
    Array.prototype.forEach.call(ecrans.querySelectorAll('[data-ecran]'), function (a) {
      var on = a.getAttribute('data-ecran') === id; a.classList.toggle('on', on);
      if (on) { a.setAttribute('aria-current', 'page'); try { a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} } else a.removeAttribute('aria-current');
    });
    if (corps) corps.scrollTop = 0;
  }
  function ouvrirEcran(id) {
    if (!ecrans || ECRANS.indexOf(id) < 0) return;
    if (!ecranOuvert) avantEcran = document.activeElement;
    montrerEcran(id); ecranOuvert = id;
    ecrans.removeAttribute('inert'); ecrans.setAttribute('aria-hidden', 'false'); ecrans.classList.add('open');
    if (page) page.setAttribute('inert', '');
    document.documentElement.classList.add('ecran-ouvert');
    setTimeout(function () { var r = $('ecransRetour'); if (r && !ecrans.contains(document.activeElement)) r.focus({ preventScroll: true }); }, 60);
  }
  function fermerEcran() {
    if (!ecranOuvert) return;
    ecranOuvert = ''; ecrans.classList.remove('open'); ecrans.setAttribute('aria-hidden', 'true'); ecrans.setAttribute('inert', '');
    if (page) page.removeAttribute('inert');
    document.documentElement.classList.remove('ecran-ouvert');
    if (avantEcran && avantEcran.focus) avantEcran.focus({ preventScroll: true });
  }
  function suivreAdresse() {
    var id = location.hash.slice(1);
    if (ECRANS.indexOf(id) > -1) ouvrirEcran(id); else { fermerEcran(); dejaPousse = false; }
  }
  if (ecrans) {
    /* Tous les liens vers une section ouvrent son écran (menu, « Voir les parcours », onglets) */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (ECRANS.indexOf(id) > -1) {
        e.preventDefault();
        if (ecranOuvert) { history.replaceState(null, '', '#' + id); ouvrirEcran(id); }
        else { history.pushState(null, '', '#' + id); dejaPousse = true; ouvrirEcran(id); }
      } else if (id === 'haut' && ecranOuvert) { e.preventDefault(); retourAccueil(); }
    });
    function retourAccueil() { if (dejaPousse) history.back(); else { history.replaceState(null, '', location.pathname + location.search); fermerEcran(); } }
    $('ecransRetour').addEventListener('click', retourAccueil);
    if ($('btnMenu')) $('btnMenu').addEventListener('click', function () { history.pushState(null, '', '#methode'); dejaPousse = true; ouvrirEcran('methode'); });
    ecrans.addEventListener('keydown', function (e) { if (e.key === 'Escape') retourAccueil(); });
    window.addEventListener('popstate', suivreAdresse);
    if (ECRANS.indexOf(location.hash.slice(1)) > -1) ouvrirEcran(location.hash.slice(1));
  }

  /* 5. Contact : ouvre la messagerie du visiteur avec le message prêt à envoyer */
  var cf = $('contactForm');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(cf), a = cf.getAttribute('data-email');
    var sujet = 'La Clique — message de ' + (d.get('nom') || '');
    var corps = (d.get('message') || '') + '\n\n— ' + (d.get('nom') || '') + ' (' + (d.get('courriel') || '') + ')';
    location.href = 'mailto:' + a + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
  });
})();
