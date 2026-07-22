#!/usr/bin/env python3
"""
generate-sitemap.py — erzeugt roman/sitemap.xml aus dem tatsächlichen Seitenbestand.

Regeln:
  * Alle .html unter roman/ (ohne vendor/, node_modules/)
  * Ausgeschlossen: Seiten mit <meta name="robots" ... noindex>,
    Google-Verify-Dateien (google*.html), 404-Seiten
  * index.html wird zur Verzeichnis-URL (/, /ratgeber/, /stadtteile/, /en/ ...)
  * lastmod = Datum des letzten Git-Commits der Datei (Fallback: mtime)
  * changefreq/priority: vorhandene Werte aus der alten sitemap.xml werden
    übernommen; neue Seiten bekommen Defaults nach Bereich
  * hreflang-Alternates zwischen Startseite (de) und /en/ (en)

Aufruf:  python3 scripts/generate-sitemap.py [--dry]
"""
import os, re, subprocess, sys
from datetime import date

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REPO = os.path.abspath(os.path.join(ROOT, '..'))
BASE = 'https://romanbecker.de'
OUT = os.path.join(ROOT, 'sitemap.xml')
DRY = '--dry' in sys.argv

NOINDEX_RE = re.compile(r'<meta[^>]+name=["\']robots["\'][^>]*noindex', re.I)

DEFAULTS = [                      # (Praedikat, changefreq, priority)
    (lambda u: u == '/',                              'weekly',  '1.0'),
    (lambda u: u == '/stadtteile/',                   'weekly',  '0.8'),
    (lambda u: u == '/ratgeber/',                     'weekly',  '0.7'),
    (lambda u: u == '/en/',                           'monthly', '0.5'),
    (lambda u: u.startswith('/stadtteile/'),          'monthly', '0.7'),
    (lambda u: u.startswith('/ratgeber/'),            'monthly', '0.6'),
    (lambda u: u.startswith('/bodenrichtwert-'),      'monthly', '0.7'),
    (lambda u: u.startswith('/marktanalyse/'),        'monthly', '0.7'),
    (lambda u: u.startswith('/report/'),              'monthly', '0.5'),
]
FALLBACK = ('monthly', '0.8')


def url_for(rel):
    if rel == 'index.html':
        return '/'
    if rel.endswith('/index.html'):
        return '/' + rel[:-len('index.html')]
    return '/' + rel


def git_dates():
    """file -> letztes Commit-Datum (YYYY-MM-DD), ein einziger git-Aufruf."""
    out = subprocess.run(
        ['git', '-C', REPO, 'log', '--name-only', '--format=%cs', '--', 'roman/'],
        capture_output=True, text=True).stdout
    dates, cur = {}, None
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}', line):
            cur = line
        elif cur and line.startswith('roman/') and line not in dates:
            dates[line] = cur          # erster Treffer = neuester Commit
    return dates


def git_modified():
    """Dateien mit uncommitteten Änderungen -> die sind 'heute' geändert.
    Wichtig in CI: dort laufen erst die Listings-Skripte, dann diese Datei."""
    out = subprocess.run(['git', '-C', REPO, 'status', '--porcelain', '--', 'roman/'],
                         capture_output=True, text=True).stdout
    mod = set()
    for line in out.splitlines():
        p = line[3:].strip().strip('"')
        if '->' in p:                       # Renames: Zielpfad nehmen
            p = p.split('->')[-1].strip()
        if p.endswith('.html'):
            mod.add(p)
    return mod


def old_settings():
    """URL -> (changefreq, priority, lastmod) aus der bestehenden sitemap.xml."""
    if not os.path.exists(OUT):
        return {}
    xml = open(OUT, encoding='utf-8').read()
    res = {}
    for m in re.finditer(
        r'<loc>' + re.escape(BASE) + r'([^<]*)</loc><lastmod>([^<]*)</lastmod>'
        r'<changefreq>([^<]*)</changefreq><priority>([^<]*)</priority>',
        xml):
        res[m.group(1)] = (m.group(3), m.group(4), m.group(2))
    return res


def main():
    prev = old_settings()
    gd = git_dates()
    modified = git_modified()
    today = date.today().isoformat()

    pages = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in ('vendor', 'node_modules', 'scripts', '.git')]
        for fn in filenames:
            if not fn.endswith('.html'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace(os.sep, '/')
            if re.match(r'^google[0-9a-f]+\.html$', fn) or fn == '404.html':
                continue
            html = open(full, encoding='utf-8', errors='ignore').read()
            if NOINDEX_RE.search(html):
                continue
            pages.append(rel)

    rows, skipped = [], 0
    for rel in sorted(pages):
        u = url_for(rel)
        cf, pr, old_lm = prev.get(u, ('', '', ''))
        if not cf:
            for pred, c, p in DEFAULTS:
                if pred(u):
                    cf, pr = c, p
                    break
            else:
                cf, pr = FALLBACK
        # lastmod: in diesem Lauf geändert -> heute; sonst Git-Datum;
        # sonst alter Sitemap-Wert (schützt vor "alles heute" bei flachem Clone)
        key = 'roman/' + rel
        if key in modified:
            lm = today
        else:
            lm = gd.get(key) or old_lm or today
        rows.append((u, lm, cf, pr))

    # sortieren: Startseite, dann nach Priorität (hoch→niedrig), dann URL
    rows.sort(key=lambda r: (r[0] != '/', -float(r[3]), r[0]))

    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for u, lm, cf, pr in rows:
        alt = ''
        if u in ('/', '/en/'):
            alt = (f'<xhtml:link rel="alternate" hreflang="de" href="{BASE}/"/>'
                   f'<xhtml:link rel="alternate" hreflang="en" href="{BASE}/en/"/>'
                   f'<xhtml:link rel="alternate" hreflang="x-default" href="{BASE}/"/>')
        out.append(f'  <url><loc>{BASE}{u}</loc><lastmod>{lm}</lastmod>'
                   f'<changefreq>{cf}</changefreq><priority>{pr}</priority>{alt}</url>')
    out.append('</urlset>')
    xml = '\n'.join(out) + '\n'

    print(f'Seiten in Sitemap: {len(rows)}  (generiert am {today})')
    if DRY:
        print('--dry: nichts geschrieben')
        return
    open(OUT, 'w', encoding='utf-8').write(xml)
    print(f'geschrieben: {OUT}')


if __name__ == '__main__':
    main()
