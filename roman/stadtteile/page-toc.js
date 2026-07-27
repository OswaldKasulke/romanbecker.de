/*
 * page-toc.js — schwebende Sektions-Übersicht ("Inhalt")
 *
 * Baut auf jeder Seite automatisch ein Inhaltsverzeichnis aus deren eigenen
 * <section>-Blöcken. Kein seitenspezifisches Markup nötig: Label kommt aus
 * .section-label (kurz) bzw. ersatzweise aus der h2. Fehlende IDs werden
 * ergänzt. Styles stehen in shared.css (.page-toc*).
 */
(function () {
  'use strict';

  var MIN_ENTRIES = 3;
  var MAX_LABEL = 28;

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

  function add(out, used, el, index) {
    var label = el.querySelector('.section-label');
    var h2 = el.querySelector('h2');
    var raw = label ? label.textContent : (h2 ? h2.textContent : '');
    if (!raw || !raw.trim()) return;

    var id = el.id;
    if (!id) {
      id = slugify(raw) || ('abschnitt-' + index);
      if (used[id] || document.getElementById(id)) id = id + '-' + index;
      el.id = id;
    }
    if (used[id]) return;
    used[id] = true;
    el.classList.add('toc-target');
    out.push({ id: id, label: shorten(raw), el: el });
  }

  function collect() {
    var out = [], used = {};
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
    btn.innerHTML = '<span aria-hidden="true">☰</span> Inhalt';

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
    build(items);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
