#!/usr/bin/env python3
"""Bauzinsen-Tabelle auf ratgeber/bauzinsen.html aktualisieren.

Liest die effektiven Jahreszinsen für 10 und 15 Jahre Zinsbindung bei 60, 80 und
90 % Beleihungsauslauf aus drei öffentlichen Quellen, bildet je Zelle den
Mittelwert der Quellen, die für diese Zelle einen Wert veröffentlichen, und schreibt den Block zwischen <!-- BAUZINSEN-START --> und
<!-- BAUZINSEN-END --> neu.

Quellen:
  ING        – offizielle Konditionsliste (PDF), Darlehen ab 300.000 EUR
  Sparda-Bank Hamburg – Tageskonditionen (nur bis 60 % Beleihung, ab 150.000 EUR)
  Interhyp   – Zinstabelle (Spalten „unter 70 %“, „bei 80 %“, „über 90 %“)

Bricht mit Fehler ab, wenn eine Quelle nicht lesbar ist – dann bleibt die Seite
unverändert.
"""
import datetime as dt
import html
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "ratgeber" / "bauzinsen.html"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/130 Safari/537.36"

URL_ING = "https://www.ing.de/dokumente/partner/baufi-konditionen-online/"
URL_SPARDA = "https://www.sparda-bank-hamburg.de/kredit-und-baufinanzierung/immobilien-finanzierung/baufinanzierung.html"
URL_IH = "https://www.interhyp.de/bauzinsen/"

YEARS = (10, 15)
LTVS = (60, 80, 90)


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def text_of(raw: bytes) -> str:
    t = raw.decode("utf-8", "ignore")
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", t, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    return " ".join(t.split())


def num(s: str) -> float:
    return float(s.replace(",", "."))


def de_date(s: str) -> dt.date:
    d, m, y = s.split(".")
    return dt.date(int(y), int(m), int(d))


def ing():
    with tempfile.TemporaryDirectory() as tmp:
        pdf = Path(tmp) / "ing.pdf"
        pdf.write_bytes(get(URL_ING))
        txt = subprocess.run(["pdftotext", "-layout", str(pdf), "-"],
                             capture_output=True, text=True, check=True).stdout
    m = re.search(r"Gültig ab (\d\d\.\d\d\.\d{4}) / Nr\. (\d+)", txt)
    if not m:
        raise ValueError("ING: Gültigkeitsdatum nicht gefunden")
    stand, nr = de_date(m.group(1)), m.group(2)
    year, tier, vals = None, None, {}
    for line in txt.splitlines():
        ym = re.match(r"\s*(\d{1,2})\s+ab ", line)
        if ym:
            year = int(ym.group(1))
        tm = re.search(r"ab ([\d.]+) EUR", line)
        if tm:
            tier = tm.group(1)
        if "effektiv" in line and tier == "300.000" and year in YEARS:
            cols = [num(x) for x in re.findall(r"(\d,\d\d)%", line)]
            if len(cols) != 6:
                raise ValueError(f"ING: unerwartete Spalten in {line!r}")
            # Spalten: bis 60, 70, 80, 85, 90, 95 %
            vals[year] = {60: cols[0], 80: cols[2], 90: cols[4]}
    if set(vals) != set(YEARS):
        raise ValueError(f"ING: Werte unvollständig {vals}")
    return {"name": "ING", "stand": stand, "detail": f"Konditionsliste Nr. {nr}, gültig ab {stand:%d.%m.%Y}, Darlehen ab 300.000 €",
            "url": URL_ING, "vals": vals}


def sparda():
    t = text_of(get(URL_SPARDA))
    i = t.find("Tageskonditionen bis 60 % Verkehrswert")
    if i < 0:
        raise ValueError("Sparda: Konditionstabelle nicht gefunden")
    seg = t[i:i + 900]
    vals = {}
    for y in YEARS:
        m = re.search(rf"{y} Jahre ab 50\.000 Euro (\d,\d\d) % (\d,\d\d) % ab 150\.000 Euro (\d,\d\d) % (\d,\d\d) %", seg)
        if not m:
            raise ValueError(f"Sparda: {y} Jahre nicht gefunden")
        vals[y] = {60: num(m.group(4))}
    m = re.search(r"Stand: (\d\d\.\d\d\.\d{4})", seg)
    if not m:
        raise ValueError("Sparda: Stand nicht gefunden")
    stand = de_date(m.group(1))
    return {"name": "Sparda-Bank Hamburg", "stand": stand,
            "detail": f"Tageskonditionen, Stand {stand:%d.%m.%Y}, bis 60 % Verkehrswert, ab 150.000 € (für 80 % und 90 % veröffentlicht die Bank keine Werte)",
            "url": URL_SPARDA, "vals": vals}


