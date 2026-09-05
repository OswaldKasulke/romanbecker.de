<?php
define('BEWERTUNG_ALS_BIBLIOTHEK', true);
require '/Users/rob1/romanbecker.de/roman/bewertung-adressen.php';
foreach (['51427','50226','50679','99999','abc'] as $p) {
    $r = aktion_ort($p);
    printf("  %-6s bekannt=%s  Orte: %s\n", $p, $r['bekannt']?'ja ':'nein', implode(', ', $r['orte']) ?: '—');
}
