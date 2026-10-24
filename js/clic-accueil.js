/* La Clique — Clic vivant sur l'accueil.
   Clic se tient dans le coin en bas à gauche de l'écran. Il respire, se tourne un peu vers la souris
   et dit un petit mot de temps en temps :
   - à l'arrivée (une fois par visite) ;
   - quand on arrive à certaines sections (la méthode, l'ordinateur virtuel, le contact) ;
   - quand on clique sur lui ;
   - de temps en temps (toutes les 2 à 4 minutes), sans déranger.
   Ses phrases et ses expressions viennent de js/clic-phrases.js (les mêmes que dans les cours).
   Il se cache quand l'écran de connexion est ouvert. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var root = $('clicLive'), perso = $('clicPerso'), bulle = $('clicBulle'), texte = $('clicTexte'), page = $('page');
  if (!root || !perso || !bulle || !texte) return;
  var P = window.CLIC_PHRASES || {};

  /* Les expressions : Clic au complet (assets/clic/corps/), déjà dans la page mais cachées.
     Quand il parle, le grand Clic prend l'expression ; quand la bulle se ferme, il redevient lui-même. */
  var base = perso.querySelector('.clic-base'), corps = {};
  Array.prototype.forEach.call(perso.querySelectorAll('[data-corps]'), function (img) { corps[img.getAttribute('data-corps')] = img; });
  function visage(nom) {
    var cible = corps[nom] || null;
    Object.keys(corps).forEach(function (k) {
      var img = corps[k];
      if (img === cible) { img.loading = 'eager'; img.hidden = false; } else img.hidden = true;
    });
    if (base) base.hidden = !!cible;
  }

  var dernier = 0, minuterie = 0, derniersIdx = {};
  function choisir(liste, cle) {
    if (!Array.isArray(liste)) return liste;
    var i; do { i = Math.floor(Math.random() * liste.length); } while (liste.length > 1 && i === derniersIdx[cle]);
    derniersIdx[cle] = i; return liste[i];
  }
  function cache() { return !!(page && page.classList.contains('page-open')); }
  function fermer() { bulle.hidden = true; bulle.classList.remove('pop'); visage(null); }

  /* dire(moment) : Clic change d'expression et dit un petit mot.
     opts.force : parle même s'il vient de parler (clic sur lui, arrivée) */
  function dire(moment, opts) {
    opts = opts || {};
    var m = P[moment]; if (!m || cache() || document.hidden) return false;
    var maintenant = Date.now();
    if (!opts.force && maintenant - dernier < 9000) return false;
    dernier = maintenant;
    visage(choisir(m.image, moment + '-image'));
    texte.textContent = choisir(m.phrases, moment);
    bulle.hidden = false;
    bulle.classList.remove('pop'); void bulle.offsetWidth; bulle.classList.add('pop');
    clearTimeout(minuterie); minuterie = setTimeout(fermer, 7000);
    return true;
  }

  /* Clic sur Clic : il saute et dit un mot d'encouragement ou un rappel */
  perso.addEventListener('click', function () {
    perso.classList.remove('hop'); void perso.offsetWidth; perso.classList.add('hop');
    dire(choisir(['encourage', 'rappel', 'encourage'], 'clic'), { force: true });
  });
  perso.addEventListener('animationend', function (e) { if (e.animationName === 'clicHop') perso.classList.remove('hop'); });
  $('clicX').addEventListener('click', function (e) { e.stopPropagation(); fermer(); perso.focus({ preventScroll: true }); });
  bulle.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });

  /* Il penche un peu la tête vers la souris */
  var tilt = 0, raf = 0;
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var r = perso.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2);
    tilt = Math.max(-1, Math.min(1, dx / 700)) * 7;
    if (!raf) raf = requestAnimationFrame(function () { raf = 0; perso.style.setProperty('--tilt', tilt.toFixed(1) + 'deg'); });
  }, { passive: true });

  /* Il se cache quand l'écran de connexion est ouvert */
  if (page && window.MutationObserver) {
    new MutationObserver(function () {
      var c = cache(); root.classList.toggle('cache', c);
      if (c) fermer();
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
  }

  /* À l'arrivée, une fois par visite : « content de te revoir » seulement si la personne est déjà venue */
  function dejaVenu() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || '';
        if (/^(laclique|declic)_(alphabet|salles|algebre)/.test(k)) return true;
      }
    } catch (e) {}
    return false;
  }
  var salue = false;
  try { salue = sessionStorage.getItem('laclique_clic_bonjour') === '1'; sessionStorage.setItem('laclique_clic_bonjour', '1'); } catch (e) {}
  if (!salue) setTimeout(function () { dire(dejaVenu() ? 'arrivee' : 'rappel', { force: true }); }, 2500);

  /* Quand on s'arrête à certaines sections (au moins 1,2 seconde), il réagit (une fois chacune).
     Le délai évite qu'il parle d'une section qu'on ne fait que traverser en défilant. */
  var SECTIONS = { methode: 'notion', ordi: 'pratique', contact: 'contact' };
  if (window.IntersectionObserver) {
    var vu = {}, attente = {};
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        var id = en.target.id;
        if (vu[id]) return;
        clearTimeout(attente[id]);
        if (!en.isIntersecting) return;
        attente[id] = setTimeout(function () {
          if (dire(SECTIONS[id])) { vu[id] = true; obs.unobserve(en.target); }
        }, 1200);
      });
    }, { threshold: 0.45 });
    Object.keys(SECTIONS).forEach(function (id) { var s = $(id); if (s) obs.observe(s); });
  }

  /* De temps en temps (2 à 4 minutes) : un rappel ou un encouragement */
  (function attendre() {
    setTimeout(function () {
      if (Date.now() - dernier > 60000) dire(choisir(['rappel', 'encourage'], 'temps'));
      attendre();
    }, 120000 + Math.random() * 120000);
  })();

  window.ClicAccueil = { dire: dire, fermer: fermer };
})();
