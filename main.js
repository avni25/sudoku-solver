const puzzleBoard = document.querySelector("#puzzle-board");
const buttonArea = document.querySelector(".buton-container");
const solveButton = document.querySelector("#solve-btn");
const solveButton2 = document.querySelector("#solve-btn2");
const cleanButton = document.getElementById("clean-btn");
const generateButton = document.getElementById("generate-btn");
const genInput = document.getElementById("gen-input");
const resultText = document.getElementById("result-text");


const squares = 81;
const min =0, max = 9;

// https://rapidapi.com/sayantikag98/api/sudoku-solver2/

for(var i=0;i<squares; i++){
    const cell = document.createElement("input");
    cell.setAttribute("type", "number");
    cell.setAttribute("min", min);
    cell.setAttribute("max", max);
    cell.setAttribute("class", "input-cell");
    puzzleBoard.appendChild(cell);
}


const getVals =() =>{
    var given_numbers=[];
    var arr=[];
    const inputs = document.querySelectorAll(".input-cell");
    inputs.forEach((input)=>{
        if(input.value){
            given_numbers.push(input.value);
        }else{
            given_numbers.push("x");
        }
    });
    var count=0;
    for(var i=0;i < given_numbers.length; i++){
        
        if(given_numbers[i]!="x"){
            if(count>0){
                arr.push("x"+count+"x");
            } 
            arr.push(given_numbers[i]);
            count=0;
        }else{
            count++;
        }
        if(i==given_numbers.length-1){
            arr.push("x"+count+"x");
        }
    }
    // console.log(arr.join(""));
    return arr.join("");
}

function fillCells(res){
    const inputs = document.querySelectorAll(".input-cell");
    if(res.canBeSolved && res.answer){
        console.log("answer: "+res.answer);
        for(var i=0;i<res.answer.length;i++){
            inputs[i].value=res.answer[i];
        }
    }else{        
        resultText.textContent = "No solution!";        
    }
}

function cleanCells(){
    const inputs = document.querySelectorAll(".input-cell");
    inputs.forEach(input => {
        input.value="";
        input.setAttribute("style", "color: black;font-weight: normal;");
    });
    resultText.textContent = "";
}

function solve(){
    var d = "";    
    d = getVals();
    // console.log("solve: "+d);
    var options = {
        method: 'POST',
        url: 'https://sudoku-solver2.p.rapidapi.com/',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'sudoku-solver2.p.rapidapi.com',
          'x-rapidapi-key': '9ff48dee7bmsh03eb472004792f3p14a609jsn3c96cd0b0524'
        },
        data: {
          input: d
          //'53x2x7x4x6x2x195x4x98x4x6x1x8x3x6x3x34x2x8x1x3x2x17x3x2x3x6x1x6x4x28x4x419x2x5x4x8x2x79'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
          fillCells(response.data);
      }).catch(function (error) {
          console.error(error);
      });
}

function generateGame(num){
    cleanCells();
    const inputs = document.querySelectorAll(".input-cell");
    for(var i=0; i<num;i++){
        var val = Math.floor(Math.random()*9)+1;
        var index = Math.floor(Math.random() * squares);
        inputs[index].value = val;
        inputs[index].setAttribute("style", "color: red;font-weight: bold;");
    }

}

function test(){
    const inputs = document.querySelectorAll(".input-cell");
    for(var i=0; i<inputs.length;i++){
        inputs[i].value = i;
    }



}



solveButton.addEventListener("click", solve);
solveButton2.addEventListener("click", test);
cleanButton.addEventListener("click", cleanCells);
generateButton.addEventListener("click", ()=>{
    generateGame(parseInt(genInput.value));
})




