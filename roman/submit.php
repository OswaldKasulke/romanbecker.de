<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Felder auslesen und säubern
$name = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
$telefon = htmlspecialchars(strip_tags(trim($_POST['telefon'] ?? '')));
$email = htmlspecialchars(strip_tags(trim($_POST['email'] ?? '')));
$immobilientyp = htmlspecialchars(strip_tags(trim($_POST['immobilientyp'] ?? '')));
$plz = htmlspecialchars(strip_tags(trim($_POST['plz'] ?? '')));
$preisspanne = htmlspecialchars(strip_tags(trim($_POST['preisspanne'] ?? '')));
$nachricht = htmlspecialchars(strip_tags(trim($_POST['nachricht'] ?? '')));
$empfohlen = htmlspecialchars(strip_tags(trim($_POST['empfohlen'] ?? '')));

// Pflichtfelder prüfen
if (empty($name) || empty($telefon)) {
    http_response_code(400);
    exit('Name und Telefon sind Pflichtfelder.');
}

// E-Mail zusammenbauen
$to = 'rb@datenschwester.de';
$subject = 'Neue Kontaktanfrage von ' . $name . ' – romanbecker.de';

$body = "Neue Anfrage über romanbecker.de\n";
$body .= "================================\n\n";
$body .= "Name: $name\n";
$body .= "Telefon: $telefon\n";
$body .= "E-Mail: $email\n";
$body .= "Immobilientyp: $immobilientyp\n";
$body .= "PLZ: $plz\n";
$body .= "Preisspanne: $preisspanne\n";
$body .= "Empfohlen von: $empfohlen\n\n";
$body .= "Nachricht:\n$nachricht\n";

$headers = "From: noreply@fuerte.digital\r\n";
if (!empty($email)) {
    $headers .= "Reply-To: $email\r\n";
}
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    http_response_code(200);
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Fehler beim Senden.';
}
