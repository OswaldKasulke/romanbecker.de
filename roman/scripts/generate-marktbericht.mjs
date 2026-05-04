#!/usr/bin/env node
/**
 * generate-marktbericht.mjs
 * Generiert roman/marktanalyse/koeln-q2-2026.html
 * Datenquellen:
 *   1. stadtteile-data.mjs (80 Stadtteile)
 *   2. Extraktion aus 6 existierenden Stadtteil-HTMLs (Sülz, Lindenthal, Nippes, Rodenkirchen, Bilderstöckchen, Zollstock)
 *
 * Output: HTML-Marktbericht mit Aggregat-Tabelle, Top/Bottom-Listen, Schema.org Article+Dataset
 */

import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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

function extractMarketData(slug) {
  const path = join(ROOT, 'stadtteile', slug + '.html');
  if (!existsSync(path)) return null;
  const html = readFileSync(path, 'utf-8');

  // Pattern: <div class="market-stat__value">~6.100 €</div><div class="market-stat__label">Kaufpreis pro m²<br>Eigentumswohnung</div>
  // Wir matchen value + label paarweise
  const valuePattern = /<div class="market-stat__value">([^<]+)<\/div>\s*<div class="market-stat__label">([^<]+(?:<br>[^<]+)?)<\/div>/g;
  const stats = {};
  let m;
  while ((m = valuePattern.exec(html)) !== null) {
    const label = m[2].replace(/<br>/g, ' ').trim();
    const value = m[1].replace(/[~€\s]/g, '').replace(/–/g, '-').trim();
    if (label.includes('Eigentumswohnung')) stats.e = value;
    else if (label.includes('Haus')) stats.h = value;
    else if (label.includes('Miete') || label.includes('Kaltmiete')) stats.m = value;
    else if (label.includes('Trend') || label.includes('Jahresvergleich')) stats.t = value;
  }
  return stats;
}

// Baue komplette Liste aller Stadtteile mit Marktdaten
const all = [];

for (const d of stadtteile) {
  if (!d.mk) continue;
  all.push({
    n: d.n, s: d.s, b: d.b, bn: d.bn, nr: d.nr,
    e: d.mk.e, h: d.mk.h, m: d.mk.m, t: d.mk.t,
  });
}

for (const meta of EXISTING_SLUGS) {
  const data = extractMarketData(meta.s);
  if (!data) {
    console.warn('Keine Daten gefunden für:', meta.s);
    continue;
  }
  all.push({
    n: meta.n, s: meta.s, b: meta.b, bn: meta.bn, nr: meta.nr,
    e: data.e || '—', h: data.h || '—', m: data.m || '—', t: data.t || '—',
  });
}

// Sortiere nach Bezirk-Nr, dann Stadtteil-Nr
all.sort((a, b) => a.b - b.b || a.nr - b.nr);

// Hilfsfunktionen
const num = s => {
  if (!s || s === '—' || s === '-') return null;
  const n = parseFloat(String(s).replace(/\./g, '').replace(',', '.').replace(/[^0-9.\-+]/g, ''));
  return isNaN(n) ? null : n;
};

// Top-Listen (sortiert nach ETW-Preis)
const withE = all.filter(x => num(x.e) !== null);
const top5Teuer = [...withE].sort((a, b) => num(b.e) - num(a.e)).slice(0, 5);
const top5Guenstig = [...withE].sort((a, b) => num(a.e) - num(b.e)).slice(0, 5);

// Top Trends
const withT = all.filter(x => num(x.t) !== null);
const top5Trend = [...withT].sort((a, b) => num(b.t) - num(a.t)).slice(0, 5);

// Bezirks-Aggregate
const byBezirk = {};
for (const x of all) {
  if (!byBezirk[x.bn]) byBezirk[x.bn] = {bn: x.bn, b: x.b, items: [], avgE: null, avgT: null};
  byBezirk[x.bn].items.push(x);
}
for (const bz of Object.values(byBezirk)) {
  const es = bz.items.map(x => num(x.e)).filter(v => v !== null);
  const ts = bz.items.map(x => num(x.t)).filter(v => v !== null);
  bz.avgE = es.length ? Math.round(es.reduce((a, b) => a + b, 0) / es.length) : null;
  bz.avgT = ts.length ? +(ts.reduce((a, b) => a + b, 0) / ts.length).toFixed(1) : null;
}
const bezirke = Object.values(byBezirk).sort((a, b) => a.b - b.b);

