class cell {
  constructor() {
    this.cellState = 'empty';
    this.neighborCount = 0;
  }
}


let gameSize =  10;
let gameMatrix;
let gameState = 'paused';
let waitTime = 500; //Tempo de espera entre gerações em ms

const resetBtn = document.getElementById('reset-btn');
const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
let slider = document.getElementById("grid-slider");
let sliderValue = document.getElementById("slider-value");

createGame();






//Reseta o game com a mudança do slider
slider.addEventListener('change', ()=> {
  
  pauseGame();
  gameMatrix = undefined;
  gameGrid = undefined;
  gameSize = sliderValue.value;

  createGame();
});


function playGame() {
  
  if (gameState == 'playing') {
    nextGeneration();
  }
  else {
    clearInterval();
  }
}

function pauseGame() {
  gameState = 'paused';
  playBtn.innerHTML = `<i class="fa-solid fa-caret-right"></i>Play`;
}


//Botões
//////////////////////////////////////////////////////
nextBtn.addEventListener('click', () => nextGeneration());

playBtn.addEventListener('click', () => {

  if (gameState == 'paused') {
    gameState = 'playing';
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>Pause`;
    setInterval(playGame, waitTime);
  }
  else {
    pauseGame();
  }
});

resetBtn.addEventListener('click', () => {
  resetGame();
  updateGrid();
});
//////////////////////////////////////////////////////



function createGame(){

  let i,j;
  let gameGrid = document.getElementById("game-grid");

  gameGrid.innerHTML = ``; //Reseta o conteúdo interno da tabela

  //Inicializa a matriz de células e relaciona com o HTML
  gameMatrix = new Array(gameSize);
  
  for (i=0; i<gameSize; i++) {
    gameMatrix[i] = new Array(gameSize);
    let gridRow = document.createElement('tr');

    for (j=0; j<gameSize; j++) {
      gameMatrix[i][j] = new cell();

      let cellPosition = document.createElement('td');
      
      //O id de cada célula terá o formato "(i:j)"
      cellPosition.setAttribute('id', i +':'+ j);
      cellPosition.classList.add('empty');
      cellPosition.addEventListener('click', setInitialState);
      gridRow.appendChild(cellPosition);
    }
    gameGrid.appendChild(gridRow);
  }
}

function setInitialState() {

  let i = this.id.split(':')[0]; //Pega a coordenada horizontal na matriz
  let j = this.id.split(':')[1]; //Pega a coordenada vertical na matriz
  
  if(gameMatrix[i][j].cellState == 'empty') {
    gameMatrix[i][j].cellState = 'alive';
    this.classList.add('alive');
  }
  else {
    gameMatrix[i][j].cellState = 'empty';
    this.classList.remove('alive');
  }
}

function resetGame () {
  let i,j;

  pauseGame();

  for (i=0;i<gameSize;i++) {
    for (j=0;j<gameSize;j++) {
      gameMatrix[i][j].cellState = 'empty';
      gameMatrix[i][j].neighborCount = 0;
    }
  }
}


//Atualiza o grid visível de acordo com a matriz equivalente
function updateGrid() {
  for (i=0;i<gameSize;i++) {
    for (j=0;j<gameSize;j++) {

      let currentCell = document.getElementById(i +':'+ j);

      if (gameMatrix[i][j].cellState == 'empty') {
        currentCell.classList.remove('alive');
      }
      else {
        currentCell.classList.add('alive');
      }
    }
  }
}

//Confere os vizinhos de cada célula
function checkNeighbourhood () {
  
  let i, j;

  for (i=0;i<gameSize;i++) {
    for (j=0;j<gameSize;j++) {

      //Reseta a contagem de vizinhos antes de conferir.
      gameMatrix[i][j].neighborCount = 0;

      //1º linha
      if (i>0 && j>0 && gameMatrix[i-1][j-1].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
      if (j>0 && gameMatrix[i][j-1].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
      if (i<gameSize-1 && j>0 && gameMatrix[i+1][j-1].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
        
      //2º linha
      if (i>0 && gameMatrix[i-1][j].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
      if (i<gameSize-1 && gameMatrix[i+1][j].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
    
      //3º linha
      if (i>0 && j<gameSize-1 && gameMatrix[i-1][j+1].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
      if (j<gameSize-1 && gameMatrix[i][j+1].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
      if (i<gameSize-1 && j<gameSize-1 && gameMatrix[i+1][j+1].cellState == 'alive') {
        gameMatrix[i][j].neighborCount++;
      }
    }
  }
}

function nextGeneration () {
  let i,j;
  
  //Confere todos os vizinhos antes de atualizar o estado das células
  checkNeighbourhood();

  for (i=0;i<gameSize;i++) {
    for (j=0;j<gameSize;j++) {

      //Células com menos de 2 vizinhos morrem por solidão
      //Células com mais de 3 vizinhos morrem por superpopulação
      if (gameMatrix[i][j].neighborCount < 2 || gameMatrix[i][j].neighborCount > 3) {
        gameMatrix[i][j].cellState = 'empty';
      }
      

      //Qualquer célula vazia com 3 vizinhos se torna viva.
      if (gameMatrix[i][j].cellState == 'empty' && gameMatrix[i][j].neighborCount == 3) {
        gameMatrix[i][j].cellState = 'alive';
      }
    }
  }

  updateGrid();
}




