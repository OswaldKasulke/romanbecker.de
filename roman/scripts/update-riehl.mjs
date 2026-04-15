import { readFileSync, writeFileSync } from 'fs';
const FILE = '/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/scripts/stadtteile-data.mjs';
let src = readFileSync(FILE, 'utf8');

const OLD = `{n:'Riehl',s:'riehl',b:5,bn:'Nippes',nr:506,p:'50735',lat:50.960,lng:6.965,
 e:'11.267',fl:'2,83',au:'17,9',al:'43,8',
 intro:'Zwischen Kölner Zoo, Flora und Rheinpark liegt Riehl — ein Stadtteil, der Grün und City wie kaum ein anderer verbindet. Die Rheinlage, die kulturellen Einrichtungen und die sehr gute ÖPNV-Anbindung machen Riehl zu einer der unterschätztesten Wohnadressen Kölns. Hier habe ich bereits erfolgreich eine Eigentumswohnung im Colonia Haus vermittelt.',
 h:'Zoo, Flora, Rheinpark',
 portrait:'Riehl liegt zwischen dem Rhein im Osten und der Riehler Straße im Westen. Der Stadtteil beherbergt den Kölner Zoo, die Flora (Botanischer Garten) und den Rheinpark — drei der beliebtesten Naherholungsziele Kölns. Die Riehler Heimstätten, eine große Wohnsiedlung der GAG, prägen Teile des Stadtbildes. Entlang des Rheinufers und rund um den Zoo finden sich gehobene Wohnlagen mit Altbauten und vereinzelten Neubauprojekten. Die Seilbahn über den Rhein verbindet Riehl mit dem Jugendpark in Deutz.',
 mk:{e:'5.000',h:'4.700',m:'13–17',t:'+3,6'},
 refs:[{t:'Eigentum im Colonia Haus · 399.000 €',p:'Aktuell'}],
 inf:[['GGS Am Pistorhof','Heinrich-Mann-Gymnasium','Gesamtschule Nippes'],
      ['Städt. Kita Riehl','Kita Flora','Zoo-Kindergarten'],
      ['KVB Linie 18','Straßenbahn Zoo/Flora','Bus 140','Seilbahn Rheinpark'],
      ['REWE Riehl','Riehler Straße (Nahversorgung)','Wochenmarkt Riehl'],
      ['Rheinpark','Flora (Botanischer Garten)','Kölner Zoo','Rheinufer-Promenade'],
      ['Riehler Hausarztpraxen','Kinderkrankenhaus Amsterdamer Straße (nahebei)'],
      ['Rheinpark (Joggen, Fitness)','Kölner Ruderverein','Rheinschwimmen'],
      ['Biergarten im Rheinpark','Café Flora','Restaurant am Zoo'],
      ['Kölner Zoo','Flora & Botanischer Garten','Kölner Seilbahn','Rheinpark (Skulpturen)']],
 immo:{t:['Altbau-ETW in Zoo-Nähe','Eigentumswohnungen mit Rheinblick','Neubauwohnungen am Rheinpark','Apartments im Colonia-Haus'],
   fa:'Zoo, Flora und Rheinpark direkt vor der Tür — Riehl bietet Familien mit Kindern ein Freizeitparadies im Grünen, mitten in der Stadt.',
   ka:'Rheinlage und kulturelle Einrichtungen sichern stabile Nachfrage. Der Rheinpark-Korridor zählt zu den wertstabilsten Lagen im Kölner Norden.',
   ei:'Wohnen zwischen Zoo und Rhein: Grüner geht es kaum — und trotzdem ist die Innenstadt in zehn Minuten erreichbar.'},
 nb:['altstadt-nord','neustadt-nord','nippes','mauenheim','niehl','neuehrenfeld']}`;

