function init () {
    const grid = document.querySelector('.grid')
    const scoreSpan = document.getElementById('score-display')

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

    let timer
    let score = 0
    

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

    // function moveEnemy(start, end){
    //     remove(start, charEnemy)
    //     add(end, charEnemy)
    // }

    // function moveColumn(start, direction){
    //     startArray = []
    //     for(i=0; i< gridRows; i++){
    //         startArray.push(start + i*width)
    //     }
    //     // maps the function moveEnemy to the end location, i.e. starting point plus number of rows.
    //     // direction is used to move up or down
    //     startArray.map(it=>{moveEnemy(it, it+direction*gridCol)})
    // }

    // function moveRow(start, direction){
    //     // create the row to be moved using the index
    //     startArray = []
    //     for(i=0; i< gridCol; i++){
    //         startArray.push(start + i)
    //     }
    //     // maps the function moveEnemy to the end location, i.e. starting point plus length of the grid times number of rows.
    //     // direction is used to move up or down
    //     startArray.map(it=>{moveEnemy(it, it+direction*gridRows*width)})
    // }

    function moveLeftRight(direction){
        const en = document.querySelectorAll('.'+charEnemy)
        idx = []
        en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
        idx = direction === 1 ? idx.reverse() : idx
        for(index of idx){
            remove(index, charEnemy)
            add(index + direction, charEnemy)
        }
    }

    function moveDown(){
        const en = document.querySelectorAll('.'+charEnemy)
        idx = []
        en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
        for(index of idx.reverse()){
            remove(index, charEnemy)
            add(index + width, charEnemy)
        }

    }

    function playerMovement(event){
        const keyCode = event.keyCode
        const left = 37
        const right = 39
        const shoot = 32
        
        remove(playerPosition, charPlayer)

        if (left === keyCode && playerPosition % width !== 0){
            console.log(playerPosition % width)
            playerPosition -= 1
            } else if (right === keyCode && playerPosition % width !== width - 1){
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
    //moveRow(0, 1)
    //moveRow(10, 1)
    //moveDown()

    function checkWall(direction){
        const en = document.querySelectorAll('.'+charEnemy)
        console.log('direction = ', direction)
        let wallHit = direction === 1 ? (width - 1) : 0
        for(item of en){
            index = item.dataset.index
            // console.log('index is', index)
            // console.log('division is', index%width)
            if (index >= width * (width -2)){
                console.log("DEFEAT")
                return "DEFEAT"
            }
            if (index % width === wallHit) {
                console.log('Moving Down')
                moveDown()
                return -direction
            }
        }

        console.log('Left or Right')
        moveLeftRight(direction)
        return direction
    }
        
    function endGame() {
        clearInterval(timer)
            // After a short delay (due to alert behaviour) alert the score and also update high score if needed
        setTimeout(() => {
        // Alert score
        alert('Your score is ' + score)
              // Update high score
            //   setHighScore(score)
        }, 50)
    }

    
    function startGame(){
        clearInterval(timer)
        let direction = 1
        //moveLeftRight(direction) 
        timer = setInterval(() => {
            console.log('direction is ', direction)
            direction = checkWall(direction)
            if(direction === 'DEFEAT'){
                endGame()
            }
            // moveLeftRight(direction)
        }, 200)
        }
    startGame()
    //moveLeftRight(1)
    //moveLeftRight(1)
    //moveLeftRight(-1)
    //moveDown()
    // checkWall(1)
    // checkWall(1)
}
window.addEventListener('DOMContentLoaded', init)
