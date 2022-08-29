class Client {
  constructor() {
    this.clientName = '';
    this.clientDebt = 0;
  }
}
class Product {
  constructor() {
    this.productName = "";
    this.productValue = 0;
    this.productClientList = new Array(1);
  }
}


let clientList, productList = new Array();
let nextStepButton = document.getElementById('next-step-btn');

let questionContainer = document.getElementById('question-container');
let nameArea = document.getElementById('client-names');
let userInput = document.getElementById('user-input');



nextStepButton.addEventListener('click', ()=> {
  if (nameArea.childElementCount > 0) {
    setClientList();
    changeToProductScreen();
  }
  else {
    alert("Insira pelo menos 1 cliente!");
  }
});

//Insere os nomes quando apertar o botão
function insertClient() {

  if (userInput.value != '') {
    let newCard = document.createElement('div');
    newCard.classList.add('name-box');
    newCard.innerHTML = `${userInput.value}<i class="fa-solid fa-x remove-btn"></i>`;
    newCard.addEventListener('click', () => nameArea.removeChild(newCard));
    nameArea.appendChild(newCard);
    userInput.value = '';
  }
}


function setClientList() {

  clientList = new Array(nameArea.childElementCount);

  let i;

  for (i=0;i<nameArea.childElementCount;i++) {
    clientList[i] = new Client;
    clientList[i].clientName = nameArea.children[i].innerText;
  }
}

function changeToProductScreen(){

  questionContainer.innerHTML =
  `
  <h2 id="question">Quais foram os produtos?</h2>
  <h3 id="subquestion">Insira o nome do produto, o preço<br>e selecione os clientes que consumiram</h3>

  <form id="question-form" onsubmit="event.preventDefault(); return insertProduct()">
    <input id="product-name-input" class="input-form" autocomplete="off" type="text" placeholder="Ex: Pizza, Refrigerante" pattern="[A-Za-z]*"/>
    <input id="product-price-input" class="input-form" autocomplete="off" type="number" placeholder="Ex: R$65,00"/>
  </form>

  <div id="name-selection"></div>
  
  <div class="button-area">
    <input class="btn" form="question-form" type="submit" id="submit-btn" value="Inserir"/>
    <button class="btn secondary" id="next-step-btn">Avançar</button>
  </div>

  <div id="product-list"></div>
  `;
  
  let nameSelection = document.getElementById('name-selection');
  let i;

  for (i=0;i<clientList.length;i++) {

    let card = document.createElement('div');
    card.classList.add('name-box');
    card.innerHTML = `${clientList[i].clientName}<i class="fa-solid fa-x remove-btn"></i>`;
    card.addEventListener('click', ()=> {

      if (card.classList.contains('card-selected')) {
        card.classList.remove('card-selected');
      }
      else {
        card.classList.add('card-selected');
      }
    });

    nameSelection.appendChild(card);
  }

  //A referência do botão de avanço é feita novamente na página de produtos!
  nextStepButton = document.getElementById('next-step-btn');
  nextStepButton.addEventListener('click', () => {
    
    let productListOutput = document.getElementById('product-list');

    if (productListOutput.childElementCount>0) { 
      changeToFinalScreen();
    }
    else {
      alert("Insira pelo menos 1 produto!");
    }
  });
}

function changeToFinalScreen() {

  let i;
  
  questionContainer.innerHTML =
  `
  <h2 id="question">Divisão Final</h2>
  
  <div id="result-area">
    <h3> A tarefa 3 está incompleta :(</h3>
  </div>
  
  <div class="button-area">
    <button class="btn secondary" id="reset-page-btn"><i class="fa-solid fa-arrow-rotate-right"></i>Reiniciar</button>
  </div>

  `;

  resetPageButton = document.getElementById('reset-page-btn');
  resetPageButton.addEventListener('click', () => document.location.reload(true));
}




function insertProduct() {
  
  let i, count = 0;
  let productListOutput = document.getElementById('product-list');
  let productNameInput = document.getElementById('product-name-input');
  let productPriceInput = document.getElementById('product-price-input');
  let nameSelection = document.getElementById('name-selection');
  let productClientList = "";


  //Validações para permitir a inserção de um produto
  for (i=0;i<clientList.length;i++) {
    if (!nameSelection.children[i].classList.contains('card-selected')) {
      count++;
    }
  }

  if (productNameInput.value == "") {
    return alert ("Informe o nome do produto!");
  }
  else if (productPriceInput.value == "") {
    return alert ("Informe o valor do produto!");
  }
  else if (count == clientList.length) {
    return alert ("Selecione pelo menos 1 cliente!");
  }

  for (i=0;i<clientList.length;i++) {
    
    if (nameSelection.children[i].classList.contains('card-selected')){

      if (productClientList ==  "") {
        productClientList += clientList[i].clientName;
      }
      else {
        productClientList += ", " + clientList[i].clientName;
      }
    }
  }

  //Insere o elemento do produto no página
  let product = document.createElement('div');
  product.classList.add('product');
  product.innerHTML = 
  `
  <div class="product-info">
    <p class="product-name">${productNameInput.value} - R$${productPriceInput.value},00</p>
    <p class="product-client-list">${productClientList}</p>
  </div>
  <i class="fa-solid fa-x remove-btn"></i>
  `;

  let j;
  if (productList.length == 0) {
    j = 0;
  }
  else {
    j = productList.length;
  }
  productList[j] = new Product();
  productList[j].productName = productNameInput.value;
  productList[j].productValue = productPriceInput.value;
  
  for (i=0;i<nameSelection.childElementCount;i++) {
    
    if (nameSelection.children[i].classList.contains('card-selected')) {
      
      //Insere o nome na lista de clientes associados ao produto
      if (!productList[j].productClientList[0]) {
        productList[j].productClientList[0] = nameSelection.children[i].innerText;
      }
      else {
        productList[j].productClientList.push(nameSelection.children[i].innerText);
      }
    }

    nameSelection.children[i].classList.remove('card-selected');
  }
  
  product.addEventListener('click', (event)=> {
    
    //Falta o código para remover o produto do array!
    productListOutput.removeChild(product);
  });

  productListOutput.appendChild(product);
  
  productNameInput.value = '';
  productPriceInput.value = '';
}




/*
Itens Restantes:

• Validação de float
• Divisão de contas
• Front interface com resultado final
• Remoção do produto do array de produtos  

*/