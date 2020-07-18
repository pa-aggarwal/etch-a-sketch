/* IMPORTS */
import {normalDraw, darkenDraw, randomDraw} from './draw.js';
import {defaultGridColor} from './draw.js';

/* GLOBAL VARIABLES */
let numRows = 16;
let numCols = 16;
let drawFunction = normalDraw;
let gridContainer = createGrid();
let gridCells = getGridCells(gridContainer);

/* HELPER FUNCTIONS */

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
    let currRow, currCell;

    for (let i = 0; i < numRows; i++) {
        currRow = createElementWithClasses('div', 'grid__row');
        for (let j = 0; j < numCols; j++) {
            currCell = createElementWithClasses('div', 'grid__cell');
            currCell.style.backgroundColor = defaultGridColor;
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
 * Add event listeners for when grid cells are hovered.
 * @param {Object} drawFunction - function based on current drawing mode.
 */
function addHoverEvent(drawFunction) {
    for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].addEventListener('mouseenter', drawFunction);
    }
}

/**
 * Remove event listeners for when grid cells being hovered.
 * @param {Object} drawFunction - function based on previous drawing mode.
 */
function removeHoverEvent(drawFunction) {
    for (let i = 0; i < gridCells.length; i++) {
        gridCells[i].removeEventListener('mouseenter', drawFunction);
    }
}

/**
 * Set all cell's background-colors to the original grid color.
 */
function clearGrid() {
    for (let i = 0; i < gridCells.length; i++) {
        if (gridCells[i].style.backgroundColor !== defaultGridColor) {
            gridCells[i].style.backgroundColor = defaultGridColor;
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
    const newGrid = createGrid();
    const oldGrid = document.querySelector('.grid');
    const root = document.documentElement;
    // Reassign global variable `gridCells`.
    gridCells = getGridCells(newGrid);
    root.style.setProperty('--grid-size', newSize.toString());
    document.body.replaceChild(newGrid, oldGrid);
    addHoverEvent(drawFunction);
}

/**
 * Change the global variable holding the draw function to call based on the
 * new drawing mode selected.
 */
function updateDrawingMode() {
    const newMode = this.id;
    const oldDrawFunction = drawFunction;
    if (newMode === 'normal-mode') {
        drawFunction = normalDraw;
    } else if (newMode === 'darken-mode') {
        drawFunction = darkenDraw;
    } else if (newMode === 'random-mode') {
        drawFunction = randomDraw;
    }
    clearGrid();
    removeHoverEvent(oldDrawFunction);
    addHoverEvent(drawFunction);
}

/* MAIN CODE */

// Inserting sketchpad inside document.
const modesContainer = document.querySelector('.modes-container');
document.body.insertBefore(gridContainer, modesContainer);

// Drawing on the sketchpad.
addHoverEvent(drawFunction);

// Clearing the sketchpad.
const clearGridButton = document.querySelector('.clear-input');
clearGridButton.addEventListener('click', () => clearGrid());

// Updating the sketchpad size.
const gridSizeInput = document.querySelector('.size-input');
gridSizeInput.defaultValue = numRows.toString();
gridSizeInput.addEventListener('change', function() {
    // Value equals empty string if input is not expected type (numeric).
    if (gridSizeInput.value) {
        clearGrid();
        updateGrid(gridSizeInput.value);
    }
});

// Changing the drawing mode.
const radioInputs = [...document.querySelectorAll('input[type="radio"]')];
radioInputs.forEach(radioInput => {
    radioInput.addEventListener('change', updateDrawingMode);
});
