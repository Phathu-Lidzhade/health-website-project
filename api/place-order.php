<?php
// place-order.php
ini_set('display_errors', 0); // prevent errors from being shown as HTML
ini_set('display_startup_errors', 0);
error_reporting(E_ALL); // still log errors in logs if needed

require_once __DIR__ . '/../includes/dbh-inc.php';
require_once __DIR__ . '/../includes/session-inc.php';
header('Content-Type: application/json');


header('Content-Type: application/json');
if (empty($_SESSION['user_id'])) {
  echo json_encode(['success'=>false,'error'=>'Not logged in']);
  exit;
}
$userId = $_SESSION['user_id'];

$input = json_decode(file_get_contents('php://input'), true);
$cart  = $input['cart'] ?? [];

if (!count($cart)) {
  echo json_encode(['success'=>false,'error'=>'Cart empty']);
  exit;
}

try {
  $pdo->beginTransaction();

  // Calculate total
  $total = 0;
  foreach ($cart as $item) {
    $total += $item['price'] * $item['quantity'];
  }

  // Insert order
  $stmt = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
  $stmt->execute([$userId, $total]);
  $orderId = $pdo->lastInsertId();

  // Insert items
  $stmtItem = $pdo->prepare(
    "INSERT INTO order_items
       (order_id, product_id, quantity, price)
     VALUES
       (?, ?, ?, ?)"
  );
  foreach ($cart as $item) {
    $productId = (int)$item['id'];  // force convert to integer
    $quantity  = (int)$item['quantity'];
    $price     = (float)$item['price'];
  
    $stmtItem->execute([
      $orderId,
      $productId,
      $quantity,
      $price
    ]);
  }
  

  $pdo->commit();
  echo json_encode(['success'=>true, 'order_id'=>$orderId]);
} catch (Exception $e) {
  $pdo->rollBack();
  echo json_encode(['success'=>false, 'error'=>$e->getMessage()]);
}
