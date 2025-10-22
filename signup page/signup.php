<?php
require_once __DIR__ . '/../includes/formhandler-inc.php';

$full       = trim($_POST['fullname']   ?? '');
$surname    = trim($_POST['surname']     ?? '');
$email      = trim($_POST['email']       ?? '');
$password   = $_POST['password']         ?? '';
$admin_code = trim($_POST['admin_code']  ?? '');

$result = signupUser($full, $surname, $email, $password, $admin_code);
if ($result !== true) {
    die("Signup error: $result");
}

// Success → go to login
header('Location: ../index.html');
exit;
