# TicTacToe
CSI 3140 Summer 2024

Jack Snelgrove 300247435

Sami Hassan 300169285

## Assignment 4: Tic Tac Toe Game PHP with Postgres Database

### Running the Game
#### Prerequisites
- Confirm PHP is installed: `php --version`
- Confirm PostgreSQL is installed: `psql --version`

#### Initialize Database
- run: `psql -c CREATE DATABASE tictactoe`
- run: `CREATE TABLE leaderboard(name varchar(50), score int);`

#### Starting the Game
- Clone this repo
- Open the terminal at the location where the cloned repo was saved
- run 'php -S localhost:8000`
- Open the browser and go to this site http://localhost:8000/index.html

### Summary 
In this version of our game, we changed how our leaderboard works. Instead of the leaderboard scores being stored in a JSON file, we keep them on a  Postgres database. This database has a single table called leaderboard with two columns: name and score. There is no primary key in this table because it is the only table that we have and we don't ever query for a specific entry. Therefore, our table supports multiple entries that may have the same name. 

The way it works is that after two players have finished their session and 'finish game' is clicked, the player with the most wins will have their name and score added to the database. This database is visualized through a table in the initial setup section of our app and is sorted in descending order based on score.

### Player Perspective
After arriving at localhost:8000/index.html, both players will enter their names and select start game. 

<img width="440" alt="Screenshot 2024-07-29 at 5 52 57 PM" src="https://github.com/user-attachments/assets/aa735613-b1b4-40d1-8f7f-2f277d37fb9b">


This will bring them to a new screen where the game will take place. Both players take turns selecting cells on the game board. Once a player has three of their symbols in a row, they will win the game. The players then have the option to play again or to finish their session. 

<img width="465" alt="Screenshot 2024-07-29 at 5 54 13 PM" src="https://github.com/user-attachments/assets/e92d2224-ba4b-47bf-8472-0d1e0ba92050">


Once they are done and select 'finish game' the players will be brought back to the initial screen where they can see the winner's score reflected in the leaderboard table.

<img width="454" alt="Screenshot 2024-07-29 at 5 54 29 PM" src="https://github.com/user-attachments/assets/47ca2e2f-6ddb-4b5b-8499-6c357f114a49">


## Assignment 3: Tic Tac Toe Game PHP

### Running the Game
- Clone this repo
- run 'php -S localhost:8000`
- Open the browser and go to this site http://localhost:8000/index.html

### Summary
This version of our TicTacToe game is the game game but with the addition of a leaderboard and player names. 
Each player enters their name and then plays as many rounds as they want. When they finish the session, the top score of the two players is added to the leaderboard on the home screen.

We used a PHP server to store the information about each game, game session, and all-time best scores. The javascript file makes AJAX requests to the PHP server to know how to update the user interface. 

### Scoreboard Integration
When a game starts, the two players can play endlessly. Whenever a player wins a round, a point is added to their score. 
Once the players wish to stop playing, they can hit "Finish" and the player with the most wins has their score saved on the scoreboard. 

The scoreboard is stored in a JSON file. This leaderboard tracks the top 10 winning scores currently saved. The scoreboard is updated after a session is completed. When a new score kicks a player off the leaderboard, the lower score gets removed from the JSON file and the higher score gets placed in the right spot.

![image](https://github.com/user-attachments/assets/c87da734-38bd-4761-a7fd-6f8adcbeb186)

## Assignment 2: Tic Tac Toe Game

Summary:
For our assignment, we built a game called Tic Tac Toe, in which two players played on the same device.

The game starts by selecting a random player to play first, either X or O.
![alt text](./docs/design_system/s1.png)

Each player takes turns selecting a cell to place their letter.
![alt text](./docs/design_system/s2.png)

Either X wins, O wins, or the game ends in a draw.\
![alt text](./docs/design_system/xwin.png)

![alt text](./docs/design_system/owin.png)

![alt text](./docs/design_system/draw.png)

There is also a button at the buttom to reset the game either mid-round or at the end of the game.
![alt text](./docs/design_system/button.png)
