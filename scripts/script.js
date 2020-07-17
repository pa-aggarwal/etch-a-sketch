/* GLOBAL VARIABLES */
let rows = 16;
let columns = 16;
let gridContainer = createGrid();
let gridRows = Array.from(gridContainer.getElementsByClassName('grid__row'));

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
    // Container for rows x columns grid of square divs.
    const grid = createElementWithClasses('div', 'grid');
    let currRow;
    let currCol;

    for (let i = 0; i < rows; i++) {
        currRow = createElementWithClasses('div', 'grid__row');
        for (let j = 0; j < columns; j++) {
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
function draw() {
    const gridSquareClasses = this.classList;
    const className = 'color-square';
    if (!gridSquareClasses.contains(className)) {
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
            gridColArr[k].addEventListener('mouseenter', draw);
        }
    }
}

/**
 * Clear the sketchpad grid by removing all coloured cells.
 * @param {Object} gridRows - Array of elements with class `grid__row`.
 */
function clearGrid(gridRows) {
    let gridColArr;
    for (let i = 0; i < gridRows.length; i++) {
        gridColArr = Array.from(gridRows[i].childNodes);
        for (let k = 0; k < gridColArr.length; k++) {
            if (gridColArr[k].classList.contains('color-square')) {
                gridColArr[k].classList.remove('color-square');
            }
        }
    }
}

/**
 * Replace the current sketchpad grid given new dimensions.
 * @param {Number} newSize - Number of rows and columns in the new grid.
 */
function updateGrid(newSize) {
    // Reassign global variables used to create new grid.
    rows = newSize;
    columns = newSize;
    // Create new grid, other required variables.
    const newGrid = createGrid();
    const oldGrid = document.querySelector('.grid');
    const root = document.documentElement;
    // Reassign global variable `gridRows` used for clearing the grid.
    gridRows = Array.from(newGrid.getElementsByClassName('grid__row'));
    root.style.setProperty('--grid-size', newSize.toString());
    document.body.replaceChild(newGrid, oldGrid);
    addHoverEvent(gridRows);
}

// Inserting sketchpad inside document.
const scriptElement = document.querySelector('script');
document.body.insertBefore(gridContainer, scriptElement);

// Drawing on the sketchpad.
addHoverEvent(gridRows);

// Clearing the sketchpad.
const clearGridButton = document.querySelector('.clear-input');
clearGridButton.addEventListener('click', () => clearGrid(gridRows));

// Updating the grid-size.
const gridSizeInput = document.querySelector('.size-input');
gridSizeInput.defaultValue = rows.toString();
gridSizeInput.addEventListener('change', function() {
    // Value equals empty string if input is not expected type (numeric).
    if (gridSizeInput.value) {
        clearGrid(gridRows);
        updateGrid(gridSizeInput.value);
    }
});
