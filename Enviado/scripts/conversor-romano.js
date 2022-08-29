const inputForm = document.getElementById("input-form");
const submitBtn = document.getElementById("submit-btn");
const mainTitle = document.getElementById("title");
const switchCheckbox = document.getElementById("switch-checkbox");
let inputRoman = document.getElementById("input-romano");
let inputArabic = document.getElementById("input-arabico");

switchCheckbox.addEventListener("change", ()=> {

    //Conversão de Arábico para Romano
    if (switchCheckbox.checked) {
      mainTitle.innerText = "Conversor de Arábico Para Romano";
      inputForm.innerHTML =
      `
      <label for="input-arabico">Arábico:</label>
      <input autocomplete="off" type="number" id="input-arabico" placeholder="Ex: 3999"/>

      <label for="input-romano">Romano:</label>
      <input readonly type="text" id="input-romano" placeholder="Resultado" pattern="[A-Za-z]*"/>
      `;
    } 
    else { //Conversão de Romano para Arábico
      mainTitle.innerText = "Conversor de Romano Para Arábico";
      inputForm.innerHTML =
      `
      <label for="input-romano">Romano:</label>
      <input autocomplete="off" type="text" id="input-romano" placeholder="Ex: XVIII" pattern="[A-Za-z]*"/>
      
      <label for="input-arabico">Arábico:</label>
      <input readonly type="number" id="input-arabico" placeholder="Resultado"/>
      `;
    }
    
    // Como o HTML foi alterado, as referências precisam ser reatribuídas!
    inputRoman = document.getElementById("input-romano");
    inputArabic = document.getElementById("input-arabico");
});


function checkInput(form) {

  if (switchCheckbox.checked)
    arabicToRoman();
  else
    romanToArabic();
}

function romanToArabic() {
  
  let currentLetter, letterCheck = 0, finalResult;
  let i = 1, previousValue, currentValue;

  inputRoman.value = inputRoman.value.toUpperCase();

  currentLetter = inputRoman.value[0];
  finalResult = getValue(currentLetter);

  while (i < inputRoman.value.length) {

    // Verifica se mais que 3 letras foram repetidas em série
    if (inputRoman.value[i-1] == currentLetter) {
      letterCheck++;

      if ((i == inputRoman.value.length-1) && (inputRoman.value[i] == currentLetter)) {
        letterCheck++;
      }
    }
    else {
      currentLetter = inputRoman.value[i-1];
      letterCheck = 1;
    }

    currentValue = getValue(inputRoman.value[i]);
    previousValue = getValue(inputRoman.value[i-1]);

    //Verifica se existem letras inválidas ou se mais que 3 leras foram repetidas
    if (letterCheck == 4 || currentValue == -1  || previousValue == -1) { 
      return alert("Número Inválido!");
    }


    if (previousValue < currentValue) {
      finalResult = finalResult - 2*previousValue + currentValue;
    }
    else {
      finalResult = finalResult + currentValue;
    }

    i++;
  }


  if (finalResult >= 3999) { 
    alert("Número Inválido!");
  }
  else {
    inputArabic.value = finalResult;
  }
}


function getValue(letter) {
  switch (letter) {
    case 'I':
      value = 1;
      break;
    case 'V':
      value = 5;
      break;
    case 'X':
      value = 10;
      break;
    case 'L':
      value = 50;
      break;
    case 'C':
      value = 100;
      break;
    case 'D':
      value = 500;
      break;
    case 'M':
      value = 1000;
      break;
    default:
      value = -1;
  }
    
  return value;
}


function arabicToRoman() {

  let repeatCount, arabicNumber = inputArabic.value;
  let finalResult = "";

  /* Mapa que faz a relação entre letras e números. OBS: Números
  que seguem a regra da subtração (IV - 4, IX - 9, etc...) foram considerados
  no mapa para facilitar a conversão.*/
  const letterMap = {
    M:  1000, CM: 900,
    D:  500,  CD: 400,
    C:  100,  XC: 90,
    L:  50,   XL: 40,
    X:  10,   IX: 9,
    V:  5,    IV: 4,
    I:  1
  };

  if (arabicNumber <= 3999) {

    while (arabicNumber > 0) {
      for (letter in letterMap) {

        //Conta o número de repetições sucessivas de cada letra
        repeatCount = Math.floor(arabicNumber/letterMap[letter]);
        arabicNumber = arabicNumber%letterMap[letter];
  
        while (repeatCount > 0) {
          finalResult = finalResult + letter;
          repeatCount--;
        }
      }
    }
  }
  else {
    return alert("Número Inválido!");
  }

  inputRoman.value = finalResult;
}