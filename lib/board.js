const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

const boardWidth = 10;
const boardHeight = 20;
const tileSize = 18;
let gameScore = 0;
let clearedLines = 0;

const earnedLevel =  (lines) => {
  if (lines <= 0){
    return 1;
  } else if (lines >=1 && lines <= 90){
    return 1 + Math.floor((lines - 1) / 10 );
  } else if (lines >= 91){
    return 10;
  }

};


const timeInterval = 500 - (50 * earnedLevel(clearedLines));

canvas.width = boardWidth * tileSize;
canvas.height = boardHeight * tileSize;

const newLine = () => {
let newArray = [];
  for (let i = 0; i < boardWidth; i ++){
    newArray[i] = false;
  }
  return newArray;
};

const grid = [];
for (let row = 0; row < boardHeight; row++){
  grid[row] = newLine();
}


class Board {
  constructor(){
    this.grid = grid;
  }

  clearLine(){
    let newGrid = [];
    let linesCleared = 0;
    for (let i = 0; i < this.grid.length; i++){
      if (this.grid[i].includes(false)){
        newGrid.push(this.grid[i]);
      }
    }
    while (newGrid.length < boardHeight){
      newGrid.unshift(newLine());
      linesCleared++;
    }

    this.grid = newGrid;
    clearedLines += linesCleared;
    this.updateScore(linesCleared);
  }



  updateScore(linesCleared){
    let tetris;
    switch (linesCleared){
      case 4:
        gameScore += 1200;
        tetris++;
        break;
      case 3:
        gameScore += 300;
        tetris = 0;
        break;
      case 2:
        gameScore += 100;
        tetris = 0;
        break;
      case 1:
        gameScore += 40;
        tetris = 0;
        break;
      }
      document.getElementById("score").innerHTML = gameScore;
    }



  drawBoard(){

    for (let y = 0; y < boardHeight; y++) {
  		for (let x = 0; x < boardWidth; x++) {
        let color;
  			this.grid[y][x] === false ? color = "white" : color = this.grid[y][x];

        drawSquare(x, y, color);
        }
  	  }
     }



}

const gameBoard = new Board;


const drawSquare = (x, y, color) => {
  context.fillStyle = color || "white";
	context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  context.strokeStyle = "white";
	context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
};



class Piece {
  constructor(shape, color){
    this.shape = shape;
    this.color = color;
    this.xOffset = 3;
    this.yOffset = -3;
  }



  draw(color){
    for (let y = 0; y < this.shape.length; y++) {
  		for (let x = 0; x < this.shape.length; x++) {
  			if (this.shape[x][y] === 1) {
  				drawSquare((this.xOffset + y), (this.yOffset + x), color);
        }
      }
    }
  }

  moveLeft(){
    if (!this.collision(-1,0, this.shape)){
      this.draw("white");
      this.xOffset--;
      this.draw(this.color);
    }
  }

  moveRight(){
    if (!this.collision(1,0, this.shape)){
      this.draw("white");
      this.xOffset++;
      this.draw(this.color);
    }
  }

  moveDown(){
    if (this.collision(0, 1, this.shape)){
      this.freeze();
      this.draw("white");
      gameBoard.drawBoard();
    } else {
      this.draw("white");
      this.yOffset++;
      this.draw(this.color);
    }
  }

  rotate(){
    if (!this.collision(0, 0, rotateMatrix(this.shape))){
      this.draw("white");
      this.shape = rotateMatrix(this.shape);
      this.draw(this.color);
    }
  }

  collision(newX, newY, shape){
    for (let x = 0; x < shape.length; x++){
      for (let y = 0; y < shape.length; y++){
        if (shape[y][x] === 0){
          continue;
        }

        const checkX = this.xOffset + x + newX;
        const checkY = this.yOffset + y + newY;

        if (checkY >= boardHeight || checkX < 0 || checkX >= boardWidth){
          return true;
        }

        if (checkY < 0){
          continue;
        }
        if (gameBoard.grid[checkY][checkX]){
          return true;
        }
      }
    }

    return false;
  }


  freeze(){
    for (let x = 0; x < this.shape.length; x++){
      for (let y = 0; y < this.shape.length; y++){
        if (this.shape[y][x] === 0){
          continue;
        }
        if (this.yOffset + y < 0){
          alert("Game over!");
        }

        gameBoard.grid[this.yOffset + y][this.xOffset + x] = this.color;


      }
    }
    gameBoard.clearLine();
    addPiece();
  }
}

const rotateMatrix = (matrix) => {
  let newMatrix= [];
  for (let row = 0; row < matrix.length; row++){
    newMatrix[row] = [];
    for (let column = 0; column < matrix.length; column++){
      newMatrix[row][column] = 0;
    }
  }

  for (let x = 0; x < matrix.length; x++){
    for (let y = 0; y < matrix.length; y++){
      newMatrix[x][y] = matrix[(matrix.length - y - 1)][x];
    }
  }

  return newMatrix;
};

let tetrisPieces = {
  0: {color: "cyan", shape: [
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	]},
  1: {color: "blue", shape: [
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	]},
  2: {color: "orange", shape: [
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	]},
  3: {color: "yellow", shape: [
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]},
  4: {color: "green", shape: [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	]},
  5: {color: "purple", shape: [
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	]},
  6: {color: "red", shape: [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	]},
};


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const firstRandom = getRandomInt(0, 7);

let currentPiece = new Piece(tetrisPieces[firstRandom].shape, tetrisPieces[firstRandom].color);


function addPiece(){
  let newRandom = getRandomInt(0, 7);
  currentPiece = new Piece(tetrisPieces[newRandom].shape, tetrisPieces[newRandom].color);
}




const pressKey = (e) => {
  switch (e.key){
    case "ArrowDown":
      e.preventDefault();
      currentPiece.moveDown();
      break;
    case "ArrowUp":
      e.preventDefault();
      currentPiece.rotate();
      break;
    case "ArrowLeft":
      currentPiece.moveLeft();
      break;
    case "ArrowRight":
      currentPiece.moveRight();
      break;
  }
};

document.addEventListener("keydown", pressKey);



let start = Date.now();

function run(){
  let now = Date.now();
  let delta = now - start;
  if (delta > timeInterval){
    currentPiece.moveDown();
    start = now;
  }
  requestAnimationFrame(run);
}

run();
