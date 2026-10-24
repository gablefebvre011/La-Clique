/* La Clique — reprise de la progression sauvegardée sous l'ancien nom.
   Avant le changement de nom, le site sauvegardait la progression sous des clés
   qui commençaient par « declic_ ». Ce petit script les recopie une seule fois
   sous les nouvelles clés « laclique_ », pour que personne ne perde ses défis réussis.
   Il ne touche jamais à une clé « laclique_ » qui existe déjà. */
(function () {
  var VIEUX = 'declic_', NEUF = 'laclique_';
  function reprendre(stock) {
    try {
      var cles = [];
      for (var i = 0; i < stock.length; i++) {
        var k = stock.key(i);
        if (k && k.indexOf(VIEUX) === 0) cles.push(k);
      }
      cles.forEach(function (k) {
        var nouvelle = NEUF + k.slice(VIEUX.length);
        if (stock.getItem(nouvelle) === null) stock.setItem(nouvelle, stock.getItem(k));
      });
    } catch (e) { /* navigation privée ou stockage bloqué : rien à reprendre */ }
  }
  try { reprendre(window.localStorage); } catch (e) {}
  try { reprendre(window.sessionStorage); } catch (e) {}
})();
