/**
 * update-stadtteil-listings.mjs
 * Fetches all current EVERNEST listings in the Köln/Rheinland area and embeds
 * an "Aktuelle Angebote"-Block (image + link to the Evernest detail page) into
 * the matching stadtteile/*.html page (Köln districts) and the Umland town pages
 * (which also live under stadtteile/, e.g. leverkusen.html, bergisch-gladbach.html).
 *
 * A listing is matched to a page by parsing its displayAddress:
 *   "Köln-Junkersdorf, 50858"      → junkersdorf.html
 *   "Leverkusen-Rheindorf, 51371"  → leverkusen.html
 *   "Bergisch Gladbach-Refrath, …" → bergisch-gladbach.html
 *
 * Pages with no current listing are left untouched; if a page previously had a
 * listings block but now has none, the block is removed. Idempotent via markers.
 *
 * Usage:  node update-stadtteil-listings.mjs [--dry]
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STADTTEILE_DIR = join(__dirname, '..', 'stadtteile');
const LID_CACHE = join(__dirname, 'listing-lids.json');      // sys.id → L-Id aus dem Expose
const LID_STRASSEN = join(__dirname, 'lid-strassen.csv');    // L-Id → Strasse aus dem CRM-Export

const SEARCH_URL = 'https://www.evernest.com/api/properties/';
const OFFICE_URL = 'https://www.evernest.com/de/search/?lat=50.989913&lng=7.000059&zoom=11';
// Kartenausschnitt identisch zu OFFICE_URL / KOELN_SEARCH_LINK
// (lat 50.922439, lng 7.003492, zoom 10) — so speist sich die Galerie aus
// demselben Ausschnitt, den der "Alle Objekte"-Button oeffnet.
const KOELN_BOUNDS = {
  nw: { lat: 51.4424, lng: 6.0835 },
  ne: { lat: 51.4424, lng: 7.9235 },
  sw: { lat: 50.4024, lng: 6.0835 },
  se: { lat: 50.4024, lng: 7.9235 },
};
const UA = 'Mozilla/5.0 (compatible; RomanBeckerSite/1.0)';

// Die Such-API liefert pro Abfrage hoechstens 20 verkaufte Objekte — egal wie
// gross das Fenster ist. Ein einziger Abruf ueber die ganze Region brachte
// deshalb fuer 86 Stadtteile immer dieselben 20 Referenzen; die verkaufte
// Wohnung in Zollstock war in keiner davon. Darum ein Raster ueber Koeln plus
// Umland: jede Kachel, die die Deckelung erreicht, wird geviertelt.
const GRID = { latMin: 50.78, latMax: 51.14, lngMin: 6.70, lngMax: 7.24 };
const SOLD_CAP = 20;
const GRID_MAX_DEPTH = 4;

// Uferlinie des Rheins aus OpenStreetMap (waterway=river, name=Rhein), von
// Bonn bis Duesseldorf, stromabwaerts geordnet. Der Seitentest laeuft ueber
// das naechstgelegene Segment — eine Interpolation je Breitengrad versagt an
// der Muelheimer Schleife, wo der Fluss fast ost-west laeuft.
//
// Fuer Koelner Adressen zaehlt aber der Stadtteilname, nicht die Koordinate:
// Evernest setzt die Marker ungenau (ein als "Koeln-Muelheim" gefuehrtes
// Objekt lag auf der Muelheimer Bruecke, 125 m vor dem Riehler Ufer).
const RECHTSRHEINISCH = new Set([
  // Stadtbezirke Porz, Kalk und Muelheim, dazu Deutz aus der Innenstadt
  'deutz',
  'poll', 'westhoven', 'ensen', 'gremberghoven', 'eil', 'grengel', 'wahn',
  'wahnheide', 'lind', 'libur', 'zuendorf', 'langel', 'porz', 'urbach',
  'elsdorf', 'finkenberg',
  'humboldt-gremberg', 'kalk', 'vingst', 'hoehenberg', 'ostheim', 'merheim',
  'brueck', 'rath-heumar', 'neubrueck',
  'muelheim', 'buchforst', 'buchheim', 'holweide', 'dellbrueck', 'hoehenhaus',
  'duennwald', 'stammheim', 'flittard',
]);
// Naeher als das am Fluss ist die Seite bei ungenauen Markern nicht sicher zu
// bestimmen — solche Objekte werden nicht zum Auffuellen benutzt.
const UFER_UNSICHER_M = 300;
const RHEIN = [[50.60142,7.21365],[50.60308,7.21422],[50.6121,7.21372],[50.61661,7.21337],[50.62099,7.21287],[50.62318,7.21266],[50.63,7.21198],[50.63606,7.21216],[50.63899,7.21198],[50.64555,7.21204],[50.64749,7.21149],[50.64796,7.2113],[50.65167,7.20977],[50.6559,7.20519],[50.65854,7.20247],[50.65931,7.20181],[50.66371,7.19809],[50.66422,7.1976],[50.67138,7.19086],[50.67421,7.18819],[50.67805,7.18479],[50.67917,7.1838],[50.68679,7.17634],[50.68847,7.1753],[50.69223,7.17348],[50.69441,7.17243],[50.69531,7.17196],[50.69752,7.1708],[50.70393,7.16831],[50.70781,7.16483],[50.71157,7.16042],[50.71322,7.1574],[50.71465,7.15425],[50.71522,7.15298],[50.71541,7.15234],[50.71652,7.1485],[50.71785,7.14357],[50.71806,7.14273],[50.71936,7.13506],[50.72154,7.12568],[50.72218,7.12386],[50.72285,7.12193],[50.72446,7.11886],[50.72633,7.11633],[50.72789,7.1147],[50.72957,7.11354],[50.73,7.11323],[50.73127,7.11261],[50.73827,7.11039],[50.74267,7.10881],[50.74751,7.10687],[50.7517,7.10457],[50.75222,7.10411],[50.75562,7.1011],[50.75651,7.09958],[50.75772,7.09723],[50.76053,7.08933],[50.76363,7.0834],[50.76618,7.07829],[50.76808,7.07344],[50.77096,7.06629],[50.77377,7.05929],[50.7755,7.05406],[50.77606,7.05275],[50.78015,7.04517],[50.78128,7.04319],[50.78541,7.03581],[50.78775,7.03314],[50.79054,7.03148],[50.79569,7.02959],[50.79656,7.02955],[50.79802,7.02954],[50.7987,7.02954],[50.7999,7.02955],[50.8034,7.02959],[50.80544,7.02957],[50.80907,7.02955],[50.81437,7.02785],[50.81747,7.02564],[50.82161,7.02026],[50.82304,7.0159],[50.82455,7.00908],[50.8247,7.00638],[50.82486,6.99789],[50.82566,6.99257],[50.82634,6.98891],[50.82883,6.98372],[50.82999,6.9824],[50.83082,6.98147],[50.83211,6.98063],[50.83501,6.97925],[50.83632,6.97921],[50.83761,6.97917],[50.83961,6.97931],[50.84112,6.97991],[50.84281,6.98105],[50.84463,6.98337],[50.84694,6.98723],[50.84943,6.9941],[50.85104,7.00043],[50.85157,7.002],[50.85398,7.0071],[50.85612,7.00998],[50.85699,7.01111],[50.86262,7.01826],[50.86305,7.01874],[50.86413,7.01995],[50.86693,7.02337],[50.86964,7.02873],[50.87027,7.03008],[50.8711,7.03251],[50.87299,7.03916],[50.87435,7.04271],[50.87627,7.04719],[50.87884,7.05092],[50.88098,7.05191],[50.88217,7.05199],[50.8851,7.05187],[50.88843,7.04955],[50.88966,7.04848],[50.89051,7.04719],[50.89249,7.04332],[50.89396,7.03978],[50.89464,7.03685],[50.89476,7.03359],[50.89473,7.03105],[50.89471,7.02942],[50.89458,7.02394],[50.89453,7.02233],[50.89409,7.01333],[50.89456,7.00818],[50.89514,7.00303],[50.89687,6.99663],[50.89752,6.99463],[50.89939,6.99018],[50.90023,6.98869],[50.90343,6.98366],[50.90503,6.98213],[50.9111,6.97717],[50.91414,6.975],[50.91717,6.97344],[50.91755,6.97324],[50.91961,6.97214],[50.92672,6.96887],[50.92827,6.96836],[50.93075,6.96759],[50.93444,6.96621],[50.93595,6.96572],[50.93641,6.96564],[50.93689,6.96558],[50.9409,6.96571],[50.94144,6.96574],[50.94192,6.96579],[50.946,6.96652],[50.94833,6.96774],[50.94999,6.96894],[50.95303,6.97207],[50.95382,6.97335],[50.95458,6.97493],[50.95686,6.97969],[50.95855,6.98552],[50.96003,6.98934],[50.96329,6.99541],[50.96409,6.99605],[50.96468,6.99642],[50.96768,6.99792],[50.97003,6.99912],[50.97171,6.99916],[50.97326,6.99894],[50.97514,6.99802],[50.97808,6.99589],[50.97947,6.99363],[50.98074,6.99149],[50.98146,6.98968],[50.98221,6.98718],[50.98469,6.97886],[50.98536,6.97681],[50.98714,6.97183],[50.98985,6.96734],[50.99073,6.96625],[50.9933,6.96385],[50.99692,6.96252],[50.99819,6.96223],[50.99897,6.96226],[51.00216,6.9626],[51.00515,6.96393],[51.00693,6.96545],[51.00772,6.96625],[51.01131,6.96947],[51.01481,6.97231],[51.01636,6.97342],[51.01832,6.97414],[51.02027,6.97436],[51.02216,6.97432],[51.0238,6.97364],[51.02575,6.97247],[51.02948,6.96857],[51.03126,6.96559],[51.03397,6.96048],[51.03695,6.95458],[51.04171,6.94478],[51.04241,6.9433],[51.04574,6.93657],[51.05912,6.90937],[51.06178,6.90442],[51.06313,6.90182],[51.06471,6.89832],[51.0669,6.89267],[51.0681,6.88898],[51.06884,6.88625],[51.0697,6.88246],[51.07023,6.87947],[51.07082,6.87582],[51.07138,6.87217],[51.07244,6.86586],[51.07291,6.86337],[51.07354,6.86137],[51.0741,6.85988],[51.07442,6.85894],[51.07582,6.85674],[51.07663,6.85587],[51.07756,6.85488],[51.07855,6.85414],[51.07962,6.85354],[51.08051,6.8532],[51.08225,6.85279],[51.08313,6.85274],[51.08407,6.85281],[51.08489,6.85319],[51.08572,6.85366],[51.08677,6.85452],[51.08761,6.85526],[51.08876,6.85673],[51.09009,6.85883],[51.09147,6.86195],[51.09471,6.87161],[51.09679,6.87669],[51.09799,6.87895],[51.09921,6.8807],[51.1005,6.88198],[51.10184,6.88285],[51.10347,6.88347],[51.105,6.88386],[51.10663,6.88376],[51.10827,6.88335],[51.10948,6.88285],[51.11048,6.88222],[51.11215,6.88088],[51.11362,6.87944],[51.11473,6.87792],[51.11693,6.87468],[51.11928,6.87044],[51.12235,6.8634],[51.12364,6.8606],[51.1251,6.85781],[51.12626,6.85614],[51.12758,6.85431],[51.12867,6.85291],[51.1292,6.85233],[51.13008,6.85138],[51.13154,6.85037],[51.13319,6.84948],[51.13557,6.84859],[51.13704,6.84833],[51.13808,6.84825],[51.14038,6.84849],[51.1429,6.8494],[51.14527,6.85047],[51.14576,6.85074],[51.14767,6.85224],[51.15082,6.85494],[51.15398,6.8573],[51.15451,6.85748],[51.15507,6.85757],[51.15583,6.85759],[51.15705,6.85729],[51.1582,6.85667],[51.15928,6.85574],[51.16018,6.85455],[51.16086,6.85342],[51.16152,6.85182],[51.16179,6.85089],[51.16234,6.84888],[51.16268,6.84652],[51.16269,6.84384],[51.16249,6.84134],[51.16184,6.83861],[51.16147,6.83753],[51.1606,6.83547],[51.15976,6.83411],[51.15884,6.83256],[51.1576,6.83072],[51.15663,6.8295],[51.15504,6.82783],[51.15295,6.82589],[51.15095,6.82428],[51.14723,6.8208],[51.14611,6.81945],[51.14511,6.81784],[51.1438,6.81451],[51.1431,6.81181],[51.14276,6.8086],[51.14279,6.8056],[51.14332,6.80185],[51.14439,6.79888],[51.14562,6.7968],[51.14629,6.79573],[51.14756,6.7944],[51.14901,6.79345],[51.15034,6.7928],[51.15205,6.79242],[51.1541,6.79239],[51.15509,6.79255],[51.15673,6.79292],[51.15864,6.7938],[51.16029,6.79476],[51.16225,6.79599],[51.16369,6.79673],[51.16496,6.79726],[51.16634,6.79773],[51.16744,6.79799],[51.16837,6.79814],[51.16975,6.79823],[51.17081,6.79821],[51.17255,6.79819],[51.17454,6.7978],[51.17599,6.79727],[51.17751,6.79657],[51.17904,6.79555],[51.18037,6.7942],[51.18099,6.79352],[51.18154,6.7928],[51.18309,6.7903],[51.18423,6.78781],[51.18483,6.78604],[51.18556,6.78286],[51.18581,6.78128],[51.18589,6.77969],[51.18578,6.77712],[51.18554,6.77509],[51.1853,6.77389],[51.18473,6.77157],[51.18421,6.76965],[51.18369,6.76766],[51.18311,6.76539],[51.18246,6.76262],[51.182,6.76018],[51.18143,6.75658],[51.18113,6.75406],[51.18104,6.75244],[51.181,6.75098],[51.18101,6.74938],[51.18107,6.74779],[51.18115,6.74635],[51.18138,6.74441],[51.1816,6.74327],[51.18185,6.74203],[51.18216,6.74084],[51.18241,6.7399],[51.18286,6.73859],[51.18323,6.73771],[51.18413,6.73587],[51.1852,6.73431],[51.18617,6.73308],[51.18653,6.73276],[51.18721,6.73214],[51.18785,6.73167],[51.18851,6.73127],[51.18899,6.73105],[51.18935,6.7309],[51.19013,6.73063],[51.1912,6.73037],[51.19218,6.73033],[51.19302,6.7304],[51.19473,6.73071],[51.19705,6.7314],[51.19785,6.73156],[51.19869,6.73173],[51.20134,6.73192],[51.20364,6.73171],[51.20681,6.73161],[51.20862,6.73112],[51.21005,6.73036],[51.21534,6.7268],[51.21968,6.72315],[51.22142,6.72226],[51.22222,6.72229],[51.22306,6.72242],[51.22378,6.72274],[51.22447,6.72296],[51.22577,6.72395],[51.22677,6.72542],[51.22765,6.72722],[51.22828,6.72915],[51.2287,6.73122],[51.22883,6.73258],[51.22881,6.73455],[51.2286,6.73619],[51.22796,6.739],[51.22635,6.74328],[51.22552,6.74487],[51.22298,6.7489],[51.22135,6.75223],[51.22063,6.75414],[51.22018,6.75615],[51.21998,6.75869],[51.22016,6.76118],[51.22049,6.76283],[51.22088,6.76389],[51.22146,6.76482],[51.22204,6.76552],[51.22411,6.76725],[51.22483,6.76766],[51.22547,6.76792],[51.22693,6.76843],[51.22799,6.76873],[51.22989,6.76918],[51.23163,6.76945],[51.23312,6.76929],[51.23468,6.76892],[51.2382,6.76783],[51.24016,6.76665],[51.24191,6.76538],[51.24427,6.76305],[51.24708,6.75942],[51.24884,6.75615],[51.24997,6.75362],[51.25119,6.7505],[51.253,6.74313],[51.25357,6.74043],[51.25583,6.7295],[51.25702,6.72415],[51.25801,6.72071],[51.25943,6.71633],[51.26142,6.71179],[51.26275,6.70926],[51.26427,6.70693],[51.2654,6.70551],[51.26701,6.70398],[51.26828,6.70303],[51.26956,6.70236],[51.27082,6.70208],[51.27206,6.70192],[51.27315,6.70196],[51.2743,6.70213],[51.27553,6.70264],[51.2773,6.70354],[51.27845,6.70414],[51.27933,6.70497],[51.2807,6.70629],[51.28245,6.70831],[51.28965,6.71713],[51.2904,6.71805],[51.29679,6.72594],[51.29846,6.72772],[51.29953,6.7287],[51.3018,6.731],[51.30461,6.73294],[51.30673,6.73387],[51.31037,6.73478],[51.31372,6.73543],[51.31554,6.73545],[51.31756,6.73518],[51.3189,6.73479],[51.32112,6.7336],[51.3224,6.73273],[51.32417,6.73112],[51.32586,6.72905],[51.32701,6.72734],[51.32875,6.72467],[51.32953,6.72312],[51.33093,6.72073],[51.33249,6.7174],[51.33363,6.71487],[51.33457,6.71276],[51.33495,6.71179],[51.33593,6.70922],[51.33685,6.70671],[51.33759,6.7043],[51.3384,6.70155],[51.33872,6.70054],[51.3392,6.69913],[51.33998,6.69657],[51.34231,6.68555],[51.34327,6.68143],[51.34549,6.6725],[51.34724,6.66515],[51.34858,6.66074],[51.34944,6.65915],[51.35039,6.65759],[51.35229,6.65561],[51.35391,6.65453],[51.35583,6.65369],[51.35775,6.65354],[51.359,6.65374],[51.36057,6.65441],[51.36253,6.65577],[51.36451,6.65809],[51.36556,6.66036],[51.36743,6.66506],[51.36863,6.66898],[51.3697,6.67312],[51.37086,6.67858],[51.37197,6.68727],[51.37254,6.69359],[51.37289,6.70146],[51.37326,6.705],[51.37441,6.71133],[51.37555,6.71522],[51.37782,6.72104],[51.38047,6.72637],[51.38068,6.72686],[51.3827,6.73],[51.38745,6.73671],[51.38914,6.73859],[51.39529,6.74393],[51.39578,6.74426]];
const IMG_PARAMS = '?w=800&h=534&fit=fill&fm=jpg&q=80';

// Jede Stadtteilseite soll drei Objekte zeigen. Hat der Stadtteil selbst
// weniger, wird aus dem naeheren Umfeld aufgefuellt — auch mit verkauften
// Referenzen. Gilt nur fuer die Koelner Stadtteilseiten unter stadtteile/;
// das Rhein-Erft-Silo unter immobilienmakler-rhein-erft/ ruehrt dieses
// Skript ohnehin nicht an.
const TARGET_CARDS = 3;
// Aus den N naechstgelegenen Kandidaten wird gezogen, statt stur die
// naechsten zu nehmen — sonst zeigen benachbarte Seiten dieselben Objekte.
const FILL_POOL = 12;
// Weiter als das ist kein "naeheres Umfeld" mehr.
const FILL_RADIUS_KM = 20;
// Breite eines Umkreisrings: innerhalb eines Rings entscheidet der Status,
// zwischen Ringen die Entfernung.
const FILL_RING_KM = 2.5;

const START = '<!-- STADTTEIL-LISTINGS-START -->';
const END = '<!-- STADTTEIL-LISTINGS-END -->';

const DRY = process.argv.includes('--dry');

const TYPE_LABEL = {
  apartment: 'Wohnung', house: 'Haus', multi_family_house: 'Mehrfamilienhaus',
  plot: 'Grundstück', commercial: 'Gewerbe', penthouse: 'Penthouse',
  land: 'Grundstück', villa: 'Villa',
};

// Korrektur fehlerhafter propertyType-Angaben aus den Evernest-Stammdaten.
// Key = listing sys.id, Value = korrekter propertyType (siehe TYPE_LABEL).
// 5sbhUeXVmLizAAbmOfaZv8: in der API als "apartment" geführt, ist aber eine
// Gewerbeeinheit in Köln-Marienburg (986.500 €, ohne Zimmer/Wohnfläche).
const TYPE_OVERRIDE = {
  '5sbhUeXVmLizAAbmOfaZv8': 'commercial',
};

// ---------------------------------------------------------------------------
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[\/]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Luftlinie in km. */
function distanceKm(aLat, aLng, bLat, bLng) {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/**
 * Seed aus dem Slug — die Auswahl ist damit pro Seite stabil. Ein taeglicher
 * Lauf ohne Aenderung am Objektbestand erzeugt so keinen Diff.
 */
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function seededShuffle(arr, seed) {
  let a = seed || 1;
  const rnd = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function localityOf(address) {
  return String(address).replace(/,\s*\d{5}.*$/, '').trim(); // strip ", PLZ …"
}

// Evernest schreibt vereinzelt "Köln - Sülz" statt "Köln-Sülz". Solche Objekte
// fielen sonst durch die Stadtteilzuordnung und standen als "Köln - Sülz" auf
// der Karte.
function normalizeAddress(address) {
  return String(address).replace(/^Köln\s*[-\/]\s*/i, 'Köln-');
}

/** Returns { slug, display, isKoeln } or null if no matching page exists. */
function matchPage(address, validSlugs) {
  const loc = localityOf(address);
  if (!loc) return null;
  if (/^Köln[-\/]/i.test(loc)) {
    const district = loc.replace(/^Köln[-\/]\s*/i, '');
    const slug = slugify(district);
    if (validSlugs.has(slug)) {
      return { slug, display: 'Köln-' + district.replace(/\/\s*/g, '-'), isKoeln: true };
    }
    return null;
  }
  // Umland: town = part before the first "-", minus any "(Rheinland)"-style suffix
  const city = loc.split('-')[0].trim().replace(/\s*\(.*?\)/g, '').trim();
  const slug = slugify(city);
  if (validSlugs.has(slug)) return { slug, display: city, isKoeln: false };
  const full = slugify(loc);
  if (validSlugs.has(full)) return { slug: full, display: loc, isKoeln: false };
  return null;
}

function mapListing(item) {
  const epd = item.exportedPropertyData?.data ?? {};
  return {
    id: item.sys?.id,
    status: item.salesStatus,           // new | reserved | sold
    sold: item.salesStatus === 'sold',
    reserved: item.salesStatus === 'reserved',
    hidePrice: !!item.hidePrice,
    price: epd.priceFrom ?? epd.price ?? null,
    priceFrom: epd.priceFrom != null,
    rooms: epd.rooms ?? null,
    livingSpace: epd.livingSpace ?? null,
    propertyType: TYPE_OVERRIDE[item.sys?.id] ?? epd.propertyType ?? null,
    address: normalizeAddress(item.displayAddress ?? ''),
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    imageUrl: item.featuredImage?.url ?? null,
    url: `https://www.evernest.com/de/listing/${item.sys?.id}/`,
  };
}

// ---------------------------------------------------------------------------
// VEEDEL (nicht-amtliche Quartiere)
//
// Evernest liefert in displayAddress ausschliesslich den amtlichen Stadtteil —
// "Koeln-Neustadt/ Nord". Das Veedel steht nirgends in den Strukturdaten,
// sondern nur im Fliesstext des Exposes. Deshalb bekamen agnesviertel.html,
// belgisches-viertel.html, komponistenviertel.html und rheinauhafen.html nie
// ein Objekt zugewiesen, obwohl es dort welche gibt.
//
// Zwei Signale, ein Objekt reicht eines davon:
//   1. `re`  — Veedelname in Titel, Beschreibung oder Highlight-Block des
//              Exposes. Die Endung ist bewusst offen ([nrsm]?), weil die Texte
//              flektieren: "im Belgischen Viertel", "Mitten im Belgischem
//              Viertel", "im Sueden des Rheinauhafens".
//   2. `box` — Koordinaten des Objekts. Noetig, weil der Text das Veedel nicht
//              immer nennt: das Objekt in der Balthasarstrasse liegt im
//              Agnesviertel, schreibt das Wort aber nirgends.
//
// `parents` ist die Plausibilitaetsbremse: nur Objekte, die amtlich im
// zugehoerigen Stadtteil liegen, koennen ueberhaupt zugeordnet werden. Sonst
// landet ein Haus in Porz auf der Agnesviertel-Seite, weil im Text "wie im
// Belgischen Viertel" steht. Die Boxen sind an bekannten Objekten kalibriert
// und bewusst eng.
const VEEDEL = [
  { slug: 'agnesviertel',       display: 'Agnesviertel',
    re: /Agnesviertel/i,
    box: { latMin: 50.9455, latMax: 50.9565, lngMin: 6.9470, lngMax: 6.9660 },
    parents: ['neustadt-nord'] },
  { slug: 'belgisches-viertel', display: 'Belgisches Viertel',
    re: /Belgische[nrsm]?\s+Viertel/i,
    box: { latMin: 50.9330, latMax: 50.9435, lngMin: 6.9270, lngMax: 6.9460 },
    parents: ['neustadt-nord', 'neustadt-sued'] },
  { slug: 'komponistenviertel', display: 'Komponistenviertel',
    re: /Komponistenviertel/i,
    box: { latMin: 50.9180, latMax: 50.9270, lngMin: 6.9230, lngMax: 6.9370 },
    parents: ['neustadt-sued'] },
  { slug: 'rheinauhafen',       display: 'Rheinauhafen',
    re: /Rheinauhafens?/i,
    box: { latMin: 50.9195, latMax: 50.9295, lngMin: 6.9630, lngMax: 6.9760 },
    parents: ['altstadt-sued', 'neustadt-sued'] },
  { slug: 'eigelstein',          display: 'Eigelstein',
    re: /Eigelstein(viertel)?/i,
    box: { latMin: 50.9440, latMax: 50.9515, lngMin: 6.9510, lngMax: 6.9640 },
    parents: ['altstadt-nord'] },
  { slug: 'kwartier-lataeng',    display: 'Kwartier Latäng',
    re: /Kwartier\s+Lat[aä]ng|Quartier\s+Latin/i,
    box: { latMin: 50.9255, latMax: 50.9325, lngMin: 6.9335, lngMax: 6.9430 },
    parents: ['neustadt-sued', 'altstadt-sued'] },
  { slug: 'suedstadt',           display: 'Südstadt',
    re: /S[üu]dstadt/i,
    box: { latMin: 50.9150, latMax: 50.9250, lngMin: 6.9495, lngMax: 6.9700 },
    parents: ['neustadt-sued', 'altstadt-sued'] },
  { slug: 'malerviertel',        display: 'Malerviertel',
    re: /Malerviertel/i,
    box: { latMin: 50.9380, latMax: 50.9450, lngMin: 6.8540, lngMax: 6.8635 },
    parents: ['muengersdorf'] },
];

const VEEDEL_PARENTS = new Set(VEEDEL.flatMap(v => v.parents));

function inBox(l, b) {
  return l.lat != null && l.lng != null &&
    l.lat >= b.latMin && l.lat <= b.latMax && l.lng >= b.lngMin && l.lng <= b.lngMax;
}

/** Titel, Fliesstext und Highlight-Block aus der Expose-Seite ziehen. */
async function fetchDetailText(id) {
  try {
    const res = await fetch(`https://www.evernest.com/de/listing/${id}/`, { headers: { 'User-Agent': UA } });
    if (!res.ok) return '';
    const html = await res.text();
    const title = html.match(/<title data-next-head="">(.*?)<\/title>/s)?.[1] ?? '';
    const desc  = html.match(/<meta name="description" content="(.*?)" data-next-head/s)?.[1] ?? '';
    let feats = '';
    const fm = html.match(/"features":(\[.*?\])/s);
    if (fm) { try { feats = JSON.parse(fm[1]).join(' | '); } catch { feats = fm[1]; } }
    return [title, desc, feats].join(' | ');
  } catch { return ''; }
}

// ---------------------------------------------------------------------------
// L-Id-Bruecke
//
// Die Such-API kennt nur die Contentful-Id, der CRM-Export nur die L-Id. Die
// Expose-Seite nennt beide — dort steht die L-Id im Seitenquelltext. Einmal je
// Objekt abgerufen und in listing-lids.json gemerkt; nur neue Objekte kosten
// noch einen Request.
async function ladeLidCache() {
  if (!existsSync(LID_CACHE)) return {};
  try { return JSON.parse(await readFile(LID_CACHE, 'utf-8')); } catch { return {}; }
}

async function ergaenzeLidCache(cache, ids) {
  const fehlend = ids.filter(id => cache[id] === undefined);
  if (!fehlend.length) return 0;
  for (let i = 0; i < fehlend.length; i += 8) {
    await Promise.all(fehlend.slice(i, i + 8).map(async id => {
      try {
        const res = await fetch(`https://www.evernest.com/de/listing/${id}/`, { headers: { 'User-Agent': UA } });
        const html = res.ok ? await res.text() : '';
        cache[id] = html.match(/"((?:L-[A-Z0-9]{6,8}|LID-\d+))"/)?.[1] ?? null;
      } catch { cache[id] = null; }
    }));
  }
  await writeFile(LID_CACHE, JSON.stringify(cache), 'utf-8');
  return fehlend.length;
}

async function ladeLidStrassen() {
  if (!existsSync(LID_STRASSEN)) return new Map();
  const zeilen = (await readFile(LID_STRASSEN, 'utf-8')).trim().split('\n').slice(1);
  const m = new Map();
  for (const z of zeilen) {
    const [lid, street, plz] = z.split('|');
    if (lid && street) m.set(lid.trim(), { street: street.trim(), plz: (plz ?? '').trim() });
  }
  return m;
}

/** Strassenname zu einem Listing, oder null wenn nicht auflösbar. */
function strasseVonListing(id, lidCache, lidStrassen) {
  const lid = lidCache[id];
  return lid ? (lidStrassen.get(lid)?.street ?? null) : null;
}

/** "Bachemer Str." und "Bachemer Straße" sollen denselben Schluessel ergeben. */
function strassenKey(name) {
  return String(name).toLowerCase()
    .replace(/str\.$/, 'straße').replace(/str\.\s/, 'straße ')
    .replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
async function fetchBox(latMin, latMax, lngMin, lngMax) {
  const bounds = {
    nw: { lat: latMax, lng: lngMin }, ne: { lat: latMax, lng: lngMax },
    sw: { lat: latMin, lng: lngMin }, se: { lat: latMin, lng: lngMax },
  };
  const res = await fetch(SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ bounds, preview: false }),
  });
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
  return (await res.json())?.searchResults ?? [];
}

