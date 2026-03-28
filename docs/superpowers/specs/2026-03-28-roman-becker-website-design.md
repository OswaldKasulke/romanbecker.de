# Spec: Roman Becker — Immobilienmakler Landingpage

**Datum:** 2026-03-28
**Status:** Review
**Domain:** romanbecker.de (Canonical), temporär auf fuerte.digital/roman
**Stack:** Single-File HTML (inline CSS + JS), kein Framework, kein Build-Step

---

## Ziel

Produktionsreife Landingpage für Roman Becker, IHK-zertifizierter Immobilienmakler in Köln (über EVERNEST GmbH). Primäre Zielgruppe: Verkäufer hochwertiger Immobilien ab 750.000 €. Optimiert für Traditional SEO, Local SEO, GEO (KI-Suchmaschinen) und Voice Search.

---

## Über Roman Becker (Quelldaten)

**Person:**
- Name: Roman Becker, Immobilienmakler (IHK)
- Unternehmen: Selbstständig über EVERNEST GmbH
- Büro: Kaiser-Wilhelm-Ring 17-21, 50672 Köln
- Telefon: +49 177 515 69 69
- E-Mail: roman.becker@evernest.com
- Instagram: @roman_becker_immobilien
- Evernest-Profil: https://www.evernest.com/de/unsere-makler/koeln/roman-becker/
- Öffnungszeiten: Mo–Fr 09:00–19:00 Uhr

**Persönliche Story:**
- Wohnt mit Familie in Köln-Sülz
- Zwillinge gehen in Kita "ums Eck"
- Frau ist Kinderzahnärztin am Heumarkt
- Slogan: "Makler aus der Nachbarschaft" — als Trust-Signal, nicht als Hauptbotschaft
- Sülz-Insider: De-Noel-Platz, Musikschule Lotharstraße, Balthasar, Biergarten Unkelbach, Heilandt, Keiserlich

**Netzwerk & Rückendeckung:**
- EVERNEST: 380+ Makler, 38 Standorte deutschlandweit
- ~90 Kollegen in und um Köln
- Digitales CRM, interne Softwareentwickler, vorgemerkter Käuferpool
- EVERNEST vermarktet "Selected Immobilien" im Luxussegment
- Servicegebiet: Köln, Pulheim, Rhein-Erft-Kreis, Bergisch Gladbach, Leverkusen, Bonn, Düsseldorf (50 km Radius)

**Aktuelle Listings (für Trust-Sektion):**
- Pulheim: Baugrundstück 949.000 €
- Köln-Dellbrück: Wohnanlage 10.950.000 €
- Langenfeld: Saniertes MFH 3.249.000 €
- Pulheim: Konvolut 9 Neubauwohnungen 4.900.000 €
- Köln-Riehl: Colonia-Haus ab 399.000 €
- Amselquartier Pulheim: ab 350.000 € (Neubau)

**Fachliche Kompetenz:**
- IHK-zertifiziert
- Bewertet: Lage, Baujahr, Zustand, Sanierungsmaßnahmen, Energieeffizienz, Zinslage, Baulasten, Grundbuchdienstbarkeiten, Instandhaltungsrücklagen, WEG-Beschlüsse, Miteigentumsanteile
- Kapitalanlage: WG-Vermietung steigert Kaltmiete um 25%+
- Prüft Kaufverträge, Baulastenverzeichnis, Grundbuch

**Foto-URLs:**
- Romans Foto: https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg
- Sülz Sonnenuntergang: https://romanbecker.de/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-16-at-23.05.58.jpeg

---

## Zielgruppe

**Primär — Verkäufer ab 750.000 € in Köln + 50 km:**
- Erben mit geerbter Immobilie
- Eigentümer die diskret ohne Portal verkaufen wollen
- Kapitalanleger mit MFH oder Konvolut
- Familien in Premium-Lagen: Marienburg, Hahnwald, Lindenthal, Rodenkirchen, Sülz, Junkersdorf, Klettenberg, Bayenthal, Dellbrück

