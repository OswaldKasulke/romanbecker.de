# Digitale Speisekarte Unterseite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unterseite `/digitale-speisekarte` auf fuerte.digital — editorial dark-theme Landing Page für den Service "Digitale Speisekarte".

**Architecture:** Neue Astro-Page (`src/pages/digitale-speisekarte.astro`) mit bestehendem `Layout.astro` (GSAP + Lenis) und `Header.astro` (angepasst für Subpages). Mockup-Section wird als isolierter `MenuMockup.astro` Component ausgelagert. Keine Backend-Logik, keine Formulare — reiner Content mit CTA → `/#kontakt`.

**Tech Stack:** Astro 4, Tailwind CSS (custom theme), GSAP ScrollTrigger (aus Layout.astro), Instrument Serif + Inter (aus Layout.astro).

---

## File Map

| Datei | Aktion | Zweck |
|-------|--------|-------|
| `src/components/Header.astro` | Modify | `isSubpage` Prop hinzufügen für absolute Nav-Links |
| `src/components/MenuMockup.astro` | Create | Browser-Frame mit Beispiel-Speisekarte |
| `src/pages/digitale-speisekarte.astro` | Create | Die eigentliche Unterseite |

---

## Task 1: Header.astro für Subpages anpassen

Auf der Startseite zeigen die Nav-Links auf `#services` und `#kontakt` (smooth scroll).
Auf Unterseiten müssen sie auf `/#services` und `/#kontakt` zeigen (Navigation zur Home + Anker).

**Files:**
- Modify: `src/components/Header.astro` (Zeile 1–5 Frontmatter + alle `href="#..."` Links)

- [ ] **Schritt 1: `isSubpage`-Prop in Frontmatter ergänzen**

Öffne `src/components/Header.astro`. Ersetze das Frontmatter (Zeilen 1–3):

```astro
---
interface Props {
  isSubpage?: boolean;
}
const { isSubpage = false } = Astro.props;
const base = isSubpage ? '/' : '';
---
```

- [ ] **Schritt 2: Alle internen Anchor-Links anpassen**

Ersetze in derselben Datei alle `href="#..."` (außer externen URLs) so:

```astro
<!-- Desktop Nav -->
<a href={`${base}#services`} class="text-white/60 text-sm font-medium hover:text-white transition-colors duration-300">
  Services
</a>
<a href={`${base}#kontakt`} class="text-white/60 text-sm font-medium hover:text-white transition-colors duration-300">
  Kontakt
</a>

<!-- Mobile Menu -->
<a href={`${base}#services`} class="text-sand text-3xl font-light tracking-tight hover:text-orange transition-colors" data-menu-link>Services</a>
<a href={`${base}#kontakt`} class="text-sand text-3xl font-light tracking-tight hover:text-orange transition-colors" data-menu-link>Kontakt</a>
```

Der `href="https://book.fuerte.digital"` bleibt unverändert.

- [ ] **Schritt 3: Verifizieren — Startseite unverändert**

```bash
cd "/Users/danielgruederich/Developer/Claude projects/fuerte-pages"
npm run build 2>&1 | tail -5
```

Erwartetes Ergebnis: Build erfolgreich, keine Fehler.

- [ ] **Schritt 4: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: Header unterstützt isSubpage-Prop für absolute Anchor-Links"
```

---

## Task 2: MenuMockup.astro Component erstellen

Isolierter Browser-Frame der eine fiktive digitale Speisekarte zeigt. Drei Gerichte mit Foto-Placeholder, Name, Beschreibung, Preis, Sprach-Flags. Wird nur in Task 3 verwendet.

**Files:**
- Create: `src/components/MenuMockup.astro`

- [ ] **Schritt 1: Datei anlegen**

Erstelle `src/components/MenuMockup.astro` mit folgendem Inhalt:

