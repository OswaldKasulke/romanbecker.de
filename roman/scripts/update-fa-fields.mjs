/**
 * update-fa-fields.mjs
 * Updates immo.fa (Familien-FAQ answer) for 21 thin Stadtteil pages.
 * Replaces 1-sentence placeholders with 2-3 specific sentences
 * referencing real schools, Kitas, and local amenities.
 * Run once: node roman/scripts/update-fa-fields.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, 'stadtteile-data.mjs');

function toEnc(str) {
  let out = '';
  for (const ch of str) {
    const code = ch.codePointAt(0);
    if (code > 127) out += '\\u' + code.toString(16).padStart(4, '0');
    else out += ch;
  }
  return out;
}

// New immo.fa values — 2-3 sentences with specific schools, Kitas, ÖPNV
const FA_UPDATES = {

  // ── BEZIRK 7 PORZ ──────────────────────────────────────────────────────────

  elsdorf:
    'Für Familien ist Elsdorf vor allem wegen der großen Gärten, niedrigen Kaufpreise und der absoluten Ruhe attraktiv. ' +
    'Grundschulen befinden sich in den Nachbarstadtteilen Urbach und Lind, die über den Bus 152 erreichbar sind; eine Kita ist im Stadtteil vorhanden. ' +
    'Wer Dorfatmosphäre und günstige Einstiegspreise dem städtischen Komfort vorzieht, findet in Elsdorf eine der ruhigsten Familienwohnlagen im Kölner Stadtgebiet.',

  eil:
    'Eil bietet Familien eine eigene Grundschule (GGS Eil) und eine Kita direkt im Stadtteil — kurze Schulwege sind damit gesichert. ' +
    'Ruhige Wohnstraßen mit Einfamilienhäusern und Gärten schaffen ein sicheres Wohnumfeld für Kinder; die A59 ermöglicht Pendlern schnelle Verbindungen in die Innenstadt und nach Bonn. ' +
    'Weiterführende Schulen, Arztpraxen und Einkaufsmöglichkeiten sind im nahegelegenen Porzer Zentrum erreichbar.',

  lind:
    'Lind hat eine eigene Grundschule (GGS Lind) und eine Kita im Stadtteil. ' +
    'Die ruhige Einfamilienhausstruktur mit großen Gärten und die A59-Anbindung machen Lind besonders für Familien attraktiv, die günstig im Grünen wohnen und dennoch gut erreichbar sein möchten. ' +
    'Weiterführende Schulen und die vollständige Nahversorgung befinden sich in Urbach oder Porz.',

  libur:
    'Libur eignet sich für Familien, die bewusst Dorfatmosphäre und direkte Naturlage suchen: Das Naturschutzgebiet Wahner Heide liegt fußläufig erreichbar. ' +
    'Für Schulen und Kitas ist man auf die Nachbarstadtteile Grengel und Porz angewiesen, die über den Bus 162 erreichbar sind — ein Kompromiss, den Familien mit starkem Naturwunsch und einem Auto bewusst eingehen. ' +
    'Libur ist kein Stadtteil für alle, aber für die richtige Zielgruppe einer der ruhigsten Kölner Wohnorte.',

  ensen:
    'Ensen hat eine eigene Grundschule (GGS Ensen) und eine Kita im Stadtteil. ' +
    'Besonders attraktiv für Familien: Der direkte Zugang zum Rheinuferweg bietet Naherholung vor der Haustür, ohne auf städtische Infrastruktur verzichten zu müssen. ' +
    'Die nahegelegene Straßenbahn 7 (Haltestelle Westhoven) verbindet ältere Schulkinder zuverlässig mit weiterführenden Schulen im Bezirk.',

  wahnheide:
    'Wahnheide hat eine Kita im Stadtteil; Grundschulen befinden sich in Wahn und Porz, erreichbar über Bus 161 und 162. ' +
    'Der größte Trumpf für Familien ist die direkt angrenzende Wahner Heide — ein 50 km² großes Naturschutzgebiet als Abenteuerspielplatz vor der Haustür. ' +
    'Wer naturnahes Wohnen mit günstigen Kaufpreisen kombinieren möchte, findet in Wahnheide eine der grünsten Familienwohnlagen im Kölner Stadtgebiet.',

  langel:
    'Langel hat eine Kita direkt im Stadtteil; Grundschulen befinden sich in Zündorf und sind über den Bus 163 erreichbar. ' +
    'Die Rheinfähre nach Hitdorf ist für Kinder ein echtes Erlebnis und zugleich eine Fahrradverbindung in die Nachbargemeinde. ' +
    'Für Familien mit ausgeprägtem Naturbezug und Rheinaffinität ist Langel einer der malerischsten und ruhigsten Wohnorte im Kölner Stadtgebiet.',

  grengel:
    'Grengel hat eine Kita im Stadtteil; Grundschulen befinden sich in Wahn und Porz und sind über den Bus 161 erreichbar. ' +
    'Die Nähe zur Wahner Heide bietet Naturerlebnisse direkt vor der Haustür. ' +
    'Wichtiger Hinweis für Familien: Die Fluglärmbelastung durch den nahen Flughafen Köln/Bonn sollte vor Ort geprüft werden — sie ist ein wesentlicher Faktor und erklärt die im Kölner Vergleich günstigen Kaufpreise.',

  finkenberg:
    'Finkenberg hat eine eigene Grundschule (GGS Finkenberg) und eine Kita direkt im Stadtteil. ' +
    'Besonderer Pluspunkt: Die Straßenbahn 7 (Haltestelle Finkenberg) bringt Schulkinder in unter 20 Minuten in die Kölner Innenstadt — damit ist Finkenberg trotz günstiger Preise gut mit weiterführenden Schulen verbunden. ' +
    'Für Familien mit begrenztem Budget ist Finkenberg einer der wenigen rechtsrheinischen Stadtteile, in denen Eigentumserwerb noch unter 200.000 € realistisch ist.',

  wahn:
    'Wahn hat eine eigene Grundschule (GGS Wahn) und eine Kita direkt im Stadtteil. ' +
    'Besonders praktisch für Familien: Der S-Bahnhof Porz-Wahn (S12/S13) ermöglicht sichere und selbständige Schulwege für ältere Kinder. ' +
    'Das direkt angrenzende Naturschutzgebiet Wahner Heide bietet ausgedehnte Rad- und Wanderwege — Natur und gute Infrastruktur in seltener Kombination für dieses Preissegment.',

  gremberghoven:
    'Gremberghoven hat eine Kita im Stadtteil; Grundschulen befinden sich in Porz und Ensen und sind über Bus 151 und 152 erreichbar. ' +
    'Für Pendlerfamilien ist die direkte A4/A59-Anbindung ein klarer Vorteil: Kölner Innenstadt, Flughafen und Bonn sind schnell erreichbar. ' +
    'Die gemischte Nutzungsstruktur (Gewerbe und Wohnen) macht Gremberghoven zum pragmatischen Familienstandort für diejenigen, die Mobilität über urbanes Flair stellen.',

  westhoven:
    'Westhoven hat eine eigene Grundschule (GGS Westhoven) und eine Kita im Stadtteil. ' +
    'Die Straßenbahn 7 sorgt für direkte Innenstadtanbindung und sichere Schulwege, der rechtsrheinische Rheinuferweg liegt fußläufig erreichbar. ' +
    'Für Familien, die kurze Schulwege mit Naturerlebnissen am Rhein verbinden möchten, ist Westhoven eine der attraktivsten Rheinlagen im mittleren Preissegment.',

  urbach:
    'Urbach ist einer der am besten versorgten Familienstadtteile im Porzer Bezirk: Die GGS Urbach und zwei Kitas (darunter eine AWO-Kita) sind direkt vor Ort. ' +
    'Der REWE Urbach und weitere Nahversorger sowie das nahegelegene Gymnasium Porz ermöglichen kurze Alltagswege ohne Auto. ' +
    'Familien finden in Urbach das seltene Kombipaket aus eigener Grundschule, Vollversorgung und günstigem Kaufpreis im rechtsrheinischen Köln.',

  // ── BEZIRK 6 CHORWEILER ────────────────────────────────────────────────────

  seeberg:
    'Seeberg bietet Familien eine eigene Grundschule (GGS Seeberg) und eine Kita im Stadtteil; das Gymnasium Chorweiler liegt in unmittelbarer Nachbarschaft. ' +
    'Das Chorweiler Einkaufszentrum deckt den täglichen Bedarf direkt in der Nähe ab. ' +
    'Die S-Bahn-Station Chorweiler ist per Bus 121 oder zu Fuß erreichbar — für ältere Schulkinder ein selbständiger und sicherer Schulweg.',

  merkenich:
    'Merkenich hat eine eigene Grundschule (GGS Merkenich) und eine Kita direkt im Stadtteil. ' +
    'Der direkte Zugang zum Rheinufer und das Naturschutzgebiet Merkenicher Bruch bieten Kindern Naturerlebnisse in unmittelbarer Wohnungsnähe. ' +
    'Familien, die ländliches Wohnen am Rhein im Kölner Stadtgebiet schätzen und auf schnelle Innenstadtanbindung verzichten können, finden in Merkenich günstige Preise mit echtem Dorfcharakter.',

  lindweiler:
    'Lindweiler hat eine eigene Grundschule und eine Kita im Stadtteil. ' +
    'Die Buslinien 121 und 127 ermöglichen gute Schulwege zu weiterführenden Schulen in Longerich und Heimersdorf; die S-Bahn ist in der Nachbarschaft erreichbar. ' +
    'Ruhige Wohnstraßen und günstige Kaufpreise machen Lindweiler für Familien mit kleinerem Budget attraktiv, die im Kölner Norden nach einem ruhigen Eigenheim suchen.',

  pesch:
    'Pesch ist der am besten schulversorgte Stadtteil im Chorweiler Bezirk: GGS Pesch und Realschule Pesch liegen direkt im Stadtteil, ergänzt durch zwei Kitas (darunter eine evangelische Kita) und einen REWE. ' +
    'Der nahegelegene Pescher See bietet Naherholung und Freizeitwert direkt vor Ort. ' +
    'Für Familien, die Wert auf kurze Schulwege, eigene Nahversorgung und ruhige Wohnstraßen legen, ist Pesch einer der ausgewogensten Standorte im gesamten Bezirk Chorweiler.',

  'volkhoven-weiler':
    'Volkhoven/Weiler hat eine Kita im Stadtteil; Grundschulen befinden sich in Chorweiler und Worringen, erreichbar über den Bus 120. ' +
    'Der direkte Zugang zum Rhein bietet Kindern Freizeitwert, der im Kölner Stadtgebiet nicht selbstverständlich ist. ' +
    'Familien, die bewusst das Dorfleben am Rhein dem städtischen Komfort vorziehen und ein Auto für den Alltag nutzen, finden in Volkhoven/Weiler günstige Preise mit echter Rheinlage.',

  blumenberg:
    'Blumenberg hat eine eigene Grundschule (GGS Blumenberg) und eine Kita im Stadtteil; die Gesamtschule Chorweiler ist fußläufig erreichbar. ' +
    'Die S-Bahn-Station Chorweiler ist per Bus 120 oder 121 schnell erreichbar — ältere Kinder fahren selbständig zu weiterführenden Schulen. ' +
    'Gut geplante Grünflächen und Spielplätze aus der Siedlungsentstehungszeit der 1970er Jahre sind bis heute ein Pluspunkt für Familien mit kleinen Kindern.',

  heimersdorf:
    'Heimersdorf hat eine eigene Grundschule (GGS Heimersdorf) und eine Kita direkt im Stadtteil; eine Realschule liegt in unmittelbarer Nachbarschaft. ' +
    'Besonders praktisch für Familien: Der S-Bahnhof Köln-Chorweiler ist in wenigen Gehminuten erreichbar — ältere Kinder fahren selbständig und sicher zur Schule. ' +
    'Ruhige Wohnlage und kompakte Struktur machen Heimersdorf zum attraktiven Familienstadtteil für alle, die kurze Schulwege und gute S-Bahn-Anbindung kombinieren möchten.',

  // ── BEZIRK 4 EHRENFELD ─────────────────────────────────────────────────────

  vogelsang:
    'Vogelsang hat eine Kita direkt im Stadtteil; die nächste Grundschule liegt im benachbarten Bickendorf, erreichbar über Bus 143. ' +
    'Der Äußere Grüngürtel als weitläufige Grünfläche mit Spielwiesen und Waldwegen ist fußläufig erreichbar — ein echter Pluspunkt für Familien mit kleinen Kindern. ' +
    'Die Stadtbahn-Linie 3 bringt ältere Schulkinder in rund 20 Minuten in die Kölner Innenstadt und zu weiterführenden Schulen in Ehrenfeld.',
};

// ── Update logic ─────────────────────────────────────────────────────────────

let src = readFileSync(FILE, 'utf8');
let updated = 0;

for (const [slug, newFa] of Object.entries(FA_UPDATES)) {
  const marker = `s:'${slug}'`;
  const startIdx = src.indexOf(marker);
  if (startIdx === -1) {
    console.warn(`WARN: slug '${slug}' not found`);
    continue;
  }

  // Find the brace-matched entry containing this slug
  let entryStart = startIdx;
  while (entryStart > 0 && src[entryStart] !== '{') entryStart--;

  let depth = 0, entryEnd = entryStart;
  for (let i = entryStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}') { depth--; if (depth === 0) { entryEnd = i + 1; break; } }
  }

  let entry = src.slice(entryStart, entryEnd);
  const encoded = toEnc(newFa);
  const replaced = entry.replace(/fa:'[^']*'/, `fa:'${encoded}'`);

  if (replaced === entry) {
    console.warn(`WARN: fa field not found in entry for '${slug}'`);
    continue;
  }

  src = src.slice(0, entryStart) + replaced + src.slice(entryEnd);
  updated++;
  console.log(`✓ ${slug}`);
}

writeFileSync(FILE, src, 'utf8');
console.log(`\nDone. Updated ${updated}/${Object.keys(FA_UPDATES).length} entries.`);
