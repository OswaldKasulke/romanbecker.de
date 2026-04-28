#!/usr/bin/env node
/**
 * generate-stadtteile.mjs
 * Generates all 80 missing Stadtteil landing pages for romanbecker.de
 */
import { writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'stadtteile');
const IMG = 'https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg';

const IC = {
  schule:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>',
  kita:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M12 6v2"/><path d="M9 14l-3 8"/><path d="M15 14l3 8"/><path d="M7 12a5 5 0 0 1 10 0"/><path d="M12 8v6"/></svg>',
  oepnv:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/></svg>',
  shop:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  park:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V8"/><path d="M5 12H2l10-9 10 9h-3"/><path d="M8 15H4l8-7 8 7h-4"/></svg>',
  health:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  fitness:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5L17.5 17.5"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M6 8v8"/><path d="M18 8v8"/><path d="M4 10v4"/><path d="M20 10v4"/></svg>',
  gastro:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  kultur:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><path d="M9 20v-4h6v4"/><path d="M9 12h.01"/><path d="M15 12h.01"/></svg>'
};

// Name lookup from data
let NAMES = {};

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

function infraCard(icon, title, items) {
  return `        <div class="card">
          <div class="card__icon">${icon}</div>
          <h3>${title}</h3>
          <ul class="infra-list">
${items.map(i=>`            <li><span class="infra-icon">\u2022</span> ${i}</li>`).join('\n')}
          </ul>
        </div>`;
}

function refHTML(d) {
  if (!d.refs) return '';
  const n = d.refs.length;
  const items = d.refs.map(r =>
    `            <li style="color:rgba(255,255,255,0.7);border-color:rgba(255,255,255,0.15);"><span class="infra-icon" style="color:var(--gold);">\u2022</span> ${r.t} \u00b7 ${r.p}</li>`
  ).join('\n');
  return `
  <section class="section" style="padding-bottom:0;">
    <div class="container">
      <div class="card card--navy ref-card">
        <div class="ref-card__text">
          <span class="section-label">Erfolgreich vermittelt in ${d.n}</span>
          <h3 style="color:var(--white);">${n === 1 ? d.refs[0].t : n+' Objekte in K\u00f6ln-'+d.n}</h3>
          <ul class="infra-list" style="margin-bottom:var(--space-4);">
${items}
          </ul>
        </div>
        <div class="ref-card__stat">
          <div class="ref-card__number">${n}</div>
          <div class="ref-card__label">${n===1?'vermitteltes Objekt':'Objekte'}<br>in K\u00f6ln-${d.n}</div>
        </div>
      </div>
    </div>
  </section>`;
}

