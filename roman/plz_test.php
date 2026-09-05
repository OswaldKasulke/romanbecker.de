<?php
define('BEWERTUNG_ALS_BIBLIOTHEK', true);
require '/Users/rob1/romanbecker.de/roman/bewertung-adressen.php';
$f=[['koeln|Köln|deutzkalkerstr','60',''],['bergisch-gladbach|Bergisch Gladbach|dolmanstr','56',''],
    ['koeln|Köln|aachenerstr','300',''],['koeln|Köln|aachenerstr','1',''],['koeln|Köln|weisshausstr','23',''],
    ['koeln|Köln|weisshausstr','23','50939'],['koeln|Köln|weisshausstr','999','']];
foreach ($f as [$id,$nr,$plz]) {
    $r=aktion_adresse($id,$nr,$plz);
    $zips=array_values(array_unique(array_map(fn($c)=>$c['zip'],$r['candidates'])));
    printf("%-46s nr=%-4s plz='%s' → %s  %s\n", explode('|',$id)[2], $nr, $plz,
      $r['valid']?'PLZ '.implode('/',$zips):'—', substr($r['message'],0,52));
}
