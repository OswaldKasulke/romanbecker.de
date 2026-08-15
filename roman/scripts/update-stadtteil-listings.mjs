/**
 * update-stadtteil-listings.mjs
 * Fetches all current EVERNEST listings in the Köln/Rheinland area and embeds
 * an "Aktuelle Angebote"-Block (image + link to the Evernest detail page) into
 * the matching stadtteile/*.html page (Köln districts) and the Umland town pages
 * (which also live under stadtteile/, e.g. leverkusen.html, bergisch-gladbach.html).
 *
 * A listing is matched to a page by parsing its displayAddress:
 *   "Köln-Junkersdorf, 50858"      → junkersdorf.html
 *   "Leverkusen-Rheindorf, 51371"  → leverkusen.html
 *   "Bergisch Gladbach-Refrath, …" → bergisch-gladbach.html
 *
 * Pages with no current listing are left untouched; if a page previously had a
 * listings block but now has none, the block is removed. Idempotent via markers.
 *
 * Usage:  node update-stadtteil-listings.mjs [--dry]
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STADTTEILE_DIR = join(__dirname, '..', 'stadtteile');

const SEARCH_URL = 'https://www.evernest.com/api/properties/';
const OFFICE_URL = 'https://www.evernest.com/de/search/?lat=50.989913&lng=7.000059&zoom=11';
// Kartenausschnitt identisch zu OFFICE_URL / KOELN_SEARCH_LINK
// (lat 50.922439, lng 7.003492, zoom 10) — so speist sich die Galerie aus
// demselben Ausschnitt, den der "Alle Objekte"-Button oeffnet.
const KOELN_BOUNDS = {
  nw: { lat: 51.4424, lng: 6.0835 },
  ne: { lat: 51.4424, lng: 7.9235 },
  sw: { lat: 50.4024, lng: 6.0835 },
  se: { lat: 50.4024, lng: 7.9235 },
};
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';
const IMG_PARAMS = '?w=800&h=534&fit=fill&fm=jpg&q=80';

const START = '<!-- STADTTEIL-LISTINGS-START -->';
const END = '<!-- STADTTEIL-LISTINGS-END -->';

const DRY = process.argv.includes('--dry');

const TYPE_LABEL = {
  apartment: 'Wohnung', house: 'Haus', multi_family_house: 'Mehrfamilienhaus',
  plot: 'Grundstück', commercial: 'Gewerbe', penthouse: 'Penthouse',
  land: 'Grundstück', villa: 'Villa',
};

// Korrektur fehlerhafter propertyType-Angaben aus den Evernest-Stammdaten.
// Key = listing sys.id, Value = korrekter propertyType (siehe TYPE_LABEL).
// 5sbhUeXVmLizAAbmOfaZv8: in der API als "apartment" geführt, ist aber eine
// Gewerbeeinheit in Köln-Marienburg (986.500 €, ohne Zimmer/Wohnfläche).
const TYPE_OVERRIDE = {
  '5sbhUeXVmLizAAbmOfaZv8': 'commercial',
};

// ---------------------------------------------------------------------------
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[\/]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function localityOf(address) {
  return String(address).replace(/,\s*\d{5}.*$/, '').trim(); // strip ", PLZ …"
}

/** Returns { slug, display, isKoeln } or null if no matching page exists. */
function matchPage(address, validSlugs) {
  const loc = localityOf(address);
  if (!loc) return null;
  if (/^Köln[-\/]/i.test(loc)) {
    const district = loc.replace(/^Köln[-\/]\s*/i, '');
    const slug = slugify(district);
    if (validSlugs.has(slug)) {
      return { slug, display: 'Köln-' + district.replace(/\/\s*/g, '-'), isKoeln: true };
    }
    return null;
  }
  // Umland: town = part before the first "-", minus any "(Rheinland)"-style suffix
  const city = loc.split('-')[0].trim().replace(/\s*\(.*?\)/g, '').trim();
  const slug = slugify(city);
  if (validSlugs.has(slug)) return { slug, display: city, isKoeln: false };
  const full = slugify(loc);
  if (validSlugs.has(full)) return { slug: full, display: loc, isKoeln: false };
  return null;
}

