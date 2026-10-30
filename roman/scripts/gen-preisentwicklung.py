#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Baut für eine Veedelseite den Abschnitt „Wohnungspreise 2015 bis 2024“:
Liniendiagramm (statisches SVG, ohne JavaScript), Zahlentabelle und Quellen.

Daten : ../data/veedelseiten-wohnungspreise-2015-2024.csv (Repo-Wurzel, nicht deployt).
        Abgeschrieben aus der Stadtteiltabelle „Kaufpreise für Eigentumswohnungen“
        der Grundstücksmarktberichte Köln 2016–2025 (Baujahre insgesamt, Neubau,
        Weiterverkauf und Umwandlung, 60–100 m² Wohnfläche).
Aufruf: python3 scripts/gen-preisentwicklung.py suelz.html  → gibt den Abschnitt aus
Nur Seiten mit Einstufung A oder B (alle zehn Jahre vorhanden) bekommen einen Abschnitt.
"""
import csv, html, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV = ROOT.parent / 'data' / 'veedelseiten-wohnungspreise-2015-2024.csv'
JAHRE = list(range(2015, 2025))
# Bericht (Jahrgang) → gedruckte Seite der Stadtteiltabelle und amtliches PDF
QUELLEN = {
    2016: (50, 'https://epflicht.ulb.uni-bonn.de/download/pdf/279049'),
    2017: (48, 'https://epflicht.ulb.uni-bonn.de/download/pdf/337625'),
    2018: (80, 'https://epflicht.ulb.uni-bonn.de/download/pdf/407248'),
    2019: (79, 'https://epflicht.ulb.uni-bonn.de/download/pdf/510935'),
    2020: (76, 'https://www.gars.nrw/images/user/GA_K%C3%B6ln/GMB_114_2020_pflichtig.pdf'),
    2021: (77, 'https://www.gars.nrw/images/user/GA_K%C3%B6ln/GMB_114_2021_pflichtig.pdf'),
    2022: (81, 'https://www.gars.nrw/images/user/GA_K%C3%B6ln/GMB_114_2022_pflichtig.pdf'),
    2023: (81, 'https://www.gars.nrw/images/user/GA_K%C3%B6ln/GMB_114_2023_pflichtig.pdf'),
    2024: (84, 'https://www.gars.nrw/images/user/GA_K%C3%B6ln/Grundst%C3%BCcksmarktbericht_2024.pdf'),
    2025: (86, 'https://www.gars.nrw/images/user/GA_K%C3%B6ln/GMB_114_2025_pflichtig.pdf'),
}


def de(n):
    return f'{n:,}'.replace(',', '.')


def diagramm(werte, name):
    W, H = 560, 290
    l, r, t, b = 66, 18, 26, 36
    hoch = max(werte.values())
    oben = ((hoch // 1000) + 1) * 1000
    x = lambda j: l + (j - JAHRE[0]) / (JAHRE[-1] - JAHRE[0]) * (W - l - r)
    y = lambda v: t + (1 - v / oben) * (H - t - b)
    teile = [f'<svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="Mittlerer Kaufpreis für Eigentumswohnungen in {html.escape(name)} von 2015 bis 2024 in Euro je Quadratmeter" style="display:block;max-width:620px;height:auto;">']
    for v in range(0, oben + 1, 1000):
        teile.append(f'<line x1="{l}" x2="{W - r}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="var(--gray-200)" stroke-width="1"/>')
        teile.append(f'<text x="{l - 8}" y="{y(v) + 4:.1f}" text-anchor="end" font-size="15" fill="var(--gray-600)">{de(v)} €</text>')
    for j in JAHRE:
        teile.append(f'<text x="{x(j):.1f}" y="{H - 12}" text-anchor="middle" font-size="14" fill="var(--gray-600)">{str(j)[2:] if W < 600 and j not in (JAHRE[0], JAHRE[-1]) else j}</text>')
    punkte = ' '.join(f'{x(j):.1f},{y(werte[j]):.1f}' for j in JAHRE)
    teile.append(f'<polyline points="{punkte}" fill="none" stroke="var(--navy)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>')
    for j in JAHRE:
        teile.append(f'<circle cx="{x(j):.1f}" cy="{y(werte[j]):.1f}" r="4" fill="var(--navy)"><title>{j}: {de(werte[j])} €/m²</title></circle>')
    # Endwerte beschriften; liegt der Nachbarpunkt höher, steht die Zahl unter dem Punkt, damit die Linie sie nicht kreuzt
    for j, nachbar, anker in ((JAHRE[0], JAHRE[1], 'start'), (JAHRE[-1], JAHRE[-2], 'end')):
        unten = werte[nachbar] > werte[j]
        teile.append(f'<text x="{x(j):.1f}" y="{y(werte[j]) + (22 if unten else -11):.1f}" text-anchor="{anker}" font-size="16" font-weight="600" fill="var(--navy)">{de(werte[j])} €</text>')
    teile.append('</svg>')
    return ''.join(teile)


def abschnitt(z):
    name = z['seitenname']
    stadtteil = z['amtlicher_stadtteil']
    werte = {j: int(z[f'mittel_{j}']) for j in JAHRE}
    anzahl = {j: int(z[f'n_{j}']) for j in JAHRE}
    diff = round((werte[2024] / werte[2015] - 1) * 100)
    bezug = '' if z['eigener_stadtteil'] == 'ja' else f' Der Gutachterausschuss weist {html.escape(name)} nicht gesondert aus; die Werte gelten für den amtlichen Stadtteil {html.escape(stadtteil)}.'
    wenige = ''
    if z['einstufung'].startswith('B'):
        wenige = ' In einzelnen Jahren lagen weniger als zehn auswertbare Verträge vor; dort kann schon ein einzelner Neubau- oder Luxusverkauf den Mittelwert stark verschieben.'
    zeilen = ''.join(f'<tr><td>{j}</td><td class="num">{de(werte[j])} €</td><td class="num">{anzahl[j]}</td></tr>' for j in JAHRE)
    quellen = ', '.join(f'<a href="{u}" target="_blank" rel="noopener" style="color:inherit;">{b}</a> (S.&nbsp;{s})' for b, (s, u) in QUELLEN.items())
    return f'''  <!-- PREISENTWICKLUNG (scripts/gen-preisentwicklung.py) -->
  <section class="section" id="preisentwicklung">
    <div class="container">
      <span class="section-label">Preisentwicklung</span>
      <h2>Wohnungspreise in {html.escape(name)} von 2015 bis 2024</h2>
      <p class="text-muted max-w-prose" style="margin-bottom:var(--space-6);">Mittlerer Kaufpreis für Eigentumswohnungen mit 60 bis 100&nbsp;m² Wohnfläche laut Gutachterausschuss Köln: {de(werte[2015])}&nbsp;€/m² im Jahr 2015, {de(werte[2024])}&nbsp;€/m² im Jahr 2024. Das sind {diff:+d}&nbsp;%.{bezug}</p>
      <figure style="margin:0 0 var(--space-6);">
        {diagramm(werte, name)}
      </figure>
      <table class="cost-table" style="max-width:820px;">
        <thead><tr><th>Kaufjahr</th><th class="num">Ø Kaufpreis je m²</th><th class="num">Verträge</th></tr></thead>
        <tbody>{zeilen}</tbody>
      </table>
      <p class="text-muted" style="font-size:0.8125rem;max-width:820px;">Durchschnitt der im jeweiligen Jahr verkauften Wohnungen mit 60 bis 100&nbsp;m², Neubau, Weiterverkauf und Umwandlung zusammen; nur auswertbare Kaufverträge, nicht alle Verkäufe im Stadtteil. Es ist kein Preisindex: Die Werte hängen auch davon ab, welche Wohnungen in einem Jahr verkauft wurden.{wenige} Quelle: Gutachterausschuss für Grundstückswerte in der Stadt Köln, Grundstücksmarktberichte {quellen}.</p>
    </div>
  </section>
'''


def main():
    seiten = {Path(r['seite']).name: r for r in csv.DictReader(open(CSV, encoding='utf-8')) if '/stadtteile/' in r['seite']}
    for s in sys.argv[1:]:
        z = seiten.get(s)
        if not z or z['einstufung'][0] not in 'AB':
            sys.exit(f'{s}: keine vollständige Zehnjahresreihe')
        sys.stdout.write(abschnitt(z))


if __name__ == '__main__':
    main()
