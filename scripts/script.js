/* GLOBAL CONSTANTS */
const ROWS = 16;
const COLUMNS = 16;

/**
 * Create an element with the specified classes attached.
 * @param  {String} element    - Name of HTML element to create.
 * @param  {Object} classNames - At least one class name argument(s).
 * @return {Object}            - Element with specified classes.
 */
function createElementWithClasses(element, ...classNames) {
    const newElement = document.createElement(element);
    newElement.classList.add(...classNames);
    return newElement;
}

/**
 * Create a grid for the sketchpad with dimensions using constants.
 * @return {Object} - Element containing grid with rows and columns.
 */
function createGrid() {
    // Container for 16x16 grid of square divs.
    const grid = createElementWithClasses('div', 'grid');
    let currRow;
    let currCol;

    for (let i = 0; i < ROWS; i++) {
        currRow = createElementWithClasses('div', 'grid__row');
        for (let j = 0; j < COLUMNS; j++) {
            currCol = createElementWithClasses('div', 'grid__col');
            currRow.appendChild(currCol);
        }
        grid.appendChild(currRow);
    }

    return grid;
}

/**
 * When hovering a grid-cell without color, draw (apply color) on that cell,
 * else remove the color.
 */
function toggleDraw() {
    const gridSquareClasses = this.classList;
    const className = 'color-square';
    if (gridSquareClasses.contains(className)) {
        gridSquareClasses.remove(className);
    } else {
        gridSquareClasses.add(className);
    }
}

/**
 * Add event listeners for when grid cells are hovered.
 * @param {Object} gridRows - Array of elements with class `grid__row`.
 */
function addHoverEvent(gridRows) {
    let gridColArr;
    for (let i = 0; i < gridRows.length; i++) {
        gridColArr = Array.from(gridRows[i].childNodes);
        for (let k = 0; k < gridColArr.length; k++) {
            gridColArr[k].addEventListener('mouseenter', toggleDraw);
        }
    }
}

// Inserting sketchpad inside document.
const scriptElement = document.querySelector('script');
const gridContainer = createGrid();
document.body.insertBefore(gridContainer, scriptElement);

addHoverEvent(Array.from(gridContainer.getElementsByClassName('grid__row')));
