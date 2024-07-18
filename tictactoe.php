<?php

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Initialize the game board if not already set
if (!isset($_SESSION['board'])) {
    $_SESSION['board'] = array_fill(0, 9, '');
}
if (!isset($_SESSION['status'])){
    $_SESSION['state'] = 'not started';
}

function resetGame(){
    $_SESSION['board'] = array_fill(0, 9, '');
    $_SESSION['state'] = 'not started';
    return null;
}

// Function to check the winner
function check_winner($board, $state) {
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
    $action = isset($data['action']) ? $data['action'] : 'move';
    $response = [
        'success' => false,
        'message' => '',
        'state' => $_SESSION['state'],
        'board' => $_SESSION['board']
    ];

    
    if ($action === 'reset') {
        resetGame();
        $response['success'] = true;
        $response['message'] = 'Game has been reset.';
        $response['state'] = $_SESSION['state'];
        $response['board'] = $_SESSION['board'];
    }

    elseif ($action === 'move'){
        $position = $data['position'];
        $player = $data['player'];
        if (make_move($position, $player)) {
            $response['success'] = true;
            $response['board'] = $_SESSION['board'];
            $winner = check_winner($_SESSION['board'], $player);
            if ($winner) {
                $response['message'] = $winner === 'Draw' ? 'It\'s a draw!' : "Player $winner wins!";
                $response['state'] = 'ended';
                $_SESSION['board'] = array_fill(0, 9, ''); // Reset board after a win or draw
            }
        } else {
            $response['message'] = 'Invalid move. Try again.';
        }
    }
    else {
        $response['message'] = 'Invalid action.';
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}

