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
        console.log(currentPlayer);
        console.log(selectedCellIndex);
        updateBoard(selectedCellIndex, currentPlayer)
                .then(response => {
                    if (response.success) {
                        selectedCell.innerHTML = currentPlayer;
                        if (response.message) {
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
                        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
                    } else {
                        message.innerHTML= 'here';
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
        
                        const data = JSON.stringify({ position, player });
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
            /*
        game.takeTurn = function(event){
            const selectedCell = event.target;
            const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index')); 

            if (game.status === 'not started') {
                message.innerText = `Please start the game by entering player names.`;
                return;
            }

            if (game.status === 'ended'){
                return;
            }

            if (game.state[selectedCellIndex] === '') {
                game.state[selectedCellIndex] = game.player;
                selectedCell.innerHTML = game.player;
                selectedCell.setAttribute('data-player', game.player);

                if (checkWin()){
                    announceWinner();
                } else if (checkDraw()){
                    announceDraw();
                } else {
                    game.index++;
                    game.changePlayer();
                    message.innerText = `${game.player}'s Turn`;
                }
            } else {
                message.innerText = "Invalid Move - You can't play in a cell that is already populated";
            }
        }
*/
        game.resetGame = function(){
            game.player = Math.random() < 0.5 ? 'X' : 'O';
            game.index = 0;
            game.state.fill('');
            game.status = 'started';
            message.innerText = `${game.player}'s Turn`;
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.removeAttribute('data-player');
            });
        }

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

        game.changePlayer = function(){
            game.player = (game.player === 'X') ? 'O' : 'X';
        }

        function checkWin(){
            const winConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], 
                [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                [0, 4, 8], [2, 4, 6]
            ];

            return winConditions.some(condition => {
                return condition.every(index => game.state[index] === game.player);
            });
        }

        function checkDraw(){
            return game.index === 8;
        }

        function announceWinner(){
            message.innerText = `${game.player === 'X' ? playerXName : playerOName} Wins!`;
            game.status = 'ended';
            if (game.player === 'X') {
                playerXWins++;
                player1Wins.innerText = `${playerXName}: ${playerXWins} Wins`;
            } else {    
                playerOWins++;
                player2Wins.innerText = `${playerOName}: ${playerOWins} Wins`;
            }
            playAgainButton.style.display = 'block';
            finishButton.style.display = 'block';
        }

        function announceDraw(){
            message.innerText = `Draw!`;
            game.status = 'ended';
            playAgainButton.style.display = 'block';
            finishButton.style.display = 'block';
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

        if (playerXName === '' || playerOName === '') {
            alert('Please enter names for both players.');
            return;
        }

        initialSetup.style.display = 'none';
        gameSection.style.display = 'block';
        player1Wins.innerText = `${playerXName}: ${playerXWins} Wins`;
        player2Wins.innerText = `${playerOName}: ${playerOWins} Wins`;
        TicTacToe.resetGame();
    });

    playAgainButton.addEventListener('click', TicTacToe.resetGame);
    finishButton.addEventListener('click', TicTacToe.finishGame);
    cells.forEach(cell => cell.addEventListener('click', takeTurn));

    updateScoreboard();
});
