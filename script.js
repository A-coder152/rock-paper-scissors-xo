const cells = document.querySelectorAll(".cell")
const restartBtn = document.getElementById("restart")
const turnTracker = document.getElementById('turnTracker')

const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let turn = "X"
let gameOver = false

function cellClicked(event){
    if (gameOver) {return}
    cell = event.currentTarget
    cell.textContent = turn
    findWin()
    if (gameOver) {return}
    turn = (turn == "X") ? "O": "X"
    turnTracker.textContent = `${turn}'s turn`
}

function findWin(){
    winLines.forEach((line) => {
        let cell1 = cells[line[0]]
        let cell2 = cells[line[1]]
        let cell3 = cells[line[2]]
        if (cell1.textContent == cell2.textContent && cell3.textContent && turn && cell1.textContent == cell3.textContent){
            turnTracker.textContent = `${turn} wins!`
            gameOver = true
        }
        console.log(cell1.textContent, cell2.textContent, cell3.textContent, turn)
    })
}

cells.forEach(cell => 
    cell.addEventListener("click", cellClicked)
)

restartBtn.addEventListener("click", () => {
    cells.forEach(cell => cell.textContent = "")
    gameOver = false
    turn = "X"
    turnTracker.textContent = "X's turn"
})