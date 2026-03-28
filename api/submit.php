<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ─── Config ───────────────────────────────────────────────
define('DW_API_KEY',     'a34f3829b32b7c629059a780a0919a13');
define('DW_API_BASE',    'https://api.digitalwallet.cards');
define('DW_TEMPLATE_ID', 44718);
// ──────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$name      = trim($body['name'] ?? '');
$phone     = trim($body['phone'] ?? '');
$instagram = trim($body['instagram'] ?? '');

if (!$name || !$phone) {
    http_response_code(400);
    echo json_encode(['error' => 'Name und Telefonnummer sind Pflichtfelder']);
    exit;
}

// ─── Helper: API Request ──────────────────────────────────
function dw_request(string $method, string $path, array $data = []): array {
    $ch = curl_init(DW_API_BASE . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'X-API-Key: ' . DW_API_KEY,
        ],
        CURLOPT_POSTFIELDS     => $method !== 'GET' ? json_encode($data) : null,
    ]);
    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $decoded = json_decode($response, true);
    return ['status' => $status, 'body' => $decoded];
}
// ──────────────────────────────────────────────────────────

// 1. Customer erstellen
$customerRes = dw_request('POST', '/api/v2/customers', [
    'firstName' => $name,
    'phone'     => $phone,
]);

if ($customerRes['status'] !== 201) {
    http_response_code(500);
    echo json_encode(['error' => 'Kunde konnte nicht erstellt werden', 'details' => $customerRes['body']]);
    exit;
}

$customerId = $customerRes['body']['data']['id'];

// 2. Stempelkarte erstellen
$cardRes = dw_request('POST', '/api/v2/cards', [
    'templateId' => DW_TEMPLATE_ID,
    'customerId' => $customerId,
]);

if ($cardRes['status'] !== 201) {
    http_response_code(500);
    echo json_encode(['error' => 'Karte konnte nicht erstellt werden', 'details' => $cardRes['body']]);
    exit;
}

$card = $cardRes['body']['data'];

// 3. Antwort zurückgeben
echo json_encode([
    'success'     => true,
    'installLink' => $card['installLink'],
    'shareLink'   => $card['shareLink'],
    'appleLink'   => $card['directInstallLink']['apple'],
    'googleLink'  => $card['directInstallLink']['google'],
    'name'        => $name,
    'phone'       => $phone,
    'instagram'   => $instagram,
]);
