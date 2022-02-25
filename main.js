const puzzleBoard = document.querySelector("#puzzle-board");
const solveButton = document.querySelector("#solve-btn");
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

const solve = ()=>{
    var options = {
        method: 'POST',
        url: 'https://sudoku-solver2.p.rapidapi.com/',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'sudoku-solver2.p.rapidapi.com',
          'x-rapidapi-key': '9ff48dee7bmsh03eb472004792f3p14a609jsn3c96cd0b0524'
        },
        data: {
          input: '53x2x7x4x6x2x195x4x98x4x6x1x8x3x6x3x34x2x8x1x3x2x17x3x2x3x6x1x6x4x28x4x419x2x5x4x8x2x79'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
      }).catch(function (error) {
          console.error(error);
      });
}

solveButton.addEventListener("click", solve);