/**
 * Raster ueber Koeln plus Umland. Kacheln, die die 20er-Deckelung fuer
 * verkaufte Objekte erreichen, werden geviertelt — sonst fehlen genau die
 * lokalen Referenzen, die eine Stadtteilseite belegen sollen.
 */
async function fetchListings() {
  const found = new Map();
  let calls = 0;
  async function harvest(latMin, latMax, lngMin, lngMax, depth) {
    const res = await fetchBox(latMin, latMax, lngMin, lngMax);
    calls++;
    for (const x of res) if (x?.sys?.id) found.set(x.sys.id, x);
    const sold = res.filter(x => x.salesStatus === 'sold').length;
    if (sold >= SOLD_CAP && depth < GRID_MAX_DEPTH) {
      const mLat = (latMin + latMax) / 2, mLng = (lngMin + lngMax) / 2;
      await harvest(latMin, mLat, lngMin, mLng, depth + 1);
      await harvest(latMin, mLat, mLng, lngMax, depth + 1);
      await harvest(mLat, latMax, lngMin, mLng, depth + 1);
      await harvest(mLat, latMax, mLng, lngMax, depth + 1);
    }
  }
  await harvest(GRID.latMin, GRID.latMax, GRID.lngMin, GRID.lngMax, 0);
  // Weiter aussen liegende aktive Objekte fuer die Startseiten-Zuordnung
  for (const x of await fetchBox(KOELN_BOUNDS.sw.lat, KOELN_BOUNDS.nw.lat, KOELN_BOUNDS.nw.lng, KOELN_BOUNDS.ne.lng)) {
    if (x?.sys?.id && !found.has(x.sys.id)) found.set(x.sys.id, x);
  }
  calls++;
  console.log(`Suchraster: ${calls} Abfragen → ${found.size} Objekte`);
  if (found.size === 0) throw new Error('No listings returned from search API');
  return [...found.values()].map(mapListing);
}