```astro
---
const items = [
  {
    name: 'Tagliatelle al Tartufo',
    desc: 'Frische Pasta, schwarzer Trüffel, Parmesan',
    price: '18,50 €',
  },
  {
    name: 'Burrata & Pomodori',
    desc: 'Büffelmilch, Heirloom-Tomaten, Basilikumöl',
    price: '14,00 €',
  },
  {
    name: 'Bistecca alla Fiorentina',
    desc: 'T-Bone, 45 Tage dry-aged, Rosmarinjus',
    price: '52,00 €',
  },
];
---

<div class="rounded-2xl overflow-hidden border border-white/[0.07] bg-card">
  <!-- Browser Chrome -->
  <div class="bg-white/[0.04] border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
    <div class="flex gap-1.5">
      <div class="w-3 h-3 rounded-full bg-white/10"></div>
      <div class="w-3 h-3 rounded-full bg-white/10"></div>
      <div class="w-3 h-3 rounded-full bg-white/10"></div>
    </div>
    <div class="flex-1 bg-white/[0.05] rounded-full px-4 py-1.5 text-[11px] text-sand/25 font-mono">
      speisekarte.mein-restaurant.de
    </div>
  </div>

  <!-- Menu Content -->
  <div class="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    {items.map((item) => (
      <div class="bg-white/[0.04] rounded-xl overflow-hidden">
        <!-- Foto Placeholder -->
        <div class="h-32 bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center">
          <svg class="w-8 h-8 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
        </div>
        <!-- Info -->
        <div class="p-4">
          <p class="text-sm font-semibold text-sand/80 mb-1 leading-tight">{item.name}</p>
          <p class="text-xs text-sand/30 leading-relaxed mb-3">{item.desc}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-orange">{item.price}</span>
            <span class="text-[10px] text-sand/20">🇩🇪 🇬🇧 🇪🇸</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Schritt 2: Build-Check**

```bash
cd "/Users/danielgruederich/Developer/Claude projects/fuerte-pages"
npm run build 2>&1 | tail -5
```

Erwartetes Ergebnis: Build erfolgreich.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/MenuMockup.astro
git commit -m "feat: MenuMockup Component — Browser-Frame mit Beispiel-Speisekarte"
```

---

## Task 3: digitale-speisekarte.astro Seite erstellen

Die eigentliche Unterseite. Importiert Layout, Header (isSubpage), MenuMockup, SiteFooter. Fünf Sections inline.

**Files:**
- Create: `src/pages/digitale-speisekarte.astro`

- [ ] **Schritt 1: Datei anlegen**

