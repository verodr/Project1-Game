# PROJECT 1 - Independence-Day

## Description
For my first project with General Assembly I’ve created from scratch my customised version of the very famous “Space-Invaders” game , which I called “Independence-Day”, using as principal theme and inspiration the homonymous movie (1996).
The player, with his plane and his missiles, can try to win the battle against the well equipped aliens and save the world.

## Deployment link

Try my game [here](https://verodr.github.io/Project1-Game/ "Independence-Day")

## Timeframe & Working Team 

This project had to be carried out individually in a maximum of one week.

## Technologies Used

- HTML
- CSS
- JavaScript
- Git
- GitHub
- Google Fonts
- Excalidraw (to draw the wireframe)
- GIMP 2.10  (to edit the images)
- Audacity (to cut the audio effects)

## Brief
- Render a game in the browser:
- Be built on a grid;
- Design logic for winning & visually display which player won;
- Include separate HTML / CSS / JavaScript files.
 
## Planning
![wireframe](https://user-images.githubusercontent.com/106544788/180369823-20c98838-14dd-45c4-897b-599a43c82681.png)
First, after the project was assigned to me, I designed its  wireframe which allowed me to make a concrete plan  for the future code. Planning helped me to not waste time guessing my future actions with the risk to be sucked in a black hole of possibilities.

## Build/Code Process

### Phase 1 : Grid And Characters
- I created the grid with a function which finds the global variable cellCount and makes a new <div> element on every loop, attaching it to the cell array and appending a new child to the class “grid”.

``` javascript
function createGrid(){
       for(let i = 0; i < cellCount; i++){
           const cell = document.createElement('div')
           cell.dataset.index = i
           cells.push(cell)
           grid.appendChild(cell)
       }
       addChar(startingPosition, charPlayer)
   }
```
I created two general functions to add and remove the different characters, then I added two variables, one for the rows, one for the columns and two nested for loops to multiply my enemies in multiple cells.

### Phase 2: The Character Movements
I wrote the movement function for the player and a variable for the player position.
I used the arrow keys for left-right direction and X to shoot.
The player movement is simulated with the “add-remove combination” and it is prevented from going outside from the boundaries of the grid.

Two functions determine the enemies movement, one for left-right direction and one for up and down. This last one has also been re-used to move the missiles of both enemies and the player.

This first function (moveLeftRigth) takes as input a direction and builds an array of all the cell indices that contain that class. If the input is equal to 1 (i.e. movement to the right) the array is reversed in order to prevent the columns of enemies from being deleted during the movement. 

![enemies](https://user-images.githubusercontent.com/106544788/180370286-f0fa3c62-1fd6-4049-b0ce-b5a29da1185f.png)

The second function (moveUpOrDown) takes as input a character’s class. It first defines the direction as 1 (movement down for the enemy missiles) or -1 (movement up for the player missiles). It then populates an array of indices and then moves the characters after checking if a collision has occurred.
``` javascript
   function moveUpOrDown(charMovement){
       let direction = (charMovement === charEnemy || charMovement === charMisslesEnemy) ? 1 : -1
       const en = document.querySelectorAll('.' + charMovement)
       idx = []
       en.forEach(it=>{idx.push(parseFloat(it.dataset.index))})
       for(index of idx.reverse()){
           removeChar(index, charMovement)
           if(checkHit(index + direction * width, charMovement) === 0){
               addChar(index + direction * width, charMovement)
           }
       }
   }
```
### Function checkWall
The function checkWall wraps around the movement functions for the enemies. Its main purpose is to check if there are any enemies left on the grid: 
- If not set the game status to victory and returns;
- If the direction of enemy movement is to the right then check if the right border of the grid is reached. If so, switch the movement from right to down and invert the direction;
- If the direction of enemy movement is to the left then check if the left border of the grid is reached. If so, switch the movement from right to down and invert the direction;
- If no borders are reached then just move the block of enemies to the left or the right depending on the value of the direction variable.
``` javascript
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
```
### Phase 3: The Battle
The battle phase is implemented in two functions: enemyFire and checkHit. The first one randomly selects one enemy from the remaining ones and generates a missile for it. The rate of fire is controlled by the function parameter (“speed”) and a random number generator. The higher the parameter, the slower the enemy fire.
``` javascript 
    if(Math.random() * speed < 0.5){
        addChar(randomEnemy + width, charMisslesEnemy)
        soundEnemy.play()
    }
```
The function checkHit checks if a collision with any missile has occurred. There are two different cases to consider, both handled by a nested if condition: 
- one enemy missile has reached the player: in this case the function removes the enemy missile, decreases the life bar and, if needed, removes one heart; 
- One player’s missile has reached an enemy: in this case both the enemy and the missile are removed, the score is increased and a short explosion gif replaces the enemy while an explosion sound is played;
- If no collision has happened this function returns zero and allows the movement function to proceed by moving the missiles up or down.

### Phase 4: Main loop
The main functions of the game are “startGame” and “endGame”. The first activates two setInterval loops: one for the movement of the enemies and one for the movement of the missiles. I’ve chosen two different timers in order to make the missiles faster than the enemies which gives some more realism to the game.
``` javascript
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
```
The functions startGame also checks for any game-over conditions and, if any is met, it calls the endGame function which stops the timers, disables the player movements, eliminates all characters from the grid and displays the game outcome: victory or defeat.
The instructions to reset the game are contained in the cleanUp function which eliminates all the enemies and missiles from the grid, resets the player’s position as well as the number of lives and progress bar.

![game_demo](https://user-images.githubusercontent.com/106544788/180369442-57559a3c-fe2b-4332-a52d-b2902e151b23.gif)

## Challenges
The two biggest challenges were: 
- making all the enemies move together to the wall, tell them to move down one cell and then to start again in the opposite direction. I sorted out the issue creating a function which makes the enemies look directly to the opposite wall. (See above the function checkWall);
- At the end of the game, once the final GIF has appeared, the player and his missiles continued to be shown over the Gif, so I had to disable the eventListener on the player before cleaning up the grid.	

## Wins
Certainly the phase of this project that I am most proud of is the one related to the movements of the main characters of the videogame and the missiles, followed by the phase in which I made sure that my display counter showed the score and my bar and hearts responded to the vital conditions of my player.
I created two separate set intervals for the enemy movements and the missiles to give several speeds to the game and so more dynamicity to the action: the best setting for the intervals turned out to be multiples of one another (e.g. 1000ms and 500ms).
Last but not least, I am very proud to have used my grid as a screen where my final GIFs appear as a surprise effect.

## Key Learnings/Takeaways
During my first project I learned to work independently by taking advantage of the infinite resources that the Internet can offer.
In fact, the Internet is the perfect place to find advice, solutions, and resources that help you to make your project more and more surprising, teaching you at the same time new ways to code (making the page reload, adding audio and GIF while learning new softwares: Audacity and GIMP).
Also I was able to test myself with flex-box to design my video-game.


## Bugs
I managed to eliminate all the obvious bugs that appeared during the creation of the project.

## Future Improvements:.
I would like to:
- add more difficulty levels;
- implement more interactive tools during the battle that can help the player win faster (like a virus chip which if hit from the player’s missile can - eliminate half of the enemies all at once from the field);
- create new weapons for the enemies and the player;
- add more special-effects: I love the surprise effect!
