#!/usr/bin/env python3
"""Schreibt die Google-Rezensionen aus data/google-reviews.json in die Startseite.

Laeuft im Workflow "Google-Rezensionen" nach dem Abruf. Ersetzt den Inhalt von
<section id="bewertungen"> (Kopf mit Wertung + Karussell) und traegt die
Gesamtwertung im Footer-Kasten aller Seiten nach.
"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, "data/google-reviews.json"), encoding="utf-8"))
e = html.escape


def sterne(n):
    return "★" * n + "☆" * (5 - n)


karten = []
for r in d["reviews"]:
    link = (f'<a class="review-card__link" href="{e(r["source_url"])}" target="_blank" rel="noopener">Rezension auf Google</a>'
            if r.get("source_url") else "")
    karten.append(f'''        <figure class="review-card">
          <div class="review-card__stars" aria-label="{r["stars"]} von 5 Sternen">{sterne(r["stars"])}</div>
          <blockquote class="review-card__text">„{e(r["text"])}“</blockquote>
          <figcaption class="review-card__author">{e(r["author"])}{link}</figcaption>
        </figure>''')

anzahl = f' · {d["count"]} Rezensionen' if d.get("count") else ""
pfeile = len(karten) > 3
abschnitt = f'''<section id="bewertungen" class="section">
    <div class="container">
      <div class="reviews__header">
        <a href="{e(d["profile_url"])}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;" aria-label="Verifizierte Kundenstimmen auf Google ansehen">
          <div class="reviews__stars">★★★★★</div>
          <div class="reviews__rating">{e(d["rating"])} von 5,0 auf Google{anzahl}</div>
        </a>
      </div>

      <div class="rv-carousel{' rv-carousel--scroll' if pfeile else ''}">
        {'<button type="button" class="rv-nav rv-nav--prev" aria-label="Vorherige Rezensionen">‹</button>' if pfeile else ''}
        <div class="rv-track" tabindex="0" aria-label="Google-Rezensionen">
{chr(10).join(karten)}
        </div>
        {'<button type="button" class="rv-nav rv-nav--next" aria-label="Weitere Rezensionen">›</button>' if pfeile else ''}
      </div>
    </div>
  </section>'''

p = os.path.join(ROOT, "roman/index.html")
s = open(p, encoding="utf-8").read()
s2, n = re.subn(r'<section id="bewertungen".*?</section>', lambda m: abschnitt, s, count=1, flags=re.S)
assert n == 1, "Abschnitt bewertungen nicht gefunden"
if s2 != s:
    open(p, "w", encoding="utf-8").write(s2)

# Gesamtwertung im Footer-Kasten aller Seiten (Deutsch "5,0", Englisch "5.0").
geaendert = 0
for f in glob.glob(os.path.join(ROOT, "roman/**/*.html"), recursive=True):
    t = open(f, encoding="utf-8").read()
    wert = d["rating"].replace(",", ".") if "/en/" in f else d["rating"]
    t2 = re.sub(r'(class="rb-footer__google"[^>]*><strong>)[^<]*(</strong>)', rf"\g<1>{wert}\g<2>", t)
    if t2 != t:
        open(f, "w", encoding="utf-8").write(t2)
        geaendert += 1
print(f"{len(karten)} Karten, Wertung {d['rating']} bei {d.get('count')} Rezensionen, Footer in {geaendert} Dateien angepasst")