def interhyp():
    t = text_of(get(URL_IH))
    i = t.find("Zinstabelle: Effektiver Jahreszins")
    if i < 0:
        raise ValueError("Interhyp: Zinstabelle nicht gefunden")
    seg = t[i:i + 1500]
    vals = {}
    for y in YEARS:
        m = re.search(rf"{y} Jahre (\d,\d\d) % (\d,\d\d) % (\d,\d\d) %", seg)
        if not m:
            raise ValueError(f"Interhyp: {y} Jahre nicht gefunden")
        vals[y] = {60: num(m.group(1)), 80: num(m.group(2)), 90: num(m.group(3))}
    m = re.search(r"Konditionsangeboten der Interhyp AG vom (\d\d\.\d\d\.\d{4}) bis (\d\d\.\d\d\.\d{4})", seg)
    if not m:
        raise ValueError("Interhyp: Zeitraum nicht gefunden")
    stand = de_date(m.group(2))
    return {"name": "Interhyp", "stand": stand,
            "detail": f"Konditionen vom {m.group(1)} bis {m.group(2)}; Spalten „unter 70 %“ und „über 90 %“ als 60 % bzw. 90 % geführt",
            "url": URL_IH, "vals": vals}


def pct(x: float) -> str:
    from decimal import Decimal, ROUND_HALF_UP
    d = Decimal(repr(round(x, 6))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return f"{d}".replace(".", ",") + " %"


def build(sources, today):
    def mittel(y, l):
        w = [s["vals"][y][l] for s in sources if l in s["vals"][y]]
        return sum(w) / len(w)
    avg = {y: {l: mittel(y, l) for l in LTVS} for y in YEARS}
    anz = {l: sum(1 for s in sources if l in s["vals"][YEARS[0]]) for l in LTVS}
    rows = "\n".join(
        f'              <tr><td>{y} Jahre</td>' + "".join(f"<td><strong>{pct(avg[y][l])}</strong></td>" for l in LTVS) + "</tr>"
        for y in YEARS)
    src_rows = []
    for s in sources:
        for y in YEARS:
            src_rows.append(f'              <tr><td>{s["name"]}</td><td>{y} Jahre</td>' +
                            "".join(f"<td>{pct(s['vals'][y][l]) if l in s['vals'][y] else '–'}</td>" for l in LTVS) + "</tr>")
    old = [s for s in sources if (today - s["stand"]).days > 30]
    note_old = ""
    if old:
        names = ", ".join(f'{s["name"]} (Stand {s["stand"]:%d.%m.%Y})' for s in old)
        note_old = f'\n          <p class="zins-hinweis-alt">Hinweis: Die Angaben von {names} sind älter als 30 Tage; der Anbieter hat seine Tabelle seitdem nicht aktualisiert.</p>'
    # Kölner Rechenbeispiel: Mittelwert ETW (alle Teilmärkte, Kap. 6.1.3) laut
    # Grundstücksmarktbericht 2026 der Stadt Köln (Berichtszeitraum 2025)
    qm_preis, qm = 4709, 80
    kaufpreis = qm_preis * qm
    darlehen = round(kaufpreis * 0.8)
    z = float(pct(avg[10][80]).replace(" %", "").replace(",", "."))  # mit dem angezeigten, gerundeten Wert rechnen
    rate = darlehen * (z / 100 + 0.02) / 12
    eur = lambda x: f"{x:,.0f}".replace(",", ".") + " €"
    koeln = f"""
        <h2>Was die Bauzinsen für eine Wohnung in Köln bedeuten</h2>
        <p>Einen eigenen Kölner Bauzins gibt es nicht: Banken kalkulieren nach Zinsbindung, Beleihungsauslauf und Bonität, nicht nach Stadt. Was die Zinsen in Köln bedeuten, zeigt sich deshalb am Kaufpreis.</p>
        <p>Der Grundstücksmarktbericht 2026 der Stadt Köln nennt für Eigentumswohnungen einen stadtweiten Mittelwert von {eur(qm_preis)} je Quadratmeter Wohnfläche über alle Kauffälle aus Weiterverkauf, Neubau und Umwandlung (Kapitel 6.1.3, Berichtszeitraum 2025). Eine {qm}-m²-Wohnung kostet damit rund {eur(kaufpreis)}. Bei 80 % Finanzierung ({eur(darlehen)}), dem aktuellen Mittelwert von {pct(z)} für 10 Jahre und 2 % anfänglicher Tilgung liegt die Monatsrate bei rund <strong>{eur(rate)}</strong>. Kaufnebenkosten sind darin nicht enthalten; die Rechnung verwendet den effektiven Jahreszins als Näherung.</p>
        <p class="zins-source">Quelle Kaufpreis: <a href="https://www.gars.nrw/images/user/GA_K%C3%B6ln/GMB2026_Digitalversion.pdf" target="_blank" rel="noopener">Gutachterausschuss Köln, Grundstücksmarktbericht 2026, Kap. 6.1.3</a></p>"""
    quellen = "\n".join(
        f'            <li><strong>{s["name"]}</strong> – {s["detail"]} – <a href="{s["url"]}" target="_blank" rel="noopener">{s["url"]}</a></li>'
        for s in sources)
    return f"""<!-- BAUZINSEN-START -->
        <h2>Bauzinsen aktuell: Mittelwert aus ING, Sparda-Bank Hamburg und Interhyp</h2>
        <p>Die Tabelle zeigt den <strong>Mittelwert der effektiven Jahreszinsen</strong> aus öffentlich einsehbaren Zinstabellen – der ING, der Sparda-Bank Hamburg und des Vermittlers Interhyp – für 10 und 15 Jahre Zinsbindung bei 60, 80 und 90 % Beleihungsauslauf. Die Sparda-Bank veröffentlicht nur Werte bis 60 % Beleihung; die Spalten 80 % und 90 % sind deshalb der Mittelwert aus {anz[80]} Quellen, die Spalte 60 % aus {anz[60]}. Aktualisiert am {today:%d.%m.%Y}.</p>

        <div class="zins-tabelle-wrap">
          <table class="zins-tabelle">
            <caption>Effektiver Jahreszins p. a., Mittelwert je Spalte (Anzahl Quellen im Spaltenkopf)</caption>
            <thead><tr><th>Zinsbindung</th><th>60 % Beleihung ({anz[60]})</th><th>80 % Beleihung ({anz[80]})</th><th>90 % Beleihung ({anz[90]})</th></tr></thead>
            <tbody>
{rows}
            </tbody>
          </table>
        </div>

        <details class="zins-einzelwerte">
          <summary>Einzelwerte je Quelle anzeigen</summary>
          <div class="zins-tabelle-wrap">
          <table class="zins-tabelle">
            <thead><tr><th>Quelle</th><th>Zinsbindung</th><th>60 %</th><th>80 %</th><th>90 %</th></tr></thead>
            <tbody>
{chr(10).join(src_rows)}
            </tbody>
          </table>
          </div>
        </details>{note_old}

        <div class="zins-quellen">
          <p><strong>Quellen</strong> (effektiver Jahreszins, jeweils wie vom Anbieter veröffentlicht):</p>
          <ol>
{quellen}
          </ol>
        </div>{koeln}
<!-- BAUZINSEN-END -->""", avg


def main():
    today = dt.date.today()
    sources = [ing(), sparda(), interhyp()]
    page = PAGE.read_text(encoding="utf-8")
    new_block, avg = build(sources, today)
    if "<!-- BAUZINSEN-START -->" not in page:
        sys.exit("Marker <!-- BAUZINSEN-START --> fehlt in bauzinsen.html")
    out = re.sub(r"<!-- BAUZINSEN-START -->.*?<!-- BAUZINSEN-END -->", lambda m: new_block, page, flags=re.S)
    desc = (f"Bauzinsen Köln aktuell (Stand {today:%d.%m.%Y}): 10 Jahre ab {pct(avg[10][60])}, "
            f"15 Jahre ab {pct(avg[15][60])} effektiv – Mittelwert aus ING, Sparda-Bank Hamburg und Interhyp, mit Kölner Rechenbeispiel.")
    out = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + desc + m.group(2), out, count=1)
    out = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + desc + m.group(2), out, count=1)
    out = re.sub(r'("description": ")[^"]*(",\n    "url": "https://romanbecker.de/ratgeber/bauzinsen.html")',
                 lambda m: m.group(1) + desc + m.group(2), out, count=1)
    out = re.sub(r'"dateModified": "\d{4}-\d\d-\d\d"', f'"dateModified": "{today:%Y-%m-%d}"', out, count=1)
    if out != page:
        PAGE.write_text(out, encoding="utf-8")
        print("bauzinsen.html aktualisiert")
    else:
        print("keine Änderung")
    for s in sources:
        print(s["name"], s["stand"], s["vals"])


if __name__ == "__main__":
    main()
