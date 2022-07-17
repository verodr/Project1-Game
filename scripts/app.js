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
    const charMissilesPlayer = 'missilesPlayer'
    const charMisslesEnemy = 'missilesEnemy'
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
        addChar(startingPosition, charPlayer)

    }
    function addChar(position, character){
        cells[position].classList.add(character)
    }
    


    function multiEnemies(row, col) {
        for(i=0; i<row; i++) {
            for (j=0; j< col; j++) {
                let pos = i+j * width
                addChar(pos,charEnemy)
            }
        }
    }
    
// function addEnemy(position) { return add(position, charEnemy) }
// function drawEnemies(row, col) {
// positions =  Array.from(Array(width*row).keys()).filter(i=>i%width<col)
// cells.filter(i=> i in positions).map(addEnemy)
// }

    function removeChar(position, character){
        cells[position].classList.remove(character)
    }


    function moveLeftRight(direction){
        const en = document.querySelectorAll('.'+charEnemy)
        idx = []
        en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
        idx = direction === 1 ? idx.reverse() : idx
        for(index of idx){
            removeChar(index, charEnemy)
            addChar(index + direction, charEnemy)
        }
    }

    function moveUpOrDown(charMovement){
        let direction = (charMovement === charEnemy || charMovement === charMisslesEnemy) ? 1 : -1
        const en = document.querySelectorAll('.' + charMovement)
        idx = []
        en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
        for(index of idx.reverse()){
            removeChar(index, charMovement)
            addChar(index + direction * width, charMovement)
        }

    }
    // function moveMissileUp(){
    //     const missiles  = document.querySelectorAll('.'+ charMissilesPlayer)
    //     idxMissile = []
    //     missiles.forEach(item=>{idxMissile.push(parseFloat(item.dataset.index))})
    //     for(index of idxMissile.reverse()){
    //         removeChar(index, charMissilesPlayer)
    //         addChar(index - width, charMissilesPlayer)
    //     }
    // }

    function playerMovement(event){
        const keyCode = event.keyCode
        const left = 37
        const right = 39
        const shoot = 88
        
        removeChar(playerPosition, charPlayer)

        if (left === keyCode && playerPosition % width !== 0){
            console.log(playerPosition % width)
            playerPosition -= 1
            } else if (right === keyCode && playerPosition % width !== width - 1){
            playerPosition += 1
            } else if (shoot === keyCode){
                addChar(playerPosition - width, charMissilesPlayer)
            } else {
            console.log('INVALID KEY')
            }
        
        addChar(playerPosition, charPlayer)
    }


    document.addEventListener('keydown', playerMovement)
    createGrid()
    multiEnemies(gridCol, gridRows)


    function checkWall(direction){
        const en = document.querySelectorAll('.'+charEnemy)
        console.log('direction = ', direction)
        let wallHit = direction === 1 ? (width - 1) : 0
        for(item of en){
            index = item.dataset.index
            if (index >= width * (width -2)){
                return "DEFEAT"
            }
            if (index % width === wallHit) {
                moveUpOrDown(charEnemy)
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
        timer = setInterval(() => {
            console.log('direction is ', direction)
            //direction = checkWall(direction)
            //moveUpOrDown(charMissilesPlayer)
            //moveUpOrDown(charMisslesEnemy)
            if(direction === 'DEFEAT'){
                endGame()
            }
        }, 200)
        }
        
    addChar(37, charMisslesEnemy)
    startGame()


}
window.addEventListener('DOMContentLoaded', init)
