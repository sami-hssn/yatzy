window.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const playAgainButton = document.getElementById('game--play-again');
    const finishButton = document.getElementById('game--finish');
    const startGameButton = document.getElementById('start-game');
    const message = document.getElementById('game--status');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const player1Wins = document.getElementById('player1-wins');
    const player2Wins = document.getElementById('player2-wins');
    const initialSetup = document.getElementById('initial-setup');
    const gameSection = document.getElementById('game');
    const scoreboard = document.getElementById('scoreboard');

    let playerXName = '';
    let playerOName = '';
    let playerXWins = 0;
    let playerOWins = 0;

    let currentPlayer='X';
    let state= 'not started';

    function updateScoreboard() {
        fetch('get_leaderboard.php')
            .then(response => response.json())
            .then(data => {
                scoreboard.innerHTML = data.map(entry => `
                    <li>${entry.playerXName}: ${entry.playerXWins} wins, ${entry.playerOName}: ${entry.playerOWins} wins</li>
                `).join('');
            })
            .catch(error => console.error('Error updating scoreboard:', error));
    }

    function takeTurn(event){
        const selectedCell = event.target;
        const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index')); 
        if (state == 'started'){
            updateBoard(selectedCellIndex, currentPlayer)
                .then(response => {
                    console.log(response);
                    if (response.success) {
                        if (response.message== 'It\'s a draw!'){
                            selectedCell.innerHTML = currentPlayer;
                            message.innerHTML='It\'s a draw!';
                            playAgainButton.style.display = 'block';
                            finishButton.style.display = 'block';
                        }
                        else{
                            selectedCell.innerHTML = currentPlayer;
                            if (response.message) {
                                state= response.state;
                                message.innerText = `${currentPlayer === 'X' ? playerXName : playerOName} Wins!`;
                                if (currentPlayer === 'X') {
                                    playerXWins++;
                                    player1Wins.innerText = `${playerXName}: ${playerXWins} Wins`;
                                } else {    
                                    playerOWins++;
                                    player2Wins.innerText = `${playerOName}: ${playerOWins} Wins`;
                                }
                                playAgainButton.style.display = 'block';
                                finishButton.style.display = 'block';

                            }
                        }
                        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
                    } else {
                        message.innerHTML= response.message;
                    }
                });
            // Function to make AJAX call to update the board
            function updateBoard(position, player) {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'tictactoe.php', true); // Ensure this path is correct
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                resolve(JSON.parse(xhr.responseText));
                            } else {
                                reject('Error: ' + xhr.statusText);
                            }
                        }
                    };

                    const data = JSON.stringify({  action: 'move', position, player });
                    xhr.send(data);
                });
            }
        }
        else{            
            return;
        }
    }
    function resetGame() {
        console.log("gello");
        resetPHP().then(response => {
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.removeAttribute('data-player');
            });
            state= response.state;
            message.innerHTML='';
        }).catch(error => {
            console.error(error);
        });
        function resetPHP(){
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'tictactoe.php', true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.responseText));
                        } else {
                            reject('Error: ' + xhr.statusText);
                        }
                    }
                };

                const data = JSON.stringify({ action: 'reset' });
                xhr.send(data);
            });
        }
    }
    const TicTacToe = (function(){
        const game = {};
        game.player = 'X';
        game.index = 0; 
        game.status = 'not started';
        game.state = ['', '', '', '', '', '', '', '', ''];
            
        game.finishGame = function() {
            console.log('Finish game triggered');
            if (game.status === 'ended' || game.status === 'started') {
                saveScores(() => {
                    resetScores();
                    game.resetGame();
                    game.status = 'not started';
                    message.innerText = `Enter player names and start the game.`;
                    initialSetup.style.display = 'block';
                    gameSection.style.display = 'none';
                    playAgainButton.style.display = 'none';
                    finishButton.style.display = 'none';
                    updateScoreboard();  // Ensure scoreboard is updated after finishing the game
                    console.log('Game finished and reset');
                });
            }
        }

        function saveScores(callback) {
            console.log('Saving scores');
            fetch('save_scores.php', {
                method: 'POST',
                body: JSON.stringify({
                    playerXName: playerXName,
                    playerOName: playerOName,
                    playerXWins: playerXWins,
                    playerOWins: playerOWins
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Scores saved successfully');
                    if (typeof callback === 'function') {
                        callback();
                    }
                } else {
                    console.error('Failed to save scores');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
        function resetScores() {
            playerXWins = 0;
            playerOWins = 0;
            player1Wins.innerText = `${playerXName}: ${playerXWins} Wins`;
            player2Wins.innerText = `${playerOName}: ${playerOWins} Wins`;
        }

        return game;
    }());

    startGameButton.addEventListener('click', () => {
        playerXName = playerXNameInput.value;
        playerOName = playerONameInput.value;
        console.log(state);


        if (playerXName === '' || playerOName === '') {
            alert('Please enter names for both players.');
            return;
        }
        state= 'started';
        
        resetGame();

        initialSetup.style.display = 'none';
        gameSection.style.display = 'block';
        player1Wins.innerText = `${playerXName}: ${playerXWins} Wins`;
        player2Wins.innerText = `${playerOName}: ${playerOWins} Wins`;


    }); 

    playAgainButton.addEventListener('click', resetGame);
    finishButton.addEventListener('click', TicTacToe.finishGame);
    cells.forEach(cell => cell.addEventListener('click', takeTurn));

    updateScoreboard();
});
