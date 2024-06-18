document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    var TicTacToe = (function(){
        var game ={};
        game.state=['', '', '', 
                    '', '', '', 
                    '', '', ''];

        game.player='X';
        game.winner='';

        game.takeTurn = function(event){
            const selectedCell = event.target;
            const selectedCellIndex = parseInt(selectedCell.getAttribute('data-cell-index'));
            game [selectedCellIndex] = game.player;
            if (checkWin()){
                announceWinner();
            }
            else if (checkDraw()){
                announceDraw();
            }
            else{
                changePlayer();
            }
            
        }
        game.resetGame= function(){
            //Implement Reset
        }

        function changePlayer(){
            if (this.player=='X'){
                this.player='Y';
            }
            else{
                this.player='X';
            }
        }
        function checkWin(){
            //Implement checkWin
            return true;
        }
        function checkDraw(){
            //Implement checkDraw
            return false;
        }

        function announceWinner(){
            if (this.player=='X'){
                game.winner='X'
            }
            else{
                this.winner='Y';
            }
            this.resetGame();
        }
        function announceDraw(){
            //Implement announceDraw
        }
    return game;
    }());   
});