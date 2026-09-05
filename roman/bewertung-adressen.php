<?php
/**
 * Serverseitige Adressaufloesung fuer die Immobilienbewertung.
 *
 * Der zusammengebaute Strassen- und Adressmaster liegt in bewertung-daten/ und wird
 * nie ausgeliefert. Der Browser fragt hier nur einzelne Adressen an und bekommt
 * ausschliesslich das Ergebnis zurueck. Die Rechenlogik selbst bleibt im
 * Browser: sie arbeitet mit den BORIS-Zonen und -Modellen, die das Land NRW
 * ohnehin offen veroeffentlicht.
 *
 * Die Funktionen norm(), house(), span(), search() und resolve() sind
 * zeichengleiche Portierungen aus stadtteile/gemeinsame-bewertung.js. Wer eine
 * davon aendert, muss beide Seiten aendern - bin/bewertungsserver_pruefen.mjs
 * im strassen-db-Verzeichnis vergleicht sie ueber den ganzen Bestand.
 */

declare(strict_types=1);

const DATEN = __DIR__ . '/bewertung-daten';
const SHARDS = 64;

/** NFD-Ersatz ohne intl: dieselben Grundbuchstaben wie .normalize("NFD") im Browser. */
const AKZENTE = [
    'à'=>'a','á'=>'a','â'=>'a','ã'=>'a','å'=>'a','ā'=>'a','ă'=>'a','ą'=>'a',
    'ç'=>'c','ć'=>'c','ĉ'=>'c','ċ'=>'c','č'=>'c','ď'=>'d',
    'è'=>'e','é'=>'e','ê'=>'e','ë'=>'e','ē'=>'e','ĕ'=>'e','ė'=>'e','ę'=>'e','ě'=>'e',
    'ĝ'=>'g','ğ'=>'g','ġ'=>'g','ģ'=>'g','ĥ'=>'h',
    'ì'=>'i','í'=>'i','î'=>'i','ï'=>'i','ĩ'=>'i','ī'=>'i','ĭ'=>'i','į'=>'i',
    'ĵ'=>'j','ķ'=>'k','ĺ'=>'l','ļ'=>'l','ľ'=>'l',
    'ñ'=>'n','ń'=>'n','ņ'=>'n','ň'=>'n',
    'ò'=>'o','ó'=>'o','ô'=>'o','õ'=>'o','ō'=>'o','ŏ'=>'o','ő'=>'o',
    'ŕ'=>'r','ŗ'=>'r','ř'=>'r','ś'=>'s','ŝ'=>'s','ş'=>'s','š'=>'s',
    'ţ'=>'t','ť'=>'t','ù'=>'u','ú'=>'u','û'=>'u','ũ'=>'u','ū'=>'u','ŭ'=>'u','ů'=>'u','ű'=>'u','ų'=>'u',
    'ŵ'=>'w','ý'=>'y','ÿ'=>'y','ŷ'=>'y','ź'=>'z','ż'=>'z','ž'=>'z',
];

function nrm(?string $v): string
{
    $v = mb_strtolower((string) $v, 'UTF-8');
    $v = strtr($v, ['ä' => 'ae', 'ö' => 'oe', 'ü' => 'ue', 'ß' => 'ss']);
    $v = strtr($v, AKZENTE);
    $v = preg_replace('/(?:strasse|str\.?)\b/u', 'str', $v) ?? $v;
    return preg_replace('/[^a-z0-9]/', '', $v) ?? '';
}

/** Wie house() im Browser: Zahl plus normalisierter Zusatz, sonst null. */
function hausnummer(string $v): ?array
{
    if (!preg_match('/^\s*(\d+)\s*([A-Za-z0-9\-\/ ]*)\s*$/', $v, $m)) {
        return null;
    }
    // Hausnummernbereiche wie "17-21" sind keine Zusaetze: der amtliche Bestand
    // kennt als Zusatz nur Buchstaben. Gerechnet wird mit der ersten Nummer.
    $zusatz = nrm($m[2]);
    if (preg_match('/\d/', $zusatz)) {
        $zusatz = '';
    }
    return [(int) $m[1], $zusatz];
}

/** Wie span(): ungerade Nummern gegen Feld 0, gerade gegen Feld 1. */
function inSpanne(array $row, int $n): bool
{
    $z = $n % 2 ? ($row[0] ?? null) : ($row[1] ?? null);
    return is_array($z) && $n >= $z[0] && $n <= $z[1];
}

function lade(string $pfad)
{
    // Innerhalb einer Anfrage wird jede Datei hoechstens einmal gelesen.
    static $cache = [];
    if (!array_key_exists($pfad, $cache)) {
        $roh = @file_get_contents($pfad);
        $cache[$pfad] = $roh === false ? null : json_decode($roh, true);
    }
    return $cache[$pfad];
}

