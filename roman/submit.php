<?php
// Erlaubt den Bewertungs- und Kontaktstrecken der freigegebenen Websites
// den serverseitigen Lead-Versand über diesen bestehenden SMTP-Endpunkt.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://doktorbecker.de',
    'http://doktorbecker.de',
    'https://immobilienmakler-bergisch-gladbach.de',
    'https://www.immobilienmakler-bergisch-gladbach.de',
];
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Honeypot: für Menschen unsichtbares Feld. Wenn befüllt, ist es ein Bot —
// stillschweigend mit Erfolg antworten, ohne Mail zu versenden.
if (!empty($_POST['website'] ?? '')) {
    http_response_code(200);
    exit('OK');
}

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Hilfsfunktion
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')));
}

// Kontaktfelder
$vorname        = clean($_POST['vorname'] ?? '');
$nachname       = clean($_POST['nachname'] ?? '');
$name_raw       = trim($_POST['name'] ?? ($vorname . ($vorname && $nachname ? ' ' : '') . $nachname));
$name           = clean($name_raw);
$telefon        = clean($_POST['telefon'] ?? '');
$email          = clean($_POST['email'] ?? '');
$immobilientyp  = clean($_POST['immobilientyp'] ?? '');
$preisspanne    = clean($_POST['preisspanne'] ?? '');
$nachricht      = clean($_POST['nachricht'] ?? '');
$empfohlen      = clean($_POST['empfohlen'] ?? '');
$site            = clean($_POST['site'] ?? 'roman');

// Kontakt-Adresse des Interessenten
$kontakt_strasse = clean($_POST['kontakt_strasse'] ?? '');
$kontakt_plz     = clean($_POST['kontakt_plz']     ?? '');
$kontakt_ort     = clean($_POST['kontakt_ort']     ?? '');

// Immobilien-Adresse (neue Felder aus Step 2)
$immo_strasse   = clean($_POST['immo_strasse'] ?? '');
$immo_plz       = clean($_POST['immo_plz'] ?? $_POST['plz'] ?? '');
$immo_ort       = clean($_POST['immo_ort'] ?? $_POST['stadt'] ?? '');

// Immobilienbewertung – Objektdaten
$objektart          = clean($_POST['objektart'] ?? '');
$wohnflaeche        = clean($_POST['wohnflaeche'] ?? '');
$grundstuecksflaeche = clean($_POST['grundstuecksflaeche'] ?? '');
$zimmer             = clean($_POST['zimmer'] ?? '');
$einheiten          = clean($_POST['einheiten'] ?? '');
$erschliessung      = clean($_POST['erschliessung'] ?? '');
$zustand            = clean($_POST['zustand'] ?? '');
$baujahr            = clean($_POST['baujahr'] ?? '');
$miete_ist          = clean($_POST['miete_ist'] ?? '');
$miete_ist_jahr     = clean($_POST['miete_ist_jahr'] ?? '');
$miete_soll         = clean($_POST['miete_soll'] ?? '');
$miete_soll_jahr    = clean($_POST['miete_soll_jahr'] ?? '');
$ergebnis           = clean($_POST['ergebnis'] ?? '');
// Rechenweg ist mehrzeilig - clean() wuerde die Umbrueche fressen.
$rechenweg          = trim((string)($_POST['rechenweg'] ?? ''));
$rechenweg          = str_replace(["\r"], '', $rechenweg);
$rechenweg          = preg_replace('/[^\P{C}\n]+/u', '', $rechenweg);

// Pflichtfelder prüfen
if (empty($name) || empty($telefon)) {
    http_response_code(400);
    exit('Name und Telefon sind Pflichtfelder.');
}

// Betreff je nach Formulartyp
$type = $_POST['type'] ?? 'kontakt';
$siteLabel = $site === 'BGL' ? 'immobilienmakler-bergisch-gladbach.de' : 'romanbecker.de';
$subject = $type === 'immobilienbewertung'
    ? 'Neue Immobilienbewertung von ' . $name . ' – ' . $siteLabel
    : 'Neue Kontaktanfrage von ' . $name . ' – ' . $siteLabel;

// E-Mail-Body
$body = "Neue Anfrage über $siteLabel\n";
$body .= "================================\n\n";

// Kontaktdaten
$body .= "── KONTAKT ──────────────────────\n";
$body .= "Name:     $name\n";
$body .= "Telefon:  $telefon\n";
if ($email)           $body .= "E-Mail:   $email\n";
if ($kontakt_strasse) $body .= "Straße:   $kontakt_strasse\n";
if ($kontakt_plz || $kontakt_ort) $body .= "Ort:      $kontakt_plz $kontakt_ort\n";

