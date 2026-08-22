#!/usr/bin/env node
/**
 * Baut den Strassenindex in stadtteile/search.js aus dem Masterdatensatz neu auf
 * und schreibt die Hausnummernbereiche der Strassen, die mehrere Veedel
 * durchqueren, nach stadtteile/strassen-hausnummern.js.
 *
 * Master:  data/strassen-master.json
 *          abgeleitet aus dem Koelner Strassenverzeichnis (Quartier-Fassung),
 *          Stadt Koeln, offene Daten, Datenlizenz Deutschland Namensnennung 2.0.
 *          Aktualisierung halbjaehrlich zum 1. April und 1. Oktober - manuell.
 *
 * Preise:  data/veedel-preise.json (aus scripts/gmb-preise.py, Grundstuecksmarktbericht)
 *          Fehlt die Datei, bleibt die Preistabelle leer und die Bewertung
 *          rechnet weiter nur mit der PLZ-Tabelle.
 *
 * Aufruf:  node scripts/gen-strassen-index.mjs
 */
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTER = join(ROOT, 'data', 'strassen-master.json');
const PREISE = join(ROOT, 'data', 'veedel-preise.json');
const ZIEL = join(ROOT, 'stadtteile', 'search.js');
const ZIEL_HNR = join(ROOT, 'stadtteile', 'strassen-hausnummern.js');
const REK = join(ROOT, 'data', 'strassen-rhein-erft.json');
const ZIEL_REK = join(ROOT, 'stadtteile', 'strassen-rhein-erft.js');

const master = JSON.parse(readFileSync(MASTER, 'utf-8'));

// Gruppieren: Veedel + PLZ -> Strassennamen.
// Trenner ist \u0000, nicht das Leerzeichen — "Belgisches Viertel" und
// "Kwartier Latäng" haben selbst eins im Namen.
const TRENNER = '\u0000';
const gruppen = new Map();
for (const r of master) {
  const key = r.v + TRENNER + r.p;
  if (!gruppen.has(key)) gruppen.set(key, new Set());
  gruppen.get(key).add(r.s);
}

const zeilen = [...gruppen.entries()]
  .map(([key, namen]) => {
    const [veedel, plz] = key.split(TRENNER);
    return {veedel, plz, namen: [...namen].sort((a, b) => a.localeCompare(b, 'de'))};
  })
  .sort((a, b) => a.veedel.localeCompare(b.veedel, 'de') || a.plz.localeCompare(b.plz));

const block = 'var STR = [\n' + zeilen.map(z =>
  '      [' + JSON.stringify('Köln-' + z.veedel) + ', ' + JSON.stringify(z.plz) +
  ', ' + JSON.stringify(z.namen.join('|')) + ']'
).join(',\n') + '\n    ];';

let js = readFileSync(ZIEL, 'utf-8');
const start = js.indexOf('var STR = [');
if (start < 0) { console.error('STR-Block in search.js nicht gefunden'); process.exit(1); }
const rel = js.slice(start).match(/\n\s*\];/);
const ende = start + rel.index + rel[0].length;
js = js.slice(0, start) + block + js.slice(ende);

// ---------------------------------------------------------------------------
// Hausnummernbereiche aller Strassen
// ---------------------------------------------------------------------------
// Der Master fuehrt fuer jeden Strassenabschnitt die Hausnummern getrennt nach
// gerade und ungerade. Die Bewertungsseite braucht sie fuer zweierlei:
//   1. Veedel und PLZ bestimmen, wenn eine Strasse durch mehrere laeuft.
//   2. Pruefen, ob es die eingegebene Hausnummer ueberhaupt gibt — sonst
//      bestaetigt die Seite Adressen wie "Bruesseler Platz 890".
// Punkt 2 geht nur mit dem vollstaendigen Bestand, nicht nur mit den
// mehrdeutigen Strassen. Die Datei laedt allein die Bewertungsseite.
const proStrasse = new Map();
for (const r of master) {
  if (!proStrasse.has(r.s)) proStrasse.set(r.s, []);
  proStrasse.get(r.s).push(r);
}
const nr = w => (w === null || w === undefined ? null : parseInt(String(w), 10));
const spanne = a => (Array.isArray(a) && a.length ? [nr(a[0]), nr(a[a.length - 1])] : null);
const hatBereich = r => !!(r.u && r.u.length) || !!(r.g && r.g.length);

