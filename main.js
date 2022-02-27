const puzzleBoard = document.querySelector("#puzzle-board");
const buttonArea = document.querySelector(".buton-container");
const solveButton = document.querySelector("#solve-btn");
const solveButton2 = document.querySelector("#solve-btn2");
const cleanButton = document.getElementById("clean-btn");
const generateButton = document.getElementById("generate-btn");
const testButton = document.getElementById("test-btn");
const genInput = document.getElementById("gen-input");
const resultText = document.getElementById("result-text");



const squares = 81;
const min =0, max = 9;

// https://rapidapi.com/sayantikag98/api/sudoku-solver2/

for(var i=0;i<squares; i++){
    var t = "input-cell-"+i;
    const cell = document.createElement("input");
    cell.setAttribute("type", "number");
    cell.setAttribute("min", min);
    cell.setAttribute("max", max);
    cell.setAttribute("class", "input-cell");
    cell.setAttribute("id", t);
    puzzleBoard.appendChild(cell);
}

for(var i=2;i<squares; i+=3){
    const inputs = document.querySelectorAll("input");      
    inputs[i].setAttribute("style", "border-right: 2px solid black;");
}


for(var i=27, j=54;i<=35; i++, j++){
    const inputs = document.querySelectorAll("input");
    var style  = "border-top: 2px solid black;";
    if(i == 29 || i == 35 || j==56){
        style += "border-right: 2px solid black;";
    }else if(i == 33){
        style += "border-left: 2px solid black;";
    }      
    inputs[i].setAttribute("style", style);
    inputs[j].setAttribute("style", style);
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

function hasDuplicate(arr){
    return (new Set(arr)).size !== arr.length;
}

function generateSolvableGame(num){
    
    const inputs = document.querySelectorAll(".input-cell");
    var count =0;

    var timer = setInterval(()=>{
        cleanCells();
        var is_ver_ok =false;
        var is_hor_ok =false;
        var is_sq_ok = false;

        for(var i=0; i<num;i++){
            var val = Math.floor(Math.random()*9)+1;
            var index = Math.floor(Math.random() * squares);
            inputs[index].value = val; 
            inputs[index].setAttribute("style", "color: red;font-weight: bold;");
        }
        
        // check horizontally
        for(var i=0; i<inputs.length; i+=9){
            var arr=[];
            for(var j =i; j<i+9 ; j++){
                if(inputs[j].value != "")
                    arr.push(inputs[j].value);
            }
            // console.log(arr);
            if(hasDuplicate(arr)){
                // console.log(`duplicate horizontal on row: ${i}`);
                is_hor_ok = true;
            }
        }
    
        //check vertically
        for(var i=0; i<9; i++){
            var arr =[];
            for(var j=i; j<inputs.length; j+=9){
                if(inputs[j].value != "")
                    arr.push(inputs[j].value);
            }
            // console.log(arr);
            if(hasDuplicate(arr)){
                // console.log(`duplicate vertical on col: ${i}`);
                is_ver_ok = true;
            }
        }
    
        //check square
        for(var i=0; i<squares;i+=27){
            for(var j=i; j < i+9; j+=3){
                // console.log(j);
                var arr=[];
                for(var z =j; z<j+3; z++){
                    // console.log(`${z} ${z+9} ${z+18}`);
                    if(inputs[z].value != "") arr.push(inputs[z].value);
                    if(inputs[z+9].value != "") arr.push(inputs[z+9].value);
                    if(inputs[z+18].value != "") arr.push(inputs[z+18].value);
                        
                }
                // console.log(arr);
                if(hasDuplicate(arr)){
                    // console.log(`duplicate square on square: ${j}`);
                    is_sq_ok = true;
                }
                // console.log("------");
            }
        }

        count++;
        if(!is_hor_ok && !is_ver_ok && !is_sq_ok){
            //break;
            clearInterval(timer);
        }


    },100);

    console.log(count);
    
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
    if(parseInt(genInput.value)<=squares){
        generateSolvableGame(parseInt(genInput.value));
    }else{
        resultText.textContent = `invalid input. cell number can not be more than ${squares}`;
    }
    
});

testButton.addEventListener("click", ()=>{
    if(parseInt(genInput.value)<=squares){
        generateSolvableGame(parseInt(genInput.value));
    }else{
        resultText.textContent = `invalid input. cell number can not be more than ${squares}`;
    }
});




