#!/usr/bin/env python3
"""Holt alle Fremdinhalte von romanbecker.de auf den eigenen Server.

Warum: Ein <img> von images.ctfassets.net (Bildserver von Evernest/Contentful)
oder ein OpenStreetMap-iframe überträgt beim Seitenaufruf die IP-Adresse jedes
Besuchers an Dritte. Liegen Foto und Karte bei uns, sind sie sofort sichtbar,
ohne Einwilligung und ohne Verbindung zu Dritten. Gleiches Vorgehen wie
makler-schael-sick.de (src/fetch_karten.py, src/fetch_listings.py).

  - <img src="https://images.ctfassets.net/…">  -> /img/objekte/<hash>.webp
  - <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=…&marker=…">
      -> statisches Kartenbild /img/karten/<hash>.webp, verlinkt auf openstreetmap.org
  - <link rel="preconnect" href="https://images.ctfassets.net"> entfernen
  - <script src="/consent.js" defer> vor </body> einfügen (Banner + Widerruf)

Idempotent: vorhandene Dateien werden nicht neu geladen. Läuft im
Listings-Workflow nach den Generatoren und im Deploy vor dem Upload.

  python3 roman/scripts/fremdinhalte_lokal.py          # schreibt
  python3 roman/scripts/fremdinhalte_lokal.py --check  # nur prüfen, Exit 1 bei Funden
"""
import hashlib, html, math, os, re, sys, time, urllib.error, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OBJ_DIR = os.path.join(ROOT, "img", "objekte")
KARTEN_DIR = os.path.join(ROOT, "img", "karten")
CACHE = os.path.join(ROOT, "scripts", ".osm-cache")
UA = "romanbecker.de/1.0 (statische Karten und Objektfotos; rb@datenschwester.de)"
TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
BREITE, HOEHE = 960, 540          # .map-container hat 16:9
SKIP = {"node_modules", "vendor", ".git", ".osm-cache"}
CHECK = "--check" in sys.argv
CONSENT_TAG = '<script src="/consent.js" defer></script>'


def h16(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:16]


