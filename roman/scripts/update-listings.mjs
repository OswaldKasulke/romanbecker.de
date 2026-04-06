/**
 * update-listings.mjs
 * Fetches Roman Becker's active Evernest listings and injects them into index.html.
 * ZERO dependencies — Node 20 native fetch only.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_PATH = join(__dirname, '..', 'index.html');

const PROFILE_URL = 'https://www.evernest.com/de/unsere-makler/koeln/roman-becker/';
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';
const IMG_PARAMS = '?w=640&h=400&fit=fill&fm=jpg&q=80';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeAlt(str) {
  return str.replace(/"/g, '&quot;');
}

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

function extractPrice(property) {
  const epd = property?.exportedPropertyData?.data;

  // 1) Look in exportedPropertyData.data array (if it's an array) for "Kaufpreis" or "Preis"
  if (Array.isArray(epd)) {
    for (const item of epd) {
      if (item.label === 'Kaufpreis' || item.label === 'Preis') {
        return item.value;
      }
    }
  }

  // 2) exportedPropertyData.data.price (numeric) — Evernest Contentful structure
  if (epd?.price != null) {
    return formatPrice(epd.price);
  }

  // 3) Fallback: property.price
  if (property?.price != null) {
    return formatPrice(property.price);
  }
  return null;
}

function buildLocation(property) {
  const epd = property?.exportedPropertyData?.data;

  // Try displayAddress first (format: "Stadt, PLZ")
  if (property?.displayAddress) {
    return property.displayAddress;
  }

  // Fallback: build from epd fields
  const parts = [];
  if (epd?.zipCode) parts.push(epd.zipCode);
  if (epd?.city) parts.push(epd.city);
  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Fetch with User-Agent
// ---------------------------------------------------------------------------

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ---------------------------------------------------------------------------
// Step 1 — Get listing URLs from profile page
// ---------------------------------------------------------------------------

async function getListingUrls() {
  const html = await fetchPage(PROFILE_URL);
  const pattern = /\/de\/listing\/[^/"]+\//g;
  const matches = html.match(pattern) || [];
  // Deduplicate
  const unique = [...new Set(matches)];
  return unique.map((path) => `https://www.evernest.com${path}`);
}

// ---------------------------------------------------------------------------
// Step 2 — Parse a single listing page
// ---------------------------------------------------------------------------

async function parseListing(url) {
  const html = await fetchPage(url);

  // Extract __NEXT_DATA__ JSON
  const startTag = '<script id="__NEXT_DATA__" type="application/json">';
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) throw new Error('No __NEXT_DATA__ found');
  const jsonStart = startIdx + startTag.length;
  const jsonEnd = html.indexOf('</script>', jsonStart);
  if (jsonEnd === -1) throw new Error('Malformed __NEXT_DATA__');

  const data = JSON.parse(html.slice(jsonStart, jsonEnd));
  // Evernest uses pageProps.data.property (Contentful-backed Next.js)
  const property = data?.props?.pageProps?.data?.property
    ?? data?.props?.pageProps?.property;
  if (!property) throw new Error('No property data');

  // Filter sold — Evernest uses "salesStatus" field
  const status = property.salesStatus ?? property.status;
  if (status === 'sold') return null;

  const epd = property.exportedPropertyData?.data;
  const title = epd?.headline || property.headline || property.title || 'Immobilie';
  const price = extractPrice(property);
  const location = buildLocation(property);
  const imageUrl = property.featuredImage?.url;

  return { title, price, location, imageUrl, url };
}

// ---------------------------------------------------------------------------
// Step 3 — Build HTML
// ---------------------------------------------------------------------------

function buildCard({ title, price, location, imageUrl, url }) {
  const meta = price ? `${location} — ${price}` : location;
  const imgSrc = imageUrl ? `${imageUrl}${IMG_PARAMS}` : '';
  const alt = escapeAlt(title);

  return `        <div class="listing-card">
          <a class="listing-card__link" href="${url}" target="_blank" rel="noopener">
            <img class="listing-card__img" src="${imgSrc}" alt="${alt}" loading="lazy">
            <div class="listing-card__overlay">
              <div class="listing-card__meta">${meta}</div>
              <div class="listing-card__title">${title}</div>
            </div>
          </a>
        </div>`;
}

function buildSection(listings) {
  const n = listings.length;

  if (n === 0) {
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

  const cards = listings.map(buildCard).join('\n');
  const objektText = n === 1 ? 's Objekt' : ' Objekte';

  return `  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Immobilienangebote</span>
      <h2 class="section-title">Aktuelle Immobilienangebote</h2>
      <p class="section-subtitle">Entdecken Sie mein aktuelles Portfolio bei EVERNEST — von der Erstbesichtigung bis zum Notartermin.</p>

      <div class="grid-3">
${cards}
      </div>

      <div class="objekte__cta">
        <p class="objekte__trust">${n} aktuelle${objektText} in Köln &amp; Umland — von der Erstberatung bis zum Notar.</p>
        <div class="objekte__buttons">
          <a href="https://www.evernest.com/de/unsere-makler/koeln/roman-becker/" target="_blank" rel="noopener" class="btn btn--outline">Alle Objekte ansehen</a>
          <a href="#kontakt" class="btn btn--primary">Beratungsgespräch vereinbaren</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->`;
}

// ---------------------------------------------------------------------------
// Step 4 — Inject into index.html
// ---------------------------------------------------------------------------

async function injectIntoHtml(sectionHtml) {
  const html = await readFile(INDEX_PATH, 'utf-8');

  const startMarker = '<!-- LISTINGS-START -->';
  const endMarker = '<!-- LISTINGS-END -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('ERROR: Markers <!-- LISTINGS-START --> / <!-- LISTINGS-END --> not found in index.html');
    process.exit(1);
  }

  // Find the whitespace before the start marker to preserve indentation
  const before = html.slice(0, html.lastIndexOf('\n', startIdx) + 1);
  const after = html.slice(endIdx + endMarker.length);

  const updated = before + sectionHtml + after;
  await writeFile(INDEX_PATH, updated, 'utf-8');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fetching Evernest profile...');

  let listingUrls;
  try {
    listingUrls = await getListingUrls();
  } catch (err) {
    console.error(`ERROR: Could not reach Evernest profile — ${err.message}`);
    process.exit(1);
  }

  console.log(`Found ${listingUrls.length} listing URL(s).`);

  // Fetch all listings in parallel
  const results = await Promise.allSettled(listingUrls.map(parseListing));

  const listings = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null) {
      listings.push(result.value);
    } else if (result.status === 'rejected') {
      console.warn(`  Skipped listing: ${result.reason.message}`);
    }
  }

  console.log(`${listings.length} active listing(s) after filtering.`);

  const sectionHtml = buildSection(listings);
  await injectIntoHtml(sectionHtml);

  console.log('index.html updated successfully.');
}

main();
