import { readFileSync, writeFileSync } from 'fs';

const filePath = '/home/user/fuerte-pages/roman/scripts/stadtteile-data.mjs';
let data = readFileSync(filePath, 'utf8');

const oldStart = "{n:'Marienburg'";
const startIdx = data.indexOf(oldStart);
if (startIdx === -1) { console.error('Marienburg not found'); process.exit(1); }

// Find the end of this entry: look for the closing "},\n" pattern
let braceDepth = 0;
let endIdx = startIdx;
for (let i = startIdx; i < data.length; i++) {
  if (data[i] === '{') braceDepth++;
  if (data[i] === '}') {
    braceDepth--;
    if (braceDepth === 0) {
      endIdx = i + 1; // include the closing }
      // include trailing comma if present
      if (data[endIdx] === ',') endIdx++;
      break;
    }
  }
}

const oldEntry = data.substring(startIdx, endIdx);
console.log('Old Marienburg entry length:', oldEntry.length);

const newEntry = `{n:'Marienburg',s:'marienburg',b:2,bn:'Rodenkirchen',nr:205,p:'50968',lat:50.905,lng:6.970,
 e:'5.891',fl:'2,53',au:'11,4',al:'45,6',
 intro:'Marienburg ist Kölns teuerste Adresse — und das aus gutem Grund. Prachtvolle Villen aus der Gründerzeit, der Südpark und die unmittelbare Rheinnähe machen diesen Stadtteil einzigartig. Als EVERNEST-Makler mit Zugang zu Off-Market-Objekten begleite ich Sie diskret bei Transaktionen im siebenstelligen Bereich — sprechen Sie mich vertraulich an.',
 h:'nobel, Villen, Premium',
 portrait:'Marienburg ist der teuerste und renommierteste Stadtteil Kölns. Mit rund 5.900 Einwohnern auf 2,53 km² zählt er zu den exklusivsten Wohnadressen Deutschlands. Prachtvolle Villen und Stadtpalais aus der Zeit zwischen 1900 und 1930 säumen breite, von alten Platanen gesäumte Straßen. Zahlreiche Konsulate — darunter die diplomatischen Vertretungen der Türkei, Belgiens und Japans — unterstreichen den internationalen Charakter des Viertels.</p>\\n          <p class=\"text-muted leading-relaxed mb-6\">Der 22 Hektar große Südpark bildet das grüne Herzstück Marienburgs und bietet weitläufige Spazierwege, einen Rosengarten und Spielflächen. Am westlichen Rand liegt das Geißbockheim, das Trainingsgelände des 1. FC Köln, das dem Stadtteil eine besondere sportliche Note verleiht. Die Gustav-Heinemann-Ufer-Promenade am Rhein lädt zum Flanieren ein und bietet einen der schönsten Rheinblicke der Stadt.</p>\\n          <p class=\"text-muted leading-relaxed mb-6\">Der Immobilienmarkt in Marienburg bewegt sich auf höchstem Niveau: Eigentumswohnungen erzielen durchschnittlich rund 6.900 €/m², Häuser etwa 9.300 €/m². Viele Transaktionen finden diskret über persönliche Netzwerke statt. Die Nachfrage übersteigt das Angebot dauerhaft — wer hier verkauft, erzielt regelmäßig Spitzenpreise, und wer kaufen möchte, braucht Geduld und die richtigen Kontakte.',
 mk:{e:'6.900',h:'9.300',m:'18\\u201326',t:'+2,2'},
 inf:[['Friedrich-Wilhelm-Gymnasium','Internationale Friedensschule Köln (IFK)','GGS Lindenburger Allee','Kaiserin-Augusta-Schule (nahebei)'],
      ['Elterninitiative Marienburg e.V.','Kita St. Maria vom Frieden','Montessori-Kinderhaus Marienburg','Private Kita Villa Kunterbunt'],
      ['KVB Linie 16 (Haltestelle Schönhauser Str.)','Bus 135','S-Bahn Köln-Süd (nahebei)','Individualverkehr A555/A4'],
      ['Edeka Marienburg','Nahversorgung Bayenthalgürtel','Bonner Straße','Wochenmarkt Rodenkirchen (nahebei)'],
      ['Südpark (22 ha)','Rheinufer-Promenade','Volksgarten (nahebei)','Friedenspark mit Fort X'],
      ['St. Antonius Krankenhaus','Praxisgemeinschaft Marienburg','Fachärzte Bonner Straße','Zahnärzte am Bayenthalgürtel'],
      ['Kölner Tennis- und Hockey-Club Marienburg','Kölner Ruderverein 1877','Geißbockheim (1. FC Köln)','Jogging-Strecke Südpark'],
      ['Restaurant Capricorn i Aries','Trattoria Da Damiano','Café Wahlen','Ristorante Il Carpaccio'],
      ['Geißbockheim (Trainingsgelände 1. FC Köln)','Südbrücke','Gründerzeit-Villen-Architektur','Fort X im Friedenspark','Konsulate und diplomatische Vertretungen']],
 immo:{t:['Gründerzeit-Villen auf Parkgrundstücken','Repräsentative Stadtpalais','Luxus-ETW in denkmalgeschützten Häusern','Neubauprojekte im Premium-Segment'],
   fa:'Der Südpark mit seinem Rosengarten und großzügigen Spielplätzen ist das Familienparadies Marienburgs. Exzellente Schulen wie die Internationale Friedensschule und das Friedrich-Wilhelm-Gymnasium liegen in unmittelbarer Nähe. Die ruhigen, verkehrsberuhigten Straßen und die hohe Sicherheit machen Marienburg zur ersten Wahl für Familien im Top-Segment.',
   ka:'Marienburg ist die wertstabilste Lage Kölns mit geringstem Ausfallrisiko. Transaktionen bewegen sich regelmäßig im siebenstelligen Bereich. Die extrem geringe Fluktuation und die konstant hohe Nachfrage garantieren langfristigen Werterhalt — ein sicherer Hafen für anspruchsvolle Kapitalanleger.',
   ei:'Repräsentatives Wohnen in Kölns bester Adresse: Gründerzeit-Villa mit Garten, Rheinufer-Promenade vor der Tür und der Südpark als privater Vorgarten. Marienburg bietet ein Lebensgefühl, das in Köln einzigartig ist — diskret, grün und mit internationalem Flair.'},
 nb:['bayenthal','rodenkirchen','raderberg','zollstock','hahnwald']},`;

data = data.substring(0, startIdx) + newEntry + data.substring(endIdx);
writeFileSync(filePath, data, 'utf8');
console.log('Marienburg updated successfully');
