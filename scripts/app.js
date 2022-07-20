function init () {
    const grid = document.querySelector('.grid')
    const play = document.querySelector('#red-button')
    const scoreSpan = document.getElementById('score-display')
    const progressbar = document.querySelector('.progress-inner')
    const livesDisplay = document.querySelector('#lives-display')
    const reloadPage = document.querySelector('#reload-page')
    const width = 10
    const cellCount = width * width
    const cells = []

    let soundEnemy = new Audio('./assets/laserEnemy.ogg')
    let soundPlayer = new Audio('./assets/laserPlayer.ogg')
    let enemyExplosion = new Audio('./assets/enemy-expl.ogg')
    let soundPlay = new Audio('./assets/goSound.wav')
    let surviveSound = new Audio('./assets/survive.ogg')
    const charPlayer = 'player'
    const startingPosition = 99
    let playerPosition = startingPosition
    const charEnemy = 'enemy'
    const charMissilesPlayer = 'missilesPlayer'
    const charMisslesEnemy = 'missilesEnemy'
    const charExplosion = 'explosion-gif'
    const gridRows = 3
    const gridCol = 8

    let timer
    let timerMissiles
    let score = 0
    let gameOver = 'go'
    let lives = 3
    let completion = 100

    function createGrid(){
        for(let i = 0; i < cellCount; i++){
            const cell = document.createElement('div')
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
                // makes checks on the new position. If the check is passed, then adds the new element at the position
                addChar(index + direction * width, charMovement)
            }
        }
    }

    function playerMovement(event){
        const keyCode = event.keyCode
        const left = 37
        const right = 39
        const shoot = 88
        removeChar(playerPosition, charPlayer)

        if (left === keyCode && playerPosition % width !== 0){
            playerPosition -= 1
            } else if (right === keyCode && playerPosition % width !== width - 1){
            playerPosition += 1
            } else if (shoot === keyCode){
                addChar(playerPosition - width, charMissilesPlayer)
                soundPlayer.play()
            } else {
            // console.log('INVALID KEY')
            }
        addChar(playerPosition, charPlayer)
    }

    function enemiesFire(speed=1) {
        const en = document.querySelectorAll('.'+charEnemy)
        if(en.length === 0){
            gameOver = 'victory'
            return
        }
        idx = []
        en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
        randomEnemy = idx[Math.floor(Math.random() * idx.length)]
        //+ width because I'm giving it the direction down.
        //below I determined the chance that the enemy will shoot defautl value 50%.
        if(Math.random() * speed < 0.5){
            addChar(randomEnemy + width, charMisslesEnemy)
            soundEnemy.play()
        }
    }

    function checkWall(direction){
        const en = document.querySelectorAll('.'+charEnemy)
        if (en.length === 0) {
            gameOver = 'victory'
            return
        }
        let wallHit = direction === 1 ? (width - 1) : 0
        for(item of en){
            index = item.dataset.index
            if (index >= width * (width -2)){
                gameOver = 'defeat'
                return direction
            }
            if (index % width === wallHit) {
                moveUpOrDown(charEnemy)
                return -direction
            }
        }
        moveLeftRight(direction)
        return direction
    }

    function checkHit(idxPosition, charElement){
        if (idxPosition >= 0 && idxPosition <= cellCount - 1) {
            // checks if the given postion is inside the grid
            if (charElement === charMissilesPlayer){
                // checks if the given element is a missile from the Player
                if (cells[idxPosition].classList.contains(charEnemy)) {
                    // cheks if the position contains an Enemy and removes both the missile and the enemy
                    removeChar(idxPosition, charMissilesPlayer)
                    removeChar(idxPosition, charEnemy)
                    addChar(idxPosition, charExplosion)
                    setTimeout(() => {removeChar(idxPosition, charExplosion)}, 180)
                    enemyExplosion.play()
                    score += 50
                    scoreSpan.innerHTML = score
                    return 1
                }    
            } else if (charElement === charMisslesEnemy) {
                // checks if the element is a Missile from the Enemy
                if (cells[idxPosition].classList.contains(charPlayer )) {
                    // checks if the cell contains the Player
                    removeChar(idxPosition, charMisslesEnemy)
                    completion -= 100
                    progressbar.style.width = `${completion}%`
                    if (completion < 0)  {
                        lives -=1
                        livesDisplay.innerHTML = lives ? "❤️".repeat(lives) : "💔"
                        if(lives >= 1){
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
            return 1
        }
    }

    function cleanUp() {
        cells.map(item=>{removeChar(parseFloat(item.dataset.index), charEnemy)})
        cells.map(item=>{removeChar(parseFloat(item.dataset.index), charMissilesPlayer)})
        cells.map(item=>{removeChar(parseFloat(item.dataset.index), charMisslesEnemy)})
        grid.classList.remove('gameWon')
        grid.classList.remove('gameLost')
        removeChar(playerPosition, charPlayer)
        addChar(startingPosition, charPlayer)
        playerPosition = startingPosition
        progressbar.style.width = `${completion}%`
        livesDisplay.innerHTML = lives ? "❤️".repeat(lives) : "💔"
        scoreSpan.innerHTML = score
    }


    function endGame() {
        clearInterval(timer)
        clearInterval(timerMissiles)
        cleanUp()
        removeChar(playerPosition, charPlayer)
        document.removeEventListener('keydown', playerMovement)
        
        setTimeout(() => {
            if (gameOver === 'victory') {
                grid.classList.add('gameWon')
                surviveSound.play()
            } else {
            livesDisplay.innerHTML = "💔" 
            grid.classList.add('gameLost')
            }
        }, 50)
    }

    
    function startGame(){
        score = 0
        gameOver = 'go'
        lives = 3
        completion = 100
        let direction = 1
        clearInterval(timer)
        clearInterval(timerMissiles)
        soundPlay.play()
        // below I create the event listener for the player actions and the enemied at the starting positions.
        cleanUp()
        document.addEventListener('keydown', playerMovement)
        multiEnemies(gridCol, gridRows)
        timer = setInterval(() => {
            direction = checkWall(direction)
            if(gameOver != 'go' || lives === 0){
            return endGame()
            }
        }, 1000)
        timerMissiles = setInterval(() => {
            enemiesFire(2)
            moveUpOrDown(charMissilesPlayer)
            moveUpOrDown(charMisslesEnemy)
            if(gameOver !='go' || lives === 0){
                return endGame()
            }
        }, 500)
        }
createGrid()
play.addEventListener('click', startGame)
reloadPage.addEventListener('click',function(){window.location.reload()})
}

window.addEventListener('DOMContentLoaded', init)