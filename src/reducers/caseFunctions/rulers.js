// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { buildGrid } from './grid';

const pixelsPerInch = 96;
const pixelsPerPoint = 72;
const pixelsPerCm = pixelsPerInch / 2.54;

const labelOffset = 2;
export const minSubUnitDistance = 10;

export function toggleShowRulers(stateCopy) {
    stateCopy.showRulers = !stateCopy.showRulers;
    return stateCopy;
}

export function setMouseTrackers(ruler, x, y) {
    ruler.mouseCoords.x = x;
    ruler.mouseCoords.y = y;

    return ruler;
}

export function setUnitType(stateCopy, action) {
    const { unitType } = action.payload;
    const { canvasWidth, canvasHeight } = stateCopy;

    stateCopy.ruler.unitType = unitType;

    switch (unitType) {
        case "in":
            stateCopy.ruler.pixelsPerUnit = pixelsPerInch;
            break;
        case "ft":
            stateCopy.ruler.pixelsPerUnit = pixelsPerInch * 12;
            break;
        case "mm":
            stateCopy.ruler.pixelsPerUnit = pixelsPerCm / 10;
            break;
        case "cm":
            stateCopy.ruler.pixelsPerUnit = pixelsPerCm;
            break;
        case "m":
            stateCopy.ruler.pixelsPerUnit = pixelsPerCm * 100;
            break;
        case "px":
            stateCopy.ruler.pixelsPerUnit = 1;
            break;
        case "pt":
            stateCopy.ruler.pixelsPerUnit = pixelsPerPoint;
            break;
        default:
            break;
    }

    var widthInUnits = canvasWidth / stateCopy.ruler.pixelsPerUnit;
    var heightInUnits = canvasHeight / stateCopy.ruler.pixelsPerUnit;

    stateCopy = setCanvasSizeHelper(stateCopy, widthInUnits, heightInUnits);

    return stateCopy;
}

export function setUnitDivisions(stateCopy, action) {
    const { scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;
    const { unitDivisions } = action.payload;

    stateCopy.ruler.unitDivisions = unitDivisions;

    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
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
    const { pixelsPerUnit } = stateCopy.ruler;

    stateCopy.canvasWidth = width * pixelsPerUnit;
    stateCopy.canvasHeight = height * pixelsPerUnit;
    stateCopy.panX = 0;
    stateCopy.panY = 0;

    stateCopy = setGridRulers(stateCopy);

    return stateCopy;
}

export function setGridRulers(stateCopy) {
    const { scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;
    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;
    return stateCopy;
}

export function updateGridRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight) {
    var subUnitBase;
    var subUnitExponent;
    var tickLengthMultiplier = 0.75;
    var scaledPixelsPerUnit = ruler.pixelsPerUnit * scale;

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

    const rulerLengthInUnits = Math.ceil((Math.max(window.innerWidth, canvasWidth) + xPanOffset) / scaledPixelsPerUnit);

    // need to account for the number of digits in the labels
    const tickQty = rulerLengthInUnits * subUnitBase;
    const minWholeUnitDistance = 10 * tickQty.toString().length;

    ruler.horizontal = buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, xPanOffset);
    ruler.vertical = buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, yPanOffset);
    var gridLines = buildGrid(ruler, scale, subUnitBase, subUnitExponent, minWholeUnitDistance, canvasWidth, canvasHeight);

    return { ruler, gridLines };
}

function buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, panOffset) {
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    var renderDivisions = true;

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
        const tickQty = rulerLengthInUnits * ticksPerUnit;
        const tickLength = ruler.width * Math.pow(tickLengthMultiplier, exponentIndex);
        const tickSpacing = scaledPixelsPerUnit / ticksPerUnit;
        var labelInterval = 1;

        if (exponentIndex === 0 && tickSpacing < minWholeUnitDistance) {
            const intervalArray = [2, 2.5, 5, 10];
            labelInterval = Math.ceil(minWholeUnitDistance / tickSpacing);
            var scalingFactor = 1;

            while (labelInterval > intervalArray[intervalArray.length - 1] * scalingFactor) {
                scalingFactor *= 10;
            }

            for (let i = 0; i < intervalArray.length; i++) {
                if (labelInterval < (intervalArray[i] * scalingFactor)) {
                    labelInterval = intervalArray[i] * scalingFactor;
                    break;
                }
            }

            if (labelInterval > 1) {
                renderDivisions = false;
                // var labelInterval2 = Math.ceil(minSubUnitDistance / tickSpacing);
                // var scalingFactor2 = 1;
                //
                // while (labelInterval2 > intervalArray[intervalArray.length - 1] * scalingFactor2) {
                //     scalingFactor2 *= 10;
                // }
                //
                // for (let i = 0; i < intervalArray.length; i++) {
                //     if (labelInterval2 < (intervalArray[i] * scalingFactor2)) {
                //         labelInterval2 = intervalArray[i] * scalingFactor2;
                //         break;
                //     }
                // }
            }
        }

        for (let i = 0; i <= tickQty; i++) {
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
                if (i % labelInterval === 0) {
                    result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
                    result.ticks.push([tickLength, tickLoc]);
                } else if (tickSpacing >= minSubUnitDistance && !renderDivisions) {
                    result.ticks.push([tickLength * 0.5, tickLoc]);
                }
                // else: do nothing
            } else if (tickSpacing >= minSubUnitDistance && renderDivisions) {
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
