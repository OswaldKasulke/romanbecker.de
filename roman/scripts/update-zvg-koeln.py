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


def portal_links(seite: str) -> list[str]:
    """Detail-URLs im ZVG-Portal in Dokumentreihenfolge.

    Bewusst als Liste, nicht als Zuordnung ueber die Objektart: Mehrere
    Verfahren koennen dieselbe Objektart tragen (etwa zwei Kellerraeume im
    selben Haus). Ueber den Text gepaart bekaeme eines davon den falschen Link.
    """
    return [H.unescape(m.group(1))
            for m in re.finditer(r'<a[^>]+href="([^"]*zvg-portal[^"]*zvg_id=[^"]*)"', seite)]


def link_lebt(url: str) -> bool:
    """Die Detailseiten brauchen die sessionId aus der Amtsgerichtsseite.
    Laeuft sie ab, liefert das Portal 'error' - dann lieber keinen Link."""
    try:
        return "error" not in hole(url)[:400].lower()
    except Exception:
        return False


def parse(seite: str) -> list[dict]:
    links = portal_links(seite)
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
            url = links[len(termine)] if len(termine) < len(links) else ""
            termine.append({"art": art, "strasse": strasse, "stadtteil": stadtteil,
                            "wert": wert, "termin": termin, "url": url})
        i += 1
    return termine


def baue_block(termine: list[dict]) -> str:
    heute = date.today()
    stand = f"{heute.day}. {MONATE[heute.month]} {heute.year}"
    if not termine:
        return (f'{START}\n<p>Aktuell sind keine Termine abrufbar. Die amtliche Übersicht finden Sie '
                f'<a href="{QUELLE}" target="_blank" rel="noopener">beim Amtsgericht Köln</a>.</p>\n{ENDE}')
    # Eine Stichprobe entscheidet, ob die Detail-Links gesetzt werden
    probe = next((t["url"] for t in termine if t["url"]), "")
    mit_links = bool(probe) and link_lebt(probe)

    def objekt(t):
        name = H.escape(t["art"])
        if mit_links and t["url"]:
            return (f'<a href="{H.escape(t["url"], quote=True)}" target="_blank" '
                    f'rel="noopener">{name}</a>')
        return name

    zeilen = "\n".join(
        f'    <tr><td>{t["termin"]}</td><td>{objekt(t)}</td>'
        f'<td>{H.escape(t["strasse"])}{", " + H.escape(t["stadtteil"]) if t["stadtteil"] else ""}</td>'
        f'<td class="num">{H.escape(t["wert"])}</td></tr>'
        for t in termine)
    hinweis = ("Die Objektart führt direkt zum Verfahren im Justizportal. " if mit_links else "")
    return f"""{START}
<div class="table-scroll">
<table class="cost-table">
  <thead><tr><th>Termin</th><th>Objekt</th><th>Lage</th><th class="num">Verkehrswert</th></tr></thead>
  <tbody>
{zeilen}
  </tbody>
</table>
</div>
<p class="table-note">Die nächsten {len(termine)} Termine des Amtsgerichts Köln, Stand {stand}. {hinweis} Angabe ohne Hausnummer; verbindlich ist allein die amtliche Bekanntmachung. Vollständige Angaben, Aktenzeichen und Gutachten finden Sie <a href="{QUELLE}" target="_blank" rel="noopener">beim Amtsgericht Köln</a> und im <a href="https://www.zvg-portal.de/" target="_blank" rel="noopener">bundesweiten Justizportal</a>. Ohne Gewähr.</p>
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
