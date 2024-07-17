<?php

session_start();

// Initialize the game board if not already set
if (!isset($_SESSION['board'])) {
    $_SESSION['board'] = array_fill(0, 9, '');
}

// Function to check the winner
function check_winner($board) {
    $winning_combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    foreach ($winning_combinations as $combination) {
        if ($board[$combination[0]] !== '' && 
            $board[$combination[0]] === $board[$combination[1]] && 
            $board[$combination[1]] === $board[$combination[2]]) {
            return $board[$combination[0]];
        }
    }

    if (!in_array('', $board)) {
        return 'Draw';
    }

    return null;
}

// Function to handle the game move
function make_move($position, $player) {
    if ($_SESSION['board'][$position] === '') {
        $_SESSION['board'][$position] = $player;
        
        return true;
    }
    return false;
}

// Handle AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $position = $data['position'];
    $player = $data['player'];

    $response = [
        'success' => false,
        'message' => '',
        'board' => $_SESSION['board']
    ];

    if (make_move($position, $player)) {
        $response['success'] = true;
        $response['board'] = $_SESSION['board'];
        $winner = check_winner($_SESSION['board']);
        if ($winner) {
            $response['message'] = $winner === 'Draw' ? 'It\'s a draw!' : "Player $winner wins!";
            $_SESSION['board'] = array_fill(0, 9, ''); // Reset board after a win or draw
        }
    } else {
        $response['message'] = 'Invalid move. Try again.';
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}

