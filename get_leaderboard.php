<?php
session_start();

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

header('Content-Type: application/json');
echo json_encode($_SESSION['leaderboard']);
?>