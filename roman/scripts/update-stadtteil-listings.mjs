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
const OFFICE_URL = 'https://www.evernest.com/de/search/?lat=50.938361&lng=6.959974&zoom=11';
const KOELN_BOUNDS = {
  nw: { lat: 51.20, lng: 6.50 },
  ne: { lat: 51.20, lng: 7.42 },
  sw: { lat: 50.68, lng: 6.50 },
  se: { lat: 50.68, lng: 7.42 },
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
    propertyType: epd.propertyType ?? null,
    address: item.displayAddress ?? '',
    imageUrl: item.featuredImage?.url ?? null,
    url: `https://www.evernest.com/de/listing/${item.sys?.id}/`,
  };
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

  return `        <a class="listing-card" href="${escapeAttr(l.url)}" target="_blank" rel="noopener">
          <div class="listing-card__imgwrap">
            ${imgTag}${badge}
          </div>
          <div class="listing-card__body">
            <span class="listing-card__type">${escapeAttr(type)}</span>
            <span class="listing-card__title">${escapeAttr(title)}</span>
            ${factsStr ? `<span class="listing-card__facts">${escapeAttr(factsStr)}</span>` : ''}
            <span class="listing-card__price">${priceString(l)}</span>
          </div>
        </a>`;
}

function buildSection(display, listings) {
  // Active first, then reserved, then sold (references)
  const order = (l) => (l.sold ? 2 : l.reserved ? 1 : 0);
  const sorted = [...listings].sort((a, b) => order(a) - order(b));
  const cards = sorted.map(buildCard).join('\n');
  const count = listings.length;
  const noun = count === 1 ? 'Objekt' : 'Objekte';
  return `${START}
  <section id="aktuelle-angebote" class="section section--gray">
    <div class="container">
      <span class="section-label">Aktuelle Angebote</span>
      <h2>Aktuelle Immobilienangebote in ${escapeAttr(display)}</h2>
      <p class="max-w-prose mb-8">${count} ${noun} aus dem EVERNEST-Netzwerk in ${escapeAttr(display)} und Umgebung – jetzt ansehen. Kein passendes Objekt dabei? Ich finde diskret auch Off-Market-Immobilien für Sie.</p>
      <div class="listings__grid">
${cards}
      </div>
      <div class="cta-buttons" style="margin-top:var(--space-8)">
        <a href="${OFFICE_URL}" class="btn btn--primary" target="_blank" rel="noopener">Alle Objekte im EVERNEST-Netzwerk</a>
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
    return html.slice(0, lineStart) + section + '\n' + html.slice(ei + END.length).replace(/^[^\n]*\n?/, '\n').replace(/^\n/, '\n');
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