// Immobilien-Adresse
if ($immo_strasse || $immo_plz || $immo_ort) {
    $body .= "\n── ADRESSE DER IMMOBILIE ────────\n";
    if ($immo_strasse) $body .= "Straße:   $immo_strasse\n";
    if ($immo_plz)     $body .= "PLZ:      $immo_plz\n";
    if ($immo_ort)     $body .= "Ort:      $immo_ort\n";
}

// Objektdaten
if ($objektart || $wohnflaeche || $grundstuecksflaeche || $zustand || $baujahr || $immobilientyp) {
    $body .= "\n── OBJEKT ───────────────────────\n";
    if ($immobilientyp)       $body .= "Typ:               $immobilientyp\n";
    if ($objektart)           $body .= "Objektart:         $objektart\n";
    if ($wohnflaeche)         $body .= "Wohnfläche:        $wohnflaeche m²\n";
    if ($grundstuecksflaeche) $body .= "Grundstücksfläche: $grundstuecksflaeche m²\n";
    if ($zimmer)              $body .= "Zimmer:            $zimmer\n";
    if ($einheiten)           $body .= "Wohneinheiten:     $einheiten\n";
    if ($erschliessung)       $body .= "Erschließung:      $erschliessung\n";
    if ($zustand)             $body .= "Zustand:           $zustand\n";
    if ($baujahr)             $body .= "Baujahr:           $baujahr\n";
    if ($miete_ist)           $body .= "Kaltmiete IST:     $miete_ist €/Monat\n";
    if ($miete_ist_jahr)      $body .= "Kaltmiete IST:     $miete_ist_jahr €/Jahr\n";
    if ($miete_soll)          $body .= "Kaltmiete SOLL:    $miete_soll €/Monat\n";
    if ($miete_soll_jahr)     $body .= "Kaltmiete SOLL:    $miete_soll_jahr €/Jahr\n";
}

// Ergebnis
if ($ergebnis) {
    $body .= "\n── BEWERTUNGSERGEBNIS ───────────\n";
    $body .= "Geschätzter Wert:  $ergebnis\n";
}

// Rechenweg: macht nachvollziehbar, wie der Wert zustande kam.
// Fehlt er, obwohl ein Ergebnis vorliegt, hat der Browser eine alte
// Fassung der Seite aus dem Cache ausgefuehrt - das soll sichtbar sein,
// statt den Abschnitt stillschweigend wegzulassen.
if (!$rechenweg && $ergebnis) {
    $body .= "\n── RECHENWEG ────────────────────\n";
    $body .= "Nicht uebermittelt. Die Seite lief beim Absenden aus dem\n";
    $body .= "Browser-Cache in einer Fassung vor dem 22.08.2026.\n";
}
if ($rechenweg) {
    $body .= "\n── RECHENWEG ────────────────────\n";
    foreach (explode("\n", $rechenweg) as $i => $zeile) {
        $zeile = trim($zeile);
        if ($zeile !== '') $body .= ($i + 1) . ") $zeile\n";
    }
}

// Sonstiges
if ($preisspanne) $body .= "\nPreisspanne: $preisspanne\n";
if ($empfohlen)   $body .= "Empfohlen von: $empfohlen\n";
if ($nachricht)   $body .= "\nNachricht:\n$nachricht\n";

// Lead zuerst dauerhaft sichern, BEVOR der Mailversand versucht wird.
// So geht die Anfrage nicht verloren, selbst wenn SMTP komplett ausfällt.
$leadRecord = [
    'zeit'     => date('c'),
    'type'     => $type,
    'name'     => $name,
    'telefon'  => $telefon,
    'email'    => $email,
    'immo_ort' => $immo_ort,
    'ergebnis' => $ergebnis,
    'rechenweg' => $rechenweg,
    'mail_sent' => null, // wird unten gesetzt
];
$leadLogPath = __DIR__ . '/leads.log';

$mail = new PHPMailer(true);
$mailSent = false;
$mailError = '';

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
    if ($site === 'BGL') {
        $mail->addAddress('Doreen.Kaschner@evernest.com', 'Doreen Kaschner');
    }
    if (!empty($email)) {
        $mail->addReplyTo($email, $name);
    }

    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();
    $mailSent = true;
} catch (Exception $e) {
    $mailSent = false;
    $mailError = $e->getMessage();
}

$leadRecord['mail_sent'] = $mailSent;
if (!$mailSent) {
    $leadRecord['mail_error'] = $mailError;
}
@file_put_contents($leadLogPath, json_encode($leadRecord, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

if ($mailSent) {
    http_response_code(200);
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Fehler beim Senden.';
}