// JSON-LD Dataset
const datasetItems = all.map(x => ({
  "@type": "PropertyValue",
  "name": x.n,
  "value": x.e,
  "unitText": "EUR/m²",
  "description": `Durchschnittlicher Kaufpreis pro m² Eigentumswohnung in Köln-${x.n} (Stand Q1/2026, veröffentlicht Q2/2026)`
}));

// HTML-Generator
const today = new Date().toISOString().slice(0, 10);
const buildRow = (x) => {
  const trend = num(x.t);
  const trendClass = trend === null ? '' : trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : '';
  const trendStr = x.t === '—' ? '—' : (x.t.startsWith('+') || x.t.startsWith('-') ? x.t : '+' + x.t) + ' %';
  return `        <tr>
          <td><a href="/stadtteile/${x.s}.html">Köln-${x.n}</a></td>
          <td>${x.bn}</td>
          <td class="num">${x.e === '—' ? '—' : '~' + x.e + ' €'}</td>
          <td class="num">${x.h === '—' ? '—' : '~' + x.h + ' €'}</td>
          <td class="num">${x.m === '—' ? '—' : x.m + ' €'}</td>
          <td class="num ${trendClass}">${trendStr}</td>
        </tr>`;
};

const tableRows = all.map(buildRow).join('\n');

const buildBezirkRow = bz => `        <tr>
          <td><strong>${bz.bn}</strong></td>
          <td class="num">${bz.items.length}</td>
          <td class="num">${bz.avgE ? '~' + bz.avgE.toLocaleString('de-DE') + ' €' : '—'}</td>
          <td class="num">${bz.avgT !== null ? (bz.avgT > 0 ? '+' : '') + bz.avgT + ' %' : '—'}</td>
        </tr>`;

const bezirkRows = bezirke.map(buildBezirkRow).join('\n');

