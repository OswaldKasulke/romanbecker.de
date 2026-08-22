#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Liest die Stadtteilpreise aus dem Grundstuecksmarktbericht der Stadt Koeln
(Gutachterausschuss fuer Grundstueckswerte) und schreibt data/veedel-preise.json.

Quelle : GMB2026_Digitalversion.pdf, Berichtszeitraum 2025
         Kapitel 5.1.2 (Ein-/Zweifamilienhaeuser, Weiterverkauf, je Stadtteil und Anbauweise)
         Kapitel 6.1.1 (Eigentumswohnungen, je Stadtteil, Verkaufsfall und Baujahresklasse)
Aufruf : python3 scripts/gmb-preise.py <pfad-zum-gmb.pdf>
         (braucht pdftotext aus poppler)

Ausgewertet wird jeweils der fett gedruckte arithmetische Mittelwert der Spalte
"Euro je m2 Wohnflaeche". Stadtteile mit weniger als drei auswertbaren
Kaufvertraegen stehen nicht im Bericht und fehlen deshalb auch hier.
"""
import json, os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / 'Downloads' / 'GMB2026_Digitalversion.pdf'
ZIEL = ROOT / 'data' / 'veedel-preise.json'
MASTER = ROOT / 'data' / 'strassen-master.json'

if not PDF.exists():
    sys.exit(f'PDF nicht gefunden: {PDF}')

txt = subprocess.run(['pdftotext', '-layout', str(PDF), '-'],
                     capture_output=True, text=True, check=True).stdout.split('\n')

# Zeilenumbruch mitten im Stadtteilnamen ("Bocklemuend/" + "Mengenich") zusammenziehen
zeilen = []
for ln in txt:
    if zeilen and zeilen[-1].strip().endswith('/') and not any(c.isdigit() for c in zeilen[-1]) \
       and ln.strip() and not any(c.isdigit() for c in ln) and '▮' not in ln:
        zeilen[-1] = zeilen[-1].rstrip() + ln.strip()
    else:
        zeilen.append(ln)

def grenze(muster, ab=0):
    for i in range(ab, len(zeilen)):
        if re.match(muster, zeilen[i]):
            return i
    sys.exit('Kapitelgrenze nicht gefunden: ' + muster)

SKIP = ('Preistabelle', 'Zum Inhalt', 'Der Gutachterausschuss', 'Eine Karten', 'Stadtteil',
        'Angaben in der', 'Kaufpreis', 'in Euro', 'in m²', 'Grundstücks-', 'Wohnfläche',
        'Euro je', 'Baujahr', 'Anzahl', 'Übersicht Stadtbezirk', 'Kennzahlen zur',
        'Informationen zur', 'Grundlage der', 'Die Vertragskaufpreise', 'sowie mitverkauftes',
        'die Kaufpreise', 'maßgeblich von', 'zung der', 'transparenz', 'In den folgenden',
        'bellen zusätzlich', 'Wertebereich', 'werden nicht', 'im Berichtszeitraum',
        'rend in der', 'ausgewiesenen', 'Reihenendhaus', 'Erstverkauf')

def tabelle(start, ende, spalten):
    """{Stadtteil: [{art, n, qm}]}

    Jede Anbauweise bzw. jeder Verkaufsfall steht als Zeile "▮ Bezeichnung  Anzahl"
    im Text; die fett gedruckte Mittelwertzeile liegt je nach Umbruch direkt davor
    oder direkt dahinter. Sie wird ueber diese Nachbarschaft zugeordnet, nicht ueber
    die Reihenfolge — sonst verrutscht die Zuordnung bei Stadtteilen, in denen fuer
    einen Verkaufsfall die Wohnflaeche fehlt und der Bericht "/" ausweist
    (z. B. Weidenpesch, Umwandlung).

    `spalten` ist die Zahl der Wertespalten der Tabelle; nur eine vollstaendige
    Zeile enthaelt den Preis je m2 Wohnflaeche in der letzten Spalte.
    """
    def zahlenzeile(i):
        s = zeilen[i].strip()
        if not s or ' - ' in s or s.startswith('▮'):
            return None
        teile = s.split()
        if len(teile) == spalten and all(re.fullmatch(r'[\d.]+', t) for t in teile):
            return float(teile[-1].replace('.', ''))
        return None

    res, st = {}, None
    for i in range(start, ende):
        s = zeilen[i].strip()
        if not s or s.startswith(SKIP):
            continue
        m = re.match(r'^▮\s*(.+?)\s{2,}(\d+)\s*$', s)
        if m and st:
            qm = zahlenzeile(i - 1)
            if qm is None:
                qm = zahlenzeile(i + 1)
            if qm is not None:
                res.setdefault(st, []).append(
                    {'art': m.group(1).strip().rstrip('/').strip(), 'n': int(m.group(2)), 'qm': qm})
            continue
        if s.startswith('-') or ' - ' in s or any(c.isdigit() for c in s):
            continue
        if re.match(r'^[A-ZÄÖÜ][\wÄÖÜäöüß/\.\- ]*$', s):
            st = s
    return res


# Haeuser: Kaufpreis, Grundstuecksflaeche, Baujahr, Wohnflaeche, Euro/m2
haeuser = tabelle(grenze(r'^5\.1\.2\s'), grenze(r'^5\.1\.3\s'), 5)
# Wohnungen: Kaufpreis, Baujahr, Wohnflaeche, Euro/m2
wohnungen = tabelle(grenze(r'^6\.1\.1\s{2,}Kaufpreisspannen'), grenze(r'^6\.1\.2\s'), 4)

def gewichtet(eintraege, arten):
    treffer = [e for e in eintraege if e['art'] in arten and e['n'] > 0]
    n = sum(e['n'] for e in treffer)
    if not n:
        return None, 0
    return round(sum(e['qm'] * e['n'] for e in treffer) / n), n

master = json.loads(MASTER.read_text(encoding='utf-8'))
veedel_zu_stadtteil = {}
for r in master:
    veedel_zu_stadtteil[r['v']] = r['t']

ARTEN_HAUS = ('freistehend', 'Doppelhaushälfte', 'Reihenmittelhaus')
daten, fehlt_etw, fehlt_haus = {}, [], []
for veedel in sorted(veedel_zu_stadtteil, key=lambda s: s.lower()):
    st = veedel_zu_stadtteil[veedel]
    etw, etw_n = gewichtet(wohnungen.get(st, []), ('Weiterverkauf',))
    if etw is None:      # kein Weiterverkauf ausgewiesen -> Umwandlung/Neubau heranziehen
        etw, etw_n = gewichtet(wohnungen.get(st, []), ('Umwandlung', 'Neubau'))
    haus, haus_n = gewichtet(haeuser.get(st, []), ARTEN_HAUS)
    if etw is None:
        fehlt_etw.append(veedel)
    if haus is None:
        fehlt_haus.append(veedel)
    eintrag = {'t': st}
    if etw:
        eintrag['etw'] = etw
        eintrag['etwN'] = etw_n
    if haus:
        eintrag['haus'] = haus
        eintrag['hausN'] = haus_n
    daten[veedel] = eintrag

aus = {
    '_quelle': 'Gutachterausschuss für Grundstückswerte in der Stadt Köln, '
               'Grundstücksmarktbericht 2026, Berichtszeitraum 2025',
    '_kapitel': {'etw': '6.1.1 Eigentumswohnungen, Verkaufsfall Weiterverkauf, arithmetischer Mittelwert Euro je m² Wohnfläche',
                 'haus': '5.1.2 Ein- und Zweifamilienhäuser, Weiterverkauf, über die Anbauweisen mit der Fallzahl gewichtet'},
    '_erzeugt_von': 'scripts/gmb-preise.py',
    '_hinweis': 'Stadtteile mit weniger als drei auswertbaren Kaufverträgen weist der Bericht nicht aus; '
                'für sie fehlt hier der Wert und die Bewertung fällt auf die PLZ-Tabelle zurück.',
    'veedel': daten,
}
ZIEL.write_text(json.dumps(aus, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')

print(f'{ZIEL.relative_to(ROOT)} geschrieben')
print(f'  Veedel gesamt      : {len(daten)}')
print(f'  mit ETW-Wert       : {len(daten) - len(fehlt_etw)}')
print(f'  mit Hauswert       : {len(daten) - len(fehlt_haus)}')
print(f'  ohne ETW-Wert      : {", ".join(fehlt_etw) or "—"}')
print(f'  ohne Hauswert      : {", ".join(fehlt_haus) or "—"}')