const NEW = `{n:'Riehl',s:'riehl',b:5,bn:'Nippes',nr:506,p:'50735',lat:50.960,lng:6.965,
 e:'11.267',fl:'2,83',au:'17,9',al:'43,8',
 intro:'Riehl vereint auf nur 2,83 Quadratkilometern drei der beliebtesten Ausflugsziele Kölns — den Kölner Zoo, die Flora mit dem Botanischen Garten und den weitläufigen Rheinpark. Mit rund 10.000 Einwohnern ist der Stadtteil im Bezirk Nippes überschaubar, doch die einzigartige Mischung aus Rheinlage, kultureller Dichte und hervorragender ÖPNV-Anbindung über die Stadtbahn 18 macht Riehl zu einer der unterschätztesten Wohnadressen Kölns. Hier habe ich bereits erfolgreich eine Eigentumswohnung im legendären Colonia-Hochhaus vermittelt — dem mit 45 Stockwerken höchsten Wohnhaus Deutschlands.',
 h:'Zoo, Flora, Rheinpark',
 portrait:'Riehl erstreckt sich zwischen dem Rheinufer im Osten und der Riehler Straße im Westen, begrenzt von Niehl im Norden und der Neustadt-Nord im Süden. Das Stadtviertel ist untrennbar mit seinen drei großen Attraktionen verbunden: Der 1860 gegründete Kölner Zoo zählt zu den ältesten und artenreichsten Tierparks Europas, die Flora mit dem Botanischen Garten bietet auf 11,5 Hektar eine einzigartige Pflanzenvielfalt, und der Rheinpark — 1957 zur Bundesgartenschau angelegt — lädt mit seinen Skulpturen, Spielplätzen und Wiesen zum Verweilen ein. Die Kölner Seilbahn verbindet seit 1957 das Riehler Rheinufer mit dem rechtsrheinischen Jugendpark und bietet dabei einen spektakulären Blick auf den Dom und die Skyline.\n\nEntlang der Stammheimer Straße und rund um den Zoo finden sich attraktive Altbauten aus der Gründerzeit und den 1920er-Jahren, während die Riehler Heimstätten — eine großflächige Wohnsiedlung der GAG Immobilien AG — den sozialen Wohnungsbau repräsentieren. Das Colonia-Hochhaus an der Riehler Straße mit seinen 45 Stockwerken ist ein architektonisches Wahrzeichen und bietet Panoramawohnungen mit unverbautem Rheinblick. Die GGS Am Pistorhof versorgt als Grundschule den Stadtteil, das Heinrich-Mann-Gymnasium und die Gesamtschule Nippes liegen in unmittelbarer Nähe. Für die Kleinsten stehen die Städtische Kita Riehl, die Kita am Botanischen Garten und der Montessori-Kindergarten zur Verfügung.\n\nDie Stadtbahn-Linie 18 verbindet Riehl über die Haltestellen Zoo/Flora und Boltensternstraße in wenigen Minuten mit dem Hauptbahnhof und Klettenberg. Entlang der Riehler Straße bieten REWE, Bäckereien und Apotheken die tägliche Nahversorgung, der Wochenmarkt am Stammheimer Platz ergänzt das Angebot. Gastronomisch besticht der Biergarten im Rheinpark, das traditionsreiche Café in der Flora und das Restaurant Herbertz am Zoo mit rheinischer Küche. Der Immobilienmarkt liegt bei durchschnittlich 5.000 Euro pro Quadratmeter — angesichts der einzigartigen Kombination aus Rheinlage, Grünflächen und Innenstadtnähe ein Niveau, das erfahrungsgemäß sehr wertstabil ist.',
 mk:{e:'5.000',h:'4.700',m:'13–17',t:'+3,6'},
 refs:[{t:'Eigentum im Colonia Haus · 399.000 €',p:'Aktuell'}],
 inf:[['GGS Am Pistorhof (Stammheimer Str.)','Heinrich-Mann-Gymnasium (nahebei)','Gesamtschule Nippes (nahebei)','Montessori-Grundschule Gilbachstraße (nahebei)'],
      ['Städt. Kita Riehl','Kita am Botanischen Garten','Montessori-Kindergarten Riehl','AWO Kindertagesstätte Boltensternstraße'],
      ['Stadtbahn 18 (Zoo/Flora, Boltensternstraße)','Bus 140 (Riehler Gürtel)','Kölner Seilbahn (Rheinpark–Deutz)','A1/A57-Anschluss Niehl (nahebei)'],
      ['REWE Riehler Straße','Bäckerei Merzenich','Wochenmarkt Stammheimer Platz','Apotheke am Zoo'],
      ['Rheinpark (40 ha, Skulpturen, Spielplätze)','Flora & Botanischer Garten (11,5 ha)','Kölner Zoo (20 ha)','Rheinufer-Promenade','Jugendpark (rechtsrheinisch via Seilbahn)'],
      ['Hausarztpraxen Riehler Straße','Kinderkrankenhaus Amsterdamer Straße (nahebei)','Zahnarztpraxis Riehl'],
      ['Rheinpark (Joggen, Fitness, Calisthenics)','Kölner Ruderverein am Rheinufer','Sportanlage Boltensternstraße','Schwimmbad Lentpark (nahebei)'],
      ['Biergarten im Rheinpark','Café in der Flora','Restaurant Herbertz am Zoo','Pizzeria La Rustica (Riehler Str.)','Eiscafé Riehl'],
      ['Kölner Zoo (seit 1860)','Flora & Botanischer Garten','Kölner Seilbahn (seit 1957)','Rheinpark (Bundesgartenschau 1957)','Colonia-Hochhaus (höchstes Wohnhaus Deutschlands)']],
 immo:{t:['Altbau-ETW in Zoo-Nähe','Eigentumswohnungen mit Rheinblick','Panorama-Apartments im Colonia-Haus','Neubauwohnungen am Rheinpark','Kapitalanlage-Apartments (Studentennachfrage)'],
   fa:'Zoo, Flora und Rheinpark direkt vor der Haustür — Riehl bietet Familien ein einzigartiges Freizeitparadies im Grünen, nur zehn Minuten von der Innenstadt entfernt.',
   ka:'Rheinlage, kulturelle Attraktionen und architektonische Wahrzeichen wie das Colonia-Haus sichern stabile Nachfrage. Der Rheinpark-Korridor zählt zu den wertstabilsten Lagen im gesamten Kölner Norden.',
   ei:'Wohnen zwischen Zoo und Rhein — mit Dom-Panorama von der Seilbahn und der Flora als Vorgarten: Grüner und zentraler geht es in Köln kaum.'},
 nb:['altstadt-nord','neustadt-nord','nippes','mauenheim','niehl','neuehrenfeld']}`;

if (!src.includes(OLD)) {
  console.error('OLD string not found in file!');
  process.exit(1);
}
src = src.replace(OLD, NEW);
writeFileSync(FILE, src, 'utf8');
console.log('Riehl updated successfully.');