/**
 * Naechstes Rheinsegment zu einem Punkt: liefert Abstand in Metern und das
 * Kreuzprodukt. Stromabwaerts (nach Norden) heisst positiv "links vom Fluss".
 */
function rheinNaehe(lat, lng) {
  const X = (lo) => lo * 70000, Y = (la) => la * 111320;   // grobe Meter, reicht hier
  const px = X(lng), py = Y(lat);
  let best = null;
  for (let i = 0; i < RHEIN.length - 1; i++) {
    const ax = X(RHEIN[i][1]), ay = Y(RHEIN[i][0]);
    const bx = X(RHEIN[i + 1][1]), by = Y(RHEIN[i + 1][0]);
    const dx = bx - ax, dy = by - ay;
    const len2 = Math.max(dx * dx + dy * dy, 1e-9);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    const cx = ax + t * dx, cy = ay + t * dy;
    const d2 = (px - cx) ** 2 + (py - cy) ** 2;
    if (best === null || d2 < best.d2) best = { d2, cross: dx * (py - ay) - dy * (px - ax) };
  }
  return { meter: Math.sqrt(best.d2), seite: best.cross > 0 ? 'links' : 'rechts' };
}

/**
 * 'links', 'rechts' oder null (zu nah am Fluss, um es sicher zu sagen).
 * Bei Koelner Adressen entscheidet der Stadtteilname, sonst die Geometrie.
 */
