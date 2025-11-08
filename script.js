const cells = document.querySelectorAll(".cell")
const restartBtn = document.getElementById("restart")
const restartOBtn = document.getElementById("restartO")
const turnTracker = document.getElementById('turnTracker')
const selectRock = document.getElementById('selectRock')
const selectPaper = document.getElementById('selectPaper')
const selectScissors = document.getElementById('selectScissors')
const singleplayerBtn = document.getElementById('singleplayer')
const twoplayerBtn = document.getElementById('twoplayer')

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
const moves = ["R", "P", "S"]
const beatsDict = {"R": "S", "P": "R", "S": "P"}

let gamemode = "singleplayer"
let turn = "X"
let gameOver = false
let selectedMove = "R"

function cellClicked(event){
    if (gameOver) {return}
    playMove(event.currentTarget)
}

function playMove(cell) {
    if (cell.textContent) {
        if (beatsDict[selectedMove] != cell.textContent) {return}
    }
    cell.textContent = selectedMove
    findWin()
    if (gameOver) {return}
    turn = (turn == "X") ? "O": "X"
    if (turn == "O" && gamemode == "singleplayer") {return aiMove()}
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

function restart(start){
    cells.forEach(cell => cell.textContent = "")
    gameOver = false
    turn = start
    turnTracker.textContent = `${start}'s turn`
    if (turn == "O" && gamemode == "singleplayer") {aiMove()}
}

function randomMove(){
    var cell = cells[Math.floor(Math.random() * cells.length)]
    selectedMove = (cell.textContent) ? beatsDict[beatsDict[cell.textContent]] :moves[Math.floor(Math.random() * moves.length)]
    playMove(cell)
}

function aiMove(){
    randomMove()
}

cells.forEach(cell => 
    cell.addEventListener("click", cellClicked)
)

restartBtn.addEventListener("click", () => restart("X"))
restartOBtn.addEventListener("click", () => restart("O"))

selectRock.addEventListener("click", () => {selectedMove = "R"})
selectPaper.addEventListener("click", () => {selectedMove = "P"})
selectScissors.addEventListener("click", () => {selectedMove = "S"})

singleplayerBtn.addEventListener("click", () => {gamemode = "singleplayer"})
twoplayerBtn.addEventListener("click", () => {gamemode = "twoplayer"})