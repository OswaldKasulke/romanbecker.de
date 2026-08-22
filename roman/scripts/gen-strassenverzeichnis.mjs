#!/usr/bin/env node
/**
 * Baut die Strassenverzeichnis-Sektion auf den Stadtteilseiten aus dem
 * Masterdatensatz neu auf.
 *
 * Master:  data/strassen-master.json
 *          Koelner Strassenverzeichnis (Quartier-Fassung), Stadt Koeln,
 *          offene Daten, Datenlizenz Deutschland Namensnennung 2.0.
 *          Halbjaehrlich zum 1. April und 1. Oktober - manuell aktualisieren.
 *
 * Aufruf:  node scripts/gen-strassenverzeichnis.mjs [--dry]
 */
import {readFileSync, writeFileSync, readdirSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const master = JSON.parse(readFileSync(join(ROOT, 'data', 'strassen-master.json'), 'utf-8'));

// Veedel -> Strasse -> Menge der PLZ
const proVeedel = new Map();
for (const r of master) {
  if (!proVeedel.has(r.v)) proVeedel.set(r.v, new Map());
  const m = proVeedel.get(r.v);
  if (!m.has(r.s)) m.set(r.s, new Set());
  m.get(r.s).add(r.p);
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Seitentitel -> Veedelname des Masters
function veedelDerSeite(html, slug) {
  const m = html.match(/<h1>Immobilienmakler ([^–<]+?)\s*[–-]\s/) ||
            html.match(/<title>Immobilienmakler ([^|<]+?)\s*\|/);
  const name = (m ? m[1] : slug).replace(' Köln', '').trim();
  if (proVeedel.has(name)) return name;
  const alt = [name.replace(/-/g, '/'), name.replace(/\//g, '-'), name.replace(/ \(Porz\)$/, '')];
  for (const a of alt) if (proVeedel.has(a)) return a;
  return null;
}

let geaendert = 0, uebersprungen = [], ohneSektion = [];
for (const datei of readdirSync(join(ROOT, 'stadtteile')).filter(f => f.endsWith('.html') && f !== 'index.html')) {
  const pfad = join(ROOT, 'stadtteile', datei);
  let html = readFileSync(pfad, 'utf-8');
  const veedel = veedelDerSeite(html, datei.slice(0, -5));
  if (!veedel) { uebersprungen.push(datei); continue; }

  const start = html.indexOf('<section class="section section--gray strassen-directory"');
  if (start < 0) { ohneSektion.push(datei); continue; }
  const ende = html.indexOf('</section>', start) + '</section>'.length;

  const strassen = [...proVeedel.get(veedel).entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'de'));
  const anzahl = strassen.length;
  const kurz = veedel;

  const li = strassen.map(([name, plzSet]) => {
    const plz = [...plzSet].sort()[0];
    const href = '/immobilienbewertung/?strasse=' + encodeURIComponent(name) +
                 '&amp;ort=' + encodeURIComponent('Köln-' + veedel) +
                 '&amp;plz=' + encodeURIComponent(plz);
    const karte = esc(name + ', Köln-' + veedel);
    return '          <li><a class="strassen-link" href="' + href + '">' + esc(name) + '</a>' +
      '<button type="button" class="strassen-pin" data-map="' + karte +
      '" aria-label="' + esc(name) + ' auf der Karte anzeigen" title="Auf Karte anzeigen">📍</button></li>';
  }).join('\n');

  const block =
'<section class="section section--gray strassen-directory" id="strassenverzeichnis">\n' +
'    <div class="container">\n' +
'      <span class="section-label">Straßenverzeichnis</span>\n' +
'      <h2>Alle Straßen in Köln-' + esc(kurz) + '</h2>\n' +
'      <p class="text-muted mb-8 max-w-prose">Sie besitzen eine Immobilie in einer dieser ' + anzahl +
' Straßen in ' + esc(kurz) + '? Ein Klick auf den Straßennamen startet Ihre kostenlose Sofort-Bewertung mit ' +
'vorausgefüllter Adresse – oder zeigen Sie die Lage mit 📍 direkt auf der Karte.</p>\n' +
'      <details class="strassen-details">\n' +
'        <summary>Straßenverzeichnis ' + esc(kurz) + ' anzeigen (' + anzahl + ' Straßen)</summary>\n' +
'        <ul class="strassen-grid">\n' + li + '\n' +
'        </ul>\n' +
'      </details>\n' +
'      <p class="text-muted" style="font-size:0.8125rem;margin-top:var(--space-4)">Quelle: Stadt Köln, ' +
'Kölner Straßenverzeichnis, Stand 01.04.2026 (Datenlizenz Deutschland Namensnennung 2.0).</p>\n' +
'    </div>\n' +
'  </section>';

  if (!DRY) writeFileSync(pfad, html.slice(0, start) + block + html.slice(ende));
  geaendert++;
}

console.log((DRY ? 'PROBELAUF – ' : '') + 'Seiten aktualisiert: ' + geaendert);
if (uebersprungen.length) console.log('  kein Veedel im Master: ' + uebersprungen.join(', '));
if (ohneSektion.length) console.log('  ohne Straßen-Sektion : ' + ohneSektion.join(', '));
