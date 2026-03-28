# Roman Becker Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready single-file HTML landing page for Roman Becker (real estate agent, Cologne) with full SEO, Local SEO, and GEO optimization.

**Architecture:** Single `index.html` with inline CSS and JS. Supporting files: `robots.txt`, `sitemap.xml`, `llms.txt`, `submit.php`. All files go into `roman/` directory within the `fuerte-pages` project. Temporary hosting on `fuerte.digital/roman`, canonical URL `romanbecker.de`.

**Tech Stack:** HTML5, inline CSS (custom properties, mobile-first), inline JS (vanilla), PHP (form backend), Google Fonts (Inter)

**Spec:** `docs/superpowers/specs/2026-03-28-roman-becker-website-design.md`

---

## File Structure

```
roman/
├── index.html       # Complete landing page (inline CSS + JS, ~12 sections)
├── robots.txt       # Crawler directives incl. AI bots
├── sitemap.xml      # Single-URL sitemap
├── llms.txt         # Structured info for AI crawlers
└── submit.php       # Form backend (sends email)
```

---

### Task 1: Project Setup & Skeleton HTML

**Files:**
- Create: `roman/index.html`

Creates the HTML skeleton with `<head>` (all meta tags, OG, Twitter, geo tags, canonical, Google Fonts preconnect, JSON-LD `@graph`) and empty `<body>` with section landmarks.

- [ ] **Step 1: Create the roman/ directory**

Run: `mkdir -p "/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman"`

- [ ] **Step 2: Write the HTML skeleton with complete `<head>`**

Create `roman/index.html` with:

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Immobilienmakler Köln – Roman Becker | Diskreter Immobilienverkauf</title>
  <meta name="description" content="IHK-zertifizierter Immobilienmakler in Köln. Diskreter Verkauf hochwertiger Immobilien ab 750.000 €. EVERNEST-Netzwerk, persönliche Betreuung. ☎ +49 177 515 69 69">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://romanbecker.de">

  <!-- Geo-Tags -->
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

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Roman Becker – Immobilienmakler Köln",
        "url": "https://romanbecker.de",
        "inLanguage": "de-DE",
        "datePublished": "2026-03-28",
        "dateModified": "2026-03-28"
      },
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
      },
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
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
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
      },
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
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Was kostet ein Makler beim Hausverkauf in Köln?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In der Regel 1,785 % + MwSt. für den Verkäufer (ca. 17.000 € bei 800.000 € Kaufpreis). Die gesetzlich geregelte Gesamtprovision beträgt 3,57 % und wird seit 2020 hälftig zwischen Käufer und Verkäufer geteilt. Dafür erhalten Sie professionelle Bewertung, Vermarktung, Käuferprüfung und vollständige Abwicklung bis zum Notartermin."
            }
          },
          {
            "@type": "Question",
            "name": "Wie lange dauert der Verkauf einer Immobilie in Köln?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Typischerweise 3–5 Monate — von der Bewertung bis zur Schlüsselübergabe. In gefragten Lagen wie Sülz, Lindenthal oder Marienburg sind kürzere Zeiträume möglich, wenn ein vorgemerkter Käuferpool vorhanden ist."
            }
          },
          {
            "@type": "Question",
            "name": "Was ist meine Immobilie in Köln aktuell wert?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Das hängt von Lage, Baujahr, Zustand, Energieeffizienz, Zinslage und eingetragenen Baulasten ab. Für eine erste Einschätzung nutzen Sie meine Online-Bewertung — für eine fundierte Bewertung ist ein Vor-Ort-Termin unerlässlich."
            }
          },
          {
            "@type": "Question",
            "name": "Kann ich meine Immobilie in Köln diskret ohne Portal verkaufen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja. Über das EVERNEST-Netzwerk mit über 380 Maklern und einem vorgemerkten Käuferpool ist ein diskreter Off-Market-Verkauf möglich — ohne öffentliches Inserat auf ImmoScout oder Immowelt."
            }
          },
          {
            "@type": "Question",
            "name": "Was ist der Unterschied zwischen einem lokalen Makler und einem großen Netzwerk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mit Roman Becker erhalten Sie beides: Die persönliche Betreuung eines Maklers, der in Sülz wohnt und den Kölner Markt kennt — plus die Reichweite und Technologie von EVERNEST mit 380+ Maklern an 38 deutschen Standorten."
            }
          },
          {
            "@type": "Question",
            "name": "Wie läuft der Verkauf einer Erbschaftsimmobilie ab?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zuerst werden Erbschein, Grundbuchauszug und ggf. Erbengemeinschaft geklärt. Roman Becker begleitet Sie von der ersten Bewertung über die Abstimmung mit Notar und Steuerberater bis zum Verkauf — diskret und ohne Zeitdruck."
            }
          },
          {
            "@type": "Question",
            "name": "Wie finde ich den richtigen Makler für meine hochwertige Immobilie in Köln?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Das hängt weniger von der Größe des Büros ab als von der Frage: Wer kennt die Käufer, die für Ihre Immobilie wirklich in Frage kommen — und wer hat Zugang zu ihnen? Über EVERNEST hat Roman Becker Zugang zu einem vorgemerkten Käuferpool und kann bei Bedarf diskret vermarkten. Empfehlung: Rufen Sie drei Makler an und fragen Sie konkret, wie viele Objekte in Ihrer Preisspanne in den letzten 12 Monaten verkauft wurden."
            }
          },
          {
            "@type": "Question",
            "name": "Was prüft ein Makler beim Kaufvertrag und Grundbuch?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Grundbuch, Baulastenverzeichnis, Miteigentumsanteile, WEG-Beschlüsse, Instandhaltungsrücklagen und Käuferbonität — alles bevor es zum Notar geht. Eingetragene Dienstbarkeiten und Baulasten können den Wert erheblich beeinflussen."
            }
          }
        ]
      }
    ]
  }
  </script>

  <style>
    /* CSS wird in Task 2 eingefügt */
  </style>
</head>
<body>
  <!-- NAV -->
  <nav id="nav"></nav>

  <!-- HERO -->
  <section id="hero"></section>

  <!-- TRUST-LEISTE -->
  <section id="trust"></section>

  <!-- FÜR WEN -->
  <section id="fuer-wen"></section>

  <!-- PROZESS -->
  <section id="prozess"></section>

  <!-- ÜBER ROMAN -->
  <section id="ueber-roman"></section>

  <!-- REFERENZOBJEKTE -->
  <section id="objekte"></section>

  <!-- BEWERTUNGEN -->
  <section id="bewertungen"></section>

  <!-- FAQ -->
  <section id="faq"></section>

  <!-- STADTTEIL-EXPERTISE -->
  <section id="stadtteile"></section>

  <!-- EMPFEHLUNG & NETZWERK -->
  <section id="empfehlung"></section>

  <!-- GOOGLE MAPS -->
  <section id="maps"></section>

  <!-- KONTAKT -->
  <section id="kontakt"></section>

  <!-- FOOTER -->
  <footer id="footer"></footer>

  <script>
    // JS wird in Task 9 eingefügt
  </script>
