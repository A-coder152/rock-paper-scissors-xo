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

let deepSearch = true
let maxDepth = 100


function findWin(board){
    return winLines.some((line) => {
        let cell1 = board[line[0]]
        let cell2 = board[line[1]]
        let cell3 = board[line[2]]
        return cell1 && cell1 == cell2 && cell1 == cell3
    })
}

function analyzeMove(ogMove, simTurn, simCell, simBoard, history = new Set(), currentDepth = 0, alpha = -Infinity, beta = Infinity){
    let newBoard = Array.from(simBoard)
    newBoard[simCell[0]] = simCell[1]
    if (findWin(newBoard)) {return (simTurn == "X") ? -100 + currentDepth: 100 - currentDepth}
    if (currentDepth > 10) {return 0}

    let boardString = newBoard.join("|") + simTurn
    if (history.has(boardString)) {return -5}
    if (positionsTable.has(boardString)) {return positionsTable.get(boardString)}
    let newHistory = new Set(history).add(boardString)

    simTurn = (simTurn == "X") ? "O" : "X"
    let bestScore = (simTurn == "X") ? Infinity : -Infinity

    let outcomes = []
    newBoard.forEach((scell, index) => {
        if (scell) {
            outcomes.push({"index": index, "move": beatsDict[beatsDict[scell]], "beats": 1})
        } else {
            moves.forEach(move => {
                outcomes.push({"index": index, "move": move, "beats": 0})
            })
        }
    })
    outcomes.sort((a, b) => a.beats - b.beats)

    let death = []
    for (const outcome of outcomes){
        const play = [outcome.index, outcome.move]

        const score = analyzeMove(ogMove, simTurn, play, newBoard, newHistory, currentDepth + 1, alpha, beta)
        death.push(score)
        /*if (Math.random() > 0.999) {
            console.log(play, score, currentDepth + 1, newBoard.join("|"))
            console.log(simTurn)
        }*/

        if (simTurn == "X") {
            bestScore = Math.min(bestScore, score)
            beta = Math.min(beta, bestScore)
        } else {
            bestScore = Math.max(bestScore, score)
            alpha = Math.max(alpha, bestScore)
        }

        if (!deepSearch && beta <= alpha){break}
    }

    if (ogMove.index == 1 && ogMove.move == "S" && ogMove.beats == 0 && currentDepth <= 1) {console.log(death, simCell, bestScore, simTurn)}
    if (bestScore != 0) {positionsTable.set(boardString, (100 - newBoard.reduce((sum, thing) => thing? sum+1:sum, 0)) * Math.sign(bestScore))}
    return bestScore
}

function startAnalysis(simBoard, simTurn){
    let outcomes = []
    let analyzedMoves = []
    simBoard.forEach((scell, index) => {
        if (scell) {
            outcomes.push({"index": index, "move": beatsDict[beatsDict[scell]], "beats": 1})
        } else {
            moves.forEach(move => {
                outcomes.push({"index": index, "move": move, "beats": 0})
            })
        }
    })
    outcomes.sort((a, b) => a.beats - b.beats)

    outcomes.forEach(outcome => {
        const score = analyzeMove(outcome, simTurn, [outcome.index, outcome.move], simBoard)
        analyzedMoves.push({"move": [outcome.index, outcome.move], "score": score})
    })

    analyzedMoves.sort((a, b) => b.score - a.score)
    console.log(positionsTable)
    return analyzedMoves
    //let total_outcomes = outcomes.length'
    //outcomes = outcomes.flat(Infinity)
    //console.log(outcomes.filter((outcome) => outcome == "X").length, outcomes.filter((outcome) => outcome == "O").length, outcomes)
    //return "done"
}

onmessage = function(e) {
    if (e.data.type == "playMove"){
        maxDepth = e.data.maxDepth * 4
        console.log(maxDepth)
        let analysis = startAnalysis(e.data.board, e.data.turn)
        self.postMessage({"analysis": analysis})
    }
}