const bereiche = {};
const lueckenhaft = [];   // Strassen, in denen Abschnitte ohne Nummernangabe stehen
let segmente = 0, ohneAngabe = 0;
for (const [name, saetze] of [...proStrasse].sort((a, b) => a[0].localeCompare(b[0], 'de'))) {
  const mit = saetze.filter(hatBereich);
  if (!mit.length) { ohneAngabe++; continue; }
  if (mit.length < saetze.length) lueckenhaft.push(name);
  // [Veedel, PLZ, ungerade von-bis, gerade von-bis]
  bereiche[name] = mit.map(r => { segmente++; return [r.v, r.p, spanne(r.u), spanne(r.g)]; });
}

writeFileSync(ZIEL_HNR,
  '/* GENERIERT von scripts/gen-strassen-index.mjs — nicht von Hand aendern.\n' +
  '   Hausnummernbereiche aller Koelner Strassen aus dem Strassenverzeichnis\n' +
  '   der Stadt Koeln. Aufbau je Eintrag: [Veedel, PLZ, [ungerade von, bis],\n' +
  '   [gerade von, bis]].\n' +
  '   RBHausnummernLueckenhaft listet die Strassen, in denen einzelne Abschnitte\n' +
  '   ohne Nummernangabe stehen — dort darf eine unbekannte Hausnummer nicht als\n' +
  '   falsch gemeldet werden. Strassen ganz ohne Angabe fehlen hier komplett. */\n' +
  'window.RBHausnummern = ' + JSON.stringify(bereiche) + ';\n' +
  'window.RBHausnummernLueckenhaft = ' + JSON.stringify(lueckenhaft) + ';\n', 'utf-8');

// ---------------------------------------------------------------------------
// Rhein-Erft-Kreis: Strassen mit Hausnummernbereichen
// ---------------------------------------------------------------------------
// Anderer Zuschnitt als in Koeln: die Ortseinheit ist die Gemeinde, nicht das
// Veedel, und acht der zehn Gemeinden haben nur eine einzige PLZ. Die
// Hausnummer entscheidet die PLZ nur bei 4 von 5.124 Strassen — sie steckt hier
// vor allem drin, damit die Bewertung erkennt, ob es die Adresse ueberhaupt
// gibt. 655 Strassennamen kommen in mehreren Gemeinden vor, deshalb traegt
// jeder Eintrag die Gemeinde mit.
let rekStrassen = 0, rekZeilen = 0, rekGemeinden = [];
if (existsSync(REK)) {
  const rek = JSON.parse(readFileSync(REK, 'utf-8'));
  const proName = {};
  for (const r of rek) {
    if (!proName[r.s]) proName[r.s] = [];
    // [Gemeinde, PLZ, ungerade von-bis, gerade von-bis, Ortsteil]
    proName[r.s].push([r.gem, r.p, r.u, r.g, r.ot || null]);
    rekZeilen++;
  }
  rekStrassen = Object.keys(proName).length;
  rekGemeinden = [...new Set(rek.map(r => r.gem))].sort((a, b) => a.localeCompare(b, 'de'));
  const sortiert = {};
  for (const name of Object.keys(proName).sort((a, b) => a.localeCompare(b, 'de'))) sortiert[name] = proName[name];
  writeFileSync(ZIEL_REK,
    '/* GENERIERT von scripts/gen-strassen-index.mjs — nicht von Hand aendern.\n' +
    '   Strassen des Rhein-Erft-Kreises mit Hausnummernbereichen, aus\n' +
    '   data/strassen-rhein-erft.json (amtliche Gebaeudereferenzen NRW).\n' +
    '   Aufbau je Eintrag: [Gemeinde, PLZ, [ungerade von, bis], [gerade von, bis], Ortsteil]\n' +
    '   ACHTUNG: Gebaeudereferenzen bilden Hausnummern ab, kein Strassenregister —\n' +
    '   Strassen ganz ohne Hausnummer fehlen. */\n' +
    'window.RBRheinErftStrassen = ' + JSON.stringify(sortiert) + ';\n', 'utf-8');
}

// ---------------------------------------------------------------------------
// Preistabelle je Veedel
// ---------------------------------------------------------------------------
let preisTabelle = {};
let preisQuelle = '';
if (existsSync(PREISE)) {
  const p = JSON.parse(readFileSync(PREISE, 'utf-8'));
  preisQuelle = p._quelle || '';
  for (const [veedel, d] of Object.entries(p.veedel)) {
    if (d.etw || d.haus) preisTabelle[veedel] = [d.etw || 0, d.haus || 0];
  }
}

