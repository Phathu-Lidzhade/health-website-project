<?php
require_once __DIR__ . '/includes/session-inc.php';
session_unset();
session_destroy();
header('Location: login.html');
exit;
