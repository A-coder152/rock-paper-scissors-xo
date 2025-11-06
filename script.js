const cells = document.querySelectorAll(".cell")
const restartBtn = document.getElementById("restart")
const turnTracker = document.getElementById('turnTracker')
const selectRock = document.getElementById('selectRock')
const selectPaper = document.getElementById('selectPaper')
const selectScissors = document.getElementById('selectScissors')

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
const beatsDict = {"R": "S", "P": "R", "S": "P"}

let turn = "X"
let gameOver = false
let selectedMove = "R"

function cellClicked(event){
    if (gameOver) {return}
    cell = event.currentTarget
    if (cell.textContent) {
        if (beatsDict[selectedMove] != cell.textContent) {return}
    }
    cell.textContent = selectedMove
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
        if (cell1.textContent == cell2.textContent && cell3.textContent && cell1.textContent == cell3.textContent){
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

selectRock.addEventListener("click", () => {selectedMove = "R"})
selectPaper.addEventListener("click", () => {selectedMove = "P"})
selectScissors.addEventListener("click", () => {selectedMove = "S"})