function render(d) {
  const fn = 'K\u00f6ln-'+d.n;
  const rc = d.refs ? d.refs.length : 0;
  const rt = rc > 0 ? ' \u2014 '+rc+' vermittelte'+(rc===1?'s Objekt':' Objekte')+' in '+d.n+'.' : '';
  const md = 'Immobilie in '+fn+' verkaufen oder kaufen? Roman Becker \u2014 Ihr Makler vor Ort.'+rt+' Marktdaten, Stadtteil-Expertise, EVERNEST-Netzwerk. Jetzt beraten lassen.';
  const bbox = (d.lng-0.02).toFixed(3)+'%2C'+(d.lat-0.015).toFixed(3)+'%2C'+(d.lng+0.02).toFixed(3)+'%2C'+(d.lat+0.015).toFixed(3);
  const mapUrl = 'https://www.openstreetmap.org/export/embed.html?bbox='+bbox+'&layer=mapnik&marker='+d.lat+'%2C'+d.lng;

  const faqs = [
    {q:'Was kostet eine Wohnung in '+fn+'?',
     a:'Der durchschnittliche Kaufpreis f\u00fcr Eigentumswohnungen in '+fn+' liegt bei ca. '+d.mk.e+' \u20ac/m\u00b2 (Stand Q1/2026). Reihenh\u00e4user und Einfamilienh\u00e4user werden im Schnitt f\u00fcr ca. '+d.mk.h+' \u20ac/m\u00b2 gehandelt. Die Kaltmieten bei Neuvermietung liegen bei '+d.mk.m+' \u20ac/m\u00b2. Die Preise variieren je nach Lage, Baujahr, Grundriss und Ausstattung innerhalb des Stadtteils teils erheblich.'},
    {q:'Ist '+d.n+' ein guter Standort f\u00fcr Familien?',
     a:d.immo.fa},
    {q:'Wie entwickelt sich der Immobilienmarkt in '+d.n+'?',
     a:(()=>{const t=parseFloat(d.mk.t.replace('+','').replace(',','.'));const trend=t>=4?'Die Preisdynamik in '+d.n+' liegt damit \u00fcber dem K\u00f6lner Durchschnitt \u2014 die Nachfrage \u00fcbersteigt das Angebot.':t>=3?'Das Preiswachstum in '+d.n+' liegt im soliden Mittelfeld des K\u00f6lner Markts.':t>=1?'Der Markt in '+d.n+' entwickelt sich moderat \u2014 Angebot und Nachfrage halten sich weitgehend die Waage.':'Die Preise in '+d.n+' sind aktuell stabil, mit wenig Bewegung nach oben oder unten.';return 'Die Kaufpreise f\u00fcr Eigentumswohnungen in '+fn+' stiegen im Jahresvergleich um '+d.mk.t+' %. '+trend})()},
    {q:'F\u00fcr wen eignet sich '+d.n+' besonders?',
     a:d.immo.ei},
    {q:'Was sollte man beim Immobilienkauf in '+fn+' beachten?',
     a:d.immo.ka}
  ];

  const faqLD = faqs.map(f=>`          {
            "@type": "Question",
            "name": "${esc(f.q)}",
            "acceptedAnswer": {"@type":"Answer","text":"${esc(f.a)}"}
          }`).join(',\n');

  const faqH = faqs.map((f,i)=>`        <details class="faq-item"${i===0?' open':''}>
          <summary>${f.q}</summary>
          <div class="faq-answer">${f.a}</div>
        </details>`).join('\n\n');

  const cats = [
    [IC.schule,'Schulen &amp; Bildung',d.inf[0]],
    [IC.kita,'Kitas &amp; Kinderbetreuung',d.inf[1]],
    [IC.oepnv,'\u00d6PNV-Anbindung',d.inf[2]],
    [IC.shop,'Einkaufen',d.inf[3]],
    [IC.park,'Parks &amp; Freizeit',d.inf[4]],
    [IC.health,'Gesundheit',d.inf[5]],
    [IC.fitness,'Fitness &amp; Sport',d.inf[6]],
    [IC.gastro,'Gastronomie',d.inf[7]],
    [IC.kultur,'Kultur &amp; Sehenswertes',d.inf[8]]
  ];
  const infraH = cats.map(([ic,ti,it])=>infraCard(ic,ti,it)).join('\n\n');
  const immoLi = d.immo.t.map(t=>`            <li><span class="infra-icon">\u2022</span> ${t}</li>`).join('\n');
  const nbH = d.nb.map(s=>`        <a href="${s}.html" class="btn btn--outline">${NAMES[s]||s}</a>`).join('\n');

return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Immobilienmakler ${fn} \u2013 Roman Becker</title>
  <meta name="description" content="${esc(md)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://romanbecker.de/stadtteile/${d.s}.html">
  <meta name="geo.region" content="DE-NW">
  <meta name="geo.placename" content="${fn}">
  <meta name="geo.position" content="${d.lat};${d.lng}">
  <meta name="ICBM" content="${d.lat}, ${d.lng}">
  <meta property="og:title" content="Immobilienmakler ${fn} \u2013 Roman Becker">
  <meta property="og:description" content="${esc(md)}">
  <meta property="og:url" content="https://romanbecker.de/stadtteile/${d.s}.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${IMG}">
  <meta property="og:locale" content="de_DE">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Immobilienmakler ${fn} \u2013 Roman Becker">
  <meta name="twitter:description" content="${esc(md)}">
  <meta name="twitter:image" content="${IMG}">
  <link rel="icon" href="https://romanbecker.de/favicon.ico" type="image/x-icon">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "name": "Roman Becker \u2013 Immobilienmakler ${fn}",
        "url": "https://romanbecker.de/stadtteile/${d.s}.html",
        "telephone": "+491775156969",
        "email": "roman.becker@evernest.com",
        "image": "${IMG}",
        "address": {"@type":"PostalAddress","streetAddress":"Kaiser-Wilhelm-Ring 17-21","addressLocality":"K\u00f6ln","postalCode":"50672","addressRegion":"NW","addressCountry":"DE"},
        "geo": {"@type":"GeoCoordinates","latitude":${d.lat},"longitude":${d.lng}},
        "areaServed": {"@type":"Place","name":"${fn}"},
        "priceRange": "\u20ac\u20ac\u20ac",
        "openingHours": "Mo-Fr 09:00-19:00"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type":"ListItem","position":1,"name":"Start","item":"https://romanbecker.de/"},
          {"@type":"ListItem","position":2,"name":"Stadtteile","item":"https://romanbecker.de/stadtteile/"},
          {"@type":"ListItem","position":3,"name":"${fn}","item":"https://romanbecker.de/stadtteile/${d.s}.html"}
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
${faqLD}
        ]
      }
    ]
  }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="shared.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <div class="site-header__inner">
        <a href="https://romanbecker.de/" class="site-header__logo">Roman <span>Becker</span></a>
        <nav class="site-header__nav" aria-label="Hauptnavigation">
          <a href="https://romanbecker.de/stadtteile/">Stadtteile</a>
          <a href="https://romanbecker.de/immobilienbewertung/">Sofort-Immobilienbewertung</a>
          <a href="https://romanbecker.de/#prozess">Verkaufsprozess</a>
          <a href="https://romanbecker.de/#kontakt">Kontakt</a>
        </nav>
        <a href="tel:+491775156969" class="site-header__cta">+49 177 515 69 69</a>
      </div>
    </div>
  </header>
  <main>
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="https://romanbecker.de/">Start</a><span>\u203a</span><a href="https://romanbecker.de/stadtteile/">Stadtteile</a><span>\u203a</span>${fn}
    </nav>
  </div>
  <section class="hero">
    <div class="container">
      <div class="hero__badge">\u2713 IHK-zertifiziert \u00b7 EVERNEST-Netzwerk \u00b7 ${fn}</div>
      <h1>Immobilienmakler in ${fn} \u2013 Roman Becker</h1>
      <p class="hero__subtitle">${d.intro}</p>
      <div class="hero__buttons">
        <a href="https://romanbecker.de/immobilienbewertung/" class="btn btn--primary">Kostenlose Immobilienbewertung</a>
        <a href="tel:+491775156969" class="btn btn--white-outline">+49 177 515 69 69</a>
      </div>
      <div style="margin-top:var(--space-6);">
        <a href="https://g.page/r/CTFa96X9A_ShEBM/review" target="_blank" rel="noopener" class="review-badge">
          <span class="review-badge__stars">\u2605\u2605\u2605\u2605\u2605</span>
          <span>5,0 auf Google \u00b7 20+ vermittelte Objekte in K\u00f6ln</span>
        </a>
      </div>
    </div>
  </section>