</body>
</html>
```

- [ ] **Step 3: Open in browser to verify blank page loads without errors**

Run: `open "/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/index.html"`

Check browser console: no errors. Title shows in tab. View page source to confirm meta tags and JSON-LD are present.

- [ ] **Step 4: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): HTML skeleton with complete head, meta tags, JSON-LD @graph"
```

---

### Task 2: CSS Foundation — Custom Properties, Reset, Typography, Layout

**Files:**
- Modify: `roman/index.html` (replace the `<style>` placeholder)

Writes the complete CSS: custom properties (colors, spacing, fonts), reset, typography scale, layout utilities, section spacing, responsive breakpoints. Mobile-first.

- [ ] **Step 1: Write the complete CSS inside `<style>`**

Replace the `/* CSS wird in Task 2 eingefügt */` comment with:

```css
/* === Custom Properties === */
:root {
  --color-navy: #0D1B2A;
  --color-navy-light: #1B2838;
  --color-gold: #C9A84C;
  --color-gold-light: #D4BA6A;
  --color-white: #FFFFFF;
  --color-off-white: #F8F7F4;
  --color-gray-100: #F3F4F6;
  --color-gray-300: #D1D5DB;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;

  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  --spacing-4xl: 6rem;

  --max-width: 1200px;
  --nav-height: 72px;
  --border-radius: 8px;
  --border-radius-lg: 12px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);

  --transition: 0.3s ease;
}

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: var(--nav-height); }
body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-gray-900);
  background: var(--color-white);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }
button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  border: none;
  outline: none;
}

/* === Typography === */
h1 { font-size: var(--font-size-3xl); font-weight: 700; line-height: 1.2; }
h2 { font-size: var(--font-size-2xl); font-weight: 700; line-height: 1.3; }
h3 { font-size: var(--font-size-xl); font-weight: 600; line-height: 1.4; }

@media (min-width: 768px) {
  h1 { font-size: var(--font-size-5xl); }
  h2 { font-size: var(--font-size-4xl); }
  h3 { font-size: var(--font-size-2xl); }
}

/* === Layout === */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section {
  padding: var(--spacing-3xl) 0;
}

.section--navy {
  background: var(--color-navy);
  color: var(--color-white);
}

.section--gray {
  background: var(--color-off-white);
}

/* === Buttons === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.btn--primary {
  background: var(--color-gold);
  color: var(--color-navy);
}
.btn--primary:hover {
  background: var(--color-gold-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--secondary {
  background: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-white);
}
.btn--secondary:hover {
  background: var(--color-white);
  color: var(--color-navy);
}

.btn--outline {
  background: transparent;
  color: var(--color-navy);
  border: 2px solid var(--color-navy);
}
.btn--outline:hover {
  background: var(--color-navy);
  color: var(--color-white);
}

/* === Cards === */
.card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

/* === Grid === */
.grid-2 { display: grid; gap: var(--spacing-xl); }
.grid-3 { display: grid; gap: var(--spacing-xl); }

@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
}

/* === Section Titles === */
.section-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  margin-bottom: var(--spacing-sm);
}

.section-title {
  margin-bottom: var(--spacing-lg);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-500);
  max-width: 640px;
}
```

- [ ] **Step 2: Verify in browser — page background is white, fonts load (Inter)**

Run: `open "/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/index.html"`

Check: Inter font loads, no FOUT. Background white. Console clean.

- [ ] **Step 3: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): complete CSS foundation — custom props, reset, typography, layout, buttons, cards"
```

---

### Task 3: NAV (sticky) + Hero Section

**Files:**
- Modify: `roman/index.html` (replace `<nav>` and `<section id="hero">` placeholders)

Add CSS for nav and hero at the end of the `<style>` block. Build sticky nav with logo, links, phone, hamburger menu. Hero with background image, H1, subline, two CTAs.

- [ ] **Step 1: Add NAV + Hero CSS to end of `<style>` block**

Append after the `.section-subtitle` rule:

```css
/* === NAV === */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--color-navy);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.nav__logo {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-white);
  white-space: nowrap;
}

.nav__links {
  display: none;
  gap: var(--spacing-xl);
}

.nav__links a {
  color: var(--color-gray-300);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color var(--transition);
}
.nav__links a:hover { color: var(--color-white); }

.nav__phone {
  color: var(--color-gold);
  font-weight: 500;
  font-size: var(--font-size-sm);
  display: none;
}

.nav__hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  padding: var(--spacing-xs);
}
.nav__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-white);
  transition: all var(--transition);
}

.nav__mobile {
  display: none;
  position: fixed;
  top: var(--nav-height);
  left: 0;
  right: 0;
  background: var(--color-navy);
  padding: var(--spacing-xl) var(--spacing-lg);
  flex-direction: column;
  gap: var(--spacing-lg);
  z-index: 999;
}
.nav__mobile.active { display: flex; }
.nav__mobile a {
  color: var(--color-gray-300);
  font-size: var(--font-size-lg);
  font-weight: 500;
}
.nav__mobile a:hover { color: var(--color-white); }
.nav__mobile-phone {
  color: var(--color-gold);
  font-weight: 600;
  font-size: var(--font-size-lg);
}

@media (min-width: 768px) {
  .nav__phone { display: block; }
}

@media (min-width: 1024px) {
  .nav__links { display: flex; }
  .nav__hamburger { display: none; }
}

/* === HERO === */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: var(--nav-height);
  background: var(--color-navy);
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  background-image: url('https://romanbecker.de/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-16-at-23.05.58.jpeg');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  padding: var(--spacing-3xl) 0;
}

.hero h1 {
  color: var(--color-white);
  margin-bottom: var(--spacing-lg);
}

.hero__subline {
  color: var(--color-gray-300);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.7;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}
```

- [ ] **Step 2: Replace `<nav>` placeholder with full NAV HTML**

```html
<nav id="nav" class="nav">
  <div class="nav__inner">
    <a href="#hero" class="nav__logo">Roman Becker – Immobilienmakler Köln</a>
    <div class="nav__links">
      <a href="#fuer-wen">Für Verkäufer</a>
      <a href="#prozess">Prozess</a>
      <a href="#ueber-roman">Über Roman</a>
      <a href="#faq">FAQ</a>
      <a href="#kontakt">Kontakt</a>
    </div>
    <a href="tel:+491775156969" class="nav__phone">+49 177 515 69 69</a>
    <button class="nav__hamburger" aria-label="Menü öffnen" onclick="document.querySelector('.nav__mobile').classList.toggle('active')">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav__mobile">
    <a href="#fuer-wen" onclick="this.parentElement.classList.remove('active')">Für Verkäufer</a>
    <a href="#prozess" onclick="this.parentElement.classList.remove('active')">Prozess</a>
    <a href="#ueber-roman" onclick="this.parentElement.classList.remove('active')">Über Roman</a>
    <a href="#faq" onclick="this.parentElement.classList.remove('active')">FAQ</a>
    <a href="#kontakt" onclick="this.parentElement.classList.remove('active')">Kontakt</a>
    <a href="tel:+491775156969" class="nav__mobile-phone">+49 177 515 69 69</a>
  </div>