function rheinSeite(lat, lng, address) {
  const loc = localityOf(address ?? '');
  if (/^Köln[-\/]/i.test(loc)) {
    const slug = slugify(loc.replace(/^Köln[-\/]\s*/i, ''));
    if (slug) return RECHTSRHEINISCH.has(slug) ? 'rechts' : 'links';
  }
  if (lat == null || lng == null) return null;
  const n = rheinNaehe(lat, lng);
  return n.meter < UFER_UNSICHER_M ? null : n.seite;
}

// ---------------------------------------------------------------------------
function priceString(l) {
  if (l.hidePrice || l.price == null) return 'Preis auf Anfrage';
  const fmt = Number(l.price).toLocaleString('de-DE');
  return (l.priceFrom ? 'Ab ' : '') + fmt + ' €';
}

function buildCard(l) {
  const type = TYPE_LABEL[l.propertyType] || 'Immobilie';
  const facts = [];
  if (l.rooms) facts.push(`${String(l.rooms).replace('.', ',')} Zimmer`);
  if (l.livingSpace) facts.push(`${Math.round(l.livingSpace)} m²`);
  const factsStr = facts.join(' · ');
  const title = localityOf(l.address);
  const img = l.imageUrl ? escapeAttr(l.imageUrl + IMG_PARAMS) : '';
  let badge = '';
  if (l.sold) badge = `\n            <span class="listing-card__badge">Verkauft</span>`;
  else if (l.reserved) badge = `\n            <span class="listing-card__badge listing-card__badge--reserved">Reserviert</span>`;
  const imgTag = img
    ? `<img class="listing-card__img" src="${img}" alt="${escapeAttr(type + ' in ' + title)}" loading="lazy" width="800" height="534">`
    : `<div class="listing-card__img" aria-hidden="true"></div>`;
  // Bei verkauften Objekten kein "Preis auf Anfrage" ausgeben — das Verkauft-Badge
  // sagt bereits alles. Ein tatsächlich bekannter Preis bleibt erhalten.
  const priceHidden = l.hidePrice || l.price == null;
  const priceLine = (l.sold && priceHidden)
    ? ''
    : `\n            <span class="listing-card__price">${priceString(l)}</span>`;

  return `        <a class="listing-card" href="${escapeAttr(l.url)}" target="_blank" rel="noopener">
          <div class="listing-card__imgwrap">
            ${imgTag}${badge}
          </div>
          <div class="listing-card__body">
            <span class="listing-card__type">${escapeAttr(type)}</span>
            <span class="listing-card__title">${escapeAttr(title)}</span>
            ${factsStr ? `<span class="listing-card__facts">${escapeAttr(factsStr)}</span>` : ''}${priceLine}
          </div>
        </a>`;
}

