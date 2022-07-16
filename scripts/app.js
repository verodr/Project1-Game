function init () {
    const grid = document.querySelector('.grid')


    const width = 10
    const cellCount = width * width
    const cells = []


    function createGrid(){
        for(let i = 0; i < cellCount; i++){
          const cell = document.createElement('div')
          cell.innerText = i
          cell.dataset.index = i
          cells.push(cell)
          grid.appendChild(cell)
        }
      }
 createGrid()
}
window.addEventListener('DOMContentLoaded', init)