**Sekundär:**
- Netzwerkpartner: Notare, Steuerberater, Anwälte, Banken
- Käufer (nachrangig)

**Ton:** Seriös, warm, direkt. Kein Makler-Slang. Keine leeren Versprechen. Keine Käufer-Sprache — alles auf Verkäufer ausgerichtet.

---

## Designvorgaben

- Farbpalette: Dunkelblau #0D1B2A + Champagner/Gold #C9A84C als Akzent
- Weißer Content-Bereich für Lesbarkeit
- Großzügige Whitespace
- Klare typografische Hierarchie (H1 > H2 > Body)
- Hover-Effekte auf allen Cards und CTAs
- Sticky Nav mit Telefon immer sichtbar
- Sülz-Bild als atmosphärisches Hero-Element
- Romans Foto: professionell, rund oder im Premium-Rechteck-Frame
- Google Fonts: Inter (400, 500, 700)
- Mobile-first, vollständig responsive
- Orientierung an godly.website und higgsfield.ai für Designsprache

---

## Seitenstruktur

### NAV (sticky)
- Logo links: "Roman Becker – Immobilienmakler Köln"
- Links: Für Verkäufer | Prozess | Über Roman | FAQ | Kontakt
- Rechts: Telefonnummer klickbar als `tel:+491775156969` — immer sichtbar
- Mobile: Hamburger-Menü

### 1. HERO
**H1 (SEO-optimiert):**
> "Ihr diskreter Partner für den Verkauf hochwertiger Immobilien in Köln und Umgebung"

**Subline:**
> "IHK-zertifizierter Immobilienmakler | EVERNEST-Netzwerk mit 380+ Maklern | Persönliche Betreuung von der Bewertung bis zum Notartermin"

**Zwei CTAs:**
- Primär: "Kostenlose Bewertung vereinbaren" → #kontakt
- Sekundär: "Roman kennenlernen" → #ueber-roman

**Hintergrundbild:** Sülz Sonnenuntergang (URL oben)

### 2. TRUST-LEISTE (direkt unter Hero)
5 Kennzahlen nebeneinander:
- 380+ Makler im Netzwerk
- 38 Standorte deutschlandweit
- Bis 10.950.000 € vermarktet
- 5,0 ★ Bewertung
- [ROMAN: X Objekte in Köln verkauft]

### 3. FÜR WEN — Zielgruppen-Selektion (3 Cards)
Klickbare Cards die zur jeweiligen Sektion scrollen:

**Card 1: "Sie möchten diskret verkaufen"**
Kein Portal, kein öffentliches Inserat. Vorgemerkter Käuferpool aus dem EVERNEST-Netzwerk. Off-Market wenn gewünscht.

**Card 2: "Sie haben geerbt und wissen nicht weiter"**
Erbschaftsimmobilien haben besondere Anforderungen — rechtlich, steuerlich, emotional. Roman begleitet Sie strukturiert und diskret durch den gesamten Prozess.

**Card 3: "Sie haben eine Kapitalanlage zu veräußern"**
MFH, Konvolute, Renditeobjekte. Roman prüft Mietverträge, Rendite, WEG-Beschlüsse und findet qualifizierte Investoren aus dem Netzwerk.

### 4. DER PROZESS — 5 Schritte
Macht "Was passiert als nächstes?" vollständig transparent:

1. **Kostenlose Erstbewertung** — Vor-Ort-Termin oder telefonisch. Roman prüft alle wertrelevanten Faktoren persönlich.
2. **Individuelle Verkaufsstrategie** — Diskret (Off-Market) oder öffentlich. Gemeinsam entschieden, nicht vorgegeben.
3. **Professionelle Vermarktung** — EVERNEST-CRM, vorgemerkter Käuferpool, Portale wenn gewünscht, hochwertiges Exposé.
4. **Käuferprüfung** — Bonität, Ernsthaftigkeit, Grundbuch- und Baulastencheck, Kaufvertragsprüfung.
5. **Notartermin & Abschluss** — Roman begleitet Sie bis zur Schlüsselübergabe. Danach: Bewertung und Weiterempfehlung wenn Sie zufrieden sind.

