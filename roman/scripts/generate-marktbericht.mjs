#!/usr/bin/env node
/**
 * generate-marktbericht.mjs
 * Generiert roman/marktanalyse/koeln-qN-YYYY.html (aktuelles Quartal automatisch)
 * Plus roman/marktanalyse/index.html mit chronologischer Liste aller Berichte
 * Plus Sitemap-Update (fügt neuen Bericht hinzu, falls noch nicht vorhanden)
 *
 * Datenquellen:
 *   1. stadtteile-data.mjs (80 Stadtteile)
 *   2. Extraktion aus 6 existierenden Stadtteil-HTMLs (Sülz, Lindenthal, Nippes, Rodenkirchen, Bilderstöckchen, Zollstock)
 *
 * Wird quartalsweise per GitHub Actions Cron ausgeführt (.github/workflows/update-marktbericht.yml)
 */

import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// === Aktuelles Quartal & Datenstand-Quartal automatisch berechnen ===
const now = new Date();
const REPORT_Q = Math.ceil((now.getMonth() + 1) / 3);  // 1-4
const REPORT_Y = now.getFullYear();
const DATA_Q = REPORT_Q === 1 ? 4 : REPORT_Q - 1;
const DATA_Y = REPORT_Q === 1 ? REPORT_Y - 1 : REPORT_Y;
// Slug ist festgenagelt und folgt dem Berichtsjahr, nicht dem Quartal: der
// Bericht speist sich seit 20.08.2026 aus dem jaehrlichen
// Grundstuecksmarktbericht. Alte Quartals-URLs zeigen per 301 hierher.
const FILE_SLUG = 'marktanalyse';
const REPORT_LABEL = '2026';
const DATA_LABEL = 'Grundstuecksmarktbericht 2026';
const QUELLE = 'Grundstücksmarktbericht 2026 für die Stadt Köln, Kapitel 6.1 (Eigentumswohnungen, Weiterverkauf) und 5.1.2 (Häuser nach Typ)';
const TEMP_COV = `${DATA_Y}-Q${DATA_Q}/${REPORT_Y}-Q${REPORT_Q}`;
const REPORT_URL = `https://romanbecker.de/ratgeber/${FILE_SLUG}.html`;

const stadtteile = (await import('./stadtteile-data.mjs')).default;

// Extrahiere Marktdaten aus existierenden Stadtteil-HTMLs (die nicht in stadtteile-data.mjs sind)
const EXISTING_SLUGS = [
  {s: 'suelz', n: 'Sülz', b: 3, bn: 'Lindenthal', nr: 304},
  {s: 'lindenthal', n: 'Lindenthal', b: 3, bn: 'Lindenthal', nr: 301},
  {s: 'nippes', n: 'Nippes', b: 5, bn: 'Nippes', nr: 503},
  {s: 'rodenkirchen', n: 'Rodenkirchen', b: 2, bn: 'Rodenkirchen', nr: 207},
  {s: 'bilderstoeckchen', n: 'Bilderstöckchen', b: 5, bn: 'Nippes', nr: 504},
  {s: 'zollstock', n: 'Zollstock', b: 2, bn: 'Rodenkirchen', nr: 209},
];

