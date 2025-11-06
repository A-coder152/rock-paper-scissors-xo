const cells = document.querySelectorAll(".cell")

function cellClicked(event){
    cell = event.currentTarget
    cell.textContent = "x"
}

cells.forEach(cell => 
    cell.addEventListener("click", cellClicked)
)