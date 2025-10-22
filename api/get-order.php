<?php
// Suppress HTML errors—log them instead
ini_set('display_errors', 0);
ini_set('log_errors',     1);
ini_set('error_log',      __DIR__ . '/../php-error.log');
error_reporting(E_ALL);

// Now includes and session
require_once __DIR__.'/../includes/dbh-inc.php';
require_once __DIR__.'/../includes/session-inc.php';

// session-inc.php already calls session_start(); remove any extra session_start() here
header('Content-Type: application/json');


// 1) Ensure user is logged in
if (empty($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}
$userId = $_SESSION['user_id'];

// 2) Fetch all orders for this user
$stmt = $pdo->prepare("
    SELECT 
      order_id,
      total,
      status,
      created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$userId]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3) For each order, fetch its items
foreach ($orders as &$order) {
    $stmt2 = $pdo->prepare("
        SELECT 
          oi.product_id,
          p.name          AS product_name,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN products p 
          ON p.product_id = oi.product_id
        WHERE oi.order_id = ?
    ");
    $stmt2->execute([$order['order_id']]);
    $items = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Attach items array to this order
    $order['items'] = $items;
}

unset($order); // break reference

// 4) Return the JSON payload
echo json_encode($orders);
exit;
