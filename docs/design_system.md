# Design System:

The concept behind our visual design was playing Tic Tac Toe in class on a piece of paper. We wanted the players to feel as if they're playing it on paper together. To solidify this concept, we found the font 'Rock Salt' that ressembles the writing of a pencil and used it throughout the page for the title, within the game board, etc. 

The game randomly selects a player, either 'X' or 'O' to make the first move. Only a mouse is required to play the game. The player will click on the cell they would like to place their symbol in.

The game space is a 3x3 board. When interacting with each cell of the board, the cursor turns into a pointer, indicating the player can click the cell to make their move.  We made sure that the different players 'X' and 'O' were different colours so it is easier to distinguish between the two.

There is an option to restart the game with a button underneath the board. This button wipes the board and randomly selects one of the two players to start the new game. This can be used anytime during the game, whether it be halfway through or when the game ends.

# JS Implementation
The tic tac toe board is controlled with the 'script.js' folder. This file is wrapped with a function that waits for the window to fully load before it starts to execute the js. 

This file starts with 3 lines that assign elements in the HTML to variables in the JS using their IDs. These elements are the board cells, the reset button, and the text area where we can display info for the players.

The main part of the file is a TicTacToe object that contains a module 'game'. This game module has properties: player, index, status, and state. 
- The player property defines which player is currently playing. 
- The index property counts how many turns have been taken since the start of the game
- The status property indicates whether the game has ended or is in progress. 
- The state property is an array that represents the different cells on the board.

The module also provides a variety of different public(+) and private(-) methods. These inlcude +takeTurn, +resetGame, +changePlayer, -checkWin, -checkDraw, -announceWinner, -announceDraw. 
 
 - The method takeTurn is called when a player clicks on a cell. First, the game status property is checked to make sure that the game is not ended. Once confirmed, the method updates the game state property and adds the player's symbol (X or O) to the array at the appropriate index. The board is then updated to reflect the turn. Once the turn has been made, checkWin is called. If false, it calls checkDraw. If false then the method prepares for the next turn by calling changePlayer, incrementing the index, and displaying a message to the player indicating that it is the next player's turn. 
 - The method resetGame is called when a player clicks on the restart game button. This method resets all of the game properties to their initial states. 
 - The method changePlayer is called at the end of takeTurn method. This function alters the player property of game X -> O or O -> X each time it is called. 
 - The method checkWin is called during the takeTurn method. This method checks if any of the 8 winning conditions have been met. It returns either true or false. 
 - The method checkDraw is called if checkWin is false during the execution of the takeTurn method. This method checks if the game property index is equal to 8. If this is the case, we know that there has been no winner and that there have been 9 turns taken (the board is full) and therefore a draw. This method returns true or false. 
 - The method announceWinner is called if checkWin is true during the execution of takeTurn. This method updates the display text under the board informing the players that there has been a winner. It also updates the game property status to be 'ended' to block players from calling takeTurn again without resetting the game. 
 - The method announceDraw is called if checkDraw is true during the execution of takeTurn. This method updates the display text under the board informing the players that there has been a winner. It also updates the game property status to be 'ended' to block players from calling takeTurn again without resetting the game. 
 

The file ends with two lines that define event listeners to each cell on the board and the reset button. If a cell is selected, TicTacToe.takeTurn(event) is called. If the reset button is clicked, then TicTacToe.resetGame() is called.