Erstelle `src/pages/digitale-speisekarte.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import MenuMockup from '../components/MenuMockup.astro';
import SiteFooter from '../components/SiteFooter.astro';

const features = [
  {
    title: 'QR-Code',
    text: 'Gäste scannen, Karte öffnet sich sofort. Kein App-Download nötig.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>`,
  },
  {
    title: 'Mit Fotos',
    text: 'Gerichte mit Bild erhöhen den Bestellwert nachweislich.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  },
  {
    title: 'Individuell',
    text: 'Deine Farben, dein Logo, deine Marke — passgenau umgesetzt.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  },
  {
    title: '48h live',
    text: 'Fertig in zwei Tagen. Kein langer Onboarding-Prozess.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
];
---

<Layout
  title="Digitale Speisekarte für Restaurants — fuerte.digital"
  description="Elegante QR-Code Speisekarten für Kölner Restaurants. Mehrsprachig, mit Fotos, immer aktuell — fertig in 48 Stunden."
>
  <Header isSubpage />

  <main>

    <!-- HERO -->
    <section class="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-10 pt-32 pb-20">

      <!-- Glow -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-orange/10 rounded-full blur-[120px] animate-glow-pulse"
          data-parallax="0.2"
        ></div>
        <div
          class="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-teal/20 rounded-full blur-[100px] animate-glow-pulse"
          style="animation-delay: -4s;"
          data-parallax="0.35"
        ></div>
      </div>

      <div class="relative z-10 max-w-[1400px] mx-auto w-full">

        <!-- Tag Pill -->
        <div class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-sand/30 border border-white/[0.06] px-4 py-2 rounded-full mb-10" data-reveal>
          <span class="w-1.5 h-1.5 rounded-full bg-orange inline-block"></span>
          Digitale Speisekarte
        </div>

        <!-- Headline -->
        <h1 class="font-serif text-heading text-sand mb-8 max-w-[720px]" data-reveal>
          Die Speisekarte,<br />
          <em class="text-sand/50">die dein Essen verdient.</em>
        </h1>

        <!-- Subtext -->
        <p class="text-base md:text-lg text-sand/40 leading-relaxed max-w-[440px] mb-12" data-reveal>
          Elegant, mehrsprachig, immer aktuell — direkt im Browser deiner Gäste.
          Kein App-Download. Kein Drucker.
        </p>

        <!-- CTA -->
        <a
          href="/#kontakt"
          class="inline-flex items-center gap-3 bg-orange text-white text-sm font-semibold px-7 py-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
          data-reveal
        >
          Jetzt anfragen
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="py-24 md:py-32 px-6 md:px-10 border-t border-white/[0.06]">
      <div class="max-w-[1400px] mx-auto">

        <p class="text-[11px] uppercase tracking-[0.25em] text-sand/25 mb-14" data-reveal>
          Was du bekommst
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden" data-reveal-group>
          {features.map((f) => (
            <div class="bg-night p-8 md:p-10">
              <div class="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange mb-6">
                <Fragment set:html={f.icon} />
              </div>
              <h3 class="text-base font-semibold text-sand mb-2">{f.title}</h3>
              <p class="text-sm text-sand/35 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <!-- MOCKUP -->
    <section class="py-24 md:py-32 px-6 md:px-10 border-t border-white/[0.06]">
      <div class="max-w-[1400px] mx-auto">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14" data-reveal>
          <h2 class="font-serif text-heading text-sand">
            So sieht's aus —<br />
            <em class="text-sand/40">für deine Gäste.</em>
          </h2>
          <p class="text-sm text-sand/30 max-w-[300px] leading-relaxed">
            Placeholder-Bilder — wird nach Projekt-Start mit echten Fotos deiner Gerichte befüllt.
          </p>
        </div>

        <div data-reveal>
          <MenuMockup />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 md:py-32 px-6 md:px-10 border-t border-white/[0.06] text-center">
      <div class="max-w-[1400px] mx-auto" data-reveal>
        <p class="font-serif text-heading text-sand/50 italic mb-12">
          Bereit für deine Karte?
        </p>
        <a
          href="/#kontakt"
          class="inline-flex items-center gap-3 bg-orange text-white text-sm font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-300"
        >
          Jetzt anfragen
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </section>

  </main>

  <SiteFooter />
</Layout>
```

- [ ] **Schritt 2: Build ausführen**

```bash
cd "/Users/danielgruederich/Developer/Claude projects/fuerte-pages"
npm run build 2>&1 | tail -10
```

Erwartetes Ergebnis: Build erfolgreich, `dist/digitale-speisekarte/index.html` existiert.

```bash
ls dist/digitale-speisekarte/
# index.html
```

- [ ] **Schritt 3: Preview starten und im Browser prüfen**

```bash
npm run preview
```

Öffne `http://localhost:4321/digitale-speisekarte` und verifiziere:
- [ ] Hero mit korrekter Headline + CTA-Button sichtbar
- [ ] Features-Grid mit 4 Kacheln
- [ ] MenuMockup-Frame sichtbar
- [ ] CTA-Section am Ende
- [ ] Header-Links zeigen auf `/#kontakt` und `/#services`
- [ ] Mobile-Ansicht (Browser-DevTools) — kein horizontales Overflow
- [ ] STRG+C zum Beenden

- [ ] **Schritt 4: Commit**

```bash
git add src/pages/digitale-speisekarte.astro
git commit -m "feat: /digitale-speisekarte Unterseite — Editorial Landing Page"
```

---

## Task 4: Push + Deploy-Workflow prüfen

**Hinweis:** Es gibt aktuell keinen Workflow der die Astro-Seite automatisch deployt (nur `deploy.yml` für `roman/`). Der Push triggert also keinen Build auf Starthost. Das Deploy-Setup muss in einer separaten Session angegangen werden. Für jetzt nur pushen.

- [ ] **Schritt 1: Push**

```bash
git push
```

- [ ] **Schritt 2: Offenen TODO im Memory notieren**

Die URL `/digitale-speisekarte` bleibt 404 auf fuerte.digital bis ein eigener Astro-Deploy-Workflow eingerichtet wird. Das ist ein separates Ticket.

---

## Self-Review Checklist

- [x] Header.astro isSubpage → absolute Links auf Subpages ✓
- [x] Hero: Tag-Pill + Headline + Subtext + CTA ✓
- [x] Features: 4 Kacheln (QR, Fotos, Individuell, 48h) ✓
- [x] MenuMockup: Browser-Frame, 3 Gerichte, Placeholder ✓
- [x] CTA → `/#kontakt` (nicht `#kontakt`) ✓
- [x] data-reveal / data-reveal-group Animationen ✓
- [x] SEO: title + description in Layout-Props ✓
- [x] SiteFooter eingebunden ✓
- [x] Kein Preis, kein Formular (bewusst laut Spec) ✓