// ---------------------------------------------------------------------------
// Exportblock fuer window.RBVeedel
// ---------------------------------------------------------------------------
const veedel = [...new Set(master.map(r => r.v))].sort((a, b) => a.localeCompare(b, 'de'));

const exportBlock = `  /* GENERIERT von scripts/gen-strassen-index.mjs — nicht von Hand aendern */
  var VEEDEL = ${JSON.stringify(veedel)};
  /* Kaufpreis je m2 Wohnflaeche als [Eigentumswohnung, Ein-/Zweifamilienhaus].
     0 = fuer dieses Veedel nicht ausgewiesen.
     Quelle: ${preisQuelle} */
  var VEEDEL_PREIS = ${JSON.stringify(preisTabelle)};
  function veedelKey(s) {
    return String(s || '').replace(/^K(ö|oe)ln[-\\/ ]/i, '')
      .toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
      .replace(/[^a-z0-9]/g, '');
  }
  var VEEDEL_NACH_KEY = {};
  for (var vi = 0; vi < VEEDEL.length; vi++) VEEDEL_NACH_KEY[veedelKey(VEEDEL[vi])] = VEEDEL[vi];

  /* Hausnummer aus "12a" oder "12 a" lesen; Buchstabenzusatz spielt fuer die
     Zuordnung keine Rolle, die Bereiche der Stadt sind auf ganze Zahlen bezogen. */
  function hausNr(s) {
    var m = String(s == null ? '' : s).match(/(\\d+)/);
    return m ? parseInt(m[1], 10) : null;
  }
  function inSpanne(n, s) {
    return !!s && s[0] !== null && s[1] !== null && n >= s[0] && n <= s[1];
  }
  /* Zweiter Schluessel, diesmal OHNE die Str.-Toleranz von norm(): dort fallen
     "Markt" und "Marktstr." auf denselben Wert zusammen, ebenso "Flughafen" und
     "Flughafenstr.". Fuers Suchfeld ist die Toleranz richtig, fuer die Adresse
     nicht — "Markt 1" liegt in Kalk, die Marktstr. in Raderberg. */
  function nameKey(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
      .replace(/[^a-z0-9]/g, '');
  }
  /* Zugriff auf strassen-hausnummern.js — ueber den echten Strassennamen, nicht
     ueber norm(); die Datei ist optional und laedt nur die Bewertungsseite. */
  function hausnummern(name) {
    var q = window.RBHausnummern;
    return (q && Object.prototype.hasOwnProperty.call(q, name)) ? q[name] : null;
  }
  var HLUECK = null;
  function lueckenhaft(name) {
    if (!HLUECK) {
      HLUECK = {};
      var l = window.RBHausnummernLueckenhaft || [];
      for (var i = 0; i < l.length; i++) HLUECK[l[i]] = 1;
    }
    return !!HLUECK[name];
  }

  /* ---------------------------------------------------------------------
     Rhein-Erft-Kreis
     ---------------------------------------------------------------------
     Die Strassen liegen in stadtteile/strassen-rhein-erft.js (window.
     RBRheinErftStrassen) und werden nur von der Bewertungsseite geladen.
     Ortseinheit ist die Gemeinde: 655 Strassennamen kommen in mehreren
     Gemeinden vor, die Hausnummer entscheidet die PLZ dagegen nur bei 4 von
     5.124 Strassen. Sie steckt vor allem drin, damit erkennbar bleibt, ob es
     die Adresse ueberhaupt gibt. */
  var REKIDX = null;
  function rekIndex() {
    if (REKIDX) return REKIDX;
    REKIDX = [];
    var q = window.RBRheinErftStrassen;
    if (q) for (var k in q) if (Object.prototype.hasOwnProperty.call(q, k)) {
      REKIDX.push({n: k, x: norm(k), k: nameKey(k), a: q[k]});
    }
    return REKIDX;
  }
  var REK_GEMEINDEN = ${JSON.stringify(rekGemeinden)};
  window.RBRheinErft = {
    gemeinden: REK_GEMEINDEN,
    /* Strassensuche: eine Zeile je Gemeinde, damit "Akazienweg" nicht zehnmal
       gleich aussieht. */
    strassen: function (q, max) {
      var t = norm(q || ''); if (!t) return [];
      var list = rekIndex(), hits = [];
      for (var i = 0; i < list.length; i++) if (list[i].x.indexOf(t) !== -1) hits.push(list[i]);
      hits.sort(function (a, b) {
        var ap = a.x.indexOf(t) === 0 ? 0 : 1, bp = b.x.indexOf(t) === 0 ? 0 : 1;
        return ap !== bp ? ap - bp : a.n.length - b.n.length;
      });
      var out = [], gesehen = {};
      for (var j = 0; j < hits.length && out.length < (max || 8); j++) {
        for (var s = 0; s < hits[j].a.length; s++) {
          var seg = hits[j].a[s], schl = hits[j].n + '|' + seg[0];
          if (gesehen[schl]) continue;
          gesehen[schl] = 1;
          out.push({n: hits[j].n, gemeinde: seg[0], plz: seg[1], ortsteil: seg[4]});
          if (out.length >= (max || 8)) break;
        }
      }
      return out;
    },
    /* Adresse -> Gemeinde und PLZ. gemeinde eingrenzen, wenn der Ort bekannt
       ist — sonst bleibt "Akazienweg" zwischen zehn Gemeinden offen. */
    adresse: function (strasse, hausnr, gemeinde) {
      var name = String(strasse == null ? '' : strasse).trim();
      if (!name) return null;
      if (hausnr === undefined || hausnr === null || hausnr === '') {
        var m = name.match(/^(.*?)[\\s,]+(\\d+\\s*[a-zA-Z]?)$/);
        if (m) { name = m[1].trim(); hausnr = m[2]; }
      }
      var t = norm(name), nk = nameKey(name);
      // ALLE Eintraege mit passendem Schluessel einsammeln, nicht nur den
      // ersten: "Zur Alten Burg" (Bedburg) und "Zur alten Burg" (Erftstadt)
      // unterscheiden sich nur in der Grossschreibung und haben denselben
      // Schluessel — wer hier abbricht, verliert eine der beiden Gemeinden.
      var list = rekIndex(), segs = [], i, j;
      for (i = 0; i < list.length; i++) if (list[i].k === nk)
        for (j = 0; j < list[i].a.length; j++) segs.push({n: list[i].n, s: list[i].a[j]});
      if (!segs.length) for (i = 0; i < list.length; i++) if (list[i].x === t)
        for (j = 0; j < list[i].a.length; j++) segs.push({n: list[i].n, s: list[i].a[j]});
      if (!segs.length) return null;

      if (gemeinde) {
        var gk = nameKey(gemeinde);
        var eng = segs.filter(function (x) { return nameKey(x.s[0]) === gk; });
        if (eng.length) {
          segs = eng;
        } else if (REK_GEMEINDEN.some(function (g) { return nameKey(g) === gk; })) {
          // Der Ort ist eine Gemeinde des Kreises, die Strasse liegt aber nicht
          // darin. Dann still auf eine andere Gemeinde auszuweichen waere falsch —
          // "Ahornstraße, Wesseling" darf nicht in Kerpen landen.
          return null;
        }
      }
      var treffer = [], gesehen = {};
      for (i = 0; i < segs.length; i++) {
        var schl = segs[i].s[0] + '|' + segs[i].s[1];
        if (gesehen[schl]) continue;
        gesehen[schl] = 1;
        treffer.push({gemeinde: segs[i].s[0], plz: segs[i].s[1], ortsteil: segs[i].s[4]});
      }
      var erg = {strasse: segs[0].n, hausnr: hausnr || null, gemeinde: null, plz: null,
                 ortsteil: null, eindeutig: false, ueberHausnummer: false,
                 hausnummerBekannt: null, treffer: treffer};

      var n = hausNr(hausnr);
      if (n !== null) {
        var passend = [];
        for (i = 0; i < segs.length; i++) {
          if (inSpanne(n, n % 2 ? segs[i].s[2] : segs[i].s[3])) passend.push(segs[i]);
        }
        // Jede Zeile des Datensatzes hat Nummernbereiche, ein Fehltreffer ist
        // deshalb eine belastbare Aussage — anders als in Koeln.
        erg.hausnummerBekannt = passend.length > 0;
        var gleich = passend.length && passend.every(function (x) {
          return x.s[0] === passend[0].s[0] && x.s[1] === passend[0].s[1];
        });
        if (gleich) {
          erg.strasse = passend[0].n;
          erg.gemeinde = passend[0].s[0]; erg.plz = passend[0].s[1]; erg.ortsteil = passend[0].s[4];
          erg.eindeutig = true; erg.ueberHausnummer = true;
          return erg;
        }
      }
      var eineGemeinde = treffer.every(function (x) { return x.gemeinde === treffer[0].gemeinde; });
      if (eineGemeinde) {
        erg.gemeinde = treffer[0].gemeinde;
        erg.eindeutig = true;
        var einePlz = treffer.every(function (x) { return x.plz === treffer[0].plz; });
        if (einePlz) erg.plz = treffer[0].plz;
        var einOrtsteil = treffer.every(function (x) { return x.ortsteil === treffer[0].ortsteil; });
        if (einOrtsteil) erg.ortsteil = treffer[0].ortsteil;
      }
      return erg;
    }
  };

  window.RBVeedel = {
    liste: VEEDEL,
    /* Nimmt "Altstadt-Nord", "Altstadt/Nord", "Köln-Altstadt/Nord" … und gibt
       den amtlichen Namen zurueck, sonst null. */
    aufloesen: function (name) { return VEEDEL_NACH_KEY[veedelKey(name)] || null; },
    /* Strassensuche wie im Suchfeld: liefert [{n:Strasse, o:Veedel, p:PLZ}] */
    strassen: function (q, max) {
      var t = norm(q || ''); if (!t) return [];
      var list = strIndex(), hits = [];
      for (var i = 0; i < list.length; i++) if (list[i].x.indexOf(t) !== -1) hits.push(list[i]);
      hits.sort(function (a, b) {
        var ap = a.x.indexOf(t) === 0 ? 0 : 1, bp = b.x.indexOf(t) === 0 ? 0 : 1;
        return ap !== bp ? ap - bp : a.n.length - b.n.length;
      });
      return hits.slice(0, max || 8).map(function (s) { return {n: s.n, o: s.o, p: s.p}; });
    },
    /* Kaufpreis je m2 Wohnflaeche fuer ein Veedel:
       {veedel, etw, haus} — Werte koennen null sein, wenn der
       Grundstuecksmarktbericht fuer das Veedel keine Zahl ausweist. */
    preis: function (name) {
      var k = VEEDEL_NACH_KEY[veedelKey(name)];
      var p = k && VEEDEL_PREIS[k];
      if (!p) return null;
      return {veedel: k, etw: p[0] || null, haus: p[1] || null};
    },
    /* Adresse -> Veedel. Nimmt "Aachener Str. 120" oder ("Aachener Str.", "120").
       Liefert null, wenn die Strasse nicht im Verzeichnis steht, sonst
       {strasse, hausnr, veedel, plz, eindeutig, treffer:[{veedel, plz}]}.
       eindeutig=false heisst: die Strasse liegt in mehreren Veedeln und die
       Hausnummer fehlt oder liegt in keinem hinterlegten Bereich. */
    adresse: function (strasse, hausnr) {
      var name = String(strasse == null ? '' : strasse).trim();
      if (!name) return null;
      if (hausnr === undefined || hausnr === null || hausnr === '') {
        var m = name.match(/^(.*?)[\\s,]+(\\d+\\s*[a-zA-Z]?)$/);
        if (m) { name = m[1].trim(); hausnr = m[2]; }
      }
      var t = norm(name), nk = nameKey(name);
      if (!t && !nk) return null;

      // Alle Lagen dieser Strasse. Exakter Name zuerst; nur wenn der nichts
      // findet, greift die tolerante Schreibweise ("Aachener Straße" ->
      // "Aachener Str."). Sonst wuerde "Markt" die Marktstr. mitziehen.
      var list = strIndex(), eintraege = [], i;
      for (i = 0; i < list.length; i++) if (nameKey(list[i].n) === nk) eintraege.push(list[i]);
      if (!eintraege.length) for (i = 0; i < list.length; i++) if (list[i].x === t) eintraege.push(list[i]);
      if (!eintraege.length) return null;

      var treffer = [], gesehen = {};
      for (i = 0; i < eintraege.length; i++) {
        var schl = eintraege[i].o + '|' + eintraege[i].p;
        if (gesehen[schl]) continue;
        gesehen[schl] = 1;
        treffer.push({name: eintraege[i].n, veedel: eintraege[i].o.replace(/^Köln-/, ''), plz: eintraege[i].p});
      }

      var erg = {strasse: treffer[0].name, hausnr: hausnr || null, veedel: null, plz: null,
                 eindeutig: false, ueberHausnummer: false, hausnummerBekannt: null,
                 treffer: treffer.map(function (x) { return {veedel: x.veedel, plz: x.plz}; })};

      // 1. Hausnummer gegen die Bereiche der Stadt halten. Das entscheidet
      //    zweierlei: welches Veedel es ist und ob es die Nummer ueberhaupt gibt.
      //    hausnummerBekannt bleibt null, wo keine Aussage moeglich ist: bei
      //    Strassen ohne Nummernangabe, bei denen mit Luecken und wenn die
      //    Eingabe auf mehrere verschiedene Strassennamen passt.
      var einName = eintraege.every(function (x) { return x.n === eintraege[0].n; });
      var n = hausNr(hausnr), segs = einName ? hausnummern(eintraege[0].n) : null;
      if (n !== null && segs) {
        var passend = [];
        for (var k = 0; k < segs.length; k++) {
          var seg = segs[k];
          if (inSpanne(n, n % 2 ? seg[2] : seg[3])) passend.push({veedel: seg[0], plz: seg[1]});
        }
        erg.hausnummerBekannt = passend.length ? true : (lueckenhaft(eintraege[0].n) ? null : false);
        var gleich = passend.length && passend.every(function (p) {
          return p.veedel === passend[0].veedel && p.plz === passend[0].plz;
        });
        if (gleich) {
          erg.veedel = passend[0].veedel; erg.plz = passend[0].plz;
          erg.eindeutig = true; erg.ueberHausnummer = true;
          return erg;
        }
      }

      // 2. Ohne Hausnummer reicht der Name, solange die Strasse nur in einem
      //    Veedel liegt. Die PLZ bleibt offen, wenn sie innerhalb des Veedels wechselt.
      var einVeedel = treffer.every(function (x) { return x.veedel === treffer[0].veedel; });
      if (einVeedel) {
        erg.veedel = treffer[0].veedel;
        erg.eindeutig = true;
        var einePlz = treffer.every(function (x) { return x.plz === treffer[0].plz; });
        if (einePlz) erg.plz = treffer[0].plz;
      }
      return erg;
    }
  };
  /* ENDE GENERIERT */
`;

