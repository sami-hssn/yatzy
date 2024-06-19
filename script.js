document.addEventListener('DOMContentLoaded', () => { //Waits for the html to load before running the script
    
    const cells = document.querySelectorAll('.cell'); //Connecting to the cells in the html
    const resetButton = document.getElementById('game--restart'); //Connecting to the reset button in the html 
    

    //TicTacToe object representing a game 
    var TicTacToe = (function(){

        //Setting Initial state of game
        var game ={};
        game.state=['', '', '', 
                    '', '', '', 
                    '', '', ''];

        game.player='X';
        game.index=0; 

        
        game.takeTurn = function(event){
            const selectedCell = event.target;
            const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index'));

            if (game.state[selectedCellIndex]==''){
                game.state [selectedCellIndex] = game.player; //Adds players symbol to game
                selectedCell.innerHTML = game.player; //Adds players symbol to board
                console.log(game.state);
                
                if (checkWin()){
                    announceWinner();
                    console.log('Winner');
                }
                
                else if (checkDraw()){
                    announceDraw();
                    console.log('draw')
                }
            
                else{
                    console.log(game.index);
                    game.index++;
                    game.changePlayer();
                }
            }
            else{
            