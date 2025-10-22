<?php

$dsn = "mysql:host=localhost;dbname=pharmacy_db";
$dbusername = "root";
$dbpassword = "";

try {
  $pdo = new PDO($dsn, $dbusername, $dbpassword);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOExcepton $e) {
  echo "Connection failed: " . $e->getMessage();
}
