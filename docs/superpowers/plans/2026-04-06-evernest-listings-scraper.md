# Evernest-Listings Scraper — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatische Synchronisation von Romans Evernest-Listings auf seine Website — mit Bildern, täglichem Update per GitHub Action.

**Architecture:** Ein Node.js Script (`update-listings.mjs`) scrapt Romans Evernest-Profilseite, sammelt alle Listing-URLs, fetcht jede Listing-Seite und extrahiert Daten aus dem `__NEXT_DATA__` JSON. Die generierten HTML-Cards ersetzen einen markierten Bereich in `index.html`. Eine GitHub Action führt das Script täglich aus und deployed per FTP.

**Tech Stack:** Node.js 20 (native fetch, kein npm), GitHub Actions, SamKirkland/FTP-Deploy-Action

---

### Task 1: HTML-Marker und neues CSS in index.html einfügen

**Files:**
- Modify: `roman/index.html:939-991` (CSS Referenzobjekte-Bereich)
- Modify: `roman/index.html:1703-1765` (HTML Referenzobjekte-Sektion)

- [ ] **Step 1: Altes Listing-Card CSS durch neues Bild-Card CSS ersetzen**

In `roman/index.html`, den CSS-Block ab Zeile 939 (`/* REFERENZOBJEKTE */`) bis Zeile 991 (`.objekte__cta`) ersetzen durch:

```css
    /* ===========================
       IMMOBILIENANGEBOTE
    =========================== */
    .listing-card {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: box-shadow var(--transition), transform var(--transition);
      aspect-ratio: 16 / 10;
    }

    .listing-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .listing-card__link {
      display: block;
      width: 100%;
      height: 100%;
      text-decoration: none;
      color: var(--white);
    }

    .listing-card__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .listing-card:hover .listing-card__img {
      transform: scale(1.05);
    }

    .listing-card__overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: var(--space-6);
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
    }

    .listing-card__meta {
      font-size: 0.8125rem;
      font-weight: 500;
      opacity: 0.85;
      margin-bottom: var(--space-1);
    }

    .listing-card__title {
      font-size: 1.0625rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .objekte__cta {
      text-align: center;
      margin-top: var(--space-12);
    }

    .objekte__trust {
      font-size: 1.0625rem;
      color: var(--gray-600);
      margin-bottom: var(--space-6);
    }

    .objekte__buttons {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      flex-wrap: wrap;
    }
```

- [ ] **Step 2: Alte HTML-Sektion durch Marker-Sektion ersetzen**

In `roman/index.html`, den Block von Zeile 1703 (`<!-- REFERENZOBJEKTE -->`) bis Zeile 1765 (`</section>`) ersetzen durch:

```html
  <!-- LISTINGS-START -->
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Immobilienangebote</span>
      <h2 class="section-title">Aktuelle Immobilienangebote</h2>
      <p class="section-subtitle">Entdecken Sie mein aktuelles Portfolio bei EVERNEST — von der Erstbesichtigung bis zum Notartermin.</p>

      <div class="grid-3">
        <div class="listing-card">
          <a class="listing-card__link" href="https://www.evernest.com/de/unsere-makler/koeln/roman-becker/" target="_blank" rel="noopener">
            <img class="listing-card__img" src="https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg?w=640&h=400&fit=fill&fm=jpg&q=80" alt="Immobilienangebote Roman Becker" loading="lazy">
            <div class="listing-card__overlay">
              <div class="listing-card__meta">Listings werden geladen…</div>
              <div class="listing-card__title">Bitte warten</div>
            </div>
          </a>
        </div>
      </div>

      <div class="objekte__cta">
        <p class="objekte__trust">Aktuelle Objekte in Köln &amp; Umland — von der Erstberatung bis zum Notar.</p>
        <div class="objekte__buttons">
          <a href="https://www.evernest.com/de/unsere-makler/koeln/roman-becker/" target="_blank" rel="noopener" class="btn btn--outline">Alle Objekte ansehen</a>
          <a href="#kontakt" class="btn btn--primary">Beratungsgespräch vereinbaren</a>
        </div>
      </div>
    </div>
  </section>
  <!-- LISTINGS-END -->
```

- [ ] **Step 3: Im Browser prüfen**

Öffne `roman/index.html` lokal im Browser. Die Sektion sollte:
- Den Platzhalter-Card mit Romans Bild zeigen
- Zwei Buttons nebeneinander (outline + gold)
- Trust-Line darüber
- Responsive: 1 Spalte mobil, 2 Tablet, 3 Desktop

