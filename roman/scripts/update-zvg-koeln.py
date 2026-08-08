#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Holt die naechsten Zwangsversteigerungstermine des Amtsgerichts Koeln und
schreibt sie in ratgeber/zwangsversteigerung.html zwischen die Marker.

Quelle: https://www.ag-koeln.nrw.de/behoerde/zvg_termine/index.php
Hausnummern werden bewusst entfernt - auf romanbecker.de werden Objekte nur
mit Strassenname gezeigt. Die vollstaendigen Angaben stehen beim Gericht.
"""
import html as H
import re
import sys
import urllib.request
from datetime import date

QUELLE = "https://www.ag-koeln.nrw.de/behoerde/zvg_termine/index.php"
ZIEL = "roman/ratgeber/zwangsversteigerung.html"
START = "<!-- ZVG-TERMINE:START -->"
ENDE = "<!-- ZVG-TERMINE:ENDE -->"

MONATE = {1: "Januar", 2: "Februar", 3: "März", 4: "April", 5: "Mai", 6: "Juni",
          7: "Juli", 8: "August", 9: "September", 10: "Oktober", 11: "November", 12: "Dezember"}


def hole(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "romanbecker.de Ratgeber-Update"})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read().decode("utf-8", errors="replace")


def strasse_ohne_hausnummer(adresse: str) -> tuple[str, str]:
    """'Kröver Str. 10-20, 50969 Köln, Zollstock' -> ('Kröver Str.', 'Zollstock')"""
    teile = [t.strip() for t in adresse.split(",")]
    strasse = re.sub(r"\s*\d+[\w/\-–]*\s*$", "", teile[0]).strip(" ,")
    stadtteil = teile[-1] if len(teile) > 2 else ""
    stadtteil = re.sub(r"^Köln[- ]?", "", stadtteil).strip()
    return strasse, stadtteil


def parse(seite: str) -> list[dict]:
    t = re.sub(r"(?is)<(script|style).*?</\1>", " ", seite)
    t = H.unescape(re.sub(r"<[^>]+>", "\n", t))
    zeilen = [z.strip() for z in t.split("\n") if z.strip()]
    termine, i = [], 0
    while i < len(zeilen):
        if zeilen[i] != "Objekt:":
            i += 1
            continue
        blk = [z for z in zeilen[i + 1:i + 8] if z != "-->"]
        art = adresse = wert = termin = ""
        for z in blk:
            if z.startswith("Verkehrswert:"):
                wert = z.split(":", 1)[1].strip()
            elif re.match(r"^\d{2}\.\d{2}\.\d{4}", z):
                termin = z
            elif re.search(r"\b\d{5}\b", z):
                adresse = z
            elif not art:
                art = z
        if art and termin:
            strasse, stadtteil = strasse_ohne_hausnummer(adresse)
            termine.append({"art": art, "strasse": strasse, "stadtteil": stadtteil,
                            "wert": wert, "termin": termin})
        i += 1
    return termine


def baue_block(termine: list[dict]) -> str:
    heute = date.today()
    stand = f"{heute.day}. {MONATE[heute.month]} {heute.year}"
    if not termine:
        return (f'{START}\n<p>Aktuell sind keine Termine abrufbar. Die amtliche Übersicht finden Sie '
                f'<a href="{QUELLE}" target="_blank" rel="noopener">beim Amtsgericht Köln</a>.</p>\n{ENDE}')
    zeilen = "\n".join(
        f'    <tr><td>{t["termin"]}</td><td>{H.escape(t["art"])}</td>'
        f'<td>{H.escape(t["strasse"])}{", " + H.escape(t["stadtteil"]) if t["stadtteil"] else ""}</td>'
        f'<td class="num">{H.escape(t["wert"])}</td></tr>'
        for t in termine)
    return f"""{START}
<div class="table-scroll">
<table class="cost-table">
  <thead><tr><th>Termin</th><th>Objekt</th><th>Lage</th><th class="num">Verkehrswert</th></tr></thead>
  <tbody>
{zeilen}
  </tbody>
</table>
</div>
<p class="table-note">Die nächsten {len(termine)} Termine des Amtsgerichts Köln, Stand {stand}. Angabe ohne Hausnummer; verbindlich ist allein die amtliche Bekanntmachung. Vollständige Angaben, Aktenzeichen und Gutachten finden Sie <a href="{QUELLE}" target="_blank" rel="noopener">beim Amtsgericht Köln</a> und im <a href="https://www.zvg-portal.de/" target="_blank" rel="noopener">bundesweiten Justizportal</a>. Ohne Gewähr.</p>
{ENDE}"""


def main() -> int:
    try:
        termine = parse(hole(QUELLE))
    except Exception as e:                                   # Quelle nicht erreichbar
        print(f"Abruf fehlgeschlagen: {e}", file=sys.stderr)
        return 1
    if not termine:
        print("Keine Termine gefunden - Seitenstruktur geaendert? Datei bleibt unveraendert.", file=sys.stderr)
        return 1
    s = open(ZIEL, encoding="utf-8").read()
    if START not in s or ENDE not in s:
        print(f"Marker fehlen in {ZIEL}", file=sys.stderr)
        return 1
    neu = re.sub(re.escape(START) + r".*?" + re.escape(ENDE), lambda _: baue_block(termine), s, flags=re.S)
    if neu == s:
        print("Keine Aenderung.")
        return 0
    open(ZIEL, "w", encoding="utf-8").write(neu)
    print(f"{len(termine)} Termine uebernommen.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
