document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doddle = document.createElement('div')
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = 150
    let isGameOver = false

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.style.left = doddlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function start() {
        if (isGamerOver == false) {
            createDoodler()
        }
    }
})