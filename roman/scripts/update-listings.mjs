/**
 * update-listings.mjs
 * Fetches Roman Becker's current listings from EVERNEST.
 *
 * Strategy: 1 HTTP request to the broker profile page.
 * All listing data (title, price, image, status) is embedded in __NEXT_DATA__.
 * No individual listing pages fetched — fast, robust, no rate-limit risk.
 *
 * Replaces <!-- LISTINGS-START --> ... <!-- LISTINGS-END --> in index.html.
 * Runs daily via .github/workflows/update-listings.yml
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_PATH = join(__dirname, '..', 'index.html');

const PROFILE_URL = 'https://www.evernest.com/de/unsere-makler/koeln/roman-becker/';
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';
const IMG_PARAMS = '?w=960&h=600&fit=fill&fm=jpg&q=85';

// Max sold listings to show in carousel
const MAX_SOLD = 50;

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
  return epd.priceFrom ? `Ab\u00a0${fmt}\u00a0€` : `${fmt}\u00a0€`;
}

// ---------------------------------------------------------------------------
// Step 1 — Fetch profile page & extract all listings from __NEXT_DATA__
// ---------------------------------------------------------------------------

async function fetchListings() {
  const res = await fetch(PROFILE_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const match = html.match(/id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error('__NEXT_DATA__ not found in page');

  const data = JSON.parse(match[1]);
  const items = data?.props?.pageProps?.data?.propertyCollection?.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('propertyCollection.items not found or empty');
  }

  return items.map(item => ({
    id:       item.sys?.id,
    sold:     item.salesStatus === 'sold',
    title:    item.exportedPropertyData?.data?.headline ?? 'Immobilie',
    address:  item.displayAddress ?? '',
    price:    formatPrice(item),
    imageUrl: item.featuredImage?.url ?? null,
    url:      `https://www.evernest.com/de/listing/${item.sys?.id}/`,
  }));
}

// ---------------------------------------------------------------------------
// Step 2 — Build HTML
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

function buildSection(listings) {
  // Active first, then max MAX_SOLD sold listings
  const active = listings.filter(l => !l.sold);
  const sold   = listings.filter(l => l.sold).slice(0, MAX_SOLD);
  const shown  = [...active, ...sold];

  if (shown.length === 0) {
    return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Immobilienangebote</span>
      <h2 class="section-title">Aktuelle Immobilienangebote</h2>
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

  const totalSold = listings.filter(l => l.sold).length;
  const trustText = totalSold > 0
    ? `${active.length} aktuelle &amp; ${totalSold} erfolgreich vermittelte Objekte in Köln &amp; Umland`
    : `${active.length} aktuelle Objekte in Köln &amp; Umland`;

  const cards = shown.map(buildCard).join('\n');

  return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Immobilienangebote</span>
      <h2 class="section-title">Immobilienangebote</h2>
      <p class="section-subtitle">Entdecken Sie mein Portfolio bei EVERNEST — von der Erstbesichtigung bis zum Notartermin.</p>

      <div class="listings-carousel splide" aria-label="Immobilienangebote">
        <div class="splide__track">
          <ul class="splide__list">
${cards}
          </ul>
        </div>
      </div>

      <div class="objekte__cta">
        <p class="objekte__trust">${trustText} — von der Erstberatung bis zum Notar.</p>
        <div class="objekte__buttons">
          <a href="${PROFILE_URL}" target="_blank" rel="noopener" class="btn btn--outline">Alle Objekte bei EVERNEST</a>
          <a href="#kontakt" class="btn btn--primary">Beratungsgespräch vereinbaren</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->`;
}

// ---------------------------------------------------------------------------
// Step 3 — Inject into index.html
// ---------------------------------------------------------------------------

async function injectIntoHtml(sectionHtml, activeCount) {
  let html = await readFile(INDEX_PATH, 'utf-8');

  // Update listings section
  const START = '<!-- LISTINGS-START -->';
  const END   = '<!-- LISTINGS-END -->';
  const si = html.indexOf(START);
  const ei = html.indexOf(END);

  if (si === -1 || ei === -1) {
    throw new Error('Markers <!-- LISTINGS-START --> / <!-- LISTINGS-END --> not found in index.html');
  }

  html = html.slice(0, html.lastIndexOf('\n', si) + 1)
    + sectionHtml
    + html.slice(ei + END.length);

  // Update trust bar active count
  html = html.replace(
    /<!-- TRUST-ACTIVE-COUNT -->\d+<!-- \/TRUST-ACTIVE-COUNT -->/,
    `<!-- TRUST-ACTIVE-COUNT -->${activeCount}<!-- /TRUST-ACTIVE-COUNT -->`
  );

  await writeFile(INDEX_PATH, html, 'utf-8');
}

// ---------------------------------------------------------------------------
// Main — single HTTP request, no rate-limit risk
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fetching EVERNEST profile page…');

  const listings = await fetchListings();
  const active = listings.filter(l => !l.sold).length;
  const sold   = listings.filter(l =>  l.sold).length;
  console.log(`Found ${listings.length} listings: ${active} active, ${sold} sold.`);

  const sectionHtml = buildSection(listings);
  await injectIntoHtml(sectionHtml, active);

  console.log('index.html updated successfully.');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
