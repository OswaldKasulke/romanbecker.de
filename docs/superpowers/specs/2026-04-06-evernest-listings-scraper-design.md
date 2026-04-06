# Evernest-Listings Scraper — Design Spec

**Datum:** 2026-04-06
**Projekt:** Roman Becker Makler-Website (`fuerte.digital/roman`)
**Repo:** danielgruederich/fuerte-pages

## Ziel

Die "Referenzobjekte"-Sektion auf Romans Website wird durch eine automatisierte "Aktuelle Immobilienangebote"-Sektion ersetzt. Ein Node-Script scrapt täglich Romans Evernest-Profilseite, extrahiert aktive Listings mit Bildern, und aktualisiert die `index.html` automatisch.

## Datenquelle

- **Profil-URL:** `https://www.evernest.com/de/unsere-makler/koeln/roman-becker/`
- **Listing-URLs:** `https://www.evernest.com/de/listing/{ID}/`
- **Daten-Extraktion:** `__NEXT_DATA__` JSON im HTML jeder Listing-Seite
- **Bilder:** Contentful CDN (`images.ctfassets.net`), skalierbar per URL-Parameter

## Datenmodell

Pro Listing werden folgende Felder extrahiert:

| Feld | Quelle im `__NEXT_DATA__` | Beispiel |
|------|---------------------------|---------|
| title | `property.headline` | "Eigentum im schönen Sülz" |
| price | `property.exportedPropertyData.data` | "449.000 EUR" |
| location | `property.city` + `property.zipCode` | "Köln-Sülz, 50937" |
| image | `property.featuredImage.url` | Contentful CDN URL |
| link | Listing-URL | `evernest.com/de/listing/xxx/` |
| status | `property.status` | "active" / "sold" |

**Filter:** Nur Listings mit `status !== "sold"` werden angezeigt.

## Card-Design

Bild-Cards mit Text-Overlay, ähnlich der Evernest-Darstellung:

- **Bild:** Hero-Bild von Contentful CDN, `?w=640&h=360&fit=fill&fm=jpg&q=80`
- **Overlay:** Gradient von unten (dunkel → transparent), weiße Schrift
- **Inhalt:** Ort + PLZ + Preis (obere Zeile), Titel (untere Zeile)
- **Hover:** Leichter Zoom auf Bild (`scale(1.05)`) + Shadow-Lift
- **Klick:** Gesamte Card verlinkt auf Evernest-Detailseite (`target="_blank"`)
- **Lazy Loading:** `loading="lazy"` auf allen Bildern
- **Grid:** Bestehendes `grid-3` Layout (1 Spalte mobil → 2 Tablet → 3 Desktop)

## CTA-Bereich

Doppelter Call-to-Action unter den Cards:

1. **Trust-Line:** "{N} aktuelle Objekte in Köln & Umland — von der Erstberatung bis zum Notar."
   - Zahl wird dynamisch vom Script gesetzt
2. **Buttons:**
   - "Alle Objekte ansehen" → Evernest-Profil (outline/secondary)
   - "Beratungsgespräch vereinbaren" → Kontakt-Sektion oder Calendly (gold/primary)

**Fallback (0 aktive Listings):**
"Aktuell keine Objekte verfügbar — kontaktieren Sie mich für Off-Market Angebote." + nur Kontakt-Button.

## Sektions-Titel

- **Label:** "Immobilienangebote" (gold, uppercase)
- **Titel:** "Aktuelle Immobilienangebote"
- **Subtitle:** "Entdecken Sie mein aktuelles Portfolio bei EVERNEST — von der Erstbesichtigung bis zum Notartermin."

## Technische Umsetzung

### Dateistruktur

```
roman/
├── index.html                          ← wird automatisch aktualisiert
├── scripts/
│   └── update-listings.mjs             ← Node-Script (ESM, zero dependencies)
.github/workflows/
└── update-listings.yml                 ← GitHub Action
```

### Script: `update-listings.mjs`

1. Fetch Evernest-Profilseite
2. Listing-Links extrahieren (Regex: `/de/listing/[^"]+/`)
3. Jede Listing-Seite fetchen → `__NEXT_DATA__` JSON parsen
4. Nur aktive Listings behalten (`status !== "sold"`)
5. HTML-Cards + CTA generieren
6. In `index.html` den Block zwischen `<!-- LISTINGS-START -->` und `<!-- LISTINGS-END -->` ersetzen
7. Datei speichern

**Zero dependencies** — nur native `fetch()` (Node 20 built-in).

### GitHub Action: `update-listings.yml`

- **Trigger:** Cron `0 6 * * *` (täglich 6:00 UTC) + `workflow_dispatch` (manuell)
- **Steps:**
  1. Checkout repo
  2. Setup Node 20
  3. Run `node roman/scripts/update-listings.mjs`
  4. Check for changes (`git diff`)
  5. Falls Änderungen: commit + push
  6. FTP-Deploy (bestehende Action oder SamKirkland/FTP-Deploy-Action)

### HTML-Marker in index.html

Die bestehende Referenzobjekte-Sektion wird mit Markern versehen:

```html
<!-- LISTINGS-START -->
<section id="objekte" class="section section--gray">
  ...generierte Cards...
</section>
<!-- LISTINGS-END -->
```

Das Script ersetzt alles zwischen den Markern.

### Fehlerbehandlung

- **Evernest nicht erreichbar:** Script bricht ab (exit code 1), alte Cards bleiben unverändert
- **Einzelnes Listing nicht ladbar:** Wird übersprungen, Rest wird verarbeitet
- **0 aktive Listings:** Fallback-Text wird eingesetzt
- **HTML-Marker nicht gefunden:** Script bricht ab mit Fehlermeldung
- **GitHub Action Fehler:** Default-Notification an Repo-Owner

## Styling

Nutzt bestehende CSS-Variablen:
- `--navy`, `--navy-light`, `--gold`, `--gold-light`
- `--radius-lg` (16px), `--shadow`, `--shadow-lg`
- `--transition` (0.2s ease)
- `--font-base` (Inter)

Neue CSS-Klassen werden inline in der Sektion hinzugefügt (Single-File Ansatz beibehalten).