function buildSection(display, listings, ownCount, ownActive) {
  // Verfuegbare Objekte zuerst, verkaufte Referenzen danach; innerhalb beider
  // Gruppen nach Preis absteigend, Objekte ohne Preis ans Ende.
  const priceOf = (l) => (l.hidePrice || l.price == null ? null : Number(l.price));
  const sorted = [...listings].sort((a, b) => {
    if (!!a.sold !== !!b.sold) return a.sold ? 1 : -1;
    const pa = priceOf(a), pb = priceOf(b);
    if (pa != null && pb != null) return pb - pa;
    if (pa != null) return -1;
    if (pb != null) return 1;
    return 0;
  });
  const cards = sorted.map(buildCard).join('\n');
  const count = listings.length;
  const noun = count === 1 ? 'Objekt' : 'Objekte';
  const d = escapeAttr(display);
  const kontakt = `Schicken Sie mir <a href="https://romanbecker.de/#kontakt">eine Nachricht mit Ihren Präferenzen</a> – ich trage Sie in unsere Datenbank ein.`;
  const hinweis = listings.some(l => l.sold) ? ' Verkaufte Referenzen sind als solche gekennzeichnet.' : '';
  // Die Seite darf nur behaupten, was der Bestand hergibt. Ohne verfuegbares
  // Objekt im Stadtteil faellt "Aktuelle Angebote in X" weg — die Karten
  // nennen ohnehin je Objekt den echten Ort und den Status.
  let heading, intro;
  if (ownActive > 0) {
    heading = `Aktuelle Immobilienangebote in ${d}`;
    intro = `${count} ${noun} in ${d} und Umgebung – jetzt ansehen.${hinweis} Kein passendes Objekt dabei? ${kontakt}`;
  } else if (ownCount > 0) {
    heading = `Immobilien in ${d} und Umgebung`;
    intro = `In ${d} ist derzeit kein Angebot offen. Diese ${count} Immobilien stammen aus ${d} und dem näheren Umfeld.${hinweis} Sie suchen gezielt in ${d}? ${kontakt}`;
  } else {
    heading = `Immobilienangebote rund um ${d}`;
    intro = `In ${d} ist derzeit kein eigenes Objekt im Angebot. Diese ${count} Immobilien liegen im näheren Umfeld.${hinweis} Sie suchen gezielt in ${d}? ${kontakt}`;
  }
  return `${START}
  <section id="aktuelle-angebote" class="section section--gray">
    <div class="container">
      <span class="section-label">Aktuelle Angebote</span>
      <h2>${heading}</h2>
      <p class="max-w-prose mb-8">${intro}</p>
      <div class="listings__grid">
${cards}
      </div>
      <div class="cta-buttons" style="margin-top:var(--space-8)">
        <a href="${OFFICE_URL}" class="btn btn--primary" target="_blank" rel="noopener">Alle Immobilienangebote</a>
      </div>
    </div>
  </section>
  ${END}`;
}

