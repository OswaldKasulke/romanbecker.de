/**
 * update-listings.mjs
 * Holt die EVERNEST-Objekte im Koelner Kartenausschnitt per POST auf
 * https://www.evernest.com/api/properties/ und schreibt daraus die Galerie
 * "Immobilienangebote in Koeln und im Koelner Umland".
 *
 * Die frueher zusaetzlich gepflegte Sektion "Meine Immobilien (Auswahl)" wurde
 * entfernt (Kunden konnten eigene vs. EVERNEST-Objekte nicht differenzieren);
 * seit dem 28.07.2026 entfaellt auch der zugehoerige Abruf des Maklerprofils.
 * Schreibt in die deutsche index.html UND die englische en/index.html
 * (English page uses translated labels — see LANGS below).
 * Runs daily via .github/workflows/update-listings.yml
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_PATH      = join(__dirname, '..', 'index.html');
const EN_INDEX_PATH   = join(__dirname, '..', 'en', 'index.html');
const BAUTRAEGER_PATH = join(__dirname, '..', 'bautraeger.html');

const KOELN_OFFICE_URL  = 'https://www.evernest.com/de/search/?lat=50.922439&lng=7.003492&zoom=10';
const KOELN_SEARCH_URL  = 'https://www.evernest.com/api/properties/';
// Bounding box for zoom=11 centred on Köln (50.938361, 6.959974)
// Kartenausschnitt identisch zu OFFICE_URL / KOELN_SEARCH_LINK
// (lat 50.922439, lng 7.003492, zoom 10) — so speist sich die Galerie aus
// demselben Ausschnitt, den der "Alle Objekte"-Button oeffnet.
const KOELN_BOUNDS = {
  nw: { lat: 51.4424, lng: 6.0835 },
  ne: { lat: 51.4424, lng: 7.9235 },
  sw: { lat: 50.4024, lng: 6.0835 },
  se: { lat: 50.4024, lng: 7.9235 },
};
const KOELN_MAX_LISTINGS = 100;
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';
const IMG_PARAMS = '?w=960&h=600&fit=fill&fm=jpg&q=85';


// ---------------------------------------------------------------------------
// Language configs — one entry per output file.
// `useHeadline`: German page shows the (German) listing headline as the card
// title; the English page uses a generic English label instead of leaking
// German marketing copy. All other strings mirror the hand-written en/ page.
// ---------------------------------------------------------------------------

const LANGS = [
  {
    code: 'de',
    path: INDEX_PATH,
    fatal: true,
    useHeadline: true,
    titleFallback: 'Immobilie',
    sold: 'Verkauft',
    priceOnRequest: 'Preis auf Anfrage',
    from: 'Ab',
    koelnLabel: 'Immobilienangebote',
    koelnToc: 'Immobilienangebote',
    koelnTitle: 'Immobilienangebote in Köln und im Kölner Umland',
    koelnAria: 'Immobilienangebote Köln',
    koelnAll: 'Alle Immobilienangebote',
  },
  {
    code: 'en',
    path: EN_INDEX_PATH,
    fatal: false,
    useHeadline: false,
    titleFallback: 'Property',
    sold: 'Sold',
    priceOnRequest: 'Price on request',
    from: 'From',
    koelnLabel: 'Properties',
    koelnToc: 'Properties',
    koelnTitle: 'A selection of my property references in Cologne and the surrounding area',
    koelnAria: 'Properties Cologne',
    koelnAll: 'View all listings',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/&/g, '&amp;');
}

function priceString(l, L) {
  if (l.sold) return L.sold;
  if (l.hidePrice) return L.priceOnRequest;
  if (l.priceRaw == null) return L.priceOnRequest;
  const fmt = Number(l.priceRaw).toLocaleString('de-DE');
  return l.priceFrom ? `${L.from} ${fmt} €` : `${fmt} €`;
}


function mapListing(item) {
  const epd = item.exportedPropertyData?.data ?? {};
  return {
    id:        item.sys?.id,
    sold:      item.salesStatus === 'sold',
    hidePrice: !!item.hidePrice,
    priceRaw:  epd.priceFrom ?? epd.price ?? null,
    priceFrom: epd.priceFrom != null,
    headline:  epd.headline ?? null,
    address:   item.displayAddress ?? '',
    imageUrl:  item.featuredImage?.url ?? null,
    url:       `https://www.evernest.com/de/listing/${item.sys?.id}/`,
  };
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

// Umland Nord: Orte zwischen Köln und Düsseldorf, die postalisch schon zu
// 40xxx gehören, geografisch aber ins Kölner Umland passen.
const EXTRA_PLZ = ['40764', '40789']; // Langenfeld (Rheinland), Monheim am Rhein

// Returns true if a listing's address is in the Köln/Rheinland area (PLZ 50xxx–53xxx)
function isKoelnArea(item) {
  const addr = item.displayAddress ?? '';
  const plzMatch = addr.match(/\b(\d{5})\b/);
  if (plzMatch) {
    if (EXTRA_PLZ.includes(plzMatch[1])) return true;
    const prefix = parseInt(plzMatch[1].slice(0, 2), 10);
    return prefix >= 50 && prefix <= 53;
  }
  // Fallback: city name check
  const cities = ['Köln','Leverkusen','Frechen','Brühl','Pulheim','Kerpen',
    'Bergheim','Bedburg','Rommerskirchen','Bergisch Gladbach','Troisdorf',
    'Siegburg','Bonn','Dormagen','Grevenbroich','Erftstadt','Hürth','Wesseling',
    'Langenfeld','Monheim'];
  return cities.some(c => addr.includes(c));
}

async function fetchKoelnListings() {
  // Use the search API with the Köln bounding box.
  // Die API wertet die Bounds aus; zusaetzlich filtern wir per PLZ (50xxx–53xxx),
  // damit die Galerie trotz weitem Kartenausschnitt auf Koeln/Rheinland begrenzt bleibt.
  console.log('Fetching EVERNEST listings via API…');
  const body = JSON.stringify({ bounds: KOELN_BOUNDS, preview: false });
  const res = await fetch(KOELN_SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body,
  });
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
  const json = await res.json();
  const all = json?.searchResults ?? [];
  if (all.length === 0) throw new Error('No listings returned from search API');
  console.log(`API returned ${all.length} total listings`);

  const koeln = all.filter(isKoelnArea);
  console.log(`After Köln/Rheinland filter: ${koeln.length} listings`);

  return koeln
    .map(mapListing)
    // Galerie von teuer zu günstig: aktive vor verkauft, dann Preis absteigend
    // (Objekte ohne Preis / "auf Anfrage" ans Ende).
    .sort((a, b) => {
      if (!!a.sold !== !!b.sold) return a.sold ? 1 : -1;
      return (b.priceRaw ?? 0) - (a.priceRaw ?? 0);
    })
    .slice(0, KOELN_MAX_LISTINGS);
}

// ---------------------------------------------------------------------------
// Card builder
// ---------------------------------------------------------------------------

function buildCard(l, L) {
  const title  = L.useHeadline ? (l.headline || L.titleFallback) : L.titleFallback;
  const price  = priceString(l, L);
  const meta   = l.address ? `${l.address} — ${price}` : price;
  const imgSrc = l.imageUrl ? `${l.imageUrl}${IMG_PARAMS}` : '';
  const badge  = l.sold ? `\n                  <div class="listing-card__badge">${L.sold}</div>` : '';
  return `            <li class="splide__slide">
              <div class="listing-card">
                <a class="listing-card__link" href="${l.url}" target="_blank" rel="noopener">
                  <img class="listing-card__img" src="${imgSrc}" alt="${escapeAttr(title)}" loading="lazy">${badge}
                  <div class="listing-card__overlay">
                    <div class="listing-card__meta">${meta}</div>
                    <div class="listing-card__title">${escapeAttr(title)}</div>
                  </div>
                </a>
              </div>
            </li>`;
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildKoelnSection(listings, L) {
  const shown = listings; // already filtered & limited to KOELN_MAX_LISTINGS

  if (shown.length === 0) {
    return `  <!-- KOELN-LISTINGS-START -->
  <section id="objekte-koeln" data-toc="${L.koelnToc}" class="section section--gray">
    <div class="container">
      <span class="section-label">${L.koelnLabel}</span>
      <h2 class="section-title">${L.koelnTitle}</h2>
      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="${KOELN_OFFICE_URL}" target="_blank" rel="noopener" class="btn btn--gold-outline">${L.koelnAll}</a>
        </div>
      </div>
    </div>
  </section>
  <!-- KOELN-LISTINGS-END -->`;
  }

  const cards = shown.map(l => buildCard(l, L)).join('\n');

  return `  <!-- KOELN-LISTINGS-START -->
  <section id="objekte-koeln" data-toc="${L.koelnToc}" class="section">
    <div class="container">
      <span class="section-label">${L.koelnLabel}</span>
      <h2 class="section-title">${L.koelnTitle}</h2>

      <div class="listings-carousel splide" aria-label="${L.koelnAria}">
        <div class="splide__track">
          <ul class="splide__list">
${cards}
          </ul>
        </div>
      </div>

      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="${KOELN_OFFICE_URL}" target="_blank" rel="noopener" class="btn btn--gold-outline">${L.koelnAll}</a>
        </div>
      </div>
    </div>
  </section>
  <!-- KOELN-LISTINGS-END -->`;
}

// ---------------------------------------------------------------------------
// Inject into HTML
// ---------------------------------------------------------------------------

function replaceBlock(html, startMarker, endMarker, replacement) {
  const si = html.indexOf(startMarker);
  const ei = html.indexOf(endMarker);
  if (si === -1 || ei === -1) throw new Error(`markers ${startMarker} not found`);
  return html.slice(0, html.lastIndexOf('\n', si) + 1)
    + replacement
    + html.slice(ei + endMarker.length);
}

async function injectIntoHtml(path, koelnHtml) {
  let html = await readFile(path, 'utf-8');
  html = replaceBlock(html, '<!-- KOELN-LISTINGS-START -->', '<!-- KOELN-LISTINGS-END -->', koelnHtml);
  await writeFile(path, html, 'utf-8');
}

// ---------------------------------------------------------------------------
// Fetch Evernest Standorte count
// ---------------------------------------------------------------------------

async function fetchStandorteCount() {
  const res = await fetch('https://www.evernest.com/de/ueber-uns/', {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/(\d+)\s*\+?\s*Standort/i);
  if (!m) throw new Error('Standorte count not found on Evernest Über-uns page');
  return parseInt(m[1], 10);
}

async function injectStandorte(standorte) {
  const pattern = /<!-- STANDORTE-COUNT -->(\d+)<!-- \/STANDORTE-COUNT -->/g;
  const replacement = `<!-- STANDORTE-COUNT -->${standorte}<!-- /STANDORTE-COUNT -->`;

  // Update bautraeger.html
  let bt = await readFile(BAUTRAEGER_PATH, 'utf-8');
  if (!pattern.test(bt)) {
    console.warn('Warning: STANDORTE-COUNT marker not found in bautraeger.html — skipping.');
  } else {
    bt = bt.replace(pattern, replacement);
    await writeFile(BAUTRAEGER_PATH, bt, 'utf-8');
    console.log(`bautraeger.html: Standorte → ${standorte}`);
  }

  // Also update index.html + en/index.html if marker exists there
  for (const path of [INDEX_PATH, EN_INDEX_PATH]) {
    let ix = await readFile(path, 'utf-8');
    pattern.lastIndex = 0;
    if (pattern.test(ix)) {
      ix = ix.replace(pattern, replacement);
      await writeFile(path, ix, 'utf-8');
      console.log(`${path}: Standorte → ${standorte}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fetching Koeln search page…');
  let koelnListings = [];
  try {
    koelnListings = await fetchKoelnListings();
    const koelnActive = koelnListings.filter(l => !l.sold).length;
    console.log(`Köln: ${koelnListings.length} listings (${koelnActive} active)`);
  } catch (err) {
    console.warn(`Warning: Could not fetch Köln listings — ${err.message}`);
    console.warn('Köln section will show empty state.');
  }

  // Inject into every language target (German = fatal, English = best-effort).
  for (const L of LANGS) {
    const koelnHtml = buildKoelnSection(koelnListings, L);
    try {
      await injectIntoHtml(L.path, koelnHtml);
      console.log(`${L.path} updated successfully.`);
    } catch (err) {
      if (L.fatal) throw err;
      console.warn(`Warning: Could not update ${L.code} page (${L.path}) — ${err.message}`);
    }
  }

  // Update Standorte count
  console.log('Fetching EVERNEST Standorte count…');
  try {
    const standorte = await fetchStandorteCount();
    console.log(`Standorte: ${standorte}`);
    await injectStandorte(standorte);
  } catch (err) {
    console.warn(`Warning: Could not fetch Standorte count — ${err.message}`);
  }
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