Nach Schritt 5: "Nach dem Abschluss bitte ich Sie um eine kurze Google-Bewertung — das hilft anderen Verkäufern, den richtigen Makler zu finden."

### 5. ÜBER ROMAN
- Romans Foto prominent
- IHK-Qualifikation, Sülz-Verwurzelung, Familie, Zwillinge
- Persönliche Story: Weil er im Veedel lebt, kennt er den Markt nicht aus dem Büro sondern von der Straße
- Fachliche Tiefe: Was er beim Verkauf prüft (Aufzählung)
- EVERNEST als Rückendeckung: Technologie + Netzwerk + Softwareentwickler im Hintergrund
- CTA: "Sprechen Sie mich direkt an"

### 6. AKTUELLE REFERENZOBJEKTE
Grid 2x3, Listings aus Quelldaten:
- Preis, Lage, Typ, kurze Beschreibung
- CTA: "Alle Objekte auf EVERNEST ansehen" → Evernest-Profil

### 7. BEWERTUNGEN & SOCIAL PROOF
- 5,0 Sterne prominent (visuell, KEIN aggregateRating-Schema — siehe SEO-Sektion)
- [ROMAN: 3 echte Bewertungstexte einfügen]
- "Alle Bewertungen auf Google ansehen" → Google Review Link
- Auf jede Bewertung wird persönlich geantwortet

### 8. FAQ — SEO, GEO & Voice Search optimiert (8 Fragen)
Alle Antworten im **Answer-First Format**: Direkte Antwort im ersten Satz, dann Erklärung.

**F1: "Was kostet ein Makler beim Hausverkauf in Köln?"**
A: "**In der Regel 1,785 % + MwSt. für den Verkäufer** (ca. 17.000 € bei 800.000 € Kaufpreis). Die gesetzlich geregelte Gesamtprovision beträgt 3,57 % und wird seit 2020 hälftig zwischen Käufer und Verkäufer geteilt. Dafür erhalten Sie professionelle Bewertung, Vermarktung, Käuferprüfung und vollständige Abwicklung bis zum Notartermin."

**F2: "Wie lange dauert der Verkauf einer Immobilie in Köln?"**
A: "**Typischerweise 3–5 Monate** — von der Bewertung bis zur Schlüsselübergabe. In gefragten Lagen wie Sülz, Lindenthal oder Marienburg sind kürzere Zeiträume möglich, wenn ein vorgemerkter Käuferpool vorhanden ist."

**F3: "Was ist meine Immobilie in Köln aktuell wert?"**
A: "**Das hängt von Lage, Baujahr, Zustand, Energieeffizienz, Zinslage und eingetragenen Baulasten ab.** Für eine erste Einschätzung nutzen Sie meine Online-Bewertung — für eine fundierte Bewertung ist ein Vor-Ort-Termin unerlässlich."

**F4: "Kann ich meine Immobilie in Köln diskret ohne Portal verkaufen?"**
A: "**Ja.** Über das EVERNEST-Netzwerk mit über 380 Maklern und einem vorgemerkten Käuferpool ist ein diskreter Off-Market-Verkauf möglich — ohne öffentliches Inserat auf ImmoScout oder Immowelt."

**F5: "Was ist der Unterschied zwischen einem lokalen Makler und einem großen Netzwerk?"**
A: "**Mit mir erhalten Sie beides:** Die persönliche Betreuung eines Maklers, der in Sülz wohnt und den Kölner Markt kennt — plus die Reichweite und Technologie von EVERNEST mit 380+ Maklern an 38 deutschen Standorten."

**F6: "Wie läuft der Verkauf einer Erbschaftsimmobilie ab?"**
A: "**Zuerst werden Erbschein, Grundbuchauszug und ggf. Erbengemeinschaft geklärt.** Ich begleite Sie von der ersten Bewertung über die Abstimmung mit Notar und Steuerberater bis zum Verkauf — diskret und ohne Zeitdruck."

