const puzzleBoard = document.querySelector("puzzle-board");
const solveButton = document.querySelector("solve-btn");
const squares = 81;

for(var i=0;i<squares; i++){
    const cell = document.createElement("input");
    cell.setAttribute("type", "number");
    cell.setAttribute("min", 0);
    cell.setAttribute("max", 9);
    puzzleBoard.appendChild(cell);
}