def laden(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


# ---------- Objektfotos ----------
def foto_lokal(url):
    url = html.unescape(url)
    name = h16(url) + ".webp"
    ziel = os.path.join(OBJ_DIR, name)
    if not os.path.isfile(ziel):
        if CHECK:
            return None
        quelle = url
        if "?" not in quelle:          # Original ohne Größenangabe: als WebP, max. 1600 px
            quelle += "?w=1600&fm=webp&q=78"
        elif "fm=" not in quelle:
            quelle += "&fm=webp"
        try:
            daten = laden(quelle)
        except urllib.error.HTTPError as e:
            if e.code in (403, 404, 410):   # bei Evernest gelöscht: nie den toten Fremdlink stehen lassen
                print(f"  Foto nicht mehr vorhanden ({e.code}): {url}")
                return "/img/objekte/_kein-foto.svg"
            raise
        if len(daten) < 200:
            raise RuntimeError(f"Bild leer: {quelle}")
        os.makedirs(OBJ_DIR, exist_ok=True)
        open(ziel, "wb").write(daten)
        time.sleep(0.1)
    return f"/img/objekte/{name}"


# ---------- Karten ----------
def xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180.0) / 360.0 * n
    y = (1.0 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2.0 * n
    return x, y


def kachel(z, x, y):
    p = os.path.join(CACHE, f"{z}_{x}_{y}.png")
    if not os.path.isfile(p):
        os.makedirs(CACHE, exist_ok=True)
        open(p, "wb").write(laden(TILE.format(z=z, x=x, y=y)))
        time.sleep(0.15)               # freundlich zum Kachelserver
    return p


def karte_lokal(embed_url):
    """Erzeugt das Kartenbild zum iframe-Ausschnitt; gibt (Bildpfad, OSM-Link) zurück."""
    q = urllib.parse.parse_qs(urllib.parse.urlparse(html.unescape(embed_url)).query)
    lo1, la1, lo2, la2 = (float(v) for v in q["bbox"][0].split(","))
    mlat, mlon = (float(v) for v in q["marker"][0].split(",")) if "marker" in q else ((la1 + la2) / 2, (lo1 + lo2) / 2)
    name = h16(embed_url) + ".webp"
    ziel = os.path.join(KARTEN_DIR, name)
    lat_min, lat_max, lon_min, lon_max = min(la1, la2), max(la1, la2), min(lo1, lo2), max(lo1, lo2)
    # wie der iframe: größter Zoom, bei dem die bbox ins Bild passt
    z = 16
    while z > 9:
        x1, y1 = xy(lat_max, lon_min, z)
        x2, y2 = xy(lat_min, lon_max, z)
        if (x2 - x1) * 256 <= BREITE and (y2 - y1) * 256 <= HOEHE:
            break
        z -= 1
    link = f"https://www.openstreetmap.org/?mlat={mlat}&amp;mlon={mlon}#map={z}/{mlat}/{mlon}"
    if os.path.isfile(ziel) or CHECK:
        return (f"/img/karten/{name}" if os.path.isfile(ziel) else None), link
    from PIL import Image, ImageDraw
    x1, y1 = xy(lat_max, lon_min, z)
    x2, y2 = xy(lat_min, lon_max, z)
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    px_l, px_o = cx * 256 - BREITE / 2, cy * 256 - HOEHE / 2
    tx0, ty0 = int(px_l // 256), int(px_o // 256)
    tx1, ty1 = int((px_l + BREITE) // 256), int((px_o + HOEHE) // 256)
    lw = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256), "#eee")
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            lw.paste(Image.open(kachel(z, tx, ty)).convert("RGB"), ((tx - tx0) * 256, (ty - ty0) * 256))
    ox, oy = int(px_l - tx0 * 256), int(px_o - ty0 * 256)
    bild = lw.crop((ox, oy, ox + BREITE, oy + HOEHE))
    mx, my = xy(mlat, mlon, z)
    px, py = mx * 256 - px_l, my * 256 - px_o
    if 0 <= px <= BREITE and 0 <= py <= HOEHE:     # Marker in den Hausfarben
        d = ImageDraw.Draw(bild, "RGBA")
        d.ellipse((px - 24, py - 24, px + 24, py + 24), fill=(194, 169, 144, 70))
        d.ellipse((px - 10, py - 10, px + 10, py + 10), fill=(194, 169, 144, 255), outline=(6, 49, 36, 255), width=3)
    os.makedirs(KARTEN_DIR, exist_ok=True)
    bild.save(ziel, "WEBP", quality=82, method=6)
    return f"/img/karten/{name}", link


# ---------- HTML ----------
IMG_RE = re.compile(r'<img\b[^>]*>', re.I)
SRC_RE = re.compile(r'(\s)(?:data-consent-src|src)=(["\'])(https://images\.ctfassets\.net/[^"\']+)\2', re.I)
IFRAME_RE = re.compile(r'<iframe\b[^>]*?(?:data-consent-src|src)=(["\'])(https://www\.openstreetmap\.org/export/embed\.html\?[^"\']+)\1[^>]*>\s*</iframe>', re.I)
TITLE_RE = re.compile(r'\btitle=(["\'])([^"\']*)\1', re.I)
PRECONNECT_RE = re.compile(r'[ \t]*<link\b[^>]*images\.ctfassets\.net[^>]*>\r?\n?', re.I)


def bearbeiten(t, stat):
    def img(m):
        tag = m.group(0)
        def src(s):
            neu = foto_lokal(s.group(3))
            if neu is None:
                stat["offen"] += 1
                return s.group(0)
            stat["fotos"] += 1
            return f'{s.group(1)}src={s.group(2)}{neu}{s.group(2)}'
        return SRC_RE.sub(src, tag)
    t = IMG_RE.sub(img, t)

    def iframe(m):
        bild, link = karte_lokal(m.group(2))
        if bild is None:
            stat["offen"] += 1
            return m.group(0)
        tm = TITLE_RE.search(m.group(0))
        titel = tm.group(2) if tm else "Karte"
        stat["karten"] += 1
        return (f'<a class="osm-static" href="{link}" target="_blank" rel="noopener noreferrer">'
                f'<img src="{bild}" width="{BREITE}" height="{HOEHE}" alt="{titel}" loading="lazy">'
                f'<span>Karte © OpenStreetMap-Mitwirkende · Zum Vergrößern klicken</span></a>')
    t = IFRAME_RE.sub(iframe, t)

    t, n = PRECONNECT_RE.subn(lambda m: m.group(0) if "preconnect" not in m.group(0) and "dns-prefetch" not in m.group(0) else "", t)
    if "/consent.js" not in t and re.search(r"</body>", t, re.I):
        i = t.lower().rfind("</body>")
        t = t[:i] + CONSENT_TAG + "\n" + t[i:]
        stat["consent"] += 1
    return t


def main():
    stat = {"fotos": 0, "karten": 0, "consent": 0, "offen": 0}
    dateien = 0
    rest = []
    for d, sub, files in os.walk(ROOT):
        sub[:] = [s for s in sub if s not in SKIP]
        for f in files:
            if not f.endswith(".html"):
                continue
            p = os.path.join(d, f)
            alt = open(p, encoding="utf-8").read()
            neu = bearbeiten(alt, stat)
            if re.search(r'<(img|iframe)\b[^>]*\s(?:src|data-consent-src)=["\']https://(images\.ctfassets\.net|www\.openstreetmap\.org)', neu, re.I):
                rest.append(os.path.relpath(p, ROOT))
            if neu != alt:
                dateien += 1
                if not CHECK:
                    open(p, "w", encoding="utf-8").write(neu)
    print(f"{'Prüfung' if CHECK else 'Geschrieben'}: {dateien} Dateien · Fotos {stat['fotos']} · Karten {stat['karten']} · consent.js ergänzt {stat['consent']} · offen {stat['offen']}")
    if rest:
        print("Noch Fremdinhalte in:", *rest[:20], sep="\n  ")
    if CHECK and (rest or dateien):
        sys.exit(1)
    if rest:
        sys.exit(1)


if __name__ == "__main__":
    main()