**F7: "Wie finde ich den richtigen Makler für meine hochwertige Immobilie in Köln?"**
A: "Das hängt weniger von der Größe des Büros ab als von der Frage: Wer kennt die Käufer, die für Ihre Immobilie wirklich in Frage kommen — und wer hat Zugang zu ihnen?
Ich arbeite selbstständig, aber nicht allein. Über EVERNEST habe ich Zugang zu einem vorgemerkten Käuferpool und kann bei Bedarf diskret vermarkten, ohne dass Ihre Immobilie öffentlich auf Portalen erscheint. Das ist gerade bei hochwertigen Objekten oft der bessere Weg — für den Preis, für die Diskretion, und weil qualifizierte Käufer in diesem Segment nicht auf ImmoScout suchen.
Was ich Ihnen empfehle: Rufen Sie drei Makler an. Fragen Sie jeden konkret, wie viele Objekte in Ihrer Preisspanne er in den letzten 12 Monaten in Ihrer Lage verkauft hat — und wer die Käufer waren. Die Antwort sagt mehr als jede Referenzliste."

**F8: "Was prüft ein Makler beim Kaufvertrag und Grundbuch?"**
A: "**Grundbuch, Baulastenverzeichnis, Miteigentumsanteile, WEG-Beschlüsse, Instandhaltungsrücklagen und Käuferbonität** — alles bevor wir zum Notar gehen. Eingetragene Dienstbarkeiten und Baulasten können den Wert erheblich beeinflussen."

### 9. STADTTEIL-EXPERTISE (ausgebaut mit Local SEO)
Grid mit ausgebautem Content pro Stadtteil. Jeder Eintrag enthält:
- Stadtteil-Name als H3
- Typische Immobilientypen + Preissegment
- Was den Stadtteil ausmacht (1–2 Sätze, lokal + authentisch)
- Warum Roman dort der richtige Ansprechpartner ist

**Stadtteile:**
- **Köln-Sülz** — Romans Heimat-Veedel. Altbauwohnungen, Reihenhäuser, Familienlage. Nachfrage durchgehend hoch.
- **Lindenthal** — Villen, große Eigentumswohnungen, Uni-Nähe. Premium-Lage mit stabilen Preisen.
- **Rodenkirchen** — Rheinlage, Einfamilienhäuser, ruhig. Beliebt bei Familien mit gehobenen Ansprüchen.
- **Marienburg** — Kölns exklusivste Adresse. Villen, Repräsentanz, diskrete Verkäufe.
- **Hahnwald** — Großgrundstücke, Privatsphäre, Top-Segment. Käufer kommen selten über Portale.
- **Junkersdorf** — Familienfreundlich, Neubau und Bestand. Gute Anbindung, steigende Nachfrage.
- **Klettenberg** — Altbau-Charme, Bürgerpark-Nähe. Hohe Nachfrage bei jungen Familien.
- **Bayenthal** — Rhein-Nähe, gemischt, aufstrebend. Kapitalanleger und Selbstnutzer.
- **Dellbrück** — Rechtsrheinisch, bezahlbarer Einstieg ins Premium-Segment. MFH und Wohnanlagen.
- **Pulheim** — Neubau-Hotspot, Baugrundstücke, Konvolute. Starke Investoren-Nachfrage.
- **Bergisch Gladbach** — Stadtrandlage, Einfamilienhäuser. Wachsender Markt.
- **Leverkusen** — Industrie-Nähe, MFH, Kapitalanlagen. Solide Renditen.

Jeder Stadtteil wird im JSON-LD als `Place` innerhalb `areaServed` abgebildet (siehe SEO-Sektion).

### 10. EMPFEHLUNG & NETZWERKPARTNER
**"Empfehlen Sie Ihren Mandanten den richtigen Makler"**
Kurzer Text für Notare, Steuerberater, Anwälte, Banken: Was Roman bietet, wie Empfehlung funktioniert, direkter Kontaktlink.

