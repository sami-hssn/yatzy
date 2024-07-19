<?php
session_start();
header('Content-Type: application/json');
ob_start();

if (!isset($_SESSION['board'])) {
    $_SESSION['board'] = array_fill(0, 9, '');
}
if (!isset($_SESSION['state'])){
    $_SESSION['state'] = 'not started ';
}
if (!isset($_SESSION['Xwins']))   {
    $_SESSION['Xwins']=0;
}   
if (!isset($_SESSION['Owins']))   {
    $_SESSION['Owins']=0;
} 
if (!isset($_SESSION['Xname']))   {
    $_SESSION['Xname']='';
}   
if (!isset($_SESSION['Oname']))   {
    $_SESSION['Oname']='';
}  
   

function startGame($playerXname, $playerOname){
    $_SESSION['state']='started';
    $_SESSION['Xname']=$playerXname;
    $_SESSION['Oname']=$playerOname;
    $_SESSION['Xwins']=0;
    $_SESSION['Owins']=0;
    return null;  
}


function resetBoard(){
    $_SESSION['board'] = array_fill(0, 9, '');
    $_SESSION['state'] = 'started';
    return null;
}

// Function to check the winner
function check_winner($board, $player) {
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
function saveScores(){

}

// Handle AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : 'move';
    $response = [
        'success' => false,
        'message' => '',
        'winner'=> false, 
        'pXwins' => $_SESSION['Xwins'],
        'pOwins' => $_SESSION['Owins'], 
        'state' => $_SESSION['state'],
        'board' => $_SESSION['board']
    ];

    
    if ($action === 'reset') {
        resetBoard();
        $response['success'] = true;
        $response['message'] = 'New Game!';
        $response['pXwins'] = $_SESSION['Xwins'];
        $response['pOwins'] = $_SESSION['Owins'];
        $response['state'] = $_SESSION['state'];
        $response['board'] = $_SESSION['board'];
        $response['winner'] = false;
    }

    elseif ($action === 'move'){
        $position = $data['position'];
        $player = $data['player'];
        if (make_move($position, $player)) {
            $response['success'] = true;
            $winner = check_winner($_SESSION['board'], $player);
            if ($winner) {
                if ($winner=='X'){
                    $_SESSION['Xwins'] = $_SESSION['Xwins'] +1;
                    $response['winner']=$winner;
                    $response['state'] = 'ended';
                    $response['message'] = $_SESSION['Xname'].' wins!';
                }
                elseif($winner == 'O'){
                    $_SESSION['Owins'] = $_SESSION['Owins'] +1;
                    $response['winner']=$winner;
                    $response['state'] = 'ended';
                    $response['message'] = $_SESSION['Oname'].' wins!';
                }
                else{
                    $response['winner']=$winner;
                    $response['state'] = 'ended';
                    $response['message']= 'Its a Draw!';
                }

                $_SESSION['board'] = array_fill(0, 9, ''); 
            }
            $response['pOwins'] = $_SESSION['Owins'];
            $response['pXwins'] = $_SESSION['Xwins'];

        } else {
            $response['winner'] = false;
            $response['message'] = 'Invalid move. Try again.';
        }
    }

    elseif ($action === 'start'){
        $playerXname = $data['playerXname'];
        $playerOname = $data['playerOname'];
        resetBoard();
        startGame($playerXname, $playerOname);
        $response['success'] = true;
        $response['message'] = 'New Session!';
        $response['pXwins'] = $_SESSION['Xwins'];
        $response['pOwins'] = $_SESSION['Owins'];
        $response['winner']= false;
        $response['state'] = $_SESSION['state'];
        $response['board'] = $_SESSION['board'];
    }
    elseif ($action === 'finish') {
        session_unset(); 
        session_destroy(); 

        $response['success'] = true;
        $response['message'] = 'Session ended!';
    }
    else {
        $response['message'] = 'Invalid action.';
    }


    echo json_encode($response);
    ob_end_flush();
}

