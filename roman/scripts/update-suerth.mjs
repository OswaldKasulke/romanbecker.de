import { readFileSync, writeFileSync } from 'fs';
const FILE = '/home/user/fuerte-pages/roman/scripts/stadtteile-data.mjs';
let src = readFileSync(FILE, 'utf8');

const OLD = `{n:'Sürth',s:'suerth',b:2,bn:'Rodenkirchen',nr:211,p:'50999',lat:50.875,lng:7.000,
 e:'8.234',fl:'4,52',au:'9,8',al:'46,3',
 intro:'Sürth am Rhein verbindet Dorfcharakter mit gehobener Wohnlage. Rheinpromenade, historischer Ortskern und exzellente Naturanbindung machen den Stadtteil zu einem der schönsten Veedel im Kölner Süden. Hier habe ich bereits eine Immobilie erfolgreich vermittelt.',
 h:'Rheinlage, dörflich, gehoben',
 portrait:'Sürth liegt direkt am Rhein südlich von Rodenkirchen und hat einen der schönsten historischen Ortskerne im Kölner Süden. Die Sürther Hauptstraße mit ihren Fachwerkhäusern, die romanische Kirche St. Remigius und die Rheinpromenade prägen das Bild. Der Sürther Aue — ein Naturschutzgebiet direkt am Rhein — ist ein einzigartiges Naherholungsgebiet. Sürth zieht vor allem gut situierte Familien an, die Natur und Rheinlage schätzen.',
 mk:{e:'5.200',h:'5.000',m:'13–17',t:'+2,8'},
 refs:[{t:'Charmante Einzimmerwohnung mit Terrasse · 105.000 €',p:'Verkauft'}],
 inf:[['GGS Sürth','Gymnasium Rodenkirchen (nahebei)','Gesamtschule Rodenkirchen'],
      ['Kath. Kita St. Remigius','Ev. Kita Sürth'],
      ['S-Bahn Sürth (S19)','Bus 131','Rheinfähre Langel (saisonal)'],
      ['Nahversorger Sürther Hauptstraße','REWE Sürth'],
      ['Sürther Aue (Naturschutzgebiet)','Rheinufer-Promenade','Forstbotanischer Garten (nahebei)'],
      ['Hausärzte Sürth','Apotheke Sürth'],
      ['SV Sürth','Wassersport am Rhein','Ruderverein'],
      ['Gasthaus Zur Alten Post','Eiscafé am Rhein','Biergarten Sürth'],
      ['St. Remigius (romanisch)','Historischer Ortskern','Sürther Aue','Fachwerkhäuser']],
 immo:{t:['Einfamilienhäuser mit Rheinblick','Altbau-ETW im Ortskern','Villen in Rheinlage','Grundstücke'],
   fa:'Rhein, Natur, Dorfidylle und trotzdem Kölner Stadtgebiet — Sürth ist perfekt für Familien, die Platz und Grün suchen.',
   ka:'Gehobene Lage mit stabilen Werten. Einfamilienhäuser in Rheinlage sind besonders nachgefragt.',
   ei:'Wohnen am Rhein mit Dorfcharakter: historischer Ortskern, Sürther Aue und rheinische Lebensart.'},
 nb:['rodenkirchen','weiss','godorf','hahnwald']}`;