${refHTML(d)}
  <section class="section">
    <div class="container">
      <span class="section-label">Immobilienmarkt ${d.n}</span>
      <h2>Immobilie in ${fn} kaufen oder verkaufen \u2013 aktuelle Marktdaten</h2>
      <p class="text-muted mb-8 max-w-prose">Als Immobilienmakler in ${fn} berate ich Verk\u00e4ufer und K\u00e4ufer auf Basis aktueller Vergleichsdaten. Die folgenden Werte geben Ihnen eine erste Orientierung \u2013 f\u00fcr eine individuelle Bewertung Ihrer Immobilie sprechen Sie mich gerne an.</p>
      <div class="market-grid">
        <div class="market-stat"><div class="market-stat__value">~${d.mk.e} \u20ac</div><div class="market-stat__label">Kaufpreis pro m\u00b2<br>Eigentumswohnung</div></div>
        <div class="market-stat"><div class="market-stat__value">${d.mk.h==='—'?'—':'~'+d.mk.h+' \u20ac'}</div><div class="market-stat__label">Kaufpreis pro m\u00b2<br>Haus</div></div>
        <div class="market-stat"><div class="market-stat__value">${d.mk.m} \u20ac</div><div class="market-stat__label">Kaltmiete pro m\u00b2<br>Neuvermietung</div></div>
        <div class="market-stat"><div class="market-stat__value">${d.mk.t} %</div><div class="market-stat__label">Preisentwicklung<br>ETW 2025\u21922026</div></div>
      </div>
      <p style="font-size:0.75rem;color:var(--gray-400);margin-top:var(--space-4);text-align:center;">Quellen: Homeday, Engel &amp; V\u00f6lkers, ImmoScout24 \u00b7 Stand Q1/2026</p>
    </div>
  </section>
  <section class="section section--gray">
    <div class="container">
      <span class="section-label">Stadtteil-Profil</span>
      <h2>${fn} \u2013 ${d.h}</h2>
      <div class="grid-2" style="margin-bottom:var(--space-12);">
        <div>
          <p class="text-muted leading-relaxed mb-6">${d.portrait}</p>
        </div>
        <div>
          <div class="map-container">
            <iframe src="${mapUrl}" loading="lazy" title="Karte von ${fn}" aria-label="OpenStreetMap Karte von ${fn}"></iframe>
          </div>
          <p style="font-size:0.75rem;color:var(--gray-400);margin-top:var(--space-2);text-align:center;">PLZ: ${d.p} \u00b7 Bezirk ${d.b} (${d.bn}), Stadtteil ${d.nr}</p>
        </div>
      </div>
      <div class="market-grid">
        <div class="market-stat"><div class="market-stat__value">${d.e}</div><div class="market-stat__label">Einwohner</div></div>
        <div class="market-stat"><div class="market-stat__value">${d.fl} km\u00b2</div><div class="market-stat__label">Fl\u00e4che</div></div>
        <div class="market-stat"><div class="market-stat__value">${d.au} %</div><div class="market-stat__label">Ausl\u00e4nderanteil</div></div>
        <div class="market-stat"><div class="market-stat__value">${d.al} J.</div><div class="market-stat__label">Durchschnittsalter</div></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <span class="section-label">Infrastruktur</span>
      <h2>Das macht ${d.n} als Wohnlage attraktiv</h2>
      <p class="text-muted mb-8 max-w-prose">Eine starke Infrastruktur ist ein entscheidender Werttreiber f\u00fcr Immobilien. Hier die wichtigsten Einrichtungen in ${fn}.</p>
      <div class="grid-3">