// Alle Werte stammen aus den Stadtteilseiten. Dort stehen sie mit Quellenangabe
// (Grundstuecksmarktbericht der Stadt Koeln). Aus stadtteile-data.mjs wird nur
// noch die Identitaet gelesen - Name, Slug, Bezirk, Sortiernummer.
const LABELS = [
  [/Eigentumswohnung/, 'e'],
  [/Haus \(Reihenmittelhaus\)/, 'rmh'],
  [/Haus \(Doppelhaush/, 'dhh'],
  [/Haus \(freistehend\)/, 'efh'],
];

function extractMarketData(slug) {
  const path = join(ROOT, 'stadtteile', slug + '.html');
  if (!existsSync(path)) return null;
  const html = readFileSync(path, 'utf-8');
  const valuePattern = /<div class="market-stat__value">([^<]+)<\/div>\s*<div class="market-stat__label">([^<]+(?:<br>[^<]+)*)<\/div>/g;
  const stats = {};
  let m;
  while ((m = valuePattern.exec(html)) !== null) {
    const label = m[2].replace(/<br>/g, ' ').trim();
    const value = m[1].replace(/[~€\s]/g, '').trim();
    if (!/^[\d.]+$/.test(value)) continue;           // nur echte Preisangaben
    for (const [re, key] of LABELS) {
      if (re.test(label) && !stats[key]) { stats[key] = value; break; }
    }
  }
  return stats;
}

const all = [];
const ohneZahlen = [];
const IDENT = [
  ...stadtteile.map(d => ({n: d.n, s: d.s, b: d.b, bn: d.bn, nr: d.nr})),
  ...EXISTING_SLUGS,
];
for (const meta of IDENT) {
  const data = extractMarketData(meta.s);
  if (!data) { console.warn('Seite fehlt:', meta.s); continue; }
  if (!data.e && !data.rmh && !data.dhh && !data.efh) { ohneZahlen.push(meta.n); continue; }
  all.push({
    n: meta.n, s: meta.s, b: meta.b, bn: meta.bn, nr: meta.nr,
    e: data.e || '—', rmh: data.rmh || '—', dhh: data.dhh || '—', efh: data.efh || '—',
  });
}
if (ohneZahlen.length) console.warn('Ohne belegte Werte, nicht aufgenommen:', ohneZahlen.join(', '));

all.sort((a, b) => a.b - b.b || a.nr - b.nr);

const num = s => {
  if (!s || s === '—' || s === '-') return null;
  const n = parseFloat(String(s).replace(/\./g, '').replace(',', '.').replace(/[^0-9.\-+]/g, ''));
  return isNaN(n) ? null : n;
};

const withE = all.filter(x => num(x.e) !== null);
const top5Teuer = [...withE].sort((a, b) => num(b.e) - num(a.e)).slice(0, 5);
const top5Guenstig = [...withE].sort((a, b) => num(a.e) - num(b.e)).slice(0, 5);
const withH = all.filter(x => num(x.rmh) !== null);
const top5Haus = [...withH].sort((a, b) => num(b.rmh) - num(a.rmh)).slice(0, 5);

const byBezirk = {};
for (const x of all) {
  if (!byBezirk[x.bn]) byBezirk[x.bn] = {bn: x.bn, b: x.b, items: [], avgE: null};
  byBezirk[x.bn].items.push(x);
}
for (const bz of Object.values(byBezirk)) {
  const es = bz.items.map(x => num(x.e)).filter(v => v !== null);
  bz.avgE = es.length ? Math.round(es.reduce((a, b) => a + b, 0) / es.length) : null;
  bz.nE = es.length;
}
const bezirke = Object.values(byBezirk).sort((a, b) => a.b - b.b);

const datasetItems = withE.map(x => ({
  "@type": "PropertyValue",
  "name": x.n,
  "value": x.e,
  "unitText": "EUR/m²",
  "description": `Durchschnittlicher Kaufpreis pro m² Eigentumswohnung in Köln-${x.n} laut ${QUELLE}`
}));

const today = new Date().toISOString().slice(0, 10);
const cell = v => v === '—' ? '—' : '~' + v + ' €';
const buildRow = (x) => `        <tr>
          <td><a href="/stadtteile/${x.s}.html">Köln-${x.n}</a></td>
          <td>${x.bn}</td>
          <td class="num">${cell(x.e)}</td>
          <td class="num">${cell(x.rmh)}</td>
          <td class="num">${cell(x.dhh)}</td>
          <td class="num">${cell(x.efh)}</td>
        </tr>`;

const buildBezirkRow = bz => `        <tr>
          <td><strong>${bz.bn}</strong></td>
          <td class="num">${bz.nE}</td>
          <td class="num">${bz.avgE ? '~' + bz.avgE.toLocaleString('de-DE') + ' €' : '—'}</td>
        </tr>`;

const bezirkRows = bezirke.map(buildBezirkRow).join('\n');

const top5Rows = (list, valueKey, unit) => list.map((x, i) => `          <li><strong>${i + 1}. Köln-${x.n}</strong> <span class="muted">(${x.bn})</span> — ${x[valueKey]}${unit}</li>`).join('\n');

const tableRows = all.map(buildRow).join('\n');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google Analytics (nur nach Einwilligung) -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500
    });
    function loadAnalytics() {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-HQXZQF4ZBN';
      document.head.appendChild(s);
      gtag('js', new Date());
      gtag('consent', 'update', { analytics_storage: 'granted' });
      gtag('config', 'G-HQXZQF4ZBN');
    }
    if (localStorage.getItem('cookie_consent') === 'granted') {
      loadAnalytics();
    }
  </script>
  <!-- GA4 Event-Tracking: Telefon, E-Mail, WhatsApp, Formular -->
  <script>
    (function() {
      function track(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params || {});
      }
      document.addEventListener('click', function(e) {
        var a = e.target.closest && e.target.closest('a');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (href.indexOf('tel:') === 0) {
          track('click_phone', { phone_number: href.replace('tel:', '') });
        } else if (href.indexOf('mailto:') === 0) {
          track('click_email', { email_address: href.replace('mailto:', '').split('?')[0] });
        } else if (/wa\\.me|api\\.whatsapp\\.com|chat\\.whatsapp\\.com/.test(href)) {
          track('click_whatsapp');
        }
      }, true);
      document.addEventListener('submit', function(e) {
        var f = e.target;
        if (!f || f.nodeName !== 'FORM') return;
        track('generate_lead', {
          form_id: f.id || 'unknown',
          form_destination: f.action || '',
          page_path: location.pathname
        });
      }, true);
    })();
  </script>

  <title>Immobilienmarkt Köln ${REPORT_LABEL} — amtliche Kaufpreise nach Stadtteilen</title>
  <meta name="description" content="Durchschnittliche Kaufpreise pro m² für Eigentumswohnungen und Häuser in ${all.length} Kölner Stadtteilen — vollständig aus dem Grundstücksmarktbericht der Stadt Köln.">
  <link rel="canonical" href="${REPORT_URL}">
  <meta property="og:title" content="Immobilienmarkt Köln ${REPORT_LABEL} — amtliche Kaufpreise nach Stadtteilen">
  <meta property="og:description" content="Amtliche Kaufpreise für Eigentumswohnungen und Häuser in den Kölner Stadtteilen, aus dem Grundstücksmarktbericht der Stadt Köln.">
  <meta property="og:url" content="${REPORT_URL}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="de_DE">
