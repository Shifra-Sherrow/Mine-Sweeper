'use strict';

const BOMB = '💣';
const FLAG = '🚩';
const HEART = '❤️';

var gGame;
var gGameState = [];
var gBoard;
var gLevel;
var gIntervalTimer;
var gTimeStart;
var gSounds;

function initGame() {
    hideContextMenu();

    if (gIntervalTimer) clearInterval(gIntervalTimer);
    gTimeStart = null;
    if (!gLevel) gLevel = { SIZE: 12, MINES: 30 };
    gGameState = [];
    resetDom();

    gSounds = {
        winSnd: new Audio('sounds/victorious.mp3'),
        loseSnd: new Audio('sounds/wrong.mp3')
    };

    gGame = {
        isOn: false,
        minesLoc: [],
        lives: 3,
        isHint: false,
        shownCount: 0,
        markedCount: 0,
        timePassed: ''
    };

    gBoard = buildBoard();
    renderBoard(gBoard);
}

function resetDom() {
    setInnerText('.bombs', gLevel.MINES);
    setInnerText('.lives', `${HEART} ${HEART} ${HEART}`);
    setInnerText('.timer .minutes', `00`);
    setInnerText('.timer .seconds', `00`);
    setInnerText('.flags', `0`);
    updateSrc('.header .emoji', 'imgs/thinking.png');
    setInnerHTML('.hint1', '<i class="fal fa-lightbulb"></i>');
    setInnerHTML('.hint2', '<i class="fal fa-lightbulb"></i>');
    setInnerHTML('.hint3', '<i class="fal fa-lightbulb"></i>');
    document.querySelector('.hint1').classList.remove('peek');
    document.querySelector('.hint2').classList.remove('peek');
    document.querySelector('.hint3').classList.remove('peek');
    document.querySelector('.undo').classList.add('unclickable');
    setScores();
}

function setScores() {
    var bestScores = loadFromStorage('best-scores');
    bestScores = bestScores ? bestScores : { easy: 1000000, medium: 1000000, hard: 1000000 };
    saveToStorage('best-scores', bestScores);

    document.querySelector('.easy span').innerText = bestScores.easy !== 1000000 ? bestScores.easy : '- -';
    document.querySelector('.medium span').innerText = bestScores.medium !== 1000000 ? bestScores.medium : '- -';
    document.querySelector('.hard span').innerText = bestScores.hard !== 1000000 ? bestScores.hard : '- -';
}

function resetScores() {
    saveToStorage('best-scores', { easy: 1000000, medium: 1000000, hard: 1000000 });
    setScores();
}

function checkGameOver() {
    if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2 &&
        gGame.markedCount + (3 - gGame.lives) === gLevel.MINES) {
        gSounds.winSnd.play();
        updateSrc('.header .emoji', 'imgs/Sunglasses.png');
        setInnerText('.lives', 'WINNER!!');
        bestScore();
        gameOver();
        return true;
    }
    return false;
}

function bestScore() {
    var bestScores = loadFromStorage('best-scores');
    var level = gLevel.SIZE === 4 ? 'easy' : gLevel.SIZE === 8 ? 'medium' : 'hard';
    var parts = gGame.timePassed.split(':');
    var seconds = (+parts[0] * 60) + (+parts[1]);
    if (seconds < bestScores[level]) bestScores[level] = seconds;
    saveToStorage('best-scores', bestScores);
    setScores();
}

function gameOver() {
    gGame.isOn = false;
    gGameState[gGameState.length - 1].gTimeStart = gTimeStart;
    clearInterval(gIntervalTimer);
}

function setLevel(size) {
    gLevel.SIZE = size;
    switch (size) {
        case 4:
            gLevel.MINES = 2;
            break;
        case 8:
            gLevel.MINES = 12;
            break;
        case 12:
            gLevel.MINES = 30;
            break;
    }
    initGame();
}

function toggleModal() {
    document.querySelector('.modal').classList.toggle('show');
}