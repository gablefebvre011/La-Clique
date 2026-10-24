/* Le bureau de Clic : une languette « Toc toc » sur le bord de l'écran.
   - Clic sur la languette : le tiroir s'ouvre de ce côté-là.
   - On peut glisser la languette n'importe où sur le contour (gauche, droite, haut, bas).
     L'endroit choisi est gardé en mémoire pour la prochaine visite.
   - Avec <body data-clic="sans-languette"> (les cours et l'ordinateur virtuel) : pas de languette.
     Un seul Clic par page, celui du haut (.c-say) : cliquer sur sa face ouvre le tiroir,
     et ses petits mots s'affichent dans sa bulle, puis le message de la page revient.
   - Les pages remplissent le tiroir avec ClicBureau.update({...}).
   Clic ne donne jamais la réponse : il monte d'un cran à la fois. */
(function () {
  'use strict';
  var KEY = 'laclique_clic_bureau_v1';
  var HEADER = 64;                       // hauteur réservée à l'en-tête du site
  var pos = { edge: 'right', at: 0.5 };  // at = position le long du bord (0 à 1)
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && /^(left|right|top|bottom)$/.test(saved.edge)) pos = saved; } catch (e) {}
  if (!pos.chosen && window.matchMedia && window.matchMedia('(max-width: 640px)').matches) pos = { edge: 'bottom', at: 0.85 };
  function savePos() { try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch (e) {} }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Construction ---------- */
  var SANS = document.body.getAttribute('data-clic') === 'sans-languette';
  var tab = document.createElement('button');
  tab.type = 'button'; tab.className = 'cb-tab'; tab.setAttribute('aria-label', 'Ouvrir le bureau de Clic (tu peux glisser cette languette ailleurs sur le bord de l’écran)');
  tab.setAttribute('aria-expanded', 'false');
  tab.innerHTML = '<img src="./assets/cerebro.webp" alt="" width="617" height="640" draggable="false"><span>Toc toc</span><i class="cb-dot" hidden></i>';

  var box = document.createElement('aside');
  if (SANS) tab.classList.add('cb-cache');
  box.className = 'cb-box'; box.setAttribute('aria-label', 'Le bureau de Clic'); box.setAttribute('aria-hidden', 'true');
  box.innerHTML =
    '<div class="cb-head"><img src="./assets/cerebro.webp" alt="" width="617" height="640"><div><b>Le bureau de Clic</b><small>Je ne te donne jamais la réponse. Je t’aide à la trouver.</small></div>' +
    '<button type="button" class="cb-x" aria-label="Fermer le bureau de Clic">×</button></div>' +
    '<div class="cb-body" id="cbBody"></div>' +
    '<div class="cb-foot"><button type="button" class="cb-b pri" id="cbMore">Un cran de plus</button><button type="button" class="cb-b" id="cbPause">Une petite pause</button></div>' +
    '<div class="cb-move"><span>Placer la languette :</span>' +
    '<button type="button" data-e="left" aria-label="À gauche">←</button><button type="button" data-e="top" aria-label="En haut">↑</button>' +
    '<button type="button" data-e="bottom" aria-label="En bas">↓</button><button type="button" data-e="right" aria-label="À droite">→</button></div>' +
    '<div class="cb-pause" hidden><img src="./assets/cerebro.webp" alt="" width="617" height="640"><p><b>Petite pause.</b></p><p>Lève les yeux de l’écran, respire lentement trois fois, bois une gorgée d’eau. Je garde ta place.</p><button type="button" class="cb-b pri" id="cbBack">Je reviens</button></div>';

  document.body.appendChild(box);
  document.body.appendChild(tab);
  var body = box.querySelector('#cbBody'), more = box.querySelector('#cbMore'), pauseEl = box.querySelector('.cb-pause');

  /* ---------- Placement ---------- */
  function place() {
    tab.setAttribute('data-edge', pos.edge); box.setAttribute('data-edge', pos.edge);
    var at = Math.min(0.92, Math.max(0.08, pos.at || 0.5));
    tab.style.left = tab.style.top = tab.style.right = tab.style.bottom = '';
    if (pos.edge === 'left' || pos.edge === 'right') {
      var h = window.innerHeight - HEADER;
      tab.style.top = Math.round(HEADER + at * h - tab.offsetHeight / 2) + 'px';
      tab.style[pos.edge] = '0px';
    } else {
      tab.style.left = Math.round(at * window.innerWidth - tab.offsetWidth / 2) + 'px';
      if (pos.edge === 'top') tab.style.top = HEADER + 'px'; else tab.style.bottom = '0px';
    }
  }
  window.addEventListener('resize', place);

  /* ---------- Ouvrir / fermer ---------- */
  var isOpen = false;
  function open() { if (typeof hideSay === 'function') hideSay(); isOpen = true; box.classList.add('on'); box.setAttribute('aria-hidden', 'false'); tab.setAttribute('aria-expanded', 'true'); tab.classList.add('hide'); tab.querySelector('.cb-dot').hidden = true; setTimeout(function () { var f = box.querySelector('.cb-x'); if (f) f.focus(); }, 50); }
  function close() { isOpen = false; box.classList.remove('on'); box.setAttribute('aria-hidden', 'true'); tab.setAttribute('aria-expanded', 'false'); tab.classList.remove('hide'); pauseEl.hidden = true; place(); }
  box.querySelector('.cb-x').onclick = function () { close(); tab.focus(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { close(); tab.focus(); } });

  /* ---------- Glisser la languette sur le contour ---------- */
  var drag = null;
  tab.addEventListener('pointerdown', function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, moved: false };
    try { tab.setPointerCapture(e.pointerId); } catch (er) {}
  });
  tab.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 8) return;
    drag.moved = true; tab.classList.add('drag');
    tab.style.right = tab.style.bottom = '';
    tab.style.left = Math.round(e.clientX - tab.offsetWidth / 2) + 'px';
    tab.style.top = Math.round(e.clientY - tab.offsetHeight / 2) + 'px';
  });
  function endDrag(e) {
    if (!drag) return;
    var d = drag; drag = null; tab.classList.remove('drag');
    if (!d.moved) { if (isOpen) close(); else open(); return; }
    var W = window.innerWidth, H = window.innerHeight, x = e.clientX, y = Math.max(HEADER, e.clientY);
    var dist = { left: x, right: W - x, top: y - HEADER, bottom: H - y };
    var edge = Object.keys(dist).sort(function (a, b) { return dist[a] - dist[b]; })[0];
    pos = { edge: edge, at: (edge === 'left' || edge === 'right') ? (y - HEADER) / Math.max(1, H - HEADER) : x / Math.max(1, W), chosen: true };
    savePos(); place();
  }
  tab.addEventListener('pointerup', endDrag);
  tab.addEventListener('pointercancel', function () { drag = null; tab.classList.remove('drag'); place(); });
  tab.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (isOpen) close(); else open(); } });
  tab.addEventListener('click', function (e) { if (e.detail === 0) return; e.preventDefault(); });  // le pointeur gère déjà le clic

  box.querySelectorAll('.cb-move [data-e]').forEach(function (b) {
    b.onclick = function () { pos = { edge: b.getAttribute('data-e'), at: pos.at || 0.5, chosen: true }; savePos(); place(); box.setAttribute('data-edge', pos.edge); };
  });

  /* ---------- Pause ---------- */
  box.querySelector('#cbPause').onclick = function () { pauseEl.hidden = false; box.querySelector('#cbBack').focus(); };
  box.querySelector('#cbBack').onclick = function () { pauseEl.hidden = true; };

  /* ---------- Contenu ----------
     opts.note    : texte d'introduction (HTML permis)
     opts.levels  : [[nom, texte, quiz?], ...]  quiz = {q, o:[...], ok, why}
     opts.shown   : nombre de crans déjà ouverts
     opts.onMore  : fonction appelée par « Un cran de plus » (absente = bouton caché) */
  var cur = {};
  function quizHTML(Q, k) {
    var order = Q.o.map(function (_, i) { return i; }).map(function (_, j, a) { return a[(j + Q.q.length) % a.length]; });
    return '<div class="cb-quiz" data-k="' + k + '"><p><b>' + esc(Q.q) + '</b></p>' +
      order.map(function (i) { return '<button type="button" class="cb-b" data-o="' + i + '">' + esc(Q.o[i]) + '</button>'; }).join('') +
      '<p class="cb-fb" aria-live="polite"></p></div>';
  }
  function render() {
    var L = cur.levels || [], n = Math.min(cur.shown || 0, L.length), h = '';
    if (cur.note) h += '<p class="cb-note">' + cur.note + '</p>';
    if (L.length) {
      h += '<ol class="cb-steps">';
      L.forEach(function (lv, i) {
        if (i < n) h += '<li class="ok"><span class="cb-n">' + (i + 1) + '</span><div><b>' + esc(lv[0]) + '</b><p>' + esc(lv[1]) + '</p>' + (lv[2] ? quizHTML(lv[2], i) : '') + '</div></li>';
        else h += '<li class="' + (i === n ? 'next' : 'off') + '"><span class="cb-n">' + (i + 1) + '</span><div><b>' + esc(lv[0]) + '</b>' + (i === n ? '<p>Clique sur « Un cran de plus » quand tu en as besoin.</p>' : '') + '</div></li>';
      });
      h += '</ol>';
    }
    body.innerHTML = h;
    more.hidden = !(cur.onMore && n < L.length);
    more.textContent = n === 0 ? 'Mon premier coup de pouce' : 'Un cran de plus';
    body.querySelectorAll('.cb-quiz').forEach(function (qz) {
      var Q = L[+qz.getAttribute('data-k')][2], fb = qz.querySelector('.cb-fb');
      qz.querySelectorAll('[data-o]').forEach(function (b) {
        b.onclick = function () {
          if (+b.getAttribute('data-o') === Q.ok) { fb.innerHTML = '<b class="cb-yes">Oui.</b> ' + esc(Q.why); qz.querySelectorAll('[data-o]').forEach(function (x) { x.disabled = true; }); }
          else fb.textContent = 'Pas tout à fait. Relis le cran d’avant et essaie encore.';
        };
      });
    });
  }
  more.onclick = function () { if (cur.onMore) cur.onMore(); };

  /* ---------- Clic vivant : expressions + petits mots, de temps en temps ----------
     Les phrases et les expressions sont dans js/clic-phrases.js (facile à modifier). */
  var IMG_DIR = './assets/clic/', BASE_IMG = './assets/cerebro.webp';
  /* Clic au complet, pour chaque expression (« paix » = l'image de base) */
  var CORPS = './assets/clic/corps/';
  function corpsDe(nom) { return !nom || nom === 'paix' ? BASE_IMG : CORPS + nom + '.webp'; }
  var say = document.createElement('div');
  say.className = 'cb-say'; say.setAttribute('role', 'status'); say.setAttribute('aria-live', 'polite'); say.hidden = true;
  say.innerHTML = '<img alt="" width="320" height="320"><p></p><button type="button" class="cb-say-x" aria-label="Fermer le message de Clic">×</button>';
  document.body.appendChild(say);
  var sayImg = say.querySelector('img'), sayTxt = say.querySelector('p'), tabImg = tab.querySelector('img'), headImg = box.querySelector('.cb-head img');
  var sayTimer = 0, faceTimer = 0, lastSay = 0, lastIdx = {};
  function pick(a, key) { if (!Array.isArray(a)) return a; var i; do { i = Math.floor(Math.random() * a.length); } while (a.length > 1 && i === lastIdx[key]); lastIdx[key] = i; return a[i]; }
  function face(name) {
    var src = corpsDe(name);
    tabImg.src = src; headImg.src = src;
  }
  function placeSay() {
    var r = tab.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight, sw = Math.min(300, W - 24), sh = say.offsetHeight || 90;
    var x, y;
    if (pos.edge === 'right') { x = r.left - sw - 10; y = r.top + r.height / 2 - sh / 2; }
    else if (pos.edge === 'left') { x = r.right + 10; y = r.top + r.height / 2 - sh / 2; }
    else if (pos.edge === 'top') { x = r.left + r.width / 2 - sw / 2; y = r.bottom + 10; }
    else { x = r.left + r.width / 2 - sw / 2; y = r.top - sh - 10; }
    say.style.width = sw + 'px';
    say.style.left = Math.round(Math.max(12, Math.min(W - sw - 12, x))) + 'px';
    say.style.top = Math.round(Math.max(HEADER, Math.min(H - sh - 12, y))) + 'px';
  }
  function hideSay() { say.hidden = true; say.classList.remove('pop'); }
  say.querySelector('.cb-say-x').onclick = function (e) { e.stopPropagation(); hideSay(); };
  say.addEventListener('click', function () { hideSay(); open(); });
  window.addEventListener('resize', function () { if (!say.hidden) placeSay(); });

  /* react(moment) : Clic change d'expression et dit un petit mot.
     opts.force : passe même si Clic vient de parler ; opts.chance : probabilité (0 à 1) */
  function react(kind, opts) {
    opts = opts || {};
    var P = (window.CLIC_PHRASES || {})[kind]; if (!P) return false;
    if (opts.chance != null && Math.random() > opts.chance) return false;
    var now = Date.now();
    if (!opts.force && now - lastSay < 9000) return false;
    if (document.hidden) return false;
    lastSay = now;
    var img = pick(P.image, kind + 'i');
    face(img); clearTimeout(faceTimer); faceTimer = setTimeout(function () { face(null); }, 9000);
    if (isOpen) return true;                                   // tiroir ouvert : seulement l'expression change
    if (SANS) { haut(pick(P.phrases, kind), img); return true; }  // pas de languette : le mot va dans la bulle du Clic du haut
    sayImg.src = IMG_DIR + img + '.webp'; sayTxt.textContent = pick(P.phrases, kind);
    say.hidden = false; placeSay(); say.classList.remove('pop'); void say.offsetWidth; say.classList.add('pop');
    tab.classList.remove('wiggle'); void tab.offsetWidth; tab.classList.add('wiggle');
    clearTimeout(sayTimer); sayTimer = setTimeout(hideSay, 6500);
    return true;
  }
  /* Le Clic du haut (sans languette) : un seul système pour toutes les pages.
     - sa face est un bouton qui ouvre le tiroir ;
     - ses petits mots passent dans sa bulle 9 secondes, puis le message de la page revient
       (sauf si la page a écrit un nouveau message entre-temps). */
  var hautBox = SANS ? document.querySelector('.c-say') : null;
  var hautImg = hautBox ? hautBox.querySelector('.c-say-img') : null, hautBub = hautBox ? hautBox.querySelector('.c-say-bub') : null, hautTimer = 0, hautAvant = null;
  function haut(texte, img) {
    if (!hautBub) return;
    clearTimeout(hautTimer);
    if (hautAvant === null) hautAvant = hautBub.textContent;
    hautBub.textContent = texte;
    if (hautImg && img) hautImg.src = corpsDe(img);
    hautTimer = setTimeout(function () {
      if (hautBub.textContent === texte) hautBub.textContent = hautAvant;
      hautAvant = null;
      if (hautImg) hautImg.src = BASE_IMG;
    }, 9000);
  }
  if (hautImg) {
    hautImg.setAttribute('role', 'button'); hautImg.setAttribute('tabindex', '0');
    hautImg.setAttribute('aria-label', 'Ouvrir le bureau de Clic'); hautImg.title = 'Ouvrir le bureau de Clic';
    hautImg.addEventListener('click', function () { if (window.ClicBureau && ClicBureau.onOpen) ClicBureau.onOpen(); open(); });
    hautImg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (window.ClicBureau && ClicBureau.onOpen) ClicBureau.onOpen(); open(); } });
  }

  /* De temps en temps (2 à 4 min) : un rappel, un encouragement ou un compliment */
  (function idle() {
    setTimeout(function () {
      if (!isOpen && Date.now() - lastSay > 60000) react(['rappel', 'encourage', 'rappel', 'progres'][Math.floor(Math.random() * 4)]);
      idle();
    }, 120000 + Math.random() * 120000);
  })();
  /* Bonjour à l'arrivée, une fois par visite */
  var greeted = false; try { greeted = sessionStorage.getItem('laclique_clic_bonjour') === '1'; sessionStorage.setItem('laclique_clic_bonjour', '1'); } catch (e) {}
  if (!greeted) setTimeout(function () { react('arrivee', { force: true }); }, 2500);

  window.ClicBureau = {
    update: function (opts) {
      var hadMore = (cur.levels || []).length;
      cur = opts || {};
      render();
      tab.querySelector('.cb-dot').hidden = isOpen || !(cur.levels && cur.levels.length && !hadMore);
    },
    open: open, close: close, react: react, face: face,
    isOpen: function () { return isOpen; }
  };

  place();
  if (document.readyState !== 'complete') window.addEventListener('load', place);
})();
