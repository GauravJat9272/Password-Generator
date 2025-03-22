const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols ='~`!@#$%^&*()-_=+[{]}|;:",<.>/? ';

let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ste strength circle colr ot grey

// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
} 
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}
function generateSymbols(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower|| hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value.trim());
        copyMsg.innerText = "Copied!";
        copyMsg.style.opacity = "1";
    }
    catch(e){
        copyMsg.innerText = "Failed!";
        copyMsg.style.opacity = "1";
    }
    // to make copy wala span visible
    setTimeout(() => {
        copyMsg.style.opacity="0";
    },2000);

}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i= array.length-1; i>0; i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
    if(passwordLength < checkCount){
        passwordLength =  checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = Math.min(20, Math.max(1, parseInt(e.target.value))); // Keep within 1-20
    handleSlider();
});


copyBtn.addEventListener('click', () =>{
   if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener("click",() =>{
     //none of the checkbox are selected
     if(checkCount===0) return;
     if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();

     }
     //let start the journey to find the new password
     console.log("Starting the Journey");
     //remove old password
     password="";
     //lets put the stuff mentioned by checkbox
    //  if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    //  }
    //  if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    //  }
    //  if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    //  }
    //  if(symbolsCheck.checked){
    //     password+=generateSymbols();
    //  }

    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbols);
    //compulsory addition
    for(let i=0; i<funcArr.length; i++)
    {
        password+=funcArr[i]();
    }

    console.log("Complasory addtion done");

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++)
    {
        let randIndex = getRndInteger(0,funcArr.length-1);
        password+=funcArr[randIndex]();
    }

    console.log("Remaining addition done");

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");
    //calculate strength
    calcStrength();
});