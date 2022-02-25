const puzzleBoard = document.querySelector("#puzzle-board");
const solveButton = document.querySelector(".solve-btn");
const squares = 81;
const given_numbers=[];


for(var i=0;i<squares; i++){
    const cell = document.createElement("input");
    cell.setAttribute("type", "number");
    cell.setAttribute("min", 0);
    cell.setAttribute("max", 9);
    puzzleBoard.appendChild(cell);
}


const getVals =() =>{
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input)=>{
        if(input.value){
            given_numbers.push(input.value);
        }else{
            given_numbers.push(".");
        }
    });
    console.log(given_numbers);
}

solveButton.addEventListener("click", getvals);
