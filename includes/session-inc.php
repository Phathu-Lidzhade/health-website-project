<?php
session_start();

// Save logged-in user info into session 
function setUserSession(array $user) {
    $_SESSION['user_id']  = $user['id'];
    $_SESSION['is_admin'] = (bool)$user['is_admin'];
}

// Redirect to login page if not authenticated
function requireLogin() {
    if (empty($_SESSION['user_id'])) {
        header('Location: login.html');
        exit;
    }
}

// Deny access if not an admin
function requireAdmin() {
    requireLogin();
    if (empty($_SESSION['is_admin'])) {
        http_response_code(403);
        exit('Access denied.');
    }
}