const M0 = '  /* GENERIERT von scripts/gen-strassen-index.mjs — nicht von Hand aendern */';
const M1 = '  /* ENDE GENERIERT */\n';
const a0 = js.indexOf(M0);
if (a0 >= 0) {
  const a1 = js.indexOf(M1, a0) + M1.length;
  js = js.slice(0, a0) + exportBlock + js.slice(a1);
} else {
  // Vor die DOM-Verdrahtung setzen: die IIFE steigt mit "return" aus, wenn die
  // Suchleiste fehlt (z. B. Seiten ohne Header). Danach wuerde der Export nie laufen.
  const anker = js.indexOf("  var wrap = document.getElementById('navSearch');");
  const pos = anker >= 0 ? anker : js.lastIndexOf('})();');
  js = js.slice(0, pos) + exportBlock + '\n' + js.slice(pos);
}

writeFileSync(ZIEL, js);

console.log('search.js aktualisiert');
console.log('  Zeilen im Index : ' + zeilen.length + ' (Veedel x PLZ)');
console.log('  Veedel          : ' + veedel.length);
console.log('  Strassennamen   : ' + proStrasse.size);
console.log('  Masterzeilen    : ' + master.length);
console.log('  mit Preisangabe : ' + Object.keys(preisTabelle).length + ' Veedel');
console.log('strassen-hausnummern.js aktualisiert');
console.log('  Strassen mit Nummernbereich   : ' + Object.keys(bereiche).length);
console.log('  Hausnummernabschnitte         : ' + segmente);
console.log('  Strassen mit Luecken          : ' + lueckenhaft.length + ' (Hausnummer dort nicht pruefbar)');
console.log('  Strassen ganz ohne Angabe     : ' + ohneAngabe);
if (rekStrassen) {
  console.log('strassen-rhein-erft.js aktualisiert');
  console.log('  Strassennamen                 : ' + rekStrassen);
  console.log('  Abschnitte                    : ' + rekZeilen);
  console.log('  Gemeinden                     : ' + rekGemeinden.length + ' (' + rekGemeinden.join(', ') + ')');
}
