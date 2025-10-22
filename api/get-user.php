<?php
// api/get-user.php
require_once __DIR__ . '/../includes/session-inc.php';
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
  echo json_encode(['success' => false]);
  exit;
}

// you’ll also need to fetch the name from the DB
require_once __DIR__ . '/../includes/dbh-inc.php';
$stmt = $pdo->prepare('SELECT fullname FROM users WHERE user_id=?');
$stmt->execute([ $_SESSION['user_id'] ]);
$name = $stmt->fetchColumn();

echo json_encode([
  'success' => true,
  'name'    => $name
]);
