// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { buildGrid } from './grid';

const pixelsPerInch = 72;
const pixelsPerPoint = 72;
const pixelsPerCm = 72 / 2;
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
    const { scale, panX, panY, gridPreferences, canvasWidthInPixels, canvasHeightInPixels } = stateCopy;
    const { unitType } = action.payload;

    stateCopy.ruler.unitType = unitType;

    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels);
    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;
    return stateCopy;
}

export function setUnitDivisions(stateCopy, action) {
    const { scale, panX, panY, gridPreferences, canvasWidthInPixels, canvasHeightInPixels } = stateCopy;
    const { unitDivisions } = action.payload;

    stateCopy.ruler.unitDivisions = unitDivisions;

    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels);
    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;
    return stateCopy;
}

export function setCanvasSize(stateCopy, action) {
    const { ruler } = stateCopy;
    const { width, height } = action.payload;

    stateCopy.canvasWidthInUnits = width;
    stateCopy.canvasHeightInUnits = height;

    var pixelsPerUnit;

    if (ruler.unitType === "in" || ruler.unitType === "ft") {
        pixelsPerUnit = pixelsPerInch;
    } else if (ruler.unitType === "px") {
        pixelsPerUnit = 1;
    } else if (ruler.unitType === "pt") {
        pixelsPerUnit = pixelsPerPoint;
    } else { // m, cm, or mm
        pixelsPerUnit = pixelsPerCm;
    }

    stateCopy.canvasWidthInPixels = width * pixelsPerUnit;
    stateCopy.canvasHeightInPixels = height * pixelsPerUnit;

    return stateCopy;
}

export function setGridRulers(stateCopy) {
    const { gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels } = stateCopy;

    const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels);
    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;
    return stateCopy;
}

export function updateGridRulers(ruler, gridPreferences, scale, panX, panY, canvasWidthInPixels, canvasHeightInPixels) {
    var pixelsPerUnit;
    var subUnitBase;
    var subUnitExponent;
    var tickLengthMultiplier = 0.75;

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    if (ruler.unitType === "in" || ruler.unitType === "ft") {
        pixelsPerUnit = pixelsPerInch * scale;
    } else if (ruler.unitType === "px") {
        pixelsPerUnit = scale;
    } else if (ruler.unitType === "pt") {
        pixelsPerUnit = pixelsPerPoint * scale;
    } else { // m, cm, or mm
        pixelsPerUnit = pixelsPerCm * scale;
    }

    if (getBaseLog(2, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 2;
    } else if (getBaseLog(10, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 10;
    } else {
        subUnitBase = ruler.unitDivisions;
        tickLengthMultiplier = 0.5;
    }

    subUnitExponent = getBaseLog(subUnitBase, ruler.unitDivisions);

    const rulerLengthInUnits = Math.ceil((Math.max(window.innerWidth, canvasWidthInPixels) + xPanOffset) / pixelsPerUnit);

    // need to account for the number of digits in the labels
    const tickQty = rulerLengthInUnits * subUnitBase;
    const minWholeUnitDistance = 10 * tickQty.toString().length;
    // ruler.pixelWidth = Math.max(minWholeUnitDistance, 30);

    ruler.top = buildRuler(ruler, pixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, xPanOffset);
    ruler.left = buildRuler(ruler, pixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, yPanOffset);
    var gridLines = buildGrid(ruler, pixelsPerUnit / scale, scale, subUnitBase, subUnitExponent, minWholeUnitDistance, canvasWidthInPixels, canvasHeightInPixels);

    return { ruler, gridLines };
}

function buildRuler(ruler, pixelsPerUnit, subUnitBase, subUnitExponent, minWholeUnitDistance, rulerLengthInUnits, tickLengthMultiplier, panOffset) {
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
        const tickQty = rulerLengthInUnits * ticksPerUnit;
        const tickLength = ruler.pixelWidth * Math.pow(tickLengthMultiplier, exponentIndex);
        const tickSpacing = pixelsPerUnit / ticksPerUnit;
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