function shard(string $key): string
{
    return sprintf('%02d', crc32($key) % SHARDS);
}

function raus(array $obj, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($obj, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function aktion_suche(string $q, string $plz, int $max): array
{
    $k = nrm($q);
    $plz = trim($plz);
    $max = max(1, min(50, $max));
    if ($k === '') {
        return [];
    }
    $index = lade(DATEN . '/suche.json');
    if ($index === null) {
        return ['fehler' => 'Datenbestand fehlt'];
    }
    $treffer = [];
    foreach ($index as $x) {
        // [0]=id [1]=name [2]=key [3]=ort [4]=region [5]=namenslaenge [6]=ortsrang [7]=paare
        if (strpos($x[2], $k) === false) {
            continue;
        }
        if ($plz !== '') {
            $hat = false;
            foreach ($x[7] as $p) {
                if ($p[0] === $plz) { $hat = true; break; }
            }
            if (!$hat) {
                continue;
            }
        }
        $treffer[] = $x;
    }
    usort($treffer, static function (array $a, array $b) use ($k): int {
        $pa = strpos($a[2], $k) === 0 ? 0 : 1;
        $pb = strpos($b[2], $k) === 0 ? 0 : 1;
        return ($pa - $pb) ?: (($a[5] - $b[5]) ?: ($a[6] - $b[6]));
    });
    $out = [];
    foreach (array_slice($treffer, 0, $max) as $x) {
        $areas = [];
        foreach ($x[7] as $p) {
            if (($plz === '' || $p[0] === $plz) && $p[1] !== '' && !in_array($p[1], $areas, true)) {
                $areas[] = $p[1];
            }
        }
        // Postleitzahlen mitgeben: hat die Strasse genau eine, kann das Formular
        // sie nach der Auswahl selbst eintragen.
        $zips = [];
        foreach ($x[7] as $p) {
            if ($p[0] !== '' && !in_array($p[0], $zips, true)) {
                $zips[] = $p[0];
            }
        }
        sort($zips);
        $out[] = ['id' => $x[0], 'name' => $x[1], 'city' => $x[3], 'region' => $x[4], 'areas' => $areas, 'zips' => $zips];
    }
    return $out;
}

function aktion_ort(string $plz): array
{
    $plz = trim($plz);
    if (!preg_match('/^\\d{5}$/', $plz)) {
        return ['plz' => $plz, 'orte' => [], 'bekannt' => false];
    }
    $karte = lade(DATEN . '/plz.json') ?? [];
    $e = $karte[$plz] ?? null;
    if ($e === null) {
        return ['plz' => $plz, 'orte' => [], 'bekannt' => false];
    }
    return ['plz' => $plz, 'orte' => $e['orte'], 'bekannt' => true];
}

function ohneHausnummer(array $e, string $id, string $plz): array
{
    $entry = ['id' => $id, 'name' => $e['n'], 'city' => $e['o'], 'region' => $e['r']];
    // Den Preis bestimmt das Veedel. Die Hausnummer wird also nur gebraucht,
    // wenn die Strasse innerhalb der Postleitzahl durch mehrere Veedel laeuft -
    // das trifft auf 2,5 Prozent der Strassen zu.
    $gebiete = [];
    foreach ($e['b'] as $b) {
        if ($plz === '' || $b[2] === $plz) {
            $gebiete[$b[2] . '|' . ($b[3] ?? '')] = [$b[2], $b[3] ?? ''];
        }
    }
    if (count($gebiete) !== 1) {
        return ['valid' => false,
                'message' => count($gebiete) > 1
                    ? 'Diese Straße verläuft durch mehrere Veedel. Bitte die Hausnummer angeben.'
                    : 'Straße und Postleitzahl passen nicht zusammen.',
                'entry' => $entry, 'candidates' => []];
    }
    [$zip, $area] = array_values($gebiete)[0];
    $kandidat = [
        'region' => $e['r'], 'city' => $e['o'], 'area' => $area, 'zip' => $zip,
        'street' => $e['n'], 'houseNumber' => null, 'supplement' => '',
        'zoneGroups' => (object) [], 'official' => true,
    ];
    return ['valid' => true,
            'message' => trim($zip . ' ' . $e['o']) . ($area ? ' · ' . $area : ''),
            'entry' => $entry, 'candidates' => [$kandidat]];
}

function aktion_adresse(string $id, string $nr, string $plz): array
{
    $plz = trim($plz);
    // Leere Postleitzahl ist erlaubt: mit Strasse und Hausnummer laesst sie sich
    // bestimmen. Dann werden alle Postleitzahlen der Strasse durchprobiert.
    if ($plz !== '' && !preg_match('/^\d{5}$/', $plz)) {
        return ['valid' => false, 'message' => 'Bitte eine fünfstellige Postleitzahl eingeben.', 'candidates' => []];
    }
    $strassen = lade(DATEN . '/strassen/' . shard($id) . '.json') ?? [];
    $e = $strassen[$id] ?? null;
    if ($e === null) {
        return ['valid' => false, 'message' => 'Bitte eine Straße aus der Liste auswählen.', 'candidates' => []];
    }
    // Ohne Hausnummer geht es, wenn der Wert an dieser Strasse ueberall gleich
    // ist - das trifft auf rund vier von fuenf Strassen zu. Wo die Strasse durch
    // mehrere Richtwertzonen laeuft, entscheidet die Hausnummer ueber den Preis
    // (Weisshausstr.: ungerade 4.770, gerade 3.510 EUR/m2), dann wird sie verlangt.
    if (trim($nr) === '') {
        return ohneHausnummer($e, $id, $plz);
    }
    $h = hausnummer($nr);
    if ($h === null) {
        return ['valid' => false, 'message' => 'Bitte eine gültige Hausnummer eingeben.', 'candidates' => []];
    }
    [$n, $zusatz] = $h;

    $abschnitte = [];
    foreach ($e['b'] as $b) {
        if (($plz === '' || $b[2] === $plz) && (inSpanne($b, $n) || ($b[0] === null && $b[1] === null))) {
            $abschnitte[] = $b;
        }
    }
    $entry = ['id' => $id, 'name' => $e['n'], 'city' => $e['o'], 'region' => $e['r']];
    if (!$abschnitte) {
        return ['valid' => false, 'message' => 'Diese Hausnummer gibt es in dieser Straße und Postleitzahl nicht.',
                'entry' => $entry, 'candidates' => []];
    }

    $key = $e['r'] . '|' . $e['o'] . '|' . $e['k'];
    $amtlich = (lade(DATEN . '/adressen/' . shard($key) . '.json') ?? [])[$key] ?? [];
    $kandidaten = [];
    $gesehen = [];
    foreach ($abschnitte as $b) {
        foreach ($amtlich as $a) {
            if (!inSpanne($a, $n) || nrm((string) $a[2]) !== $zusatz) {
                continue;
            }
            $sig = $e['r'] . '|' . $e['o'] . '|' . $b[2] . '|' . ($b[3] ?? '') . '|'
                 . json_encode($a[3], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if (isset($gesehen[$sig])) {
                continue;
            }
            $gesehen[$sig] = true;
            $kandidaten[] = [
                'region' => $e['r'], 'city' => $e['o'], 'area' => $b[3], 'zip' => $b[2],
                'street' => $e['n'], 'houseNumber' => $n, 'supplement' => $zusatz,
                'zoneGroups' => (object) $a[3], 'official' => true,
            ];
        }
    }
    if (!$kandidaten) {
        return ['valid' => false, 'message' => 'Diese Adresse können wir nicht bestätigen. Bitte Hausnummer und Postleitzahl prüfen.',
                'entry' => $entry, 'candidates' => []];
    }
    $teile = [];
    foreach ($kandidaten as $c) {
        $teile[] = trim($c['zip'] . ' ' . $c['city']) . ($c['area'] ? ' · ' . $c['area'] : '');
    }
    return ['valid' => true, 'message' => implode(' / ', $teile), 'entry' => $entry, 'candidates' => $kandidaten];
}

// Der Pruefer laedt diese Datei als Bibliothek und ruft die Funktionen direkt auf.
if (defined('BEWERTUNG_ALS_BIBLIOTHEK')) {
    return;
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://romanbecker.de',
    'https://www.romanbecker.de',
    'https://immobilienmakler-bergisch-gladbach.de',
    'https://www.immobilienmakler-bergisch-gladbach.de',
    'https://leverkusen-makler.de',
    'https://www.leverkusen-makler.de',
    'https://makler-schael-sick.de',
    'https://www.makler-schael-sick.de',
];
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=300');

$aktion = $_GET['a'] ?? '';
if ($aktion === 'stand') {
    raus(lade(DATEN . '/stand.json') ?? ['fehler' => 'Datenbestand fehlt']);
}
if ($aktion === 'ort') {
    raus(aktion_ort((string) ($_GET['plz'] ?? '')));
}
if ($aktion === 'suche') {
    raus(aktion_suche((string) ($_GET['q'] ?? ''), (string) ($_GET['plz'] ?? ''), (int) ($_GET['max'] ?? 10)));
}
if ($aktion === 'adresse') {
    raus(aktion_adresse((string) ($_GET['id'] ?? ''), (string) ($_GET['nr'] ?? ''), (string) ($_GET['plz'] ?? '')));
}
raus(['fehler' => 'Unbekannte Aktion. Erlaubt: stand, ort, suche, adresse.'], 400);
