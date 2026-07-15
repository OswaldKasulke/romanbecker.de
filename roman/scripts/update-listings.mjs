/**
 * update-listings.mjs
 * Fetches listings from two EVERNEST sources:
 *   1. Roman Becker's profile  → "Meine Immobilien"
 *   2. EVERNEST Köln team page → "Immobilien meiner Kollegen" (Roman's excluded)
 *
 * Both pages embed all data in __NEXT_DATA__ — no individual listing pages needed.
 * Writes the same listings into the German index.html AND the English en/index.html
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

const ROMAN_PROFILE_URL = 'https://www.evernest.com/de/unsere-makler/koeln/roman-becker/';
const KOELN_OFFICE_URL  = 'https://www.evernest.com/de/search/?lat=50.938361&lng=6.959974&zoom=11';
const KOELN_SEARCH_URL  = 'https://www.evernest.com/api/properties/';
// Bounding box for zoom=11 centred on Köln (50.938361, 6.959974)
const KOELN_BOUNDS = {
  nw: { lat: 51.20, lng: 6.50 },
  ne: { lat: 51.20, lng: 7.42 },
  sw: { lat: 50.68, lng: 6.50 },
  se: { lat: 50.68, lng: 7.42 },
};
const KOELN_MAX_LISTINGS = 100;
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';
const IMG_PARAMS = '?w=960&h=600&fit=fill&fm=jpg&q=85';

const MAX_SOLD = 20;

// Listings pinned to the front of "Meine Immobilien" (in this order).
// If Roman's Evernest profile doesn't include one, it is pulled from the
// Köln search results instead.
const PINNED_ROMAN_IDS = [
  '5sbhUeXVmLizAAbmOfaZv8', // Apotheke Köln-Marienburg (Gewerbeeinheit, 986.500 €)
];

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
    romanLabel: 'Mein Portfolio',
    romanTitle: 'Meine Immobilien (Auswahl)',
    romanSubtitle: 'Entdecken Sie mein Portfolio bei EVERNEST (Auswahl)',
    romanEmpty: 'Aktuell keine Objekte verfügbar — kontaktieren Sie mich für Off-Market Angebote.',
    romanAria: 'Meine Immobilienangebote',
    consultCta: 'Beratungsgespräch vereinbaren',
    koelnLabel: 'EVERNEST Köln',
    koelnTitle: 'Unsere Immobilienreferenzen in Köln und im Umland (Auswahl)',
    koelnAria: 'EVERNEST Köln Portfolio',
    koelnAll: 'Alle Objekte bei EVERNEST Köln',
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
    romanLabel: 'My Portfolio',
    romanTitle: 'My Properties (Selection)',
    romanSubtitle: 'Discover a selection of my portfolio at EVERNEST',
    romanEmpty: 'No properties available right now — contact me for off-market opportunities.',
    romanAria: 'My property listings',
    consultCta: 'Schedule a Consultation',
    koelnLabel: 'EVERNEST Cologne',
    koelnTitle: 'A selection of our property references in Cologne and the surrounding area',
    koelnAria: 'EVERNEST Cologne Portfolio',
    koelnAll: 'All listings at EVERNEST Cologne',
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

function extractItems(data) {
  const pageProps = data?.props?.pageProps;
  const candidates = [
    pageProps?.data?.propertyCollection?.items,
    pageProps?.data?.broker?.propertyCollection?.items,
    pageProps?.data?.cityBroker?.propertyCollection?.items,
    pageProps?.data?.city?.propertyCollection?.items,
    pageProps?.data?.properties,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c;
  }
  return null;
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

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const html = await res.text();
  const match = html.match(/id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error(`__NEXT_DATA__ not found in ${url}`);
  return JSON.parse(match[1]);
}

async function fetchRomanListings() {
  const data = await fetchPage(ROMAN_PROFILE_URL);
  const items = extractItems(data);
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('propertyCollection.items not found on Roman profile page');
  }
  return items.map(mapListing);
}

// Returns true if a listing's address is in the Köln/Rheinland area (PLZ 50xxx–53xxx)
function isKoelnArea(item) {
  const addr = item.displayAddress ?? '';
  const plzMatch = addr.match(/\b(\d{5})\b/);
  if (plzMatch) {
    const prefix = parseInt(plzMatch[1].slice(0, 2), 10);
    return prefix >= 50 && prefix <= 53;
  }
  // Fallback: city name check
  const cities = ['Köln','Leverkusen','Frechen','Brühl','Pulheim','Kerpen',
    'Bergheim','Bedburg','Rommerskirchen','Bergisch Gladbach','Troisdorf',
    'Siegburg','Bonn','Dormagen','Grevenbroich','Erftstadt','Hürth','Wesseling'];
  return cities.some(c => addr.includes(c));
}

async function fetchKoelnListings() {
  // Use the search API with the Köln bounding box.
  // The API ignores the bounds, so we filter client-side by PLZ (50xxx–53xxx).
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
    .slice(0, KOELN_MAX_LISTINGS)
    .map(mapListing);
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
  const pinnedAttr = PINNED_ROMAN_IDS.includes(l.id) ? ' data-pinned="1"' : '';

  return `            <li class="splide__slide"${pinnedAttr}>
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

function buildRomanSection(listings, L) {
  const active = listings.filter(l => !l.sold);
  const sold   = listings.filter(l => l.sold).slice(0, MAX_SOLD);
  const shown  = [...active, ...sold];

  if (shown.length === 0) {
    return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section">
    <div class="container">
      <span class="section-label">${L.romanLabel}</span>
      <h2 class="section-title">${L.romanTitle}</h2>
      <p class="section-subtitle">${L.romanEmpty}</p>
      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="#kontakt" class="btn btn--primary">${L.consultCta}</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->`;
  }

  const cards = shown.map(l => buildCard(l, L)).join('\n');

  return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">${L.romanLabel}</span>
      <h2 class="section-title">${L.romanTitle}</h2>
      <p class="section-subtitle">${L.romanSubtitle}</p>

      <div class="listings-carousel splide" aria-label="${L.romanAria}">
        <div class="splide__track">
          <ul class="splide__list">
${cards}
          </ul>
        </div>
      </div>

      <div class="objekte__cta">
        <div class="objekte__buttons" style="justify-content:center">
          <a href="#kontakt" class="btn btn--primary">${L.consultCta}</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->`;
}

function buildKoelnSection(listings, L) {
  const shown = listings; // already filtered & limited to KOELN_MAX_LISTINGS

  if (shown.length === 0) {
    return `  <!-- KOELN-LISTINGS-START -->
  <section id="objekte-koeln" class="section section--gray">
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
  <section id="objekte-koeln" class="section">
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

async function injectIntoHtml(path, romanHtml, koelnHtml, activeCount) {
  let html = await readFile(path, 'utf-8');
  // "Meine Immobilien (Auswahl)"-Sektion wurde bewusst entfernt (Kunden konnten
  // eigene vs. EVERNEST-Objekte nicht differenzieren). Marker existieren nicht mehr,
  // daher hier NICHT mehr ersetzen. (romanHtml bleibt ungenutzt.)
  html = replaceBlock(html, '<!-- KOELN-LISTINGS-START -->', '<!-- KOELN-LISTINGS-END -->', koelnHtml);

  // Update trust bar (no-op if the marker isn't present in this file)
  html = html.replace(
    /<!-- TRUST-ACTIVE-COUNT -->\d+<!-- \/TRUST-ACTIVE-COUNT -->/,
    `<!-- TRUST-ACTIVE-COUNT -->${activeCount}<!-- /TRUST-ACTIVE-COUNT -->`
  );

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
  console.log('Fetching Roman Becker profile…');
  let romanListings = await fetchRomanListings();

  console.log('Fetching EVERNEST Köln search page…');
  let koelnListings = [];
  try {
    koelnListings = await fetchKoelnListings();
    const koelnActive = koelnListings.filter(l => !l.sold).length;
    console.log(`Köln: ${koelnListings.length} listings (${koelnActive} active)`);
  } catch (err) {
    console.warn(`Warning: Could not fetch Köln listings — ${err.message}`);
    console.warn('Köln section will show empty state.');
  }

  // Roman section order: pinned listings first (added from the Köln results
  // if his profile lacks them), then active by price descending, then sold
  // in source order (buildRomanSection slices the first MAX_SOLD of those).
  for (const id of PINNED_ROMAN_IDS) {
    if (!romanListings.some(l => l.id === id)) {
      const extra = koelnListings.find(l => l.id === id);
      if (extra) romanListings.push(extra);
      else console.warn(`Warning: pinned listing ${id} not found in profile or Köln results`);
    }
  }
  const pinned = PINNED_ROMAN_IDS
    .map(id => romanListings.find(l => l.id === id && !l.sold))
    .filter(Boolean);
  const activeRest = romanListings
    .filter(l => !l.sold && !pinned.includes(l))
    .sort((a, b) => (b.priceRaw ?? 0) - (a.priceRaw ?? 0));
  const soldListings = romanListings.filter(l => l.sold);
  romanListings = [...pinned, ...activeRest, ...soldListings];

  const romanActive = pinned.length + activeRest.length;
  console.log(`Roman: ${romanListings.length} listings (${romanActive} active, ${pinned.length} pinned)`);

  // Inject into every language target (German = fatal, English = best-effort).
  for (const L of LANGS) {
    const romanHtml = buildRomanSection(romanListings, L);
    const koelnHtml = buildKoelnSection(koelnListings, L);
    try {
      await injectIntoHtml(L.path, romanHtml, koelnHtml, romanActive);
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