function mapListing(item) {
  const epd = item.exportedPropertyData?.data ?? {};
  return {
    id: item.sys?.id,
    status: item.salesStatus,           // new | reserved | sold
    sold: item.salesStatus === 'sold',
    reserved: item.salesStatus === 'reserved',
    hidePrice: !!item.hidePrice,
    price: epd.priceFrom ?? epd.price ?? null,
    priceFrom: epd.priceFrom != null,
    rooms: epd.rooms ?? null,
    livingSpace: epd.livingSpace ?? null,
    propertyType: TYPE_OVERRIDE[item.sys?.id] ?? epd.propertyType ?? null,
    address: item.displayAddress ?? '',
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    imageUrl: item.featuredImage?.url ?? null,
    url: `https://www.evernest.com/de/listing/${item.sys?.id}/`,
  };
}

// ---------------------------------------------------------------------------
// VEEDEL (nicht-amtliche Quartiere)
//
// Evernest liefert in displayAddress ausschliesslich den amtlichen Stadtteil —
// "Koeln-Neustadt/ Nord". Das Veedel steht nirgends in den Strukturdaten,
// sondern nur im Fliesstext des Exposes. Deshalb bekamen agnesviertel.html,
// belgisches-viertel.html, komponistenviertel.html und rheinauhafen.html nie
// ein Objekt zugewiesen, obwohl es dort welche gibt.
//
// Zwei Signale, ein Objekt reicht eines davon:
//   1. `re`  — Veedelname in Titel, Beschreibung oder Highlight-Block des
//              Exposes. Die Endung ist bewusst offen ([nrsm]?), weil die Texte
//              flektieren: "im Belgischen Viertel", "Mitten im Belgischem
//              Viertel", "im Sueden des Rheinauhafens".
//   2. `box` — Koordinaten des Objekts. Noetig, weil der Text das Veedel nicht
//              immer nennt: das Objekt in der Balthasarstrasse liegt im
//              Agnesviertel, schreibt das Wort aber nirgends.
//
// `parents` ist die Plausibilitaetsbremse: nur Objekte, die amtlich im
// zugehoerigen Stadtteil liegen, koennen ueberhaupt zugeordnet werden. Sonst
// landet ein Haus in Porz auf der Agnesviertel-Seite, weil im Text "wie im
// Belgischen Viertel" steht. Die Boxen sind an bekannten Objekten kalibriert
// und bewusst eng.
const VEEDEL = [
  { slug: 'agnesviertel',       display: 'Agnesviertel',
    re: /Agnesviertel/i,
    box: { latMin: 50.9455, latMax: 50.9565, lngMin: 6.9470, lngMax: 6.9660 },
    parents: ['neustadt-nord'] },
  { slug: 'belgisches-viertel', display: 'Belgisches Viertel',
    re: /Belgische[nrsm]?\s+Viertel/i,
    box: { latMin: 50.9330, latMax: 50.9435, lngMin: 6.9270, lngMax: 6.9460 },
    parents: ['neustadt-nord', 'neustadt-sued'] },
  { slug: 'komponistenviertel', display: 'Komponistenviertel',
    re: /Komponistenviertel/i,
    box: { latMin: 50.9180, latMax: 50.9270, lngMin: 6.9230, lngMax: 6.9370 },
    parents: ['neustadt-sued'] },
  { slug: 'rheinauhafen',       display: 'Rheinauhafen',
    re: /Rheinauhafens?/i,
    box: { latMin: 50.9195, latMax: 50.9295, lngMin: 6.9630, lngMax: 6.9760 },
    parents: ['altstadt-sued', 'neustadt-sued'] },
];

const VEEDEL_PARENTS = new Set(VEEDEL.flatMap(v => v.parents));

function inBox(l, b) {
  return l.lat != null && l.lng != null &&
    l.lat >= b.latMin && l.lat <= b.latMax && l.lng >= b.lngMin && l.lng <= b.lngMax;
}

/** Titel, Fliesstext und Highlight-Block aus der Expose-Seite ziehen. */
async function fetchDetailText(id) {
  try {
    const res = await fetch(`https://www.evernest.com/de/listing/${id}/`, { headers: { 'User-Agent': UA } });
    if (!res.ok) return '';
    const html = await res.text();
    const title = html.match(/<title data-next-head="">(.*?)<\/title>/s)?.[1] ?? '';
    const desc  = html.match(/<meta name="description" content="(.*?)" data-next-head/s)?.[1] ?? '';
    let feats = '';
    const fm = html.match(/"features":(\[.*?\])/s);
    if (fm) { try { feats = JSON.parse(fm[1]).join(' | '); } catch { feats = fm[1]; } }
    return [title, desc, feats].join(' | ');
  } catch { return ''; }
}

