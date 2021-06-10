'use strict';

function buildBoard() {
    var board = [];

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }

    return board;
}

function setRndMines(board, loc) {
    gGame.minesLoc = [];
    for (var i = 0; i < gLevel.MINES; i++) {
        var rndI = getRandomInt(0, gLevel.SIZE);
        var rndJ = getRandomInt(0, gLevel.SIZE);
        if ((rndI === loc.i && rndJ === loc.j) ||
            board[rndI][rndJ].isMine === true) {
            i--;
        } else {
            board[rndI][rndJ].isMine = true;
            gGame.minesLoc.push({ i: rndI, j: rndJ });
        }
    }

    // --- for debugging
    gGame.minesLoc.sort(function (loc1, loc2) { return loc1.i - loc2.i });
    console.log(gGame.minesLoc);
    // ---
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j];
            if (currCell.isMine) continue;
            currCell.minesAroundCount = countNegsForCell(board, i, j);
        }
    }
}

function countNegsForCell(board, rowIdx, colIdx) {
    var countNegs = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gLevel.SIZE - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if ((i === rowIdx && j === colIdx) ||
                j < 0 || j > gLevel.SIZE - 1) continue;
            if (board[i][j].isMine) countNegs++;
        }
    }
    return countNegs;
}

function renderBoard(board) {
    var strHTML = `<table border="0"><tbody>`;

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var className = `cell cell-${i}-${j}`;
            var cell = '';

            if (currCell.isMarked && !currCell.isShown) {
                cell = FLAG;
                className += ` hide`;
            } else if (currCell.isShown) {
                if (currCell.isMine) {
                    cell = BOMB;
                } else {
                    cell = (currCell.minesAroundCount === 0) ? '' : currCell.minesAroundCount;
                }
            } else className += ` hide`;

            strHTML += `<td class = "${className}" onclick = "cellClicked(this)" oncontextmenu = "cellMarked(this)">${cell}</td>`;
        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;

    setInnerHTML('.board', strHTML);
}