**"Kennen Sie jemanden der verkaufen möchte?"**
Weiterempfehlungs-CTA: Direktlink zu WhatsApp oder Kontaktformular mit Feld "Empfohlen von:"

### 11. GOOGLE MAPS EMBED
Eingebettete Google Maps Karte mit Bürostandort Kaiser-Wilhelm-Ring 17-21, 50672 Köln.
Maps-Embed ist ein direktes Local SEO Signal.

### 12. KONTAKT & TERMINBUCHUNG
**Formular-Felder:**
- Name (Pflicht)
- Telefon (Pflicht)
- E-Mail
- Immobilientyp: [Haus | Wohnung | MFH | Grundstück | Erbschaft]
- PLZ der Immobilie
- Geschätzte Preisspanne: [bis 500k | 500k–1M | 1M–2M | über 2M]
- Kurze Nachricht (optional)
- Empfohlen von: (optional)

**Nach Absenden — Inline-Bestätigung:**
> "Vielen Dank! Roman meldet sich persönlich innerhalb von 24 Stunden bei Ihnen. Dringendes Anliegen? Rufen Sie direkt an: +49 177 515 69 69"

**Calendly-Platzhalter:**
[ROMAN: Calendly-Link für direkten Terminbuchungs-Button]

**Kontaktdaten nochmals prominent:**
- Telefon (klickbar)
- E-Mail (klickbar)
- Adresse mit Link zu Google Maps

**Formular-Backend:** PHP auf Starthost (submit.php sendet E-Mail an roman.becker@evernest.com)

### FOOTER
- Copyright Roman Becker 2026
- Links: Datenschutz | Impressum | AGB
- EVERNEST-Verweis
- Instagram @roman_becker_immobilien
- Kurzer Disclaimer Maklerleistungen

---

## SEO — Technische Anforderungen

### Meta Tags
```html
<title>Immobilienmakler Köln – Roman Becker | Diskreter Immobilienverkauf</title>

<meta name="description" content="IHK-zertifizierter Immobilienmakler in Köln. Diskreter Verkauf hochwertiger Immobilien ab 750.000 €. EVERNEST-Netzwerk, persönliche Betreuung. ☎ +49 177 515 69 69">

<meta name="robots" content="index, follow">
<link rel="canonical" href="https://romanbecker.de">

<!-- Geo-Tags für Local SEO -->
<meta name="geo.region" content="DE-NW">
<meta name="geo.placename" content="Köln">
<meta name="geo.position" content="50.9420;6.9438">
<meta name="ICBM" content="50.9420, 6.9438">

<!-- Open Graph -->
<meta property="og:title" content="Immobilienmakler Köln – Roman Becker">
<meta property="og:description" content="Diskreter Verkauf hochwertiger Immobilien in Köln. IHK-zertifiziert, EVERNEST-Netzwerk.">
<meta property="og:url" content="https://romanbecker.de">
<meta property="og:type" content="website">
<meta property="og:image" content="https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg">
<meta property="og:locale" content="de_DE">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Immobilienmakler Köln – Roman Becker">
<meta name="twitter:description" content="Diskreter Verkauf hochwertiger Immobilien in Köln. IHK-zertifiziert, EVERNEST-Netzwerk.">
<meta name="twitter:image" content="https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg">

<!-- Sprache -->
<html lang="de">
```

### JSON-LD Schema — Kombiniert als @graph

Alle Schemas in einem einzigen `<script type="application/ld+json">` Block mit `@graph`-Array:

**1. WebSite**
```json
{
  "@type": "WebSite",
  "name": "Roman Becker – Immobilienmakler Köln",
  "url": "https://romanbecker.de",
  "inLanguage": "de-DE",
  "datePublished": "2026-03-28",
  "dateModified": "2026-03-28"
}
```

