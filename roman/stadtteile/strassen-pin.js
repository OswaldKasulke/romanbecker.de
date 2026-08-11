/*
 * strassen-pin.js — Karten-Pins im Straßenverzeichnis
 *
 * Die 📍-Pins waren früher <a href="https://www.google.com/maps/…">. Auf 90
 * Stadtteilseiten summierte sich das auf rund 5.980 ausgehende Follow-Links
 * zu google.com — knapp die Hälfte aller Links der Domain zeigte damit nach
 * außen. Jetzt sind es <button data-map="…">, die dieselbe Kartensuche per
 * JavaScript öffnen: für Nutzer identisch, für Crawler kein Link mehr.
 *
 * data-map enthält nur den Suchbegriff ("Aegidienberger Str., Köln-Sülz"),
 * die URL wird hier zusammengebaut.
 */
(function () {
  'use strict';

  var BASE = 'https://www.google.com/maps/search/?api=1&query=';

  document.addEventListener('click', function (ev) {
    var pin = ev.target.closest ? ev.target.closest('.strassen-pin') : null;
    if (!pin || !pin.dataset.map) return;
    ev.preventDefault();
    window.open(BASE + encodeURIComponent(pin.dataset.map), '_blank', 'noopener');
  });
})();
