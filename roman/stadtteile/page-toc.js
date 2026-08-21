/*
 * page-toc.js — schwebende Sektions-Übersicht ("Inhalt")
 *
 * Baut auf jeder Seite automatisch ein Inhaltsverzeichnis aus deren eigenen
 * <section>-Blöcken. Kein seitenspezifisches Markup nötig: Beschriftung kommt
 * aus der echten Überschrift (h2 > h3 > .section-label), weil die kurzen
 * Eyebrow-Labels den Abschnitt oft nicht beschreiben ("Lokale Expertise"
 * statt "Kölner Stadtteile"). Der Ortsname der Seite wird gekürzt, damit die
 * Einträge nicht alle mit demselben Stadtteil beginnen. Fehlende IDs werden
 * ergänzt. Die Styles bringt das Skript selbst mit (siehe CSS-Konstante),
 * damit es auch auf Seiten ohne shared.css funktioniert.
 */
(function () {
  'use strict';

  var MIN_ENTRIES = 3;
  var MAX_LABEL = 38;

  /* Styles bringt das Skript selbst mit, damit es auch auf Seiten ohne
     shared.css funktioniert. Fallback-Werte fangen fehlende Variablen ab. */
  var CSS = '' +
    '.toc-target{scroll-margin-top:84px}' +
    /* Knopf oben rechts an der Fensterkante, dicht unter dem Header. Er ist
       vom ersten Moment an sichtbar, damit das Inhaltsverzeichnis auch im
       Hero direkt erreichbar ist. */
    '.page-toc{position:fixed;z-index:90;top:118px;right:1rem}' +
    '.page-toc__heading{display:none}' +
    '.page-toc__toggle{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;' +
      'background:var(--navy,#0c3f2d);color:#fff;border:2px solid #fff;border-radius:var(--radius,8px);' +
      'padding:.875rem 2rem;font-family:var(--font-base,inherit);font-size:.9375rem;font-weight:600;' +
      'cursor:pointer;box-shadow:var(--shadow,0 4px 12px rgba(0,0,0,.1));transition:all .2s}' +
    '.page-toc__toggle:hover{background:#12583f;transform:translateY(-1px)}' +
    '.page-toc__list{position:absolute;top:calc(100% + .5rem);right:0;width:min(300px,calc(100vw - 3rem));list-style:none;' +
      'margin:0;padding:.5rem;background:#fff;border-radius:var(--radius-lg,16px);' +
      'box-shadow:var(--shadow,0 4px 12px rgba(0,0,0,.1));max-height:45vh;overflow:auto;display:none}' +
    '.page-toc.is-open .page-toc__list{display:block}' +
    '.page-toc__list a{display:block;padding:.4rem .75rem;font-size:.875rem;color:var(--gray-600,#636363);' +
      'text-decoration:none;border-left:2px solid transparent;line-height:1.3;transition:color .15s,border-color .15s}' +
    '.page-toc__list a:hover{color:var(--text, #000000)}' +
    '.page-toc__list a.is-active{color:var(--text, #000000);border-left-color:var(--gold,#c2a990);font-weight:600}' +
    /* Ab 1500px ist der Seitenrand breit genug, dass der Knopf komplett
       neben der Textspalte steht. */
    '@media(min-width:1500px){' +
      '.page-toc{right:calc((100vw - var(--max-width,1200px))/2 - 9.5rem)}' +
    '}' +
    /* Auf schmalen Screens nur das Symbol -> weniger Platzbedarf */
    '@media(max-width:640px){' +
      '.page-toc__toggle{padding:.75rem}' +
      '.page-toc__label{display:none}' +
    '}';

  function injectStyles() {
    if (document.getElementById('page-toc-css')) return;
    var st = document.createElement('style');
    st.id = 'page-toc-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function slugify(s) {
    return String(s).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
  }

  function shorten(s) {
    s = s.replace(/\s+/g, ' ').trim();
    if (s.length <= MAX_LABEL) return s;
    var cut = s.slice(0, MAX_LABEL);
    var sp = cut.lastIndexOf(' ');
    return (sp > 12 ? cut.slice(0, sp) : cut) + '…';
  }

  // Unterblöcke, die inhaltlich eigene Abschnitte sind, aber in einer
  // gemeinsamen <section> stecken (z. B. Themengruppen der Ratgeber-Übersicht).
  var SUBBLOCKS = '.category-section';

  /* Ortsname der Seite (z. B. "Braunsfeld", "Brühl") aus der h1 ableiten.
     Er steckt in fast jeder Überschrift und macht die Einträge unnötig lang. */
  var pageOrt = null, ortResolved = false;
  function getOrt() {
    if (ortResolved) return pageOrt;
    ortResolved = true;
    var h1 = document.querySelector('h1');
    var t = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : '';
    var m = t.match(/Köln-([A-ZÄÖÜ][\wäöüß/-]*)/);
    if (m) { pageOrt = m[1]; return pageOrt; }
    m = t.match(/\bin ([A-ZÄÖÜ][\wäöüß-]+)\s*$/);
    if (m) pageOrt = m[1];
    return pageOrt;
  }

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /* Beschriftung: die echte Überschrift beschreibt den Abschnitt besser als
     das kurze .section-label ("Lokale Expertise" -> "Kölner Stadtteile").
     Reihenfolge h2 > h3 > .section-label; danach den Ortsnamen kürzen.
     Bleibt dabei ein Satzfragment übrig, gilt wieder das .section-label. */
  function labelFor(el) {
    /* Feste Beschriftung am <section data-toc="…"> hat Vorrang vor allem
       anderen — dort, wo weder Eyebrow noch Überschrift gut passen. */
    var fixed = el.getAttribute && el.getAttribute('data-toc');
    if (fixed && fixed.trim()) return fixed.replace(/\s+/g, ' ').trim();

    /* Auf Artikelseiten sind die Eintraege die Ueberschriften selbst. */
    if (/^H[2-3]$/.test(el.nodeName)) {
      return el.textContent.replace(/\s+/g, ' ').trim();
    }

    var labEl = el.querySelector('.section-label');
    var h2 = el.querySelector('h2');
    var h3 = el.querySelector('h3');
    var lab = labEl ? labEl.textContent.replace(/\s+/g, ' ').trim() : '';
    var raw = (h2 && h2.textContent.trim()) || (h3 && h3.textContent.trim()) || lab;
    if (!raw) return '';
    var r = raw.replace(/\s+/g, ' ').trim();
    var ort = getOrt();
    if (ort) {
      r = r.replace(new RegExp('\\s*\\b(?:in|von|für)\\s+Köln-' + esc(ort) + '\\b', 'g'), '');
      r = r.replace(new RegExp('\\s*Köln-' + esc(ort) + '\\b', 'g'), '');
      r = r.replace(new RegExp('\\s*\\b(?:in|von|für)\\s+' + esc(ort) + '\\b', 'g'), '');
    }
    r = r.replace(/\s{2,}/g, ' ').replace(/^[\s–—,-]+|[\s–—,-]+$/g, '');
    /* Zu kurz oder mit Kleinbuchstaben beginnend = Fragment -> Label nehmen */
    if (r.length < 6 || (/^[a-zäöüß]/.test(r) && lab)) r = lab || raw;
    return r.replace(/\s+/g, ' ').trim();
  }

  function add(out, used, el, index) {
    /* data-toc="-" blendet einen Abschnitt aus dem Verzeichnis aus, z. B. wenn
       er inhaltlich unter dem Eintrag darueber steckt. */
    var optOut = el.getAttribute && el.getAttribute('data-toc');
    if (optOut === '-' || optOut === 'none') return;

    var raw = labelFor(el);
    if (!raw) return;

    var id = el.id;
    if (!id) {
      id = slugify(raw) || ('abschnitt-' + index);
      if (used[id] || document.getElementById(id)) id = id + '-' + index;
      el.id = id;
    }
    if (used[id]) return;
    /* Gleiche Beschriftung zweimal (h2 im Artikel + eigene Section) waere ein
       Doppeleintrag - der erste gewinnt. */
    var key = 'l:' + raw.toLowerCase();
    if (used[key]) return;
    used[key] = true;
    used[id] = true;
    el.classList.add('toc-target');
    out.push({ id: id, label: shorten(raw), el: el });
  }

  function collect() {
    var out = [], used = {};

    /* Artikelseiten (Ratgeber) haben ihren Text in einem einzigen Container -
       dort sind die h2 die Abschnitte, nicht die <section>-Bloecke. Ohne das
       listet das Inhaltsverzeichnis nur die 2-3 Rahmen-Sections. */
    var article = document.querySelector('.article-content');
    if (article) {
      var heads = article.querySelectorAll('h2');
      for (var a = 0; a < heads.length; a++) add(out, used, heads[a], 'a' + a);
    }

    var sections = document.querySelectorAll('section');

    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (sec.classList.contains('hero')) continue;
      if (sec.classList.contains('article-hero')) continue;
      // verschachtelte Sections überspringen
      if (sec.parentElement && sec.parentElement.closest('section')) continue;

      // Enthält die Section eigenständige Unterblöcke? Dann diese listen.
      var subs = sec.querySelectorAll(SUBBLOCKS);
      if (subs.length) {
        for (var j = 0; j < subs.length; j++) add(out, used, subs[j], i + '-' + j);
        continue;
      }
      add(out, used, sec, i);
    }
    return out;
  }

  function build(items) {
    var nav = document.createElement('nav');
    nav.className = 'page-toc';
    nav.id = 'pageToc';
    nav.setAttribute('aria-label', 'Seiteninhalt');

    var btn = document.createElement('button');
    btn.className = 'page-toc__toggle';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'pageTocList');
    /* Beschriftung nach der Dokumentsprache — /en/ ist sonst der einzige
       deutsche Text auf einer englischen Seite. */
    var isEN = /^en/i.test(document.documentElement.lang || '');
    btn.innerHTML = '<span aria-hidden="true">☰</span><span class="page-toc__label">'
      + (isEN ? 'Contents' : 'Inhalt') + '</span>';
    btn.setAttribute('aria-label', isEN ? 'Contents' : 'Inhalt');

    var head = document.createElement('p');
    head.className = 'page-toc__heading';
    head.textContent = 'Auf dieser Seite';

    var ul = document.createElement('ul');
    ul.className = 'page-toc__list';
    ul.id = 'pageTocList';

    items.forEach(function (it) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + it.id;
      a.textContent = it.label;
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(btn);
    nav.appendChild(head);
    nav.appendChild(ul);
    document.body.appendChild(nav);
    document.body.classList.add('page-toc-on');

    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var links = Array.prototype.slice.call(ul.querySelectorAll('a'));
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    function spy() {
      var pos = window.pageYOffset + 120, idx = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].el.offsetTop <= pos) idx = i;
      }
      links.forEach(function (a, i) { a.classList.toggle('is-active', i === idx); });
    }
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  }

  function init() {
    if (document.getElementById('pageToc')) return;
    var items = collect();
    if (items.length < MIN_ENTRIES) return;
    injectStyles();
    build(items);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