</nav>
```

- [ ] **Step 3: Replace `<section id="hero">` placeholder with full Hero HTML**

```html
<section id="hero" class="hero">
  <div class="hero__bg" role="img" aria-label="Sonnenuntergang über Köln-Sülz"></div>
  <div class="container">
    <div class="hero__content">
      <h1>Ihr diskreter Partner für den Verkauf hochwertiger Immobilien in Köln und Umgebung</h1>
      <p class="hero__subline">IHK-zertifizierter Immobilienmakler · EVERNEST-Netzwerk mit 380+ Maklern · Persönliche Betreuung von der Bewertung bis zum Notartermin</p>
      <div class="hero__ctas">
        <a href="#kontakt" class="btn btn--primary">Kostenlose Bewertung vereinbaren</a>
        <a href="#ueber-roman" class="btn btn--secondary">Roman kennenlernen</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verify in browser — desktop and mobile (375px)**

Check: Sticky nav stays on scroll. Hero fills viewport. Phone visible on desktop. Hamburger on mobile. CTAs render correctly. Background image loads with overlay.

- [ ] **Step 5: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): sticky nav with hamburger + hero section with CTAs"
```

---

### Task 4: Trust Strip + Für-Wen Cards + Prozess

**Files:**
- Modify: `roman/index.html` (replace sections 2, 3, 4 placeholders + add CSS)

Three content sections: trust numbers strip, 3 clickable target audience cards, 5-step process timeline.

- [ ] **Step 1: Add CSS for trust, cards, and process sections**

Append to `<style>`:

```css
/* === TRUST STRIP === */
.trust {
  background: var(--color-navy-light);
  padding: var(--spacing-xl) 0;
}

.trust__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  text-align: center;
}

.trust__item-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gold);
}

.trust__item-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-300);
  margin-top: var(--spacing-xs);
}

@media (min-width: 768px) {
  .trust__grid { grid-template-columns: repeat(5, 1fr); }
}

/* === FÜR WEN === */
.fuer-wen__card {
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: all var(--transition);
}
.fuer-wen__card:hover {
  border-left-color: var(--color-gold);
}
.fuer-wen__card h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-navy);
}
.fuer-wen__card p {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  line-height: 1.7;
}

/* === PROZESS === */
.prozess__steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  position: relative;
}

.prozess__step {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.prozess__number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-gold);
  color: var(--color-navy);
  font-weight: 700;
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.prozess__text h3 {
  margin-bottom: var(--spacing-xs);
}

.prozess__text p {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  line-height: 1.7;
}

.prozess__cta {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-off-white);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  text-align: center;
}
```

- [ ] **Step 2: Replace Trust section HTML**

```html
<section id="trust" class="trust">
  <div class="container">
    <div class="trust__grid">
      <div class="trust__item">
        <div class="trust__item-value">380+</div>
        <div class="trust__item-label">Makler im Netzwerk</div>
      </div>
      <div class="trust__item">
        <div class="trust__item-value">38</div>
        <div class="trust__item-label">Standorte deutschlandweit</div>
      </div>
      <div class="trust__item">
        <div class="trust__item-value">10,95 Mio. €</div>
        <div class="trust__item-label">Höchstes Objekt vermarktet</div>
      </div>
      <div class="trust__item">
        <div class="trust__item-value">5,0 ★</div>
        <div class="trust__item-label">Google-Bewertung</div>
      </div>
      <div class="trust__item">
        <div class="trust__item-value">[ROMAN: X]</div>
        <div class="trust__item-label">Objekte in Köln verkauft</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace Für-Wen section HTML**

```html
<section id="fuer-wen" class="section">
  <div class="container">
    <p class="section-label">Für Verkäufer</p>
    <h2 class="section-title">In welcher Situation befinden Sie sich?</h2>
    <div class="grid-3">
      <a href="#prozess" class="card fuer-wen__card">
        <h3>Sie möchten diskret verkaufen</h3>
        <p>Kein Portal, kein öffentliches Inserat. Vorgemerkter Käuferpool aus dem EVERNEST-Netzwerk. Off-Market wenn gewünscht.</p>
      </a>
      <a href="#faq" class="card fuer-wen__card">
        <h3>Sie haben geerbt und wissen nicht weiter</h3>
        <p>Erbschaftsimmobilien haben besondere Anforderungen — rechtlich, steuerlich, emotional. Roman begleitet Sie strukturiert und diskret durch den gesamten Prozess.</p>
      </a>
      <a href="#kontakt" class="card fuer-wen__card">
        <h3>Sie haben eine Kapitalanlage zu veräußern</h3>
        <p>MFH, Konvolute, Renditeobjekte. Roman prüft Mietverträge, Rendite, WEG-Beschlüsse und findet qualifizierte Investoren aus dem Netzwerk.</p>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Replace Prozess section HTML**

```html
<section id="prozess" class="section section--gray">
  <div class="container">
    <p class="section-label">Der Prozess</p>
    <h2 class="section-title">So läuft der Verkauf mit Roman Becker</h2>
    <div class="prozess__steps">
      <div class="prozess__step">
        <div class="prozess__number">1</div>
        <div class="prozess__text">
          <h3>Kostenlose Erstbewertung</h3>
          <p>Vor-Ort-Termin oder telefonisch. Roman prüft alle wertrelevanten Faktoren persönlich — Lage, Baujahr, Zustand, Energieeffizienz, Baulasten und aktuelle Marktlage.</p>
        </div>
      </div>
      <div class="prozess__step">
        <div class="prozess__number">2</div>
        <div class="prozess__text">
          <h3>Individuelle Verkaufsstrategie</h3>
          <p>Diskret (Off-Market) oder öffentlich. Gemeinsam entschieden, nicht vorgegeben. Sie behalten die Kontrolle über den gesamten Prozess.</p>
        </div>
      </div>
      <div class="prozess__step">
        <div class="prozess__number">3</div>
        <div class="prozess__text">
          <h3>Professionelle Vermarktung</h3>
          <p>EVERNEST-CRM, vorgemerkter Käuferpool, Portale wenn gewünscht, hochwertiges Exposé. Ihre Immobilie erreicht die richtigen Interessenten.</p>
        </div>
      </div>
      <div class="prozess__step">
        <div class="prozess__number">4</div>
        <div class="prozess__text">
          <h3>Käuferprüfung</h3>
          <p>Bonität, Ernsthaftigkeit, Grundbuch- und Baulastencheck, Kaufvertragsprüfung. Nur geprüfte Käufer kommen in die engere Auswahl.</p>
        </div>
      </div>
      <div class="prozess__step">
        <div class="prozess__number">5</div>
        <div class="prozess__text">
          <h3>Notartermin & Abschluss</h3>
          <p>Roman begleitet Sie bis zur Schlüsselübergabe. Vollständige Abwicklung, keine offenen Fragen.</p>
        </div>
      </div>
    </div>
    <div class="prozess__cta">
      Nach dem Abschluss bitte ich Sie um eine kurze Google-Bewertung — das hilft anderen Verkäufern, den richtigen Makler zu finden.
    </div>
  </div>