// ---------------------------------------------------------------------------
/**
 * Zieht aus "Weitere verkaufte Objekte" die Objekte ab, die oben schon als
 * Karte stehen. Nur verkaufte Karten zaehlen — die Liste enthaelt
 * ausschliesslich Verkauftes, ein aktives Angebot in derselben Strasse ist ein
 * anderes Objekt (Balthasarstr. 76 steht zum Verkauf, die beiden Referenzen
 * dort sind Nr. 58 und eine weitere).
 *
 * Ein Eintrag mit mehreren Einheiten wird heruntergezaehlt, nicht geloescht.
 * Es wird nur gefiltert, nie neu erzeugt — die vollstaendige Liste bleibt
 * Sache von build_verkauft_v2.py, ein Lauf davon stellt alles wieder her.
 */
function filtereReferenzliste(html, verkaufteStrassen) {
  const vs = html.indexOf('<!-- VERKAUFT-START -->');
  const ve = html.indexOf('<!-- VERKAUFT-END -->');
  if (vs === -1 || ve === -1 || !verkaufteStrassen.size) return { html, entfernt: 0 };
  let block = html.slice(vs, ve);
  const zeilen = block.match(/^.*<li><span class="infra-icon">.*$/gm) ?? [];
  if (!zeilen.length) return { html, entfernt: 0 };

  const offen = new Map(verkaufteStrassen);   // Strasse → wie viele Karten
  let entfernt = 0;
  const behalten = [];
  for (const z of zeilen) {
    const inhalt = z.match(/<span>([^<]*)<\/span><\/li>/)?.[1] ?? '';
    const strasse = inhalt.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const typ = inhalt.match(/\(([^,)]+)/)?.[1]?.trim() ?? 'Immobilie';
    const n = Number(inhalt.match(/,\s*(\d+)\s*Einheiten/)?.[1] ?? 1);
    const key = strassenKey(strasse);
    const abzug = Math.min(n, offen.get(key) ?? 0);
    if (!abzug) { behalten.push({ z, n }); continue; }
    offen.set(key, (offen.get(key) ?? 0) - abzug);
    entfernt += abzug;
    const rest = n - abzug;
    if (rest <= 0) continue;
    const suf = rest > 1 ? `, ${rest} Einheiten` : '';
    behalten.push({ z: z.replace(/<span>[^<]*<\/span><\/li>/, `<span>${escapeAttr(strasse)} (${escapeAttr(typ + suf)})</span></li>`), n: rest });
  }
  if (!entfernt || !behalten.length) return { html, entfernt: 0 };

  const erste = block.indexOf(zeilen[0]);
  const letzte = block.indexOf(zeilen[zeilen.length - 1]) + zeilen[zeilen.length - 1].length;
  block = block.slice(0, erste) + behalten.map(b => b.z).join('\n') + block.slice(letzte);
  const anzahl = behalten.reduce((sum, b) => sum + b.n, 0);
  block = block.replace(/(<div class="ref-card__number">)\d+(<\/div>)/, `$1${anzahl}$2`);
  return { html: html.slice(0, vs) + block + html.slice(ve), entfernt };
}

