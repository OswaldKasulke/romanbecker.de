import { readFileSync, writeFileSync } from 'fs';
const FILE = '/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/scripts/stadtteile-data.mjs';
let src = readFileSync(FILE, 'utf8');

const OLD = `{n:'Neuehrenfeld',s:'neuehrenfeld',b:4,bn:'Ehrenfeld',nr:404,p:'50823',lat:50.955,lng:6.925,
 e:'20.100',fl:'1,63',au:'20,5',al:'39,8',
 intro:'Neuehrenfeld liegt zwischen Ehrenfeld und Nippes — ein kompakter Stadtteil mit wachsender Beliebtheit, guter Anbindung und authentischem Veedel-Charakter. Hier habe ich bereits eine Eigentumswohnung erfolgreich vermittelt.',
 h:'aufstrebend, kompakt, authentisch',portrait:'Neuehrenfeld verbindet Ehrenfelds Kreativität mit Nippes Bodenständigkeit. Der Stadtteil ist kompakt, gut angebunden und bietet eine Mischung aus Altbau und Nachkriegsbebauung. Die Äußere Kanalstraße und die Subbelrather Straße sind die Hauptachsen.',
 mk:{e:'4.800',h:'4.400',m:'13–17',t:'+3,8'},
 refs:[{t:'Moderne, helle ETW in Neuehrenfeld · 270.000 €',p:'Verkauft'}],
 inf:[['GGS Neuehrenfeld','Leonardo-da-Vinci-Gymnasium (nah)'],['Kita Neuehrenfeld','Städt. Kita'],['Linie 5, 13','Bus 140','Gürtel-Anbindung'],['Subbelrather Str.','REWE','Nahversorger'],['Blücherpark (nah)','Innerer Grüngürtel'],['Praxen Subbelrather Str.'],['FitX (nah)','Sportverein'],['Cafés Subbelrather Str.','Kneipen'],['Gürtel-Architektur','Subbelrather Str.']],
 immo:{t:['Altbau-ETW','Nachkriegsbau-ETW','Sanierungsobjekte','Neubauprojekte'],fa:'Kompaktes Veedel mit kurzen Wegen — Kitas, Schulen und Parks in Laufnähe.',ka:'Aufstrebende Lage zwischen Ehrenfeld und Nippes mit gutem Preis-Leistungs-Verhältnis.',ei:'Authentisches Kölner Veedel — urban, bezahlbar, gut angebunden.'},
 nb:['ehrenfeld','nippes','bilderstoeckchen','neustadt-nord','bickendorf']}`;

