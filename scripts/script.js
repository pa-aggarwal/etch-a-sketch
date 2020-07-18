/* GLOBAL VARIABLES */
const defaultGridColor = 'rgb(255, 255, 255)';
const defaultCellColor = '#9CE8E0';
let numRows = 16;
let numCols = 16;
let cellColor = defaultCellColor;
let drawFunction = normalDraw;
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
 * Draw function for normal drawing mode.
 * Change a grid-cell's background-color based on the current color setting.
 */
function normalDraw() {
    if (this.style.backgroundColor === defaultGridColor) {
        this.classList.add('animate-cell');
        this.style.backgroundColor = cellColor;
    }
}

function getSaturation(min, max, valueL) {
    if (min === max) {
        return 0;
    } else if (valueL < .5) {
        return ((max - min) / (max + min));
    } else if (valueL >= .5) {
        return ((max - min) / (2 - max - min));
    }
}

function getHue(min, max, valueR, valueG, valueB) {
    let valueH;
    if (min === max) {
        valueH = 0;
    } else if (valueR === max) {
        valueH = (valueG - valueB) / (max - min);
    } else if (valueG === max) {
        valueH = 2 + (valueB - valueR) / (max - min);
    } else if (valueB === max) {
        valueH = 4 + (valueR - valueG) / (max - min);
    }

    valueH *= 60;
    valueH = (valueH < 0) ? valueH + 360 : valueH;

    return valueH;
}

function getHSLColor(rgbColor) {
    const rgbValueStr = rgbColor.slice(rgbColor.indexOf('(') + 1, -1);
    const rgbValueArr = rgbValueStr.split(', ');

    let valueR = parseInt(rgbValueArr[0]);
    let valueG = parseInt(rgbValueArr[1]);
    let valueB = parseInt(rgbValueArr[2]);

    valueR /= 255;
    valueG /= 255;
    valueB /= 255;

    const min = Math.min(valueR, valueG, valueB);
    const max = Math.max(valueR, valueG, valueB);

    let valueL = Math.round(((min + max) / 2) * 100);
    let valueS = Math.round(getSaturation(min, max, (min + max) / 2) * 100);
    let valueH = Math.round(getHue(min, max, valueR, valueG, valueB));

    return [valueH, valueS, valueL];
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
 * Change the global variable holding the current grid-cell background color.
 */
function updateCellColor() {
    cellColor = this.value.toUpperCase();
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

// Inserting sketchpad inside document.
const modesContainer = document.querySelector('.modes-container');
document.body.insertBefore(gridContainer, modesContainer);

// Drawing on the sketchpad.
addHoverEvent(drawFunction);

// Clearing the sketchpad.
const clearGridButton = document.querySelector('.clear-input');
clearGridButton.addEventListener('click', () => clearGrid());

// Updating the grid-size.
const gridSizeInput = document.querySelector('.size-input');
gridSizeInput.defaultValue = numRows.toString();
gridSizeInput.addEventListener('change', function() {
    // Value equals empty string if input is not expected type (numeric).
    if (gridSizeInput.value) {
        clearGrid();
        updateGrid(gridSizeInput.value);
    }
});

// Update the gridColor variable to user's preference.
const colorPicker = document.querySelector('.color-input');
colorPicker.setAttribute('value', defaultCellColor);
colorPicker.setAttribute('placeholder', defaultCellColor);
colorPicker.addEventListener('change', updateCellColor);
// TODO: implement select() call.

// Changing the drawing mode.
const radioInputs = [...document.querySelectorAll('input[type="radio"]')];
radioInputs.forEach(radioInput => {
    radioInput.addEventListener('change', updateDrawingMode);
});