- [ ] **Step 4: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): add listing card image styles and HTML markers for scraper"
```

---

### Task 2: Scraper-Script erstellen

**Files:**
- Create: `roman/scripts/update-listings.mjs`

- [ ] **Step 1: Script-Datei erstellen**

Erstelle `roman/scripts/update-listings.mjs`:

```javascript
#!/usr/bin/env node

/**
 * Scrapes Roman Becker's Evernest profile for active listings
 * and updates the listing cards in index.html.
 *
 * Zero dependencies — uses Node 20 native fetch.
 * Run: node roman/scripts/update-listings.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const INDEX_PATH = join(__dirname, '..', 'index.html');

const PROFILE_URL = 'https://www.evernest.com/de/unsere-makler/koeln/roman-becker/';
const EVERNEST_BASE = 'https://www.evernest.com';
const IMG_PARAMS = '?w=640&h=400&fit=fill&fm=jpg&q=80';

const START_MARKER = '<!-- LISTINGS-START -->';
const END_MARKER = '<!-- LISTINGS-END -->';

// --- Fetch helpers ---

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)' },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  return res.text();
}

async function fetchListingUrls() {
  const html = await fetchText(PROFILE_URL);
  const matches = html.matchAll(/href="(\/de\/listing\/[^"]+)"/g);
  const urls = [...new Set([...matches].map(m => EVERNEST_BASE + m[1]))];
  console.log(`Found ${urls.length} listing URLs`);
  return urls;
}

async function fetchListingData(url) {
  try {
    const html = await fetchText(url);
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
    if (!match) {
      console.warn(`No __NEXT_DATA__ found: ${url}`);
      return null;
    }

    const json = JSON.parse(match[1]);
    const property = json?.props?.pageProps?.data?.property;
    if (!property) {
      console.warn(`No property data: ${url}`);
      return null;
    }

    const status = property.status || 'unknown';
    if (status === 'sold') return null;

    const price = extractPrice(property);
    const location = [property.city, property.zipCode].filter(Boolean).join(', ');
    const image = property.featuredImage?.url;

    if (!image) {
      console.warn(`No image: ${url}`);
      return null;
    }

    return {
      title: property.headline || 'Immobilienangebot',
      price,
      location,
      image: image + IMG_PARAMS,
      link: url,
      status,
    };
  } catch (err) {
    console.warn(`Error fetching ${url}: ${err.message}`);
    return null;
  }
}

function extractPrice(property) {
  const data = property.exportedPropertyData?.data;
  if (!data) return null;

  const priceField = data.find(d => d.label === 'Kaufpreis' || d.label === 'Preis');
  if (priceField?.value) return priceField.value;

  if (property.price) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price);
  }
  return null;
}

// --- HTML generation ---

function buildCard(listing) {
  const meta = [listing.location, listing.price].filter(Boolean).join(' — ');
  const alt = listing.title.replace(/"/g, '&quot;');
  return `        <div class="listing-card">
          <a class="listing-card__link" href="${listing.link}" target="_blank" rel="noopener">
            <img class="listing-card__img" src="${listing.image}" alt="${alt}" loading="lazy">
            <div class="listing-card__overlay">
              <div class="listing-card__meta">${meta}</div>
              <div class="listing-card__title">${listing.title}</div>
            </div>
          </a>
        </div>`;
}

function buildSection(listings) {
  const count = listings.length;

  if (count === 0) {
    return `  ${START_MARKER}
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
  ${END_MARKER}`;
  }

  const cards = listings.map(buildCard).join('\n');
  const trustText = `${count} aktuelle${count === 1 ? 's Objekt' : ' Objekte'} in Köln &amp; Umland — von der Erstberatung bis zum Notar.`;

  return `  ${START_MARKER}
  <section id="objekte" class="section section--gray">
    <div class="container">
      <span class="section-label">Immobilienangebote</span>
      <h2 class="section-title">Aktuelle Immobilienangebote</h2>
      <p class="section-subtitle">Entdecken Sie mein aktuelles Portfolio bei EVERNEST — von der Erstbesichtigung bis zum Notartermin.</p>

      <div class="grid-3">
${cards}
      </div>

      <div class="objekte__cta">
        <p class="objekte__trust">${trustText}</p>
        <div class="objekte__buttons">
          <a href="https://www.evernest.com/de/unsere-makler/koeln/roman-becker/" target="_blank" rel="noopener" class="btn btn--outline">Alle Objekte ansehen</a>
          <a href="#kontakt" class="btn btn--primary">Beratungsgespräch vereinbaren</a>
        </div>
      </div>
    </div>
  </section>
  ${END_MARKER}`;
}

// --- Main ---

async function main() {
  console.log('Fetching listing URLs from Evernest profile…');
  const urls = await fetchListingUrls();

  console.log('Fetching individual listing pages…');
  const results = await Promise.allSettled(urls.map(fetchListingData));
  const listings = results
    .filter(r => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value);

  console.log(`Active listings: ${listings.length}`);

  const html = await readFile(INDEX_PATH, 'utf-8');

  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in index.html!');
    process.exit(1);
  }

  const before = html.slice(0, startIdx);
  const after = html.slice(endIdx + END_MARKER.length);
  const newSection = buildSection(listings);
  const newHtml = before + newSection + after;

  await writeFile(INDEX_PATH, newHtml, 'utf-8');
  console.log('index.html updated successfully.');
}

main().catch(err => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Script lokal testen**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
node roman/scripts/update-listings.mjs
```

Expected output:
```
Fetching listing URLs from Evernest profile…
Found X listing URLs
Fetching individual listing pages…
Active listings: Y
index.html updated successfully.
```

- [ ] **Step 3: Ergebnis im Browser prüfen**

Öffne `roman/index.html` im Browser. Die Sektion sollte jetzt:
- Bild-Cards mit echten Evernest-Fotos zeigen
- Ort, PLZ und Preis im Overlay
- Titel im Overlay darunter
- Hover: Bild zoomt leicht, Card hebt sich
- Klick öffnet Evernest-Detailseite in neuem Tab
- Trust-Line mit korrekter Anzahl
- Zwei CTA-Buttons nebeneinander
- Responsive korrekt (mobil 1 Spalte, Tablet 2, Desktop 3)

- [ ] **Step 4: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/scripts/update-listings.mjs
git commit -m "feat(roman): add Evernest listings scraper script"
```

---

### Task 3: GitHub Action erstellen

**Files:**
- Create: `.github/workflows/update-listings.yml`

- [ ] **Step 1: Workflow-Datei erstellen**

Erstelle `.github/workflows/update-listings.yml`:

```yaml
name: Update Roman Listings

on:
  schedule:
    - cron: '0 6 * * *'  # Täglich um 06:00 UTC
  workflow_dispatch:       # Manuell auslösbar

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run scraper
        run: node roman/scripts/update-listings.mjs

      - name: Check for changes
        id: changes
        run: |
          if git diff --quiet roman/index.html; then
            echo "changed=false" >> "$GITHUB_OUTPUT"
            echo "No changes detected."
          else
            echo "changed=true" >> "$GITHUB_OUTPUT"
            echo "Changes detected!"
          fi

      - name: Commit changes
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add roman/index.html
          git commit -m "chore(roman): update Evernest listings [automated]"
          git push

      - name: Deploy via FTP
        if: steps.changes.outputs.changed == 'true'
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./roman/
          server-dir: /roman/
          exclude: |
            **/scripts/**
            **/.git*
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add .github/workflows/update-listings.yml
git commit -m "feat(roman): add daily Evernest listings update workflow"
```

---

### Task 4: Manueller Test der gesamten Pipeline

- [ ] **Step 1: Script erneut lokal ausführen und Ergebnis prüfen**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
node roman/scripts/update-listings.mjs
```

Prüfe danach `roman/index.html` im Browser:
- Cards mit Bildern sichtbar?
- Overlay-Text lesbar?
- Hover-Effekte funktionieren?
- Links öffnen korrekte Evernest-Seiten?
- Mobile Ansicht korrekt (DevTools → responsive)?
- Trust-Line zeigt richtige Anzahl?
- Beide CTA-Buttons sichtbar und funktional?

- [ ] **Step 2: Alle Änderungen pushen**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git push origin main
```

- [ ] **Step 3: GitHub Action manuell triggern**

Auf GitHub → Repo `fuerte-pages` → Actions → "Update Roman Listings" → "Run workflow" klicken.

Prüfen ob die Action:
1. Erfolgreich durchläuft
2. Einen Commit erstellt (falls es Änderungen gab)
3. FTP-Deploy ausführt (sofern Secrets gesetzt sind)

**Hinweis:** FTP_USERNAME und FTP_PASSWORD müssen noch als GitHub Secrets gesetzt werden (siehe offene Punkte im Projekt-Memory).
