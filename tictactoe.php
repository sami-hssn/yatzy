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
   
class Db
{
    private static $connection;

    public static function connect()
    {
        if (!self::$connection) {
            $connectionString = "host=localhost port=5432 dbname=tictactoe";
            self::$connection = pg_connect($connectionString);
            
            if (!self::$connection) {
                die("Connection failed: " . pg_last_error());
            }
        }
        return self::$connection;
    }

    public static function sql($sql, $params = [])
    {
        $dbconn = self::connect();
        $result = pg_query_params($dbconn, $sql, $params);
        
        if (!$result) {
            die("Error in SQL query: " . pg_last_error());
        }

        $data = pg_fetch_all($result, PGSQL_ASSOC);
        return $data === false ? [] : $data;
    }

    public static function insert($sql, $params)
    {
        $dbconn = self::connect();
        
        if (!$dbconn) {
            error_log("Database connection failed.");
            die("Database connection failed.");
        }
        error_log("Database connection success.");
        $result = pg_query_params($dbconn, $sql, $params);
        
        if (!$result) {
            error_log("Error in SQL query: " . pg_last_error());
            error_log("SQL: " . $sql);
            error_log("Params: " . print_r($params, true));
            die("Error in SQL query: " . pg_last_error());
        } else {
            error_log("Insert successful: " . $sql);
        }
    }
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



function saveScores() {
    $playerX = [
        'name' => $_SESSION['Xname'],
        'wins' => $_SESSION['Xwins']
    ];
    $playerO = [
        'name' => $_SESSION['Oname'],
        'wins' => $_SESSION['Owins']
    ];
    // Determine the player with more wins
    $topPlayer = ($playerX['wins'] > $playerO['wins']) ? $playerX : $playerO;

 
    $sql = "INSERT INTO leaderboard (name, score) VALUES ($1, $2)";
    $params = [$topPlayer['name'], $topPlayer['wins']];
    Db::insert($sql, $params);
}

// Handle AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : 'move';
    $response = [
        'success' => false,
        'message' => '',
        'winner'=> '', 
        'pXwins' => $_SESSION['Xwins'],
        'pOwins' => $_SESSION['Owins'], 
        'state' => $_SESSION['state'],
        'board' => $_SESSION['board'],
        'db'=> []
    ];

    
    if ($action === 'reset') {
        resetBoard();
        $response['success'] = true;
        $response['message'] = 'New Game!';
        $response['pXwins'] = $_SESSION['Xwins'];
        $response['pOwins'] = $_SESSION['Owins'];
        $response['state'] = $_SESSION['state'];
        $response['board'] = $_SESSION['board'];
        $response['winner'] = '';
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
            $response['winner'] = '';
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
        $response['winner']= '';
        $response['state'] = $_SESSION['state'];
        $response['board'] = $_SESSION['board'];
    }
    elseif ($action === 'finish') {
        saveScores();
    
        session_unset();
        session_destroy();
    
        $response['success'] = true;
        $response['db']= Db::sql("Select * from leaderboard ORDER BY score DESC");
        $response['message'] = 'Session ended!';
    }
    elseif ($action === 'getLeaderboard') {
        $response['success'] = true;
        $response['db']= Db::sql("Select * from leaderboard ORDER BY score DESC");
        $response['message'] = 'Leaderbaord got';
        
    }
    else {
        $response['message'] = 'Invalid action.';
    }
    echo json_encode($response);
    ob_end_flush();
}

