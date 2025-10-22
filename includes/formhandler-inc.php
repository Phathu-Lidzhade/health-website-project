<?php
require_once 'dbh-inc.php';

// Your single shared admin code
define('ADMIN_CODE', 'admincode123');

/*
 Register a new user.
 Returns true on success, or an error message string on failure.
 */
function signupUser(string $full, string $surname, string $email, string $password, string $adminCode = '') {
    global $pdo;

    // Check if email is already taken
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        return 'That email is already registered.';
    }

    // Hash the password
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Determine is_admin flag
    $isAdmin = ($adminCode === ADMIN_CODE) ? 1 : 0;

    // Insert new user
    $ins = $pdo->prepare(
        'INSERT INTO users (fullname, surname, email, pwd, is_admin)
         VALUES (?, ?, ?, ?, ?)'
    );
    $ins->execute([$full, $surname, $email, $hash, $isAdmin]);

    return true;
}

/*
 Log in an existing user by email.
 Returns user array (with keys id, pass_hash, is_admin) or false on failure.
 */
function loginUser(string $email, string $password, string $adminCode = '') {
    global $pdo;

    // Fetch row using email
    $stmt = $pdo->prepare(
        'SELECT 
           user_id   AS id, pwd       AS pass_hash, is_admin
         FROM users
         WHERE email = ?'
    );
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (! $user) {
        return false;
    }

    // Verify password
    if (! password_verify($password, $user['pass_hash'])) {
        return false;
    }

    // If they supply the admin code now and weren't admin before, promote
    if (! $user['is_admin'] && $adminCode === ADMIN_CODE) {
        $upd = $pdo->prepare('UPDATE users SET is_admin = 1 WHERE user_id = ?');
        $upd->execute([$user['id']]);
        $user['is_admin'] = 1;
    }

    return $user;
}