**2. Person**
```json
{
  "@type": "Person",
  "name": "Roman Becker",
  "jobTitle": "Immobilienmakler (IHK)",
  "worksFor": {
    "@type": "Organization",
    "name": "EVERNEST GmbH",
    "url": "https://www.evernest.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kaiser-Wilhelm-Ring 17-21",
    "addressLocality": "Köln",
    "postalCode": "50672",
    "addressCountry": "DE"
  },
  "telephone": "+491775156969",
  "email": "roman.becker@evernest.com",
  "url": "https://romanbecker.de",
  "image": "https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg",
  "sameAs": [
    "https://www.instagram.com/roman_becker_immobilien/",
    "https://www.evernest.com/de/unsere-makler/koeln/roman-becker/"
  ]
}
```

**3. RealEstateAgent (LocalBusiness)**
WICHTIG: Kein `aggregateRating` — Google erlaubt das nur mit selbst gehosteten Bewertungen.
```json
{
  "@type": "RealEstateAgent",
  "name": "Roman Becker – EVERNEST",
  "image": "https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg",
  "telephone": "+491775156969",
  "email": "roman.becker@evernest.com",
  "url": "https://romanbecker.de",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kaiser-Wilhelm-Ring 17-21",
    "addressLocality": "Köln",
    "postalCode": "50672",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 50.9420,
    "longitude": 6.9438
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "19:00"
    }
  ],
  "areaServed": [
    {"@type": "City", "name": "Köln"},
    {"@type": "Place", "name": "Köln-Sülz"},
    {"@type": "Place", "name": "Köln-Lindenthal"},
    {"@type": "Place", "name": "Köln-Rodenkirchen"},
    {"@type": "Place", "name": "Köln-Marienburg"},
    {"@type": "Place", "name": "Köln-Hahnwald"},
    {"@type": "Place", "name": "Köln-Junkersdorf"},
    {"@type": "Place", "name": "Köln-Klettenberg"},
    {"@type": "Place", "name": "Köln-Bayenthal"},
    {"@type": "Place", "name": "Köln-Dellbrück"},
    {"@type": "City", "name": "Pulheim"},
    {"@type": "City", "name": "Bergisch Gladbach"},
    {"@type": "City", "name": "Leverkusen"},
    {"@type": "City", "name": "Bonn"},
    {"@type": "City", "name": "Düsseldorf"},
    {"@type": "AdministrativeArea", "name": "Rhein-Erft-Kreis"}
  ],
  "priceRange": "€€€€"
}
```

**4. FAQPage**
Alle 8 FAQ-Fragen als vollständiges FAQPage-Schema mit `mainEntity`-Array. Jede Frage als `Question` mit `acceptedAnswer`.

**5. BreadcrumbList**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://romanbecker.de"
    }
  ]
}
```

### NAP-Konsistenz (Local SEO — kritisch)
EXAKT diese Schreibweise überall — Footer, Kontaktsektion, Schema:
- **Name:** Roman Becker – EVERNEST
- **Adresse:** Kaiser-Wilhelm-Ring 17-21, 50672 Köln
- **Telefon:** +49 177 515 69 69

### Alt-Texte
Beschreibend und natürlich, KEIN Keyword-Stuffing:
- Hero: `alt="Sonnenuntergang über Köln-Sülz"`
- Portrait: `alt="Roman Becker, Immobilienmakler in Köln"`

### Performance
- Lazy Loading für alle Bilder (`loading="lazy"`) — Ausnahme: Hero-Bild bekommt `loading="eager"`
- Google Fonts: Inter via `<link rel="preconnect">` + `display=swap`
- Smooth scroll (`scroll-behavior: smooth`)
- Keine render-blocking Resources
- Bilder als WebP wo möglich

---

## GEO — KI-Suchmaschinen-Optimierung

### robots.txt (als separate Datei auf Starthost)
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://romanbecker.de/sitemap.xml
```

