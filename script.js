window.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const playAgainButton = document.getElementById('game--play-again');
    const finishButton = document.getElementById('game--finish');
    const startGameButton = document.getElementById('start-game');
    const message = document.getElementById('game--status');
    const startMessage = document.getElementById('start-message');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const player1Wins = document.getElementById('player1-wins');
    const player2Wins = document.getElementById('player2-wins');
    const initialSetup = document.getElementById('initial-setup');
    const gameSection = document.getElementById('game');
    const tableBody = document.querySelector('#data-table tbody');

    let playerXname = '';
    let playerOname = '';


    let currentPlayer='X';
    let state= 'not started';

    function takeTurn(event){
        const selectedCell = event.target;
        const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index')); 
        console.log(state);
        if (state == 'started'){
            updateBoard(selectedCellIndex, currentPlayer)
                .then(response => {
                    console.log(response);
                    state=response.state;
                    if (response.success) {
                        selectedCell.innerHTML = currentPlayer;
                        if (response.winner){
                            playAgainButton.style.display = 'block';
                            finishButton.style.display = 'block';
                            message.innerText=response.message;
                        }
                        else{
                            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                            message.innerText=currentPlayer+'\'s turn'; 
                        }
                        
                        player1Wins.innerText = playerXname+": "+response.pXwins;
                        player2Wins.innerText = playerOname+": "+response.pOwins;
                        
                    } else {
                        message.innerText= response.message;
                    }
                });
            function updateBoard(position, player) {
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
        resetPHP().then(response => {
            console.log(response);
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.removeAttribute('data-player');
            });
            state= response.state;
            message.innerText=response.message;
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
    function startGame() {
        playerXname = playerXNameInput.value;
        playerOname = playerONameInput.value;

        startPHP().then(response => {
            if (playerXname === '' || playerOname === '') {
                startMessage.innerText=('Please enter names for both players.');
                return;
            }
            console.log(response);
             
            initialSetup.style.display = 'none';
            gameSection.style.display = 'block'; 
            state= response.state;
            message.innerText=response.message;
            player1Wins.innerText = playerXname +' Wins';
            player2Wins.innerText = playerOname +' Wins';

        }).catch(error => {
            console.error(error);
        });
        function startPHP(){
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

                const data = JSON.stringify({ action: 'start' , playerXname, playerOname});
                xhr.send(data);
            });
        }
    }

    function finishGame() {
        finishPHP().then(response => {
            console.log(response);
            playerONameInput.value='';
            playerXNameInput.value='';
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.removeAttribute('data-player');
            });
            initialSetup.style.display = 'block';
            gameSection.style.display = 'none'; 
            getLeaderboard();
        }).catch(error => {
            console.error(error);
        });
        function finishPHP(){
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

                const data = JSON.stringify({ action: 'finish'});
                xhr.send(data);
            });
        }
    }
    function getLeaderboard() {
        leaderboardPHP().then(response => {
            console.log(response);
            data = response.leaderboard;
            data.forEach(item => {
                const row = document.createElement('tr');
        
                // Create table cells for name and wins
                const nameCell = document.createElement('td');
                nameCell.textContent = item.name;
                row.appendChild(nameCell);
        
                const winsCell = document.createElement('td');
                winsCell.textContent = item.wins;
                row.appendChild(winsCell);
        
                // Append the row to the table body
                tableBody.appendChild(row);
            });
        
        }).catch(error => {
            console.error(error);
        });
        function leaderboardPHP(){
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

                const data = JSON.stringify({ action: 'finish'});
                xhr.send(data);
            });
        }
    }
    



    startGameButton.addEventListener('click', startGame); 
    playAgainButton.addEventListener('click', resetGame);
    finishButton.addEventListener('click', finishGame);
    cells.forEach(cell => cell.addEventListener('click', takeTurn));

    getLeaderboard();
});
