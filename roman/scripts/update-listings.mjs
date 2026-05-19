/**
 * update-listings.mjs
 * Fetches listings from two EVERNEST sources:
 *   1. Roman Becker's profile  → "Meine Immobilien"
 *   2. EVERNEST Köln team page → "Immobilien meiner Kollegen" (Roman's excluded)
 *
 * Both pages embed all data in __NEXT_DATA__ — no individual listing pages needed.
 * Runs daily via .github/workflows/update-listings.yml
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_PATH = join(__dirname, '..', 'index.html');

const ROMAN_PROFILE_URL = 'https://www.evernest.com/de/unsere-makler/koeln/roman-becker/';
const KOELN_OFFICE_URL  = 'https://www.evernest.com/de/unsere-makler/koeln/';
const KOELN_SEARCH_URL  = 'https://www.evernest.com/api/properties/';
// Bounding box for zoom=11 centred on Köln (50.938361, 6.959974)
const KOELN_BOUNDS = {
  nw: { lat: 51.20, lng: 6.50 },
  ne: { lat: 51.20, lng: 7.42 },
  sw: { lat: 50.68, lng: 6.50 },
  se: { lat: 50.68, lng: 7.42 },
};
const KOELN_MAX_LISTINGS = 55;
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';
const IMG_PARAMS = '?w=960&h=600&fit=fill&fm=jpg&q=85';

const MAX_SOLD = 20;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/&/g, '&amp;');
}

function formatPrice(item) {
  if (item.salesStatus === 'sold') return 'Verkauft';
  if (item.hidePrice) return 'Preis auf Anfrage';
  const epd = item.exportedPropertyData?.data ?? {};
  const val = epd.priceFrom ?? epd.price ?? null;
  if (!val) return 'Preis auf Anfrage';
  const fmt = Number(val).toLocaleString('de-DE');
  return epd.priceFrom ? `Ab ${fmt} €` : `${fmt} €`;
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
  return {
    id:       item.sys?.id,
    sold:     item.salesStatus === 'sold',
    title:    item.exportedPropertyData?.data?.headline ?? 'Immobilie',
    address:  item.displayAddress ?? '',
    price:    formatPrice(item),
    imageUrl: item.featuredImage?.url ?? null,
    url:      `https://www.evernest.com/de/listing/${item.sys?.id}/`,
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

async function fetchKoelnListings(excludeIds) {
  // Fetch via Evernest search API (POST /api/properties/) with Köln bounding box
  const body = JSON.stringify({ bounds: KOELN_BOUNDS, preview: false });
  const res = await fetch(KOELN_SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body,
  });
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
  const json = await res.json();
  const items = json?.searchResults ?? [];
  if (items.length === 0) throw new Error('No listings returned from search API');
  console.log(`Search API returned ${items.length} listings`);

  return items
    .filter(item => item?.salesStatus !== 'sold' && !excludeIds.has(item?.sys?.id))
    .slice(0, KOELN_MAX_LISTINGS)
    .map(mapListing);
}

// ---------------------------------------------------------------------------
// Card builder
// ---------------------------------------------------------------------------

function buildCard({ title, address, price, imageUrl, url, sold }) {
  const meta   = address ? `${address} — ${price}` : price;
  const imgSrc = imageUrl ? `${imageUrl}${IMG_PARAMS}` : '';
  const badge  = sold ? '\n                  <div class="listing-card__badge">Verkauft</div>' : '';

  return `            <li class="splide__slide">
              <div class="listing-card">
                <a class="listing-card__link" href="${url}" target="_blank" rel="noopener">
                  <img class="listing-card__img" src="${imgSrc}" alt="${escapeAttr(title)}" loading="lazy">${badge}
                  <div class="listing-card__overlay">
                    <div class="listing-card__meta">${meta}</div>
                    <div class="listing-card__title">${title}</div>
                  </div>
                </a>
              </div>
            </li>`;
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildRomanSection(listings) {
  const active = listings.filter(l => !l.sold);
  const sold   = listings.filter(l => l.sold).slice(0, MAX_SOLD);
  const shown  = [...active, ...sold];

  if (shown.length === 0) {
    return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Mein Portfolio</span>
      <h2 class="section-title">Meine Immobilien (Auswahl)</h2>
      <p class="section-subtitle">Aktuell keine Objekte verfügbar — kontaktieren Sie mich für Off-Market Angebote.</p>
      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="#kontakt" class="btn btn--primary">Beratungsgespräch vereinbaren</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->`;
  }

  const cards = shown.map(buildCard).join('\n');

  return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Mein Portfolio</span>
      <h2 class="section-title">Meine Immobilien (Auswahl)</h2>
      <p class="section-subtitle">Entdecken Sie mein Portfolio bei EVERNEST (Auswahl)</p>

      <div class="listings-carousel splide" aria-label="Meine Immobilienangebote">
        <div class="splide__track">
          <ul class="splide__list">
${cards}
          </ul>
        </div>
      </div>

      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="${ROMAN_PROFILE_URL}" target="_blank" rel="noopener" class="btn btn--gold-outline">Alle meine Objekte bei EVERNEST</a>
          <a href="#kontakt" class="btn btn--primary">Beratungsgespräch vereinbaren</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->`;
}

function buildKoelnSection(listings) {
  const shown = listings; // already filtered & limited to KOELN_MAX_LISTINGS

  if (shown.length === 0) {
    return `  <!-- KOELN-LISTINGS-START -->
  <section id="objekte-koeln" class="section">
    <div class="container">
      <span class="section-label">EVERNEST Köln</span>
      <h2 class="section-title">Unsere Immobilienreferenzen in Köln und im Umland (Auswahl)</h2>
      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="${KOELN_OFFICE_URL}" target="_blank" rel="noopener" class="btn btn--gold-outline">Alle Objekte bei EVERNEST Köln</a>
        </div>
      </div>
    </div>
  </section>
  <!-- KOELN-LISTINGS-END -->`;
  }

  const cards = shown.map(buildCard).join('\n');

  return `  <!-- KOELN-LISTINGS-START -->
  <section id="objekte-koeln" class="section">
    <div class="container">
      <span class="section-label">EVERNEST Köln</span>
      <h2 class="section-title">Unsere Immobilienreferenzen in Köln und im Umland (Auswahl)</h2>

      <div class="listings-carousel splide" aria-label="EVERNEST Köln Portfolio">
        <div class="splide__track">
          <ul class="splide__list">
${cards}
          </ul>
        </div>
      </div>

      <div class="objekte__cta">
        <div class="objekte__buttons">
          <a href="${KOELN_OFFICE_URL}" target="_blank" rel="noopener" class="btn btn--gold-outline">Alle Objekte bei EVERNEST Köln</a>
        </div>
      </div>
    </div>
  </section>
  <!-- KOELN-LISTINGS-END -->`;
}

// ---------------------------------------------------------------------------
// Inject into HTML
// ---------------------------------------------------------------------------

async function injectIntoHtml(romanHtml, koelnHtml, activeCount) {
  let html = await readFile(INDEX_PATH, 'utf-8');

  // Inject Roman's section
  const S1 = '<!-- LISTINGS-START -->';
  const E1 = '<!-- LISTINGS-END -->';
  const si1 = html.indexOf(S1);
  const ei1 = html.indexOf(E1);
  if (si1 === -1 || ei1 === -1) throw new Error('LISTINGS markers not found');
  html = html.slice(0, html.lastIndexOf('\n', si1) + 1)
    + romanHtml
    + html.slice(ei1 + E1.length);

  // Inject Köln section
  const S2 = '<!-- KOELN-LISTINGS-START -->';
  const E2 = '<!-- KOELN-LISTINGS-END -->';
  const si2 = html.indexOf(S2);
  const ei2 = html.indexOf(E2);
  if (si2 === -1 || ei2 === -1) throw new Error('KOELN-LISTINGS markers not found');
  html = html.slice(0, html.lastIndexOf('\n', si2) + 1)
    + koelnHtml
    + html.slice(ei2 + E2.length);

  // Update trust bar
  html = html.replace(
    /<!-- TRUST-ACTIVE-COUNT -->\d+<!-- \/TRUST-ACTIVE-COUNT -->/,
    `<!-- TRUST-ACTIVE-COUNT -->${activeCount}<!-- /TRUST-ACTIVE-COUNT -->`
  );

  await writeFile(INDEX_PATH, html, 'utf-8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fetching Roman Becker profile…');
  const romanListings = await fetchRomanListings();
  const romanIds = new Set(romanListings.map(l => l.id));
  const romanActive = romanListings.filter(l => !l.sold).length;
  console.log(`Roman: ${romanListings.length} listings (${romanActive} active)`);

  console.log('Fetching EVERNEST Köln office page…');
  let koelnListings = [];
  try {
    koelnListings = await fetchKoelnListings(romanIds);
    const koelnActive = koelnListings.filter(l => !l.sold).length;
    console.log(`Köln colleagues: ${koelnListings.length} listings (${koelnActive} active)`);
  } catch (err) {
    console.warn(`Warning: Could not fetch Köln listings — ${err.message}`);
    console.warn('Köln section will show empty state.');
  }

  const romanHtml = buildRomanSection(romanListings);
  const koelnHtml = buildKoelnSection(koelnListings);

  await injectIntoHtml(romanHtml, koelnHtml, romanActive);
  console.log('index.html updated successfully.');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
