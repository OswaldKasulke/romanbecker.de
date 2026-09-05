<?php
define('BEWERTUNG_ALS_BIBLIOTHEK', true);
require '/Users/rob1/romanbecker.de/roman/bewertung-adressen.php';
foreach ([['Dolmanstraße',''],['Weißhausstraße',''],['Aachener Str.',''],['Deutz-Kalker',''],['Hauptstraße','']] as [$q,$plz]) {
    foreach (array_slice(aktion_suche($q, $plz, 3), 0, 2) as $h) {
        echo str_pad($h['name'].' ('.$h['city'].')', 40), ' PLZ: ', implode(', ', $h['zips']), "\n";
    }
}