${infraH}
      </div>
    </div>
  </section>
  <section class="section section--gray">
    <div class="container">
      <span class="section-label">Immobilientypen in ${d.n}</span>
      <h2>Immobilie in ${fn} verkaufen \u2013 was Ihr Objekt besonders macht</h2>
      <div class="grid-2">
        <div>
          <h3>Typische Objekte im Stadtteil</h3>
          <ul class="infra-list" style="margin-bottom:var(--space-6);">
${immoLi}
          </ul>
        </div>
        <div>
          <h3>Immobilie in ${fn} kaufen \u2014 f\u00fcr wen lohnt es sich?</h3>
          <p class="text-muted leading-relaxed mb-4"><strong>F\u00fcr Familien:</strong> ${d.immo.fa}</p>
          <p class="text-muted leading-relaxed mb-4"><strong>F\u00fcr Kapitalanleger:</strong> ${d.immo.ka}</p>
          <p class="text-muted leading-relaxed"><strong>F\u00fcr Eigennutzer:</strong> ${d.immo.ei}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <span class="section-label">H\u00e4ufige Fragen</span>
      <h2>H\u00e4ufige Fragen zum Immobilienmarkt in ${fn}</h2>
      <div style="max-width:800px;">
${faqH}
      </div>
    </div>
  </section>
  <section class="section section--gray">
    <div class="container">
      <div class="cta-box">
        <span class="section-label">Jetzt beraten lassen</span>
        <h2>Immobilie in ${fn} verkaufen oder kaufen?</h2>
        <p>Ob Verkauf, Kauf oder Kapitalanlage \u2014 ich berate Sie pers\u00f6nlich, unverbindlich und diskret. Als Ihr Makler in K\u00f6ln kenne ich den Markt aus erster Hand.</p>
        <div class="cta-buttons">
          <a href="https://romanbecker.de/immobilienbewertung/" class="btn btn--primary">Kostenlose Immobilienbewertung</a>
          <a href="tel:+491775156969" class="btn btn--white-outline">+49 177 515 69 69</a>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container text-center">
      <span class="section-label">Auch in den Nachbar-Stadtteilen aktiv</span>
      <h2>Immobilienmakler in der Umgebung von ${d.n}</h2>
      <p class="text-muted mb-8">Sie suchen einen Makler in einem angrenzenden Stadtteil? Ich bin auch hier f\u00fcr Sie da:</p>
      <div class="neighbor-links">
