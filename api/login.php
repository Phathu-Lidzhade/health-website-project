<?php
// api/login.php

// 1) Bring in your DB + auth helpers
require_once __DIR__ . '/../includes/formhandler-inc.php';
require_once __DIR__ . '/../includes/session-inc.php';

// 2) Tell the client we’re returning JSON
header('Content-Type: application/json');

// 3) Read and decode the JSON body
$input = json_decode(file_get_contents('php://input'), true);
$email      = $input['email']      ?? '';
$password   = $input['password']   ?? '';
$admin_code = $input['admin_code'] ?? '';

// 4) Authenticate (and promote to admin if applicable)
$user = loginUser($email, $password, $admin_code);

if ($user) {
    // 5) Start the session
    setUserSession($user);

    // 6) Send back success + role flag
    echo json_encode([
        'success'  => true,
        'is_admin' => (bool)$user['is_admin']
    ]);
} else {
    // 7) Login failed
    echo json_encode(['success' => false]);
}
