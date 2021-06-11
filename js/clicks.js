'use strict';

function cellClicked(elCell) {
    var loc = getLocation(elCell);

    if (!gGame.isOn) {
        if (!gGame.timePassed) {
            firstClick(loc);
        } else return;
    }

    if (gGame.isHint) {
        peek(loc.i, loc.j);
        return;
    }

    saveState();

    var currCell = gBoard[loc.i][loc.j];

    if (currCell.isMarked || currCell.isShown) return; // mark or shown

    if (currCell.minesAroundCount > 0) { // number
        currCell.isShown = true;
        gGame.shownCount++;
    } else if (currCell.isMine) { // mine
        var isWinner = mineClicked(loc);
        if (!isWinner) gSounds.loseSnd.play();
    } else if (currCell.minesAroundCount === 0) { // empty
        expandShown(loc.i, loc.j);
    }

    renderBoard(gBoard);
    checkGameOver();
}

function firstClick(loc) {
    gGame.isOn = !gGame.isOn;
    gTimeStart = new Date().getTime();
    startTimer(gTimeStart);

    setRndMines(gBoard, loc);
    setMinesNegsCount(gBoard);
}

function mineClicked(loc) {
    var updateLivesEl = '';

    if (gGame.lives > 0) {
        var currCell = gBoard[loc.i][loc.j];

        gGame.lives--;
        for (var i = 0; i < gGame.lives; i++) {
            updateLivesEl += HEART + ' ';
        }
        updateLivesEl.trim();
        if (!updateLivesEl) updateLivesEl = 'last chance!';

        currCell.isShown = true;
        gGame.shownCount++;

        var isGameOver = checkGameOver();
        if (isGameOver) return true;

        updateSrc('.header .emoji', 'imgs/Sad.png');
        setTimeout(updateSrc, 1000 * 2, '.header .emoji', 'imgs/thinking.png');
    } else {
        revealMines();

        updateSrc('.header .emoji', 'imgs/Sad.png');
        updateLivesEl = 'try again!';
        
        gameOver();
    }

    setInnerText('.lives', updateLivesEl);
    return false;
}

function revealMines() {
    for (var idx = 0; idx < gGame.minesLoc.length; idx++) {
        var currCellMine = gBoard[gGame.minesLoc[idx].i][gGame.minesLoc[idx].j];
        if (currCellMine.isMarked) currCellMine.isMarked = false;
        if (!currCellMine.isShown) currCellMine.isShown = true;
    }
}

function expandShown(idxI, idxJ) {
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > gLevel.SIZE - 1) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            var currCell = gBoard[i][j];
            if (j < 0 || j > gLevel.SIZE - 1 || currCell.isShown || currCell.isMarked) continue;
            currCell.isShown = true;
            gGame.shownCount++;
            if (currCell.minesAroundCount === 0) expandShown(i, j);
        }
    }
}

function cellMarked(elCell) {
    var loc = getLocation(elCell);

    if (!gGame.isOn) {
        if (!gGame.timePassed) {
            firstClick(loc);
        } else return;
    }

    saveState();

    var currCell = gBoard[loc.i][loc.j];
    if (currCell.isShown) return; // shown

    gGame.markedCount = currCell.isMarked ? --gGame.markedCount : ++gGame.markedCount;
    setInnerText('.flags', gGame.markedCount);

    currCell.isMarked = !currCell.isMarked;

    renderBoard(gBoard);
    checkGameOver();
}

function hint(elHint) {
    elHint.classList.toggle('peek');
    gGame.isHint = !gGame.isHint;
    gGame.peekClass = elHint.classList[0];
}

function peek(idxI, idxJ) {
    var peekCells = [];

    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > gLevel.SIZE - 1) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            var currCell = gBoard[i][j];
            if (j < 0 || j > gLevel.SIZE - 1 || currCell.isShown) continue;
            peekCells.push({ i, j });
        }
    }

    for (var idx = 0; idx < peekCells.length; idx++) {
        var currCell = gBoard[peekCells[idx].i][peekCells[idx].j];
        currCell.isShown = true;
    }
    renderBoard(gBoard);

    setTimeout(function () {
        for (var idx = 0; idx < peekCells.length; idx++) {
            var currCell = gBoard[peekCells[idx].i][peekCells[idx].j];
            currCell.isShown = false;
        }
        renderBoard(gBoard);

        setInnerHTML(`.${gGame.peekClass}`, ``);
        gGame.isHint = false;
    }, 1000 * 2);
}

function saveState() {
    var currState = {
        gGame: deepCopy(gGame),
        gBoard: deepCopy(gBoard),
        lives: document.querySelector('.lives').innerText,
        flags: document.querySelector('.flags').innerText
    };
    gGameState.push(currState);
    document.querySelector('.undo').classList.remove('unclickable');
}

function onUndo() {
    var prevState = gGameState.pop();
    gGame = prevState.gGame;
    gBoard = prevState.gBoard;
    renderBoard(gBoard);
    setInnerText('.lives', prevState.lives);
    updateSrc('.header .emoji', 'imgs/thinking.png');
    setInnerText('.flags', prevState.flags);

    if (prevState.gTimeStart) {
        gTimeStart = prevState.gTimeStart;
        startTimer(gTimeStart);
    }

    if (!gGameState.length) {
        document.querySelector('.undo').classList.add('unclickable');
    }
}
