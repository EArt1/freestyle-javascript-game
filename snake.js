const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const rows = parseInt(urlParams.get("rows"));
const cols = parseInt(urlParams.get("cols"));
//----------------
let theSpeed = parseInt(urlParams.get("speed"));
let time = 0;
let timer = document.querySelector("#timer");
var theMove = "d";
var theRow = 0;
var theCol = 0;
var theMoveNew = "z";
var theKeys = ["a", "s", "d", "w"];
var snakeBody = [[0, 0]];
var snakeEats = false;
let score = 0;

//-----------------
drawBoard(rows, cols);
drawFood();
setStatsWidth();
startTimer();
let theGame = renderGameFrame();
addBodyEvent();

function startTimer() {
  setInterval(() => {
    time++;
    timer.value = time;
  }, 1000);
}

// Your game can start here, but define separate functions, don't write everything in here :)
function drawBoard(rows, cols) {
  let gameField = document.querySelector(".game-field");
  setGameFieldSize(gameField, rows, cols);
  let cellIndex = 0;
  for (let row = 0; row < rows; row++) {
    const rowElement = addRow(gameField);
    for (let col = 0; col < cols; col++) {
      addCell(rowElement, row, col);
      cellIndex++;
    }
  }
}

function setGameFieldSize(gameField, rows, cols) {
  gameField.style.height = gameField.dataset.cellWidth * rows + "px";
  gameField.style.width = gameField.dataset.cellHeight * cols + "px";
}

function addRow(gameField) {
  gameField.insertAdjacentHTML("beforeend", '<div class="row"></div>');
  return gameField.lastElementChild;
}

function addCell(rowElement, row, col) {
  rowElement.insertAdjacentHTML(
    "beforeend",
    `<div class="field"
                        data-row="${row}"
                        data-col="${col}"></div>`
  );
}

function drawFood() {
  let testFruits = document.getElementsByClassName("food");
  if (testFruits.length == 0) {
    let oldFood = document.querySelector(".food");
    if (oldFood) {
      oldFood.classList.remove("food");
    }
    let randomPlace;
    let fields = document.querySelectorAll(".field");
    while (1 === 1) {
      randomPlace = getRandomInt(0, fields.length - 1);
      if (!fields[randomPlace].classList.contains("snake")) {
        fields[randomPlace].classList.add("food");
        break;
      }
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function addBodyEvent() {
  let theBodyForMove = document.getElementsByTagName("body")[0];
  theBodyForMove.addEventListener("keypress", function (a) {
    theMoveNew = a.key;
  });
}

function moveTheSnake() {
  if (theKeys.includes(theMoveNew)) {
    switch (theMoveNew) {
      case "w":
        if (theMove != "s") {
          console.log(theMove);
          theMove = theMoveNew;
        }
        break;
      case "a":
        if (theMove != "d") {
          console.log(theMove);
          theMove = theMoveNew;
        }
        break;
      case "d":
        if (theMove != "a") {
          console.log(theMove);
          theMove = theMoveNew;
        }
        break;
      case "s":
        if (theMove != "w") {
          console.log(theMove);
          theMove = theMoveNew;
        }
        break;
      default:
        throw new Error("Blab Blab");
    }
  }
}

function changeTheClass() {
  let theSnakePosition = document.querySelector(
    `[data-row='${theRow}'][data-col='${theCol}']`
  );
  if (theSnakePosition.className == "field food") {
    theSnakePosition.classList.remove("food");
    theSnakePosition.classList.add("snake");
    killTheTail(true);
    score += 1;
  } else {
    theSnakePosition.classList.add("snake");
  }
}

function getScore() {
  let scoreHtmlId = document.getElementById("score");
  scoreHtmlId.setAttribute("value", score);
}

function getHighscore() {
  const highscoreEl = document.getElementById("highscore");
  const highscore = parseInt(window.localStorage.getItem("highscore") || 0);

  if (highscore) {
    highscoreEl.setAttribute("value", highscore);
  }
  if (score > highscore) {
    window.localStorage.setItem("highscore", score);
  }
}

function killTheTail(shouldBeKilled = false) {
  if (shouldBeKilled) {
    snakeBody.push([theRow, theCol]);
  } else {
    let theTail = document.querySelector(
      `[data-row='${snakeBody[0][0]}'][data-col='${snakeBody[0][1]}']`
    );
    theTail.classList.remove("snake");
    snakeBody.push([theRow, theCol]);
    snakeBody.shift();
  }
}

var theGameFunction = function theGame() {
  moveTheSnake();
  giveSnakeAHead();
  removeHead();
  killTheTail();
  killSnake();
  changeTheClass();
  drawFood();
  giveSnakeAHead();
  getScore();
  getHighscore();
  getFasterSnake();
};

function renderGameFrame() {
  return setInterval(theGameFunction, theSpeed);
}

function killSnake() {
  let theSnakePosition = document.querySelector(
    `[data-row='${theRow}'][data-col='${theCol}']`
  );
  let theField = document.getElementsByClassName("row");
  let theSnakeLenght = document.getElementsByClassName("field snake");
  if (
    theRow > theField.length - 1 ||
    theRow < 0 ||
    theCol < 0 ||
    theCol + 1 > theField[0].children.length ||
    theSnakePosition.className == "field snake"
  ) {
    clearInterval(theGame);
    alert("You lose");
    window.location.href = "snake-menu.html";
  } else if (
    theSnakeLenght.length + 2 ==
    theField.length * theField[0].children.length
  ) {
    clearInterval(theGame);
    alert("You win");
    window.location.href = "snake-menu.html";
  }
}

function setStatsWidth() {
  let stats = document.querySelector(".stats");
  let gameField = document.querySelector(".game-field");
  stats.style.width = gameField.style.width;
}

function giveSnakeAHead() {
  let snakeHeadPosition = snakeBody[snakeBody.length - 1];
  let snakeFields = document.querySelectorAll(".field");
  for (let snakeField of snakeFields) {
    if (
      parseInt(snakeField.getAttribute("data-row")) == snakeHeadPosition[0] &&
      parseInt(snakeField.getAttribute("data-col")) == snakeHeadPosition[1]
    ) {
      snakeField.setAttribute("id", "head");
    }
  }
}
function removeHead() {
  let snakeHead = document.querySelector("#head");
  if (snakeHead) {
    snakeHead.removeAttribute("id");
  }
}
function getFasterSnake() {
  theSnakeBody = document.getElementsByClassName("snake").length;
  if (theSpeed - theSnakeBody * 100 > 100) {
    clearInterval(theGame);
    theGame = setInterval(theGameFunction, theSpeed - theSnakeBody * 100);
  } else {
    clearInterval(theGame);
    theGame = setInterval(theGameFunction, 100);
  }
}
