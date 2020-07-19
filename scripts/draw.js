/* GLOBAL VARIABLES */
const defaultGridColor = 'rgb(255, 255, 255)';
const colorBlack = '#000';
let cellColor = '#9CE8E0';

/* HELPER FUNCTIONS */

/**
 * Draw function for normal drawing mode.
 * Change a grid-cell's background-color based on the current color setting.
 */
function normalDraw() {
    if (this.style.backgroundColor === defaultGridColor) {
        // FIX BUG: Cell animation isn't visible unless applied here.
        this.classList.add('animate-cell');
        this.style.backgroundColor = cellColor;
    }
}

/**
 * Helper function for getHSLColor() to calculate saturation value.
 * @param  {Number} min    - Minimum amongst red, green, blue values.
 * @param  {Number} max    - Maximum amongst red, green, blue values.
 * @param  {Number} valueL - Luminance value in HSL conversion.
 * @return {Number}        - Saturation value in HSL conversion.
 */
function getSaturation(min, max, valueL) {
    if (min === max) {
        return 0;
    } else if (valueL < .5) {
        return ((max - min) / (max + min));
    } else if (valueL >= .5) {
        return ((max - min) / (2 - max - min));
    }
}

/**
 * Helper function for getHSLColor() to calculate hue value.
 * @param  {Number} min    - Minimum amongst red, green, blue values.
 * @param  {Number} max    - Maximum amongst red, green, blue values.
 * @param  {Number} valueR - Red value in RGB color.
 * @param  {Number} valueG - Green value in RGB color.
 * @param  {Number} valueB - Blue value in RGB color.
 * @return {Number}        - Hue value in HSL conversion.
 */
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

/**
 * Convert a provided RGB color into HSL format.
 * @param  {String} rgbColor - RGB color in the format `rgb(num, num, num)`.
 * @return {Object}          - Array of HSL values in H, S, L order.
 */
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
 * Draw function for darken drawing mode.
 * If a grid cell's background-color is the grid's default color,
 * behave like normalDraw(),
 * else make its current color 10% darker until the cell becomes black.
 */
function darkenDraw() {
    const currCellColor = this.style.backgroundColor;
    if (currCellColor === defaultGridColor) {
        // FIX BUG: Cell animation isn't visible unless applied here.
        this.classList.add('animate-cell');
        this.style.backgroundColor = cellColor;
    } else {
        const hslArr = getHSLColor(currCellColor);
        if (hslArr[2] > 0) {
            // Subtract 10 from light value in HSL color if remains positive.
            let light = (hslArr[2] >= 10) ? (hslArr[2] - 10) : 0;
            let newColor = `hsl(${ hslArr[0] }, ${ hslArr[1] }%, ${ light }%)`;
            this.style.backgroundColor = newColor;
        } else if (hslArr[2] === 0) {
            this.style.backgroundColor = colorBlack;
        }
    }
}

/**
 * Draw function for random drawing mode.
 * Change the background-color of the grid cell being hovered to a random color.
 */
function randomDraw() {
    let hexSymbols = '0123456789ABCDEF';
    let randColor = '#';

    for (let i = 0; i < 6; i++) {
        randColor += hexSymbols.charAt(Math.floor(Math.random() * 16));
    }

    // FIX BUG: Cell animation isn't visible unless applied here.
    this.classList.add('animate-cell');
    this.style.backgroundColor = randColor;
}

/**
 * Change the global variable holding the current grid-cell background color.
 */
function updateCellColor() {
    cellColor = this.value.toUpperCase();
}

/* MAIN CODE */
// Update the current color setting to user's preference.
const colorPicker = document.querySelector('.color-input');
colorPicker.setAttribute('value', cellColor);
colorPicker.setAttribute('placeholder', cellColor);
colorPicker.addEventListener('change', updateCellColor);
// TODO: implement select() call.

/* EXPORTS */
export {normalDraw, darkenDraw, randomDraw};
export {defaultGridColor};
