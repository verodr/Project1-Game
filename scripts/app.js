function init () {
    const grid = document.querySelector('.grid')


    const width = 10
    const cellCount = width * width
    const cells = []

    const charPlayer = 'player'
    const startingPosition = 99
    let playerPosition = startingPosition

    const charEnemy = 'enemy'
    const startPosition = 0

    const gridRows = 3
    const gridCol = 8

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
// function addEnemy(position) { return add(position, charEnemy) }
// function drawEnemies(row, col) {
// positions =  Array.from(Array(width*row).keys()).filter(i=>i%width<col)
// cells.filter(i=> i in positions).map(addEnemy)
// }

    function remove(position, character){
        cells[position].classList.remove(character)
    }

    function moveEnemy(start, end){
        remove(start, charEnemy)
        add(end, charEnemy)
    }

    function moveColumn(start, direction){
        startArray = []
        for(i=0; i< gridRows; i++){
            startArray.push(start + i*width)
        }
        console.log(startArray)
        startArray.map(it=>{moveEnemy(it, it+direction*gridCol)})
    }

    function moveRow(start, direction){
        startArray = []
        for(i=0; i< gridCol; i++){
            startArray.push(start + i)
        }
        console.log(startArray)
        startArray.map(it=>{moveEnemy(it, it+direction*gridRows*width)})
    }


    function playerMovement(event){
        
        const keyCode = event.keyCode
        const left = 37
        const right = 39
        const shoot = 32
        
        remove(playerPosition, charPlayer)

        if (left === keyCode && playerPosition % width !== 0){
            console.log('CLICKED LEFT')
            console.log(playerPosition % width)
            playerPosition -= 1
          } else if (right === keyCode && playerPosition % width !== width - 1){
            console.log('CLICKED RIGHT')
            playerPosition += 1
          } else {
            console.log('INVALID KEY')
          }
           
          add(playerPosition, charPlayer)
        }

    document.addEventListener('keydown', playerMovement)
    createGrid()
    multiEnemies(gridCol, gridRows)

    // moveColumn(0, 1)
    // moveColumn(1, 1)
    // moveColumn(9, -1)
    moveRow(0, 1)
    moveRow(10, 1)
}
window.addEventListener('DOMContentLoaded', init)
