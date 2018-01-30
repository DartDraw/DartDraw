// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { buildGrid } from './grid';

const pixelsPerInch = 96;
const pixelsPerPoint = 72;
const pixelsPerCm = pixelsPerInch / 2.54;
const labelOffset = 2;
export const minSubUnitDistance = 10;

export function toggleShowRulers(stateCopy) {
    stateCopy.rulerPreferences.showRulers = !stateCopy.rulerPreferences.showRulers;
    return stateCopy;
}

export function mouseMove(stateCopy, action) {
    const { mouseX, mouseY } = action.payload;
    stateCopy.ruler = mouseMoveHelper(stateCopy.ruler, mouseX, mouseY);

    return stateCopy;
}

export function mouseMoveHelper(ruler, mouseX, mouseY) {
    ruler.trackers.x = mouseX;
    ruler.trackers.y = mouseY;

    return ruler;
}

export function setUnitType(stateCopy, action) {
    const { canvasWidthInPixels, canvasHeightInPixels } = stateCopy;
    const { unitType } = action.payload;

    stateCopy.ruler.unitType = unitType;

    var newWidth = canvasWidthInPixels;
    var newHeight = canvasHeightInPixels;

    switch (unitType) {
        case "in":
            newWidth = newWidth / pixelsPerInch;
            newHeight = newHeight / pixelsPerInch;
            break;
        case "ft":
            newWidth = newWidth / pixelsPerInch / 12;
            newHeight = newHeight / pixelsPerInch / 12;
            break;
        case "mm":
            newWidth = newWidth / pixelsPerCm * 10;
            newHeight = newHeight / pixelsPerCm * 10;
            break;
        case "cm":
            newWidth = newWidth / pixelsPerCm;
            newHeight = newHeight / pixelsPerCm;
            break;
        case "m":
            newWidth = newWidth / pixelsPerCm / 10;
            newHeight = newHeight / pixelsPerCm / 10;
            break;
        case "px":
            break;
        case "pt":
            newWidth = newWidth / pixelsPerPoint;
            newHeight = newHeight / pixelsPerPoint;
            break;
        default:
            break;
    }

    console.log(newWidth, newHeight);

    stateCopy = setCanvasSizeHelper(stateCopy, newWidth, newHeight);

    return stateCopy;
}

export function setUnitDivisions(stateCopy, action) {
    const { pixelsPerUnit, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels } = stateCopy;
    const { unitDivisions } = action.payload;

    stateCopy.ruler.unitDivisions = unitDivisions;

    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, pixelsPerUnit, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels);
    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;
    return stateCopy;
}

export function setCanvasSize(stateCopy, action) {
    const { width, height } = action.payload;

    stateCopy = setCanvasSizeHelper(stateCopy, width, height);

    return stateCopy;
}

function setCanvasSizeHelper(stateCopy, width, height) {
    const { ruler } = stateCopy;

    stateCopy.canvasWidthInUnits = width;
    stateCopy.canvasHeightInUnits = height;

    switch (ruler.unitType) {
        case "in":
            stateCopy.pixelsPerUnit = pixelsPerInch;
            break;
        case "ft":
            stateCopy.pixelsPerUnit = pixelsPerInch * 12;
            break;
        case "mm":
            stateCopy.pixelsPerUnit = pixelsPerCm / 10;
            break;
        case "cm":
            stateCopy.pixelsPerUnit = pixelsPerCm;
            break;
        case "m":
            stateCopy.pixelsPerUnit = pixelsPerCm * 10;
            break;
        case "px":
            stateCopy.pixelsPerUnit = 1;
            break;
        case "pt":
            stateCopy.pixelsPerUnit = pixelsPerPoint;
            break;
        default:
            break;
    }

    stateCopy.canvasWidthInPixels = width * stateCopy.pixelsPerUnit;
    stateCopy.canvasHeightInPixels = height * stateCopy.pixelsPerUnit;

    stateCopy = setGridRulers(stateCopy);

    return stateCopy;
}

export function setGridRulers(stateCopy) {
    const { pixelsPerUnit, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels } = stateCopy;
    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, pixelsPerUnit, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels);
    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;
    return stateCopy;
}

export function updateGridRulers(ruler, pixelsPerUnit, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels) {
    var subUnitBase;
    var subUnitExponent;
    var tickLengthMultiplier = 0.75;
    var scaledPixelsPerUnit = pixelsPerUnit * scale;

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    if (getBaseLog(2, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 2;
    } else if (getBaseLog(10, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 10;
    } else {
        subUnitBase = ruler.unitDivisions;
        tickLengthMultiplier = 0.5;
    }

    subUnitExponent = getBaseLog(subUnitBase, ruler.unitDivisions);

    const rulerLengthInUnits = Math.ceil((Math.max(window.innerWidth, canvasWidthInPixels) + xPanOffset) / scaledPixelsPerUnit);

    // need to account for the number of digits in the labels
    const tickQty = rulerLengthInUnits * subUnitBase;
    const minWholeUnitDistance = 10 * tickQty.toString().length;

    ruler.top = buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, xPanOffset);
    ruler.left = buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, yPanOffset);
    var gridLines = buildGrid(ruler, pixelsPerUnit, scale, subUnitBase, subUnitExponent, minWholeUnitDistance, canvasWidthInPixels, canvasHeightInPixels);

    return { ruler, gridLines };
}

function buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, panOffset) {
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
        const tickQty = rulerLengthInUnits * ticksPerUnit;
        const tickLength = ruler.rulerWidth * Math.pow(tickLengthMultiplier, exponentIndex);
        const tickSpacing = scaledPixelsPerUnit / ticksPerUnit;
        var labelRender = 1;

        if (exponentIndex === 0 && tickSpacing < minWholeUnitDistance) {
            labelRender = Math.ceil(minWholeUnitDistance / tickSpacing);
            // if (labelRender % 5 !== 0) {
            //     labelRender = labelRender + labelRender % 5;
            // } else if (labelRender % 2 !== 0) {
            //     labelRender = labelRender + labelRender % 5;
            // }
        }

        for (var i = 0; i <= tickQty; i++) {
            var tickLoc = tickSpacing * i - panOffset;

            // if tick location is off the ruler OR if it's already been rendered
            if (tickLoc < 0 || masterTickIndex.indexOf(tickLoc) !== -1) {
                continue;
            }
            // var finalTick = false;
            //
            // if (i === tickQty) {
            //     finalTick = true;
            // }

            // ADD IN FINAL TICK LATER

            masterTickIndex.push(tickLoc);

            // if is a primary tick, it needs a label
            if (exponentIndex === 0) {
                if (i % labelRender === 0) {
                    result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
                    result.ticks.push([tickLength, tickLoc]);
                }
                // else: do nothing
            } else if (tickSpacing >= minSubUnitDistance) {
                result.ticks.push([tickLength, tickLoc]);
            }
        }
    }
    return result;
}

function getBaseLog(x, y) {
    if (x === 1) {
        return 1;
    }
    return Math.log(y) / Math.log(x);
}
