function gameBoard(){
    const board = [];
    const rowIndex = 3;
    const columnIndex = 3;
    

    
        for(let i = 0; i < rowIndex; i++){
            board[i] = [];
            for (let j = 0; j < columnIndex; j++){
                board[i].push(cell());
            }
        }
        

    const getBoard = () => board;

    const resetBoard = () => {
        board.forEach(row => {
            row.forEach(cell => {
                cell.addToken('');
            });
        });
    };

    const placeMarker = (row,column,marker)=>{
        const availableCell = board[row][column];
        if(availableCell.getValue()==="X" || availableCell.getValue() === "O"){
            alert("You can't place your marker here")
            return false;
        }
        else{
            availableCell.addToken(marker);
            return true;
        }
    }

    const checkWinner = () => {
        // Check rows
        for(let i = 0; i < rowIndex; i++){
            if(
                board[i][0].getValue() !== '' && 
                board[i][0].getValue() === board[i][1].getValue() && 
                board[i][1].getValue() === board[i][2].getValue()
            ){
                return board[i][0].getValue();
            }
        }
        
        // Check columns
        for (let j = 0; j < columnIndex; j++) {
            if (
                board[0][j].getValue() !== '' &&
                board[0][j].getValue() === board[1][j].getValue() &&
                board[1][j].getValue() === board[2][j].getValue()
            ) {
                return board[0][j].getValue();
            }
        }
        
        // Check diagonals
        if (
            board[0][0].getValue() !== '' &&
            board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue()
        ) {
            return board[0][0].getValue();
        }
        
        if (
            board[0][2].getValue() !== '' &&
            board[0][2].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][0].getValue()
        ) {
            return board[0][2].getValue();
        }
        
        // Check for a draw
        const isDraw = board.every(row => 
            row.every(cell => cell.getValue() !== '')
        );
        
        if (isDraw) {
            return 'draw';
        }
        
        return null;
    }

    return {getBoard, placeMarker, checkWinner, resetBoard}
}

function cell(){
    let value = '';
    const getValue = () => value;
    const addToken = (marker) => {
        value = marker;
    }
    return {getValue, addToken}
}

function gameController(){
    const board = gameBoard();
    const players = [
        {
            name: 'playerOne',
            token: 'X'
        },
        {
            name: 'PlayerTwo',
            token: 'O'
        }
    ];
    
    let activePlayer = players[0];
    let isGameActive = true;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    
    const getActivePlayer = () => activePlayer;
    
    const resetGame = () => {
        activePlayer = players[0];
        board.resetBoard();
        isGameActive = true;
    };

    const playerTypeX = document.getElementById('X');
    const PlayerTypeO = document.getElementById('O');
    
    playerTypeX.addEventListener("click", () => {
        activePlayer = players[0];
        console.log('X selected')
    });
    
    PlayerTypeO.addEventListener('click', () => {
        activePlayer = players[1];
    });

    const handleWinner = (winner) => {
        isGameActive = false;
        setTimeout(() => {
            if (winner === 'draw') {
                alert("It's a draw!");
            } else {
                alert(`Player with ${winner} wins!`);
            }
            resetGame();
        }, 500); // 500ms delay to show the final move
    };

    const playRound = (rowIndex, columnIndex) => {
        if (!isGameActive) return;

        const markerPlaced = board.placeMarker(rowIndex, columnIndex, getActivePlayer().token);
        
        if (markerPlaced) {
            const winner = board.checkWinner();
            if (winner !== null) {
                handleWinner(winner);
            } else {
                switchPlayerTurn();
            }
            return true;
        }
        return false;
    }

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard,
        resetGame
    }
}

function ScreenController(){
    const game = gameController();
    const boardDiv = document.querySelector('.board');
    const playerTurnDiv = document.querySelector('.turn');

    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div'); // Group buttons by row
    rowDiv.classList.add('row');
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.column = columnIndex;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getValue();
                rowDiv.appendChild(cellButton);
            });
            boardDiv.appendChild(rowDiv);
        });
    }

    function clickHandlerBoard(e){
        const selectedColumn = parseInt(e.target.dataset.column, 10);
        const selectedRow = parseInt(e.target.dataset.row, 10);

        if (isNaN(selectedRow) || isNaN(selectedColumn)) return;
        
        if (game.playRound(selectedRow, selectedColumn)) {
            updateScreen();
        }
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
}

ScreenController();