const cells = document.querySelectorAll(".cell")
const restartBtn = document.getElementById("restart")
const restartOBtn = document.getElementById("restartO")
const turnTracker = document.getElementById('turnTracker')
const selectRock = document.getElementById('selectRock')
const selectPaper = document.getElementById('selectPaper')
const selectScissors = document.getElementById('selectScissors')
const singleplayerBtn = document.getElementById('singleplayer')
const twoplayerBtn = document.getElementById('twoplayer')
const botSkillBar = document.getElementById('botSkill')
const botSkillDisplay = document.getElementById('botSkillP')

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
const rockfish = new Worker("rockfish.js")
rockfish.onmessage = function(e){
    const analysis = e.data.analysis
    console.log(analysis)
    let chosenMove = skillBasedMovePick(analysis, botSkill)
    console.log(chosenMove)

    selectedMove = chosenMove.move[1]
    playMove(cells[chosenMove.move[0]])
}


let gamemode = "singleplayer"
let turn = "X"
let gameOver = false
let selectedMove = "R"
let deepSearch = false
let botSkill = 300

function cellClicked(event){
    if (gameOver || turn == "O" && gamemode == "singleplayer") {return}
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
        return cell1 == cell2 && cell3 && cell1 == cell3
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

function randomMove(){
    let cell = cells[Math.floor(Math.random() * cells.length)]
    selectedMove = (cell.textContent) ? beatsDict[beatsDict[cell.textContent]] :moves[Math.floor(Math.random() * moves.length)]
    playMove(cell)
}

function aiMove(){
    const simBoard = Array.from(cells).map(cell => cell.textContent);

    rockfish.postMessage({
        "type": "playMove",
        "board": simBoard,
        "currentTurn": turn,
        "deepSearch": deepSearch,
        "maxDepth": Math.round(Math.pow(botSkill / 350, 3))
    })
}

function skillBasedMovePick(moves, skill){
    let temperature = (1100 / skill - 1) * 4
    const maxScore = moves[0].score
    
    const moveWeights = moves.map(move => {
        return Math.exp((move.score - maxScore) / temperature)
    })
    const totalWeight = moveWeights.reduce((sum, weight) => sum + weight, 0)

    let cProbabilities = []
    let cSum = 0
    for (let i = 0; i < moveWeights.length; i++){
        cSum += moveWeights[i] / totalWeight
        cProbabilities.push(cSum)
    }

    const rndNum = Math.random()
    for (let i = 0; i < moves.length; i++){
        if (rndNum < cProbabilities[i]) {return moves[i]}
    }

    return moves[-1]
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

botSkillBar.addEventListener("input", function(){
    botSkill = this.value
    botSkillDisplay.textContent = botSkill
})