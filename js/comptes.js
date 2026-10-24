/* La Clique — les comptes (Supabase).
   Ce fichier parle directement au service d'authentification de Supabase (aucune librairie à charger).
   La clé ci-dessous est la clé « publishable » : elle est faite pour être visible dans le site.
   ⚠️ Ne JAMAIS mettre ici la clé « secret » ou « service_role ». */
(function () {
  var SUPABASE_URL = 'https://igncqrysvfgourqxbnae.supabase.co';
  var SUPABASE_CLE = 'sb_publishable_u4GaK5AflC2d2I420D6IYg_wUECJy6d';
  var CLE_SESSION = 'laclique_session';
  var RETOUR = location.origin + location.pathname;   // où Supabase ramène la personne (lien du courriel)

  function lire() { try { return JSON.parse(localStorage.getItem(CLE_SESSION)) || null; } catch (e) { return null; } }
  function garder(s) { try { if (s) localStorage.setItem(CLE_SESSION, JSON.stringify(s)); else localStorage.removeItem(CLE_SESSION); } catch (e) {} }

  function appel(chemin, options) {
    options = options || {};
    var h = { 'apikey': SUPABASE_CLE, 'Content-Type': 'application/json' };
    if (options.jeton) h.Authorization = 'Bearer ' + options.jeton;
    return fetch(SUPABASE_URL + '/auth/v1/' + chemin, {
      method: options.methode || 'POST', headers: h,
      body: options.corps ? JSON.stringify(options.corps) : undefined
    }).then(function (r) {
      return r.text().then(function (t) {
        var d = {}; try { d = t ? JSON.parse(t) : {}; } catch (e) {}
        return { ok: r.ok, statut: r.status, d: d };
      });
    });
  }

  /* Les messages d'erreur de Supabase, en québécois */
  function erreur(rep) {
    var m = String((rep.d && (rep.d.msg || rep.d.error_description || rep.d.message || rep.d.error_code || rep.d.error)) || '').toLowerCase();
    if (rep.statut === 429 || m.indexOf('rate limit') > -1) return 'Trop d’essais d’un coup. Attends quelques minutes, puis réessaie.';
    if (m.indexOf('invalid login') > -1 || m.indexOf('invalid_credentials') > -1) return 'Courriel ou mot de passe incorrect.';
    if (m.indexOf('not confirmed') > -1) return 'Confirme d’abord ton courriel : clique sur le lien qu’on t’a envoyé.';
    if (m.indexOf('already registered') > -1 || m.indexOf('already exists') > -1) return 'Ce courriel a déjà un compte. Connecte-toi plutôt.';
    if (m.indexOf('password') > -1 && (m.indexOf('weak') > -1 || m.indexOf('at least') > -1 || m.indexOf('short') > -1)) return 'Mot de passe trop faible. Prends-en un plus long : une phrase de passe, c’est parfait.';
    if (m.indexOf('valid email') > -1 || m.indexOf('invalid email') > -1 || m.indexOf('email_address_invalid') > -1) return 'Ce courriel n’a pas l’air valide.';
    if (m.indexOf('provider is not enabled') > -1 || m.indexOf('unsupported provider') > -1) return 'Ce bouton n’est pas encore branché. Utilise ton courriel pour l’instant.';
    return 'Oups, ça n’a pas marché. Réessaie dans un instant.';
  }

  function sessionDe(d) {
    if (!d || !d.access_token) return null;
    return { access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600), user: d.user || null };
  }
  function prenomDe(u) { return (u && u.user_metadata && u.user_metadata.prenom) || (u && u.email ? u.email.split('@')[0] : ''); }

  /* Garde la session à jour (renouvelle le jeton s'il est presque expiré) */
  function session() {
    var s = lire();
    if (!s) return Promise.resolve(null);
    if (s.expires_at - 60 > Date.now() / 1000) return Promise.resolve(s);
    return appel('token?grant_type=refresh_token', { corps: { refresh_token: s.refresh_token } }).then(function (r) {
      if (!r.ok) { garder(null); return null; }
      var n = sessionDe(r.d); garder(n); return n;
    }).catch(function () { return s; });
  }

  /* Au retour d'un lien de courriel (confirmation ou mot de passe oublié), Supabase met le jeton dans l'adresse */
  var retour = null;
  (function () {
    if (!location.hash || location.hash.indexOf('access_token=') < 0 && location.hash.indexOf('error') < 0) return;
    var p = {}; location.hash.slice(1).split('&').forEach(function (kv) { var i = kv.indexOf('='); if (i > 0) p[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); });
    history.replaceState(null, '', location.pathname + location.search);
    if (p.error) { retour = { type: 'erreur', texte: p.error_code === 'otp_expired' ? 'Ce lien est expiré ou déjà utilisé. Demande-en un nouveau.' : 'Ce lien ne fonctionne pas. Réessaie.' }; return; }
    var s = { access_token: p.access_token, refresh_token: p.refresh_token, expires_at: +p.expires_at || Math.floor(Date.now() / 1000) + (+p.expires_in || 3600), user: null };
    garder(s);
    retour = { type: p.type === 'recovery' ? 'recuperation' : 'confirme' };
  })();

  window.LaCliqueComptes = {
    pret: true,
    retour: function () { return retour; },
    session: session,
    prenom: function () { var s = lire(); return s ? prenomDe(s.user) : ''; },
    courriel: function () { var s = lire(); return s && s.user ? s.user.email : ''; },
    /* va chercher l'utilisateur (après un retour de lien, on n'a que le jeton) */
    moi: function () {
      return session().then(function (s) {
        if (!s) return null;
        if (s.user) return s.user;
        return appel('user', { methode: 'GET', jeton: s.access_token }).then(function (r) {
          if (!r.ok) return null; s.user = r.d; garder(s); return r.d;
        });
      });
    },
    connexion: function (form) {
      var d = new FormData(form);
      return appel('token?grant_type=password', { corps: { email: String(d.get('courriel') || '').trim(), password: d.get('motdepasse') } }).then(function (r) {
        if (!r.ok) return { ok: false, texte: erreur(r) };
        garder(sessionDe(r.d));
        return { ok: true, fermer: true, texte: 'Content de te revoir, ' + prenomDe(r.d.user) + '!' };
      });
    },
    inscription: function (form) {
      var d = new FormData(form), mdp = String(d.get('motdepasse') || '');
      if (mdp.length < 8) return Promise.resolve({ ok: false, texte: 'Ton mot de passe doit avoir au moins 8 caractères (12 et plus, c’est encore mieux).' });
      return appel('signup?redirect_to=' + encodeURIComponent(RETOUR), { corps: {
        email: String(d.get('courriel') || '').trim(), password: mdp, data: {
          prenom: String(d.get('prenom') || '').trim(),
          /* Infolettre : seulement si la personne a coché elle-même la case (Loi canadienne anti-pourriel) ; on garde la date comme preuve */
          infolettre: d.get('infolettre') === 'oui',
          infolettre_date: d.get('infolettre') === 'oui' ? new Date().toISOString() : null
        }
      } }).then(function (r) {
        if (!r.ok) return { ok: false, texte: erreur(r) };
        var s = sessionDe(r.d);
        if (s) { garder(s); return { ok: true, fermer: true, texte: 'Bienvenue dans La Clique!' }; }
        /* Supabase répond « ok » même si le courriel existe déjà (pour ne rien révéler) : identités vides = déjà inscrit */
        if (r.d && r.d.identities && r.d.identities.length === 0) return { ok: false, texte: 'Ce courriel a déjà un compte. Connecte-toi plutôt.' };
        return { ok: true, texte: 'Presque fini! Va voir tes courriels et clique sur le lien pour confirmer ton compte.' };
      });
    },
    oubli: function (courriel) {
      courriel = String(courriel || '').trim();
      if (!courriel) return Promise.resolve({ ok: false, texte: 'Écris ton courriel dans le champ juste au-dessus, puis clique sur « Mot de passe oublié? ».' });
      return appel('recover?redirect_to=' + encodeURIComponent(RETOUR), { corps: { email: courriel } }).then(function (r) {
        if (!r.ok) return { ok: false, texte: erreur(r) };
        return { ok: true, texte: 'Si ce courriel a un compte, tu vas recevoir un lien pour choisir un nouveau mot de passe.' };
      });
    },
    nouveauMotDePasse: function (mdp) {
      if (String(mdp || '').length < 8) return Promise.resolve({ ok: false, texte: 'Au moins 8 caractères, s’il te plaît (12 et plus, c’est encore mieux).' });
      return session().then(function (s) {
        if (!s) return { ok: false, texte: 'Ton lien est expiré. Redemande « Mot de passe oublié? ».' };
        return appel('user', { methode: 'PUT', jeton: s.access_token, corps: { password: mdp } }).then(function (r) {
          if (!r.ok) return { ok: false, texte: erreur(r) };
          s.user = r.d; garder(s); return { ok: true, fermer: true, texte: 'C’est fait! Ton nouveau mot de passe est enregistré.' };
        });
      });
    },
    /* Google et Facebook : demandent d'être activés dans Supabase avant de fonctionner */
    avecFournisseur: function (fournisseur) {
      var ACTIFS = [];   // ajouter 'google' ou 'facebook' ici quand ils seront configurés dans Supabase
      if (ACTIFS.indexOf(fournisseur) < 0) return Promise.reject(new Error('pas branché'));
      location.href = SUPABASE_URL + '/auth/v1/authorize?provider=' + fournisseur + '&redirect_to=' + encodeURIComponent(RETOUR);
      return new Promise(function () {});
    },
    deconnexion: function () {
      var s = lire(); garder(null);
      if (!s) return Promise.resolve();
      return appel('logout', { jeton: s.access_token }).catch(function () {});
    }
  };
})();
