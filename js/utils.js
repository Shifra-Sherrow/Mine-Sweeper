'use strict'

function hideContextMenu() {
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function deepCopy(inObject) {
    let outObject, value, key;
    if (typeof inObject !== 'object' || inObject === null) return inObject;
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        value = inObject[key];
        outObject[key] = deepCopy(value);
    }
    return outObject;
}

function startTimer(timeStart) {
    gIntervalTimer = setInterval(function () {
        var now = new Date().getTime();
        var distance = now - timeStart;

        var x = new Date();
        x.setTime(distance);

        var minutes = String(x.getMinutes()).padStart(2, '0');
        var seconds = String(x.getSeconds()).padStart(2, '0');

        gGame.timePassed = `${minutes}:${seconds}`;
        setInnerText('.timer .minutes', minutes);
        setInnerText('.timer .seconds', seconds);
    }, 1000);
}

function getLocation(elCell) {
    var parts = elCell.classList[1].split('-');
    var i = +parts[1];
    var j = +parts[2];
    return { i, j };
}

function setInnerText(selector, txt) {
    document.querySelector(selector).innerText = txt;
}

function setInnerHTML(selector, strHTML) {
    document.querySelector(selector).innerHTML = strHTML;
}

function updateSrc(selector, src) {
    document.querySelector(selector).setAttribute('src', src);
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key);
    return (val) ? JSON.parse(val) : null;
}

function saveToStorage(key, val) {
    localStorage[key] = JSON.stringify(val);
}