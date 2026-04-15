import { readFileSync, writeFileSync } from 'fs';
const FILE = '/Users/danielgruederich/Documents/Claude projects/fuerte-pages/roman/scripts/stadtteile-data.mjs';
let src = readFileSync(FILE, 'utf8');

// This file uses literal \uXXXX escape sequences for non-ASCII chars.
// We need to convert our nice Unicode text to match that format.
function toFileFormat(str) {
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

// Find entry by brace matching
let startIdx = src.indexOf("{n:'Dellbr");
if (startIdx < 0) { console.error('Cannot find entry!'); process.exit(1); }
const check = src.substring(startIdx, startIdx + 40);
if (!check.includes('dellbrueck')) { console.error('Wrong entry!'); process.exit(1); }

let depth = 0, endIdx = startIdx;
for (let i = startIdx; i < src.length; i++) {
  if (src[i] === '{') depth++;
  if (src[i] === '}') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
}
console.log('Old entry length:', endIdx - startIdx);

const NEW = toFileFormat(
`{n:'Dellbrück',s:'dellbrueck',b:9,bn:'Mülheim',nr:903,p:'51069',lat:50.965,lng:7.055,
 e:'22.400',fl:'5,82',au:'11,5',al:'43,0',
 intro:'Dellbrück ist mit rund 22.400 Einwohnern der bevölkerungsreichste Stadtteil im Bezirk Mülheim und eine der gefragtesten Familienlagen im rechtsrheinischen Köln. Der historische Thurner Hof, das beliebte Freibad Dellbrück und die unmittelbare Nähe zum Dünnwalder Wald bieten Lebensqualität, die in dieser Kombination kaum ein anderer Stadtteil erreicht. Aktuell vermarkte ich hier das teuerste Objekt meines gesamten Portfolios — ein exklusives Wohnobjekt für 10.950.000 Euro, das den gehobenen Anspruch dieser Adresse eindrucksvoll unterstreicht.',
 h:'Familien, grün, gehoben',
 portrait:'Dellbrück erstreckt sich östlich der Stadtbahnlinie 3 und 4 zwischen Holweide, Höhenhaus und Brück und vereint auf 5,82 Quadratkilometern großzügige Villengrundstücke, gepflegte Einfamilienhaussiedlungen und solide Mehrfamilienhäuser. Der historische Thurner Hof — ein ehemaliges Rittergut aus dem 14. Jahrhundert, heute Bildungs- und Kulturzentrum der VHS Köln — bildet das kulturelle Herzstück. Die Dellbrücker Hauptstraße fungiert als lebendige Einkaufsmeile mit inhabergeführten Geschäften, Bäckereien und Cafés, während das Freibad Dellbrück an der Thurner Straße im Sommer zum Treffpunkt für Familien aus dem gesamten Bezirk wird.\\n\\nDie Infrastruktur ist auf Familien zugeschnitten: Die Regenbogenschule (GGS) an der Dellbrücker Hauptstraße, die KGS Dellbrück an der Thurner Straße und die Gesamtschule am Dellbrücker Mauspfad mit gymnasialer Oberstufe decken alle Schulformen ab. Mehrere Kitas — darunter das SKM-Familienzentrum und die katholische Kindertagesstätte St. Norbert — sorgen für verlässliche Betreuung. Die Stadtbahn-Haltestellen der Linien 3 und 4 bringen Pendler in rund 25 Minuten in die Innenstadt, ergänzt durch die S-Bahn-Station Dellbrück (S11) und die Buslinien 154 und 155. REWE an der Hatzfeldstraße und Lidl an der Wasserwerkstraße sichern die tägliche Nahversorgung.\\n\\nDie Dellbrücker Heide und der angrenzende Dünnwalder Wald bieten Hektar um Hektar unberührter Natur für Spaziergänger, Jogger und Radfahrer. Der TV Dellbrück 1895 mit seinen Sportanlagen, das nahe Waldbad Dünnwald und zahlreiche Spielplätze runden das Freizeitangebot ab. Gastronomisch überzeugen das Brauhaus Dellbrück an der Dellbrücker Hauptstraße 61 mit kölscher Küche, das Restaurant Art India mit gehobener indischer Küche und die Diepeschrather Mühle mit ihrem Biergarten im Grünen. Der Immobilienmarkt bewegt sich bei durchschnittlich 4.800 Euro pro Quadratmeter für Eigentumswohnungen — mit klarem Aufwärtstrend dank der exzellenten Familieninfrastruktur und dem knappen Angebot an hochwertigen Bestandsimmobilien.',
 mk:{e:'4.800',h:'4.600',m:'12–16',t:'+3,5'},
 refs:[{t:'Exklusives Wohnen · 10.950.000 €',p:'Aktuell'}],
 inf:[['Regenbogenschule GGS (Dellbrücker Hauptstr.)','KGS Dellbrück (Thurner Str.)','Gesamtschule Dellbrücker Mauspfad (mit gym. Oberstufe)','Ev. Grundschule Dellbrück'],
      ['SKM-Familienzentrum Dellbrück','Kath. Kita St. Norbert','Städt. Tageseinrichtung Dellbrück','Kita Waldwichtel (Dünnwald, nahebei)'],
      ['Stadtbahn 3, 4 (Haltestelle Dellbrück Bf.)','S-Bahn Dellbrück (S11)','Bus 154, 155','A4-Anschluss Dellbrück (nahebei)'],
      ['REWE Hatzfeldstr. 14a','Lidl Wasserwerkstr. 8','Aldi Dellbrücker Hauptstr.','Dellbrücker Hauptstraße (inhabergeführte Geschäfte, Bäckereien)'],
      ['Thurner Hof (historisches Rittergut, VHS-Lehrgarten)','Freibad Dellbrück (Thurner Str.)','Dellbrücker Heide (Naturschutzgebiet)','Dünnwalder Wald (angrenzend)'],
      ['Ärztezentrum Dellbrück (Allgemeinmedizin, Zahnärzte)','Krankenhaus Holweide (nahebei)','Apotheke am Markt'],
      ['TV Dellbrück 1895 e.V. (Fußball, Tennis, Turnen)','Waldbad Dünnwald (Freibad, Beachvolleyball)','Schützenverein Dellbrück','Reiterhof Dellbrücker Heide'],
      ['Brauhaus Dellbrück (Dellbrücker Hauptstr. 61)','Art India (gehobene indische Küche)','Diepeschrather Mühle (Biergarten)','Eiscafé Dolomiti','Bäckerei Oebel'],
      ['Thurner Hof (Rittergut, 14. Jh.)','Dellbrücker Heide (Naturschutzgebiet)','Dellbrücker Hauptstraße (historischer Ortskern)','Ev. Kirche Dellbrück']],
 immo:{t:['Villen in Parkrandlage','Einfamilienhäuser mit Garten','Doppelhaushälften','Mehrfamilienhäuser als Kapitalanlage','Exklusive Neubauprojekte'],
   fa:'Freibad, Thurner Hof, Dünnwalder Wald direkt vor der Tür — Dellbrück bietet Familien ein Rundum-Paradies mit Schulen aller Schulformen und verlässlicher Kita-Betreuung.',
   ka:'Gehobene rechtsrheinische Lage mit stabiler Nachfrage und Aufwärtstrend. Aktuell vermarkte ich hier ein Objekt im achtstelligen Bereich — ein Beleg für das exklusive Potenzial.',
   ei:'Familienleben im Grünen mit historischem Charme: Thurner Hof, Freibad und Waldnähe machen Dellbrück zur ersten Adresse rechtsrheinisch.'},
 nb:['holweide','hoehenhaus','duennwald','brueck','merheim','buchheim']}`
);

src = src.substring(0, startIdx) + NEW + src.substring(endIdx);
writeFileSync(FILE, src, 'utf8');
console.log('Dellbrück updated successfully.');
