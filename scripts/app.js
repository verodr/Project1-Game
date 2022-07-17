function init () {
    const grid = document.querySelector('.grid')
    const scoreSpan = document.getElementById('score-display')
    const progressbar = document.querySelector('.progress-inner')
    const livesDisplay = document.querySelector('#lives-display')

    const width = 10
    const cellCount = width * width
    const cells = []

    const charPlayer = 'player'
    const startingPosition = 97
    let playerPosition = startingPosition

    const charEnemy = 'enemy'
    const startPosition = 0
    const charMissilesPlayer = 'missilesPlayer'
    const charMisslesEnemy = 'missilesEnemy'
    const gridRows = 3
    const gridCol = 8

    let timer
    let timerMissiles
    let score = 0
    let gameOver = false
    let lives = 3
    let completion = 100
    

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
            if(checkHit(index + direction * width, charMovement) === 0){
                // performs checks on the new position. If the check is passed, then adds the new element at the position
                addChar(index + direction * width, charMovement)
            }
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

    function enemiesFire(speed=1) {
        const en = document.querySelectorAll('.'+charEnemy)
        if(en.length === 0){
            gameOver = true
            console.log('victory ')
            alert('VICTORY!!!')
            return
        }
        idx = []
        en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
        randomEnemy = idx[Math.floor(Math.random() * idx.length)]
        //+ width because I'm giving it the direction down.
        //below I determined the chance that the enemy will shoot defautl value 50%.
        if(Math.random() * speed < 0.5){
            addChar(randomEnemy + width, charMisslesEnemy)
        }
        
    }


    document.addEventListener('keydown', playerMovement)
    createGrid()
    multiEnemies(gridCol, gridRows)


    function checkWall(direction){
        const en = document.querySelectorAll('.'+charEnemy)
        if (en.length === 0) {
            console.log('victory ')
            alert('VICTORY!!!')
            gameOver = true
            return
        }
        // console.log('direction = ', direction)
        let wallHit = direction === 1 ? (width - 1) : 0
        for(item of en){
            index = item.dataset.index
            if (index >= width * (width -2)){
                gameOver = true
                return direction
            }
            if (index % width === wallHit) {
                moveUpOrDown(charEnemy)
                return -direction
            }
        }

        // console.log('Left or Rxight')
        moveLeftRight(direction)
        return direction
    }
    function checkHit(idxPosition, charElement){
        if (idxPosition >= 0 && idxPosition <= cellCount - 1) {
            // checks if the given postion is inside the grid
            if (charElement === charMissilesPlayer){
                // checks if the given element is a missile from the Player
                // console.log('charElement is Missile from Player ', idxPosition)
                if (cells[idxPosition].classList.contains(charEnemy)) {
                    // cheks if the position contains an Enemy and removes both the missile and the enemy
                    // console.log('Enemy is Hit ', idxPosition)
                    removeChar(idxPosition, charMissilesPlayer)
                    removeChar(idxPosition, charEnemy)
                    score += 50
                    console.log("score is", score)
                    scoreSpan.innerHTML = score
                    return 1
            } 
            } else if (charElement === charMisslesEnemy) {
                // cheks if the element is a Missile from the Enemy
                // console.log('charElement is Missile from Enemy ', idxPosition)
                if (cells[idxPosition].classList.contains(charPlayer )) {
                    // checks if the cell contains the Player
                    // console.log('Player is Hit ', idxPosition)
                    // if (lives === 0) {
                    //     gameOver = true
                    // }
                    removeChar(idxPosition, charMisslesEnemy)
                    completion -= 50
                    progressbar.style.width = `${completion}%`
                    if (completion < 0)  {
                        lives -=1
                        livesDisplay.innerHTML = lives ? "❤️".repeat(lives) : "💔"
                        if(lives > 1){
                            completion = 100
                            progressbar.style.width = `${completion}%`
                        }
                        
                    }
                    return 1
        }
    }
    // If none of the above conditions is met then return 0 , just move the element
        return 0
} else{ 
    // The given position is outside the boundaries of the Grid.
    // console.log('idxPos is outside the Grid ', idxPosition)
    return 1
}

}
        
    function endGame() {
        // console.log('times is ', timer)
        // console.log('timesMiss is ', timerMissiles)
        clearInterval(timer)
        clearInterval(timerMissiles)
            // After a short delay (due to alert behaviour) alert the score and also update high score if needed
        setTimeout(() => {
            // console.log('GameOver is ', gameOver)
        // Alert score
        //alert('Your score is ' + score)
              // Update high score
            //   setHighScore(score)
        }, 50)
    }

    
    function startGame(){
        // let timer
        // let timerMissiles
        clearInterval(timer)
        clearInterval(timerMissiles)
        let direction = 1
        timer = setInterval(() => {
            // console.log('gameOver is ', gameOver)
            direction = checkWall(direction)
            console.log('TIMER1: gameOver is ', gameOver)
            if(gameOver || lives === 0){
               return endGame()
            }
        }, 1000)
        timerMissiles = setInterval(() => {
            enemiesFire(2)
            moveUpOrDown(charMissilesPlayer)
            moveUpOrDown(charMisslesEnemy)
            console.log('TIMER2: gameOver is ', gameOver)
            if(gameOver  || lives === 0){
                return endGame()
            }
        }, 500)
        }
        

    

startGame()


}
window.addEventListener('DOMContentLoaded', init)