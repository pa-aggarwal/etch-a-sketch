/* GLOBAL VARIABLES */
let numRows = 16;
let numCols = 16;
let gridContainer = createGrid();
let gridCells = getGridCells(gridContainer);

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
    // Container for grid of square divs.
    const grid = createElementWithClasses('div', 'grid');
    let currRow;
    let currCell;

    for (let i = 0; i < numRows; i++) {
        currRow = createElementWithClasses('div', 'grid__row');
        for (let j = 0; j < numCols; j++) {
            currCell = createElementWithClasses('div', 'grid__cell');
            currRow.appendChild(currCell);
        }
        grid.appendChild(currRow);
    }

    return grid;
}

/**
 * Create an array containing all grid-cells inside the current grid.
 * @param  {Object} grid - Element containing grid with rows and columns.
 * @return {Object}      - Array of elements with class `grid__cell`.
 */
function getGridCells(grid) {
    const gridRows = Array.from(grid.getElementsByClassName('grid__row'));
    let gridCellsArr = [];
    let gridRowCellsArr;
    for (let i = 0; i < gridRows.length; i++) {
        gridRowCellsArr = Array.from(gridRows[i].childNodes);
        for (let k = 0; k < gridRowCellsArr.length; k++) {
            gridCellsArr.push(gridRowCellsArr[k]);
        }
    }
    return gridCellsArr;
}

/**
 * When hovering a grid-cell without color, draw (apply color) on that cell,
 * else remove the color.
 */
function draw() {
    const gridCellClasses = this.classList;
    const className = 'color-square';
    if (!gridCellClasses.contains(className)) {
        gridCellClasses.add(className);
    }
}

/**
 * Add event listeners for when grid cells are hovered.
 * @param {Object} gridCells - Array of elements with class `grid__cell`.
 */
function addHoverEvent(gridCells) {
    for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].addEventListener('mouseenter', draw);
    }
}

/**
 * Clear the sketchpad grid by removing all coloured cells.
 * @param {Object} gridCells - Array of elements with class `grid__cell`.
 */
function clearGrid(gridCells) {
    for (let i = 0; i < gridCells.length; i++) {
        if (gridCells[i].classList.contains('color-square')) {
            gridCells[i].classList.remove('color-square');
        }
    }
}

/**
 * Replace the current sketchpad grid given new dimensions.
 * @param {Number} newSize - Number of rows and columns in the new grid.
 */
function updateGrid(newSize) {
    // Reassign global variables used to create new grid.
    numRows = newSize;
    numCols = newSize;
    // Create new grid, other required variables.
    const newGrid = createGrid();
    const oldGrid = document.querySelector('.grid');
    const root = document.documentElement;
    // Reassign global variable `gridCells`.
    gridCells = getGridCells(newGrid);
    root.style.setProperty('--grid-size', newSize.toString());
    document.body.replaceChild(newGrid, oldGrid);
    addHoverEvent(gridCells);
}

// Inserting sketchpad inside document.
const scriptElement = document.querySelector('script');
document.body.insertBefore(gridContainer, scriptElement);

// Drawing on the sketchpad.
addHoverEvent(gridCells);

// Clearing the sketchpad.
const clearGridButton = document.querySelector('.clear-input');
clearGridButton.addEventListener('click', () => clearGrid(gridCells));

// Updating the grid-size.
const gridSizeInput = document.querySelector('.size-input');
gridSizeInput.defaultValue = numRows.toString();
gridSizeInput.addEventListener('change', function() {
    // Value equals empty string if input is not expected type (numeric).
    if (gridSizeInput.value) {
        clearGrid(gridCells);
        updateGrid(gridSizeInput.value);
    }
});
