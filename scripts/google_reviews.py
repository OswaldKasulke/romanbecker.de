#!/usr/bin/env python3
"""Google-Rezensionen nachladen (Places API (New)), zweimal pro Woche per Workflow.

Die API liefert je Abfrage hoechstens 5 Rezensionen. Deshalb wird die Datei
nie ersetzt, sondern ergaenzt: vorhandene Eintraege bleiben, neue mit Text
kommen dazu. Gesamtwertung und Anzahl werden bei jedem Lauf aktualisiert.
Rezensionen nur mit Sternen (ohne Text) zaehlen in der Wertung mit, bekommen
aber keine Karte.

Aufruf:  GOOGLE_PLACES_KEY=... python3 google_reviews.py --out datei.json
         [--place-id ChIJ...] [--query "Name, Adresse"] [--exclude "Name"]
Schluessel: GitHub-Secret GOOGLE_PLACES_KEY (nur Places API (New) erlaubt).
"""
import argparse, datetime, json, os, sys, urllib.request

API = "https://places.googleapis.com/v1"


def rufe(url, body=None, maske="*"):
    kopf = {"X-Goog-Api-Key": os.environ["GOOGLE_PLACES_KEY"], "X-Goog-FieldMask": maske,
            "Content-Type": "application/json"}
    daten = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=daten, headers=kopf, method="POST" if daten else "GET")
    try:
        return json.loads(urllib.request.urlopen(req, timeout=30).read())
    except urllib.error.HTTPError as fehler:
        sys.exit(f"Places API {fehler.code}: {fehler.read().decode()[:400]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--place-id")
    ap.add_argument("--query")
    ap.add_argument("--exclude", action="append", default=[],
                    help="Autorname, der nie erscheinen darf (Markentrennung)")
    a = ap.parse_args()

    d = json.load(open(a.out, encoding="utf-8")) if os.path.exists(a.out) else {}
    d.setdefault("reviews", [])
    pid = a.place_id or d.get("place_id")
    if not pid:
        treffer = rufe(f"{API}/places:searchText", {"textQuery": a.query, "languageCode": "de"},
                       "places.id,places.displayName")
        if not treffer.get("places"):
            sys.exit(f"Kein Google-Profil gefunden fuer: {a.query}")
        pid = treffer["places"][0]["id"]
        print("Profil gefunden:", treffer["places"][0]["displayName"]["text"], pid)

    p = rufe(f"{API}/places/{pid}?languageCode=de",
             maske="id,displayName,rating,userRatingCount,googleMapsUri,reviews,websiteUri,formattedAddress")
    print("Profil:", p["displayName"]["text"], "|", p.get("formattedAddress", ""), "| Website im Profil:", p.get("websiteUri", "(keine)"))
    heute = datetime.date.today().isoformat()
    vorher = json.dumps(d, sort_keys=True, ensure_ascii=False)

    d["place_id"] = pid
    d.setdefault("profile_name", p["displayName"]["text"])
    d.setdefault("profile_url", p.get("googleMapsUri", ""))
    if p.get("rating") is not None:
        d["rating"] = f'{p["rating"]:.1f}'.replace(".", ",")
    d["count"] = p.get("userRatingCount", d.get("count", 0))

    bekannt = {(r["author"].strip().lower(), r["text"][:60]) for r in d["reviews"]}
    neu = 0
    for r in p.get("reviews", []):
        text = ((r.get("originalText") or r.get("text") or {}).get("text") or "").strip()
        autor = (r.get("authorAttribution") or {}).get("displayName", "").strip()
        if not text or not autor or any(x.lower() in (autor + " " + text).lower() for x in a.exclude):
            continue
        # Von Hand uebernommene Eintraege (ohne id) bekommen beim ersten Treffer
        # die API-Angaben: Link zur Rezension und Datum.
        alt = next((x for x in d["reviews"] if not x.get("id") and x["author"].strip().lower() == autor.lower()), None)
        if alt:
            alt.update(id=r.get("name", ""), text=text, stars=int(r.get("rating", 5)),
                       source_url=r.get("googleMapsUri") or alt.get("source_url") or d["profile_url"],
                       published=(r.get("publishTime") or "")[:10])
            continue
        if (autor.lower(), text[:60]) in bekannt:
            continue
        d["reviews"].append({
            "id": r.get("name", ""), "author": autor, "stars": int(r.get("rating", 5)), "text": text,
            "source_url": r.get("googleMapsUri") or d["profile_url"], "verified_at": heute,
            "published": (r.get("publishTime") or "")[:10],
        })
        bekannt.add((autor.lower(), text[:60]))
        neu += 1

    # Neueste zuerst; Eintraege ohne Datum ans Ende, in ihrer bisherigen Reihenfolge.
    d["reviews"].sort(key=lambda r: r.get("published") or "", reverse=True)
    if json.dumps({**d, "checked_at": d.get("checked_at")}, sort_keys=True, ensure_ascii=False) != vorher:
        d["checked_at"] = heute
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    json.dump(d, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(a.out, "a", encoding="utf-8").write("\n")
    print(f'{d["profile_name"]}: {d.get("rating")} bei {d["count"]} Rezensionen, '
          f'{neu} neue mit Text, {len(d["reviews"])} Karten gesamt')


if __name__ == "__main__":
    main()
