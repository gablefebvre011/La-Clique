/* L'Alphabet : un défi à la fois, félicitations à la fin, bouton « Suivant ». */
(function () {
  'use strict';
  var COURSE = /[?&]c=(algebre|salles)/.test(location.search) ? 'algebre' : 'alphabet';   // ?c=salles = ancien nom, toujours accepté
  var LABEL = COURSE === 'algebre' ? 'La Cyber-Algèbre' : 'L’Alphabet';
  var LABEL_ART = COURSE === 'algebre' ? 'la Cyber-Algèbre' : 'L’Alphabet';
  var DATA = (COURSE === 'algebre' ? window.ALGEBRE : window.ALPHABET) || [];
  document.title = LABEL + ' — La Clique';
  var KEY = 'laclique_' + (COURSE === 'algebre' ? 'salles' : COURSE) + '_v1'   /* « salles » = ancien nom de la Cyber-Algèbre : garde la progression déjà faite */, mem = { done: [] };
  /* Mode créateur (pour Gabriel) : tous les défis débloqués, bouton pour sauter au suivant.
     Activer : ajouter ?createur=1 à l'adresse, puis entrer le code secret (le navigateur s'en souvient ensuite).
     Désactiver : ?createur=0 ou le bouton en haut. Ne touche pas à la vraie progression.
     Le code n'est pas écrit ici : seulement son empreinte brouillée (SHA-256). */
  var CREA_H = '431a593d04f610c4e3ae7f5df2cff73daa33fb98d5b3046fc2e150a5498be795';
  var CREATEUR = false;
  try { CREATEUR = localStorage.getItem('laclique_createur') === CREA_H; } catch (e) {}
  function sansParam() { return location.pathname + location.search.replace(/([?&])createur=[01]&?/, '$1').replace(/[?&]$/, '') + location.hash; }
  (function () {
    var m = /[?&]createur=([01])/.exec(location.search);
    if (!m) return;
    if (m[1] === '0') { try { localStorage.setItem('laclique_createur', '0'); } catch (e) {} location.replace(sansParam()); return; }
    if (CREATEUR) { location.replace(sansParam()); return; }
    if (!window.crypto || !crypto.subtle) return;
    var essai = 0;
    (function demander(txt) {
      var code = window.prompt(txt);
      if (code === null) { location.replace(sansParam()); return; }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode('declic-createur:' + code.trim())).then(function (buf) {
        var h = [].map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
        if (h === CREA_H) { try { localStorage.setItem('laclique_createur', h); } catch (e) {} location.replace(sansParam()); }
        else if (++essai < 3) demander('Code incorrect. Réessaie :');
        else location.replace(sansParam());
      });
    })('Mode créateur — entre ton code secret :');
  })();
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mémoire (jamais bloquante) ---------- */
  function load() { try { var v = localStorage.getItem(KEY); if (v) return JSON.parse(v); } catch (e) {} return mem; }
  function save(s) { mem = s; try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); }
  function isDone(id) { return (load().done || []).indexOf(id) > -1; }
  function setDone(id) { var s = load(); s.done = s.done || []; if (s.done.indexOf(id) < 0) { s.done.push(id); save(s);
      if (window.ClicBureau && ClicBureau.react) setTimeout(function () { ClicBureau.react(s.done.length % 3 === 0 ? 'progres' : 'defi', { force: true }); }, 1800); } else save(s); }

  /* ---------- Les étapes à plat ---------- */
  var steps = [];
  DATA.forEach(function (m, mi) {
    m.defis.forEach(function (d, di) {
      steps.push({ m: m, mi: mi, d: d, first: di === 0, id: slug(d.title), name: d.title.replace(/^[^—]+—\s*/, '') });
    });
  });
  var N = steps.length, idx = 0;

  var $ = function (id) { return document.getElementById(id); };
  var stepEl = $('cStep'), sayText = $('cSayText'), sayBox = $('cSay');

  var hintBtn = $('cHint'), hintList = [], hintN = 0, hintBase = '';
  function say(t) { sayText.textContent = t; }

  /* Les coups de pouce passent par le bureau de Clic (languette sur le bord de l'écran), un cran à la fois */
  function syncClic() {
    if (!window.ClicBureau) return;
    if (hintList.length) ClicBureau.update({ note: 'Je ne te donne pas la réponse : je t’aide à la trouver. Ouvre un cran seulement si tu bloques.',
      levels: hintList.map(function (h, i) { return ['Coup de pouce ' + (i + 1), String(h).replace(/^(Indice|Autre façon de le dire)\s*:\s*/i, '')]; }),
      shown: hintN, onMore: function () { if (hintN < hintList.length) { hintN++; syncClic(); } } });
    else ClicBureau.update({ note: 'Pas de coup de pouce pour cette étape : lis tranquillement, puis passe à la mission. Je serai là pendant la pratique.' });
  }
  function setHints(list, base) { hintList = list || []; hintN = 0; hintBase = base; hintBtn.hidden = !hintList.length; hintBtn.textContent = 'Besoin d’un coup de pouce ? Va voir Clic'; syncClic(); }
  /* La face de Clic (en haut) ouvre son bureau : on met d'abord les coups de pouce à jour */
  if (window.ClicBureau) ClicBureau.onOpen = syncClic;
  hintBtn.addEventListener('click', function () {
    if (hintN === 0 && hintList.length) hintN = 1;
    syncClic(); if (window.ClicBureau) ClicBureau.open();
  });
  function doneCount() { var n = 0; steps.forEach(function (s) { if (isDone(s.id)) n++; }); return n; }
  function firstUndone() { for (var k = 0; k < N; k++) if (!isDone(steps[k].id)) return k; return -1; }
  function progress() {
    var n = doneCount();
    $('cProg').style.width = (N ? Math.round(n / N * 100) : 0) + '%';
    $('cCnt').textContent = n + '/' + N;
  }

  /* ---------- Flash + confettis ---------- */
  function burst() {
    if (reduce) return;
    var f = document.createElement('div'); f.className = 'c-flash'; document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 900);
    var cols = ['#00ffff', '#b48cff', '#39ff14', '#ffd95a', '#ff5aa8', '#ffffff'];
    for (var k = 0; k < 44; k++) (function (k) {
      var p = document.createElement('i'); p.className = 'c-conf';
      var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 270;
      p.style.background = cols[k % cols.length];
      p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px');
      p.style.setProperty('--dy', (Math.sin(a) * d * .8 + 90).toFixed(0) + 'px');
      p.style.setProperty('--r', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      p.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
      document.body.appendChild(p); setTimeout(function () { p.remove(); }, 1600);
    })(k);
  }

  /* ---------- Scores (gardés dans le navigateur) ---------- */
  function getSc(id) { return (load().sc || {})[id] || null; }
  function record(id, pct, ok) {
    var s = load(); s.sc = s.sc || {};
    var r = s.sc[id] || { tries: 0, first: null, best: 0 };
    r.tries++; if (r.first === null) r.first = pct; if (pct > r.best) r.best = pct; if (ok) r.ok = true;
    s.sc[id] = r; save(s); return r;
  }
  var PASS = 60;
  function shuffle(a) { for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } return a; }

  /* ---------- Exercices : pas de correction, 60 % pour avancer ---------- */
  /* Une liste <ul class="opts" data-show="6"> peut contenir plus d'éléments que ce qui est affiché (banque) :
     à chaque essai, on en tire data-show au hasard, dans un ordre mélangé. */
  function setupExercises(root, id, onPass) {
    var uls = [].slice.call(root.querySelectorAll('ul.opts')), res = [], resets = [], rets = [], failBox = null;
    if (!uls.length) { onPass(null, 0); return; }
    var clean = function (t) { return t.trim().replace(/^\[|\]$/g, ''); };
    function check() {
      if (!uls.every(function (u, k) { return res[k]; })) return;
      var r = 0, t = 0; res.forEach(function (x) { r += x.r; t += x.t; });
      var pct = Math.round(100 * r / t), ok = pct >= PASS;
      var rc = isDone(id) ? (getSc(id) || { tries: 1 }) : record(id, pct, ok);
      if (ok) { rets.forEach(function (x) { x.classList.remove('c-hide'); }); onPass(pct, rc.tries); }
      else showFail(pct);
    }
    function showFail(pct) {
      if (failBox) failBox.remove();
      failBox = document.createElement('div'); failBox.className = 'c-fail';
      failBox.innerHTML = '<div class="c-fail-t"></div><div class="c-fail-s">Il faut ' + PASS + ' % pour avancer. Relis la leçon plus haut, puis réessaie : les éléments changent.</div>';
      failBox.firstChild.textContent = 'Presque ! Ton score : ' + pct + ' %';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'c-next'; b.textContent = 'Relire et réessayer';
      b.addEventListener('click', function () { failBox.remove(); failBox = null; res = []; resets.forEach(function (f) { f(); }); say('Nouvel essai ! Les éléments ont changé. 💪'); window.scrollTo(0, 0); });
      failBox.appendChild(b);
      stepEl.querySelector('.c-body').appendChild(failBox);
      say('Pas de stress : relis l’analogie et le schéma, puis réessaie. 🧠');
      try { failBox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); } catch (e) {}
    }
    uls.forEach(function (ul, ui) {
      var all = [].slice.call(ul.children).filter(function (x) { return x.tagName === 'LI'; });
      var ret = ul.nextElementSibling; ret = (ret && ret.classList.contains('retenir')) ? ret : null; if (ret) rets.push(ret);
      var bk = !!all[0].querySelector('.bucket'), ord = ul.classList.contains('ordre'), keep = !!ul.dataset.keep, nextN = 1, labels = [], need = 0, found = 0, wrong = 0, answered = 0, right = 0, total = all.length, ended = false;
      var n = Math.min(+ul.dataset.show || all.length, all.length);
      all.forEach(function (li) {
        if (bk) { var t = li.querySelector('.bucket').textContent.trim(); li.dataset.k = t; if (labels.indexOf(t) < 0) labels.push(t); }
        else if (ord) { li.dataset.k = 'ord'; }
        else { li.dataset.k = li.classList.contains('ok') ? 'ok' : 'no'; li.classList.remove('ok', 'no'); }
        li.classList.add('c-q');
      });
      ul.classList.add('c-ex'); labels.sort();
      var box = document.createElement('div'), info = document.createElement('div');
      box.className = 'c-box'; info.className = 'c-info'; box.appendChild(info);
      ul.parentNode.insertBefore(box, ul.nextSibling);

      function valid(sel) {
        if (ord) return true;
        return bk ? labels.every(function (l) { return sel.some(function (li) { return li.dataset.k === l; }); })
                  : sel.some(function (li) { return li.dataset.k === 'ok'; }) && sel.some(function (li) { return li.dataset.k === 'no'; });
      }
      function pick() { var sel, k = 0; do { sel = shuffle(all.slice()).slice(0, n); k++; } while (k < 40 && !valid(sel)); if (keep) sel.sort(function (a, b) { return all.indexOf(a) - all.indexOf(b); }); return sel; }
      function end() {
        if (ended) return; ended = true;
        res[ui] = bk ? { r: right, t: total } : { r: need, t: need + wrong };
        check();
      }
      function update() {
        if (bk) {
          info.textContent = answered ? (right + ' / ' + total + (answered === total ? ' — terminé' : '')) : 'Classe chaque élément : choisis une étiquette.';
          if (answered === total) end();
        } else {
          info.textContent = ord ? (found + ' / ' + need + ' étape' + (need > 1 ? 's' : '') + ' dans l’ordre' + (wrong ? ' · ' + wrong + ' erreur' + (wrong > 1 ? 's' : '') : '') + (found === need ? ' — terminé' : '')) :
            found + ' / ' + need + ' bonne' + (need > 1 ? 's' : '') + ' réponse' + (need > 1 ? 's' : '') + (wrong ? ' · ' + wrong + ' à côté' : '') + (found === need ? ' — terminé' : '');
          if (found === need) end();
        }
      }
      function reveal(li, good) { li.classList.add('c-rev'); li.classList.remove('c-a'); if (good === true) li.classList.add('c-good'); else if (good === false) li.classList.add('c-bad'); }
      function reset() {
        var sel = pick(); total = sel.length; found = wrong = answered = right = 0; ended = false; res[ui] = null; if (ret) ret.classList.add('c-hide');
        need = 0; nextN = 1; sel.forEach(function (li) { if ((li.dataset.k === 'ok' && !bk) || ord) need++; });
        all.forEach(function (li) { if (li.parentNode) li.parentNode.removeChild(li); li.classList.remove('c-rev', 'c-good', 'c-bad'); var old = li.querySelector('.c-choices'); if (old) old.remove(); var nm = li.querySelector('.c-num'); if (nm) nm.remove(); });
        sel.forEach(function (li) {
          ul.appendChild(li); li.classList.add('c-a');
          if (bk) {
            var row = document.createElement('div'); row.className = 'c-choices';
            labels.forEach(function (l) {
              var b = document.createElement('button'); b.type = 'button'; b.className = 'c-cb'; b.textContent = clean(l);
              b.addEventListener('click', function (e) { e.stopPropagation(); if (li.classList.contains('c-rev')) return; var g = (l === li.dataset.k); answered++; if (g) right++; reveal(li, g); update(); });
              row.appendChild(b);
            });
            li.appendChild(row); li.classList.remove('c-a'); li.style.cursor = 'default';
          } else { li.tabIndex = 0; li.setAttribute('role', 'button'); }
        });
        update();
      }
      if (!bk) all.forEach(function (li) {
        var act = function () {
          if (li.classList.contains('c-rev') || ended) return;
          if (ord) {
            if (+li.dataset.n === nextN) { var nm = document.createElement('span'); nm.className = 'c-num'; nm.textContent = nextN; li.insertBefore(nm, li.firstChild); nextN++; found++; reveal(li, true); }
            else { wrong++; li.classList.add('c-shake'); setTimeout(function () { li.classList.remove('c-shake'); }, 500); }
            update(); return;
          }
          var g = li.dataset.k === 'ok'; if (g) found++; else wrong++; reveal(li, g); update();
        };
        li.addEventListener('click', act);
        li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
      });
      resets.push(reset); reset();
    });
  }

  /* ---------- Carte de félicitations ---------- */
  var praise = ['Bravo, défi réussi !', 'Excellent travail !', 'Tu viens de franchir une étape !', 'Bien joué !', 'Propre. Un de plus dans la poche !'];
  function showWin(i, celebrate, kind, pct, tries) {
    var old = stepEl.querySelector('.c-win'); if (old) old.remove();
    var last = i === N - 1, newMod = !last && steps[i + 1].mi !== steps[i].mi;
    var w = document.createElement('div'); w.className = 'c-win';
    var img = document.createElement('img'); img.className = 'c-win-img'; img.src = './assets/cerebro.webp'; img.alt = ''; img.width = 617; img.height = 640;
    var t = document.createElement('div'); t.className = 'c-win-t';
    var s = document.createElement('div'); s.className = 'c-win-s';
    if (kind === 'seen') { t.textContent = 'Défi vu 👀'; s.textContent = 'Relis bien les explications : tu peux aussi refaire l’exercice, ou continuer.'; }
    else { t.textContent = '🎉 ' + praise[Math.floor(Math.random() * praise.length)];
      s.textContent = last ? 'Tu as terminé ' + (COURSE === 'algebre' ? 'toute la Cyber-Algèbre' : 'tout L’Alphabet') + '. Quel chemin parcouru !' : newMod ? 'Module terminé ! Le prochain t’attend.' : 'Défi ' + (i + 1) + ' sur ' + N + ' dans la poche.';
      if (pct != null) s.textContent += ' Score : ' + pct + ' %' + (tries > 1 ? ' · ' + tries + ' essais' : ' · du premier coup') + '.'; }
    var row = document.createElement('div'); row.className = 'c-win-row';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'c-next';
    b.textContent = last ? 'Terminer ' + LABEL_ART + ' →' : newMod ? 'Module suivant →' : 'Défi suivant →';
    b.addEventListener('click', function () { if (last) showEnd(); else show(i + 1); });
    row.appendChild(b);
    w.appendChild(img); w.appendChild(t); w.appendChild(s); w.appendChild(row);
    stepEl.querySelector('.c-body').appendChild(w);
    if (celebrate) { burst(); say(kind === 'seen' ? 'Pas de stress, on avance à ton rythme. 😎' : 'Chapeau ! Clique sur « Suivant » quand tu es prêt. 💪'); setTimeout(function () { try { w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); } catch (e) {} }, 250); }
  }

  /* ---------- Affichage d'un défi ---------- */
  var BASE_MSG = 'Un défi à la fois. Continue, tu es bien parti ! ✌️';
  function show(i) {
    idx = i; var s = steps[i];
    stepEl.innerHTML = '';
    var h = '';
    h += '<div class="c-eyebrow">Défi ' + (i + 1) + ' sur ' + N + '</div>';
    if (s.first) {
      h += '<p class="c-mod"><b>' + s.m.title + '</b></p>';
      if (s.m.intro) h += '<div class="c-modintro">' + s.m.intro + '</div>';
    }
    h += '<h1 class="c-title"></h1>' + (s.d.badge ? '<span class="c-badge"></span>' : '');
    stepEl.innerHTML = h + '<div class="c-body"></div><div class="c-foot"></div>';
    stepEl.querySelector('.c-title').textContent = s.name;
    if (s.d.badge) stepEl.querySelector('.c-badge').textContent = s.d.badge;
    var body = stepEl.querySelector('.c-body'), foot = stepEl.querySelector('.c-foot');
    body.innerHTML = (s.first && s.m.loose ? s.m.loose : '') + (s.d.lab ? '' : s.d.html);
    if (i > 0) {
      var p = document.createElement('button'); p.type = 'button'; p.className = 'c-prev'; p.textContent = '‹ Défi précédent';
      p.addEventListener('click', function () { show(i - 1); });
      foot.appendChild(p);
    }
    if (CREATEUR) {
      var sk = document.createElement('button'); sk.type = 'button'; sk.className = 'c-prev';
      sk.textContent = i < N - 1 ? '🛠️ Sauter au défi suivant ›' : '🛠️ Voir la fin et l’attestation ›';
      sk.addEventListener('click', function () { if (i < N - 1) show(i + 1); else showEnd(); });
      foot.appendChild(sk);
    }
    var already = isDone(s.id);
    var msg = already ? 'Déjà fait ! Tu peux le relire ou passer au suivant. 😉' : (s.d.lab ? 'Un labo ! Tout est simulé : tu ne peux rien casser. Suis la mission. 🧪' : BASE_MSG);
    say(msg); setHints(s.d.hints, msg);

    if (s.d.mission) {
      var mc = document.createElement('div'); mc.className = 'c-mission';
      mc.innerHTML = '<h4>Mission sur l’ordinateur virtuel</h4><p>Tu pratiques sur un ordinateur fictif : un exemple guidé, puis un exercice sans aide. Quand tu réussis, le défi est validé.</p>';
      var ml = document.createElement('a'); ml.className = 'c-next'; ml.style.cssText = 'text-decoration:none;display:inline-block'; ml.href = './' + s.d.mission;
      ml.textContent = already ? 'Refaire la mission' : 'Commencer la mission →';
      mc.appendChild(ml); body.appendChild(mc);
      if (already) { var scm = getSc(s.id); showWin(i, false, 'ok', scm ? scm.best : null, scm ? scm.tries : 0); }
    } else if (s.d.lab) {
      var lab = document.createElement('div'); lab.className = 'c-lab';
      var fr = document.createElement('iframe'); fr.src = s.d.lab; fr.title = s.name; fr.setAttribute('loading', 'lazy');
      lab.appendChild(fr); body.appendChild(lab);
      var note = document.createElement('p'); note.className = 'c-labnote'; note.textContent = 'Le défi se termine tout seul quand tu as trouvé la page cachée.';
      body.appendChild(note);
      if (already) showWin(i, false, 'ok');
    } else {
      setupExercises(body, s.id,
        function (pct, tries) { if (!isDone(s.id)) { setDone(s.id); progress(); renderMenu(); } showWin(i, true, 'ok', pct, tries); });
      if (already) {
        [].forEach.call(body.querySelectorAll('.retenir'), function (r) { r.classList.remove('c-hide'); });
        var sc0 = getSc(s.id); showWin(i, false, 'ok', sc0 ? sc0.best : null, sc0 ? sc0.tries : 0);
      }
    }
    progress(); renderMenu(); window.scrollTo(0, 0);
    try { history.replaceState(null, '', location.pathname + location.search + '#defi-' + (i + 1)); } catch (e) {}
  }

  /* Fin du labo : l'iframe prévient la page */
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.laclique !== 'lab-done' || idx >= N) return;
    var s = steps[idx]; if (!s.d.lab) return;
    if (!isDone(s.id)) { setDone(s.id); progress(); renderMenu(); }
    showWin(idx, true, 'ok');
  });

  function showEnd() {
    idx = N; stepEl.innerHTML = ''; setHints([], '');
    var alpha = COURSE === 'alphabet';
    var w = document.createElement('div'); w.className = 'c-win';
    w.innerHTML = '<img class="c-win-img" src="./assets/cerebro.webp" alt="" width="617" height="640"><div class="c-win-t">🏆 ' + LABEL + ', c’est fait !</div>' +
      '<div class="c-win-s">' + (alpha ? 'Tu connais maintenant les bases de la cybersécurité. La Cyber-Algèbre t’attend : tu y apprends à combiner les lettres, en pensant comme celui qui entre, celui qui protège, celui qui cherche.' : 'Tu sais penser comme celui qui entre, celui qui protège et celui qui cherche. Les parcours arrivent bientôt.') + '</div>' +
      '<div class="c-win-row"><a class="c-next" style="text-decoration:none;display:inline-block" href="./attestation.html' + (alpha ? '' : '?c=algebre') + '">🎓 Mon attestation</a>' + (alpha ? '<a class="c-tb" style="text-decoration:none;display:inline-block;padding:15px 24px" href="./cours.html?c=algebre">Aller à la Cyber-Algèbre →</a>' : '') +
      '<a class="c-tb" style="text-decoration:none;display:inline-block;padding:15px 24px" href="./index.html">Retour au site</a></div>';
    /* Même calcul que l'attestation : la note de réussite de chaque défi, puis la moyenne au dixième près */
    var sc = load().sc || {}, sum = 0, cnt = 0; steps.forEach(function (x) { var r = sc[x.id]; if (r && r.ok) { sum += r.best; cnt++; } });
    if (cnt) w.querySelector('.c-win-s').textContent += ' Ta note finale : ' + (Math.round(sum / cnt * 10) / 10).toLocaleString('fr-CA', { maximumFractionDigits: 1 }) + ' %' + (cnt < N ? ' (sur ' + cnt + ' défis notés)' : '') + '. Tu la retrouves dans la version détaillée de ton attestation.';
    stepEl.appendChild(w); burst(); say('Je suis fier de toi ! 🧠💪'); progress(); renderMenu(); window.scrollTo(0, 0);
  }

  /* ---------- Menu ---------- */
  var menu = $('cMenu'), mbtn = $('cMenuBtn');
  function renderMenu() {
    var fu = firstUndone(), limit = fu < 0 ? N - 1 : fu, h = '<div class="c-sw"><a href="./cours.html"' + (COURSE === 'alphabet' ? ' class="cur"' : '') + '>L’Alphabet</a><a href="./cours.html?c=algebre"' + (COURSE === 'algebre' ? ' class="cur"' : '') + '>Cyber-Algèbre</a></div>';
    DATA.forEach(function (m) {
      h += '<h5>' + m.title + '</h5>';
      steps.forEach(function (s, k) {
        if (s.m !== m) return;
        var d = isDone(s.id), locked = !CREATEUR && k > limit;
        h += '<button type="button" data-k="' + k + '"' + (locked ? ' disabled' : '') + (k === idx ? ' class="cur"' : '') + '><span class="n">' + (k + 1) + '</span><span></span><span class="st">' + (d ? '✓' : locked ? '🔒' : '') + '</span></button>';
      });
    });
    menu.innerHTML = h;
    [].forEach.call(menu.querySelectorAll('button'), function (b) { b.children[1].textContent = steps[+b.dataset.k].name; });
  }
  mbtn.addEventListener('click', function () { var o = menu.classList.toggle('open'); mbtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  menu.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; menu.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); show(+b.dataset.k); });
  document.addEventListener('click', function (e) { if (!menu.contains(e.target) && !mbtn.contains(e.target)) { menu.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); } });

  /* ---------- Badge du mode créateur ---------- */
  if (CREATEUR) {
    var cb = document.createElement('button'); cb.type = 'button';
    cb.textContent = '🛠️ Mode créateur — désactiver';
    cb.title = 'Tous les défis sont débloqués. Clique pour revenir au mode normal.';
    cb.style.cssText = 'font:inherit;font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid #ffd95a;background:rgba(255,217,90,.12);color:#ffd95a;cursor:pointer;white-space:nowrap';
    cb.addEventListener('click', function () {
      try { localStorage.setItem('laclique_createur', '0'); } catch (e) {}
      location.href = sansParam();
    });
    mbtn.parentNode.insertBefore(cb, mbtn);
  }

  /* ---------- Départ ---------- */
  if (!N) { stepEl.textContent = 'Aucun cours pour l’instant.'; return; }
  var fu = firstUndone();
  show(fu < 0 ? N - 1 : fu);
})();
