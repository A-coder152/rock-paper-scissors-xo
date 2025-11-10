const favPieceP = document.getElementById("favPiece")
const rockUsesP = document.getElementById("rockUses")
const paperUsesP = document.getElementById("paperUses")
const scissorUsesP = document.getElementById("scissorUses")

let user

async function loadStats(){
    user = await localforage.getItem("user")
    if (!user) {return}
    let mostUses = Math.max(user.R, user.P, user.S)
    let favPieceStr;
    console.log(mostUses, user.R, user.P, user.S, mostUses == user.R)
    switch (mostUses) {
        case user.R:
            favPieceStr = "Rock ("
            break
        case user.P:
            favPieceStr = "Paper ("
            break
        case user.S:
            favPieceStr = "Scissors ("
            break
    }
    favPieceP.textContent = favPieceStr + String(mostUses) + ")"
    rockUsesP.textContent = "Rock: " + String(user.R)
    paperUsesP.textContent = "Paper: " + String(user.P)
    scissorUsesP.textContent = "Scissors: " + String(user.S)
}

loadStats()