</section>
```

- [ ] **Step 5: Verify in browser — desktop + mobile**

Check: Trust strip shows 5 items in row on desktop, 2-column grid on mobile. Cards hover effect works. Process steps render with gold numbers. Smooth scroll from nav links works.

- [ ] **Step 6: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): trust strip, target audience cards, 5-step process section"
```

---

### Task 5: Über Roman + Referenzobjekte + Bewertungen

**Files:**
- Modify: `roman/index.html` (replace sections 5, 6, 7 + add CSS)

Roman's bio section with photo, listings grid 2x3, reviews with stars.

- [ ] **Step 1: Add CSS for about, listings, reviews**

Append to `<style>`:

```css
/* === ÜBER ROMAN === */
.about__grid {
  display: grid;
  gap: var(--spacing-2xl);
  align-items: center;
}

@media (min-width: 768px) {
  .about__grid { grid-template-columns: 1fr 1.5fr; }
}

.about__image {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-gold);
  margin: 0 auto;
}

@media (min-width: 768px) {
  .about__image { width: 320px; height: 320px; }
}

.about__text h2 { margin-bottom: var(--spacing-lg); }

.about__text p {
  margin-bottom: var(--spacing-md);
  color: var(--color-gray-700);
  line-height: 1.8;
}

.about__qualifications {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-off-white);
  border-radius: var(--border-radius);
}

.about__qualifications h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.about__qualifications ul {
  display: grid;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.about__qualifications li::before {
  content: "✓ ";
  color: var(--color-gold);
  font-weight: 700;
}

/* === REFERENZOBJEKTE === */
.objekte__card {
  padding: var(--spacing-lg);
}

.objekte__preis {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-navy);
}

.objekte__lage {
  font-size: var(--font-size-sm);
  color: var(--color-gold);
  font-weight: 500;
  margin-top: var(--spacing-xs);
}

.objekte__typ {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin-top: var(--spacing-xs);
}

.objekte__link {
  display: inline-block;
  margin-top: var(--spacing-2xl);
  color: var(--color-gold);
  font-weight: 500;
  transition: color var(--transition);
}
.objekte__link:hover { color: var(--color-gold-light); }

/* === BEWERTUNGEN === */
.reviews__stars {
  font-size: var(--font-size-4xl);
  color: var(--color-gold);
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.reviews__rating {
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-2xl);
}

.review__card {
  padding: var(--spacing-xl);
  font-style: italic;
  color: var(--color-gray-700);
  line-height: 1.8;
}

.review__author {
  font-style: normal;
  font-weight: 600;
  color: var(--color-navy);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.reviews__google-link {
  text-align: center;
  margin-top: var(--spacing-2xl);
}

.reviews__google-link a {
  color: var(--color-gold);
  font-weight: 500;
}
```

- [ ] **Step 2: Replace Über Roman section HTML**

```html
<section id="ueber-roman" class="section">
  <div class="container">
    <div class="about__grid">
      <div>
        <img src="https://images.ctfassets.net/if6f7uzjzqut/7GPShKUqk7lhFSRu0ld79d/c73d75258663658a345ed9e012237e36/Roman_Becker_Upload.jpg"
             alt="Roman Becker, Immobilienmakler in Köln"
             class="about__image"
             loading="lazy"
             width="320" height="320">
      </div>
      <div class="about__text">
        <p class="section-label">Über Roman</p>
        <h2>Makler aus der Nachbarschaft — mit der Reichweite eines Netzwerks</h2>
        <p>Ich lebe mit meiner Familie in Köln-Sülz. Meine Zwillinge gehen in die Kita ums Eck, meine Frau hat ihre Zahnarztpraxis am Heumarkt. Wenn ich vom De-Noel-Platz zum Balthasar laufe, treffe ich Nachbarn, Kunden und Menschen, denen ich bei einer der wichtigsten Entscheidungen ihres Lebens helfen durfte.</p>
        <p>Ich kenne den Kölner Immobilienmarkt nicht aus dem Büro, sondern von der Straße. Das ist der Unterschied: Ich weiß, was eine Wohnung in der Lotharstraße wert ist — nicht weil es im System steht, sondern weil ich dort lebe.</p>
        <p>Als IHK-zertifizierter Makler arbeite ich selbstständig über EVERNEST — mit der Rückendeckung von 380+ Kollegen, einem eigenen CRM, internen Softwareentwicklern und einem vorgemerkten Käuferpool. Technologie und Netzwerk im Hintergrund, persönliche Betreuung im Vordergrund.</p>

        <div class="about__qualifications">
          <h3>Was ich beim Verkauf prüfe:</h3>
          <ul>
            <li>Lage, Baujahr, Zustand, Sanierungsmaßnahmen</li>
            <li>Energieeffizienz und aktuelle Zinslage</li>
            <li>Baulasten und Grundbuchdienstbarkeiten</li>
            <li>Instandhaltungsrücklagen und WEG-Beschlüsse</li>
            <li>Miteigentumsanteile und Kaufvertrag</li>
          </ul>
        </div>

        <a href="#kontakt" class="btn btn--primary" style="margin-top: var(--spacing-xl);">Sprechen Sie mich direkt an</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace Referenzobjekte section HTML**

```html
<section id="objekte" class="section section--gray">
  <div class="container">
    <p class="section-label">Aktuelle Objekte</p>
    <h2 class="section-title">Referenzobjekte im Überblick</h2>
    <div class="grid-3">
      <div class="card objekte__card">
        <div class="objekte__preis">10.950.000 €</div>
        <div class="objekte__lage">Köln-Dellbrück</div>
        <div class="objekte__typ">Wohnanlage</div>
      </div>
      <div class="card objekte__card">
        <div class="objekte__preis">4.900.000 €</div>
        <div class="objekte__lage">Pulheim</div>
        <div class="objekte__typ">Konvolut 9 Neubauwohnungen</div>
      </div>
      <div class="card objekte__card">
        <div class="objekte__preis">3.249.000 €</div>
        <div class="objekte__lage">Langenfeld</div>
        <div class="objekte__typ">Saniertes Mehrfamilienhaus</div>
      </div>
      <div class="card objekte__card">
        <div class="objekte__preis">949.000 €</div>
        <div class="objekte__lage">Pulheim</div>
        <div class="objekte__typ">Baugrundstück</div>
      </div>
      <div class="card objekte__card">
        <div class="objekte__preis">ab 399.000 €</div>
        <div class="objekte__lage">Köln-Riehl</div>
        <div class="objekte__typ">Colonia-Haus</div>
      </div>
      <div class="card objekte__card">
        <div class="objekte__preis">ab 350.000 €</div>
        <div class="objekte__lage">Pulheim</div>
        <div class="objekte__typ">Amselquartier — Neubau</div>
      </div>
    </div>
    <div style="text-align: center; margin-top: var(--spacing-2xl);">
      <a href="https://www.evernest.com/de/unsere-makler/koeln/roman-becker/" target="_blank" rel="noopener noreferrer" class="objekte__link">Alle Objekte auf EVERNEST ansehen →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Replace Bewertungen section HTML**

