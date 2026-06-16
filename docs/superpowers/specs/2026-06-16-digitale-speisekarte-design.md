# Design: /digitale-speisekarte Unterseite

**Datum:** 2026-06-16  
**Projekt:** fuerte-pages (fuerte.digital)  
**Route:** `/digitale-speisekarte`

## Ziel

Unterseite für die Service-Karte "Digitale Speisekarte" auf fuerte.digital. Der Link existiert bereits in `Services.astro` und liefert aktuell 404. Die Seite soll Kölner Gastronomen überzeugen, eine QR-Code-Speisekarte über fuerte.digital zu bestellen.

## Stil

Editorial — identische dunkle Ästhetik wie die Startseite (`bg-night`, `text-sand`, Instrument Serif + Inter, GSAP/Lenis aus Layout.astro). Kein Preis, kein Formular — nur CTA zum bestehenden Kontaktbereich.

## Seitenstruktur

### 1. Nav
Bestehende `Nav.astro` Komponente + Zurück-Pfeil-Link zur Startseite.

### 2. Hero
- Tag-Pill: „Digitale Speisekarte"
- Headline (Instrument Serif, groß): **„Die Speisekarte, die dein Essen verdient."**
- Subtext: „Elegant, mehrsprachig, immer aktuell — direkt im Browser deiner Gäste. Kein App-Download. Kein Drucker."
- CTA-Button: „Jetzt anfragen" → Anker `/#kontakt`
- Oranger Glow-Blob rechts oben (wie Hero auf Startseite), `data-parallax`

### 3. Features (4 Kacheln)
Grid 4-spaltig, je eine Kachel mit Icon (orange Hintergrund), Titel, Kurztext:

| # | Titel | Text |
|---|-------|------|
| 1 | QR-Code | Gäste scannen, Karte öffnet sich sofort. Kein App-Download. |
| 2 | Mit Fotos | Gerichte mit Bild erhöhen den Bestellwert nachweislich. |
| 3 | Individuell | Deine Farben, dein Logo, deine Marke — passgenau. |
| 4 | 48h live | Fertig in zwei Tagen. Kein langer Setup-Prozess. |

Section-Label oben: „Was du bekommst"

### 4. Mockup-Section
- Überschrift: „So sieht's aus — *für deine Gäste.*" (Serif + Italic)
- Browser-Frame-Mockup: zeigt eine fiktive Speisekarte (3 Gerichte mit Foto-Placeholder, Name, Beschreibung, Preis, Sprach-Flags)
- Placeholder-Bilder — werden später durch echte Screenshots ersetzt

### 5. CTA-Section
- Italic Serif: „Bereit für deine Karte?"
- Button: „Jetzt anfragen" → `/#kontakt`

### 6. SiteFooter
Bestehende `SiteFooter.astro` Komponente.

## Dateistruktur

```
src/pages/digitale-speisekarte.astro   ← neue Seite
src/components/MenuMockup.astro         ← Browser-Frame-Mockup (isolierte Komponente)
```

Alle anderen Sections direkt in der Page-Datei (kein eigener Component nötig — zu klein).

## Animationen

Alle `data-reveal` und `data-reveal-group` Attribute wie auf der Startseite — werden automatisch von GSAP in Layout.astro aufgegriffen.

## Was NICHT auf dieser Seite ist

- Kein Preis / keine Pakete
- Kein eigenes Kontaktformular (Link zu `/#kontakt`)
- Keine mehrsprachigen Tabs im Mockup (Flags reichen als Indikator)
- Keine echten Fotos (Placeholder bis echte Referenz vorhanden)
