// Load boards from files or manually
const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298",
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
];

//Create variables
const N = 9;
let lives;
let timer;
let selectedNum;
let selectedTile;
let disableSelect;

// Helper Functions
const id = (id) => {
  return document.getElementById(id);
};

const qs = (selector) => {
  return document.querySelector(selector);
};

const qsa = (selector) => {
  return document.querySelectorAll(selector);
};

const timeConversion = (time) => {
  let mins = Math.floor(time / 60);
  let secs = time % 60;
  let parsedMins = mins > 10 ? `${mins}` : `0${mins}`;
  let parsedSecs = secs > 10 ? `${secs}` : `0${secs}`;

  return `${parsedMins}:${parsedSecs}`;
};

// Game Functions
const startGame = () => {
  // choose board difficulty
  let board;
  if (id("diff-1").checked) board = easy[0];
  else if (id("diff-2").checked) board = medium[0];
  else board = hard[0];

  // set lives to 3 and enable selecting numbers and tiles
  lives = 3;
  disableSelect = false;
  id("lives").textContent = `Lives Remained: ${lives}`;

  startTimer();
  // Create boards based on difficulty
  renderBoard(board);
  if (id("theme-1").checked) {
    qs("body").classList.remove("dark");
    qs("header").classList.remove("dark");
    qs("footer").classList.remove("dark");
    id("start-btn").classList.remove("dark");
    id("number-container").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
    qs("header").classList.add("dark");
    qs("footer").classList.add("dark");
    id("start-btn").classList.add("dark");
    id("number-container").classList.add("dark");
  }
  id("number-container").classList.remove("hidden");
  id("number-container").children[0].classList.add("selected");
};

const startTimer = () => {
  let timeTick = 0;
  id("timer").textContent = timeConversion(timeTick);
  timer = setInterval(() => {
    timeTick++;
    id("timer").textContent = timeConversion(timeTick);
  }, 1000);
};

const renderBoard = (board) => {
  clearPreviousBoard();
  let idCount = 0;
  for (let i = 0; i < 81; i++) {
    let tile = document.createElement("p");
    if (board.charAt(i) !== "-") {
      tile.textContent = board.charAt(i);
    } else {
      // add click event listener to the tile
      tile.addEventListener("click", () => {
        if (!disableSelect) {
          if (tile.classList.contains("selected")) {
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    // Assign tile id
    tile.id = idCount;
    idCount++;
    tile.classList.add("tile");
    if (!id("theme-1").checked) {
      tile.classList.add("dark");
    }
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if ((tile.id % 9) + 1 == 3 || (tile.id % 9) + 1 == 6) {
      tile.classList.add("rightBorder");
    }
    id("board").appendChild(tile);
  }
};

const updateMove = () => {
  if (selectedTile && selectedNum) {
    selectedTile.textContent = selectedNum;
    if (checkCorrect(selectedTile)) {
      // Deselect tile
      selectedTile.classList.remove("selected");
      // selectedNum.classList.remove("selected");
      selectedTile = null;
      selectedNum = null;
      if (checkDone()) {
        endGame();
      }
    } else {
      // Disable selecting number for 1 second
      disableSelect = true;
      selectedTile.classList.add("incorrect");
      setTimeout(() => {
        lives--;
        if (lives === 0) {
          endGame();
        } else {
          id("lives").textContent = `Lives Remained: ${lives}`;
          disableSelect = false;
        }
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        // selectedNum.classList.remove("selected");
        selectedTile.textContent = "";
        selectedTile = null;
        selectednum = null;
      }, 1000);
    }
  }
};

const checkDone = () => {
  let tiles = qsa(".tile");
  for (let i = 0; i < tile.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
};

const checkCorrect = (tile) => {
  let solution;
  if (id("diff-1").checked) solution = easy[1];
  else if (id("diff-2").checked) solution = medium[1];
  else solution = hard[1];

  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
};

const clearPreviousBoard = () => {
  // catch all tiles
  let tiles = qsa(".tile");
  // remove eache tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }

  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }

  selectedTile = null;
  selectedNum = null;
};

const endGame = () => {
  disableSelect = true;
  clearTimeout(timer);
  if (lives === 0) {
    id("lives").textContent = "You Lost!";
  } else {
    id("lives").textContent = "You Won!";
  }
};

window.onload = () => {
  // Run start game function when button is clicked
  id("start-btn").addEventListener("click", startGame);
  // Add event listener to each number in number container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", () => {
      // If selecting is not disabled
      if (!disableSelect) {
        // If number is already selected,
        var selected = id("number-container").children[i];

        if (selected.classList.contains("selected")) {
          selected.classList.remove("selected");
          selectedNum = null;
        } else {
          // Deselect all other numbers
          for (let j = 0; j < N; j++) {
            id("number-container").children[j].classList.remove("selected");
          }
          // Select this number and update selectedNum accordingly
          selected.classList.add("selected");
          selectedNum = selected.textContent;
          updateMove();
        }
      }
    });
  }
};