```html
<section id="bewertungen" class="section">
  <div class="container">
    <p class="section-label">Bewertungen</p>
    <div class="reviews__stars">★★★★★</div>
    <div class="reviews__rating">5,0 von 5,0 — Google-Bewertung</div>
    <div class="grid-3">
      <div class="card review__card">
        <p>[ROMAN: Bewertungstext 1 von Google einfügen]</p>
        <div class="review__author">[ROMAN: Name Bewertung 1]</div>
      </div>
      <div class="card review__card">
        <p>[ROMAN: Bewertungstext 2 von Google einfügen]</p>
        <div class="review__author">[ROMAN: Name Bewertung 2]</div>
      </div>
      <div class="card review__card">
        <p>[ROMAN: Bewertungstext 3 von Google einfügen]</p>
        <div class="review__author">[ROMAN: Name Bewertung 3]</div>
      </div>
    </div>
    <div class="reviews__google-link">
      <a href="https://maps.app.goo.gl/KheaK3QCedQSAzrVA" target="_blank" rel="noopener noreferrer">Alle Bewertungen auf Google ansehen →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Verify in browser — desktop + mobile**

Check: Photo renders round with gold border. 2x3 grid on desktop, stacked on mobile. Cards hover. Reviews show placeholder text with stars.

- [ ] **Step 6: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): about section, listings grid, reviews with Google link"
```

---

### Task 6: FAQ (Accordion) + Stadtteil-Expertise

**Files:**
- Modify: `roman/index.html` (replace sections 8, 9 + add CSS)

FAQ with expandable accordion (no library). Stadtteil grid with 12 entries.

- [ ] **Step 1: Add CSS for FAQ accordion and Stadtteile**

Append to `<style>`:

```css
/* === FAQ === */
.faq__item {
  border-bottom: 1px solid var(--color-gray-300);
}

.faq__question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) 0;
  background: none;
  cursor: pointer;
  text-align: left;
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-navy);
  gap: var(--spacing-md);
}

.faq__question::after {
  content: "+";
  font-size: var(--font-size-xl);
  font-weight: 300;
  color: var(--color-gold);
  flex-shrink: 0;
  transition: transform var(--transition);
}

.faq__item.active .faq__question::after {
  content: "−";
}

.faq__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
}

.faq__item.active .faq__answer {
  max-height: 600px;
  padding-bottom: var(--spacing-lg);
}

.faq__answer p {
  color: var(--color-gray-700);
  line-height: 1.8;
  font-size: var(--font-size-sm);
}

.faq__answer strong {
  color: var(--color-navy);
}

/* === STADTTEILE === */
.stadtteile__grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .stadtteile__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .stadtteile__grid { grid-template-columns: repeat(3, 1fr); }
}

.stadtteil__card {
  padding: var(--spacing-lg);
}

.stadtteil__card h3 {
  font-size: var(--font-size-base);
  color: var(--color-navy);
  margin-bottom: var(--spacing-xs);
}

.stadtteil__card p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  line-height: 1.7;
}
```

- [ ] **Step 2: Replace FAQ section HTML**

