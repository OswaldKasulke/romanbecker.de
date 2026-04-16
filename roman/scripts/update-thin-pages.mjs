/**
 * update-thin-pages.mjs
 * Expands intro + portrait for 21 thin Stadtteil pages (< 22KB).
 * Groups: 13x Porz, 7x Chorweiler, 1x Ehrenfeld (Vogelsang).
 * Run once: node roman/scripts/update-thin-pages.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, 'stadtteile-data.mjs');

// ── New content per slug ────────────────────────────────────────────────────
const UPDATES = {

  // ═══════════════ BEZIRK 7 — PORZ ═══════════════

  elsdorf: {
    intro: 'Elsdorf ist einer der kleinsten Kölner Stadtteile im Südosten des Bezirks Porz — mit nur 2.800 Einwohnern auf 2,15 Quadratkilometern ein echtes Dorf innerhalb der Stadtgrenzen. Wer günstige Grundstücke, Ruhe und kurze Wege in die Porzer Innenstadt sucht, findet in Elsdorf eine der erschwinglichsten Wohnadressen im gesamten Kölner Stadtgebiet.',
    portrait: 'Elsdorf liegt im südöstlichen Zipfel des Porzer Bezirks, eingekesselt zwischen Feldern, Kleingärten und den Nachbarstadtteilen Urbach, Lind, Libur und Grengel. Das Straßenbild ist von Einfamilienhäusern aus den 1960er und 1970er Jahren geprägt, dazu kommen vereinzelte Neubauten auf den letzten verfügbaren Grundstücken. Der Stadtteil hat keinen eigenen Ortskern im klassischen Sinne — die Nahversorgung und Infrastruktur (Schulen, Ärzte, Einkauf) ist auf das benachbarte Urbach und das Porzer Zentrum ausgerichtet, das über den Bus 152 erreichbar ist.\n\nDer Bodenmarkt in Elsdorf zählt zu den günstigsten im gesamten Kölner Stadtgebiet: Eigentumswohnungen liegen bei durchschnittlich 3.400 €/m², Häuser darunter. Für Kaufinteressenten, die in der Metropolregion Köln günstigen Eigenheimbesitz suchen und Pendlerzeiten von 30–40 Minuten in die Innenstadt akzeptieren, ist Elsdorf eine realistische Option. Die Autobahn A59 ist über Lind erreichbar, die S-Bahn-Station Porz liegt rund drei Kilometer entfernt.',
  },

  eil: {
    intro: 'Eil ist ein solider Familienstandort im rechtsrheinischen Köln mit rund 9.200 Einwohnern auf 4,12 Quadratkilometern. Der Stadtteil bietet erschwingliche Einfamilienhäuser, eine eigene Grundschule und direkte Anbindung an die A59 — ideal für Pendler, die Kölner Lebensqualität zu vernünftigen Preisen suchen.',
    portrait: 'Eil grenzt im Norden an Urbach, im Westen an Porz-Mitte und im Osten an Elsdorf. Das Wohnquartier ist überwiegend von freistehenden Einfamilienhäusern und Doppelhaushälften geprägt, die in den 1960er bis 1980er Jahren entstanden sind. Die GGS Eil versorgt den Stadtteil mit Grundschulplätzen, weiterführende Schulen befinden sich im nahegelegenen Porz-Zentrum.\n\nVerkehrstechnisch ist Eil über die Buslinien 151 und 152 an das Porzer Zentrum und den S-Bahnhof Porz angebunden; die Autobahn A59 Richtung Köln-Zentrum und Bonn ist in wenigen Minuten erreichbar. Der Flughafen Köln/Bonn liegt etwa zehn Kilometer entfernt, was die Lage für Vielflieger attraktiv macht.\n\nDer Immobilienmarkt bewegt sich bei 3.800 €/m² für Eigentumswohnungen, Einfamilienhäuser liegen im mittleren Preissegment. Eil zählt damit zu den günstigsten Wohnlagen im rechtsrheinischen Köln mit guter Autobahnanbindung — ein Markt, der vor allem von Familien mit Eigenheimwunsch und von Kapitalanlegern genutzt wird.',
  },

  lind: {
    intro: 'Lind liegt zentral im Porzer Bezirk zwischen Eil, Elsdorf und Porz-Mitte — ein ruhiger Stadtteil mit 6.800 Einwohnern, gewachsener Einfamilienhausstruktur und direkter Autobahnanbindung an die A59. Günstige Kaufpreise und familiäre Atmosphäre machen Lind zu einem soliden Einsteiger-Markt im rechtsrheinischen Köln.',
    portrait: 'Lind erstreckt sich auf 3,45 Quadratkilometern zwischen der A59 im Westen und den Feldern in Richtung Elsdorf und Libur. Das Stadtbild wird von ruhigen Wohnstraßen mit Einfamilienhäusern und kleineren Mehrfamilienhäusern aus der Nachkriegszeit geprägt. Eine eigene Grundschule (GGS Lind) deckt die Grundschulversorgung ab, weiterführende Schulen und der vollständige Einzelhandel sind im Porzer Zentrum oder Urbach vorhanden.\n\nDie Buslinien 152 und 161 verbinden Lind mit Porz und dem S-Bahn-Netz; die A59-Auffahrt ist in wenigen Minuten erreichbar. Wer auf das Auto angewiesen ist, schätzt die schnelle Verbindung Richtung Innenstadt (ca. 20–25 Minuten) und Bonn (ca. 30 Minuten).\n\nMit Kaufpreisen von durchschnittlich 3.600 €/m² gehört Lind zu den günstigsten Wohnlagen Kölns. Der Markt ist überschaubar — wenige Objekte kommen auf den Markt, die Verkaufszeiten sind kurz. Besonders gefragt sind freistehende Einfamilienhäuser mit Garten.',
  },

  libur: {
    intro: 'Libur ist mit nur 1.145 Einwohnern der kleinste Kölner Stadtteil — ein echtes Dorf im Süden des Porzer Bezirks, umgeben von Feldern und dem Naturschutzgebiet Wahner Heide. Wer maximale Ruhe, ländliche Idylle und trotzdem eine Kölner Adresse sucht, findet in Libur einen der letzten wirklich dörflichen Wohnorte der Großstadt.',
    portrait: 'Libur liegt auf 2,35 Quadratkilometern zwischen Grengel, Lind, Elsdorf und Langel, nur wenige Kilometer von der Wahner Heide entfernt. Der Stadtteil besteht im Wesentlichen aus einem alten Dorfkern mit historischem Ortsmittelpunkt, umgeben von Einfamilienhäusern und landwirtschaftlichen Flächen. Eine eigene Infrastruktur — Schulen, Einkauf, Arztpraxen — fehlt weitgehend; Libur ist auf die umliegenden Stadtteile Grengel, Lind und Porz angewiesen.\n\nDie Anbindung erfolgt über den Bus 162, der Richtung Porz fährt. Für Autofahrer ist die A59 über Lind erreichbar, der S-Bahnhof Porz liegt etwa fünf Kilometer entfernt. Die Wahner Heide als direkt angrenzendes Naturschutzgebiet bietet Rad- und Wanderwege vor der Haustür.\n\nDer Immobilienmarkt in Libur ist sehr kleinteilig — Objekte kommen selten auf den Markt, da viele Häuser über Generationen im Familienbesitz bleiben. Kaufpreise für Einfamilienhäuser liegen unter dem Kölner Durchschnitt. Libur spricht eine sehr spezifische Käufergruppe an: Menschen, die bewusst das Dorfleben innerhalb der Stadtgrenzen wählen.',
  },

  ensen: {
    intro: 'Ensen liegt am rechten Rheinufer im südlichen Porzer Bezirk — ein Stadtteil im Wandel, der ehemalige Industrieflächen schrittweise in Wohnquartiere verwandelt. Mit rund 7.800 Einwohnern, direkter Rheinlage und wachsendem Neubauangebot entwickelt sich Ensen zu einem aufstrebenden Standort für Eigenheim- und Kapitalanleger.',
    portrait: 'Ensen grenzt im Norden an Westhoven, im Westen an Gremberghoven und im Süden an Poll. Das Stadtviertel ist durch eine heterogene Bebauung geprägt: Neben älteren Einfamilienhaussiedlungen entstehen auf Konversionsflächen ehemaliger Industriebetriebe zunehmend Neubauprojekte. Die GGS Ensen versorgt die Grundschulkinder, weiterführende Schulen befinden sich im Porzer Zentrum.\n\nVerkehrstechnisch ist Ensen über den Bus 151 und die nahegelegene Straßenbahn 7 (Haltestelle Westhoven) angebunden. Die direkte Rheinlage — mit Zugang zum Rheinuferweg — ist einer der wesentlichen Lagevorteile. Für Radfahrer ist der rechtsrheinische Radweg bis ins Porzer Zentrum oder rheinaufwärts nach Poll gut befahrbar.\n\nMit Kaufpreisen von 3.600 €/m² und einem Aufwärtstrend von +3,5 % jährlich bietet Ensen Potenzial für Kapitalanleger, die früh in aufwertende Lagen einsteigen wollen. Die Kombination aus Rheinlage und verfügbaren Konversionsflächen ist ein Alleinstellungsmerkmal, das sich mittel- bis langfristig in den Preisen niederschlagen dürfte.',
  },

  wahnheide: {
    intro: 'Wahnheide liegt am östlichen Rand des Porzer Bezirks, direkt angrenzend an die Wahner Heide — eines der größten Naturschutzgebiete der Region. Mit rund 7.900 Einwohnern vereint der Stadtteil günstiges Wohnen, grüne Naherholung und eine S-Bahn-Station in unmittelbarer Nähe.',
    portrait: 'Wahnheide erstreckt sich auf 4,15 Quadratkilometern zwischen dem Naturschutzgebiet Wahner Heide im Osten, Grengel im Norden und Wahn im Süden. Das Stadtviertel ist von Einfamilienhäusern und Reihenhäusern geprägt, die in den 1950er bis 1980er Jahren entstanden. Die Nähe zur Wahner Heide — einem 50 Quadratkilometer großen Natur- und Truppenübungsplatz — bietet unmittelbare Naherholung für Wanderer, Jogger und Radfahrer.\n\nDie Schulversorgung erfolgt über Einrichtungen in den Nachbarstadtteilen Wahn und Porz. Über die Buslinien 161 und 162 sowie die nahegelegene S-Bahn-Station Porz-Wahn (S12/S13) ist Wahnheide an das Kölner Netz angebunden; der Hauptbahnhof ist in rund 25 Minuten erreichbar. Der Flughafen Köln/Bonn liegt in unter zehn Minuten Fahrtzeit.\n\nDer Kaufpreis für Eigentumswohnungen liegt bei 3.400 €/m² — damit zählt Wahnheide zu den günstigsten Lagen im Kölner Stadtgebiet. Besonders gefragt sind ältere Einfamilienhäuser mit Garten in Heidenähe. Der Markt ist kleinteilig und diskret, Angebote kommen selten öffentlich auf den Markt.',
  },

  langel: {
    intro: 'Langel ist ein idyllisches Rheindorf im Süden des Porzer Bezirks — mit nur 3.200 Einwohnern, einer historischen Fährenverbindung nach Hitdorf und einer direkt am Rhein gelegenen Wohnlage. Wer Dorfleben am Rhein mit Kölner Adresse sucht, findet in Langel eine der malerischsten und ruhigsten Wohnadressen der Stadt.',
    portrait: 'Langel liegt auf 4,25 Quadratkilometern am südlichen Ufer des Kölner Stadtgebiets, direkt am Rhein, eingefasst von Zündorf im Norden, Libur im Westen und der Gemeinde Hitdorf am anderen Rheinufer. Der historische Ortskern mit der Rheinfähre nach Hitdorf ist das Herzstück des Stadtteils. Die Fähre ist nicht nur Verkehrsverbindung, sondern auch Naherholungspunkt und Treffpunkt für Radfahrer auf dem Rheinradweg.\n\nDie Infrastruktur in Langel ist bewusst überschaubar — Schulen und vollständige Nahversorgung befinden sich in Zündorf oder dem Porzer Zentrum. Der Bus 163 verbindet Langel mit dem Netz; Autofahrer erreichen die A59 über Zündorf in wenigen Minuten. Rheinufer, Auenlandschaft und die Ruheatmosphäre eines Rheindorfs sind die wesentlichen Lagequalitäten.\n\nMit durchschnittlichen Kaufpreisen von 3.800 €/m² ist Langel günstiger als viele linksrheinische Rheinortschaften, bietet aber vergleichbare Lagequalitäten. Besonders gefragt sind ältere Häuser mit direktem Rheinblick oder Rhein-Nähe — ein Nischensegment, das sich auch in schwächeren Marktphasen stabil hält.',
  },

  grengel: {
    intro: 'Grengel liegt im südöstlichen Porzer Bezirk, in direkter Nachbarschaft zum Flughafen Köln/Bonn und mit schneller A59-Anbindung. Der Stadtteil bietet mit 4.500 Einwohnern eine ruhige Wohnlage zu günstigen Preisen — attraktiv für Pendler, Flughafenmitarbeiter und Käufer, die erschwingliche Einfamilienhäuser mit gutem Autobahnanschluss suchen.',
    portrait: 'Grengel erstreckt sich auf 2,85 Quadratkilometern zwischen Wahn im Süden, Wahnheide im Osten, Libur im Norden und Lind im Westen. Der Stadtteil ist geprägt von Einfamilienhäusern und Reihenhäusern aus den 1960er bis 1980er Jahren. Eine eigene Grundschule gibt es nicht — Schüler besuchen Einrichtungen in Wahn oder Porz. Die Infrastruktur für den täglichen Bedarf ist ebenfalls auf Nachbarstadtteile ausgerichtet.\n\nDie Lage nahe dem Flughafen Köln/Bonn (ca. 5 km) ist ein wesentliches Merkmal: Vielflieger und Beschäftigte am Flughafen schätzen die kurzen Wege. Die A59 ist direkt erreichbar, der Bus 161 verbindet Grengel mit dem Porzer Zentrum. Die S-Bahn-Station Porz-Wahn liegt in Gehdistanz.\n\nFluglärmbelastung zu Tageszeiten ist ein Faktor, der bei der Kaufentscheidung berücksichtigt werden sollte — und der sich in den Preisen widerspiegelt: Eigentumswohnungen kosten im Schnitt 3.600 €/m², deutlich unter dem Kölner Mittel. Für Kapitalanleger, die an Vermietung an Flughafenpersonal denken, ist Grengel ein interessanter Einstiegsmarkt.',
  },

  finkenberg: {
    intro: 'Finkenberg ist ein dicht besiedelter Stadtteil im westlichen Porzer Bezirk mit rund 7.000 Einwohnern auf nur 1,55 Quadratkilometern — damit einer der dichtest besiedelten rechtsrheinischen Stadtteile. Die Straßenbahn 7 und günstige Kaufpreise unter 3.200 €/m² machen Finkenberg zum Einstiegsmarkt für Käufer mit begrenztem Budget.',
    portrait: 'Finkenberg liegt zwischen Porz-Mitte, Ensen, Gremberghoven und Westhoven. Das Stadtbild wird überwiegend von Großwohnsiedlungen der 1970er Jahre geprägt — mehrstöckige Mietshäuser mit Sozialwohnungsbestand und Geschosswohnungsbau. Städtebauliche Aufwertungsmaßnahmen der vergangenen Jahre haben das Wohnumfeld verbessert, die Infrastruktur ausgebaut und das Image des Stadtteils graduell verändert.\n\nDie GGS Finkenberg stellt die Grundschulversorgung sicher, weiterführende Schulen befinden sich im Porzer Zentrum. Die Straßenbahn 7 (Haltestelle Finkenberg) verbindet den Stadtteil direkt mit dem Kölner Hauptbahnhof in rund 20 Minuten — die beste ÖPNV-Anbindung unter den kleinen Porzer Stadtteilen. Ergänzend fahren Buslinien 151 Richtung Porz.\n\nMit Kaufpreisen ab 3.200 €/m² und einem Aufwärtstrend von +4,0 % jährlich ist Finkenberg einer der wenigen Kölner Stadtteile, in dem Eigentumswohnungen unter 200.000 € noch realistisch sind. Die hohe Mieternachfrage und die gute Straßenbahnanbindung machen den Stadtteil für Kapitalanleger interessant.',
  },

  wahn: {
    intro: 'Wahn ist ein grüner Stadtteil am Tor zur Wahner Heide mit rund 7.100 Einwohnern und eigenem S-Bahn-Halt (S12/S13). Die Kombination aus Naturlage, Flughafennähe und direkter S-Bahn-Verbindung macht Wahn zu einem der eigenwilligsten Wohnorte im Porzer Bezirk — ruhig, aber gut erreichbar.',
    portrait: 'Wahn liegt auf 5,85 Quadratkilometern im Südosten des Porzer Bezirks, direkt angrenzend an das Naturschutzgebiet Wahner Heide. Der Stadtteil hat einen historischen Ortskern rund um die GGS Wahn und die evangelische Kirche, ergänzt durch Wohngebiete aus verschiedenen Bauphasen. Die Wahner Heide — ein ehemaliges Militärgelände, das heute als Naturschutz- und Freizeitgebiet genutzt wird — liegt direkt vor der Haustür.\n\nDer S-Bahnhof Porz-Wahn (S12 nach Düsseldorf, S13 nach Köln-Mitte) ist das zentrale Verkehrsmittel: Kölner Hauptbahnhof in 20 Minuten, Flughafen Köln/Bonn in zwei Stationen. Der Bus 161 ergänzt das Angebot. Die Fluglärmbelastung ist durch die Lage östlich der Startbahn moderat, aber vorhanden.\n\nEigentumswohnungen kosten im Schnitt 3.600 €/m². Besonders gefragt sind freistehende Einfamilienhäuser in Heidenähe — ein Nischensegment mit stabiler Wertenentwicklung, das auf eine treue Käuferschaft trifft: Menschen, die naturnahes Wohnen mit guter S-Bahn-Anbindung kombinieren möchten.',
  },

  gremberghoven: {
    intro: 'Gremberghoven liegt am westlichen Rand des Porzer Bezirks zwischen Porz-Mitte, Ensen und dem Gewerbegebiet Köln-Gremberg — ein Stadtteil im Wandel, der von Industrieumnutzung und wachsender Wohnbebauung geprägt ist. Mit 5.500 Einwohnern und direktem A4/A59-Anschluss ist Gremberghoven ein pragmatischer Wohnstandort mit Entwicklungspotenzial.',
    portrait: 'Gremberghoven erstreckt sich auf 4,72 Quadratkilometern zwischen der A4 im Norden, dem Rhein im Westen und den Wohngebieten von Ensen und Finkenberg im Süden. Der Stadtteil ist heterogen geprägt: Neben Wohngebieten aus der Nachkriegszeit gibt es umfangreiche Gewerbeflächen und Logistikbetriebe, die dem Stadtteil seinen industriellen Charakter verleihen. Der Wandel von Gewerbe- zu Wohnnutzung läuft schrittweise.\n\nDie Schulversorgung erfolgt über Einrichtungen in den Nachbarstadtteilen Porz und Ensen. Für den Individualverkehr ist Gremberghoven ideal: Die Auffahrten zur A4 (Richtung Aachen, Frankfurt) und A59 (Richtung Bonn, Düsseldorf) liegen im Stadtteil. Öffentlich ist der Anschluss über Buslinien 151 und 152 möglich.\n\nMit Kaufpreisen von 3.400 €/m² zählt Gremberghoven zu den günstigsten Lagen im Kölner Stadtgebiet. Der Stadtteil spricht vor allem Käufer an, die die Autobahnlage schätzen und bei Wohnqualität Abstriche zugunsten des Preises machen. Für Kapitalanleger bieten die Konversionsflächen langfristiges Entwicklungspotenzial.',
  },

  westhoven: {
    intro: 'Westhoven liegt am rechten Rheinufer zwischen Poll und Ensen — ein ruhiger Stadtteil mit direktem Rheinzugang, Straßenbahn-Anschluss und familienfreundlicher Struktur. Die 5.800 Einwohner schätzen die Rheinlage, die Nähe zur Kölner Innenstadt via Straßenbahn 7 und Kaufpreise, die noch unter dem Kölner Schnitt liegen.',
    portrait: 'Westhoven erstreckt sich auf 2,45 Quadratkilometern am rechten Rheinufer, begrenzt von Poll im Norden, Ensen im Süden und Finkenberg im Osten. Der Stadtteil hat eine ausgeprägte Rheinlage mit Zugang zum rechtsrheinischen Rheinuferweg, der für Freizeitaktivitäten wie Radfahren, Joggen und Spazierengehen intensiv genutzt wird. Die GGS Westhoven versorgt die Grundschulkinder, weiterführende Schulen liegen in Porz und Deutz.\n\nDie Straßenbahn 7 (Haltestelle Westhoven) ist das Rückgrat der ÖPNV-Anbindung: Der Kölner Hauptbahnhof ist in rund 20 Minuten erreichbar. Der Bus 150 ergänzt das Netz. Die Rheinbrücke Rodenkirchen liegt in unmittelbarer Nähe, was die Verbindung in den linksrheinischen Kölner Süden vereinfacht.\n\nMit 4.200 €/m² liegt Westhoven im mittleren Preissegment des Porzer Bezirks — die Rheinlage schlägt sich deutlich im Preis nieder. Besonders gefragt sind Bestandswohnungen mit Rheinblick und ältere Einfamilienhäuser nahe dem Uferweg. Der Aufwärtstrend von +3,5 % jährlich spiegelt die wachsende Beliebtheit der rechtsrheinischen Rheinlagen wider.',
  },

  urbach: {
    intro: 'Urbach ist mit rund 13.000 Einwohnern einer der bevölkerungsreichsten Stadtteile im Porzer Bezirk und fungiert als Versorgungszentrum für die umliegenden kleineren Stadtteile Eil, Elsdorf und Lind. Gewachsene Wohnstruktur, eigene Grundschule und direkte S-Bahn-Nähe machen Urbach zum soliden Familienstandort im rechtsrheinischen Köln.',
    portrait: 'Urbach liegt auf 4,25 Quadratkilometern nördlich des Porzer Zentrums, begrenzt von Eil im Osten, Elsdorf im Südosten und Porz-Kern im Westen. Das Stadtbild ist von Einfamilienhäusern, Doppelhaushälften und kleineren Mehrfamilienhäusern aus der Nachkriegszeit geprägt, mit punktuellem Neubau in Bestandslücken. Die Einkaufsversorgung — REWE, Bäckereien, Apotheken — ist direkt im Stadtteil vorhanden, was Urbach von den kleineren Nachbarstadtteilen unterscheidet.\n\nDie GGS Urbach deckt die Grundschulversorgung ab; das Gymnasium Porz liegt fußläufig erreichbar. Verkehrstechnisch ist Urbach über die Buslinien 151 und 152 mit dem Porzer Hauptbahnhof verbunden, von wo S-Bahnen Richtung Köln-Innenstadt und Bonn fahren. Die A59 ist über Eil in wenigen Minuten erreichbar.\n\nMit Kaufpreisen von 3.800 €/m² liegt Urbach im unteren Mittelfeld des Porzer Bezirks. Die Kombination aus gewachsener Infrastruktur, Grundschule vor Ort und relativer Innenstadtnähe macht Urbach zum attraktivsten der kleinen Porzer Stadtteile für Familien mit Eigenheimwunsch.',
  },

  // ═══════════════ BEZIRK 6 — CHORWEILER ═══════════════

  seeberg: {
    intro: 'Seeberg ist ein kompakter Stadtteil im Bezirk Chorweiler mit rund 9.800 Einwohnern auf nur 1,48 Quadratkilometern — einer der dichtest besiedelten Stadtteile im Kölner Norden. Neubaugebiete der 1970er Jahre, eine eigene Grundschule und die Nähe zur S-Bahn Chorweiler prägen das Bild dieses ruhigen Familienstadtteils.',
    portrait: 'Seeberg liegt zwischen Chorweiler im Norden, Blumenberg im Westen und Heimersdorf im Süden. Der Stadtteil entstand hauptsächlich als Trabantensiedlung in den 1970er Jahren und ist von Mehrfamilienhäusern und Reihenhauszeilen geprägt. Städtebauliche Sanierungsmaßnahmen haben das Wohnumfeld in den letzten Jahren verbessert. Die GGS Seeberg versorgt den Stadtteil mit Grundschulplätzen, das Gymnasium Chorweiler liegt in unmittelbarer Nachbarschaft.\n\nDie S-Bahn-Station Köln-Chorweiler (S11) ist fußläufig oder per Bus 121 erreichbar und bringt Pendler in rund 15 Minuten zum Hauptbahnhof. Einkaufsmöglichkeiten sind im Chorweiler Einkaufszentrum — einem der größten Einkaufszentren im Kölner Norden — in unmittelbarer Nähe vorhanden.\n\nDer Kaufpreis für Eigentumswohnungen liegt bei 3.600 €/m² mit einem Aufwärtstrend von +3,5 % jährlich. Seeberg bietet Kapitalanlegern solide Mietrenditen durch die konstante Nachfrage nach günstigem Wohnraum im Kölner Norden. Für Eigennutzer ist der Stadtteil besonders für Familien mit Kindern geeignet, die Wert auf kurze Schulwege und günstige Preise legen.',
  },

  merkenich: {
    intro: 'Merkenich liegt ganz im Norden Kölns am Rhein — ein Stadtteil mit dörflichem Charakter, dem Ford-Werk als prägendem Arbeitgeber in der Nachbarschaft und einem direkten Zugang zum Rheinufer. Mit 6.200 Einwohnern auf 7,85 Quadratkilometern ist Merkenich einer der flächenmäßig größten, aber dünn besiedelten Stadtteile im Chorweiler Bezirk.',
    portrait: 'Merkenich erstreckt sich auf einem großen Areal zwischen dem Rhein im Osten, Worringen im Norden und Volkhoven/Weiler im Süden. Der Stadtteil hat einen historischen Dorfkern mit Altbauten und Nachkriegssiedlungen; das Ford-Werk Köln liegt in unmittelbarer Nachbarschaft und hat die Siedlungsstruktur historisch geprägt — viele Bewohner waren oder sind Werksangehörige.\n\nDie eigene Grundschule GGS Merkenich versorgt den Stadtteil, weiterführende Schulen befinden sich in Worringen und Chorweiler. Öffentlich ist Merkenich über den Bus 120 angebunden, der nach Chorweiler und von dort zur S-Bahn fährt. Der Rhein ist zu Fuß oder mit dem Rad erreichbar; Rheinschifffahrt und Rheinuferweg bieten Freizeitwert.\n\nMit 3.600 €/m² liegt Merkenich im unteren Segment des Chorweiler Bezirks. Die Lage im äußersten Norden Kölns mit eingeschränkter ÖPNV-Anbindung macht den Stadtteil vor allem für ortsgebundene Käufer interessant — Werksangehörige, Familien mit starkem Bezug zum Norden oder Käufer, die das Dorfgefühl am Rhein schätzen.',
  },

  lindweiler: {
    intro: 'Lindweiler ist ein kleiner, ruhiger Stadtteil zwischen Heimersdorf und Longerich im südlichen Chorweiler Bezirk — mit 4.800 Einwohnern auf nur 1,25 Quadratkilometern überschaubar und familiär. Die S-Bahn-Nähe und solide Busanbindung machen Lindweiler zu einem ruhigen Wohnort mit vertretbaren Pendelzeiten in die Innenstadt.',
    portrait: 'Lindweiler liegt auf 1,25 Quadratkilometern zwischen Heimersdorf im Norden, Longerich im Osten und Bocklemünd/Mengenich im Süden. Das Stadtbild ist von Wohnzeilen und Einfamilienhäusern aus den 1950er bis 1970er Jahren geprägt. Der Stadtteil hat keinen ausgeprägten Ortskern; die Infrastruktur (Schulen in Longerich und Heimersdorf, Einkauf entlang der Escher Straße) ist auf die Nachbarstadtteile ausgerichtet.\n\nDie Buslinien 121 und 127 verbinden Lindweiler mit dem Chorweiler Zentrum und der S-Bahn-Station. Alternativ ist die S-Bahn über Fußwege nach Chorweiler oder Longerich erreichbar. Die Autobahn A57 liegt in der Nähe und bietet schnelle Verbindungen nach Düsseldorf und ins linksrheinische Köln.\n\nMit 3.800 €/m² liegt Lindweiler im mittleren Segment des Bezirks. Der Stadtteil spricht Familien und Eigenheimkäufer an, die im Kölner Norden eine ruhige, grüne Wohnlage suchen, ohne in die peripheren Stadtteile ausweichen zu wollen.',
  },

  pesch: {
    intro: 'Pesch ist ein familienfreundlicher Stadtteil im südlichen Chorweiler Bezirk mit rund 10.200 Einwohnern, eigener Grund- und Realschule und direkter S-Bahn-Anbindung in die Kölner Innenstadt. Romans aktuelles Referenzobjekt — ein gepflegter Bungalow für 799.000 Euro — belegt die Attraktivität der gehobenen Einfamilienhauslagen in Pesch.',
    portrait: 'Pesch liegt auf 3,15 Quadratkilometern zwischen Chorweiler im Norden, Heimersdorf im Osten, Bocklemünd/Mengenich im Süden und Lindweiler im Westen. Das Stadtbild ist vielfältig: Ältere gewachsene Siedlungen mit freistehenden Einfamilienhäusern und Bungalows aus den 1960er Jahren wechseln sich mit neueren Wohngebieten ab. Der Stadtteil hat eine eigene Versorgungsstruktur — GGS Pesch und Realschule Pesch decken beide Schulformen ab, Nahversorgung ist direkt im Ort vorhanden.\n\nDie Buslinien 122 und 127 sowie die nahegelegene S-Bahn-Station Köln-Chorweiler (S11) sorgen für eine gute ÖPNV-Anbindung; Kölner Hauptbahnhof in ca. 20 Minuten. Die A57 ist über Bocklemünd in wenigen Minuten erreichbar.\n\nMit 4.100 €/m² liegt Pesch über dem Chorweiler-Schnitt — die ausgewogene Infrastruktur und die Vielfalt des Wohnungsangebots (von der ETW bis zum Bungalow auf großem Grundstück) rechtfertigen den Aufschlag. Besonders gefragt sind großzügige Bungalow-Grundstücke der 1960er und 1970er Jahre, die in dieser Form kaum noch verfügbar sind.',
  },

  'volkhoven-weiler': {
    intro: 'Volkhoven/Weiler verbindet dörfliche Ruhe mit Rhein-Nähe im Kölner Norden — ein Doppelstadtteil mit 7.200 Einwohnern auf 4,58 Quadratkilometern, der nördlich des Ford-Werks und des Rheinufers liegt. Für Käufer, die Ruhe, Natur und eine Kölner Adresse kombinieren möchten, ist Volkhoven/Weiler eine der nördlichsten und günstigsten Optionen im Stadtgebiet.',
    portrait: 'Volkhoven/Weiler liegt im nördlichen Chorweiler Bezirk, begrenzt von Fühlingen und Merkenich im Norden, Worringen im Nordosten und Roggendorf/Thenhoven im Westen. Der Doppelstadtteil hat einen dörflichen Charakter mit altem Ortskern, von dem aus Wohnstraßen mit Einfamilienhäusern aus verschiedenen Jahrzehnten abgehen. Der Rhein ist zu Fuß oder mit dem Rad erreichbar, was den Freizeitwert deutlich erhöht.\n\nDie Schulversorgung erfolgt über Einrichtungen in den Nachbarstadtteilen Chorweiler und Worringen. Öffentlich ist Volkhoven/Weiler über den Bus 120 angebunden, der nach Chorweiler zur S-Bahn führt. Für Autofahrer bietet die A57 schnellen Anschluss an das Kölner Autobahnnetz.\n\nMit Kaufpreisen von 3.800 €/m² gehört Volkhoven/Weiler zu den günstigsten Lagen im Kölner Norden. Der Stadtteil spricht Käufer an, die bewusst das Dorf- und Rheinleben im Nordkölner Stadtgebiet wählen und auf kurze Wege zur Innenstadt verzichten können.',
  },

  blumenberg: {
    intro: 'Blumenberg ist eine moderne Neubausiedlung im südlichen Chorweiler Bezirk — mit 8.200 Einwohnern auf nur 1,85 Quadratkilometern sehr dicht besiedelt und überwiegend von jungen Familien bewohnt. Planmäßige Infrastruktur, S-Bahn-Nähe und günstige Kaufpreise machen Blumenberg zu einem soliden Einsteigermarkt im Kölner Norden.',
    portrait: 'Blumenberg entstand in den 1970er und 1980er Jahren als geplante Satellitensiedlung im Rahmen des Neuen Kölns — ein Wohnkonzept, das kompakte urbane Strukturen mit Grünflächen verbinden sollte. Das Stadtbild ist homogener als in gewachsenen Stadtteilen: Mehrfamilienhäuser, Zeilenbauten und wenige Reihenhäuser prägen das Bild. Die GGS Blumenberg versorgt den Stadtteil, die Gesamtschule Chorweiler ist fußläufig erreichbar.\n\nDie S-Bahn-Station Köln-Chorweiler (S11) ist über die Buslinien 120 und 121 oder per Rad in wenigen Minuten erreichbar. Das Chorweiler Einkaufszentrum bietet umfangreiche Nahversorgung direkt in der Nachbarschaft.\n\nMit 3.800 €/m² und einem Aufwärtstrend von +3,0 % liegt Blumenberg im unteren Mittelfeld. Die konstante Mietnachfrage durch Familien und Studenten der nahen FH Köln macht den Stadtteil für Kapitalanleger interessant, die auf stabile Mietrenditen setzen. Für Eigennutzer bietet Blumenberg modernes Wohnen zu erschwinglichen Preisen mit guter S-Bahn-Anbindung.',
  },

  heimersdorf: {
    intro: 'Heimersdorf ist eine ruhige Familiensiedlung im südlichen Chorweiler Bezirk mit rund 8.500 Einwohnern auf kompakten 1,52 Quadratkilometern. Die unmittelbare Nähe zur S-Bahn-Station Köln-Chorweiler (S11) und solide Grundschulversorgung machen Heimersdorf zu einem der am besten angebundenen kleinen Stadtteile im Kölner Norden.',
    portrait: 'Heimersdorf liegt zwischen Chorweiler im Norden, Pesch im Westen, Lindweiler im Süden und Longerich im Osten. Das Stadtbild ist von Wohnzeilen, Reihenhäusern und Mehrfamilienhäusern aus den 1960er bis 1980er Jahren geprägt — überwiegend in gepflegtem Zustand. Der Stadtteil hat keine ausgeprägte Einkaufsstraße, ist aber über kurze Fußwege an die Versorgungsstrukturen in Chorweiler und Longerich angebunden.\n\nDer S-Bahnhof Köln-Chorweiler (S11) liegt in wenigen Gehminuten oder ist über den Bus 121 erreichbar. Die Fahrtzeit in den Kölner Hauptbahnhof beträgt ca. 15–20 Minuten. Die A57 ist über Bocklemünd in wenigen Minuten erreichbar, was auch Autofahrer gut angebunden lässt.\n\nMit 4.000 €/m² liegt Heimersdorf leicht über dem Chorweiler-Durchschnitt — die sehr gute S-Bahn-Anbindung und die kompakte, ruhige Wohnlage rechtfertigen den Aufschlag. Gefragt sind Reihenhäuser mit kleinen Gärten und Bestandswohnungen, die oft unterbewertet auf den Markt kommen.',
  },

  // ═══════════════ BEZIRK 4 — EHRENFELD ═══════════════

  vogelsang: {
    intro: 'Vogelsang liegt im westlichen Ehrenfelder Bezirk auf dem Gelände einer ehemaligen NS-Ordensburg — einem historisch bedeutenden Areal, das seit den 2000er Jahren zu einem modernen Bildungs- und Begegnungszentrum (NS-Dokumentationsstätte und Sportpark) umgewandelt wurde. Mit 5.200 Einwohnern auf 1,85 Quadratkilometern ist Vogelsang ein kleiner, im Wandel begriffener Stadtteil mit Entwicklungspotenzial.',
    portrait: 'Vogelsang grenzt an Bickendorf im Norden, Bocklemünd/Mengenich im Westen, Ossendorf im Osten und Müngersdorf im Süden. Das Stadtbild ist heterogen: Neben älteren Einfamilienhausgebieten aus der Nachkriegszeit gibt es das historische Areal der NS-Ordensburg Vogelsang, das heute als NS-Dokumentationsstätte und Sportpark öffentlich zugänglich ist. Das Bildungswerk der Kölner Kirchen und verschiedene Sportvereine nutzen das weitläufige Gelände mit seinen historischen Gebäuden.\n\nDie GGS ist in den Nachbarstadtteilen Bickendorf und Ossendorf verortet; weiterführende Schulen befinden sich im Bezirkszentrum Ehrenfeld. Der Bus 143 und die nahegelegene Stadtbahn-Linie 3 (Haltestelle Bocklemünd/Mengenich) verbinden Vogelsang mit dem Kölner Netz. Die Fahrtzeit in die Kölner Innenstadt beträgt rund 20 Minuten.\n\nMit 4.300 €/m² und einem Aufwärtstrend von +3,5 % liegt Vogelsang deutlich über dem Chorweiler-Niveau und spiegelt die Zugkraft des Ehrenfelder Bezirks wider. Das historische Areal auf dem Ordensgelände schafft zudem ein einzigartiges Wohnumfeld, das Käufer anzieht, die Geschichte und Stadtentwicklung schätzen. Aufwertungspotenzial ist vorhanden, da das Gelände weiterentwickelt wird.',
  },
};

// ── File update logic ────────────────────────────────────────────────────────

function toFileEncoding(str) {
  let out = '';
  for (const ch of str) {
    const code = ch.codePointAt(0);
    if (code > 127) {
      out += '\\u' + code.toString(16).padStart(4, '0');
    } else {
      out += ch;
    }
  }
  return out;
}

let src = readFileSync(FILE, 'utf8');
let updated = 0;

for (const [slug, content] of Object.entries(UPDATES)) {
  // Find the entry by slug
  const marker = `s:'${slug}'`;
  const startIdx = src.indexOf(marker);
  if (startIdx === -1) {
    console.warn(`WARN: slug '${slug}' not found, skipping.`);
    continue;
  }

  // Find the intro field
  const introRe = /intro:'([^']*)'/;
  const portraitRe = /portrait:'([^']*)'/;

  // Get the bounds of this entry (from { before marker to next },)
  // Find the { before the marker
  let entryStart = startIdx;
  while (entryStart > 0 && src[entryStart] !== '{') entryStart--;

  // Find matching closing }
  let depth = 0, entryEnd = entryStart;
  for (let i = entryStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}') { depth--; if (depth === 0) { entryEnd = i + 1; break; } }
  }

  let entry = src.slice(entryStart, entryEnd);

  // Replace intro
  const newIntro = toFileEncoding(content.intro);
  entry = entry.replace(/intro:'[^']*'/, `intro:'${newIntro}'`);

  // Replace portrait
  const newPortrait = toFileEncoding(content.portrait);
  entry = entry.replace(/portrait:'[^']*'/, `portrait:'${newPortrait}'`);

  src = src.slice(0, entryStart) + entry + src.slice(entryEnd);
  updated++;
  console.log(`✓ ${slug}`);
}

writeFileSync(FILE, src, 'utf8');
console.log(`\nDone. Updated ${updated}/${Object.keys(UPDATES).length} entries.`);
