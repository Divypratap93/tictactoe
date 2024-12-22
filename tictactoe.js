function gameBoard(){

const row = 3;
const column = 3;
const board =[];

for(i=0;i<row;i++){
    board[i] = [];
    for(j=0;j<column;j++){
        board[i].push(cell());
    }
}
const getBoard = () => board;

const placeMarker = (row,column,marker) =>{
const availableCell = board[row][column];

if(availableCell.getValue() === "X" || availableCell.getValue() === "O"){
alert("You can't place marker here");
}
else
availableCell.addMarker(marker);

const winner = checkWinner();
        if (winner) {
            if (winner === 'draw') {
                alert("It's a draw!");
            } else {
                alert(`Player with ${winner} wins!`);
            }
        }
        
        return true; // Indicate successful placement

    }

// add winning concept here
const checkWinner = () => {
    // Check rows
    for (let i = 0; i < row; i++) {
        if (
            board[i][0].getValue() !== '' &&
            board[i][0].getValue() === board[i][1].getValue() &&
            board[i][1].getValue() === board[i][2].getValue()
        ) {
            return board[i][0].getValue(); // Return the winning marker
        }
    }

    // Check columns
    for (let j = 0; j < column; j++) {
        if (
            board[0][j].getValue() !== '' &&
            board[0][j].getValue() === board[1][j].getValue() &&
            board[1][j].getValue() === board[2][j].getValue()
        ) {
            return board[0][j].getValue(); // Return the winning marker
        }
    }

    // Check diagonals
    if (
        board[0][0].getValue() !== '' &&
        board[0][0].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][2].getValue()
    ) {
        return board[0][0].getValue(); // Diagonal from top-left to bottom-right
    }

    if (
        board[0][2].getValue() !== '' &&
        board[0][2].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][0].getValue()
    ) {
        return board[0][2].getValue(); // Diagonal from top-right to bottom-left
    }

    // Check for a draw (board is full)
    const isDraw = board.every(row => 
        row.every(cell => cell.getValue() !== '')
    );

    if (isDraw) {
        return 'draw';
    }

    // No winner yet
    return null;
}



return {getBoard,placeMarker};
}


function cell(){
    let value ='';
    const addMarker = (marker) => {
        value = marker;
    }
    const getValue = () =>value;

    return {getValue,addMarker};

}


function gameController(){
    const board = gameBoard();
// Assuming you have the 'player' array set up like this:
const players = [
    { name: "Player 1", marker: "" },
    { name: "Player 2", marker: "" }
  ];
  
  // Setup marker selection functionality
  
    // Get the HTML elements for marker buttons
    const Xmarker = document.getElementById("X");
    const Omarker = document.getElementById("O");
  
    // Add event listeners for the marker selection buttons
    Xmarker.addEventListener("click", () => MarkerAssign("X"));
    Omarker.addEventListener("click", () => MarkerAssign("O"));
  
  
  // Function to assign markers to players
  const MarkerAssign = (marker) => {
    // Assign marker to the current player (you can switch between players if needed)
   if(marker=="X"){
    players[0].marker = "X";
    players[1].marker = "O";
   }
   else
   {
    players[0].marker = "O";
    players[1].marker = "X";
   }

      // Assign the chosen marker to Player 1
    console.log(`Player 1's marker is now ${players[0].marker}`);
  };
  
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  

  const playRound = (row,column) => {
    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s marker into row: ${row} column: ${column}...`
    );
    board.placeMarker(row,column, getActivePlayer().marker);

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

    // Switch player turn
    switchPlayerTurn();
    
  };

 







  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  };

  // Call the marker selection function when the page loads or when needed
  

}






function ScreenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";
    
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

// Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

board.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div'); // Group buttons by row
    rowDiv.classList.add('row');
    row.forEach((cell, colIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        rowDiv.appendChild(cellButton);
    });
    boardDiv.appendChild(rowDiv);
});
}

function clickHandlerBoard(e) {
    // Get the row and column from the clicked cell
    const selectedRow = parseInt(e.target.dataset.row);
const selectedColumn = parseInt(e.target.dataset.column);

  
    // If the clicked element doesn't have the data attributes, ignore the click
    if (selectedRow === undefined || selectedColumn === undefined) return;
  
    // Call the function to handle the round for the selected column
    game.playRound(selectedRow,selectedColumn);
  
    // Update the screen to reflect the new game state
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();


}

ScreenController();