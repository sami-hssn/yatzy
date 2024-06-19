window.addEventListener('DOMContentLoaded', () => { //Waits for the html to load before running the script
    const cells = document.querySelectorAll('.cell'); //Connecting to the cells in the html
    const resetButton = document.getElementById('game--restart'); //Connecting to the reset button in the html 
    const message = document.getElementById('game--status'); //Connecting to the game status text area in the html 
    

    //TicTacToe object representing a game 
    var TicTacToe = (function(){

        //Setting Initial state of game
        var game ={};
        game.player='X';
        message.innerText=`${game.player}'s Turn`;
        game.index=0; 
        game.status='started';
        game.state=['', '', '', 
                    '', '', '', 
                    '', '', ''];

        
        game.takeTurn = function(event){
            const selectedCell = event.target;//gets the cell that was clicked on event
            const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index')); //gets the index if the selected cell
            
            if (game.status=='ended'){
                return;
            }

            if (game.state[selectedCellIndex]==''){ //Checks that the player isn't trying to play in a cell that has a symbol already 
                
                game.state [selectedCellIndex] = game.player; //Adds players symbol to game
                selectedCell.innerHTML = game.player; //Adds players symbol to board
                console.log(game.state); //For debug purposes 
                
                //