<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Felder auslesen und säubern
// Unterstützt beide Varianten: 'name' (Kontaktformular) und 'vorname'+'nachname' (Bewertungsformular)
$vorname        = trim($_POST['vorname'] ?? '');
$nachname       = trim($_POST['nachname'] ?? '');
$name_raw       = trim($_POST['name'] ?? ($vorname . ($vorname && $nachname ? ' ' : '') . $nachname));
$name           = htmlspecialchars(strip_tags($name_raw));
$telefon        = htmlspecialchars(strip_tags(trim($_POST['telefon'] ?? '')));
$email          = htmlspecialchars(strip_tags(trim($_POST['email'] ?? '')));
$immobilientyp  = htmlspecialchars(strip_tags(trim($_POST['immobilientyp'] ?? '')));
$plz            = htmlspecialchars(strip_tags(trim($_POST['plz'] ?? '')));
$preisspanne    = htmlspecialchars(strip_tags(trim($_POST['preisspanne'] ?? '')));
$nachricht      = htmlspecialchars(strip_tags(trim($_POST['nachricht'] ?? '')));
$empfohlen      = htmlspecialchars(strip_tags(trim($_POST['empfohlen'] ?? '')));

// Zusatzfelder Immobilienbewertung
$objektart      = htmlspecialchars(strip_tags(trim($_POST['objektart'] ?? '')));
$wohnflaeche    = htmlspecialchars(strip_tags(trim($_POST['wohnflaeche'] ?? '')));
$baujahr        = htmlspecialchars(strip_tags(trim($_POST['baujahr'] ?? '')));
$ergebnis       = htmlspecialchars(strip_tags(trim($_POST['ergebnis'] ?? '')));

// Pflichtfelder prüfen
if (empty($name) || empty($telefon)) {
    http_response_code(400);
    exit('Name und Telefon sind Pflichtfelder.');
}

// Betreff je nach Formulartyp
$type = $_POST['type'] ?? 'kontakt';
$subject = $type === 'immobilienbewertung'
    ? 'Neue Immobilienbewertung von ' . $name . ' – romanbecker.de'
    : 'Neue Kontaktanfrage von ' . $name . ' – romanbecker.de';

// E-Mail-Body
$body = "Neue Anfrage über romanbecker.de\n";
$body .= "================================\n\n";
$body .= "Name: $name\n";
$body .= "Telefon: $telefon\n";
if ($email)        $body .= "E-Mail: $email\n";
if ($immobilientyp) $body .= "Immobilientyp: $immobilientyp\n";
if ($objektart)    $body .= "Objektart: $objektart\n";
if ($wohnflaeche)  $body .= "Wohnfläche: $wohnflaeche m²\n";
if ($baujahr)      $body .= "Baujahr: $baujahr\n";
if ($plz)          $body .= "PLZ: $plz\n";
if ($preisspanne)  $body .= "Preisspanne: $preisspanne\n";
if ($ergebnis)     $body .= "Geschätzter Wert: $ergebnis\n";
if ($empfohlen)    $body .= "Empfohlen von: $empfohlen\n";
if ($nachricht)    $body .= "\nNachricht:\n$nachricht\n";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(SMTP_USER, 'Webseite Roman Becker');
    $mail->addAddress('rb@datenschwester.de', 'Roman Becker');
    if (!empty($email)) {
        $mail->addReplyTo($email, $name);
    }

    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();
    http_response_code(200);
    echo 'OK';
} catch (Exception $e) {
    http_response_code(500);
    echo 'Fehler beim Senden.';
}
