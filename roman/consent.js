/* Einwilligung für romanbecker.de – auf allen Seiten eingebunden.
 *
 * Gefragt wird nur noch nach der Statistik (Google Analytics 4). Objektfotos,
 * Karten, Schriften und Skripte liegen seit 17.10.2026 auf dem eigenen Server
 * (scripts/fremdinhalte_lokal.py), dafür braucht es keine Einwilligung.
 *
 *   localStorage cookie_consent = granted | denied
 *
 * Widerruf: Link „Cookie-Einstellungen“ im Footer jeder Seite und Knopf
 * [data-consent-reset] in der Datenschutzerklärung.
 */
(function () {
  'use strict';
  var KEY = 'cookie_consent';
  var GA_ID = 'G-HQXZQF4ZBN';
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  var T = EN ? {
    text: 'We would like to use Google Analytics to measure which pages are read. This sets cookies and transmits data to Google. Without your consent none of this happens and the site works fully. Details in our ',
    privacy: 'privacy policy',
    yes: 'Accept',
    no: 'Decline',
    settings: 'Cookie settings'
  } : {
    text: 'Wir würden gern mit Google Analytics messen, welche Seiten gelesen werden. Das setzt Cookies und überträgt Daten an Google. Ohne Ihre Zustimmung geschieht nichts davon – die Seite funktioniert vollständig. Einzelheiten in der ',
    privacy: 'Datenschutzerklärung',
    yes: 'Einverstanden',
    no: 'Ablehnen',
    settings: 'Cookie-Einstellungen'
  };

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    /* Viele Seiten haben im Kopf schon loadAnalytics() (inkl. Consent-Defaults). */
    if (typeof window.loadAnalytics === 'function') { window.loadAnalytics(); return; }
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('config', GA_ID);
  }

  function deleteGACookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  var css =
    '#rb-consent{position:fixed;left:0;right:0;bottom:0;z-index:10000;background:#063124;color:#fff;' +
    'border-top:2px solid #c2a990;padding:1rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;gap:1rem;' +
    'font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}' +
    '#rb-consent p{margin:0;flex:1 1 420px;color:rgba(255,255,255,.88)}' +
    '#rb-consent a{color:#c2a990;text-decoration:underline}' +
    '#rb-consent .rb-c-btns{display:flex;gap:.6rem;flex-wrap:wrap}' +
    '#rb-consent button{padding:.55rem 1.2rem;border-radius:4px;font-weight:600;font-size:14px;cursor:pointer;' +
    'border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff}' +
    '#rb-consent button.rb-c-yes{background:#c2a990;border-color:#c2a990;color:#000}' +
    '@media(max-width:767px){#rb-consent{padding:.75rem 1rem;font-size:13px}' +
    '#rb-consent .rb-c-btns{width:100%}#rb-consent button{flex:1 1 0;padding:.6rem .4rem;font-size:13px}}' +
    '.rb-consent-link{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}' +
    '.rb-consent-link--float{position:fixed;left:10px;bottom:10px;z-index:9998;background:#fff;color:#063124;' +
    'border:1px solid #c2a990;border-radius:4px;padding:3px 8px;font-size:12px}';

  function showBanner() {
    if (document.getElementById('rb-consent')) return;
    var d = document.createElement('div');
    d.id = 'rb-consent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', T.settings);
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(T.text));
    var a = document.createElement('a');
    a.href = '/datenschutz.html';
    a.textContent = T.privacy;
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));
    var btns = document.createElement('div');
    btns.className = 'rb-c-btns';
    [[T.no, '', 'denied'], [T.yes, 'rb-c-yes', 'granted']].forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = x[0];
      if (x[1]) b.className = x[1];
      b.addEventListener('click', function () {
        set(x[2]);
        d.parentNode.removeChild(d);
        if (x[2] === 'granted') loadGA();
      });
      btns.appendChild(b);
    });
    d.appendChild(p);
    d.appendChild(btns);
    document.body.appendChild(d);
  }

  /* Widerruf: Entscheidung löschen, GA-Cookies entfernen, neu laden -> Banner erscheint. */
  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    /* GA zuerst abschalten, sonst schreibt es _ga_* beim Verlassen der Seite neu. */
    window['ga-disable-' + GA_ID] = true;
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied' });
    deleteGACookies();
    location.reload();
  }
  window.rbConsentReset = reset;

  function settingsLink() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'rb-consent-link';
    b.textContent = T.settings;
    b.addEventListener('click', reset);
    var footer = document.querySelector('footer');
    if (footer) {
      var wrap = document.createElement('p');
      wrap.style.cssText = 'margin:.75rem 0 0;text-align:center;font-size:.8125rem;opacity:.85';
      wrap.appendChild(b);
      footer.appendChild(wrap);
    } else {
      b.className += ' rb-consent-link--float';
      document.body.appendChild(b);
    }
    var slots = document.querySelectorAll('[data-consent-reset]');
    for (var i = 0; i < slots.length; i++) slots[i].addEventListener('click', reset);
  }

  function init() {
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
    settingsLink();
    var c = get();
    /* Ohne Zustimmung dürfen keine GA-Cookies übrig sein (z. B. nach dem Widerruf). */
    if (c !== 'granted') deleteGACookies();
    if (c === null) showBanner();
    /* Seiten ohne eigenes Kopfskript: GA hier laden. Mit Kopfskript ist es schon geladen. */
    else if (c === 'granted' && typeof window.loadAnalytics !== 'function') loadGA();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
