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
const positionsTable = new Map()

let deepSearch = false


function findWin(board){
    return winLines.some((line) => {
        let cell1 = board[line[0]]
        let cell2 = board[line[1]]
        let cell3 = board[line[2]]
        return cell1 == cell2 && cell3 && cell1 == cell3
    })
}

function analyzeMove(simTurn, simCell, simBoard, history = new Set(), currentDepth = 0, alpha = -Infinity, beta = Infinity){
    let newBoard = Array.from(simBoard)
    newBoard[simCell[0]] = simCell[1]
    if (findWin(newBoard)) {return simTurn}
    if (currentDepth > 4) {return "D"}

    let boardString = newBoard.join(" ")
    if (history.has(boardString)) {return "I"}
    if (positionsTable.has(boardString)) {return positionsTable.get(boardString)}
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

    positionsTable.set(boardString, outcomes)
    return outcomes
}

function startAnalysis(simBoard, turn){
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
}

onmessage = function(e) {
    if (e.data.type == "playMove"){
        startAnalysis(e.data.board, e.data.currentTurn)
    }
}