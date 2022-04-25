let player = 'X';
let playerOneWins = 0;
let playerTwoWins = 0;
let numDraws = 0;
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

function checkRow(state) {
    for (let i = 0; i < 3; i++) {
        if (state[i][0] === state[i][1] && state[i][1] === state[i][2] && state[i][0] !== '') {
            return true;
        }
    }

    return false;
}

function checkCol(state) {
    for (let i = 0; i < 3; i++) {
        if (state[0][i] === state[1][i] && state[1][i] === state[2][i] && state[0][i] !== '') {
            return true;
        }
    }

    return false;
}

function checkDiagonal(state) {
    if (state[0][0] === state[1][1] && state[1][1] === state[2][2] && state[0][0] !== '') {
        return true;
    } else if (state[0][2] === state[1][1] && state[1][1] === state[2][0] && state[0][2] !== '') {
        return true;
    }

    return false;
}

function checkWinner(state) {
    return checkRow(state) || checkCol(state) || checkDiagonal(state);
}

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

function gameOver(state) {
    return checkWinner(state) || checkDraw(state);
}

function updateScore() {
    $("#player-1-score").text(playerOneWins);
    $("#player-2-score").text(playerTwoWins);
    $("#draw-score").text(numDraws);
}

function resetBoard() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];

    $(".cell").text("");
}

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

function utility(state) {
    if (checkWinner(state)) {
        if (getPlayerTurn(state) === 'X') {
            return 1;
        }

        return -1; 
    }

    return 0;
}

function maxValue(state) {
    if (gameOver(state)) {
        return [utility(state), null];
    }

    let v = -Infinity;
    let move = {row: -1, col: -1};

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '') {
                state[i][j] = getPlayerTurn(state);

                let [v2, a2] = minValue(state);

                if (v2 > v) {
                    v = v2;
                    move = {
                        row: i,
                        col: j,
                    };
                }

                state[i][j] = '';
            }
        }
    }

    return [v, move];
}

function minValue(state) {
    if (gameOver(state)) {
        return [utility(state), null];
    }

    let v = Infinity;
    let move = {row: -1, col: -1};

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (state[i][j] === '') {
                state[i][j] = getPlayerTurn(state);

                let [v2, a2] = maxValue(state);

                if (v2 < v) {
                    v = v2;
                    move = {
                        row: i,
                        col: j,
                    };
                }

                state[i][j] = '';
            }
        }
    }

    return [v, move];
}

function minimax() {
    let state = JSON.parse(JSON.stringify(board));

    let [value, move] = maxValue(state);

    return move;
}

$('.cell').click(function() {
    if ($(this).text() === '') {
        $(this).text(player);

        let row = $(this).data('row');
        let col = $(this).data('col');

        board[row-1][col-1] = player;

        if (checkWinner(board)) {
            alert(player + ' wins!');

            playerOneWins++;

            updateScore();
            resetBoard();
        } else if (checkDraw(board)) {
            alert('Draw!');

            numDraws++;

            updateScore();
            resetBoard();
        } else {
            player = 'O';

            let move = minimax();

            player = 'O';

            console.log(move)

            board[move.row][move.col] = player;

            $('.cell[data-row="' + (move.row + 1) + '"][data-col="' + (move.col + 1) + '"]').text(player);

            if (checkWinner(board)) {
                alert(player + ' wins!');

                playerTwoWins++;

                updateScore();
                resetBoard();
            } else if (checkDraw(board)) {
                alert('Draw!');
    
                numDraws++;
    
                updateScore();
                resetBoard();
            }

            player = 'X';
        }
    }
});