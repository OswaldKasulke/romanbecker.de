/* Settings for optional analytics. No Google resource is loaded before consent. */
(function () {
  "use strict";
  if (window.__privacySettings) return;
  window.__privacySettings = true;
  var script = document.currentScript;
  var id = script.dataset.measurement;
  var key = script.dataset.storage;
  var versionKey = key + "_version";
  var version = "2026-09-30-1";
  var yes = key === "cookie_consent" ? "granted" : "ja";
  var no = key === "cookie_consent" ? "denied" : "nein";
  var english = document.documentElement.lang === "en";
  var active = false, opener = null;
  function read(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
  function allowed() { return read(versionKey) === version && read(key) === yes; }
  function clearCookies() {
    var names = document.cookie.split(";").map(function (s) { return s.trim().split("=")[0]; }).filter(function (n) { return /^_ga(?:_|$)/.test(n); });
    var domains = [""], parts = location.hostname.split(".");
    for (var i = 0; i < parts.length; i++) domains.push(parts.slice(i).join("."));
    var paths = ["/"], segments = location.pathname.split("/");
    for (var j = 1; j < segments.length; j++) { var p = segments.slice(0, j + 1).join("/"); paths.push(p, p + "/"); }
    names.forEach(function (name) { domains.forEach(function (domain) { paths.forEach(function (path) {
      document.cookie = name + "=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + (domain ? "; domain=" + domain : "");
    }); }); });
  }
  function stop() {
    window["ga-disable-" + id] = true;
    window.gtag = function () {};
    if (window.dataLayer) window.dataLayer.length = 0;
    document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').forEach(function (s) { s.remove(); });
    clearCookies();
  }
  function start() {
    if (active) return;
    active = true;
    window["ga-disable-" + id] = false;
    window.dataLayer = [];
    window.gtag = function () { if (!window["ga-disable-" + id]) window.dataLayer.push(arguments); };
    if (id === "G-HQXZQF4ZBN") window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied" });
    window.gtag("js", new Date());
    window.gtag("config", id);
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(s);
  }
  var panel = document.createElement("section");
  panel.id = "privacy-settings"; panel.className = "privacy-settings";
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-labelledby", "privacy-title"); panel.hidden = true;
  panel.innerHTML = '<h2 id="privacy-title" tabindex="-1">' + (english ? 'Privacy settings' : 'Datenschutzeinstellungen') + '</h2><p>' +
    (english ? 'Google Analytics measures visits and uses cookies. Analytics is optional and starts only with your consent. You can change or withdraw your choice here at any time.' : 'Google Analytics misst Seitenaufrufe und verwendet Cookies. Die Statistik ist freiwillig und startet nur nach Ihrer Zustimmung. Sie können Ihre Auswahl hier jederzeit ändern oder widerrufen.') +
    '</p><p><a href="' + script.dataset.privacy + '">' + (english ? 'Privacy policy' : 'Datenschutzerklärung') + '</a></p><label><input id="privacy-analytics" type="checkbox"> ' +
    (english ? 'Statistics (Google Analytics)' : 'Statistik (Google Analytics)') + '</label><div class="privacy-actions"><button type="button" data-choice="no">' +
    (english ? 'Reject all / withdraw' : 'Alle ablehnen / widerrufen') + '</button><button type="button" data-choice="save">' +
    (english ? 'Save selection' : 'Auswahl speichern') + '</button><button type="button" data-choice="yes">' +
    (english ? 'Accept' : 'Akzeptieren') + '</button><button type="button" data-choice="close">' + (english ? 'Close' : 'Schließen') + '</button></div>';
  document.body.appendChild(panel);
  var checkbox = panel.querySelector("input");
  function open(focus) { checkbox.checked = allowed(); panel.hidden = false; if (focus) { opener = document.activeElement; panel.querySelector("h2").focus(); } }
  function close() { panel.hidden = true; if (opener && opener.isConnected) opener.focus(); }
  panel.addEventListener("click", function (event) {
    var button = event.target.closest("[data-choice]"); if (!button) return;
    var choice = button.dataset.choice;
    if (choice === "close") { close(); return; }
    var accepted = choice === "yes" || (choice === "save" && checkbox.checked);
    write(key, accepted ? yes : no); write(versionKey, version);
    if (!accepted) { var wasActive = active; stop(); close(); if (wasActive) location.reload(); }
    else { start(); close(); }
  });
  panel.addEventListener("keydown", function (event) { if (event.key === "Escape") close(); });
  document.addEventListener("click", function (event) {
    if (!event.target.closest) return;
    var trigger = event.target.closest("[data-privacy-open], [data-einwilligung-zuruecksetzen]");
    if (trigger) { event.preventDefault(); open(true); }
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== key && event.key !== versionKey && event.key !== null) return;
    if (!allowed()) { stop(); if (active) location.reload(); }
  });
  if (allowed()) start();
  else { stop(); if (read(versionKey) !== version || read(key) !== no) open(false); }
})();
