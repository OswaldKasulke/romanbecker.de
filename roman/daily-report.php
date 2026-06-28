<?php
// Tägliche Kontroll-Mail: zählt anhand von leads.log, wie viele Anfragen
// in den letzten 24 Stunden eingegangen sind und ob der Mailversand jeweils
// geklappt hat. Aufruf per Cron mit Secret-Token, z.B.:
// https://romanbecker.de/daily-report.php?secret=...

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (($_GET['secret'] ?? '') !== REPORT_SECRET) {
    http_response_code(403);
    exit('Forbidden');
}

$logPath = __DIR__ . '/leads.log';
$since = time() - 24 * 3600;

$total = 0;
$sent = 0;
$failed = 0;
$failedDetails = [];

if (file_exists($logPath)) {
    $lines = file($logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $entry = json_decode($line, true);
        if (!$entry || !isset($entry['zeit'])) continue;
        $ts = strtotime($entry['zeit']);
        if ($ts === false || $ts < $since) continue;

        $total++;
        if (!empty($entry['mail_sent'])) {
            $sent++;
        } else {
            $failed++;
            $failedDetails[] = sprintf(
                '- %s | %s | %s | Fehler: %s',
                $entry['zeit'],
                $entry['name'] ?? '?',
                $entry['telefon'] ?? '?',
                $entry['mail_error'] ?? 'unbekannt'
            );
        }
    }
}

$subject = $failed > 0
    ? "⚠️ Tägliche Lead-Übersicht romanbecker.de: $total Anfragen, $failed FEHLGESCHLAGEN"
    : "Tägliche Lead-Übersicht romanbecker.de: $total Anfragen, alle zugestellt";

$body = "Letzte 24 Stunden:\n";
$body .= "Anfragen gesamt: $total\n";
$body .= "Erfolgreich per Mail zugestellt: $sent\n";
$body .= "Fehlgeschlagen: $failed\n";

if ($failed > 0) {
    $body .= "\nFehlgeschlagene Anfragen (Daten sind in leads.log gesichert, nichts verloren):\n";
    $body .= implode("\n", $failedDetails) . "\n";
}

try {
    $mail = new PHPMailer(true);
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
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->send();

    http_response_code(200);
    echo "Report gesendet: $total Anfragen, $sent zugestellt, $failed fehlgeschlagen.";
} catch (Exception $e) {
    http_response_code(500);
    echo 'Fehler beim Senden des Reports: ' . $e->getMessage();
}
