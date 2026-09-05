<?php
define('BEWERTUNG_ALS_BIBLIOTHEK', true);
require '/Users/rob1/romanbecker.de/roman/bewertung-adressen.php';
$f=[['koeln|Köln|weisshausstr','','50939'],['koeln|Köln|weisshausstr','23','50939'],
    ['koeln|Köln|deutzkalkerstr','','50679'],['bergisch-gladbach|Bergisch Gladbach|dolmanstr','','51427'],
    ['koeln|Köln|aachenerstr','','50933'],['rhein-erft|Bedburg|ahornweg','','50181']];
foreach ($f as [$id,$nr,$plz]) {
    $r=aktion_adresse($id,$nr,$plz);
    printf("  %-28s nr='%-3s' → %-4s %s\n", explode('|',$id)[2], $nr, $r['valid']?'OK':'—', substr($r['message'],0,72));
}
