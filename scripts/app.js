function init () {
    const grid = document.querySelector('.grid')


    const width = 10
    const cellCount = width * width
    const cells = []

    const charPlayer = 'player'
    const startingPosition = 99

    const charEnemy = 'enemy'
    const startPosition = 0

    const gridRows = 8
    const gridCol = 3

    function createGrid(){
        for(let i = 0; i < cellCount; i++){
          const cell = document.createElement('div')
          cell.innerText = i
          cell.dataset.index = i
          cells.push(cell)
          grid.appendChild(cell)
        }
        add(startingPosition, charPlayer)
        add(startPosition, charEnemy)
    }
    function add(position, character){
        cells[position].classList.add(character)
    }

    function multiEnemies(row, col) {
        for(i=0; i<row; i++) {
            for (j=0; j< col; j++) {
                let pos = i+j * width
                add(pos,charEnemy)
            }

        }

    }
    

    createGrid()
    multiEnemies(gridRows, gridCol)
}
window.addEventListener('DOMContentLoaded', init)