### llms.txt (als separate Datei im Root)
```
# Roman Becker – Immobilienmakler Köln

> IHK-zertifizierter Immobilienmakler in Köln, spezialisiert auf diskrete Verkäufe hochwertiger Immobilien ab 750.000 € im Kölner Raum. Teil des EVERNEST-Netzwerks mit 380+ Maklern an 38 Standorten.

## Kontakt
- Telefon: +49 177 515 69 69
- E-Mail: roman.becker@evernest.com
- Büro: Kaiser-Wilhelm-Ring 17-21, 50672 Köln

## Servicegebiet
Köln (Sülz, Lindenthal, Marienburg, Hahnwald, Rodenkirchen, Junkersdorf, Klettenberg, Bayenthal, Dellbrück), Pulheim, Bergisch Gladbach, Leverkusen, Rhein-Erft-Kreis, Bonn, Düsseldorf

## Leistungen
- Kostenlose Immobilienbewertung
- Diskreter Off-Market-Verkauf
- Professionelle Vermarktung über EVERNEST-CRM und Käuferpool
- Erbschaftsimmobilien-Begleitung
- Kapitalanlage-Bewertung (MFH, Konvolute)
- Kaufvertragsprüfung, Grundbuch, Baulasten
```

### sitemap.xml (als separate Datei)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://romanbecker.de/</loc>
    <lastmod>2026-03-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### GEO Content-Prinzipien (Princeton-Studie)
Diese Prinzipien beim Schreiben aller Texte anwenden:
1. **Answer-First Format** — Jede FAQ-Antwort beginnt mit der direkten Antwort (fett)
2. **Statistiken mit Kontext** — Zahlen verwenden (380+ Makler, 3–5 Monate, 3,57 %), nicht generisch bleiben
3. **Autoritärer Ton** — Kompetent und selbstsicher, nicht vage oder unsicher
4. **Kein Keyword-Stuffing** — Natürliche Sprache, -10 % Visibility bei Überoptimierung
5. **Fluency + Statistics** = beste Kombination laut Forschung

### Brave Search
Claude nutzt Brave Search. Nach Go-Live: Seite bei Brave Webmaster Tools einreichen.

---

## Umzug auf romanbecker.de — Checkliste

Wenn Roman die Seite abnimmt und sie auf `romanbecker.de` umzieht:
- [ ] Canonical URL ändern: `https://romanbecker.de`
- [ ] Alle OG/Twitter URLs anpassen
- [ ] Alle JSON-LD `url`-Felder anpassen
- [ ] robots.txt + sitemap.xml auf neue Domain
- [ ] llms.txt auf neue Domain
- [ ] 301-Redirect von `fuerte.digital/roman` auf `romanbecker.de`
- [ ] Google Search Console für neue Domain einrichten
- [ ] Brave Webmaster Tools für neue Domain einrichten
- [ ] GBP (Google Business Profile) URL aktualisieren

---

## Was NICHT auf die Seite darf

- Keine generischen Makler-Floskeln
- Kein Social-Video (kein TikTok, kein Reels)
- Keine Käufer-first Kommunikation
- Kein Keyword-Stuffing in lesbaren Texten
- Keine Stock-Foto-Ästhetik
- Keine unspezifischen Versprechen ohne Substanz
- Kein aggregateRating-Schema ohne selbst gehostete Reviews

---

## Platzhalter die Roman selbst eintragen muss

Alle mit `[ROMAN: ...]` markiert:
- [ROMAN: Anzahl erfolgreich verkaufter Objekte in Köln]
- [ROMAN: 3 echte Bewertungstexte von Google]
- [ROMAN: Calendly-Link für Terminbuchung]
- [ROMAN: Öffnungszeiten vollständig prüfen]
- [ROMAN: Google Maps Embed-Code vom GBP einfügen]

---

## Lieferumfang

1. `roman/index.html` — Komplette Landingpage (Single-File, inline CSS + JS)
2. `roman/robots.txt` — Crawler-Steuerung mit KI-Bot-Zugang
3. `roman/sitemap.xml` — Sitemap für Suchmaschinen
4. `roman/llms.txt` — Strukturierte Infos für KI-Crawler
5. `roman/submit.php` — Formular-Backend (sendet E-Mail)
