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
                //implement invalid move
            }

            
        }

        game.resetGame= function(){
            game.player='X';
            game.index=0;
            game.state.fill('');
            cells.forEach(cells=> cells.innerHTML='');


        }

        game.changePlayer= function(){
            if (game.player=='X'){
                game.player='O';
            }
            else{
                game.player='X';
            }
        }
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
        function checkDraw(){
            if (game.index==8){
                return true;
            }
            else{
                return false;
            }
        }
    

        function announceWinner(){
            //Implement announceWinner
        }
        function announceDraw(){
            //Implement announceDraw
        }
    return game;
    }());  

    resetButton.addEventListener('click', TicTacToe.resetGame);//Listening to the button and reseting the game if it is clicked
    cells.forEach(cell => cell.addEventListener('click', TicTacToe.takeTurn)); //Listening to the cells and taking a turn if one is clicked
});