const NEW = `{n:'Sürth',s:'suerth',b:2,bn:'Rodenkirchen',nr:211,p:'50999',lat:50.875,lng:7.000,
 e:'8.234',fl:'4,52',au:'9,8',al:'46,3',
 intro:'Sürth ist eines der malerischsten Rheindörfer im Kölner Süden — mit rund 8.200 Einwohnern, historischem Ortskern und direkter Rheinlage bietet der Stadtteil im Bezirk Rodenkirchen eine Wohnqualität, die ihresgleichen sucht. Die Sürther Hauptstraße mit ihren Fachwerkhäusern, die romanische Kirche St. Remigius und das Naturschutzgebiet Sürther Aue unmittelbar am Rheinufer vereinen Dorfcharakter mit gehobener Wohnkultur. Hier habe ich bereits eine charmante Einzimmerwohnung mit Terrasse für 105.000 Euro erfolgreich vermittelt — ein Einstieg in einen Markt, der bei durchschnittlich 5.200 Euro pro Quadratmeter liegt.',
 h:'Rheinlage, dörflich, gehoben',
 portrait:'Sürth erstreckt sich auf 4,52 Quadratkilometern am linken Rheinufer südlich von Rodenkirchen und Weiß. Der historische Ortskern entlang der Sürther Hauptstraße gehört zu den besterhaltenen im gesamten Kölner Stadtgebiet: Liebevoll restaurierte Fachwerkhäuser aus dem 17. und 18. Jahrhundert, die romanische Pfarrkirche St. Remigius — deren Ursprünge bis ins 12. Jahrhundert zurückreichen — und verwinkelte Gassen mit altem Kopfsteinpflaster schaffen eine Atmosphäre, die eher an ein niederrheinisches Dorf erinnert als an einen Kölner Stadtteil. Die Wohnbebauung umfasst großzügige Einfamilienhäuser und Villen in den ruhigen Seitenstraßen Richtung Rhein sowie gepflegte Mehrfamilienhäuser entlang der Verbindungsachsen.\n\nDie GGS Sürth an der Sürther Straße ist die wohnortnahe Grundschule, das Gymnasium Rodenkirchen und die Gesamtschule Rodenkirchen sind mit der S-Bahn oder dem Rad schnell erreichbar. Die Katholische Kindertagesstätte St. Remigius, die Evangelische Kita Sürth und die Elterninitiative Rheinpiraten bieten Betreuungsplätze für die Jüngsten. Die S-Bahn-Station Sürth an der Linie S19 verbindet den Stadtteil über Rodenkirchen und Köln Süd mit dem Hauptbahnhof in etwa 20 Minuten, der Bus 131 fährt nach Godorf und Wesseling. In der warmen Jahreszeit ergänzt die historische Rheinfähre Langel-Hitdorf das Verkehrsangebot. Nahversorger an der Sürther Hauptstraße, ein REWE-Markt und der Bäcker Mauel sichern den täglichen Bedarf.\n\nDas Naturschutzgebiet Sürther Aue ist das Juwel des Stadtteils: Über 60 Hektar Auenlandschaft direkt am Rheinufer bieten Lebensraum für seltene Vogelarten und laden zu ausgedehnten Spaziergängen und Radtouren ein. Die Rheinufer-Promenade, der nahe Forstbotanische Garten Rodenkirchen und der Friedenswald ergänzen das Grünangebot. Der SV Sürth bietet Fußball und Breitensport, Ruder- und Kanuvereine nutzen den direkten Rheinzugang. Gastronomisch begeistert das traditionsreiche Gasthaus Zur Alten Post mit rheinischer Küche im historischen Ambiente, das Ristorante Da Damiano mit italienischer Küche, und im Sommer laden Biergärten am Rhein zum Verweilen ein. Der Immobilienmarkt ist mit 5.200 Euro pro Quadratmeter einer der teuersten im Kölner Süden — die Kombination aus Rheinlage, Naturschutzgebiet und dörflichem Charme macht Sürth zur Premiumumadresse für Käufer mit Anspruch.',
 mk:{e:'5.200',h:'5.000',m:'13–17',t:'+2,8'},
 refs:[{t:'Charmante Einzimmerwohnung mit Terrasse · 105.000 €',p:'Verkauft'}],
 inf:[['GGS Sürth (Sürther Str.)','Gymnasium Rodenkirchen (nahebei)','Gesamtschule Rodenkirchen (nahebei)','Montessori-Grundschule Gilbachstr. (Innenstadt)'],
      ['Kath. Kita St. Remigius','Ev. Kita Sürth','Elterninitiative Rheinpiraten','Tagespflege Sürth'],
      ['S-Bahn Sürth (S19, Richtung Hbf/Hennef)','Bus 131 (Godorf/Wesseling)','Rheinfähre Langel-Hitdorf (saisonal)','Radschnellweg Rheinufer'],
      ['REWE Sürth','Nahversorger Sürther Hauptstraße','Bäckerei Mauel','Apotheke Sürth','Sparkasse Sürth'],
      ['Sürther Aue (60+ ha Naturschutzgebiet am Rhein)','Rheinufer-Promenade','Forstbotanischer Garten Rodenkirchen (nahebei)','Friedenswald (nahebei)'],
      ['Hausarztpraxis Sürth','Zahnarztpraxis Sürther Hauptstr.','Apotheke Sürth','St.-Antonius-Krankenhaus Bayenthal (nahebei)'],
      ['SV Sürth (Fußball, Breitensport)','Ruderverein Sürth','Kanuverein am Rhein','Radfahren Rheinufer','Reitsport (Sürther Feld)'],
      ['Gasthaus Zur Alten Post (rheinische Küche)','Ristorante Da Damiano (italienisch)','Eiscafé am Rhein','Biergarten Sürther Bootshaus','Bäckerei-Café Mauel'],
      ['St. Remigius (romanische Pfarrkirche, 12. Jh.)','Historischer Ortskern (Fachwerkhäuser, 17./18. Jh.)','Sürther Aue (Naturschutzgebiet)','Wegekreuze und Bildstöcke','Rheinpromenade']],
 immo:{t:['Einfamilienhäuser mit Rheinblick','Villen in Rheinlage','Altbau-ETW im historischen Ortskern','Fachwerkhäuser (saniert)','Grundstücke in Feldrandlage'],
   fa:'Rhein, Sürther Aue, historischer Ortskern und Dorfidylle — Sürth bietet Familien Platz, Natur und eine eingeschworene Gemeinschaft im Kölner Süden.',
   ka:'Premium-Lage am Rhein mit stabilen Werten und begrenztem Angebot. Einfamilienhäuser in Rheinlage sind besonders begehrt und selten am Markt.',
   ei:'Wohnen am Rhein mit echtem Dorfcharakter: historische Fachwerkhäuser, romanische Kirche und Naturschutzgebiet direkt vor der Haustür.'},
 nb:['rodenkirchen','weiss','godorf','hahnwald']}`;

if (!src.includes(OLD)) {
  console.error('OLD string not found in file!');
  process.exit(1);
}
src = src.replace(OLD, NEW);
writeFileSync(FILE, src, 'utf8');
console.log('Sürth updated successfully.');