const NEW = `{n:'Neuehrenfeld',s:'neuehrenfeld',b:4,bn:'Ehrenfeld',nr:404,p:'50823',lat:50.955,lng:6.925,
 e:'20.100',fl:'1,63',au:'20,5',al:'39,8',
 intro:'Neuehrenfeld liegt als kompakter Stadtteil mit rund 20.100 Einwohnern genau zwischen Ehrenfeld und Nippes — zwei der beliebtesten Veedel Kölns. Die Subbelrather Straße als zentrale Achse, die hervorragende Anbindung über die KVB-Linien 5 und 13 sowie die Nähe zum Blücherpark machen Neuehrenfeld zu einem authentischen Kölner Quartier mit wachsender Beliebtheit bei jungen Familien und Investoren. Hier habe ich bereits eine moderne, helle Eigentumswohnung für 270.000 Euro erfolgreich verkauft — ein typisches Objekt für diesen aufstrebenden Markt.',
 h:'aufstrebend, kompakt, authentisch',
 portrait:'Neuehrenfeld erstreckt sich auf nur 1,63 Quadratkilometern zwischen der Äußeren Kanalstraße im Osten, der Subbelrather Straße im Norden und der Inneren Kanalstraße im Süden. Der Stadtteil verbindet die kreative Energie Ehrenfelds mit der bodenständigen Nachbarschaftskultur von Nippes. Die Bebauung ist geprägt von einer Mischung aus Gründerzeit-Altbauten mit hohen Decken und Stuck entlang der Seitenstraßen, soliden Nachkriegsbauten der 1950er- und 60er-Jahre sowie vereinzelten modernen Neubauprojekten. Die Subbelrather Straße bildet mit ihren Geschäften, Cafés und Restaurants das Rückgrat der lokalen Nahversorgung und des gesellschaftlichen Lebens.\n\nDie GGS Everhardstraße und die GGS Nussbaumerstraße versorgen den Stadtteil als Grundschulen, das Leonardo-da-Vinci-Gymnasium an der Blücherstraße liegt nur wenige Gehminuten entfernt. Für Kleinkinder bieten die Städtische Kita Neuehrenfeld, die Kita Blücherstraße und die Kindertagesstätte der AWO verlässliche Betreuungsplätze. Die KVB-Linien 5 und 13 an der Subbelrather Straße und der Äußeren Kanalstraße verbinden Neuehrenfeld in wenigen Minuten mit dem Hauptbahnhof, dem Mediapark und Ehrenfeld. Der Bus 140 ergänzt das Netz Richtung Nippes und Riehl, der Gürtel als Schnellachse ist fußläufig erreichbar.\n\nDer Blücherpark — nur wenige hundert Meter westlich — bietet mit seinem alten Baumbestand, dem Teich und den großzügigen Wiesenflächen das wichtigste Naherholungsgebiet. Der Innere Grüngürtel entlang der Inneren Kanalstraße ergänzt das Grünangebot. Gastronomisch hat sich die Subbelrather Straße in den letzten Jahren stark entwickelt: Das Café Jakubowski, die Pizzeria Mamma Mia, das Weinlokal Tobias Becker Wein und diverse Imbisse schaffen eine lebendige Ausgehkultur. Der Immobilienmarkt liegt bei durchschnittlich 4.800 Euro pro Quadratmeter und profitiert von einer Aufwärtsdynamik von 3,8 Prozent — getrieben durch die zentrale Lage, die Veedel-Atmosphäre und die im Vergleich zu Ehrenfeld und Nippes noch moderaten Einstiegspreise.',
 mk:{e:'4.800',h:'4.400',m:'13–17',t:'+3,8'},
 refs:[{t:'Moderne, helle ETW in Neuehrenfeld · 270.000 €',p:'Verkauft'}],
 inf:[['GGS Everhardstraße','GGS Nussbaumerstraße','Leonardo-da-Vinci-Gymnasium (Blücherstr., nahebei)','Gesamtschule Ehrenfeld (nahebei)'],
      ['Städt. Kita Neuehrenfeld','Kita Blücherstraße','AWO Kindertagesstätte Neuehrenfeld','Tagespflege Siemensstraße'],
      ['KVB Linie 5 (Subbelrather Str.)','KVB Linie 13 (Äußere Kanalstr.)','Bus 140 (Richtung Nippes/Riehl)','Gürtel-Anbindung (A57 nahebei)'],
      ['REWE Subbelrather Str.','Aldi Äußere Kanalstr.','Bäckerei Zimmermann','Wochenmarkt Liebigstraße','Apotheke Neuehrenfeld'],
      ['Blücherpark (alter Baumbestand, Teich, Spielplätze)','Innerer Grüngürtel (Innere Kanalstr.)','Stadtgarten (nahebei)'],
      ['Hausarztpraxis Subbelrather Str.','Zahnarztpraxis Neuehrenfeld','Apotheke Lenauplatz','Kinderkrankenhaus Amsterdamer Str. (nahebei)'],
      ['FitX Ehrenfeld (nahebei)','SC Viktoria Köln (Sportpark Höhenberg, nahebei)','Blücherpark (Joggen, Fitness)','Bezirkssportanlage Lenauplatz'],
      ['Café Jakubowski (Subbelrather Str.)','Pizzeria Mamma Mia','Tobias Becker Wein (Weinbar)','Laden Ein (Café & Bar)','Bistro Lenauplatz'],
      ['Gürtel-Architektur (Innere Kanalstraße)','Subbelrather Straße (Geschäftsstraße)','Blücherpark (Gartendenkmalpflege)','Wasserturm Ehrenfeld (nahebei)']],
 immo:{t:['Altbau-ETW mit Stuck und hohen Decken','Nachkriegsbau-ETW (saniert)','Sanierungsobjekte mit Potenzial','Neubauprojekte','Kapitalanlage-Apartments'],
   fa:'Kompaktes Veedel mit kurzen Wegen zu Grundschulen, Kitas und dem Blücherpark — Neuehrenfeld bietet Familien authentisches Stadtleben ohne Hektik.',
   ka:'Aufstrebende Lage zwischen Ehrenfeld und Nippes mit 3,8 % Preistrend. Noch moderate Einstiegspreise bei starker Nachfrage — idealer Zeitpunkt für Kapitalanleger.',
   ei:'Authentisches Kölner Veedel mit Viertel-Charakter: Subbelrather Straße, Blücherpark-Nähe und urbane Lebensqualität zum fairen Preis.'},
 nb:['ehrenfeld','nippes','bilderstoeckchen','neustadt-nord','bickendorf']}`;

if (!src.includes(OLD)) {
  console.error('OLD string not found in file!');
  process.exit(1);
}
src = src.replace(OLD, NEW);
writeFileSync(FILE, src, 'utf8');
console.log('Neuehrenfeld updated successfully.');
