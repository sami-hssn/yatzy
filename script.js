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
                
                //If there is a win, announce it 
                if (checkWin()){
                    announceWinner();
                    console.log('Winner'); //For debug purposes
                }
                
                //If there is a draw, announce it 
                else if (checkDraw()){
                    announceDraw();
                    console.log('Draw')
                }
                
                //If no win or draw, prepare for next turn
                else{
                    console.log(game.index);
                    game.index++;
                    game.changePlayer();
                    message.innerText=`${game.player}'s Turn`;
                    
                }
            }
            //Informs player that they cannot play in a cell is already played in 
            else{
                message.innerText="Invalid Move - You can't play in a cell that is already populated";
            }

            
        }
        //resets the game data 
        game.resetGame= function(){
            game.player='X';
            game.index=0;
            game.state.fill('');
            game.status = 'started';
            message.innerText=`${game.player}'s Turn`;
            cells.forEach(cells=> cells.innerHTML='');
        }

        //Swaps the active player
        game.changePlayer= function(){
            if (game.player=='X'){
                game.player='O';
            }
            else{
                game.player='X';
            }
        }
        //Checked to see if any of the 8 winning conditions are met
        function checkWin(){
            
            //Top row
            if( game.state[0]==game.player && game.state[1]==game.player  && game.state[2]==game.player ){
                return true;
            }
            //Middle row
            else if( game.state[3]==game.player && game.state[4]==game.player  && game.state[5]==game.player){
                return true;
            }
            //Bottom row
            else if( game.state[6]==game.player && game.state[7]==game.player  && game.state[8]==game.player){
                return true;
            }
            //Right column
            else if( game.state[0]==game.player && game.state[3]==game.player  && game.state[6]==game.player){
                return true;
            }
            //Middle column 
            else if( game.state[1]==game.player && game.state[4]==game.player  && game.state[7]==game.player){
                return true;
            }
            //Left column
            else if( game.state[2]==game.player && game.state[5]==game.player  && game.state[8]==game.player){
                return true;
            }
            //left to right diagonal 
            else if( game.state[0]==game.player && game.state[4]==game.player  && game.state[8]==game.player){
                return true;
            }
            //right to left diagonal 
            else if( game.state[2]==game.player && game.state[4]==game.player  && game.state[6]==game.player){
                return true;
            }
            else{
                console.log("No winner")
                return false;
            }
            
        }
        //If 9 turns have been preformed without a win then it is a draw
        function checkDraw(){
            if (game.index==8){
                return true;
            }
            else{
                return false;
            }
        }
    
        //Display text congratulating winner
        function announceWinner(){
            message.innerText=`${game.player} Wins!`;
            game.status = 'ended';
        }

        //Display text saying there was a draw
        function announceDraw(){
            message.innerText=`Draw!`;
            game.status = 'ended';
        }

    return game;
    }());  
    resetButton.addEventListener('click', TicTacToe.resetGame);//Listening to the button and reseting the game if it is clicked
    cells.forEach(cell => cell.addEventListener('click', TicTacToe.takeTurn)); //Listening to the cells and taking a turn if one is clicked
});