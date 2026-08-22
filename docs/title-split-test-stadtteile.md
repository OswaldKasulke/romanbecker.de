# Title-Split-Test Stadtteilseiten (Start 22.08.2026)

## Anlass

Am 18.08.2026 wurden Title, H1 und H2 aller Stadtteilseiten umgestellt. Dabei ging
auf 86 Seiten die zweite Titelhaelfte `| Immobilienmakler Koeln` verloren, ersetzt
durch `| Immobilie verkaufen <Ort>`.

Ab dem 20.08.2026 brachen die Impressionen des Segments `/stadtteile/` ein:
1.607 (19.08.) -> 862 (20.08.) -> 679 (21.08.), also -58 %. Alle anderen Bereiche
der Seite blieben stabil, 86 % des Gesamtrueckgangs entfielen auf dieses Segment.
Die Positionen blieben dabei gleich oder verbesserten sich - verloren ging die
Breite der Suchanfragen, nicht das Ranking. Alle 90 produktiven Seiten sind
indexiert, technisch ist nichts defekt.

## Aufbau

Getestet wird **eine** Variable: die zweite Titelhaelfte. H1, H2, og:title und
Inhalt bleiben in beiden Gruppen unveraendert.

- **Gruppe A (43 Seiten):** zweite Titelhaelfte zurueck auf `| Immobilienmakler Koeln`
- **Gruppe B (43 Seiten):** bleibt bei `| Immobilie verkaufen <Ort>`

Die Zuteilung ist nach Impressionsvolumen (28 Tage bis 19.08.2026) paarweise
stratifiziert. Zweites Stratum: die 28 Seiten, deren erste Titelhaelfte am 18.08.
zusaetzlich von `Immobilienbewertung Koeln-<Ort>` auf `Immobilienmakler Koeln-<Ort>`
geaendert wurde - sie sind 14/14 auf beide Gruppen verteilt.

| | Seiten | Impressionen 28 Tage | Bewertungs-Seiten |
|---|---|---|---|
| A | 43 | 10628 | 14 |
| B | 43 | 10223 | 14 |

Volumenabweichung der Gruppen: 3,9 %.

## Auswertung

Ab dem **05.09.2026** (14 Tage Laufzeit). Gemessen wird das **Verhaeltnis** der
Impressionen von A zu B, nicht die absolute Kurve - so faellt der gemeinsame Trend
aus der laufenden Neubewertung heraus. Ausgangsverhaeltnis A:B = 1,04.

Bis dahin keine weiteren Aenderungen an Titles, H1 oder Inhalt der Stadtteilseiten.

## Gruppe A - Title zurueckgedreht

| Seite | Impr. 28 Tage |
|---|---|
| altstadt-nord | 156 |
| altstadt-sued | 191 |
| belgisches-viertel | 385 |
| chorweiler | 155 |
| dellbrueck | 546 |
| duennwald | 303 |
| ehrenfeld | 460 |
| eil | 199 |
| ensen | 288 |
| flittard | 153 |
| fuehlingen | 43 |
| gremberghoven | 183 |
| holweide | 805 |
| immendorf | 104 |
| kalk | 233 |
| komponistenviertel | 89 |
| lind | 96 |
| lindweiler | 176 |
| loevenich | 442 |
| marienburg | 227 |
| mauenheim | 128 |
| merkenich | 133 |
| muelheim | 87 |
| neuehrenfeld | 203 |
| neustadt-nord | 140 |
| niehl | 260 |
| nippes | 323 |
| porz | 392 |
| raderthal | 170 |
| riehl | 167 |
| roggendorf-thenhoven | 225 |
| rondorf | 364 |
| stammheim | 294 |
| urbach | 280 |
| vogelsang | 215 |
| volkhoven-weiler | 119 |
| wahn | 159 |
| wahnheide | 270 |
| weiden | 343 |
| westhoven | 194 |
| worringen | 380 |
| zollstock | 273 |
| zuendorf | 275 |

## Gruppe B - unveraendert

| Seite | Impr. 28 Tage |
|---|---|
| agnesviertel | 229 |
| bayenthal | 204 |
| bickendorf | 277 |
| bilderstoeckchen | 410 |
| blumenberg | 116 |
| bocklemuend-mengenich | 138 |
| brueck | 112 |
| buchforst | 91 |
| buchheim | 162 |
| deutz | 337 |
| elsdorf | 124 |
| esch-auweiler | 196 |
| finkenberg | 51 |
| godorf | 99 |
| grengel | 144 |
| hahnwald | 405 |
| heimersdorf | 288 |
| hoehenberg | 160 |
| hoehenhaus | 299 |
| humboldt-gremberg | 379 |
| klettenberg | 182 |
| langel | 187 |
| libur | 80 |
| lindenthal | 376 |
| longerich | 240 |
| merheim | 270 |
| meschenich | 248 |
| neubrueck | 145 |
| neustadt-sued | 324 |
| ossendorf | 184 |
| ostheim | 221 |
| pesch | 195 |
| poll | 297 |
| raderberg | 161 |
| rath-heumar | 474 |
| rodenkirchen | 483 |
| seeberg | 251 |
| suelz | 489 |
| suerth | 270 |
| vingst | 199 |
| weidenpesch | 152 |
| weiss | 164 |
| widdersdorf | 410 |