// ---------------------------------------------------------------------------
async function fetchListings() {
  const res = await fetch(SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ bounds: KOELN_BOUNDS, preview: false }),
  });
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
  const json = await res.json();
  const all = json?.searchResults ?? [];
  if (all.length === 0) throw new Error('No listings returned from search API');
  return all.map(mapListing);
}

// ---------------------------------------------------------------------------
function priceString(l) {
  if (l.hidePrice || l.price == null) return 'Preis auf Anfrage';
  const fmt = Number(l.price).toLocaleString('de-DE');
  return (l.priceFrom ? 'Ab ' : '') + fmt + ' €';
}

function buildCard(l) {
  const type = TYPE_LABEL[l.propertyType] || 'Immobilie';
  const facts = [];
  if (l.rooms) facts.push(`${String(l.rooms).replace('.', ',')} Zimmer`);
  if (l.livingSpace) facts.push(`${Math.round(l.livingSpace)} m²`);
  const factsStr = facts.join(' · ');
  const title = localityOf(l.address);
  const img = l.imageUrl ? escapeAttr(l.imageUrl + IMG_PARAMS) : '';
  let badge = '';
  if (l.sold) badge = `\n            <span class="listing-card__badge">Verkauft</span>`;
  else if (l.reserved) badge = `\n            <span class="listing-card__badge listing-card__badge--reserved">Reserviert</span>`;
  const imgTag = img
    ? `<img class="listing-card__img" src="${img}" alt="${escapeAttr(type + ' in ' + title)}" loading="lazy" width="800" height="534">`
    : `<div class="listing-card__img" aria-hidden="true"></div>`;
  // Bei verkauften Objekten kein "Preis auf Anfrage" ausgeben — das Verkauft-Badge
  // sagt bereits alles. Ein tatsächlich bekannter Preis bleibt erhalten.
  const priceHidden = l.hidePrice || l.price == null;
  const priceLine = (l.sold && priceHidden)
    ? ''
    : `\n            <span class="listing-card__price">${priceString(l)}</span>`;

  return `        <a class="listing-card" href="${escapeAttr(l.url)}" target="_blank" rel="noopener">
          <div class="listing-card__imgwrap">
            ${imgTag}${badge}
          </div>
          <div class="listing-card__body">
            <span class="listing-card__type">${escapeAttr(type)}</span>
            <span class="listing-card__title">${escapeAttr(title)}</span>
            ${factsStr ? `<span class="listing-card__facts">${escapeAttr(factsStr)}</span>` : ''}${priceLine}
          </div>
        </a>`;
}

function buildSection(display, listings) {
  // Galerie strikt nach Preis absteigend (unabhängig vom Status).
  // Objekte ohne Preis ans Ende, verkaufte Referenzen ganz zum Schluss.
  const priceOf = (l) => (l.hidePrice || l.price == null ? null : Number(l.price));
  const sorted = [...listings].sort((a, b) => {
    const pa = priceOf(a), pb = priceOf(b);
    if (pa != null && pb != null) return pb - pa;
    if (pa != null) return -1;
    if (pb != null) return 1;
    return (a.sold ? 1 : 0) - (b.sold ? 1 : 0);
  });
  const cards = sorted.map(buildCard).join('\n');
  const count = listings.length;
  const noun = count === 1 ? 'Objekt' : 'Objekte';
  return `${START}
  <section id="aktuelle-angebote" class="section section--gray">
    <div class="container">
      <span class="section-label">Aktuelle Angebote</span>
      <h2>Aktuelle Immobilienangebote in ${escapeAttr(display)}</h2>
      <p class="max-w-prose mb-8">${count} ${noun} in ${escapeAttr(display)} und Umgebung – jetzt ansehen. Kein passendes Objekt dabei? Ich finde diskret auch Off-Market-Immobilien für Sie.</p>
      <div class="listings__grid">
${cards}
      </div>
      <div class="cta-buttons" style="margin-top:var(--space-8)">
        <a href="${OFFICE_URL}" class="btn btn--primary" target="_blank" rel="noopener">Alle Immobilienangebote</a>
      </div>
    </div>
  </section>
  ${END}`;
}

// ---------------------------------------------------------------------------
function stripBlock(html) {
  const si = html.indexOf(START);
  const ei = html.indexOf(END);
  if (si === -1 || ei === -1) return html;
  const lineStart = html.lastIndexOf('\n', si) + 1;
  const after = ei + END.length;
  // also consume trailing newline
  const nl = html[after] === '\n' ? 1 : 0;
  return html.slice(0, lineStart) + html.slice(after + nl);
}