// ---------------------------------------------------------------------------
function stripBlock(html) {
  const si = html.indexOf(START);
  const ei = html.indexOf(END);
  if (si === -1 || ei === -1) return html;
  const lineStart = html.lastIndexOf('\n', si) + 1;
  const after = ei + END.length;
  // also consume trailing newline
  const nl = html[after] === '\n' ? 1 : 0;
  return html.slice(0, lineStart) + html.slice(after + nl);
}

function insertSection(html, section) {
  if (html.includes(START) && html.includes(END)) {
    const si = html.indexOf(START);
    const ei = html.indexOf(END);
    const lineStart = html.lastIndexOf('\n', si) + 1;
    // Rest der END-Zeile verwerfen, den folgenden Zeilenumbruch aber stehen
    // lassen. Die frueher hier angehaengte '\n' machte den Austausch nicht
    // idempotent: jeder Lauf schob eine Leerzeile nach (bis zu 53 pro Seite).
    return html.slice(0, lineStart) + section + html.slice(ei + END.length).replace(/^[^\n]*/, '');
  }
  // Hinter das Stadtteil-/Quartiersprofil setzen — dort steht der Block auch
  // auf den Seiten, die ihn schon haben. Direkt hinter dem Hero saehe er
  // anders aus als auf den bestehenden Seiten.
  const heroIdx = html.indexOf('<section class="hero"');
  if (heroIdx !== -1) {
    const profilIdx = html.indexOf('<section class="section section--gray">', heroIdx);
    const anchor = profilIdx !== -1 ? profilIdx : heroIdx;
    const closeIdx = html.indexOf('</section>', anchor);
    if (closeIdx !== -1) {
      const insertAt = closeIdx + '</section>'.length;
      return html.slice(0, insertAt) + '\n\n' + section + html.slice(insertAt);
    }
  }
  // Fallback: before footer
  const footIdx = html.indexOf('<footer');
  const lineStart = html.lastIndexOf('\n', footIdx) + 1;
  return html.slice(0, lineStart) + '  ' + section + '\n' + html.slice(lineStart);
}

