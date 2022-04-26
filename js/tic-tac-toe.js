let player = 'X';
let playerOneWins = 0;
let playerTwoWins = 0;
let numDraws = 0;
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

/**
 * Checks to see if a row is full.
 *
 * @param {Array} state - The current state of the board.
 * 
 * @returns {Boolean} - True if a row is full, false otherwise.
 */
function checkRow(state) {
    for (let i = 0; i < 3; i++) {
        if (state[i][0] === state[i][1] && state[i][1] === state[i][2] && state[i][0] !== '') {
            return true;
        }
    }

    return false;
}

/**
 * Checks to see if a column is full.
 *
 * @param {Array} state - The current state of the board.
 *
 * @returns {Boolean} - True if a column is full, false otherwise.
 */
function checkCol(state) {
    for (let i = 0; i < 3; i++) {
        if (state[0][i] === state[1][i] && state[1][i] === state[2][i] && state[0][i] !== '') {
            return true;
        }
    }

    return false;
}

/**
 * Checks to see if a diagonal is full.
 *
 * @param {Array} state - The current state of the board.
 *
 * @returns {Boolean} - True if a diagonal is full, false otherwise.
 */
function checkDiagonal(state) {
    if (state[0][0] === state[1][1] && state[1][1] === state[2][2] && state[0][0] !== '') {
        return true;
    } else if (state[0][2] === state[1][1] && state[1][1] === state[2][0] && state[0][2] !== '') {
        return true;
    }

    return false;
}

/**
 * Checks to see if a player has won.
 *
 * @param {Array} state - The current state of the board.
 *
 * @returns {Boolean} - True if a player has won, false otherwise.
 */
function checkWinner(state) {
    return checkRow(state) || checkCol(state) || checkDiagonal(state);
}

/**
 * Checks to see if there is a draw.
 * 
 * @param {Array} state - The current state of the board.
 * 
 * @returns {Boolean} - True if there is a draw, false otherwise.
 */
function checkDraw(state) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '') {
                return false;
            }
        }
    }

    return true;
}

/**
 * Checks to see if the game is over.
 *
 * @param {Array} state - The current state of the board.
 *
 * @returns {Boolean} - True if the game is over, false otherwise.
 */
function gameOver(state) {
    return checkWinner(state) || checkDraw(state);
}

/**
 * Updates the score board with the current state.
 */
function updateScore() {
    $("#player-1-score").text(playerOneWins);
    $("#player-2-score").text(playerTwoWins);
    $("#draw-score").text(numDraws);
}

/**
 * Resets the board.
 */
function resetBoard() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];

    $(".cell").text("");
}

/**
 * Computes who goes next given the current state of the board.
 * 
 * @param {Array} state - The current state of the board.
 * 
 * @returns {String} - The player who goes next.
 */
function getPlayerTurn(state) {
    let count = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] !== '') {
                count++;
            }
        }
    }

    if (count % 2 === 0) {
        return 'X';
    } else {
        return 'O';
    }
}

/**
 * Utility function for the minimax algorithm.
 *
 * @param {Array} state - The current state of the board.
 *
 * @returns {Number} - The utility value of the state.
 */
function utility(state) {
    if (checkWinner(state)) {
        if (getPlayerTurn(state) === 'X') {
            return 1;
        }

        return -1; 
    }

    return 0;
}

/**
 * Helper function for the minimax algorithm.
 *
 * @param {Array} state - The current state of the board. 
 * @param {Number} alpha - The alpha value. 
 * @param {Number} beta - The beta value.
 *
 * @returns {Array} - The utility value of the state and the move to make.
 */
function maxValue(state, alpha, beta) {
    if (gameOver(state)) {
        return [utility(state), null];
    }

    let v = -Infinity;
    let move = {row: -1, col: -1};

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '') {
                state[i][j] = getPlayerTurn(state);

                let [v2, a2] = minValue(state, alpha, beta);

                if (v2 > v) {
                    v = v2;
                    move = {
                        row: i,
                        col: j,
                    };
                    alpha = Math.max(alpha, v);
                }

                state[i][j] = '';

                if (v >= beta) {
                    return [v, move];
                }
            }
        }
    }

    return [v, move];
}

/**
 * Helper function for the minimax algorithm.
 *
 * @param {Array} state - The current state of the board. 
 * @param {Number} alpha - The alpha value. 
 * @param {Number} beta - The beta value.
 *
 * @returns {Array} - The utility value of the state and the move to make.
 */
function minValue(state, alpha, beta) {
    if (gameOver(state)) {
        return [utility(state), null];
    }

    let v = Infinity;
    let move = {row: -1, col: -1};

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '') {
                state[i][j] = getPlayerTurn(state);

                let [v2, a2] = maxValue(state, alpha, beta);

                if (v2 < v) {
                    v = v2;
                    move = {
                        row: i,
                        col: j,
                    };
                    beta = Math.min(beta, v);
                }

                state[i][j] = '';

                if (v <= alpha) {
                    return [v, move];
                }
            }
        }
    }

    return [v, move];
}

/**
 * The main handler for the minimax algorithm.
 *
 * @returns {Object} - The move to make.
 */
function minimaxAlphaBeta() {
    let state = JSON.parse(JSON.stringify(board));

    let [value, move] = maxValue(state, -Infinity, Infinity);

    return move;
}

/**
 * Updates the modal with the current state.
 *
 * @param {String} title - The title of the modal.
 */
function updateModal(title) {
    $("#modal-title").text(title);
}

/**
 * Handles the click event for starting a new game.
 */
$('.new-game').click(function() {
    resetBoard();
    player = 'X';
    $('#modal').modal('hide')
});

/**
 * Handles the click event for clicking on a tic tac toe cell.
 */
$('.cell').click(function() {
    if ($(this).text() === '') {
        $(this).text(player);

        let row = $(this).data('row');
        let col = $(this).data('col');

        board[row-1][col-1] = player;

        if (checkWinner(board)) {
            updateModal(player + ' wins!');

            $('#modal').modal('show');

            playerOneWins++;

            updateScore();
        } else if (checkDraw(board)) {
            updateModal('Draw!');

            $('#modal').modal('show');

            numDraws++;

            updateScore();
        } else {
            player = 'O';

            let move = minimaxAlphaBeta();

            player = 'O';

            board[move.row][move.col] = player;

            $('.cell[data-row="' + (move.row + 1) + '"][data-col="' + (move.col + 1) + '"]').text(player);

            if (checkWinner(board)) {
                updateModal(player + ' wins!');

                $('#modal').modal('show');

                playerTwoWins++;

                updateScore();
            } else if (checkDraw(board)) {
                updateModal('Draw!');

                $('#modal').modal('show');
    
                numDraws++;
    
                updateScore();
            }

            player = 'X';
        }
    }
});