function insertSection(html, section) {
  if (html.includes(START) && html.includes(END)) {
    const si = html.indexOf(START);
    const ei = html.indexOf(END);
    const lineStart = html.lastIndexOf('\n', si) + 1;
    // Rest der END-Zeile verwerfen, den folgenden Zeilenumbruch aber stehen
    // lassen. Die frueher hier angehaengte '\n' machte den Austausch nicht
    // idempotent: jeder Lauf schob eine Leerzeile nach (bis zu 53 pro Seite).
    return html.slice(0, lineStart) + section + html.slice(ei + END.length).replace(/^[^\n]*/, '');
  }
  // Insert after the hero section closes (first </section> after <section class="hero">)
  const heroIdx = html.indexOf('<section class="hero"');
  if (heroIdx !== -1) {
    const closeIdx = html.indexOf('</section>', heroIdx);
    if (closeIdx !== -1) {
      const insertAt = closeIdx + '</section>'.length;
      return html.slice(0, insertAt) + '\n\n  ' + section + html.slice(insertAt);
    }
  }
  // Fallback: before footer
  const footIdx = html.indexOf('<footer');
  const lineStart = html.lastIndexOf('\n', footIdx) + 1;
  return html.slice(0, lineStart) + '  ' + section + '\n' + html.slice(lineStart);
}

// ---------------------------------------------------------------------------
async function main() {
  const files = (await readdir(STADTTEILE_DIR))
    .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'search.js');
  const validSlugs = new Set(files.map(f => f.replace(/\.html$/, '')));

  console.log('Fetching EVERNEST listings…');
  const listings = await fetchListings();
  console.log(`API returned ${listings.length} listings`);

  // Group by matched page
  const byPage = new Map();          // slug → { display, listings[] }
  const unmatched = [];
  for (const l of listings) {
    const m = matchPage(l.address, validSlugs);
    if (!m) { unmatched.push(l.address); continue; }
    if (!byPage.has(m.slug)) byPage.set(m.slug, { display: m.display, listings: [] });
    byPage.get(m.slug).listings.push(l);
  }

  // --- Veedel-Durchgang -----------------------------------------------------
  // Nur Objekte pruefen, die amtlich in einem Bezugsstadtteil liegen — das sind
  // wenige, der Detail-Abruf faellt damit kaum ins Gewicht.
  const veedelCandidates = [];
  for (const [slug, g] of byPage) {
    if (VEEDEL_PARENTS.has(slug)) for (const l of g.listings) veedelCandidates.push({ slug, l });
  }
  for (const { slug, l } of veedelCandidates) {
    const possible = VEEDEL.filter(v => v.parents.includes(slug));
    if (!possible.length) continue;
    const byCoords = possible.filter(v => inBox(l, v.box));
    let hit = byCoords[0] ?? null;
    let how = hit ? 'Koordinaten' : null;
    if (!hit) {
      const text = await fetchDetailText(l.id);
      hit = possible.find(v => v.re.test(text)) ?? null;
      how = hit ? 'Text' : null;
    }
    if (!hit) continue;
    if (!byPage.has(hit.slug)) byPage.set(hit.slug, { display: hit.display, listings: [] });
    const target = byPage.get(hit.slug);
    if (!target.listings.some(x => x.id === l.id)) {
      target.listings.push(l);
      console.log(`  Veedel: ${l.address} → ${hit.slug}.html (${how})`);
    }
  }

  console.log(`\nMatched ${listings.length - unmatched.length} listings → ${byPage.size} pages`);
  for (const [slug, g] of [...byPage].sort()) {
    console.log(`  ${slug}.html  (${g.display})  → ${g.listings.length} listing(s)`);
  }
  if (unmatched.length) {
    console.log(`\nUnmatched (no page): ${unmatched.length}`);
    console.log('  ' + [...new Set(unmatched.map(localityOf))].join(', '));
  }

  if (DRY) { console.log('\n[dry run — no files written]'); return; }

  let written = 0, cleared = 0;
  for (const f of files) {
    const slug = f.replace(/\.html$/, '');
    const path = join(STADTTEILE_DIR, f);
    let html = await readFile(path, 'utf-8');
    const had = html.includes(START);
    if (byPage.has(slug)) {
      const g = byPage.get(slug);
      html = insertSection(html, buildSection(g.display, g.listings));
      await writeFile(path, html, 'utf-8');
      written++;
    } else if (had) {
      html = stripBlock(html);
      await writeFile(path, html, 'utf-8');
      cleared++;
    }
  }
  console.log(`\nWrote listings into ${written} pages; cleared ${cleared} stale pages.`);
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