// ---------------------------------------------------------------------------
async function main() {
  const files = (await readdir(STADTTEILE_DIR))
    .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'search.js');
  const validSlugs = new Set(files.map(f => f.replace(/\.html$/, '')));

  console.log('Fetching EVERNEST listings…');
  const listings = await fetchListings();
  console.log(`API returned ${listings.length} listings`);

  // Group by matched page
  const byPage = new Map();          // slug → { display, listings[] }
  const unmatched = [];
  for (const l of listings) {
    const m = matchPage(l.address, validSlugs);
    if (!m) { unmatched.push(l.address); continue; }
    if (!byPage.has(m.slug)) byPage.set(m.slug, { display: m.display, listings: [] });
    byPage.get(m.slug).listings.push(l);
  }

  // --- Veedel-Durchgang -----------------------------------------------------
  // Nur Objekte pruefen, die amtlich in einem Bezugsstadtteil liegen — das sind
  // wenige, der Detail-Abruf faellt damit kaum ins Gewicht.
  const veedelCandidates = [];
  for (const [slug, g] of byPage) {
    if (VEEDEL_PARENTS.has(slug)) for (const l of g.listings) veedelCandidates.push({ slug, l });
  }
  for (const { slug, l } of veedelCandidates) {
    const possible = VEEDEL.filter(v => v.parents.includes(slug));
    if (!possible.length) continue;
    const byCoords = possible.filter(v => inBox(l, v.box));
    let hit = byCoords[0] ?? null;
    let how = hit ? 'Koordinaten' : null;
    if (!hit) {
      const text = await fetchDetailText(l.id);
      hit = possible.find(v => v.re.test(text)) ?? null;
      how = hit ? 'Text' : null;
    }
    if (!hit) continue;
    if (!byPage.has(hit.slug)) byPage.set(hit.slug, { display: hit.display, listings: [] });
    const target = byPage.get(hit.slug);
    if (!target.listings.some(x => x.id === l.id)) {
      target.listings.push(l);
      console.log(`  Veedel: ${l.address} → ${hit.slug}.html (${how})`);
    }
  }

  // --- L-Id-Bruecke --------------------------------------------------------
  // Die L-Id wird schon fuer die Auswahl gebraucht: zwei Contentful-Eintraege
  // koennen dieselbe Immobilie sein. Einmal je Objekt abgerufen und gemerkt.
  const lidCache = await ladeLidCache();
  const geholt = await ergaenzeLidCache(lidCache, listings.map(l => l.id));
  const lidStrassen = await ladeLidStrassen();
  if (geholt) console.log(`L-Id: ${geholt} Expose(s) nachgeladen`);

  // --- Auffuellen auf drei Objekte ----------------------------------------
  // Regel: eigene Objekte des Stadtteils zuerst und vollstaendig. Sind es
  // weniger als drei, wird aus dem naeheren Umfeld aufgefuellt — auch mit
  // reservierten und verkauften Objekten, die Karte kennzeichnet beides.
  const pageMeta = new Map();        // slug → { display, lat, lng }
  const hatReferenzblock = new Set(); // Seiten mit "Weitere verkaufte Objekte"
  for (const f of files) {
    const slug = f.replace(/\.html$/, '');
    const html = await readFile(join(STADTTEILE_DIR, f), 'utf-8');
    if (html.includes('<!-- VERKAUFT-START -->')) hatReferenzblock.add(slug);
    const pos = html.match(/name="geo\.position" content="([\-0-9.]+);([\-0-9.]+)"/);
    const name = html.match(/name="geo\.placename" content="([^"]*)"/);
    if (!pos) { console.log(`  ! ${f}: keine geo.position — wird nicht aufgefuellt`); continue; }
    pageMeta.set(slug, {
      display: name ? name[1] : slug,
      lat: Number(pos[1]), lng: Number(pos[2]),
    });
  }

  const withCoords = listings.filter(l => l.lat != null && l.lng != null);
  let filledPages = 0, filledCards = 0, ohneSeite = 0;

  // Verfuegbare Objekte des Stadtteils kommen alle auf die Seite, auch wenn es
  // mehr als drei sind. Verkaufte Referenzen desselben Stadtteils sind dagegen
  // Auffuellmaterial — sonst zeigte eine Seite elf Verkauft-Karten.
  const ownSold = new Map();
  for (const [slug, g] of byPage) {
    const aktiv = g.listings.filter(l => !l.sold);
    const verkauft = g.listings.filter(l => l.sold);
    g.listings = aktiv;
    g.ownActive = aktiv.length;
    if (verkauft.length) ownSold.set(slug, verkauft);
  }

  for (const [slug, meta] of pageMeta) {
    const g0 = byPage.get(slug);
    const own = g0?.listings ?? [];
    if (own.length >= TARGET_CARDS) continue;
    const seite = RECHTSRHEINISCH.has(slug) ? 'rechts' : 'links';
    const taken = new Set(own.map(l => l.id));
    const near = withCoords
      .filter(l => !taken.has(l.id))
      // Der Rhein ist keine Strecke, die man mal eben quert: ein Objekt in
      // Deutz gehoert nicht auf eine linksrheinische Veedelseite.
      .filter(l => rheinSeite(l.lat, l.lng, l.address) === seite)
      .map(l => ({ l, km: distanceKm(meta.lat, meta.lng, l.lat, l.lng) }))
      .filter(x => x.km <= FILL_RADIUS_KM)
      .sort((a, b) => a.km - b.km);
    // Verfuegbare Objekte vor verkauften Referenzen, innerhalb beider Gruppen
    // aus den naechstgelegenen zufaellig gezogen.
    // Verkaufte Referenzen des eigenen Stadtteils zaehlen als Entfernung 0.
    // Wird ein solches Objekt als Karte gezeigt, faellt es unten aus der Liste
    // "Weitere verkaufte Objekte" heraus — der Abgleich laeuft ueber die
    // L-Id aus dem Expose, siehe strasseVonListing().
    // Eigene verkaufte Objekte stehen auch im Nahbereich — ohne Entdopplung
    // landete dasselbe Objekt zweimal auf der Seite. Zusaetzlich ueber die
    // L-Id entdoppeln: zwei Contentful-Eintraege koennen dieselbe Immobilie
    // sein (die beiden identischen Refrather Neubau-Einheiten etwa).
    const kandidaten = [];
    const gesehen = new Set(taken);
    const gesehenLid = new Set(own.map(l => lidCache[l.id]).filter(Boolean));
    for (const x of [...(ownSold.get(slug) ?? []).map(l => ({ l, km: 0 })), ...near]) {
      const lid = lidCache[x.l.id];
      if (gesehen.has(x.l.id) || (lid && gesehenLid.has(lid))) continue;
      gesehen.add(x.l.id);
      if (lid) gesehenLid.add(lid);
      kandidaten.push(x);
    }
    // Naehe schlaegt Status: innerhalb eines Umkreisrings kommt ein
    // verfuegbares Objekt vor einer Referenz, aber ein Objekt aus dem Veedel
    // nebenan vor einem verfuegbaren am anderen Ende der Stadt. Sonst stuende
    // dieselbe Wohnung aus der Neustadt auf drei Dutzend Seiten.
    const gruppen = new Map();
    for (const x of kandidaten) {
      const key = `${Math.floor(x.km / FILL_RING_KM)}|${x.l.sold ? 1 : 0}`;
      (gruppen.get(key) ?? gruppen.set(key, []).get(key)).push(x);
    }
    const reihenfolge = [...gruppen.keys()].sort((a, b) => {
      const [ra, sa] = a.split('|').map(Number), [rb, sb] = b.split('|').map(Number);
      return ra - rb || sa - sb;
    });
    const pick = [];
    for (const key of reihenfolge) {
      if (pick.length >= TARGET_CARDS - own.length) break;
      for (const x of seededShuffle(gruppen.get(key), seedFrom(slug + '|' + key))) {
        if (pick.length >= TARGET_CARDS - own.length) break;
        pick.push(x);
      }
    }
    if (!pick.length) { ohneSeite++; continue; }
    if (!byPage.has(slug)) byPage.set(slug, { display: meta.display, listings: [], ownCount: 0, ownActive: 0 });
    const g = byPage.get(slug);
    for (const x of pick) g.listings.push(x.l);
    filledPages++; filledCards += pick.length;
  }
  for (const [slug, g] of byPage) {
    if (g.ownActive == null) g.ownActive = 0;
    const eigene = new Set((ownSold.get(slug) ?? []).map(l => l.id));
    g.ownCount = g.ownActive + g.listings.filter(l => eigene.has(l.id)).length;
  }
  console.log(`\nAufgefuellt: ${filledCards} Karten auf ${filledPages} Seiten (Ziel ${TARGET_CARDS}/Seite)` +
    (ohneSeite ? `; ${ohneSeite} Seite(n) ohne Kandidaten auf ihrer Rheinseite` : ''));

  console.log(`\nMatched ${listings.length - unmatched.length} listings → ${byPage.size} pages`);
  for (const [slug, g] of [...byPage].sort()) {
    const fill = g.listings.length - g.ownCount;
    console.log(`  ${slug}.html  (${g.display})  → ${g.listings.length} listing(s)` +
      (fill > 0 ? `  [${g.ownCount} eigen + ${fill} Umfeld]` : ''));
  }
  if (unmatched.length) {
    console.log(`\nUnmatched (no page): ${unmatched.length}`);
    console.log('  ' + [...new Set(unmatched.map(localityOf))].join(', '));
  }

  const gezeigt = new Set([...byPage.values()].flatMap(g => g.listings.map(l => l.id)));
  const aufgeloest = [...gezeigt].filter(id => strasseVonListing(id, lidCache, lidStrassen)).length;
  console.log(`Strasse bekannt fuer ${aufgeloest} von ${gezeigt.size} gezeigten Objekten`);

  if (DRY) { console.log('\n[dry run — no files written]'); return; }

  let written = 0, cleared = 0, entferntGesamt = 0, seitenMitAbzug = 0;
  for (const f of files) {
    const slug = f.replace(/\.html$/, '');
    const path = join(STADTTEILE_DIR, f);
    let html = await readFile(path, 'utf-8');
    const had = html.includes(START);
    if (byPage.has(slug)) {
      const g = byPage.get(slug);
      html = insertSection(html, buildSection(g.display, g.listings, g.ownCount, g.ownActive));
      // Was oben als Karte steht, faellt unten aus "Weitere verkaufte Objekte".
      // Nur verkaufte Karten — die Referenzliste fuehrt nur Verkauftes.
      const strassen = new Map();
      for (const l of g.listings.filter(l => l.sold)) {
        const st = strasseVonListing(l.id, lidCache, lidStrassen);
        if (st) strassen.set(strassenKey(st), (strassen.get(strassenKey(st)) ?? 0) + 1);
      }
      const r = filtereReferenzliste(html, strassen);
      html = r.html;
      if (r.entfernt) { entferntGesamt += r.entfernt; seitenMitAbzug++; }
      await writeFile(path, html, 'utf-8');
      written++;
    } else if (had) {
      html = stripBlock(html);
      await writeFile(path, html, 'utf-8');
      cleared++;
    }
  }
  console.log(`\nWrote listings into ${written} pages; cleared ${cleared} stale pages.`);
  console.log(`Referenzliste: ${entferntGesamt} Eintrag/Eintraege auf ${seitenMitAbzug} Seite(n) entfernt, weil das Objekt oben als Karte steht.`);
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
