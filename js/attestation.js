/* L'attestation de réussite de La Clique : une image à télécharger ou partager.
   La photo de la personne reste dans son navigateur : rien n'est envoyé nulle part. */
(function () {
  'use strict';
  var ALG = /[?&]c=(algebre|salles)/.test(location.search);
  var DATA = (ALG ? window.ALGEBRE : window.ALPHABET) || [];
  var COURSE_NAME = ALG ? 'la Cyber-Algèbre' : 'L’Alphabet';
  /* Comme au cégep : le premier cours d'introduction porte le numéro 101 */
  var COURSE_NUM = ALG ? '102' : '101';
  var COURSE_TITLE = ALG ? 'La Cyber-Algèbre' : 'L’Alphabet de la cybersécurité';
  var KEY = ALG ? 'laclique_salles_v1' : 'laclique_alphabet_v1';
  var AKEY = 'laclique_attestation_v1';
  /* Même format pour les deux versions : celui du cadre royal (1080 × 1890) */
  var W = 1080, H = 1890, CX = 540, CY = 690, R = 185;
  function geo(v) { return v === 'detail' ? { CY: 560, R: 112 } : { CY: 690, R: 185 }; }

  var $ = function (id) { return document.getElementById(id); };
  var cv = $('aCanvas'), ctx = cv.getContext('2d');

  /* ---------- Est-ce que le cours est fini ? ---------- */
  function slug(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); }
  function readJSON(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var ids = []; DATA.forEach(function (m) { m.defis.forEach(function (d) { ids.push(slug(d.title)); }); });
  var N = ids.length;
  var done = ((readJSON(KEY) || {}).done) || [];
  var left = ids.filter(function (id) { return done.indexOf(id) < 0; }).length;
  var realComplete = N > 0 && left === 0;
  /* Les notes : pour chaque défi, la note avec laquelle il a été réussi (et le nombre d'essais).
     La note finale = la moyenne de ces notes, au dixième près (ex. 87,4 %). */
  var titres = []; DATA.forEach(function (m) { m.defis.forEach(function (d) { titres.push(String(d.title).replace(/^Défi\s*[\d.]+\s*[—–-]\s*/, '')); }); });
  var scs = ((readJSON(KEY) || {}).sc) || {};
  var notes = ids.map(function (id, i) { var x = scs[id]; return { titre: titres[i], note: x && x.ok ? x.best : null, essais: x ? x.tries : 0 }; });
  var notees = notes.filter(function (n) { return n.note != null; });
  var finale = notees.length ? notees.reduce(function (a, n) { return a + n.note; }, 0) / notees.length : null;
  function pct(v) { return (Math.round(v * 10) / 10).toLocaleString('fr-CA', { maximumFractionDigits: 1 }) + ' %'; }
  /* Mode créateur (même réglage que les cours) : attestation débloquée pour tester, sans rien enregistrer comme réussi */
  var CREATEUR = false; try { CREATEUR = localStorage.getItem('laclique_createur') === '431a593d04f610c4e3ae7f5df2cff73daa33fb98d5b3046fc2e150a5498be795'; } catch (e) {}
  var complete = realComplete || CREATEUR;

  var saved = readJSON(AKEY) || {};
  var ck = ALG ? 'algebre' : 'alphabet';
  if (realComplete && !saved[ck]) { saved[ck] = new Date().toISOString(); writeJSON(AKEY, saved); }
  var when = saved[ck] ? new Date(saved[ck]) : new Date();
  var dateTxt = 'Le ' + when.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' });

  $('aBack').href = ALG ? './cours.html?c=algebre' : './cours.html';
  $('aTitle').textContent = 'Ton attestation du cours ' + COURSE_NUM + ' 🎓';
  if (CREATEUR && !realComplete) {
    var ck2 = $('aLock'); ck2.hidden = false;
    ck2.textContent = '🛠️ Mode créateur : attestation débloquée pour tester. Ta vraie progression n’est pas touchée.';
  }
  if (!complete) {
    var lk = $('aLock'); lk.hidden = false;
    lk.innerHTML = '🔒 Voici un exemple. Termine ' + (left === 1 ? 'le dernier défi' : 'les ' + left + ' défis qui restent') + ' du cours ' + COURSE_NUM + ' (' + COURSE_NAME +
      ') pour débloquer la tienne. <a href="' + $('aBack').getAttribute('href') + '">Continuer le cours →</a>';
    $('aDl').disabled = true;
  }

  /* ---------- État ---------- */
  var st = {
    name: saved.name || '',
    photo: null, px: 0, py: 0, zoom: 1,
    cap: true, capX: CX, capY: CY - R + 10, capS: 112, capR: -8,
    mode: 'cap',
    version: saved.version === 'detail' ? 'detail' : 'courte'
  };
  $('aName').value = st.name;
  (function () { var g = geo(st.version); CY = g.CY; R = g.R; st.capY = CY - R + 10; st.capS = Math.round(120 * R / 200); })();

  var clic = new Image(); clic.onload = draw; clic.src = './assets/clic/saute.webp';
  /* Le cadre royal (image Stockcake, licence CC0 : libre d'utilisation, même commerciale) */
  var cadre = new Image(); cadre.onload = draw; cadre.src = './assets/attestation-cadre.jpg';
  var mark = new Path2D('M769.3 864.7 L764.4 868.0 L756.4 867.6 L722.7 857.4 L686.7 844.6 L626.9 819.7 L591.7 802.8 L560.9 786.2 L526.2 765.6 L504.4 751.6 L464.2 723.3 L414.4 683.6 L386.6 659.2 L363.2 637.0 L322.8 594.4 L285.5 550.3 L247.7 500.2 L222.0 462.3 L206.3 437.3 L183.4 398.3 L166.8 367.7 L144.5 323.2 L127.2 285.1 L121.5 271.3 L120.0 264.6 L120.0 245.5 L121.1 241.6 L122.6 240.0 L128.9 238.1 L183.0 231.9 L239.2 222.9 L288.8 212.3 L330.1 201.5 L384.4 184.1 L416.1 171.9 L443.4 160.1 L480.3 141.6 L493.7 133.8 L499.5 132.0 L505.3 133.6 L520.8 142.4 L555.6 159.8 L578.3 169.7 L613.4 183.4 L665.1 200.1 L704.9 210.8 L761.2 223.0 L808.6 230.9 L871.4 238.1 L877.5 240.2 L879.4 243.2 L880.0 250.7 L880.0 579.7 L877.5 614.7 L873.0 647.7 L868.4 670.7 L860.6 700.4 L851.2 728.4 L840.2 754.9 L822.0 790.4 L808.4 812.6 L788.2 841.3 Z M727.2 909.0 L711.2 923.9 L683.7 946.9 L657.1 967.5 L631.2 985.7 L601.9 1005.2 L558.3 1031.7 L511.2 1057.9 L503.6 1061.7 L499.9 1062.5 L492.8 1060.7 L461.0 1043.6 L393.8 1003.3 L348.3 972.2 L330.6 958.9 L284.2 920.6 L255.9 893.5 L231.8 867.1 L208.7 838.1 L191.3 813.1 L170.1 777.2 L162.0 761.0 L147.2 725.2 L139.0 700.8 L131.6 672.4 L125.9 643.8 L122.2 615.0 L119.9 583.0 L119.8 384.4 L120.0 378.1 L121.0 374.7 L122.9 374.3 L124.9 376.6 L149.0 420.9 L185.2 480.9 L210.7 518.9 L241.1 560.2 L267.9 593.6 L308.3 639.6 L349.8 681.2 L375.4 704.5 L409.9 733.5 L446.8 761.8 L486.4 789.0 L533.8 818.2 L571.9 838.7 L604.7 854.9 L636.2 868.9 L674.8 884.1 L725.7 901.7 L728.8 904.4 L728.8 906.3 Z M612.6 658.6 L616.3 658.0 L619.3 656.1 L627.2 646.1 L727.2 500.2 L730.6 492.5 L730.4 488.6 L728.9 485.4 L726.4 483.0 L722.9 481.7 L668.4 480.8 L663.4 479.3 L660.2 476.0 L658.9 472.4 L658.6 464.8 L665.0 368.6 L663.7 360.1 L661.5 357.5 L658.2 356.0 L652.2 356.5 L646.3 361.9 L557.7 496.4 L554.7 501.5 L553.6 505.2 L553.6 509.3 L554.9 512.8 L559.7 516.1 L565.5 516.8 L613.9 517.2 L620.1 519.3 L623.6 523.8 L624.3 527.5 L623.5 534.4 L603.7 647.8 L604.0 651.6 L606.2 655.8 L609.0 657.8 Z');

  /* ---------- Dessin ---------- */
  var FONT = "'Space Grotesk', system-ui, sans-serif";
  /* Couleurs royales : bleu du cadre et dorures */
  var MARINE = '#14286e', OR = '#a8781c', DOUX = '#4f5a7c';
  function grad(x0, y0, x1, y1) { var g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#f3d27a'); g.addColorStop(.5, '#c99a3a'); g.addColorStop(1, '#8a5e12'); return g; }
  function center(txt, y, size, weight, color, maxW) {
    var s = size; ctx.font = weight + ' ' + s + 'px ' + FONT;
    while (maxW && ctx.measureText(txt).width > maxW && s > 20) { s -= 2; ctx.font = weight + ' ' + s + 'px ' + FONT; }
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(txt, CX, y);
  }
  function spaced(txt, y, size, color, sp) {
    ctx.font = '600 ' + size + 'px ' + FONT; ctx.fillStyle = color; ctx.textAlign = 'left';
    var w = 0, i; for (i = 0; i < txt.length; i++) w += ctx.measureText(txt[i]).width + sp; w -= sp;
    var x = CX - w / 2; for (i = 0; i < txt.length; i++) { ctx.fillText(txt[i], x, y); x += ctx.measureText(txt[i]).width + sp; }
  }
  function cover(img, x, y, d, zoom, ox, oy) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var s = d * zoom / Math.min(iw, ih), w = iw * s, h = ih * s;
    ctx.drawImage(img, x - w / 2 + ox, y - h / 2 + oy, w, h);
  }
  function drawCap(x, y, s, deg) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(deg * Math.PI / 180);
    ctx.lineJoin = 'round';
    // la calotte (sous le carré)
    ctx.beginPath();
    ctx.moveTo(-0.55 * s, 0.02 * s); ctx.lineTo(0.55 * s, 0.02 * s); ctx.lineTo(0.5 * s, 0.5 * s);
    ctx.quadraticCurveTo(0, 0.68 * s, -0.5 * s, 0.5 * s); ctx.closePath();
    ctx.fillStyle = '#12161c'; ctx.fill(); ctx.lineWidth = Math.max(2, s * 0.03); ctx.strokeStyle = '#2b3440'; ctx.stroke();
    // le carré du dessus, vu en perspective
    ctx.beginPath(); ctx.moveTo(0, -0.34 * s); ctx.lineTo(s, 0); ctx.lineTo(0, 0.34 * s); ctx.lineTo(-s, 0); ctx.closePath();
    var g = ctx.createLinearGradient(0, -0.34 * s, 0, 0.34 * s); g.addColorStop(0, '#2a323d'); g.addColorStop(1, '#0d1116');
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = grad(-s, 0, s, 0); ctx.lineWidth = Math.max(2, s * 0.035); ctx.stroke();
    // le bouton et le gland
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(0.45 * s, 0.05 * s, 0.78 * s, 0.06 * s); ctx.lineTo(0.8 * s, 0.55 * s);
    ctx.strokeStyle = '#ffd95a'; ctx.lineWidth = Math.max(2, s * 0.03); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0.74 * s, 0.52 * s); ctx.lineTo(0.86 * s, 0.52 * s); ctx.lineTo(0.9 * s, 0.82 * s); ctx.lineTo(0.7 * s, 0.82 * s); ctx.closePath();
    ctx.fillStyle = '#ffd95a'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 0.07 * s, 0, Math.PI * 2); ctx.fillStyle = '#ffd95a'; ctx.fill();
    ctx.restore();
  }
  /* Le sceau de La Clique : bleu royal, anneau doré, texte tout le tour, bouclier au centre */
  function sceau(x, y, r) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-8 * Math.PI / 180);
    ctx.shadowColor = 'rgba(20,40,110,.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = MARINE; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = r * .08; ctx.strokeStyle = grad(-r, -r, r, r); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * .64, 0, Math.PI * 2); ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(243,210,122,.7)'; ctx.stroke();
    var txt = 'LA CLIQUE · CENTRE DE FORMATION · ', n = txt.length;
    ctx.font = '700 ' + (r * .17).toFixed(1) + 'px ' + FONT; ctx.fillStyle = '#f3d27a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (var i = 0; i < n; i++) { ctx.save(); ctx.rotate(i / n * Math.PI * 2); ctx.fillText(txt[i], 0, -r * .81); ctx.restore(); }
    ctx.save(); var k = r / 56; ctx.scale(k, k); ctx.translate(-14, -17);
    ctx.strokeStyle = '#f3d27a'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
    ctx.stroke(new Path2D('M14 2.5 4 6.5v7c0 6 4.2 10 10 12 5.8-2 10-6 10-12v-7L14 2.5Z'));
    ctx.fillStyle = '#f3d27a'; ctx.fill(new Path2D('m15.5 8.5-4 6.5h4l-1.5 5 4.5-7h-4l1-4.5Z'));
    ctx.restore();
    ctx.font = '700 ' + (r * .15).toFixed(1) + 'px ' + FONT; ctx.fillStyle = '#ffffff'; ctx.fillText('COURS ' + COURSE_NUM, 0, r * .42);
    ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
  function logo(y, taille) {
    ctx.font = '700 ' + taille + 'px ' + FONT; var lw = ctx.measureText('LA CLIQUE').width, ic = taille * 1.15, lx = CX - (lw + ic + 14) / 2;
    ctx.save(); ctx.translate(lx, y - ic / 2); ctx.scale(ic / 942.5, ic / 942.5); ctx.translate(-28.6, -126); ctx.fillStyle = MARINE; ctx.fill(mark, 'evenodd'); ctx.restore();
    ctx.fillStyle = MARINE; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('LA CLIQUE', lx + ic + 14, y + 2);
    ctx.textBaseline = 'alphabetic';
  }
  function portrait() {
    ctx.save(); ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#efe6cc'; ctx.fillRect(CX - R, CY - R, 2 * R, 2 * R);
    if (st.photo) cover(st.photo, CX, CY, 2 * R, st.zoom, st.px, st.py);
    else if (clic.complete && clic.naturalWidth) cover(clic, CX, CY, 2 * R, 1, 0, 0);
    ctx.restore();
    ctx.beginPath(); ctx.arc(CX, CY, R + 5, 0, Math.PI * 2); ctx.strokeStyle = grad(CX - R, CY - R, CX + R, CY + R); ctx.lineWidth = Math.max(6, R * .05); ctx.stroke();
    if (st.cap) drawCap(st.capX, st.capY, st.capS, st.capR);
  }
  function filet(y, demi) { ctx.fillStyle = grad(CX - demi, 0, CX + demi, 0); ctx.fillRect(CX - demi, y, 2 * demi, 3); }

  function draw() {
    if (cv.height !== H) cv.height = H;
    ctx.clearRect(0, 0, W, H);
    // le cadre royal (en attendant qu'il charge : un fond crème)
    ctx.fillStyle = '#f6efd9'; ctx.fillRect(0, 0, W, H);
    if (cadre.complete && cadre.naturalWidth) ctx.drawImage(cadre, 0, 0, W, H);
    var nm = st.name.trim(), sansNom = 'rgba(20,40,110,.3)';

    if (st.version !== 'detail') {
      /* ----- Version abrégée ----- */
      logo(300, 40);
      spaced('ATTESTATION DE RÉUSSITE', 392, 28, OR, 6);
      center('Cours ' + COURSE_NUM + ' — ' + COURSE_TITLE, 448, 32, '600', MARINE, 740);
      portrait();
      center('Décernée à', 940, 26, '400', DOUX, 560);
      center(nm || 'Ton nom ici', 1012, 62, '700', nm ? MARINE : sansNom, 590);
      filet(1036, 150);
      center(dateTxt, 1100, 26, '500', OR, 560);
      center('pour avoir réussi les ' + N + ' défis et les ' + N + ' missions du cours', 1245, 30, '500', MARINE, 760);
      sceau(CX, 1385, 72);
      center('Émise par La Clique, centre de formation en cybersécurité', 1500, 24, '500', DOUX, 760);
      center('formationdelaclique.ca', 1540, 24, '600', OR, 760);
    } else {
      /* ----- Version détaillée : avec le relevé de notes ----- */
      logo(290, 34);
      spaced('ATTESTATION DE RÉUSSITE', 370, 24, OR, 5);
      center('Cours ' + COURSE_NUM + ' — ' + COURSE_TITLE, 420, 28, '600', MARINE, 740);
      portrait();
      center('Décernée à', 725, 22, '400', DOUX, 560);
      center(nm || 'Ton nom ici', 790, 52, '700', nm ? MARINE : sansNom, 590);
      filet(810, 130);
      center('pour avoir réussi les ' + N + ' défis et les ' + N + ' missions du cours', 862, 24, '500', MARINE, 600);
      center(dateTxt, 900, 22, '500', OR, 560);
      spaced('RELEVÉ DE NOTES', 968, 22, OR, 5);
      ctx.font = '700 60px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = finale == null ? sansNom : (finale >= 90 ? OR : MARINE);
      ctx.fillText(finale == null ? '— %' : pct(finale), CX, 1046);
      center('Note finale' + (notees.length && notees.length < N ? ' (sur ' + notees.length + ' défis notés)' : ' · moyenne des ' + N + ' défis'), 1080, 19, '400', DOUX, 560);
      sceau(800, 1015, 46);
      var y0 = 1190, pas = Math.min(26, 350 / Math.max(1, N));
      notes.forEach(function (n, i) {
        var y = y0 + i * pas;
        if (i % 2 === 0) { ctx.fillStyle = 'rgba(20,40,110,.06)'; ctx.fillRect(150, y - 19, W - 300, pas); }
        ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.font = '500 18px ' + FONT;
        var t = (i + 1) + '. ' + n.titre;
        while (ctx.measureText(t).width > 470 && t.length > 4) t = t.slice(0, -2).trimEnd() + '…';
        ctx.fillStyle = MARINE; ctx.fillText(t, 165, y);
        ctx.textAlign = 'right'; ctx.font = '700 18px ' + FONT;
        ctx.fillStyle = n.note == null ? sansNom : (n.note >= 90 ? OR : MARINE);
        ctx.fillText(n.note == null ? '—' : pct(n.note), 915, y);
        ctx.font = '400 15px ' + FONT; ctx.fillStyle = DOUX;
        ctx.fillText(n.note == null ? '' : (n.essais <= 1 ? 'du premier coup' : n.essais + ' essais'), 815, y);
      });
      center('Émise par La Clique, centre de formation en cybersécurité', 1585, 18, '500', DOUX, 480);
      center('formationdelaclique.ca', 1610, 18, '600', OR, 480);
    }

    if (!complete) {
      ctx.save(); ctx.translate(CX, H / 2); ctx.rotate(-Math.PI / 7);
      ctx.font = '700 170px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(20,40,110,.09)'; ctx.fillText('EXEMPLE', 0, 0); ctx.restore();
    }
  }

  /* ---------- Contrôles ---------- */
  function saveName() { saved.name = st.name; writeJSON(AKEY, saved); }
  $('aName').addEventListener('input', function (e) { st.name = e.target.value; draw(); saveName(); });
  $('aCap').addEventListener('change', function (e) { st.cap = e.target.checked; $('aCapSize').disabled = $('aCapRot').disabled = !st.cap; draw(); });
  $('aCapSize').addEventListener('input', function (e) { st.capS = +e.target.value; draw(); });
  $('aCapRot').addEventListener('input', function (e) { st.capR = +e.target.value; draw(); });
  $('aZoom').addEventListener('input', function (e) { st.zoom = +e.target.value / 100; clampPhoto(); draw(); });
  function setMode(m) {
    st.mode = m;
    [].forEach.call(document.querySelectorAll('#aModeSeg button'), function (b) { var on = b.dataset.t === m; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
  }
  [].forEach.call(document.querySelectorAll('#aModeSeg button'), function (b) { b.addEventListener('click', function () { setMode(b.dataset.t); }); });
  /* Version abrégée (sans les notes) ou détaillée (avec le relevé de notes) */
  function setVersion(v) {
    var g0 = geo(st.version), g1 = geo(v), k = g1.R / g0.R;
    st.capX = CX + (st.capX - CX) * k; st.capY = g1.CY + (st.capY - g0.CY) * k; st.capS = st.capS * k; st.px *= k; st.py *= k;
    CY = g1.CY; R = g1.R;
    st.version = v; saved.version = v; writeJSON(AKEY, saved);
    [].forEach.call(document.querySelectorAll('#aVerSeg button'), function (b) { var on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
    draw();
  }
  [].forEach.call(document.querySelectorAll('#aVerSeg button'), function (b) { b.addEventListener('click', function () { setVersion(b.dataset.v); }); });
  setVersion(st.version);
  function syncPhotoUi() {
    var has = !!st.photo; $('aZoom').disabled = !has; $('aNoPhoto').hidden = !has;
    document.querySelector('#aModeSeg button[data-t=photo]').disabled = !has;
    if (!has && st.mode === 'photo') setMode('cap');
  }
  function clampPhoto() {
    if (!st.photo) return;
    var iw = st.photo.naturalWidth, ih = st.photo.naturalHeight, s = 2 * R * st.zoom / Math.min(iw, ih);
    var mx = Math.max(0, (iw * s) / 2 - R), my = Math.max(0, (ih * s) / 2 - R);
    st.px = Math.max(-mx, Math.min(mx, st.px)); st.py = Math.max(-my, Math.min(my, st.py));
  }
  $('aFile').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    var url = URL.createObjectURL(f), img = new Image();
    img.onload = function () { st.photo = img; st.px = st.py = 0; st.zoom = 1; $('aZoom').value = 100; syncPhotoUi(); setMode('photo'); draw(); msg('Photo ajoutée. Glisse-la pour la placer, puis choisis « Le chapeau » pour le placer sur ta tête.'); };
    img.onerror = function () { msg('Oups, cette image ne s’ouvre pas. Essaie avec une autre photo (JPG ou PNG).'); };
    img.src = url; e.target.value = '';
  });
  $('aNoPhoto').addEventListener('click', function () { st.photo = null; syncPhotoUi(); draw(); });

  // glisser sur l'image (souris ou doigt)
  var drag = null;
  function pt(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  cv.addEventListener('pointerdown', function (e) {
    var p = pt(e), nearCap = st.cap && Math.abs(p.x - st.capX) < st.capS && Math.abs(p.y - st.capY) < st.capS * 0.8;
    var inPhoto = st.photo && Math.hypot(p.x - CX, p.y - CY) < R;
    var target = null;
    if (st.mode === 'photo' && inPhoto) target = 'photo';
    else if (st.cap && (nearCap || st.mode === 'cap')) target = 'cap';
    else if (inPhoto) target = 'photo';
    if (!target) return;
    drag = { t: target, x: p.x, y: p.y }; cv.classList.add('drag');
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    e.preventDefault();
  });
  cv.addEventListener('pointermove', function (e) {
    if (!drag) return; var p = pt(e), dx = p.x - drag.x, dy = p.y - drag.y; drag.x = p.x; drag.y = p.y;
    if (drag.t === 'cap') { st.capX = Math.max(0, Math.min(W, st.capX + dx)); st.capY = Math.max(0, Math.min(H, st.capY + dy)); }
    else { st.px += dx; st.py += dy; clampPhoto(); }
    draw();
  });
  function end() { drag = null; cv.classList.remove('drag'); }
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);

  /* ---------- Télécharger / partager ---------- */
  function msg(t) { $('aMsg').textContent = t; }
  function fileName() { return 'attestation-la-clique-cours-' + COURSE_NUM + (st.version === 'detail' ? '-detaillee' : '') + '.png'; }
  function blob(cb) { if (cv.toBlob) cv.toBlob(cb, 'image/png'); else cb(null); }
  $('aDl').addEventListener('click', function () {
    if (!complete) return;
    if (!st.name.trim()) { msg('Écris ton nom avant de télécharger. 😉'); $('aName').focus(); return; }
    blob(function (b) {
      var a = document.createElement('a'); a.download = fileName();
      a.href = b ? URL.createObjectURL(b) : cv.toDataURL('image/png');
      document.body.appendChild(a); a.click(); a.remove();
      msg('Ton attestation est téléchargée. Bravo encore, t’as travaillé fort! 🎉');
    });
  });
  var canFiles = false;
  try { canFiles = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File(['x'], 'x.png', { type: 'image/png' })] })); } catch (e) {}
  if (canFiles && complete) {
    $('aShare').hidden = false;
    $('aShare').addEventListener('click', function () {
      if (!st.name.trim()) { msg('Écris ton nom avant de partager. 😉'); $('aName').focus(); return; }
      blob(function (b) {
        if (!b) return;
        var f = new File([b], fileName(), { type: 'image/png' });
        navigator.share({ files: [f], title: 'Mon attestation de La Clique', text: 'J’ai réussi le cours ' + COURSE_NUM + ' de La Clique' + (st.version === 'detail' && finale != null ? ', avec ' + pct(finale) : '') + '! 🎓' }).catch(function () {});
      });
    });
  }

  syncPhotoUi();
  draw();
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load("700 76px 'Space Grotesk'"), document.fonts.load("600 44px 'Space Grotesk'"), document.fonts.load("400 30px 'Space Grotesk'"), document.fonts.load("500 30px 'Space Grotesk'")]).then(draw, draw);
  }
})();
