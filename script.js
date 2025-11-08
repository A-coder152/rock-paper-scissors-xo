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
    if(findWin()) {endGame()}
    if (gameOver) {return}
    turn = (turn == "X") ? "O": "X"
    if (turn == "O" && gamemode == "singleplayer") {return setTimeout(aiMove(), 0)}
    turnTracker.textContent = `${turn}'s turn`
}

function findWin(board = ""){
    if (board == "") {board = Array.from(cells).map(cell => cell.textContent)}

    return winLines.some((line) => {
        let cell1 = board[line[0]]
        let cell2 = board[line[1]]
        let cell3 = board[line[2]]
        if (cell1 == cell2 && cell3 && cell1 == cell3){
            return true
        }
        //console.log(cell1, cell2, cell3, turn)
        return false
    })
}

function endGame(){
    turnTracker.textContent = `${turn} wins!`
    gameOver = true
}

function restart(start){
    cells.forEach(cell => cell.textContent = "")
    gameOver = false
    turn = start
    turnTracker.textContent = `${start}'s turn`
    if (turn == "O" && gamemode == "singleplayer") {aiMove()}
}

function analyzeMove(simTurn, simCell, simBoard, history = new Set(), currentDepth = 0){
    let newBoard = Array.from(simBoard)
    newBoard[simCell[0]] = simCell[1]
    if (findWin(newBoard)) {return simTurn}
    if (currentDepth > 0) {return "D"}

    let boardString = newBoard.join(" ")
    if (history.has(boardString)) {return "I"}
    let newHistory = new Set(history).add(boardString)

    simTurn = (simTurn == "X") ? "O" : "X"
    let outcomes = []

    newBoard.forEach((scell, index) => {
        if (scell) {
            outcomes.push(analyzeMove(simTurn, [index, beatsDict[beatsDict[scell]]], newBoard, newHistory, currentDepth + 1))
        } else {
            moves.forEach(move => {
                outcomes.push(analyzeMove(simTurn, [index, move], newBoard, newHistory, currentDepth + 1))
            })
        }
    })

    return outcomes
}

function randomMove(){
    let cell = cells[Math.floor(Math.random() * cells.length)]
    selectedMove = (cell.textContent) ? beatsDict[beatsDict[cell.textContent]] :moves[Math.floor(Math.random() * moves.length)]
    playMove(cell)
}

function aiMove(){
    let simBoard = Array.from(cells).map(cell => cell.textContent)
    let outcomes = []
    simBoard.forEach((scell, index) => {
        if (scell) {
            outcomes.push(analyzeMove(turn, [index, beatsDict[beatsDict[scell]]], simBoard))
        } else {
            moves.forEach(move => {
                outcomes.push(analyzeMove(turn, [index, move], simBoard))
            })
        }
    })
    //let total_outcomes = outcomes.length'
    outcomes = outcomes.flat(Infinity)
    console.log(outcomes.filter((outcome) => outcome == "X").length, outcomes.filter((outcome) => outcome == "O").length, outcomes)
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