${nbH}
      </div>
    </div>
  </section>
  </main>
  <footer class="footer">
    <div class="container">
      <div class="footer__links">
        <a href="https://romanbecker.de/">Startseite</a>
        <a href="https://romanbecker.de/stadtteile/">Alle Stadtteile</a>
        <a href="https://romanbecker.de/immobilienbewertung/">Immobilienbewertung</a>
        <a href="https://romanbecker.de/impressum/">Impressum</a>
        <a href="https://romanbecker.de/agb/">AGB &amp; Datenschutz</a>
      </div>
      <p>\u00a9 2026 Roman Becker \u00b7 Immobilienmakler K\u00f6ln \u00b7 EVERNEST GmbH</p>
      <p style="margin-top:var(--space-2);">Kaiser-Wilhelm-Ring 17-21, 50672 K\u00f6ln \u00b7 <a href="tel:+491775156969">+49 177 515 69 69</a> \u00b7 <a href="mailto:roman.becker@evernest.com">roman.becker@evernest.com</a> \u00b7 <a href="https://www.instagram.com/roman_becker_immobilien/" target="_blank" rel="noopener">Instagram</a></p>
    </div>
  </footer>
</body>
</html>`;
}

// ─── MAIN ────────────────────────────────────────────
async function main() {
  const { default: DATA } = await import('./stadtteile-data.mjs');
  // Build name lookup — include the 6 existing pages too
  const EXISTING_NAMES = {
    'suelz':'Sülz','lindenthal':'Lindenthal','nippes':'Nippes',
    'rodenkirchen':'Rodenkirchen','bilderstoeckchen':'Bilderstöckchen','zollstock':'Zollstock'
  };
  Object.assign(NAMES, EXISTING_NAMES);
  for (const d of DATA) NAMES[d.s] = d.n;
  let count = 0;
  for (const d of DATA) {
    const file = join(OUT, d.s+'.html');
    // Skip the 6 hand-crafted pages, regenerate everything else
    if (['bilderstoeckchen','lindenthal','nippes','rodenkirchen','suelz','zollstock','weiden','raderthal','rondorf','muengersdorf'].includes(d.s)) {
      console.log('  skip '+d.n+' (hand-crafted)'); continue;
    }
    await writeFile(file, render(d), 'utf-8');
    console.log('  \u2713 '+d.n);
    count++;
  }
  console.log('\nGenerated '+count+' pages.');
}
main();