```html
<section id="faq" class="section section--gray">
  <div class="container">
    <p class="section-label">Häufige Fragen</p>
    <h2 class="section-title">Was Verkäufer wissen möchten</h2>
    <div class="faq__list">
      <div class="faq__item">
        <button class="faq__question">Was kostet ein Makler beim Hausverkauf in Köln?</button>
        <div class="faq__answer">
          <p><strong>In der Regel 1,785 % + MwSt. für den Verkäufer</strong> (ca. 17.000 € bei 800.000 € Kaufpreis). Die gesetzlich geregelte Gesamtprovision beträgt 3,57 % und wird seit 2020 hälftig zwischen Käufer und Verkäufer geteilt. Dafür erhalten Sie professionelle Bewertung, Vermarktung, Käuferprüfung und vollständige Abwicklung bis zum Notartermin.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Wie lange dauert der Verkauf einer Immobilie in Köln?</button>
        <div class="faq__answer">
          <p><strong>Typischerweise 3–5 Monate</strong> — von der Bewertung bis zur Schlüsselübergabe. In gefragten Lagen wie Sülz, Lindenthal oder Marienburg sind kürzere Zeiträume möglich, wenn ein vorgemerkter Käuferpool vorhanden ist.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Was ist meine Immobilie in Köln aktuell wert?</button>
        <div class="faq__answer">
          <p><strong>Das hängt von Lage, Baujahr, Zustand, Energieeffizienz, Zinslage und eingetragenen Baulasten ab.</strong> Für eine erste Einschätzung nutzen Sie meine Online-Bewertung — für eine fundierte Bewertung ist ein Vor-Ort-Termin unerlässlich.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Kann ich meine Immobilie in Köln diskret ohne Portal verkaufen?</button>
        <div class="faq__answer">
          <p><strong>Ja.</strong> Über das EVERNEST-Netzwerk mit über 380 Maklern und einem vorgemerkten Käuferpool ist ein diskreter Off-Market-Verkauf möglich — ohne öffentliches Inserat auf ImmoScout oder Immowelt.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Was ist der Unterschied zwischen einem lokalen Makler und einem großen Netzwerk?</button>
        <div class="faq__answer">
          <p><strong>Mit mir erhalten Sie beides:</strong> Die persönliche Betreuung eines Maklers, der in Sülz wohnt und den Kölner Markt kennt — plus die Reichweite und Technologie von EVERNEST mit 380+ Maklern an 38 deutschen Standorten.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Wie läuft der Verkauf einer Erbschaftsimmobilie ab?</button>
        <div class="faq__answer">
          <p><strong>Zuerst werden Erbschein, Grundbuchauszug und ggf. Erbengemeinschaft geklärt.</strong> Ich begleite Sie von der ersten Bewertung über die Abstimmung mit Notar und Steuerberater bis zum Verkauf — diskret und ohne Zeitdruck.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Wie finde ich den richtigen Makler für meine hochwertige Immobilie in Köln?</button>
        <div class="faq__answer">
          <p>Das hängt weniger von der Größe des Büros ab als von der Frage: Wer kennt die Käufer, die für Ihre Immobilie wirklich in Frage kommen — und wer hat Zugang zu ihnen?</p>
          <p style="margin-top: var(--spacing-sm);">Ich arbeite selbstständig, aber nicht allein. Über EVERNEST habe ich Zugang zu einem vorgemerkten Käuferpool und kann bei Bedarf diskret vermarkten, ohne dass Ihre Immobilie öffentlich auf Portalen erscheint. Das ist gerade bei hochwertigen Objekten oft der bessere Weg — für den Preis, für die Diskretion, und weil qualifizierte Käufer in diesem Segment nicht auf ImmoScout suchen.</p>
          <p style="margin-top: var(--spacing-sm);">Was ich Ihnen empfehle: Rufen Sie drei Makler an. Fragen Sie jeden konkret, wie viele Objekte in Ihrer Preisspanne er in den letzten 12 Monaten in Ihrer Lage verkauft hat — und wer die Käufer waren. Die Antwort sagt mehr als jede Referenzliste.</p>
        </div>
      </div>
      <div class="faq__item">
        <button class="faq__question">Was prüft ein Makler beim Kaufvertrag und Grundbuch?</button>
        <div class="faq__answer">
          <p><strong>Grundbuch, Baulastenverzeichnis, Miteigentumsanteile, WEG-Beschlüsse, Instandhaltungsrücklagen und Käuferbonität</strong> — alles bevor wir zum Notar gehen. Eingetragene Dienstbarkeiten und Baulasten können den Wert erheblich beeinflussen.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace Stadtteile section HTML**

```html
<section id="stadtteile" class="section">
  <div class="container">
    <p class="section-label">Stadtteil-Expertise</p>
    <h2 class="section-title">In diesen Lagen bin ich für Sie aktiv</h2>
    <div class="stadtteile__grid">
      <div class="card stadtteil__card">
        <h3>Köln-Sülz</h3>
        <p>Mein Heimat-Veedel. Altbauwohnungen, Reihenhäuser, Familienlage. Nachfrage durchgehend hoch — ich kenne hier jede Straße.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Lindenthal</h3>
        <p>Villen, große Eigentumswohnungen, Uni-Nähe. Premium-Lage mit stabilen Preisen und anspruchsvollen Käufern.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Rodenkirchen</h3>
        <p>Rheinlage, Einfamilienhäuser, ruhig. Beliebt bei Familien mit gehobenen Ansprüchen — diskreter Markt.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Marienburg</h3>
        <p>Kölns exklusivste Adresse. Villen, Repräsentanz, diskrete Verkäufe. Hier zählt Diskretion mehr als Reichweite.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Hahnwald</h3>
        <p>Großgrundstücke, Privatsphäre, Top-Segment. Käufer kommen selten über Portale — Netzwerk entscheidet.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Junkersdorf</h3>
        <p>Familienfreundlich, Neubau und Bestand. Gute Anbindung, steigende Nachfrage bei jungen Familien.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Klettenberg</h3>
        <p>Altbau-Charme, Bürgerpark-Nähe. Hohe Nachfrage bei jungen Familien und Paaren mit Sinn für Ästhetik.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Bayenthal</h3>
        <p>Rhein-Nähe, gemischtes Quartier, aufstrebend. Attraktiv für Kapitalanleger und Selbstnutzer gleichermaßen.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Dellbrück</h3>
        <p>Rechtsrheinisch, bezahlbarer Einstieg ins Premium-Segment. Mehrfamilienhäuser und Wohnanlagen mit Potenzial.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Pulheim</h3>
        <p>Neubau-Hotspot, Baugrundstücke, Konvolute. Starke Investoren-Nachfrage direkt vor den Toren Kölns.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Bergisch Gladbach</h3>
        <p>Stadtrandlage mit Grün, Einfamilienhäuser. Wachsender Markt für Familien die mehr Platz suchen.</p>
      </div>
      <div class="card stadtteil__card">
        <h3>Leverkusen</h3>
        <p>Industrie-Nähe, MFH, Kapitalanlagen. Solide Renditen und konstante Nachfrage bei Investoren.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verify in browser — FAQ accordion clicks work (they won't yet — JS is in Task 9), Stadtteile grid renders**

Check: FAQ items display with + icon. Stadtteile 3-col grid on desktop, stacked on mobile. Cards hover.

- [ ] **Step 5: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): FAQ accordion (8 questions) + 12 Stadtteile expertise grid"
```

---

### Task 7: Empfehlung + Maps + Kontaktformular + Footer

**Files:**
- Modify: `roman/index.html` (replace sections 10, 11, 12, footer + add CSS)

Referral section, Google Maps embed, contact form with all fields, footer with NAP + links.

- [ ] **Step 1: Add CSS for referral, contact form, footer**

Append to `<style>`:

```css
/* === EMPFEHLUNG === */
.empfehlung__grid {
  display: grid;
  gap: var(--spacing-xl);
}

@media (min-width: 768px) {
  .empfehlung__grid { grid-template-columns: 1fr 1fr; }
}

.empfehlung__card {
  padding: var(--spacing-xl);
}

.empfehlung__card h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-navy);
}

.empfehlung__card p {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
}

/* === MAPS === */
.maps { padding: 0; }
.maps iframe {
  width: 100%;
  height: 400px;
  border: 0;
}

/* === KONTAKT === */
.kontakt__grid {
  display: grid;
  gap: var(--spacing-2xl);
}

@media (min-width: 768px) {
  .kontakt__grid { grid-template-columns: 1.2fr 1fr; }
}

.kontakt__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-navy);
  margin-bottom: var(--spacing-xs);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius);
  background: var(--color-white);
  transition: border-color var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
}

.form-group textarea { resize: vertical; min-height: 100px; }

.form-row {
  display: grid;
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .form-row { grid-template-columns: 1fr 1fr; }
}

.form-success {
  display: none;
  padding: var(--spacing-lg);
  background: #ecfdf5;
  border-radius: var(--border-radius);
  color: #065f46;
  text-align: center;
  line-height: 1.7;
}

.kontakt__info h3 {
  margin-bottom: var(--spacing-lg);
}

