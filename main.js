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
var N = 9;
var sec = 10;
/**
 * https://rapidapi.com/sayantikag98/api/sudoku-solver2/
 * Solve API button uses the api above to solve the given problem
 * 
 *  */ 


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

/**
 * This function gets the values i each cells and return a string 
 * format that api can read
 * @returns string in the format as API requests
 */
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
    return arr.join("");
}

/**
 * this function fill the cells with the values recieved from API
 * @param {res} is an object retrieved from api. it contains properties
 * as "answer", "canBeSolved"...etc 
 */
function fillCells(res){
    const inputs = document.querySelectorAll(".input-cell");
    if(res.canBeSolved && res.answer){
        console.log("answer: "+res.answer);
        for(var i=0;i<res.answer.length;i++){
            inputs[i].value=res.answer[i];
        }
    }else{        
        resultText.textContent = "No solution! (from API)";        
    }
}

// cleans each cell on the grid
function cleanCells(){
    const inputs = document.querySelectorAll(".input-cell");
    inputs.forEach(input => {
        input.value="";
        input.setAttribute("style", "color: black;font-weight: normal;");
    });
    resultText.textContent = "";
}

/**
 * This function solve the given problem with API.
 * makes a request and returns data(answer). 
 */
function solve(){
    var d = "";    
    d = getVals();
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
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
          fillCells(response.data);
      }).catch(function (error) {
          console.error(error);
      });
}


/**
 * this function looks for duplicate values in an array.
 * 
 * @param {array} arr 
 * array to be searched
 * @returns true if there is duplicate or false if not
 */
function hasDuplicate(arr){
    return (new Set(arr)).size !== arr.length;
}

/**
 * this function generate problem to be solved.
 * 
 * @param {String} num 
 * it decides how many numbers will be generated for problem in advance
 */
function generateSolvableGame(num){    
    const inputs = document.querySelectorAll(".input-cell");
    var count =0;
    var res= [];

    var timer = setInterval(()=>{
        cleanCells();
        var is_ver_ok =false;
        var is_hor_ok =false;
        var is_sq_ok = false;
        var temp=[];
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
            for(var i=0; i<inputs.length;i+=9){
                var temp =[];
                for(var j=i;j<i+9;j++){
                    if(inputs[j].value !=""){
                        temp.push(parseInt(inputs[j].value));
                    }else{
                        temp.push(0);
                    }
                }
                res.push(temp);
            }
            // console.log(res);
            clearInterval(timer);
        }


    },sec);

    console.log(count);
    return res;
    
}

//----------------------------------------------------------------
function solveSudoku(grid, row, col){		
	if (row == N - 1 && col == N)
		return true;
	if (col == N){
		row++;
		col = 0;
	}

	if (grid[row][col] != 0)
		return solveSudoku(grid, row, col + 1);

	for(let num = 1; num < 10; num++){	
		if (isSafe(grid, row, col, num)){		
			grid[row][col] = num;			
			if (solveSudoku(grid, row, col + 1))
				return true;
		}		
		grid[row][col] = 0;
	}
	return false;
}

function isSafe(grid, row, col, num){

	for(let x = 0; x <= 8; x++)
		if (grid[row][x] == num)
			return false;

	for(let x = 0; x <= 8; x++)
		if (grid[x][col] == num)
			return false;

	let startRow = row - row % 3,
		startCol = col - col % 3;
		
	for(let i = 0; i < 3; i++)
		for(let j = 0; j < 3; j++)
			if (grid[i + startRow][j + startCol] == num)
				return false;

	return true;
}


//-------------------------------------------------------------------



solveButton.addEventListener("click", solve);
solveButton2.addEventListener("click", ()=>{
    var given_numbers=[];    
    var arr=[];
    var inputs = document.querySelectorAll(".input-cell");
    inputs.forEach((input)=>{
        if(input.value){
            given_numbers.push(parseInt(input.value));
        }else{
            given_numbers.push(0);
        }
    });
    console.log(given_numbers);    
    while(given_numbers.length) arr.push(given_numbers.splice(0,N));
    console.log(arr);

    if (solveSudoku(arr, 0, 0)){
        var vals = [].concat(...arr);
        for(var i=0;i<vals.length;i++){
            inputs[i].value = vals[i];
        }
        
    }else{
	    resultText.textContent = "no solution (from code)";
    }
});
cleanButton.addEventListener("click", cleanCells);
generateButton.addEventListener("click", ()=>{
    if(parseInt(genInput.value)<=squares){
        generateSolvableGame(parseInt(genInput.value));        
    }else{
        resultText.textContent = `invalid input. cell number can not be more than ${squares}`;
    }
    
});