const top5Rows = (list, valueKey, unit) => list.map((x, i) => `          <li><strong>${i + 1}. Köln-${x.n}</strong> <span class="muted">(${x.bn})</span> — ${x[valueKey]}${unit}</li>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Immobilienmarkt Köln Q2/2026 — Preisanalyse 86 Stadtteile | Roman Becker</title>
  <meta name="description" content="Roman Becker - EVERNEST | Immobilienmarkt-Analyse Köln Q2/2026: durchschnittliche Kaufpreise (€/m²) für Eigentumswohnungen, Häuser, Mietpreise und Jahres-Trends in 86 Kölner Stadtteilen.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://romanbecker.de/marktanalyse/koeln-q2-2026.html">

  <meta property="og:title" content="Immobilienmarkt Köln Q2/2026 — Preisanalyse 86 Stadtteile">
  <meta property="og:description" content="Aktuelle Kaufpreise, Mietpreise und Marktrends in allen Kölner Stadtteilen — datierte Analyse von Roman Becker (EVERNEST).">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://romanbecker.de/marktanalyse/koeln-q2-2026.html">
  <meta property="og:locale" content="de_DE">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Immobilienmarkt Köln Q2/2026 — Preisanalyse 86 Stadtteile">
  <meta name="twitter:description" content="Aktuelle Kaufpreise, Mietpreise und Marktrends in allen Kölner Stadtteilen.">

  <link rel="icon" href="https://romanbecker.de/favicon.svg" type="image/svg+xml">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Immobilienmarkt Köln Q2/2026 — Preisanalyse 86 Stadtteile",
        "description": "Quartalsweise aktualisierte Marktanalyse für den Kölner Immobilienmarkt: durchschnittliche Kaufpreise pro m², Mietpreise und Jahres-Trends in allen 86 Stadtteilen Kölns.",
        "datePublished": "${today}",
        "dateModified": "${today}",
        "inLanguage": "de-DE",
        "author": {
          "@type": "Person",
          "name": "Roman Becker",
          "jobTitle": "Immobilienmakler (IHK)",
          "url": "https://romanbecker.de"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Roman Becker - EVERNEST",
          "url": "https://romanbecker.de"
        },
        "url": "https://romanbecker.de/marktanalyse/koeln-q2-2026.html",
        "mainEntityOfPage": "https://romanbecker.de/marktanalyse/koeln-q2-2026.html",
        "about": [
          {"@type": "Thing", "name": "Immobilienmarkt Köln"},
          {"@type": "Place", "name": "Köln", "@id": "https://www.wikidata.org/wiki/Q365"}
        ],
        "keywords": "Immobilienpreise Köln, Marktbericht Köln 2026, Immobilienmarkt Köln, Kaufpreise Köln, Mietpreise Köln, Stadtteil-Analyse Köln"
      },
      {
        "@type": "Dataset",
        "name": "Immobilien-Marktdaten Köln Q2/2026",
        "description": "Durchschnittliche Kaufpreise (€/m²) für Eigentumswohnungen in 86 Kölner Stadtteilen, Stand Q1/2026.",
        "url": "https://romanbecker.de/marktanalyse/koeln-q2-2026.html",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": {
          "@type": "Person",
          "name": "Roman Becker"
        },
        "spatialCoverage": {
          "@type": "Place",
          "name": "Köln, Nordrhein-Westfalen, Deutschland",
          "@id": "https://www.wikidata.org/wiki/Q365"
        },
        "temporalCoverage": "2026-Q1/2026-Q2",
        "datePublished": "${today}",
        "dateModified": "${today}",
        "keywords": ["Immobilienpreise", "Kölner Stadtteile", "Kaufpreis pro m²", "Marktrend"],
        "variableMeasured": ${JSON.stringify(datasetItems.slice(0, 20), null, 2).replace(/\n/g, '\n        ')}
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://romanbecker.de/"},
          {"@type": "ListItem", "position": 2, "name": "Marktanalyse", "item": "https://romanbecker.de/marktanalyse/"},
          {"@type": "ListItem", "position": 3, "name": "Köln Q2/2026", "item": "https://romanbecker.de/marktanalyse/koeln-q2-2026.html"}
        ]
      }
    ]
  }
  </script>

  <!-- ClickRank.ai SEO verification -->
  <script>
    var clickRankAi = document.createElement("script");
    clickRankAi.src = "https://js.clickrank.ai/seo/4c44e18d-84e4-4e10-9bf0-bec62a93d56f/script?" + new Date().getTime();
    clickRankAi.async = true;
    document.head.appendChild(clickRankAi);
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --navy: #111111;
      --gold: #c2a990;
      --white: #ffffff;
      --off-white: #f8f8f8;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-12: 3rem;
    }
    body { font-family: 'Inter', sans-serif; color: #1a1a1a; background: var(--white); line-height: 1.7; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
    .site-header { background: var(--navy); padding: var(--space-4) 0; }
    .site-header a { color: var(--white); text-decoration: none; }
    .site-header__inner { display: flex; justify-content: space-between; align-items: center; }
    .site-header__logo { font-family: 'Cardo', serif; font-size: 1.05rem; font-weight: 700; }
    .site-header__nav { display: flex; gap: var(--space-6); }
    .site-header__nav a { font-size: 0.9rem; }
    .breadcrumb { padding: var(--space-4) 0; font-size: 0.875rem; color: var(--gray-600); }
    .breadcrumb a { color: var(--gray-600); text-decoration: none; }
    .breadcrumb span { margin: 0 var(--space-2); }
    main { padding: var(--space-8) 0 var(--space-12); }
    h1 { font-family: 'Cardo', serif; font-size: 2.4rem; line-height: 1.2; margin-bottom: var(--space-4); color: var(--navy); }
    h2 { font-family: 'Cardo', serif; font-size: 1.7rem; margin: var(--space-12) 0 var(--space-4); color: var(--navy); }
    h3 { font-size: 1.15rem; margin-bottom: var(--space-3); color: var(--navy); }
    p { margin-bottom: var(--space-4); color: var(--gray-700); }
    .lead { font-size: 1.125rem; color: var(--gray-700); }
    .meta { font-size: 0.875rem; color: var(--gray-600); padding: var(--space-4) 0; border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); margin: var(--space-6) 0; display: flex; gap: var(--space-6); flex-wrap: wrap; }
    .meta strong { color: var(--navy); }
    .top-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-8); margin: var(--space-8) 0; }
    @media (min-width: 800px) { .top-grid { grid-template-columns: repeat(3, 1fr); } }
    .top-card { background: var(--gray-100); border-radius: 8px; padding: var(--space-6); }
    .top-card ol { list-style: none; padding-left: 0; }
    .top-card li { padding: var(--space-2) 0; border-bottom: 1px solid var(--gray-200); font-size: 0.95rem; }
    .top-card li:last-child { border-bottom: none; }
    .muted { color: var(--gray-600); font-weight: 400; font-size: 0.875rem; }
    .table-wrap { overflow-x: auto; margin: var(--space-6) 0; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    thead { background: var(--off-white); }
    th, td { padding: var(--space-3) var(--space-4); text-align: left; border-bottom: 1px solid var(--gray-200); }
    th { font-weight: 600; color: var(--navy); white-space: nowrap; }
    td.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
    td a { color: var(--navy); text-decoration: none; border-bottom: 1px dotted var(--gray-200); }
    td a:hover { color: var(--gold); border-bottom-color: var(--gold); }
    .trend-up { color: #16a34a; font-weight: 600; }
    .trend-down { color: #dc2626; font-weight: 600; }
    .cta-box { background: var(--navy); color: var(--white); padding: var(--space-8); border-radius: 8px; margin: var(--space-12) 0; text-align: center; }
    .cta-box h2 { color: var(--white); margin: 0 0 var(--space-3); }
    .cta-box p { color: rgba(255,255,255,0.85); margin-bottom: var(--space-6); }
    .cta-btn { display: inline-block; background: var(--gold); color: var(--navy); padding: var(--space-3) var(--space-6); text-decoration: none; font-weight: 600; border-radius: 4px; }
    .method { background: var(--gray-100); border-left: 3px solid var(--gold); padding: var(--space-6); margin: var(--space-8) 0; font-size: 0.9rem; color: var(--gray-700); }
    footer { padding: var(--space-8) 0; background: var(--navy); color: rgba(255,255,255,0.6); font-size: 0.85rem; text-align: center; }
    footer a { color: var(--gold); }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="site-header__inner">
        <a href="https://romanbecker.de/" class="site-header__logo">Roman Becker - EVERNEST</a>
        <nav class="site-header__nav">
          <a href="https://romanbecker.de/stadtteile/">Stadtteile</a>
          <a href="https://romanbecker.de/immobilienbewertung.html">Immobilienbewertung</a>
          <a href="https://romanbecker.de/#kontakt">Kontakt</a>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="https://romanbecker.de/">Start</a><span>›</span>
        <a href="/marktanalyse/">Marktanalyse</a><span>›</span>
        Köln Q2/2026
      </nav>

      <h1>Immobilienmarkt Köln Q2/2026 — Preisanalyse 86 Stadtteile</h1>
      <p class="lead">Aktuelle Kaufpreise, Mietpreise und Jahres-Trends im Kölner Immobilienmarkt — quartalsweise aktualisiert von Roman Becker (EVERNEST). Datenbasis: ${all.length} Kölner Stadtteile in 9 Bezirken.</p>

      <div class="meta">
        <span><strong>Veröffentlicht:</strong> ${today}</span>
        <span><strong>Datenstand:</strong> Q1/2026</span>
        <span><strong>Stadtteile erfasst:</strong> ${all.length}</span>
        <span><strong>Bezirke:</strong> ${bezirke.length}</span>
        <span><strong>Autor:</strong> Roman Becker (IHK-zertifiziert)</span>
      </div>

      <h2>Auf einen Blick</h2>
      <div class="top-grid">
        <div class="top-card">
          <h3>Top 5 teuerste Lagen (€/m² ETW)</h3>
          <ol>
${top5Teuer.map((x, i) => `            <li><strong>${i + 1}. Köln-${x.n}</strong> <span class="muted">(${x.bn})</span> — ~${x.e} €/m²</li>`).join('\n')}
          </ol>
        </div>
        <div class="top-card">
          <h3>Top 5 günstigste Lagen (€/m² ETW)</h3>
          <ol>
${top5Guenstig.map((x, i) => `            <li><strong>${i + 1}. Köln-${x.n}</strong> <span class="muted">(${x.bn})</span> — ~${x.e} €/m²</li>`).join('\n')}
          </ol>
        </div>
        <div class="top-card">
          <h3>Top 5 stärkste Trends (% YoY)</h3>
          <ol>
${top5Trend.map((x, i) => `            <li><strong>${i + 1}. Köln-${x.n}</strong> <span class="muted">(${x.bn})</span> — ${x.t.startsWith('+') || x.t.startsWith('-') ? x.t : '+' + x.t} %</li>`).join('\n')}
          </ol>
        </div>
      </div>

      <h2>Bezirks-Übersicht</h2>
      <p>Aggregierte Durchschnittspreise und Trends pro Stadtbezirk — als Orientierung über das gesamte Kölner Stadtgebiet.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bezirk</th>
              <th class="num">Stadtteile</th>
              <th class="num">Ø Kaufpreis ETW</th>
              <th class="num">Ø Trend YoY</th>
            </tr>
          </thead>
          <tbody>
${bezirkRows}
          </tbody>
        </table>
      </div>

      <h2>Vollständige Stadtteil-Tabelle</h2>
      <p>Alle erfassten Stadtteile mit aktuellen Marktdaten (Stand Q1/2026). Klick auf den Stadtteilnamen führt zur jeweiligen Detailseite mit Markt- und Lageportrait.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Stadtteil</th>
              <th>Bezirk</th>
              <th class="num">ETW (€/m²)</th>
              <th class="num">EFH (€/m²)</th>
              <th class="num">Miete (€/m²)</th>
              <th class="num">Trend YoY</th>
            </tr>
          </thead>
          <tbody>
${tableRows}
          </tbody>
        </table>
      </div>

      <div class="method">
        <strong>Methodik & Datenquellen:</strong> Die hier ausgewiesenen Werte sind Richtwerte basierend auf Marktbeobachtung, öffentlichen Gutachterausschuss-Daten der Stadt Köln, EVERNEST-internen Verkaufsdaten und Immobilienportal-Auswertungen. Stand der Daten: Q1/2026, veröffentlicht im Q2/2026. Die tatsächlichen Verkaufspreise einzelner Objekte können erheblich abweichen — abhängig von Lage, Baujahr, Zustand, Ausstattung, Energieeffizienz und aktueller Marktsituation. Für eine individuelle Bewertung Ihrer Immobilie sprechen Sie mich gerne an.
      </div>

      <div class="cta-box">
        <h2>Was ist Ihre Immobilie wert?</h2>
        <p>Kostenlose, persönliche Marktwert-Analyse für Ihre Immobilie in Köln — IHK-zertifiziert, diskret, ohne Verpflichtung.</p>
        <a href="https://romanbecker.de/immobilienbewertung.html" class="cta-btn" title="Kostenlose Immobilienbewertung in Köln durch Roman Becker">Kostenlose Immobilienbewertung anfordern</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 Roman Becker - EVERNEST · <a href="https://romanbecker.de/">Startseite</a> · <a href="https://romanbecker.de/impressum.html">Impressum</a> · <a href="https://romanbecker.de/datenschutz.html">Datenschutz</a></p>
    </div>
  </footer>
</body>
</html>
`;

// Stelle sicher dass marktanalyse/ existiert
const outDir = join(ROOT, 'marktanalyse');
if (!existsSync(outDir)) mkdirSync(outDir, {recursive: true});

const outPath = join(outDir, 'koeln-q2-2026.html');
writeFileSync(outPath, html);
console.log(`✓ Generated ${outPath}`);
console.log(`  Stadtteile: ${all.length}`);
console.log(`  Bezirke: ${bezirke.length}`);
console.log(`  Top teuerster: Köln-${top5Teuer[0].n} (~${top5Teuer[0].e} €/m²)`);
console.log(`  Top günstigster: Köln-${top5Guenstig[0].n} (~${top5Guenstig[0].e} €/m²)`);
console.log(`  Top Trend: Köln-${top5Trend[0].n} (${top5Trend[0].t} %)`);
