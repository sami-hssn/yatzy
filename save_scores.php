<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['playerXName'], $input['playerOName'], $input['playerXWins'], $input['playerOWins'])) {
    $playerXName = $input['playerXName'];
    $playerOName = $input['playerOName'];
    $playerXWins = $input['playerXWins'];
    $playerOWins = $input['playerOWins'];

    // Database connection
    $conn = new mysqli('localhost', 'username', 'password', 'database');

    if ($conn->connect_error) {
        die(json_encode(['success' => false, 'message' => 'Database connection failed']));
    }

    $stmt = $conn->prepare("INSERT INTO leaderboard (playerXName, playerOName, playerXWins, playerOWins) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('ssii', $playerXName, $playerOName, $playerXWins, $playerOWins);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save scores']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}
?>