<link rel="icon" href="https://romanbecker.de/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="https://romanbecker.de/favicon.ico" sizes="any">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../stadtteile/shared.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Kaufpreise nach Stadtteilen, Köln ${REPORT_LABEL}",
    "description": "Durchschnittliche Kaufpreise pro Quadratmeter für Eigentumswohnungen und Häuser in ${all.length} Kölner Stadtteilen, Quelle: ${QUELLE}.",
    "url": "${REPORT_URL}",
    "dateModified": "${today}",
    "creator": {"@type": "Person", "name": "Roman Becker"},
    "spatialCoverage": {"@type": "Place", "name": "Köln"},
    "variableMeasured": ${JSON.stringify(datasetItems)}
  }
  </script>
<style>
    .article-content { max-width: 800px; }
    .article-content h2 { font-family: var(--font-heading); font-size: 1.5rem; margin: 2rem 0 0.75rem; color: var(--text, #000000); }
    .article-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: var(--text, #000000); }
    .article-content p { color: var(--gray-600); line-height: 1.75; margin-bottom: 1rem; }
    .article-content ul, .article-content ol { color: var(--gray-600); line-height: 1.75; margin: 0 0 1rem 1.5rem; }
    .article-content li { margin-bottom: 0.4rem; }
    .article-content strong { color: var(--text, #000000); font-weight: 600; }
    .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .highlight-box { background: #fffbf0; border-left: 4px solid var(--gold); padding: 1rem 1.25rem; margin: 1.5rem 0; border-radius: 0 var(--radius) var(--radius) 0; }
    .highlight-box p { margin: 0; color: var(--text, #000000); }
    .article-hero { background: var(--navy); color: var(--white); padding: var(--space-16) 0 var(--space-12); }
    .article-hero h1 { font-family: var(--font-heading); font-size: clamp(1.75rem, 4vw, 2.75rem); margin-bottom: var(--space-4); color: var(--white); }
    .article-hero p { color: var(--gold-light); font-size: 1.1rem; max-width: 650px; }
    .ratgeber-nav { margin-top: var(--space-8); padding: var(--space-6); background: var(--gray-100); border-radius: var(--radius); }
    .ratgeber-nav h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-600); margin-bottom: var(--space-4); }
    .ratgeber-nav-links { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .ratgeber-nav-links a { font-size: 0.85rem; color: var(--gray-600); text-decoration: none; padding: 0.25rem 0.6rem; border: 1px solid var(--gray-200); border-radius: 4px; }
    .ratgeber-nav-links a:hover { background: var(--gold); color: var(--white); border-color: var(--gold); }
    h2 { font-size: 2rem; font-weight: 500; line-height: 1.2; }
  </style>
</head>
</head>
<body>

  <!-- HEADER -->
  <header class="site-header">
    <div class="container">
      <div class="site-header__inner">
        <a href="https://romanbecker.de/" class="site-header__logo"><span class="site-header__logo-primary">Roman Becker Immobilien <span class="site-header__logo-tag">(START)</span></span><span class="site-header__logo-sub">Immobilienmakler &amp; Immobilienbewertung Köln</span></a>
        <nav class="site-header__nav" aria-label="Hauptnavigation">
          <a href="https://romanbecker.de/leistungen.html">Leistungen</a>
          <a href="https://romanbecker.de/stadtteile/">Stadtteile</a>
          <a href="https://romanbecker.de/ratgeber/">Ratgeber</a>
          <a href="https://romanbecker.de/immobilienbewertung.html">Sofort-Immobilienbewertung</a>
          <a href="https://romanbecker.de/#kontakt">Kontakt</a>
        </nav>
        <div class="nav__search" id="navSearch">
          <input class="nav__search-input" id="navSearchInput" type="text" placeholder="" autocomplete="off" aria-label="Suche">
          <button class="nav__search-btn" id="navSearchBtn" aria-label="Suche öffnen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
          <div class="nav__search-dropdown" id="navSearchDropdown"></div>
        </div>
        <a href="tel:+491775156969" class="site-header__cta">+49 177 515 69 69</a>
      </div>
    </div>
  </header>

  <main>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="https://romanbecker.de/">Start</a>
        <span>›</span>
        <a href="https://romanbecker.de/ratgeber/">Ratgeber</a>
        <span>›</span>
        Immobilienmarkt Köln ${REPORT_LABEL}
      </nav>
    </div>

    <section class="article-hero">
      <div class="container">
        <div class="hero__badge">✓ Immobilienwissen von Roman Becker · Makler Köln</div>
        <h1>Immobilienmarkt Köln ${REPORT_LABEL} — amtliche Kaufpreise nach Stadtteilen</h1>
        <p>Durchschnittliche Kaufpreise für Eigentumswohnungen und Häuser in ${all.length} Kölner Stadtteilen, vollständig aus dem Grundstücksmarktbericht der Stadt Köln übernommen.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="article-content">

          <h2>Auf einen Blick</h2>
          <p><strong>Die fünf teuersten Lagen für Eigentumswohnungen</strong></p>
          <ol>
${top5Teuer.map(x => `            <li><a href="/stadtteile/${x.s}.html">Köln-${x.n}</a> (${x.bn}) — rund ${x.e} €/m²</li>`).join('\n')}
          </ol>
          <p><strong>Die fünf günstigsten Lagen für Eigentumswohnungen</strong></p>
          <ol>
${top5Guenstig.map(x => `            <li><a href="/stadtteile/${x.s}.html">Köln-${x.n}</a> (${x.bn}) — rund ${x.e} €/m²</li>`).join('\n')}
          </ol>
          <p><strong>Die fünf teuersten Lagen für Reihenmittelhäuser</strong></p>
          <ol>
${top5Haus.map(x => `            <li><a href="/stadtteile/${x.s}.html">Köln-${x.n}</a> (${x.bn}) — rund ${x.rmh} €/m²</li>`).join('\n')}
          </ol>

          <div class="highlight-box">
            <p><strong>Woher die Zahlen stammen:</strong> Alle Werte auf dieser Seite sind dem ${QUELLE} entnommen. Eine Veränderungsrate gegenüber dem Vorjahr enthält der Bericht auf Stadtteilebene nicht — die Quartalsberichte des Gutachterausschusses gelten jeweils für einen ganzen Stadtbezirk.</p>
          </div>

          <h2>Übersicht nach Stadtbezirk</h2>
          <p>Der Durchschnitt je Bezirk, gebildet aus den Stadtteilen mit ausgewiesenem Wohnungspreis.</p>
          <div class="table-scroll">
          <table class="cost-table">
            <thead><tr><th>Bezirk</th><th>Stadtteile</th><th>Ø Kaufpreis ETW</th></tr></thead>
            <tbody>
${bezirkRows}
            </tbody>
          </table>
          </div>

          <h2>Alle Stadtteile im Detail</h2>
          <p>Kaufpreise pro Quadratmeter. Ein Klick auf den Stadtteil führt zur Detailseite mit Markt- und Lageportrait.</p>
          <div class="table-scroll">
          <table class="cost-table">
            <thead><tr><th>Stadtteil</th><th>Bezirk</th><th>ETW</th><th>Reihenmittelhaus</th><th>Doppelhaushälfte</th><th>freistehend</th></tr></thead>
            <tbody>
${tableRows}
            </tbody>
          </table>
          </div>

          <h2>Methodik und Datenquelle</h2>
          <p>Grundlage ist der ${QUELLE}. Eigentumswohnungen stammen aus Kapitel 6.1 (Weiterverkauf), Häuser aus Kapitel 5.1.2, jeweils als Durchschnitt je Stadtteil. Ein Strich bedeutet, dass der Bericht für diesen Stadtteil und diesen Objekttyp keine Auswertung enthält — meist wegen zu weniger Kauffälle.</p>
          <p>Die Werte sind Durchschnitte. Der Preis einer einzelnen Immobilie weicht davon je nach Lage, Baujahr, Zustand, Ausstattung und Energieeffizienz erheblich ab. Für eine Einschätzung Ihrer Immobilie sprechen Sie mich an.</p>

        </div>
      </div>
    </section>

<section class="section section--gray">
    <div class="container">
      <div class="cta-box">
        <span class="section-label">Persönliche Beratung</span>
        <h2>Fragen zu Ihrer Dom-Stadt Immobilie?</h2>
        <p>Ich berate Sie persönlich, unverbindlich und diskret. Als IHK-zertifizierter Immobilienmakler in Köln stehe ich für marktgerechte Bewertung und professionelle Vermarktung.</p>
        <div class="cta-buttons">
          <a href="https://romanbecker.de/immobilienbewertung.html" class="btn btn--primary">Kostenlose Immobilienbewertung</a>
          <a href="tel:+491775156969" class="btn btn--white-outline">+49 177 515 69 69</a>
        </div>
      </div>
    </div>
  </section>
  </main>

<section class="section">
    <div class="container">
      <div class="ratgeber-nav">
        <h3>Weitere Ratgeber-Themen</h3>
        <div class="ratgeber-nav-links">
          <a href="https://romanbecker.de/ratgeber/grundstuecksmarktbericht-koeln.html">Grundstücksmarktbericht Köln</a>
          <a href="https://romanbecker.de/ratgeber/mietspiegel.html">Mietspiegel</a>
          <a href="https://romanbecker.de/ratgeber/immobilienverkauf.html">Immobilienverkauf</a>
          <a href="https://romanbecker.de/ratgeber/kapitalanlage.html">Kapitalanlage</a>
          <a href="https://romanbecker.de/ratgeber/wohnflaechenberechnung.html">Wohnflächenberechnung</a>
          <a href="https://romanbecker.de/ratgeber/restnutzungsdauer.html">Restnutzungsdauer</a>
          <a href="https://romanbecker.de/ratgeber/kaufnebenkosten.html">Kaufnebenkosten</a>
          <a href="https://romanbecker.de/ratgeber/spekulationssteuer.html">Spekulationssteuer</a>
        </div>
      </div>
    </div>
  </section>
  <!-- FOOTER -->
  <footer id="footer" class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__brand">
          <strong>Immobilienmakler &amp; Immobilienbewertung Köln</strong>
          <span>© 2026 Roman Becker Immobilien</span>
          <address>Kaiser-Wilhelm-Ring 17-21, 50672 Köln</address>
        </div>
        <div class="footer__links">
          <a href="https://romanbecker.de/immobilienbewertung.html">Immobilienbewertung</a>
          <a href="https://romanbecker.de/ratgeber/grundstuecksmarktbericht-koeln.html">Grundstücksmarktbericht Köln</a>
          <a href="https://romanbecker.de/datenschutz.html">Datenschutz</a>
          <a href="https://romanbecker.de/impressum.html">Impressum</a>
          <a href="https://romanbecker.de/agb.html">AGB</a>
          <a href="https://www.instagram.com/roman_becker_immobilien/" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <p class="footer__disclaimer">
        Roman Becker ist als Immobilienmakler für Köln &amp; das Rheinland tätig. Alle Preisangaben unverbindlich. Irrtümer und Änderungen vorbehalten. Marktdaten und Preisspannen sind Richtwerte und stellen keine Kaufpreisgarantie dar.
      </p>
    </div>
  </footer>

  <!-- MOBILE CALL BUTTON -->
  <a href="tel:+491775156969" class="mobile-cta" aria-label="Jetzt anrufen">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.15 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  </a>

  <script src="../stadtteile/search.js" defer></script>
  <script src="../stadtteile/page-toc.js" defer></script>
</body>
</html>`;

// Die Uebersichtsseite /marktanalyse/ wurde am 14.08.2026 entfernt und per 301
// auf den Ratgeber-Artikel umgebogen. Das zugehoerige Template ist am 21.08.2026
// geloescht worden - es wurde seither nicht mehr geschrieben und referenzierte
// Variablen, die es nicht mehr gibt.

// === Bericht schreiben ===
const outDir = join(ROOT, 'ratgeber');
if (!existsSync(outDir)) mkdirSync(outDir, {recursive: true});
const outPath = join(outDir, FILE_SLUG + '.html');
writeFileSync(outPath, html);
console.log(`\u2713 Generated ${outPath}`);
console.log(`  Stadtteile: ${all.length}`);

// === Sitemap automatisch ergänzen falls neuer Bericht ===
const sitemapPath = join(ROOT, 'sitemap.xml');
let sitemap = readFileSync(sitemapPath, 'utf-8');
const newUrl = `<loc>${REPORT_URL}</loc>`;
if (!sitemap.includes(newUrl)) {
  const newEntry = `  <url><loc>${REPORT_URL}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n`;
  sitemap = sitemap.replace('</urlset>', newEntry + '</urlset>');
  writeFileSync(sitemapPath, sitemap);
  console.log(`✓ Sitemap updated with new report URL`);
} else {
  console.log(`  (Sitemap already contains ${REPORT_URL})`);
}

// Index-URL nicht mehr in die Sitemap - die Uebersichtsseite gibt es nicht mehr.
