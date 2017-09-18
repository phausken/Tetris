const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const preview = document.getElementById('preview');
const previewContext = preview.getContext('2d');

const boardWidth = 10;
const boardHeight = 20;
const tileSize = 18;
const previewWidth = 4;
const previewHeight = 4;

let gameScore = 0;
let clearedLines = 0;

const earnedLevel = (lines) => {
  if (lines <= 0){
    return 1;
  } else if (lines >=1 && lines <= 90){
    return 1 + Math.floor((lines - 1) / 10 );
  } else if (lines >= 91){
    return 10;
  }

};


function timeInterval(){
  return 500 - (50 * earnedLevel(clearedLines));
}

canvas.width = boardWidth * tileSize;
canvas.height = boardHeight * tileSize;
preview.height = previewHeight * tileSize;
preview.width = previewWidth * tileSize;

const newLine = () => {
let newArray = [];
  for (let i = 0; i < boardWidth; i ++){
    newArray[i] = false;
  }
  return newArray;
};

function makeGrid(){
const grid = [];
for (let row = 0; row < boardHeight; row++){
  grid[row] = newLine();
}
  return grid;
}

class Board {
  constructor(){
    this.grid = makeGrid();
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
    document.getElementById("lines").innerHTML = clearedLines;
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
      document.getElementById("level").innerHTML = earnedLevel(clearedLines);
    }



  drawBoard(){

    for (let y = 0; y < boardHeight; y++) {
  		for (let x = 0; x < boardWidth; x++) {
        let color;
  			this.grid[y][x] === false ? color = "white" : color = this.grid[y][x];

        drawSquare(context, x, y, color);
        }
  	  }
     }



}

const gameBoard = new Board;


const drawSquare = (ctx, x, y, color) => {
  ctx.fillStyle = color || "white";
	ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  ctx.strokeStyle = "white";
	ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
};



class Piece {
  constructor(shape, color){
    this.shape = shape;
    this.color = color;
    this.xOffset = 3;
    this.yOffset = -3;
  }



  draw(color, ctx){
    for (let y = 0; y < this.shape.length; y++) {
  		for (let x = 0; x < this.shape.length; x++) {
  			if (this.shape[x][y] === 1) {
  				drawSquare(ctx, (this.xOffset + y), (this.yOffset + x), color);
        }
      }
    }
  }

  moveLeft(){
    if (!this.collision(-1,0, this.shape)){
      this.draw("white", context);
      this.xOffset--;
      this.draw(this.color, context);
    }
  }

  moveRight(){
    if (!this.collision(1,0, this.shape)){
      this.draw("white", context);
      this.xOffset++;
      this.draw(this.color, context);
    }
  }

  moveDown(){
    if (this.collision(0, 1, this.shape)){
      this.freeze();
      this.draw("white", context);
      gameBoard.drawBoard();
    } else {
      this.draw("white", context);
      this.yOffset++;
      this.draw(this.color, context);
    }
  }

  rotate(){
    if (!this.collision(0, 0, rotateMatrix(this.shape))){
      this.draw("white", context);
      this.shape = rotateMatrix(this.shape);
      this.draw(this.color, context);
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
          const restart = document.getElementById("restart-menu");
          restart.style.display="";
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
let newShape = tetrisPieces[getRandomInt(0, 7)];



function newPiece(){
  let newRandom = getRandomInt(0, 7);
  newShape = tetrisPieces[newRandom];


  for (let y = 0; y < newShape.shape.length; y++) {
    for (let x = 0; x < newShape.shape.length; x++) {
      if (newShape.shape[x][y] === 1) {
        drawSquare(previewContext, (y), (x), newShape.color);
      } else if (newShape.shape[x][y] === 0 ){
        drawSquare(previewContext, (y), (x), "white");
      }
    }
  }

  if (newShape.shape[1][3] === undefined){
    drawSquare(previewContext, (3), (1), "white");
  }
}

function addPiece(){
  let newRandom = getRandomInt(0, 7);



  currentPiece = new Piece(newShape.shape, newShape.color);
  newPiece();

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
    case "s":
      gameRun();
      for (let y = 0; y < newShape.shape.length; y++) {
        for (let x = 0; x < newShape.shape.length; x++) {
          if (newShape.shape[x][y] === 1) {
            drawSquare(previewContext, (y), (x), newShape.color);
          } else if (newShape.shape[x][y] === 0 ){
            drawSquare(previewContext, (y), (x), "white");
          }
        }
      }

      break;
  }
};

function reset(){
  gameBoard.grid = makeGrid();
  gameBoard.drawBoard();
  clearedLines = 0;
  gameScore = 0;
  document.getElementById("lines").innerHTML = 0;
  document.getElementById("score").innerHTML = 0;
  document.getElementById("level").innerHTML = 1;
  const restart = document.getElementById("restart-menu");
  restart.style.display="none";
  gameRun();
}

document.addEventListener("keydown", pressKey);

const button = document.getElementById("button");
button.addEventListener("click", ()=>{reset();});


let start = Date.now();

function gameRun(){
  let now = Date.now();
  let delta = now - start;
  if (delta > timeInterval()){
    currentPiece.moveDown();
    start = now;
  }

  requestAnimationFrame(gameRun);

}