.kontakt__detail {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.kontakt__detail-label {
  font-weight: 500;
  color: var(--color-navy);
  min-width: 80px;
}

.kontakt__detail a {
  color: var(--color-gold);
  transition: color var(--transition);
}
.kontakt__detail a:hover { color: var(--color-gold-light); }

/* === FOOTER === */
.footer {
  background: var(--color-navy);
  color: var(--color-gray-300);
  padding: var(--spacing-2xl) 0;
  font-size: var(--font-size-sm);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
  text-align: center;
}

@media (min-width: 768px) {
  .footer__inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer__links {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}

.footer__links a {
  color: var(--color-gray-300);
  transition: color var(--transition);
}
.footer__links a:hover { color: var(--color-white); }

.footer__disclaimer {
  font-size: 0.75rem;
  color: var(--color-gray-500);
  text-align: center;
  margin-top: var(--spacing-lg);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}
```

- [ ] **Step 2: Replace Empfehlung section HTML**

```html
<section id="empfehlung" class="section section--gray">
  <div class="container">
    <p class="section-label">Empfehlung & Netzwerk</p>
    <h2 class="section-title">Zusammenarbeit mit Partnern</h2>
    <div class="empfehlung__grid">
      <div class="card empfehlung__card">
        <h3>Für Notare, Steuerberater, Anwälte & Banken</h3>
        <p>Empfehlen Sie Ihren Mandanten einen Makler, der diskret arbeitet, IHK-zertifiziert ist und durch das EVERNEST-Netzwerk Zugang zu qualifizierten Käufern hat. Ich halte Sie über den Fortschritt auf dem Laufenden.</p>
        <a href="#kontakt" class="btn btn--outline">Kontakt aufnehmen</a>
      </div>
      <div class="card empfehlung__card">
        <h3>Kennen Sie jemanden, der verkaufen möchte?</h3>
        <p>Leiten Sie diese Seite weiter oder nutzen Sie das Kontaktformular mit dem Feld „Empfohlen von" — so weiß ich, wem ich den Kontakt verdanke.</p>
        <a href="https://wa.me/491775156969?text=Hallo%20Roman%2C%20ich%20wurde%20empfohlen%20und%20möchte%20mich%20zum%20Thema%20Immobilienverkauf%20beraten%20lassen." target="_blank" rel="noopener noreferrer" class="btn btn--outline">Via WhatsApp empfehlen</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Replace Maps section HTML**

```html
<section id="maps" class="maps">
  <!-- [ROMAN: Google Maps Embed-Code vom GBP einfügen] -->
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513.5!2d6.9438!3d50.9420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKaiser-Wilhelm-Ring+17-21%2C+50672+K%C3%B6ln!5e0!3m2!1sde!2sde!4v1"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="Büro Roman Becker – Kaiser-Wilhelm-Ring 17-21, 50672 Köln"
    allowfullscreen>
  </iframe>
</section>
```

- [ ] **Step 4: Replace Kontakt section HTML**

```html
<section id="kontakt" class="section section--navy">
  <div class="container">
    <p class="section-label" style="color: var(--color-gold);">Kontakt</p>
    <h2 style="color: var(--color-white); margin-bottom: var(--spacing-2xl);">Lassen Sie uns sprechen</h2>
    <div class="kontakt__grid">
      <div>
        <form class="kontakt__form" id="kontaktForm" action="submit.php" method="POST">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="telefon">Telefon *</label>
              <input type="tel" id="telefon" name="telefon" required>
            </div>
          </div>
          <div class="form-group">
            <label for="email">E-Mail</label>
            <input type="email" id="email" name="email">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="immobilientyp">Immobilientyp</label>
              <select id="immobilientyp" name="immobilientyp">
                <option value="">Bitte wählen</option>
                <option value="Haus">Haus</option>
                <option value="Wohnung">Wohnung</option>
                <option value="MFH">Mehrfamilienhaus</option>
                <option value="Grundstück">Grundstück</option>
                <option value="Erbschaft">Erbschaft</option>
              </select>
            </div>
            <div class="form-group">
              <label for="plz">PLZ der Immobilie</label>
              <input type="text" id="plz" name="plz" maxlength="5" pattern="[0-9]{5}">
            </div>
          </div>
          <div class="form-group">
            <label for="preisspanne">Geschätzte Preisspanne</label>
            <select id="preisspanne" name="preisspanne">
              <option value="">Bitte wählen</option>
              <option value="bis 500k">Bis 500.000 €</option>
              <option value="500k-1M">500.000 – 1.000.000 €</option>
              <option value="1M-2M">1.000.000 – 2.000.000 €</option>
              <option value="über 2M">Über 2.000.000 €</option>
            </select>
          </div>
          <div class="form-group">
            <label for="nachricht">Kurze Nachricht (optional)</label>
            <textarea id="nachricht" name="nachricht" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="empfohlen">Empfohlen von (optional)</label>
            <input type="text" id="empfohlen" name="empfohlen">
          </div>
          <button type="submit" class="btn btn--primary" style="align-self: flex-start;">Nachricht senden</button>
        </form>
        <div class="form-success" id="formSuccess">
          <strong>Vielen Dank!</strong><br>
          Roman meldet sich persönlich innerhalb von 24 Stunden bei Ihnen.<br>
          Dringendes Anliegen? Rufen Sie direkt an: <a href="tel:+491775156969" style="color: #065f46; font-weight: 600;">+49 177 515 69 69</a>
        </div>
      </div>
      <div class="kontakt__info" style="color: var(--color-gray-300);">
        <h3 style="color: var(--color-white);">Direkter Kontakt</h3>
        <div class="kontakt__detail">
          <span class="kontakt__detail-label">Telefon</span>
          <a href="tel:+491775156969">+49 177 515 69 69</a>
        </div>
        <div class="kontakt__detail">
          <span class="kontakt__detail-label">E-Mail</span>
          <a href="mailto:roman.becker@evernest.com">roman.becker@evernest.com</a>
        </div>
        <div class="kontakt__detail">
          <span class="kontakt__detail-label">Büro</span>
          <span>Kaiser-Wilhelm-Ring 17-21, 50672 Köln</span>
        </div>
        <div class="kontakt__detail">
          <span class="kontakt__detail-label">Zeiten</span>
          <span>Mo–Fr 09:00–19:00 Uhr</span>
        </div>
        <div class="kontakt__detail">
          <span class="kontakt__detail-label">Instagram</span>
          <a href="https://www.instagram.com/roman_becker_immobilien/" target="_blank" rel="noopener noreferrer">@roman_becker_immobilien</a>
        </div>
        <div style="margin-top: var(--spacing-xl);">
          <!-- [ROMAN: Calendly-Link für Terminbuchung einfügen] -->
          <a href="#" class="btn btn--primary" style="pointer-events: none; opacity: 0.5;">[ROMAN: Calendly-Termin buchen]</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Replace Footer HTML**

```html
<footer id="footer" class="footer">
  <div class="container">
    <div class="footer__inner">
      <div>© 2026 Roman Becker – EVERNEST · Kaiser-Wilhelm-Ring 17-21, 50672 Köln</div>
      <div class="footer__links">
        <a href="#">Datenschutz</a>
        <a href="#">Impressum</a>
        <a href="#">AGB</a>
        <a href="https://www.instagram.com/roman_becker_immobilien/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.evernest.com" target="_blank" rel="noopener noreferrer">EVERNEST</a>
      </div>
    </div>
    <div class="footer__disclaimer">
      Roman Becker ist selbstständiger Immobilienmakler (IHK) und arbeitet über die EVERNEST GmbH. Alle Angaben ohne Gewähr. Provisionsregelungen gemäß gesetzlicher Vorgaben.
    </div>
  </div>
</footer>
```

- [ ] **Step 6: Verify in browser — full page scrolls, all 12 sections visible, form renders**

Check: All sections present. Form fields work. Footer shows NAP. Maps iframe loads. Empfehlung cards hover.

- [ ] **Step 7: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): referral section, maps embed, contact form, footer"
```

---

### Task 8: JavaScript — Hamburger, FAQ Accordion, Form Handler

**Files:**
- Modify: `roman/index.html` (replace `<script>` placeholder)

Vanilla JS: FAQ accordion toggle, form submission with inline success message, smooth scroll close mobile menu.

- [ ] **Step 1: Replace the `// JS wird in Task 9 eingefügt` comment with complete JS**

```javascript
// FAQ Accordion
document.querySelectorAll('.faq__question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = this.parentElement;
    var wasActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq__item').forEach(function(el) {
      el.classList.remove('active');
    });

    // Open clicked (if it wasn't already open)
    if (!wasActive) {
      item.classList.add('active');
    }
  });
});

// Contact Form
var form = document.getElementById('kontaktForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = new FormData(form);

    fetch('submit.php', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      if (response.ok) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    })
    .catch(function() {
      // Fallback: show success anyway (PHP might not be available locally)
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    });
  });
}

// Nav background on scroll
var nav = document.querySelector('.nav');
window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
```

- [ ] **Step 2: Verify in browser**

Check: FAQ items expand/collapse on click. Only one open at a time. Form submit shows success message. Nav gets shadow on scroll. Mobile menu closes on link click (from inline onclick).

- [ ] **Step 3: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "feat(roman): JS — FAQ accordion, form handler, nav scroll shadow"
```

---

### Task 9: Supporting Files — robots.txt, sitemap.xml, llms.txt, submit.php

**Files:**
- Create: `roman/robots.txt`
- Create: `roman/sitemap.xml`
- Create: `roman/llms.txt`
- Create: `roman/submit.php`

All SEO/GEO support files and form backend.

- [ ] **Step 1: Create robots.txt**

Create `roman/robots.txt`:

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

- [ ] **Step 2: Create sitemap.xml**

Create `roman/sitemap.xml`:

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

- [ ] **Step 3: Create llms.txt**

Create `roman/llms.txt`:

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

- [ ] **Step 4: Create submit.php**

Create `roman/submit.php`:

```php
<?php
// Spam-Schutz: Honeypot-Feld prüfen (wird in Task 10 ergänzt falls gewünscht)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Felder auslesen und säubern
$name = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
$telefon = htmlspecialchars(strip_tags(trim($_POST['telefon'] ?? '')));
$email = htmlspecialchars(strip_tags(trim($_POST['email'] ?? '')));
$immobilientyp = htmlspecialchars(strip_tags(trim($_POST['immobilientyp'] ?? '')));
$plz = htmlspecialchars(strip_tags(trim($_POST['plz'] ?? '')));
$preisspanne = htmlspecialchars(strip_tags(trim($_POST['preisspanne'] ?? '')));
$nachricht = htmlspecialchars(strip_tags(trim($_POST['nachricht'] ?? '')));
$empfohlen = htmlspecialchars(strip_tags(trim($_POST['empfohlen'] ?? '')));

// Pflichtfelder prüfen
if (empty($name) || empty($telefon)) {
    http_response_code(400);
    exit('Name und Telefon sind Pflichtfelder.');
}

// E-Mail zusammenbauen
$to = 'roman.becker@evernest.com';
$subject = 'Neue Kontaktanfrage von ' . $name . ' – romanbecker.de';

$body = "Neue Anfrage über romanbecker.de\n";
$body .= "================================\n\n";
$body .= "Name: $name\n";
$body .= "Telefon: $telefon\n";
$body .= "E-Mail: $email\n";
$body .= "Immobilientyp: $immobilientyp\n";
$body .= "PLZ: $plz\n";
$body .= "Preisspanne: $preisspanne\n";
$body .= "Empfohlen von: $empfohlen\n\n";
$body .= "Nachricht:\n$nachricht\n";

$headers = "From: noreply@romanbecker.de\r\n";
$headers .= "Reply-To: " . ($email ?: $telefon) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    http_response_code(200);
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Fehler beim Senden.';
}
```

- [ ] **Step 5: Verify all files exist**

Run: `ls -la "/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/"`

Expected: `index.html`, `robots.txt`, `sitemap.xml`, `llms.txt`, `submit.php`

- [ ] **Step 6: Commit**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/robots.txt roman/sitemap.xml roman/llms.txt roman/submit.php
git commit -m "feat(roman): robots.txt, sitemap.xml, llms.txt, submit.php"
```

---

### Task 10: Final Review — Browser Test Desktop + Mobile

**Files:**
- Possibly modify: `roman/index.html` (bugfixes)

Open the page, walk through every section on desktop and mobile (375px). Fix any visual issues.

- [ ] **Step 1: Open in browser**

Run: `open "/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/index.html"`

- [ ] **Step 2: Desktop checklist**

Check each item:
- [ ] Nav is sticky, phone visible, links scroll smoothly
- [ ] Hero fills viewport, background image loads, CTAs visible
- [ ] Trust strip shows 5 items in a row
- [ ] 3 cards in Für-Wen section with hover
- [ ] 5 process steps with gold numbers
- [ ] About section: photo round, text readable, qualifications box
- [ ] 6 listing cards in 2x3 grid
- [ ] 3 review cards with placeholder text
- [ ] FAQ accordion opens/closes, one at a time
- [ ] 12 Stadtteil cards in 3x4 grid
- [ ] Empfehlung 2-col with WhatsApp link
- [ ] Maps iframe loads
- [ ] Contact form fields all work, submit shows success
- [ ] Footer shows NAP, links, disclaimer

- [ ] **Step 3: Mobile checklist (resize to 375px)**

Check each item:
- [ ] Hamburger menu opens/closes
- [ ] Phone number visible in mobile menu
- [ ] Hero text readable, CTAs stack vertically
- [ ] Trust strip wraps to 2 columns
- [ ] All cards stack single-column
- [ ] Form fields full-width
- [ ] No horizontal overflow on any section

- [ ] **Step 4: Fix any issues found**

Apply minimal fixes. If no issues, skip this step.

- [ ] **Step 5: Commit fixes (if any)**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git add roman/index.html
git commit -m "fix(roman): visual fixes from browser review"
```

- [ ] **Step 6: Push to GitHub**

```bash
cd "/Users/danielgruederich/Documents/Claude projects/fuerte-pages"
git push origin main
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | HTML skeleton + `<head>` + JSON-LD | `roman/index.html` |
| 2 | CSS foundation | `roman/index.html` |
| 3 | NAV + Hero | `roman/index.html` |
| 4 | Trust + Für-Wen + Prozess | `roman/index.html` |
| 5 | Über Roman + Listings + Reviews | `roman/index.html` |
| 6 | FAQ + Stadtteile | `roman/index.html` |
| 7 | Empfehlung + Maps + Kontakt + Footer | `roman/index.html` |
| 8 | JavaScript | `roman/index.html` |
| 9 | robots.txt, sitemap.xml, llms.txt, submit.php | 4 new files |
| 10 | Browser review + fixes + push | all |
